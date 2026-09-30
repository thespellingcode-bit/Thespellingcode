// src/activities/SightWordMatch.jsx
//
// Module 15's "sight_word_match" activity type — a tricky word can't be
// sounded out reliably (the vowel in "said" doesn't say its usual
// sound), so unlike read_word this is deliberately audio-first: hear the
// whole word spoken naturally, then pick it out from other real words
// that look similar in print (was / saw / has). No written_word is set
// on this content, so MultipleChoice's own written-word branch (which
// wires up letter-by-letter sound-out — exactly the wrong technique for
// an irregular word) never triggers; this only ever shows the audio
// player and plain-text option buttons.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function SightWordMatch(props) {
  return <MultipleChoice {...props} />;
}
