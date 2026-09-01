// src/activities/LetterSoundMatch.jsx
//
// Thin wrapper over MultipleChoice for Module 8's "letter_sound_match"
// activity type — MultipleChoice itself renders the LetterTile branches
// (central prompt when question.letter_prompt is set, option tiles when
// an option is a single letter). Kept as its own file per the
// activity-type registry, matching every other activity type.
//
// (This was missing an explicit registry entry when Module 8 first
// shipped — componentForType()'s fallback to ListenChoose happened to
// work anyway, since ListenChoose is itself just a MultipleChoice
// passthrough, but every other type gets its own named wrapper for
// clarity, so this should too.)
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function LetterSoundMatch(props) {
  return <MultipleChoice {...props} />;
}
