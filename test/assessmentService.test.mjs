// test/assessmentService.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreAssessment, isMastered, primaryErrorTag } from "../src/services/assessmentService.js";

test("scoreAssessment computes ratio correctly", () => {
  const responses = [
    { correct: true, errorTag: null },
    { correct: true, errorTag: null },
    { correct: false, errorTag: "SOUND_ID_CONFUSION" },
    { correct: true, errorTag: null },
    { correct: false, errorTag: "SOUND_ID_CONFUSION" },
  ];
  const result = scoreAssessment(responses);
  assert.equal(result.total, 5);
  assert.equal(result.correctCount, 3);
  assert.equal(result.ratio, 0.6);
  assert.deepEqual(result.errorTags, ["SOUND_ID_CONFUSION", "SOUND_ID_CONFUSION"]);
});

test("scoreAssessment handles empty responses without dividing by zero", () => {
  const result = scoreAssessment([]);
  assert.equal(result.total, 0);
  assert.equal(result.ratio, 0);
});

test("isMastered respects the threshold passed in, not a hard-coded 0.8", () => {
  assert.equal(isMastered(0.8, 0.8), true);
  assert.equal(isMastered(0.79, 0.8), false);
  assert.equal(isMastered(0.8, 0.9), false); // same score, stricter skill threshold
  assert.equal(isMastered(0.9, 0.9), true);
});

test("primaryErrorTag returns the most frequent tag", () => {
  const tags = ["LOUD_SOFT_CONFUSION", "SOUND_ID_CONFUSION", "SOUND_ID_CONFUSION"];
  assert.equal(primaryErrorTag(tags), "SOUND_ID_CONFUSION");
});

test("primaryErrorTag returns null for no errors", () => {
  assert.equal(primaryErrorTag([]), null);
});
