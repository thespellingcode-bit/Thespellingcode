// src/components/LetterTile.jsx
//
// A single letter, big and bold in a rounded tile — the visual unit for
// Module 8 (Letter-Sound Connections) onward. Deliberately NOT
// hand-drawn SVG art like Illustration.jsx: a letter doesn't need to be
// illustrated, just shown clearly and consistently, the way real phonics
// letter-tile manipulatives work. Reused wherever an option or a central
// prompt is a bare letter instead of a picturable word/sound.
import React from "react";
import { theme as T } from "../theme";

const TILE_BG = ["#FFF3D6", "#E1F3E6", "#DCEBFF", "#FDE9D2", "#FDEBE4", "#EAE2F7"];

// Stable-ish color pick per letter (not random) so the same letter always
// gets the same tile color across a session — purely a visual-variety
// touch, no meaning attached to the color.
function bgFor(letter) {
  const code = letter.toLowerCase().charCodeAt(0) || 0;
  return TILE_BG[code % TILE_BG.length];
}

// state: "idle" (default) | "picked" (gold, chosen but not yet judged) |
// "correct" (green) | "wrong" (coral) — mirrors MultipleChoice's own
// option color scheme so a letter tile reads consistently with every
// other answer type in the app.
const STATE_COLORS = {
  idle: { border: T.line, glow: null, text: T.ink },
  picked: { border: T.gold, glow: T.mist, text: T.ink },
  correct: { border: "#5CB86B", glow: "#D5EEDB", text: "#2C7A3C" },
  wrong: { border: T.coral, glow: "#FBD9D2", text: T.coralDeep },
};

export function LetterTile({ letter, size = 64, state = "idle", disabled = false, onClick }) {
  const interactive = typeof onClick === "function";
  const Tag = interactive ? "button" : "div";
  const { border, glow, text } = STATE_COLORS[state] || STATE_COLORS.idle;
  return (
    <Tag
      onClick={interactive ? onClick : undefined}
      disabled={interactive ? disabled : undefined}
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: state === "idle" ? bgFor(letter) : glow || bgFor(letter),
        border: `2.5px solid ${border}`,
        boxShadow: state === "picked" ? `0 0 0 4px ${T.mist}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: interactive && !disabled ? "pointer" : "default",
        opacity: disabled && state === "idle" ? 0.5 : 1,
        padding: 0,
        animation: state === "correct" ? "scd-bounce 0.4s ease" : "none",
      }}
    >
      <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: size * 0.48, color: text, textTransform: "lowercase" }}>
        {letter}
      </span>
    </Tag>
  );
}
