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

test("exactly Modules 1-2 active — scope guard for this build (Modules 3+ still out of scope)", () => {
  const active = modules.filter((m) => m.active).map((m) => m.module_id).sort();
  assert.deepEqual(active, [1, 2]);
});

test("exactly Sound Starter and Rhyme Ranger badges active — scope guard for this build", () => {
  const active = badges.filter((b) => b.active).map((b) => b.badge_id).sort();
  assert.deepEqual(active, ["BADGE-01", "BADGE-02"]);
});
