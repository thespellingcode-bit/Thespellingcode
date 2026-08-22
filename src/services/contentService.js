// src/services/contentService.js
//
// The only file that imports the raw content JSON. Every other file in
// the app goes through these functions instead of importing content/*.json
// directly — that indirection is what lets the loading mechanism change
// later (e.g. fetch from a CMS instead of a static import) without
// touching components.

import levels from "../../content/levels.json";
import modules from "../../content/modules.json";
import lessons from "../../content/lessons.json";
import activities from "../../content/activities.json";
import assessments from "../../content/assessments.json";
import remediation from "../../content/remediation.json";
import media from "../../content/media.json";
import badges from "../../content/badges.json";
import parentPractice from "../../content/parent_practice.json";

export function getLevel(levelId = 1) {
  return levels.find((l) => l.level_id === levelId) || null;
}

export function getModules() {
  return modules;
}
export function getActiveModules() {
  return modules.filter((m) => m.active);
}
export function getModule(moduleId) {
  return modules.find((m) => m.module_id === moduleId) || null;
}

export function getLessonsByModule(moduleId) {
  return lessons.filter((l) => l.module_id === moduleId).sort((a, b) => a.number - b.number);
}
export function getLesson(lessonId) {
  return lessons.find((l) => l.lesson_id === lessonId) || null;
}

export function getPracticeActivities(lessonId) {
  return activities
    .filter((a) => a.lesson_id === lessonId && a.stage === "practice")
    .sort((a, b) => a.activity_id.localeCompare(b.activity_id));
}

export function getAssessmentQuestions(lessonId) {
  return assessments.filter((a) => a.lesson_id === lessonId).sort((a, b) => a.order - b.order);
}

export function getRemediationByErrorTag(errorTag) {
  return remediation.find((r) => r.error_tag === errorTag) || null;
}

export function getMediaAsset(assetId, type) {
  return media.find((m) => m.asset_id === assetId && m.type === type) || null;
}

export function getBadges() {
  return badges;
}
export function getActiveBadges() {
  return badges.filter((b) => b.active);
}

export function getParentPractice(moduleId) {
  return parentPractice.filter((p) => p.module_id === moduleId);
}
