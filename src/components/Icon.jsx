// src/components/Icon.jsx
import React from "react";
import { theme as T } from "../theme";

export function Icon({ name, size = 40, color = T.ink }) {
  const s = { width: size, height: size, display: "block" };
  const stroke = color;
  switch (name) {
    case "bell":
      return <svg viewBox="0 0 48 48" style={s}><path d="M24 6c-2 0-3.5 1.5-3.5 3.5v1.2C15.8 12.2 13 16.5 13 22v8l-3 5h28l-3-5v-8c0-5.5-2.8-9.8-7.5-11.3V9.5C27.5 7.5 26 6 24 6z" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round"/><path d="M19 39a5 5 0 0010 0" fill="none" stroke={stroke} strokeWidth="2.4"/></svg>;
    case "clock":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="18" fill="none" stroke={stroke} strokeWidth="2.4"/><path d="M24 14v10l7 5" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="24" cy="24" r="1.8" fill={stroke}/></svg>;
    case "car":
      return <svg viewBox="0 0 48 48" style={s}><path d="M8 30v-5l4-8h20l6 8v5" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round"/><rect x="6" y="30" width="36" height="6" rx="2" fill="none" stroke={stroke} strokeWidth="2.4"/><circle cx="14" cy="36" r="3" fill="none" stroke={stroke} strokeWidth="2.2"/><circle cx="34" cy="36" r="3" fill="none" stroke={stroke} strokeWidth="2.2"/></svg>;
    case "rain":
      return <svg viewBox="0 0 48 48" style={s}><path d="M14 20a8 8 0 018-8 9 9 0 018.8 7A7 7 0 0134 33H15a7 7 0 01-1-13.9z" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round"/><path d="M16 36l-2 5M24 36l-2 5M32 36l-2 5" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "drum":
      return <svg viewBox="0 0 48 48" style={s}><ellipse cx="24" cy="16" rx="14" ry="6" fill="none" stroke={stroke} strokeWidth="2.4"/><path d="M10 16v14a14 6 0 0028 0V16" fill="none" stroke={stroke} strokeWidth="2.4"/><path d="M14 12l-4-6M34 12l4-6" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "whisper":
      return <svg viewBox="0 0 48 48" style={s}><path d="M12 34V18a6 6 0 0112 0v6a2 2 0 004 0 4 4 0 018 0" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/><path d="M8 38h6M34 38h6" stroke={stroke} strokeWidth="1.6" strokeDasharray="2 3" strokeLinecap="round"/></svg>;
    case "clap":
      return <svg viewBox="0 0 48 48" style={s}><path d="M14 30l6-14 4 1-5 14zM34 30l-6-14-4 1 5 14z" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round"/><path d="M24 12l1 5M18 34h12" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "tap":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="4" fill={stroke}/><circle cx="24" cy="24" r="10" fill="none" stroke={stroke} strokeWidth="1.6" opacity="0.5"/><circle cx="24" cy="24" r="16" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.3"/></svg>;
    case "finger":
      return <svg viewBox="0 0 48 48" style={s}><path d="M22 10v14M22 10a3 3 0 016 0v14M22 24a6 6 0 0012 0v-6a3 3 0 00-6 0" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 24v4a10 10 0 0020 0v-2" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "same":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="16" cy="24" r="8" fill="none" stroke={stroke} strokeWidth="2.2"/><circle cx="32" cy="24" r="8" fill="none" stroke={stroke} strokeWidth="2.2"/><path d="M22 24h4" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "different":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="15" cy="24" r="7" fill="none" stroke={stroke} strokeWidth="2.2"/><rect x="26" y="17" width="14" height="14" rx="3" fill="none" stroke={stroke} strokeWidth="2.2"/></svg>;
    case "fast":
      return <svg viewBox="0 0 48 48" style={s}><path d="M8 18h20M8 24h26M8 30h20" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/><path d="M36 16l6 8-6 8" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "slow":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="15" fill="none" stroke={stroke} strokeWidth="2.2"/><path d="M24 15v9l6 4" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "pattern":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="10" cy="24" r="4" fill={stroke}/><rect x="20" y="20" width="8" height="8" fill={stroke}/><circle cx="38" cy="24" r="4" fill="none" stroke={stroke} strokeWidth="2"/></svg>;
    case "loud":
      return <svg viewBox="0 0 48 48" style={s}><path d="M6 20v8h6l9 7V13l-9 7z" fill={stroke} stroke="none"/><path d="M28 16a12 12 0 010 16M33 10a20 20 0 010 28" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case "soft":
      return <svg viewBox="0 0 48 48" style={s}><path d="M10 20v8h5l7 6V14l-7 6z" fill={stroke} stroke="none"/><path d="M27 21a5 5 0 010 6" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "magnifier":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="21" cy="21" r="12" fill="none" stroke={stroke} strokeWidth="3"/><path d="M30 30l9 9" stroke={stroke} strokeWidth="3.4" strokeLinecap="round"/></svg>;
    case "star":
      return <svg viewBox="0 0 48 48" style={s}><path d="M24 6l5.5 12 13 1.4-9.8 8.8 3 12.8L24 34.6 11.3 41l3-12.8L4.5 19.4l13-1.4z" fill={color} stroke="none"/></svg>;
    case "check":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="20" fill="none" stroke={stroke} strokeWidth="2.4"/><path d="M15 25l6 6 12-14" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "lock":
      return <svg viewBox="0 0 48 48" style={s}><rect x="12" y="21" width="24" height="17" rx="3" fill="none" stroke={stroke} strokeWidth="2.4"/><path d="M17 21v-5a7 7 0 0114 0v5" fill="none" stroke={stroke} strokeWidth="2.4"/></svg>;
    case "play":
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="21" fill="none" stroke={stroke} strokeWidth="2"/><path d="M20 16l14 8-14 8z" fill={stroke}/></svg>;
    case "speaker":
      return <svg viewBox="0 0 48 48" style={s}><path d="M6 18v12h8l10 8V10L14 18z" fill={stroke} stroke="none"/><path d="M30 16a10 10 0 010 16M35 10a18 18 0 010 28" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case "speaker-mute":
      return <svg viewBox="0 0 48 48" style={s}><path d="M6 18v12h8l10 8V10L14 18z" fill={stroke} stroke="none"/><path d="M30 18l10 12M40 18L30 30" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    default:
      return <svg viewBox="0 0 48 48" style={s}><path d="M8 24c4-10 8-10 8 0s4 10 8 0 8-10 8 0 4 10 8 0" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/></svg>;
  }
}

