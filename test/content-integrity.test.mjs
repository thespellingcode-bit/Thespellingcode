// test/content-integrity.test.mjs
//
// Validates structural guarantees of the content layer itself — the
// things that would silently break the app if a content edit introduced
// a typo'd lesson_id or a dangling error_tag. Run with: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { answerTilesFor } from "../src/services/questionTypes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "content");
function loadJSON(name) {
  return JSON.parse(readFileSync(join(contentDir, name), "utf8"));
}

const lessons = loadJSON("lessons.json");
const activities = loadJSON("activities.json");
const assessments = loadJSON("assessments.json");
const remediation = loadJSON("remediation.json");
const modules = loadJSON("modules.json");
const badges = loadJSON("badges.json");

test("every lesson references a module that exists", () => {
  const moduleIds = new Set(modules.map((m) => m.module_id));
  for (const l of lessons) assert.ok(moduleIds.has(l.module_id), `${l.lesson_id} references missing module ${l.module_id}`);
});

// A lesson with zero assessment items doesn't just have empty content — it
// breaks the app: LessonPlayer's assessment stage only renders while
// assessIdx < totalQuestions, and totalQuestions is the assessment bank's
// length. With zero items that's never true, so the stage renders nothing,
// onResult() is never called, and the app can never advance to the
// "result" stage — the score dashboard silently never appears. Caught
// live when Module 3's Lessons 1-5 shipped without their own assessment
// banks (only the module's final Lesson 6 bank existed).
test("every active lesson has at least one assessment item", () => {
  const assessmentLessonIds = new Set(assessments.map((a) => a.lesson_id));
  for (const l of lessons) {
    if (l.status !== "active") continue;
    assert.ok(assessmentLessonIds.has(l.lesson_id), `${l.lesson_id} (${l.title}) has zero assessment items — the score dashboard can never appear for it`);
  }
});

test("every lesson declares masteryThreshold as data (not assumed 0.8 elsewhere)", () => {
  for (const l of lessons) {
    assert.equal(typeof l.masteryThreshold, "number", `${l.lesson_id} missing masteryThreshold`);
    assert.ok(l.masteryThreshold > 0 && l.masteryThreshold <= 1, `${l.lesson_id} masteryThreshold out of range`);
  }
});

test("every practice activity references a lesson that exists", () => {
  const lessonIds = new Set(lessons.map((l) => l.lesson_id));
  for (const a of activities) assert.ok(lessonIds.has(a.lesson_id), `${a.activity_id} references missing lesson ${a.lesson_id}`);
});

test("every assessment question references a lesson that exists", () => {
  const lessonIds = new Set(lessons.map((l) => l.lesson_id));
  for (const a of assessments) assert.ok(lessonIds.has(a.lesson_id), `${a.assessment_id} references missing lesson ${a.lesson_id}`);
});

// rhyme_select items (multi-answer — "tap every word that rhymes") use
// correct_answers (array) instead of correct_answer (string). This
// derives one comparable string key either way, used by both the
// "answer is in options" check and the practice/assessment-overlap
// check below, so multi-answer items don't need separate test logic.
function answerKeyFor(item) {
  return item.type === "rhyme_select" ? [...item.correct_answers].sort().join("+") : item.correct_answer;
}

