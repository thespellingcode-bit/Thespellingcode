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
  onRetryChallenge, isModuleFinal = false, nextModuleName = null, unlockThreshold = 0.85, bestEver,
}) {
  // A module's own final Challenge lesson additionally gates the next
  // module's unlock — every other lesson keeps the plain mastered/not-yet
  // screen below, unchanged.
  const showUnlock = isModuleFinal && !!nextModuleName;
  const unlocked = showUnlock && bestEver >= unlockThreshold;

  useEffect(() => {
    if (mastered) playSfx("celebrate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useAutoSpeak(
    showUnlock
      ? unlocked
        ? `You unlocked ${nextModuleName}!`
        : `So close! Score ${pct(unlockThreshold)} to unlock ${nextModuleName} for free.`
      : mastered
        ? (closeText || "Great job!")
        : "Good try! Let's practise a bit more.",
    ttsEnabled
  );

  if (showUnlock) {
    const pointsToGo = Math.max(0, unlockThreshold - bestEver);
    return (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
        {unlocked && <Celebration />}
        <Mascot pose={unlocked ? "celebrate" : "encourage"} size={92} />
        <ProgressBar value={bestEver} size={84}>
          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 700, color: T.ink }}>{pct(bestEver)}</span>
        </ProgressBar>
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, color: T.ink, margin: 0 }}>
          {unlocked ? (closeText || "Amazing detective work!") : "So close! A little more practice and you've got it."}
        </p>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5, color: T.textMute, margin: 0 }}>
          Score: {score} of {total}
        </p>
        <div
          style={{
            width: "100%", maxWidth: 320, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
            background: unlocked ? "#FFF3D6" : T.mist, border: `1px solid ${unlocked ? "#F2D888" : T.mistDeep}`,
          }}
        >
          <span style={{ fontSize: 24 }}>{unlocked ? "🔓" : "🔒"}</span>
          <div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 13.5, color: T.ink }}>
              {unlocked ? `${nextModuleName} unlocked — free!` : `${pct(pointsToGo)} more unlocks ${nextModuleName} — free`}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: T.textMute, marginTop: 2 }}>
              {unlocked ? "It's ready whenever you are." : "Retry the Challenge — your best score is always kept."}
            </div>
          </div>
        </div>
        {unlocked ? (
          <Btn variant="gold" size="lg" onClick={onFinish}>Start {nextModuleName}</Btn>
        ) : (
          <>
            <Btn variant="gold" size="lg" onClick={onRetryChallenge}>Retry the Challenge</Btn>
            <Btn variant="outline" size="lg" onClick={onSeeRemediation}>See what to practise</Btn>
          </>
        )}
      </div>
    );
  }

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
