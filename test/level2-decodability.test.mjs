// test/level2-decodability.test.mjs
//
// Level 2's own safeguard against the mistake Level 1 avoided by hand:
// a word must never require a pattern the child hasn't been taught yet.
// LETTERS_BY_MODULE lists new SINGLE letters a module adds (Level 1 gave
// every Level 2 module the same base 19 until Module 14, which finally
// teaches j/v/w/x/y/z); GRAPHEMES_BY_MODULE lists the whole-grapheme
// tiles (digraphs, endings...) each module ADDS. Both accumulate across
// modules. A word is decodable once every earlier-taught grapheme is
// stripped out and everything left over is a known single letter.
// Extend either map as each later module is built — nothing else about
// this test should need to change.
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
};

const level2Modules = modules.filter((m) => m.level_id === 2).sort((a, b) => a.module_id - b.module_id);

function graphemesKnownThrough(moduleId) {
  const known = new Set();
  for (const m of level2Modules) {
    if (m.module_id > moduleId) break;
    for (const g of GRAPHEMES_BY_MODULE[m.module_id] || []) known.add(g);
  }
  return known;
}

function lettersKnownThrough(moduleId) {
  const known = new Set();
  for (const m of level2Modules) {
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

function isDecodable(word, moduleId) {
  const graphemes = [...graphemesKnownThrough(moduleId), ...ALWAYS_ALLOWED_DOUBLES].sort((a, b) => b.length - a.length);
  const letters = lettersKnownThrough(moduleId);
  let rest = word.toLowerCase();
  for (const g of graphemes) rest = rest.split(g).join("");
  return [...rest].every((ch) => letters.has(ch));
}

test("every Level 2 word only uses letters/patterns already taught by its own module", () => {
  const lessonModule = Object.fromEntries(lessons.filter((l) => l.module_id >= 9).map((l) => [l.lesson_id, l.module_id]));
  const violations = [];
  for (const it of [...activities, ...assessments]) {
    const moduleId = lessonModule[it.lesson_id];
    if (moduleId === undefined) continue; // Level 1 content — not in scope for this test
    const id = it.activity_id || it.assessment_id;
    const words = [it.correct_answer, it.written_word].filter(Boolean);
    for (const w of words) {
      if (!isDecodable(w, moduleId)) violations.push(`${id} (module ${moduleId}): "${w}" uses an untaught pattern`);
    }
  }
  assert.deepEqual(violations, [], violations.join("\n"));
});
