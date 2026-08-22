// src/components/Celebration.jsx
//
// Lightweight CSS-keyframe particle burst — no external animation/confetti
// library. Uses the "scd-confetti-fall" keyframe injected globally by
// theme.js's useGlobalAnimations(). Purely decorative: renders nothing
// interactive, sits absolutely positioned over its parent.
import React, { useMemo } from "react";
import { theme as T } from "../theme";

const COLORS = [T.gold, T.coral, "#5CB86B", "#5B8DEF", T.goldDeep];
const SHAPES = ["●", "★", "▲"];

export function Celebration({ count = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        dx: `${(Math.random() - 0.5) * 120}px`,
        rot: `${(Math.random() - 0.5) * 360}deg`,
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.6,
        color: COLORS[i % COLORS.length],
        shape: SHAPES[i % SHAPES.length],
        size: 12 + Math.random() * 10,
      })),
    [count]
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: -10,
            left: `${p.left}%`,
            fontSize: p.size,
            color: p.color,
            "--dx": p.dx,
            "--rot": p.rot,
            animation: `scd-confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}
