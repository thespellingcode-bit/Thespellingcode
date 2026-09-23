// src/services/audioService.js
//
// Mostly a placeholder audio engine — this synthesizes short,
// distinguishable tones/noise textures in-browser so the app is fully
// usable before real audio production happens. car, thunder, and wind are
// the first exceptions: real user-supplied recordings (see
// REAL_AUDIO_FILES below), with synthesis kept as an automatic fallback if
// a recording fails to play on some browser/codec combination. Everything
// else in content/media.json is still flagged placeholder: true. Adding
// more real recordings later means adding entries to REAL_AUDIO_FILES —
// nothing calling playAsset(name) needs to change.

let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Every synthesized sound routes through this single master gain node
// instead of ctx.destination directly. Repeated/rapid play taps — across
// the same button or across question transitions — previously left old
// oscillators/noise buffers scheduled to keep running after a new sound
// started, so several overlapping "generations" of sound could stack up
// on the same output at once. Enough of that piling up made everything
// progressively quieter (the browser's own limiter squashing the combined
// signal) and eventually inaudible. stopAllSounds() cuts every previous
// generation's connection to the speakers the instant a new sound starts,
// so at most one generation is ever actually audible — the orphaned nodes
// keep running silently in memory and get garbage-collected once their
// already-scheduled stop() time arrives.
// A compressor sits between the master gain and the speakers so gains
// throughout this file can be pushed higher (fixing several "too quiet"
// reports) without the summed signal clipping/distorting — it gently
// squashes peaks instead of letting them clip. One persistent node, shared
// by every generation of masterGain.
let compressor = null;
function getCompressor(ctx) {
  if (!compressor) {
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-16, ctx.currentTime);
    compressor.knee.setValueAtTime(22, ctx.currentTime);
    compressor.ratio.setValueAtTime(10, ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    compressor.release.setValueAtTime(0.18, ctx.currentTime);
    compressor.connect(ctx.destination);
  }
  return compressor;
}

// Read once per playback generation when the first node connects — lets a
// single call scale everything it schedules without touching each
// BASE_SOUND function's own internal gain values. Used by playAttenuated()
// below for the Loud/Soft lesson's genuinely-scaled sound variants.
let gainMultiplier = 1;

let masterGain = null;
function getMasterGain(ctx) {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = gainMultiplier;
    masterGain.connect(getCompressor(ctx));
  }
  return masterGain;
}
function stopAllSounds() {
  stopRealAudio();
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;
  const oldGain = masterGain;
  try {
    oldGain.gain.cancelScheduledValues(now);
    oldGain.gain.setValueAtTime(oldGain.gain.value, now);
    oldGain.gain.linearRampToValueAtTime(0.0001, now + 0.02); // avoid an audible click on cutoff
  } catch (e) {
    // ignore — worst case the old generation is silenced by disconnect() below instead
  }
  masterGain = null; // next getMasterGain() call builds a fresh one for the new sound
  setTimeout(() => {
    try { oldGain.disconnect(); } catch (e) {}
  }, 50);
}

function tone(ctx, t0, freq, dur, type = "sine", gain = 0.18) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(getMasterGain(ctx));
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function filteredNoise(ctx, t0, dur, { type = "bandpass", freq = 2000, Q = 1, gain = 0.15, attack = 0.004 } = {}) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = Q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(getMasterGain(ctx));
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