// Module 2 (rhyming) word-picture keys — kept separate from the Module 1
// sound keys above so a shared substring can't accidentally match the
// wrong module's icon (e.g. "tap" already means the Module 1 percussive
// sound, so Module 2's -ap rhyme family deliberately uses cap/map/nap
// instead of tap).
const WORD_KEYS = [
  "cat", "hat", "mat", "bat", "can", "man", "fan", "pan", "dog", "log", "hen", "pen", "cap", "map", "nap",
  "bag", "tag", "rag", "net", "jet", "vet", "fig", "wig", "mop", "pop", "top",
  // Module 3 (Beginning Sound Detective) — the only genuinely new words;
  // /m/, /f/, /n/ all reuse Module 1/2's existing word bank above.
  "sun", "sit", "sad",
  // Module 5 (Short Vowel Explorer) — short /u/ was down to a single
  // usable word (sun) in the existing bank, which can't form a same-vowel
  // pair on its own. cup/bus fill it out to 3, matching /i/'s pool size.
  "cup", "bus",
  // Module 8 (Letter-Sound Connections) — teaches k, b, h, r, l, d, g as
  // new letters. b/h already had starting words (bat/bag/bus, hat/hen);
  // k/r/l/d/g had none — every existing word using those letters uses them
  // as an ENDING sound (fig, log, dog, bag), not a starting one.
  "kid", "run", "lip", "dad", "gum",
  // Letter Cluster 1 (s, a, t, p, i, n) — "sit", "nap", "pan" already have
  // icons above; "sip" and "pin" are new so this cluster's Read lesson has
  // enough illustrated words to draw from beyond the 4 that pre-existed.
  "sip", "pin",
  // Picture-only additions (Noto Emoji SVG files in public/img/words/, see
  // Illustration.jsx IMAGE_PICTURES) — widen the pool of readable CVC words.
  "pig", "bug", "bed", "rat", "nut", "leg", "cab", "fog", "bin", "tub", "hut",
  // Level 2 Module 9 (CVC Review) — rounds out the -ug word family.
  "jug",
  // Level 2 Module 10 (Consonant Blends) — new blend-initial words.
  "flag", "crab", "frog", "drum", "plug",
  // Level 2 Module 11 (Digraphs) — sh (initial and final) and th words.
  // No clean ch/wh picture was found (candidates were ambiguous or relied
  // on an untaught pattern); those two are covered by build/spell only.
  "ship", "shell", "fish", "thumb",
  // Level 2 Module 12 (Common Endings) — "clock" deliberately excluded:
  // it already exists as a sound-identification icon in Level 1
  // (Illustration.jsx PICTURES.clock, the hand-drawn ticking-clock sound
  // icon), and adding it here would silently replace that icon wherever
  // it's used today. "clock" is still a valid Module 12 word — it's just
  // build/spell-only, like ch/wh in Module 11. No clean -tch or -nk
  // picture was found either, so those are build/spell-only too.
  "duck", "bridge", "ring",
  // Level 2 Module 13 (Qu & Common Patterns).
  "tent", "lamp", "milk",
  // Level 2 Module 14 (Letter Cluster 5: j v w x y z). "jet", "vet" and
  // "wig" were already illustrated (Level 1 could only use them as
  // distractor pictures, since j/v/w weren't taught yet) — now valid
  // targets too. No good "yak" or "zip" picture was found (the closest
  // Noto icons were mislabeled or wrong), so y and z are build/spell-only.
  "fox",
  // Level 3 Module 19 (Silent E / CVCe) — the first Level 3 words needing
  // pictures; none of Level 1/2's CVC word bank has a silent-e shape.
  "cake", "bike", "kite", "rose", "wave",
  // Level 3 Module 20 (ai/ay). "train" must come before "rain" — the
  // substring match below would otherwise match "train" against "rain"
  // first ("train".includes("rain") is true) and show the wrong picture.
  "train", "rain", "mail", "sail", "paint",
  // Level 3 Module 21 (ee/ea).
  "tree", "bee", "sheep", "wheel", "leaf", "seal",
  // Level 3 Module 22 (oa/ow). "window" deliberately excluded — the
  // labelToIcon "direct" map below already has "wind" as an environmental-
  // sound icon key, and "window".includes("wind") would silently show
  // that icon instead of a window picture.
  "goat", "coat", "soap", "road", "snow", "bowl",
  // Level 3 Module 23 (oi/oy).
  "coin", "boy", "toy", "oyster",
  // Level 3 Module 24 (ou/ow, the /ow/ sound). "cloud" deliberately
  // excluded — labelToIcon's "direct" map already has "loud" as a Level 1
  // loud/soft icon key, and "cloud".includes("loud") would silently show
  // that icon instead of a cloud picture.
  "mouth", "cow", "owl", "house", "mouse",
  // Level 3 Module 25 (r-controlled vowels: ar/er/ir/or/ur). "car" reuses
  // the same real-world object as the existing Level 1 "car" sound icon —
  // desired reuse, not a collision, since it's genuinely the same car.
  "car", "star", "corn", "bird", "shirt", "purse",
  // Level 4 Module 29 (K or CK?).
  "sock", "book",
];

