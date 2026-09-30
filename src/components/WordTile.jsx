// src/components/WordTile.jsx
//
// A whole WORD in a rounded tile, for Module 16's sentence-building
// mechanic — the sentence-level equivalent of LetterTile. Deliberately a
// separate component rather than stretching LetterTile: a letter tile is
// a fixed square sized for 1-3 characters, but a word tile holds anything
// from "a" to "elephant" and must size to its own content, not a shared
// square grid. Keeps the same state/color language (idle/picked/correct/
// wrong) so a sentence reads consistently with every other tile type.
import React from "react";
import { theme as T } from "../theme";

const STATE_COLORS = {
  idle: { border: T.line, bg: "#fff", text: T.ink },
  picked: { border: T.gold, bg: T.mist, text: T.ink },
  correct: { border: "#5CB86B", bg: "#D5EEDB", text: "#2C7A3C" },
  wrong: { border: T.coral, bg: "#FBD9D2", text: T.coralDeep },
};

export function WordTile({ word, state = "idle", disabled = false, onClick }) {
  const interactive = typeof onClick === "function";
  const Tag = interactive ? "button" : "div";
  const { border, bg, text } = STATE_COLORS[state] || STATE_COLORS.idle;
  return (
    <Tag
      onClick={interactive ? onClick : undefined}
      disabled={interactive ? disabled : undefined}
      style={{
        minWidth: 44, height: 52, padding: "0 16px", borderRadius: 14,
        background: bg, border: `2.5px solid ${border}`,
        boxShadow: state === "picked" ? `0 0 0 4px ${T.mist}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: interactive && !disabled ? "pointer" : "default",
        opacity: disabled && state === "idle" ? 0.5 : 1,
        animation: state === "correct" ? "scd-bounce 0.4s ease" : "none",
      }}
    >
      <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, color: text, whiteSpace: "nowrap" }}>
        {word}
      </span>
    </Tag>
  );
}