function sweepTone(ctx, t0, { from = 300, to = 140, dur = 0.14, type = "sawtooth", gain = 0.22, filterFrom = 1200, filterTo = 400 } = {}) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 40), t0 + dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterFrom, t0);
  filter.frequency.exponentialRampToValueAtTime(Math.max(filterTo, 80), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(filter).connect(g).connect(getMasterGain(ctx));
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// Car engine — rebuilt from scratch (the previous version read as a
// generic buzzy drone, not a car). Real engine character comes from
// three things this now has: a quick rev-up at onset (idle → gunned →
// settle, not a static tone), a fast amplitude "putter" (cylinder-firing
// rate) riding on top of the tone instead of just a slow pitch wobble,
// and a genuinely broadband noise layer for road/exhaust grit.
function carEngine(ctx, t0, dur = 1.0) {
  const master = getMasterGain(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 750;
  filter.Q.value = 2.5; // resonant — gives a "growl" instead of a flat hum

  // Amplitude putter: a fast oscillator modulating a gain node's level
  // via its own output (through a small gain), summed with a steady
  // DC-ish offset from a very slow second "hold" gain ramp — this is
  // what makes a sustained tone read as an idling engine instead of a
  // held note.
  const putterRate = ctx.createOscillator();
  const putterDepth = ctx.createGain();
  putterRate.frequency.value = 24;
  putterDepth.gain.value = 0.06;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, t0);
  envelope.gain.exponentialRampToValueAtTime(0.22, t0 + 0.07);
  envelope.gain.exponentialRampToValueAtTime(0.15, t0 + dur * 0.6);
  envelope.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  putterRate.connect(putterDepth).connect(envelope.gain);
  putterRate.start(t0);
  putterRate.stop(t0 + dur + 0.02);

  filter.connect(envelope).connect(master);

  // Two detuned sawtooths with a shared "vroom" pitch rev — quick rise
  // then settle, rather than a static frequency.
  [1, 1.014].forEach((detune) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55 * detune, t0);
    osc.frequency.exponentialRampToValueAtTime(125 * detune, t0 + 0.12);
    osc.frequency.exponentialRampToValueAtTime(82 * detune, t0 + dur);
    osc.connect(filter);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  });

  // Road/exhaust texture — broader and louder than the old single thin
  // noise layer, so the engine has some grit under the tone.
  filteredNoise(ctx, t0, dur, { type: "bandpass", freq: 450, Q: 0.5, gain: 0.06, attack: 0.03 });
  filteredNoise(ctx, t0, Math.min(0.35, dur), { type: "highpass", freq: 2200, Q: 0.7, gain: 0.025, attack: 0.01 });
}

// Thunder's own texture. The first version used heavily-lowpassed noise
// for the rumble, which was the actual audibility bug: a lowpass filter
// at 120-250Hz on white noise discards almost all of the signal's energy
// (white noise spreads its energy across the whole spectrum, so cutting
// everything above ~150Hz throws most of it away) — it wasn't quiet, it
// was structurally near-silent. Real low-frequency energy needs an
// oscillator, not filtered noise. This uses low sine oscillators with a
// falling pitch per hit (the actual "boom" shape) for the audible body,
// plus a touch of noise for grit — irregular random timing keeps it
// distinct from car's steady, continuous idle.
function thunderRumble(ctx, t0, dur = 1.1) {
  const hits = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < hits; i++) {
    const dt = (i / hits) * dur + Math.random() * 0.1;
    const hitDur = 0.28 + Math.random() * 0.25;
    const freq = 42 + Math.random() * 26;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t0 + dt);
    osc.frequency.exponentialRampToValueAtTime(Math.max(freq * 0.55, 20), t0 + dt + hitDur);
    g.gain.setValueAtTime(0.0001, t0 + dt);
    g.gain.exponentialRampToValueAtTime(0.36 + Math.random() * 0.1, t0 + dt + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + hitDur);
    osc.connect(g).connect(getMasterGain(ctx));
    osc.start(t0 + dt);
    osc.stop(t0 + dt + hitDur + 0.03);
    filteredNoise(ctx, t0 + dt, hitDur, { type: "bandpass", freq: 180, Q: 0.7, gain: 0.09, attack: 0.02 });
  }
}

function rainPatter(ctx, t0, dur = 1.3) {
  const drops = Math.floor(dur * 22);
  for (let i = 0; i < drops; i++) {
    const dt = Math.random() * dur;
    const freq = 2500 + Math.random() * 3500;
    filteredNoise(ctx, t0 + dt, 0.03 + Math.random() * 0.02, { type: "bandpass", freq, Q: 2.5, gain: 0.05 + Math.random() * 0.04, attack: 0.002 });
  }
}

