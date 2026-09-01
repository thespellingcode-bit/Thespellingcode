// src/activities/EndingSoundMatch.jsx
//
// Thin wrapper over MultipleChoice for Module 4's "ending_sound_match"
// activity type — compares a word's LAST sound instead of its first
// (beginning_sound_match, Module 3) or its rhyme (rhyme_match, Module 2).
// A genuinely distinct skill: cat/hot share an ending /t/ despite not
// rhyming (rhyming needs the whole vowel+final-consonant chunk to match).
// Same content shape and preview-then-confirm interaction as the other
// word-comparison types (see PREVIEW_CONFIRM_TYPES in questionTypes.js).
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function EndingSoundMatch(props) {
  return <MultipleChoice {...props} />;
}
