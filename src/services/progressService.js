// src/services/progressService.js
//
// Persistence for this MVP uses the browser's localStorage.
// There is no backend/server in this environment, and a real relational
// database is unnecessary complexity for a single-child prototype with
// no auth. The record shapes below are deliberately relational-shaped
// (child_id / lesson_id / question_id foreign keys) so migrating to
// Postgres later is a schema translation, not a redesign.

const STORAGE_KEY = "spelling-code-state-v2";

// A module's own final "Challenge"/"Assessment" lesson score gates the
// NEXT module's unlock — hitting this bar unlocks it for free, below it
// only that one lesson needs a retry (not the whole module). Shared here
// so ChildHome (the gate check) and Lesson (the in-lesson messaging)
// can't drift out of sync on the number.
export const MODULE_UNLOCK_THRESHOLD = 0.85;

// The score-gated free unlock is a one-time promotional mechanic scoped
// to exactly one boundary — Module 1's Challenge unlocking Module 2 —
// not a general "any module's score unlocks the next one" rule. Every
// other module boundary uses the plain "every lesson mastered" gate.
export const FREE_UNLOCK_FROM_MODULE_ID = 1;

export const DEFAULT_STATE = { profile: null, progress: {}, errorLog: [], badges: [], settings: { unlockAll: false } };

export async function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Key doesn't exist yet (first run) — fall through to default.
  }
  return DEFAULT_STATE;
}

export async function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
