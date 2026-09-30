// src/components/ResultScreen.jsx
import React, { useEffect } from "react";
import { theme as T } from "../theme";
import { ProgressBar } from "./ProgressBar";
import { Btn } from "./Btn";
import { Celebration } from "./Celebration";
import { Mascot } from "./Mascot";
import { playSfx } from "../services/audioService";
import { useAutoSpeak } from "../hooks/useAutoSpeak";

function pct(n) {
  return `${Math.round(n * 100)}%`;
}

export function ResultScreen({
  ratio, masteryThreshold, mastered, closeText, score, total, onFinish, onSeeRemediation, ttsEnabled = true,
}) {
  useEffect(() => {
    if (mastered) playSfx("celebrate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useAutoSpeak(mastered ? (closeText || "Great job!") : "Good try! Let's practise a bit more.", ttsEnabled);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      {mastered && <Celebration />}
      <Mascot pose={mastered ? "celebrate" : "encourage"} size={92} />
      <ProgressBar value={ratio} size={84}>
        <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 700, color: T.ink }}>{pct(ratio)}</span>
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