function clockTick(ctx, t0, high) {
  if (high) {
    filteredNoise(ctx, t0, 0.012, { type: "highpass", freq: 4000, Q: 1, gain: 0.15, attack: 0.001 });
    tone(ctx, t0, 1800, 0.02, "square", 0.05);
  } else {
    filteredNoise(ctx, t0, 0.014, { type: "bandpass", freq: 1100, Q: 1.5, gain: 0.13, attack: 0.001 });
    tone(ctx, t0, 850, 0.025, "square", 0.04);
  }
}

// Gain pass: raised across the board (roughly +30-40%) now that the
// compressor above makes headroom safe — user feedback said "some sounds
// are not audible at all... make sure volume is up to the mark on the
// highest note of my phone." whisper is the one exception left quieter on
// purpose (it's used specifically as the "soft" half of loud/soft
// comparisons) but still raised off the near-silent floor.
const BASE_SOUND = {
  bell: (ctx, t0) => { tone(ctx, t0, 1046, 0.9, "sine", 0.22); tone(ctx, t0, 1046 * 2.4, 0.5, "sine", 0.07); },
  clock: (ctx, t0) => [0, 0.42, 0.84, 1.26].forEach((d, i) => clockTick(ctx, t0 + d, i % 2 === 0)),
  car: (ctx, t0) => carEngine(ctx, t0, 1.0),
  rain: (ctx, t0) => rainPatter(ctx, t0, 1.3),
  clap: (ctx, t0) => filteredNoise(ctx, t0, 0.09, { type: "bandpass", freq: 2200, Q: 1.2, gain: 0.34, attack: 0.002 }),
  // More gain/body than before — user feedback called this out as
  // "vague, almost inaudible" alongside finger below.
  tap: (ctx, t0) => { tone(ctx, t0, 800, 0.09, "triangle", 0.27); filteredNoise(ctx, t0, 0.035, { type: "highpass", freq: 2800, Q: 1, gain: 0.14, attack: 0.001 }); },
  // Added a sharp noise "click" right at onset for a punchy attack — the
  // sweepTone body was fine but the soft attack made it read as vague.
  // Gains raised again specifically for the loud/soft contrast with violin
  // below: the shared compressor (see getCompressor above) has a -16dB
  // threshold and 10:1 ratio, which — confirmed by offline-rendering both
  // sounds and measuring actual post-compression RMS — was squashing
  // drum's peak down to almost violin's level (1.44x RMS ratio, not
  // perceptible as "loud vs soft"). Pushing drum's pre-compression peak
  // much higher means it still emerges clearly above the threshold after
  // compression, while violin (below) stays under the threshold entirely
  // and passes through uncompressed. Measured fix: ~5x RMS ratio.
  drum: (ctx, t0) => { filteredNoise(ctx, t0, 0.02, { type: "lowpass", freq: 900, Q: 1, gain: 0.4, attack: 0.001 }); sweepTone(ctx, t0, { from: 160, to: 50, dur: 0.35, type: "sine", gain: 0.75, filterFrom: 700, filterTo: 150 }); filteredNoise(ctx, t0, 0.05, { type: "lowpass", freq: 400, Q: 1, gain: 0.22, attack: 0.002 }); },
  // Added as the "loud vs soft" pairing's real-instrument half (with
  // drum) — user feedback: same-sound-scaled-by-gain (drum_loud vs
  // drum_soft) kept reading as "almost inaudible" despite repeated gain
  // passes, because a synthesized quiet copy of a loud sound is just a
  // quiet, thin-sounding synth tone. A genuinely different, gently
  // sustained tone (soft bowed-string character: sawtooth + vibrato +
  // lowpass, slow attack/release, no percussive click) reads as
  // "soft" by its own nature rather than by being turned down.
  violin: (ctx, t0) => {
    const dur = 0.7;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, t0);
    vibrato.type = "sine";
    vibrato.frequency.value = 5.5;
    vibratoGain.gain.value = 6;
    vibrato.connect(vibratoGain).connect(osc.frequency);
    vibrato.start(t0);
    vibrato.stop(t0 + dur + 0.02);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;

    // Kept deliberately below the compressor's -16dB threshold (~0.16
    // linear) so violin passes through uncompressed — the whole point of
    // the drum/violin pairing is a genuinely perceptible gap, and pushing
    // violin louder would only invite the compressor to squash drum
    // toward it again (see drum's comment above).
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.1);
    g.gain.setValueAtTime(0.05, t0 + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(filter).connect(g).connect(getMasterGain(ctx));
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  },
  whisper: (ctx, t0) => filteredNoise(ctx, t0, 0.5, { type: "bandpass", freq: 1800, Q: 0.7, gain: 0.075, attack: 0.05 }),
  // The weakest sound in the whole set before this — 30ms at gain 0.06
  // is nearly silent by construction. More than doubled the gain, added
  // a soft high tick tone alongside the noise so there's an actual pitch
  // to latch onto, not just a faint hiss.
  finger: (ctx, t0) => { tone(ctx, t0, 2200, 0.05, "sine", 0.14); filteredNoise(ctx, t0, 0.05, { type: "highpass", freq: 3500, Q: 1, gain: 0.19, attack: 0.001 }); },
  // Added to widen Lesson 1's vocabulary beyond bell/clock/car/rain — see
  // content/word-library.md §4. Both are mechanical/ambient sounds
  // (same reasoning as the dog→clock swap in Round 1: those synthesize
  // convincingly, animal/voice sounds don't).
  // Rebuilt: two sustained sine tones read as a plain beep, not a
  // ring. Real electronic phone rings warble — 4 quick square-wave
  // pulses per ring (square gives harmonics a sine can't, closer to an
  // actual ringer) gives that "brrring" texture instead of a flat tone.
  phone: (ctx, t0) => {
    [0, 0.55].forEach((ringStart) => {
      [0, 0.1, 0.2, 0.3].forEach((pulse) => {
        tone(ctx, t0 + ringStart + pulse, 1000, 0.09, "square", 0.13);
        tone(ctx, t0 + ringStart + pulse, 1480, 0.09, "square", 0.08);
      });
    });
  },
  // Rebuilt: the old version was pure lowpassed noise with a slow 150ms
  // attack and gain 0.12 — the same structural bug thunder had (quiet by
  // construction, no defined texture to latch onto). A real oscillator
  // "howl" underneath the noise gives wind a pitch to hear, not just a
  // faint hiss, and gains are much higher throughout.
  wind: (ctx, t0) => {
    const dur = 1.4;
    const howl = ctx.createOscillator();
    const howlGain = ctx.createGain();
    howl.type = "sine";
    howl.frequency.setValueAtTime(480, t0);
    howl.frequency.linearRampToValueAtTime(720, t0 + dur * 0.4);
    howl.frequency.linearRampToValueAtTime(420, t0 + dur);
    howlGain.gain.setValueAtTime(0.0001, t0);
    howlGain.gain.exponentialRampToValueAtTime(0.2, t0 + dur * 0.3);
    howlGain.gain.exponentialRampToValueAtTime(0.08, t0 + dur * 0.7);
    howlGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    howl.connect(howlGain).connect(getMasterGain(ctx));
    howl.start(t0);
    howl.stop(t0 + dur + 0.02);
    filteredNoise(ctx, t0, dur, { type: "lowpass", freq: 900, Q: 0.6, gain: 0.28, attack: 0.06 });
    filteredNoise(ctx, t0 + dur * 0.15, dur * 0.6, { type: "bandpass", freq: 1500, Q: 0.8, gain: 0.11, attack: 0.05 });
  },
  siren: (ctx, t0) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t0);
    osc.frequency.linearRampToValueAtTime(900, t0 + 0.5);
    osc.frequency.linearRampToValueAtTime(500, t0 + 1.0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.21, t0 + 0.05);
    g.gain.setValueAtTime(0.21, t0 + 0.95);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.0);
    osc.connect(g).connect(getMasterGain(ctx));
    osc.start(t0);
    osc.stop(t0 + 1.05);
  },
  thunder: (ctx, t0) => { filteredNoise(ctx, t0, 0.12, { type: "lowpass", freq: 250, Q: 1.2, gain: 0.4, attack: 0.003 }); thunderRumble(ctx, t0 + 0.08, 1.1); },
};