test("every activity/assessment correct_answer(s) are among its own options", () => {
  for (const a of [...activities, ...assessments]) {
    if (a.type === "rhyme_select") {
      assert.ok(Array.isArray(a.correct_answers) && a.correct_answers.length > 0, `${a.activity_id || a.assessment_id} missing correct_answers`);
      for (const ca of a.correct_answers) {
        assert.ok(a.options.includes(ca), `${a.activity_id || a.assessment_id} correct_answers entry "${ca}" not in options`);
      }
    } else if (a.type === "word_build" || a.type === "sentence_build") {
      // No "options" list here — the selectable materials are the letter
      // (or, from Module 11 on, digraph, or from Module 16 on, whole
      // WORD) tiles. The meaningful integrity check is that the tile
      // bank contains at least the target's tiles (as a multiset) —
      // WordBuilder/SentenceBuilder only check the assembled result
      // against correct_answer, so extra decoy tiles are fine as long as
      // every needed tile, and enough of it, is present. Compares
      // against answerTilesFor (answer_tiles if set, else correct_answer
      // split into characters) rather than raw characters, since a tray
      // tile can be a whole grapheme ("sh") or, for a sentence, a whole
      // word ("cat.").
      const joiner = a.type === "sentence_build" ? " " : "";
      assert.ok(Array.isArray(a.letters) && a.letters.length > 0, `${a.activity_id || a.assessment_id} missing letters`);
      const bankCounts = {};
      for (const l of a.letters) bankCounts[l] = (bankCounts[l] || 0) + 1;
      for (const tile of answerTilesFor(a)) {
        bankCounts[tile] = (bankCounts[tile] || 0) - 1;
        assert.ok(bankCounts[tile] >= 0, `${a.activity_id || a.assessment_id} tile bank "${a.letters.join(joiner)}" is missing a tile needed for "${a.correct_answer}"`);
      }
      if (a.answer_tiles) {
        assert.equal(a.answer_tiles.join(joiner), a.correct_answer, `${a.activity_id || a.assessment_id} answer_tiles "${a.answer_tiles.join("+")}" don't join to correct_answer "${a.correct_answer}"`);
      }
    } else {
      assert.ok(a.options.includes(a.correct_answer), `${a.activity_id || a.assessment_id} correct_answer not in options`);
    }
  }
});

test("every activity/assessment error_tag has a matching remediation entry", () => {
  const remediationTags = new Set(remediation.map((r) => r.error_tag));
  for (const a of [...activities, ...assessments]) {
    assert.ok(remediationTags.has(a.error_tag), `${a.activity_id || a.assessment_id} error_tag "${a.error_tag}" has no remediation entry`);
  }
});

test("REQUIREMENT: assessment questions do not reuse practice audio_asset+correct_answer pairs within the same lesson (transfer-to-new-example check)", () => {
  const byLesson = {};
  for (const a of activities) {
    (byLesson[a.lesson_id] ||= new Set()).add(`${a.audio_asset}::${answerKeyFor(a)}`);
  }
  const violations = [];
  for (const a of assessments) {
    const practiceKeys = byLesson[a.lesson_id] || new Set();
    const key = `${a.audio_asset}::${answerKeyFor(a)}`;
    if (practiceKeys.has(key) && !a.review_flag) {
      violations.push(`${a.assessment_id} exactly reuses practice audio+answer "${key}" without a review_flag`);
    }
  }
  // This assertion documents the current state rather than silently
  // hiding it: any unflagged duplicate should fail CI once this project
  // has one. Known duplicates in the Lesson 6 module-assessment bank are
  // intentionally pre-flagged with review_flag in the content file itself.
  assert.deepEqual(violations, [], violations.join("\n"));
});

test("exactly Modules 1-41 active — scope guard for this build (all of Level 1, Level 2, Level 3, and Level 4, plus Level 5 Module 1, built)", () => {
  const active = modules.filter((m) => m.active).map((m) => m.module_id).sort((a, b) => a - b);
  assert.deepEqual(active, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]);
});

test("exactly Sound Starter, Rhyme Ranger, Level 1 Sound Explorer, Sentence Star, Level 2 Word Builder, Level 3 Pattern Detective, and Level 4 Spelling Detective badges active — scope guard for this build", () => {
  const active = badges.filter((b) => b.active).map((b) => b.badge_id).sort();
  assert.deepEqual(active, ["BADGE-01", "BADGE-02", "BADGE-06", "BADGE-07", "BADGE-08", "BADGE-09", "BADGE-10"]);
});
