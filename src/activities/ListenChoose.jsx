// src/activities/ListenChoose.jsx
//
// Thin wrapper: today this is identical to MultipleChoice, but kept as
// its own file/type per the activity-type registry so this interaction
// can diverge (e.g. different layout) later without touching the other
// activity types or the generic renderer.
import React from "react";
import { MultipleChoice } from "./MultipleChoice";

export function ListenChoose(props) {
  return <MultipleChoice {...props} />;
}
