// src/activities/Assessment.jsx
//
// Wraps any question type for the scored assessment stage: no hints, no
// retry, first response counts. This is what actually enforces "no
// second chances during scoring" — activity-type components themselves
// don't know or care whether they're in practice or assessment mode.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function Assessment(props) {
  return <MultipleChoice {...props} allowRetry={false} />;
}
