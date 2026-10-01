// test/level2-decodability.test.mjs
//
// Started as Level 2's own safeguard against the mistake Level 1 avoided
// by hand, now covers Level 2 AND Level 3 (same mechanism, same file, to
// avoid duplicating the whole accumulation machinery): a word must never
// require a pattern the child hasn't been taught yet. LETTERS_BY_MODULE
// lists new SINGLE letters a module adds (Level 1 gave every Level 2
// module the same base 19 until Module 14, which finally teaches
// j/v/w/x/y/z); GRAPHEMES_BY_MODULE lists the whole-grapheme tiles
// (digraphs, endings, vowel teams, r-controlled vowels...) each module
// ADDS. Both accumulate across modules. A word is decodable once every
// earlier-taught grapheme is stripped out and everything left over is a
// known single letter. Extend either map as each later module is built —
// nothing else about this test should need to change.
import test from "node:test";
import assert from "node:assert/strict";
import modules from "../content/modules.json" with { type: "json" };
import lessons from "../content/lessons.json" with { type: "json" };
import activities from "../content/activities.json" with { type: "json" };
import assessments from "../content/assessments.json" with { type: "json" };

// module_id -> new single letters that module teaches, on top of every
// letter already known from an earlier module.
const LETTERS_BY_MODULE = {
  9: "satpinmdgockbhrelfu".split(""), // Level 1's 19 letters, carried into Level 2 as the baseline
  14: ["j", "v", "w", "x", "y", "z"], // Letter Cluster 5 — completes the alphabet (q is never taught alone, only as "qu")
};

// module_id -> new whole-grapheme tiles that module teaches, on top of
// every grapheme already known from an earlier module.
const GRAPHEMES_BY_MODULE = {
  9: [], // CVC Review — no new patterns, pure review of the known 19 letters
  10: [], // Consonant Blends — two already-known letters said together, not a new grapheme
  11: ["sh", "ch", "th", "wh"], // Digraphs
  12: ["tch", "dge", "ck", "ng", "nk"], // Common Endings — longest first so "tch" isn't stripped as "ch" (already known) + "t"
  // Qu & Common Patterns — "qu" is the only new grapheme; s-blends and
  // end-blends are just pairs of already-known letters, same reasoning
  // as Module 10's blends. The "w" in a bare grapheme table would matter
  // only if it were a taught single letter, and it never is (see
  // docs/project-notes.md's known-letters note) — no s-blend or
  // end-blend word in this module's content uses it.
  13: ["qu"],
  // Level 3 — Module 19 (Silent E/CVCe) introduces no new tile-worthy
  // grapheme: every CVCe word (cake, bike...) is spelled entirely from
  // already-known single letters, and the "final e is silent" idea is a
  // word-SHAPE rule this letter-by-letter check has no reason to model.
  19: [],
  20: ["ai", "ay"], // ai/ay — the first Level 3 module that actually adds a new tile-worthy grapheme.
  21: ["ee", "ea"],
  22: ["oa", "ow"],
  23: ["oi", "oy"],
  24: ["ou"], // "ow" is already known from Module 22 — same spelling, different sound, no new grapheme string to track.
  25: ["ar", "er", "ir", "or", "ur"],
  26: [], // Alternative Spellings — recognition-only review, no new grapheme (see Level 2's Module 9 CVC Review for the same pattern).
  27: [], // Review & Assessment — cumulative review, no new grapheme.
  28: [], // C or K? — no new grapheme, c and k are both already-known single letters; this module is about which known letter to choose, not a new tile.
  29: [], // K or CK? — ck was already taught receptively in Level 2 Module 12; this module is about which known ending to choose, not a new tile.
  30: [], // G or J? — g and j are both already-known single letters; this module is about which known letter to choose, not a new tile.
  31: [], // GE or DGE? — dge was already taught receptively in Level 2 Module 12, and "ge" decomposes to already-known single letters g+e; this module is about which known ending to choose, not a new tile.
  32: [], // CH or TCH? — ch and tch were both already taught receptively in Level 2 (Module 11's digraph, Module 12's ending); this module is about which known ending to choose, not a new tile.
  33: [], // FLOSS Doubling — ff/ll/ss/zz are already in ALWAYS_ALLOWED_DOUBLES below, handled generically rather than per-module.
  34: [], // Doubling Before Suffixes — "ng" (part of every -ing word) is already known from Level 2 Module 12; no new grapheme.
  35: [], // Silent Letters — kn/wr/mb/gn are never tiled as fused 2-letter units (each letter, silent or not, is its own single-character tile, e.g. knee -> k,n,ee), so there's no new tile-worthy grapheme here.
  36: [], // Y as a Vowel — y itself is already a known letter (Level 2 Module 14); this module teaches a new ROLE for it, not a new grapheme string.
  37: [], // Plurals — s/es/ies endings are built from already-known single letters; no new grapheme tile.
  38: ["ph"], // ph for /f/ — a genuine new digraph tile (added to questionTypes.js's DIGRAPHS set too).
  39: [], // Prefixes & Suffixes — un-, re-, -ful, -less, -ly are all spelled from already-known single letters; no new grapheme tile.
  40: [], // Review & Assessment — cumulative review, no new grapheme.
  41: ["ce"], // The Many Spellings of /s/ — "ce" is a new fused ending tile (mirrors Module 31's "ge"/"dge" treatment); plain mid-word "c" for /s/ (city) uses the already-known single-letter c tile, no new grapheme needed.
  42: [], // Long-A Choices — ai/ay were already taught receptively in Level 3 Module 20; this module makes them a graded choice, no new grapheme tile.
  43: [], // Long-E Choices — ee/ea were already taught receptively in Level 3 Module 21; this module makes them a graded choice, no new grapheme tile.
  44: ["igh", "ie"], // Long-I Choices — two genuinely new graphemes, added to questionTypes.js's VOWEL_TEAMS set.
  45: [], // Long-O Choices — oa/ow were already taught receptively in Level 3 Module 22; this module makes them a graded choice, no new grapheme tile.
  46: ["ue", "ew", "oo"], // Long-U Choices — three genuinely new graphemes, added to questionTypes.js's VOWEL_TEAMS set.
  47: [], // The Three Sounds of -ed — auditory-only (the spelling is always -ed); every word used is already decodable from single known letters, no new grapheme tile needed (same reasoning as Module 34's -ing/-ed suffix tiles).
  48: [], // Change Y Before a Suffix — -er/-est/-ly/-ness/-ing suffix tiles all decompose to already-known single letters, same reasoning as Module 34/47's suffix tiles; no new grapheme.
  49: [], // More Prefixes & Suffixes — dis-/pre-/mis-/-ness/-ment all decompose to already-known single letters, same reasoning as Module 39; no new grapheme.
  50: [], // Word Families — every word family member is an ordinary already-spellable real word (act, action, teacher, builder...); no new grapheme, and this module's skill is choosing the right word for a sentence, not decoding a new pattern.
  51: [], // Review & Assessment — cumulative review, no new grapheme.
};

