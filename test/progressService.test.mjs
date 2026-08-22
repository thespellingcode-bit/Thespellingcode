// test/progressService.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { recordLessonAttempt, statusOfLesson, errorTagCounts, DEFAULT_STATE } from "../src/services/progressService.js";

test("recordLessonAttempt creates a progress entry on first attempt", () => {
  const state = { ...DEFAULT_STATE, progress: {}, errorLog: [] };
  const next = recordLessonAttempt(state, {
    lessonId: "L1-M01-01",
    childId: "child_1",
    responses: [{ questionId: "AS-M01-01-1", skill: "auditory_discrimination", errorTag: "SOUND_ID_CONFUSION", correct: false }],
    ratio: 0.8,
    mastery: true,
    attemptNumber: 1,
  });
  assert.equal(next.progress["L1-M01-01"].attempts, 1);
  assert.equal(next.progress["L1-M01-01"].mastery, true);
  assert.equal(next.errorLog.length, 1);
  assert.equal(next.errorLog[0].error_tag, "SOUND_ID_CONFUSION");
  assert.equal(next.errorLog[0].attempt_number, 1);
});

test("recordLessonAttempt accumulates attempts and keeps best score across retries", () => {
  let state = { ...DEFAULT_STATE, progress: {}, errorLog: [] };
  state = recordLessonAttempt(state, { lessonId: "L1-M01-01", childId: "c1", responses: [], ratio: 0.4, mastery: false, attemptNumber: 1 });
  state = recordLessonAttempt(state, { lessonId: "L1-M01-01", childId: "c1", responses: [], ratio: 0.8, mastery: true, attemptNumber: 2 });
  assert.equal(state.progress["L1-M01-01"].attempts, 2);
  assert.equal(state.progress["L1-M01-01"].bestScore, 0.8);
  assert.equal(state.progress["L1-M01-01"].mastery, true);
});

test("recordLessonAttempt: mastery once true never reverts on a later worse attempt", () => {
  let state = { ...DEFAULT_STATE, progress: {}, errorLog: [] };
  state = recordLessonAttempt(state, { lessonId: "L1-M01-01", childId: "c1", responses: [], ratio: 0.9, mastery: true, attemptNumber: 1 });
  state = recordLessonAttempt(state, { lessonId: "L1-M01-01", childId: "c1", responses: [], ratio: 0.4, mastery: false, attemptNumber: 2 });
  assert.equal(state.progress["L1-M01-01"].mastery, true);
});

test("statusOfLesson reflects mastery/completed/attempted/not_started correctly", () => {
  const state = {
    ...DEFAULT_STATE,
    progress: {
      "L1-M01-01": { mastery: true, completed: true, attempts: 1 },
      "L1-M01-02": { mastery: false, completed: true, attempts: 1 },
      "L1-M01-03": { mastery: false, completed: false, attempts: 1 },
    },
  };
  assert.equal(statusOfLesson(state, "L1-M01-01"), "mastered");
  assert.equal(statusOfLesson(state, "L1-M01-02"), "completed");
  assert.equal(statusOfLesson(state, "L1-M01-03"), "in_progress");
  assert.equal(statusOfLesson(state, "L1-M01-04"), "not_started");
});

test("errorTagCounts aggregates correctly and can filter by lesson", () => {
  const state = {
    ...DEFAULT_STATE,
    errorLog: [
      { lesson_id: "L1-M01-01", error_tag: "SOUND_ID_CONFUSION" },
      { lesson_id: "L1-M01-01", error_tag: "SOUND_ID_CONFUSION" },
      { lesson_id: "L1-M01-02", error_tag: "SAME_DIFFERENT_CONFUSION" },
    ],
  };
  assert.deepEqual(errorTagCounts(state), { SOUND_ID_CONFUSION: 2, SAME_DIFFERENT_CONFUSION: 1 });
  assert.deepEqual(errorTagCounts(state, "L1-M01-01"), { SOUND_ID_CONFUSION: 2 });
});
