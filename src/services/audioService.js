// src/services/audioService.js
//
// Placeholder audio engine. No real recordings are wired in yet (see
// content/media.json — every audio asset is flagged placeholder: true).
// This synthesizes short, distinguishable tones/noise textures in-browser
// so the app is fully usable before real audio production happens.
// Swapping to real files later means changing playAsset() to look up
// content/media.json filenames and play <audio> elements instead —
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
let masterGain = null;
function getMasterGain(ctx) {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}
function stopAllSounds() {
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

function engineRumble(ctx, t0, dur = 0.9, baseFreq = 95) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.08);
  g.gain.exponentialRampToValueAtTime(0.12, t0 + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  filter.connect(g).connect(getMasterGain(ctx));
  [baseFreq, baseFreq * 1.01, baseFreq * 0.5].forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 3.2 + i;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + dur + 0.02);
    osc.connect(filter);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  });
  filteredNoise(ctx, t0, dur, { type: "bandpass", freq: 800, Q: 0.6, gain: 0.03, attack: 0.05 });
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

const BASE_SOUND = {
  bell: (ctx, t0) => { tone(ctx, t0, 1046, 0.9, "sine", 0.16); tone(ctx, t0, 1046 * 2.4, 0.5, "sine", 0.05); },
  clock: (ctx, t0) => [0, 0.42, 0.84, 1.26].forEach((d, i) => clockTick(ctx, t0 + d, i % 2 === 0)),
  car: (ctx, t0) => engineRumble(ctx, t0, 0.9, 95),
  rain: (ctx, t0) => rainPatter(ctx, t0, 1.3),
  clap: (ctx, t0) => filteredNoise(ctx, t0, 0.09, { type: "bandpass", freq: 2200, Q: 1.2, gain: 0.28, attack: 0.002 }),
  tap: (ctx, t0) => { tone(ctx, t0, 750, 0.06, "triangle", 0.14); filteredNoise(ctx, t0, 0.02, { type: "highpass", freq: 3000, Q: 1, gain: 0.05, attack: 0.001 }); },
  drum: (ctx, t0) => { sweepTone(ctx, t0, { from: 150, to: 55, dur: 0.3, type: "sine", gain: 0.32, filterFrom: 600, filterTo: 150 }); filteredNoise(ctx, t0, 0.04, { type: "lowpass", freq: 400, Q: 1, gain: 0.08, attack: 0.002 }); },
  whisper: (ctx, t0) => filteredNoise(ctx, t0, 0.5, { type: "bandpass", freq: 1800, Q: 0.7, gain: 0.045, attack: 0.05 }),
  finger: (ctx, t0) => filteredNoise(ctx, t0, 0.03, { type: "highpass", freq: 4000, Q: 1, gain: 0.06, attack: 0.001 }),
  // Added to widen Lesson 1's vocabulary beyond bell/clock/car/rain — see
  // content/word-library.md §4. Both are mechanical/ambient sounds
  // (same reasoning as the dog→clock swap in Round 1: those synthesize
  // convincingly, animal/voice sounds don't).
  phone: (ctx, t0) => [0, 0.6].forEach((d) => { tone(ctx, t0 + d, 480, 0.35, "sine", 0.13); tone(ctx, t0 + d, 620, 0.35, "sine", 0.09); }),
  wind: (ctx, t0) => filteredNoise(ctx, t0, 1.4, { type: "lowpass", freq: 700, Q: 0.5, gain: 0.12, attack: 0.15 }),
  siren: (ctx, t0) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t0);
    osc.frequency.linearRampToValueAtTime(900, t0 + 0.5);
    osc.frequency.linearRampToValueAtTime(500, t0 + 1.0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.15, t0 + 0.05);
    g.gain.setValueAtTime(0.15, t0 + 0.95);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.0);
    osc.connect(g).connect(getMasterGain(ctx));
    osc.start(t0);
    osc.stop(t0 + 1.05);
  },
  thunder: (ctx, t0) => { filteredNoise(ctx, t0, 0.15, { type: "lowpass", freq: 300, Q: 1, gain: 0.28, attack: 0.005 }); engineRumble(ctx, t0 + 0.05, 1.2, 55); },
};

// Fixed multi-part sequences that need explicit timing (repeated hits,
// comparisons) rather than the generic "_"-joined single-hit sequencer below.
const NAMED_SEQUENCES = {
  clap_loud: (ctx, t0) => BASE_SOUND.clap(ctx, t0),
  tap_soft: (ctx, t0) => BASE_SOUND.tap(ctx, t0),
  drum_loud: (ctx, t0) => BASE_SOUND.drum(ctx, t0),
  drum_compare: (ctx, t0) => { BASE_SOUND.whisper(ctx, t0); BASE_SOUND.drum(ctx, t0 + 0.6); },
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
  window.speechSynthesis.cancel(); // avoid overlapping utterances on rapid re-taps
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.85; // slower, clearer for early readers
  utter.pitch = 1.15; // slightly higher/friendlier
  window.speechSynthesis.speak(utter);
  return true;
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
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const key = name.replace(/\.mp3$/, "");
    const t0 = ctx.currentTime + 0.02;
    if (NAMED_SEQUENCES[key]) return NAMED_SEQUENCES[key](ctx, t0);
    if (playGenericSequence(ctx, t0, key)) return;
    if (BASE_SOUND[key]) return BASE_SOUND[key](ctx, t0);
    tone(ctx, t0, 440, 0.2); // unknown asset — audible fallback rather than silence
  } catch (e) {
    // Web Audio unavailable — fail silently, app still works without sound.
  }
}

// How long each asset's audio actually takes, so a play button's UI state
// (and its disabled-while-playing lock, to prevent overlapping restarts)
// matches reality instead of a fixed guess.
export const ASSET_DURATION_MS = {
  clock: 1450, rain: 1350, car: 950, drum_slow: 1450, clap_slow: 1350, tap_slow: 1350,
  finger_slow: 1350, fast_compare: 2650, slow_compare: 2650, drum_compare: 950,
  phone: 1000, wind: 1450, siren: 1050, thunder: 1250,
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