// Fixed multi-part sequences that need explicit timing (repeated hits,
// comparisons) rather than the generic "_"-joined single-hit sequencer below.
// Genuinely scaled Loud/Soft variants — the "_loud"/"_soft" suffix used to
// be a same-volume alias (tap_soft played identically to plain tap), which
// was the real root cause of "hard to tell loud from soft": the judgment
// relied entirely on each raw sound's own tuned gain (tuned for general
// audibility elsewhere, not for preserving this contrast), and that gap
// only got narrower as sounds got louder overall in an earlier pass.
// gainMultiplier is read once when the first node for this sound connects
// to the master gain (see getMasterGain above), so this reliably scales
// the WHOLE sound regardless of its own internal gain values.
function playAttenuated(ctx, t0, fn, multiplier) {
  gainMultiplier = multiplier;
  fn(ctx, t0);
  gainMultiplier = 1;
}

const NAMED_SEQUENCES = {
  clap_loud: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.clap, 1.3),
  clap_soft: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.clap, 0.35),
  tap_loud: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.tap, 1.3),
  tap_soft: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.tap, 0.35),
  drum_loud: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.drum, 1.3),
  drum_soft: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.drum, 0.35),
  finger_loud: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.finger, 1.3),
  finger_soft: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.finger, 0.35),
  bell_loud: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.bell, 1.3),
  bell_soft: (ctx, t0) => playAttenuated(ctx, t0, BASE_SOUND.bell, 0.35),
  drum_compare: (ctx, t0) => { BASE_SOUND.whisper(ctx, t0); BASE_SOUND.drum(ctx, t0 + 0.6); },
  violin_drum_compare: (ctx, t0) => { BASE_SOUND.violin(ctx, t0); BASE_SOUND.drum(ctx, t0 + 0.85); },
  clap_fast: (ctx, t0) => [0, 0.15, 0.3].forEach((d) => BASE_SOUND.clap(ctx, t0 + d)),
  clap_slow: (ctx, t0) => [0, 0.55, 1.1].forEach((d) => BASE_SOUND.clap(ctx, t0 + d)),
  tap_fast: (ctx, t0) => [0, 0.15, 0.3].forEach((d) => BASE_SOUND.tap(ctx, t0 + d)),
  tap_slow: (ctx, t0) => [0, 0.55, 1.1].forEach((d) => BASE_SOUND.tap(ctx, t0 + d)),
  finger_fast: (ctx, t0) => [0, 0.15, 0.3].forEach((d) => BASE_SOUND.finger(ctx, t0 + d)),
  finger_slow: (ctx, t0) => [0, 0.55, 1.1].forEach((d) => BASE_SOUND.finger(ctx, t0 + d)),
  drum_fast: (ctx, t0) => [0, 0.18, 0.36].forEach((d) => BASE_SOUND.drum(ctx, t0 + d)),
  drum_slow: (ctx, t0) => [0, 0.6, 1.2].forEach((d) => BASE_SOUND.drum(ctx, t0 + d)),
  fast_compare: (ctx, t0) => { [0, 0.13, 0.26].forEach((d) => BASE_SOUND.tap(ctx, t0 + d)); [0, 0.6, 1.2].forEach((d) => BASE_SOUND.tap(ctx, t0 + 1.2 + d)); },
  slow_compare: (ctx, t0) => { [0, 0.13, 0.26].forEach((d) => BASE_SOUND.tap(ctx, t0 + d)); [0, 0.6, 1.2].forEach((d) => BASE_SOUND.tap(ctx, t0 + 1.2 + d)); },
  // Distinct 2-sound "which order" sequences for the new sound-memory
  // assessment items (deliberately different timing from the generic
  // fallback below so the two orders are easy to tell apart by ear).
  finger_tap_seq: (ctx, t0) => { BASE_SOUND.finger(ctx, t0); BASE_SOUND.tap(ctx, t0 + 0.4); },
  tap_finger_seq: (ctx, t0) => { BASE_SOUND.tap(ctx, t0); BASE_SOUND.finger(ctx, t0 + 0.4); },
};

