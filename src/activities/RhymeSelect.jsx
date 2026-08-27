// src/activities/RhymeSelect.jsx
//
// Genuinely different mechanic from MultipleChoice's single-tap-select:
// the child taps every option that rhymes (multiple can be active at
// once), then confirms with "Check my answer." Used by Module 2 Lesson
// 5 ("Make a Rhyme") so it isn't just a reworded copy of Lessons 1/2/4's
// pick-one-of-three format. Question shape differs from MultipleChoice's
// too: `correct_answers` (array) instead of `correct_answer` (string) —
// see content-integrity.test.mjs for how that's validated.
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Illustration } from "../components/Illustration";
import { Icon } from "../components/Icon";
import { AudioPlayer } from "../components/AudioPlayer";
import { Feedback } from "../components/Feedback";
import { Btn } from "../components/Btn";
import { playSfx, playAsset, assetDurationMs } from "../services/audioService";
import { shuffled } from "../services/shuffle";

export function RhymeSelect({ question, onResult, allowRetry = true }) {
  const [options] = useState(() => shuffled(question.options));
  const [picked, setPicked] = useState(() => new Set());
  const [status, setStatus] = useState("idle"); // idle | wrong | correct
  const [attempts, setAttempts] = useState(0);
  const correctSet = new Set(question.correct_answers);

  const toggle = (opt) => {
    if (status !== "idle") return;
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  const submit = () => {
    if (picked.size === 0) return;
    setAttempts((a) => a + 1);
    const chosen = [...picked];
    const isCorrect = chosen.length === correctSet.size && chosen.every((p) => correctSet.has(p));

    // Speak back every word the child picked, one after another, before
    // resolving — confirms what they selected rather than just judging.
    chosen.forEach((w, i) => setTimeout(() => playAsset(`say:${w.toLowerCase()}`), i * 550));
    const settleDelay = chosen.length * 550 + assetDurationMs(`say:${chosen[chosen.length - 1].toLowerCase()}`) + 150;

    setTimeout(() => {
      if (isCorrect) {
        setStatus("correct");
        playSfx("correct");
        setTimeout(() => onResult({ correct: true, attempts: attempts + 1 }), 850);
      } else {
        setStatus("wrong");
        playSfx("incorrect");
        if (!allowRetry) setTimeout(() => onResult({ correct: false, attempts: attempts + 1 }), 950);
      }
    }, settleDelay);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, textAlign: "center", margin: 0 }}>
        {question.prompt ?? question.question}
      </p>
      {(question.audio_asset ?? question.audio) && (
        <AudioPlayer asset={question.audio_asset ?? question.audio} showPicture={allowRetry} />
      )}
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, margin: 0 }}>
        Tap every word that rhymes — there may be more than one!
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
        {options.map((opt) => {
          const isPicked = picked.has(opt);
          const isCorrectOpt = correctSet.has(opt);
          const revealed = status === "correct" || (status === "wrong" && !allowRetry);
          let bg = "#fff", border = T.line, color = T.ink;
          if (revealed && isCorrectOpt) { bg = "#EAF7EE"; border = "#5CB86B"; color = "#2C7A3C"; }
          else if (revealed && isPicked) { bg = "#FDEDEB"; border = T.coral; color = T.coralDeep; }
          else if (isPicked) { bg = T.mist; border = T.gold; color = T.ink; }
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              disabled={status !== "idle"}
              style={{
                minWidth: 108, padding: "12px 16px 14px", borderRadius: 16, cursor: status === "idle" ? "pointer" : "default",
                fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 16.5,
                border: `2px solid ${border}`, background: bg, color,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: revealed && isCorrectOpt ? "scd-bounce 0.4s ease" : "none",
              }}
            >
              <Illustration name={opt.toLowerCase()} size={56} />
              {opt}
              {isPicked && status === "idle" && <Icon name="check" size={16} color={T.goldDeep} />}
            </button>
          );
        })}
      </div>
      {status === "idle" && (
        <Btn variant="gold" size="md" onClick={submit} disabled={picked.size === 0}>
          Check my answer
        </Btn>
      )}
      <Feedback
        status={status}
        correctText={question.feedback}
        retryText={question.retry_feedback}
        correctAnswer={[...correctSet].join(" and ")}
        allowRetry={allowRetry}
        onRetry={() => { setPicked(new Set()); setStatus("idle"); }}
      />
    </div>
  );
}
