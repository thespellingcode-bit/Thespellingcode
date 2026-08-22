// src/components/QuestionCard.jsx
import React from "react";
import { componentForType } from "../activities/registry";
import { Assessment } from "../activities/Assessment";

// mode: "practice" (retry allowed, hints shown) or "assessment" (no
// retry, first response scored). This is the ONLY place that decides
// practice vs assessment rendering — activity components never know.
export function QuestionCard({ question, onResult, mode = "practice" }) {
  if (mode === "assessment") {
    return <Assessment question={question} onResult={onResult} />;
  }
  const ActivityComponent = componentForType(question.type);
  return <ActivityComponent question={question} onResult={onResult} allowRetry />;
}
