// src/services/progressService.js
//
// Persistence for this MVP uses Claude's window.storage key-value API
// (see "18. DATABASE / PERSISTENCE" in the architecture brief for why —
// short version: there is no backend/server in this environment, and a
// real relational database is unnecessary complexity for a single-child
// prototype with no auth. The record shapes below are deliberately
// relational-shaped (child_id / lesson_id / question_id foreign keys)
// so migrating to Postgres later is a schema translation, not a redesign.

const STORAGE_KEY = "spelling-code-state-v2";

export const DEFAULT_STATE = { profile: null, progress: {}, errorLog: [], badges: [] };

export async function loadState() {
  try {
    const res = await window.storage.get(STORAGE_KEY, false);
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) {
    // Key doesn't exist yet (first run) — fall through to default.
  }
  return DEFAULT_STATE;
}

export async function saveState(state) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(state), false);
  } catch (e) {
    console.error("progressService.saveState failed", e);
  }
}

// Pure function: given current state and a completed lesson attempt,
// returns the next state. Does not persist — call saveState separately
// so callers can batch/react to the result before writing.
//
// attempt: {
//   lessonId, childId, responses: [{questionId, skill, errorTag, correct}],
//   ratio, mastery, attemptNumber
// }
export function recordLessonAttempt(state, attempt) {
  const { lessonId, childId, responses, ratio, mastery, attemptNumber } = attempt;
  const now = Date.now();
  const existing = state.progress[lessonId] || { attempts: 0, bestScore: 0 };

  const newErrorEntries = responses
    .filter((r) => !r.correct)
    .map((r) => ({
      child_id: childId,
      lesson_id: lessonId,
      question_id: r.questionId,
      skill: r.skill,
      error_tag: r.errorTag,
      attempt_number: attemptNumber,
      timestamp: now,
    }));

  return {
    ...state,
    progress: {
      ...state.progress,
      [lessonId]: {
        attempts: (existing.attempts || 0) + 1,
        bestScore: Math.max(existing.bestScore || 0, ratio),
        mastery: existing.mastery || mastery,
        completed: true,
        updatedAt: now,
      },
    },
    errorLog: [...state.errorLog, ...newErrorEntries],
  };
}

export function statusOfLesson(state, lessonId) {
  const p = state.progress[lessonId];
  if (p?.mastery) return "mastered";
  if (p?.completed) return "completed";
  if (p?.attempts > 0) return "in_progress";
  return "not_started";
}

// Aggregate error counts by error_tag for a child, most recent lessons
// first — this is the query an "error intelligence" feature would build
// on top of; today it just powers the parent dashboard's "needs practice"
// list, but the data shape doesn't need to change when that gets smarter.
export function errorTagCounts(state, lessonId = null) {
  const entries = lessonId ? state.errorLog.filter((e) => e.lesson_id === lessonId) : state.errorLog;
  const counts = {};
  entries.forEach((e) => { counts[e.error_tag] = (counts[e.error_tag] || 0) + 1; });
  return counts;
}
