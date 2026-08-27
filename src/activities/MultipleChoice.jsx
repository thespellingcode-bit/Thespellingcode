// src/activities/MultipleChoice.jsx
//
// The generic answer-option renderer used by every activity type below.
// Handles: option buttons, per-option pictures/sound (for pre-readers),
// correct/wrong styling, retry vs scored (no-retry) modes. Nothing here
// knows about "listen_choose" vs "same_different" etc — activity-specific
// files just pass in the right options/copy.
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon, labelToIcon } from "../components/Icon";
import { Illustration } from "../components/Illustration";
import { AudioPlayer } from "../components/AudioPlayer";
import { Feedback } from "../components/Feedback";
import { playSfx, playAsset, assetDurationMs, soundForOption } from "../services/audioService";
import { shuffled } from "../services/shuffle";
import { COMPARE_TYPES } from "../services/questionTypes";

export function MultipleChoice({ question, onResult, allowRetry = true }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | wrong | correct
  const [attempts, setAttempts] = useState(0);
  // Shuffled once per question instance (the `key` on QuestionCard/
  // Assessment already forces a fresh mount per question) so the
  // correct answer isn't always in the same visual slot.
  const [options] = useState(() => shuffled(question.options));

  const correctAnswer = question.correct_answer ?? question.correct;
  const audioAsset = question.audio_asset ?? question.audio;
  const isCompareType = COMPARE_TYPES.includes(question.type);

  const choose = (opt) => {
    if (status === "correct") return;
    setSelected(opt);
    const isCorrect = opt === correctAnswer;
    setAttempts((a) => a + 1);

    const resolve = () => {
      if (isCorrect) {
        setStatus("correct");
        playSfx("correct");
        setTimeout(() => onResult({ correct: true, attempts: attempts + 1 }), 850);
      } else {
        setStatus("wrong");
        playSfx("incorrect");
        if (!allowRetry) setTimeout(() => onResult({ correct: false, attempts: attempts + 1 }), 950);
      }
    };

    // Play the option's own sound first (so a pre-reader actually hears
    // what they picked) and delay the correct/wrong resolution until
    // that clip has finished, rather than the feedback chime cutting it
    // off immediately.
    const optSound = !isCompareType ? soundForOption(question, opt) : null;
    if (optSound) {
      playAsset(optSound);
      setTimeout(resolve, assetDurationMs(optSound) + 150);
    } else {
      resolve();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, textAlign: "center", margin: 0 }}>
        {question.prompt ?? question.question}
      </p>
      {audioAsset && <AudioPlayer asset={audioAsset} showPicture={!isCompareType && allowRetry} />}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = opt === correctAnswer;
          let bg = "#fff", border = T.line, color = T.ink, iconBg = T.mist;
          if (isSelected && status === "correct") { bg = "#EAF7EE"; border = "#5CB86B"; color = "#2C7A3C"; iconBg = "#D5EEDB"; }
          else if (isSelected && status === "wrong") { bg = "#FDEDEB"; border = T.coral; color = T.coralDeep; iconBg = "#FBD9D2"; }
          else if (status === "wrong" && !allowRetry && isCorrectOpt) { bg = "#EAF7EE"; border = "#5CB86B"; color = "#2C7A3C"; iconBg = "#D5EEDB"; }
          const optIcon = labelToIcon(opt);
          const bigPicture = !isCompareType && optIcon;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={status === "correct"}
              style={{
                minWidth: bigPicture ? 108 : 120,
                padding: bigPicture ? "12px 16px 14px" : optIcon ? "16px 22px 14px" : "18px 24px",
                borderRadius: 16, cursor: "pointer",
                fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 16.5,
                border: `2px solid ${border}`, background: bg, color,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: isSelected && status === "correct" ? "scd-bounce 0.4s ease" : "none",
              }}
            >
              {bigPicture ? (
                <Illustration name={optIcon} size={56} />
              ) : optIcon ? (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={optIcon} size={28} color={color} />
                </div>
              ) : null}
              {opt}
            </button>
          );
        })}
      </div>
      <Feedback
        status={status}
        correctText={question.feedback}
        retryText={question.retry_feedback}
        correctAnswer={correctAnswer}
        allowRetry={allowRetry}
        onRetry={() => { setSelected(null); setStatus("idle"); }}
      />
    </div>
  );
}
