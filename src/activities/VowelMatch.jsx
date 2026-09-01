// src/activities/VowelMatch.jsx
//
// Thin wrapper over MultipleChoice for Module 5's "vowel_match" activity
// type — compares a word's MIDDLE vowel sound instead of its first
// (beginning_sound_match) or last (ending_sound_match). Same content shape
// and preview-then-confirm interaction as the other word-comparison types
// (see PREVIEW_CONFIRM_TYPES in questionTypes.js).
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function VowelMatch(props) {
  return <MultipleChoice {...props} />;
}
