// src/activities/SentenceRead.jsx
//
// Module 16's "sentence_read" activity type — the sentence-level sibling
// of read_word: show a written sentence (question.written_sentence,
// rendered as plain static text by MultipleChoice — NOT the tap-to-
// sound-out written_word treatment, which would mangle a sentence), then
// pick the picture that matches what it's about.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function SentenceRead(props) {
  return <MultipleChoice {...props} />;
}
