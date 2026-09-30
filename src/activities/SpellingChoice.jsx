// src/activities/SpellingChoice.jsx
//
// Level 4's "spelling_choice" activity type — the first time this app
// grades a child on picking the CORRECT spelling from two plausible
// options (every earlier level enforced "no choosing between two valid
// spellings"; see docs/plans/level-4.md's design problem). Hear the
// word, then pick the correctly spelled option — the wrong option is a
// genuine misapplication of the real rule being taught (e.g. "bak" for
// "back"), not an arbitrary typo. Reuses MultipleChoice's existing
// plain-text-option fallback exactly like fix_sentence does — no new
// component logic needed, just its own type name so narration and
// NO_ICON_OPTION_TYPES treat it correctly.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function SpellingChoice(props) {
  return <MultipleChoice {...props} />;
}