// Generic fallback: any "_"-joined list of known single-hit sound names
// (not covered by NAMED_SEQUENCES above) is played back-to-back in order.
// This is what lets new sound-memory/same-different assessment items
// (e.g. "clap_finger_clap", "finger_finger") work with zero new code —
// only new content-data entries were needed for those.
function playGenericSequence(ctx, t0, key) {
  const parts = key.split("_").filter((p) => BASE_SOUND[p]);
  if (parts.length < 2) return false;
  parts.forEach((p, i) => BASE_SOUND[p](ctx, t0 + i * 0.45));
  return true;
}

// Spoken-word audio for Module 2 (rhyming) and beyond — the oscillator/
// noise synthesis above can make environmental sounds convincingly but
// can't say a real word. Content marks a spoken-word asset with a
// "say:" prefix (e.g. "say:cat"); this routes to the browser's built-in
// Web Speech API instead of synthesis. Same placeholder-quality caveat
// as the rest of the audio here — real recordings should replace this
// before public launch — but it actually says the word, unlike any
// oscillator trick.
function speakWord(word) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const synth = window.speechSynthesis;
  const doSpeak = () => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.85; // slower, clearer for early readers
    utter.pitch = 1.15; // slightly higher/friendlier
    synth.speak(utter);
  };
  // Chrome has a well-known bug where calling cancel() immediately
  // followed by speak() in the same tick can silently drop the new
  // utterance — the previous version did this unconditionally on every
  // tap, which is the likely cause of rhyme-word audio sometimes not
  // playing at all. Only cancel when something is actually in-flight,
  // and give the cancel a tick to actually settle before speaking again.
  // Also defensively resume() in case the queue is stuck paused from a
  // previous navigation/tab-switch (another known Chrome quirk).
  synth.resume();
  if (synth.speaking || synth.pending) {
    synth.cancel();
    setTimeout(doSpeak, 50);
  } else {
    doSpeak();
  }
  return true;
}

