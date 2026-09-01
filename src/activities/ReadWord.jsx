// src/activities/ReadWord.jsx
//
// Thin wrapper over MultipleChoice for Module 10's "read_word" activity
// type — the reverse of word_build: instead of hearing a word and
// building it, the child sees the WRITTEN word (question.written_word,
// rendered as styled text by MultipleChoice) and picks the matching
// picture. Demonstrates decoding without needing speech recognition
// (out of scope) to verify actual oral reading. Deliberately NOT
// auto-spoken — the point is reading the text, not hearing it.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function ReadWord(props) {
  return <MultipleChoice {...props} />;
}