// Every module from Level 2 on (module_id 9+) participates in this same
// accumulation, Level 2 and Level 3 alike — module_id is globally unique
// across levels, so a single sorted list keeps every later level's
// modules correctly building on Level 2's full known set without any
// level_id branching here.
const trackedModules = modules.filter((m) => m.module_id >= 9).sort((a, b) => a.module_id - b.module_id);

function graphemesKnownThrough(moduleId) {
  const known = new Set();
  for (const m of trackedModules) {
    if (m.module_id > moduleId) break;
    for (const g of GRAPHEMES_BY_MODULE[m.module_id] || []) known.add(g);
  }
  return known;
}

function lettersKnownThrough(moduleId) {
  const known = new Set();
  for (const m of trackedModules) {
    if (m.module_id > moduleId) break;
    for (const l of LETTERS_BY_MODULE[m.module_id] || []) known.add(l);
  }
  return known;
}

// Doubled-letter endings (ff, ll, ss, zz) are taught receptively inside
// Module 9 itself (see docs/plans/level-2.md decision #3) — a spelling
// CHOICE between them and a single letter is Level 4 material, but simply
// reading/building a word that already contains one is fine from Module 9
// on, so they're allowed everywhere, not tracked per-module like a real
// new grapheme.
const ALWAYS_ALLOWED_DOUBLES = ["ff", "ll", "ss", "zz"];

// Checks one WORD (no spaces) against what's taught by moduleId.
function isDecodable(word, moduleId) {
  const graphemes = [...graphemesKnownThrough(moduleId), ...ALWAYS_ALLOWED_DOUBLES].sort((a, b) => b.length - a.length);
  const letters = lettersKnownThrough(moduleId);
  let rest = word.toLowerCase();
  for (const g of graphemes) rest = rest.split(g).join("");
  return [...rest].every((ch) => letters.has(ch));
}

// A Level 2 field can now hold a whole SENTENCE (Module 16's
// correct_answer/written_sentence, e.g. "The cat sat.") rather than one
// word — split on whitespace and strip each word's own punctuation
// before checking, since spaces/periods/question marks were never
// "taught letters" and aren't meant to be.
function wordsIn(text) {
  return text.split(/\s+/).map((w) => w.replace(/[^a-zA-Z]/g, "")).filter(Boolean);
}

test("every Level 2+ word only uses letters/patterns already taught by its own module", () => {
  const lessonModule = Object.fromEntries(lessons.filter((l) => l.module_id >= 9).map((l) => [l.lesson_id, l.module_id]));
  const violations = [];
  for (const it of [...activities, ...assessments]) {
    const moduleId = lessonModule[it.lesson_id];
    if (moduleId === undefined) continue; // Level 1 content — not in scope for this test
    const id = it.activity_id || it.assessment_id;
    const fields = [it.correct_answer, it.written_word, it.written_sentence].filter(Boolean);
    const words = fields.flatMap(wordsIn);
    for (const w of words) {
      if (!isDecodable(w, moduleId)) violations.push(`${id} (module ${moduleId}): "${w}" uses an untaught pattern`);
    }
  }
  assert.deepEqual(violations, [], violations.join("\n"));
});
