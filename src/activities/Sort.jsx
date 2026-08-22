// src/activities/Sort.jsx
//
// Thin wrapper over MultipleChoice for the "loud_soft/fast_slow" activity type(s).
// Kept as its own file per the activity-type registry so this
// interaction can get a bespoke UI later without touching the others.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function Sort(props) {
  return <MultipleChoice {...props} />;
}
