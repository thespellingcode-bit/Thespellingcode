// src/activities/Assessment.jsx
//
// Wraps any question type for the scored assessment stage: no hints, no
// retry, first response counts. This is what actually enforces "no
// second chances during scoring" — activity-type components themselves
// don't know or care whether they're in practice or assessment mode.
//
// Dispatches through the same activity-type registry QuestionCard uses
// for practice, rather than hardcoding MultipleChoice — that was a real
// latent bug: a type like "rhyme_select" (multi-answer, doesn't fit
// MultipleChoice's single-correct-answer model at all) would have been
// silently wrapped in the wrong component the first time it hit
// assessment mode.
import React from "react";
import { componentForType } from "./registry";

export function Assessment(props) {
  const Component = componentForType(props.question.type);
  return <Component {...props} allowRetry={false} />;
}
