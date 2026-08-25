// src/activities/RhymeMatch.jsx
//
// Thin wrapper over MultipleChoice for Module 2's "rhyme_match" activity
// type (ACT-04 in the curriculum content engine). Kept as its own file
// per the activity-type registry, matching every other activity type.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function RhymeMatch(props) {
  return <MultipleChoice {...props} />;
}