// Public entry point for reading arbitrary text aloud (narration sentences,
// question prompts) — not just single content words. Reuses speakWord's
// same Chrome-race and resume() handling; the name only ever mattered for
// callers, the implementation already worked for full sentences.
export function speak(text) {
  try {
    return speakWord(text);
  } catch (e) {
    return false;
  }
}

// TTS-friendly approximations of each letter's SOUND, not its NAME — the
// same problem flagged elsewhere in this file (bare "n" gets spoken as
// "en") applies here, just solved differently: instead of staying silent,
// feed the browser's TTS a short nonsense syllable close to the phoneme
// ("nnn" instead of "en", "puh" instead of "pee"). Real recordings would
// do this properly; until then this is a genuine decoding demonstration
// instead of no audio at all, which is what "Read the Words" had before —
// reported directly as "not helping in learning anything".
const PHONEME_APPROX = {
  a: "ah", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fff", g: "guh", h: "huh",
  i: "ih", j: "juh", k: "kuh", l: "lll", m: "mmm", n: "nnn", o: "aw", p: "puh",
  q: "kwuh", r: "ruh", s: "sss", t: "tuh", u: "uh", v: "vvv", w: "wuh", x: "ks",
  y: "yuh", z: "zzz",
};

// Sounds out a word letter-by-letter (each letter's phoneme approximation,
// not its name) and then speaks the whole word blended — the actual
// decode-then-blend sequence real phonics instruction uses, e.g. for
// "nap": nnn - ah - puh - nap. Queues every utterance via the Web Speech
// API's own queue (speak() without a cancel() in between plays them in
// order) instead of speakWord's cancel-first path, which would just
// interrupt each phoneme as the next one starts.
export function spellOutWord(word) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const synth = window.speechSynthesis;
  try {
    const letters = word.toLowerCase().replace(/[^a-z]/g, "").split("");
    const makeUtter = (text, rate) => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = 1.15;
      return u;
    };
    const queueAndSpeak = () => {
      letters.forEach((l) => synth.speak(makeUtter(PHONEME_APPROX[l] || l, 0.7)));
      synth.speak(makeUtter(word, 0.8));
    };
    synth.resume();
    // Same Chrome cancel-then-speak race speakWord guards against — give
    // the cancel a tick to actually settle before queuing the sequence.
    synth.cancel();
    setTimeout(queueAndSpeak, 50);
    return true;
  } catch (e) {
    return false;
  }
}