// Maps a media asset_id (from content/media.json) to an icon key. Strips
// the "say:" TTS prefix (see audioService.playAsset) before matching.
export function iconForAsset(assetId = "") {
  const n = assetId.replace(/^say:/, "").toLowerCase();
  for (const key of ["bell", "clock", "car", "rain", "drum", "whisper", "clap", "tap", "finger", "same", "different", "fast", "slow", "magnifier", "phone", "wind", "siren", "thunder", "birds", "drip", ...WORD_KEYS]) {
    if (n.includes(key)) return key;
  }
  return "pattern";
}

// Maps an answer option's label text (e.g. "Bell", "Loud") to an icon key
// so a pre-reading child can match by picture. Returns null when no
// picture makes sense (multi-sound sequence labels like "Clap-Tap-Clap").
export function labelToIcon(label = "") {
  const n = label.toLowerCase();
  const direct = { bell: "bell", clock: "clock", car: "car", rain: "rain", drum: "drum", whisper: "whisper", clap: "clap", tap: "tap", finger: "finger", same: "same", different: "different", fast: "fast", slow: "slow", loud: "loud", soft: "soft", phone: "phone", wind: "wind", siren: "siren", thunder: "thunder", birds: "birds", drip: "drip" };
  for (const key in direct) if (n.includes(key)) return direct[key];
  for (const key of WORD_KEYS) if (n.includes(key)) return key;
  return null;
}
