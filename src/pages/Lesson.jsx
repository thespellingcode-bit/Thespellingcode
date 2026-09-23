// src/pages/Lesson.jsx
import React from "react";
import { LessonPlayer } from "../components/LessonPlayer";
import { getLesson, getLessonsByModule, getActiveModules } from "../services/contentService";
import { MODULE_UNLOCK_THRESHOLD, FREE_UNLOCK_FROM_MODULE_ID } from "../services/progressService";

export function Lesson({ lessonId, state, onExit, onFinish }) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <div style={{ padding: 40, textAlign: "center" }}>Lesson not found.</div>;
  }

  // A lesson gets the free-unlock messaging on its result screen only
  // when it's the last lesson of its module, that module's own Challenge/
  // Assessment-type lesson, AND that module is specifically Module 1 —
  // the free unlock is a one-time promotional mechanic scoped to the
  // Module 1 → 2 boundary only, not a general rule for every module.
  const moduleLessons = getLessonsByModule(lesson.module_id);
  const isLastInModule = moduleLessons[moduleLessons.length - 1]?.lesson_id === lesson.lesson_id;
  const activeModules = getActiveModules();
  const moduleIdx = activeModules.findIndex((m) => m.module_id === lesson.module_id);
  const nextModule = moduleIdx !== -1 ? activeModules[moduleIdx + 1] : null;
  const isModuleFinal =
    isLastInModule && lesson.activity_type === "assessment" && !!nextModule && lesson.module_id === FREE_UNLOCK_FROM_MODULE_ID;
  const nextModuleName = nextModule ? `Module ${nextModule.module_id} — ${nextModule.module_name}` : null;
  const priorBestScore = state?.progress?.[lesson.lesson_id]?.bestScore || 0;

  return (
    <LessonPlayer
      lesson={lesson}
      onExit={onExit}
      onFinish={onFinish}
      isModuleFinal={isModuleFinal}
      nextModuleName={nextModuleName}
      unlockThreshold={MODULE_UNLOCK_THRESHOLD}
      priorBestScore={priorBestScore}
    />
  );
}
