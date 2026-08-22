// src/services/assessmentService.js
//
// Pure functions — no React, no storage, no side effects. Easy to unit
// test in isolation (see /test/assessmentService.test.mjs).

// responses: [{ questionId, correct: boolean, errorTag: string|null }]
export function scoreAssessment(responses) {
  const total = responses.length;
  const correctCount = responses.filter((r) => r.correct).length;
  const ratio = total > 0 ? correctCount / total : 0;
  const errorTags = responses.filter((r) => !r.correct && r.errorTag).map((r) => r.errorTag);
  return { total, correctCount, ratio, errorTags };
}

// masteryThreshold comes from lesson content (lesson.masteryThreshold),
// e.g. 0.8 — never hard-coded here, so it can be tuned per lesson/skill
// later without touching this function.
export function isMastered(ratio, masteryThreshold) {
  return ratio >= masteryThreshold;
}

// Which error tag to target for remediation: the most frequent one among
// this attempt's mistakes. Ties broken by first occurrence.
export function primaryErrorTag(errorTags) {
  if (!errorTags.length) return null;
  const counts = {};
  errorTags.forEach((tag) => { counts[tag] = (counts[tag] || 0) + 1; });
  return errorTags.reduce((best, tag) => (counts[tag] > counts[best] ? tag : best), errorTags[0]);
}
