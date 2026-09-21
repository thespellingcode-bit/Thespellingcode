// src/pages/Lesson.jsx
import React from "react";
import { LessonPlayer } from "../components/LessonPlayer";
import { getLesson, getLessonsByModule, getActiveModules } from "../services/contentService";
import { MODULE_UNLOCK_THRESHOLD } from "../services/progressService";

export function Lesson({ lessonId, state, onExit, onFinish }) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <div style={{ padding: 40, textAlign: "center" }}>Lesson not found.</div>;
  }

  // A lesson is "the module final" when it's both the last lesson in its
  // module AND that module's own Challenge/Assessment-type lesson — every
  // module built so far ends in exactly one of these, by convention. Only
  // lessons matching both get the module-unlock messaging on their result
  // screen; every other lesson's ResultScreen is unaffected.
  const moduleLessons = getLessonsByModule(lesson.module_id);
  const isLastInModule = moduleLessons[moduleLessons.length - 1]?.lesson_id === lesson.lesson_id;
  const activeModules = getActiveModules();
  const moduleIdx = activeModules.findIndex((m) => m.module_id === lesson.module_id);
  const nextModule = moduleIdx !== -1 ? activeModules[moduleIdx + 1] : null;
  const isModuleFinal = isLastInModule && lesson.activity_type === "assessment" && !!nextModule;
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
