// src/activities/FixSentence.jsx
//
// Module 16's "fix_sentence" activity type — a capital letter starts a
// sentence, a full stop ends it. Rather than building an interactive
// text-editing UI, this tests the same recognition receptively: two
// plain-text options, one correctly formatted ("The cat sat.") and one
// not ("the cat sat"), pick the one that's right. Reuses MultipleChoice's
// existing plain-text-option fallback (see NO_ICON_OPTION_TYPES there —
// a whole sentence option must never get a picture icon).
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function FixSentence(props) {
  return <MultipleChoice {...props} />;
}
