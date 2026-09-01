// src/activities/BeginningSoundMatch.jsx
//
// Thin wrapper over MultipleChoice for Module 3's "beginning_sound_match"
// activity type — structurally identical to RhymeMatch (compare a first
// sound instead of a last sound), same content shape and same
// preview-then-confirm interaction (see PREVIEW_CONFIRM_TYPES in
// questionTypes.js). Kept as its own file per the activity-type registry,
// matching every other activity type.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function BeginningSoundMatch(props) {
  return <MultipleChoice {...props} />;
}
