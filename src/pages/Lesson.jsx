// src/pages/Lesson.jsx
import React from "react";
import { LessonPlayer } from "../components/LessonPlayer";
import { getLesson } from "../services/contentService";

export function Lesson({ lessonId, onExit, onRecord }) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <div style={{ padding: 40, textAlign: "center" }}>Lesson not found.</div>;
  }

  return <LessonPlayer lesson={lesson} onExit={onExit} onRecord={onRecord} />;
}