// Real recordings — supplied by the user (car, thunder, wind) — replace
// the synthesized placeholder for just these three sounds. Served from
// public/audio/ (Vite serves public/ at the site root). Everything else
// still uses synthesis until more recordings exist.
const REAL_AUDIO_FILES = {
  car: "/audio/car.aac",
  thunder: "/audio/thunder.aac",
  wind: "/audio/wind.aac",
};
const realAudioCache = {};
function getRealAudio(key) {
  if (!realAudioCache[key]) {
    const el = new Audio(REAL_AUDIO_FILES[key]);
    el.preload = "auto";
    // Some browsers fire a media error instead of rejecting play() when the
    // codec isn't supported — catch that path too, only if this is still
    // the sound actually being played (not a stale earlier attempt).
    el.addEventListener("error", () => {
      if (activeRealAudio === el) playSynthesized(key);
    });
    realAudioCache[key] = el;
  }
  return realAudioCache[key];
}
let activeRealAudio = null;
function stopRealAudio() {
  if (activeRealAudio) {
    try { activeRealAudio.pause(); activeRealAudio.currentTime = 0; } catch (e) {}
    activeRealAudio = null;
  }
}

function playSynthesized(name) {
  try {
    const ctx = getCtx();
    const playNow = () => {
      const key = name.replace(/\.mp3$/, "");
      const t0 = ctx.currentTime + 0.02;
      if (NAMED_SEQUENCES[key]) return NAMED_SEQUENCES[key](ctx, t0);
      if (playGenericSequence(ctx, t0, key)) return;
      if (BASE_SOUND[key]) return BASE_SOUND[key](ctx, t0);
      tone(ctx, t0, 440, 0.2); // unknown asset — audible fallback rather than silence
    };
    // resume() is async — scheduling sound before it actually finishes
    // (previously fire-and-forget) could clip or silence the very first
    // play on a fresh page load. Wait for it before scheduling anything.
    if (ctx.state === "suspended") {
      ctx.resume().then(playNow).catch(() => {});
    } else {
      playNow();
    }
  } catch (e) {
    // Web Audio unavailable — fail silently, app still works without sound.
  }
}

export function playAsset(name) {
  stopAllSounds(); // silence whatever's still tailing off from a previous play, first
  if (name.startsWith("say:")) {
    try {
      speakWord(name.slice(4));
    } catch (e) {
      // Web Speech unavailable — fail silently, app still works without sound.
    }
    return;
  }
  const key = name.replace(/\.mp3$/, "");
  if (REAL_AUDIO_FILES[key]) {
    const el = getRealAudio(key);
    el.currentTime = 0;
    activeRealAudio = el;
    const playPromise = el.play();
    // A real file can fail to play on some browser/codec combination even
    // though it loaded fine elsewhere — fall back to the synthesized
    // version rather than going silent.
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => playSynthesized(key));
    }
    return;
  }
  playSynthesized(name);
}

