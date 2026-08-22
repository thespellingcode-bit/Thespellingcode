// src/components/ResultScreen.jsx
import React, { useEffect } from "react";
import { theme as T } from "../theme";
import { ProgressBar } from "./ProgressBar";
import { Btn } from "./Btn";
import { Celebration } from "./Celebration";
import { playSfx } from "../services/audioService";

function pct(n) {
  return `${Math.round(n * 100)}%`;
}

export function ResultScreen({ ratio, masteryThreshold, mastered, closeText, score, total, onFinish, onSeeRemediation }) {
  useEffect(() => {
    if (mastered) playSfx("celebrate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      {mastered && <Celebration />}
      <ProgressBar value={ratio} size={110}>
        <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 24, fontWeight: 700, color: T.ink }}>{pct(ratio)}</span>
      </ProgressBar>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, margin: 0 }}>
        {mastered ? (closeText || "Great job!") : "Good try! Let's practise a bit more."}
      </p>
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5, color: T.textMute, margin: 0 }}>
        Score: {score} of {total} · Mastery needs {pct(masteryThreshold)}
      </p>
      {mastered ? (
        <Btn variant="gold" size="lg" onClick={onFinish}>Finish lesson</Btn>
      ) : (
        <Btn variant="outline" size="lg" onClick={onSeeRemediation}>See what to practise</Btn>
      )}
    </div>
  );
}
