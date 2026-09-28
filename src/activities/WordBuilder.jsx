// src/activities/WordBuilder.jsx
//
// Module 9's "word_build" activity type — hear (or, for dictation-style
// items, be shown) a target word, then assemble it by tapping letter
// tiles into order from a shuffled bank. Tap-to-place rather than
// drag-and-drop: far more reliable to implement and test on touch and
// mouse alike, and just as effective for teaching left-to-right letter
// sequencing. Reused unmodified by Module 11 (Spell Your First Words) —
// dictation is the same mechanic, just always audio-driven rather than
// sometimes-visible.
import React, { useState } from "react";
import { theme as T } from "../theme";
import { LetterTile } from "../components/LetterTile";
import { AudioPlayer } from "../components/AudioPlayer";
import { Feedback } from "../components/Feedback";
import { Btn } from "../components/Btn";
import { playSfx } from "../services/audioService";
import { shuffled } from "../services/shuffle";
import { answerTilesFor } from "../services/questionTypes";
import { useAutoSpeak } from "../hooks/useAutoSpeak";

export function WordBuilder({ question, onResult, allowRetry = true, ttsEnabled = true }) {
  const target = question.correct_answer;
  const audioAsset = question.audio_asset ?? question.audio;
  // Shuffled ONCE, then never reordered — every tile's identity is just
  // its stable position in THIS array (0..length-1), so duplicate letters
  // (e.g. "pop" needs two p-tiles) place and clear independently without
  // needing to look anything up by value.
  const [bank] = useState(() => shuffled(question.letters));
  // Number of tiles the child must place — normally one per character of
  // the target word, but a Level 2 item whose tiles include a whole
  // grapheme (e.g. "sh" as one tile for "ship") needs fewer slots than
  // target.length, hence answerTilesFor rather than target.length itself.
  const [slots, setSlots] = useState(() => new Array(answerTilesFor(question).length).fill(null)); // holds a bank position, or null
  const [status, setStatus] = useState("idle"); // idle | wrong | correct
  const [attempts, setAttempts] = useState(0);

  useAutoSpeak(question.prompt ?? question.question, ttsEnabled);

  const placedIndices = new Set(slots.filter((s) => s !== null));
  const nextEmptySlot = slots.indexOf(null);
  const isFull = nextEmptySlot === -1;

  const placeTile = (bankIdx) => {
    if (status !== "idle" || nextEmptySlot === -1 || placedIndices.has(bankIdx)) return;
    setSlots((prev) => {
      const next = [...prev];
      next[nextEmptySlot] = bankIdx;
      return next;
    });
  };

  const clearSlot = (slotIdx) => {
    if (status !== "idle") return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  };

  const resolve = (isCorrect) => {
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

  const check = () => {
    if (!isFull || status !== "idle") return;
    setAttempts((a) => a + 1);
    const built = slots.map((bankIdx) => bank[bankIdx]).join("");
    resolve(built === target);
  };

  const retry = () => {
    setSlots(new Array(target.length).fill(null));
    setStatus("idle");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, textAlign: "center", margin: 0 }}>
        {question.prompt ?? question.question}
      </p>
      {audioAsset && <AudioPlayer asset={audioAsset} />}

      {/* Slots: the word being assembled, left to right */}
      <div style={{ display: "flex", gap: 10 }}>
        {slots.map((bankIdx, slotIdx) => {
          const filled = bankIdx !== null;
          let state = "idle";
          if (status === "correct") state = "correct";
          else if (status === "wrong") state = "wrong";
          else if (filled) state = "picked";
          return (
            <LetterTile
              key={slotIdx}
              letter={filled ? bank[bankIdx] : ""}
              size={56}
              state={state}
              disabled={!filled || status !== "idle"}
              onClick={filled ? () => clearSlot(slotIdx) : undefined}
            />
          );
        })}
      </div>

      {/* Tile bank: tap to place into the next open slot */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }}>
        {bank.map((letter, i) => (
          <LetterTile
            key={i}
            letter={letter}
            size={52}
            disabled={placedIndices.has(i) || status !== "idle"}
            onClick={() => placeTile(i)}
          />
        ))}
      </div>

      {status === "idle" && (
        <Btn variant="gold" size="md" onClick={check} disabled={!isFull}>
          Check my word
        </Btn>
      )}
      <Feedback
        status={status}
        correctText={question.feedback}
        retryText={question.retry_feedback}
        correctAnswer={target}
        allowRetry={allowRetry}
        onRetry={retry}
      />
    </div>
  );
}