// How long each asset's audio actually takes, so a play button's UI state
// (and its disabled-while-playing lock, to prevent overlapping restarts)
// matches reality instead of a fixed guess.
export const ASSET_DURATION_MS = {
  clock: 1450, rain: 1350, car: 1050, drum_slow: 1450, clap_slow: 1350, tap_slow: 1350,
  finger_slow: 1350, fast_compare: 2650, slow_compare: 2650, drum_compare: 950, violin: 750, violin_drum_compare: 1200,
  phone: 1000, wind: 1450, siren: 1050, thunder: 1250,
  bell_loud: 950, bell_soft: 950,
};
export function assetDurationMs(assetName) {
  if (assetName.startsWith("say:")) {
    // Scales with word count so multi-word "odd one out" phrases
    // (e.g. "say:cat, hat, dog") keep the play button's playing/disabled
    // state visible for as long as the phrase actually takes to speak.
    const wordCount = assetName.slice(4).split(",").length;
    return 900 + (wordCount - 1) * 750;
  }
  return ASSET_DURATION_MS[assetName] || 700;
}

// What sound an answer OPTION itself should play when tapped — distinct
// from the central prompt audio. Rhyme words say the word, Module 1's
// environmental/percussive sound names play the identity sound, Sound
// Memory's "Clap-Tap"-style labels play that sequence. Everything else
// (comparison judgments like "Same"/"Loud"/"Fast", or any future label
// without a content sound) falls back to speaking the label itself — a
// pre-reader can't read the text, so every option needs to produce some
// audio when tapped, never silence.
const IDENTITY_SOUND_WORDS = new Set([
  "bell", "clock", "car", "rain", "phone", "wind", "siren", "thunder", "drum", "whisper", "clap", "tap", "finger", "violin",
]);
export function soundForOption(question, opt) {
  const key = opt.toLowerCase();
  // A bare single letter (Module 8's letter-tile options) has no sound we
  // can correctly produce in isolation — browser TTS would speak its
  // NAME ("em"), not its SOUND ("mmm"), which is exactly the mistake this
  // app avoids everywhere else (see word-library.md §5). Silence on tap is
  // more honest than a wrong sound; the letter is meant to be recognized
  // visually here, not by ear.
  if (key.length === 1) return null;
  if (question.type === "rhyme_match") return `say:${key}`;
  if (IDENTITY_SOUND_WORDS.has(key)) return key;
  if (question.type === "sound_memory") return key.replace(/-/g, "_");
  // Comparison judgments (Same/Loud/Fast...) have no content sound of their
  // own, but a pre-reader still can't read the label — speak it instead of
  // leaving the tap silent.
  return `say:${key}`;
}

// UI feedback sounds (correct/incorrect/celebrate) — separate from the
// question-content sounds above. Built from the same synthesis
// primitives so no new audio files are needed.
const SFX = {
  correct: (ctx, t0) => [0, 0.09, 0.18].forEach((d, i) => tone(ctx, t0 + d, [880, 1108, 1318][i], 0.16, "sine", 0.14)),
  incorrect: (ctx, t0) => { tone(ctx, t0, 330, 0.16, "sine", 0.08); tone(ctx, t0 + 0.1, 262, 0.18, "sine", 0.07); },
  celebrate: (ctx, t0) =>
    [0, 0.1, 0.2, 0.32].forEach((d, i) => tone(ctx, t0 + d, [660, 880, 1108, 1318][i], 0.28, "triangle", 0.16)),
};

export function playSfx(kind) {
  stopAllSounds();
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const fn = SFX[kind];
    if (fn) fn(ctx, ctx.currentTime + 0.01);
  } catch (e) {
    // Web Audio unavailable — fail silently, app still works without sound.
  }
}
