// src/activities/SentenceBuilder.jsx
//
// Module 16's "sentence_build" activity type — the sentence-level sibling
// of WordBuilder: hear (or hold in mind) a target sentence, then assemble
// it by tapping WORD tiles into order from a shuffled bank, exactly the
// same tap-to-place/tap-to-clear interaction as letter tiles. The one
// real difference from WordBuilder is join(" ") instead of join("") —
// words need spaces between them, letters don't — which is reason enough
// to keep this a separate component rather than stretching WordBuilder
// to guess when to add spaces. Content always sets answer_tiles
// explicitly (e.g. ["The", "cat", "sat."]) since answerTilesFor's
// fallback (splitting correct_answer into characters) would be wrong
// here — a sentence is made of word tiles, not letter tiles.
import React, { useState } from "react";
import { theme as T } from "../theme";
import { WordTile } from "../components/WordTile";
import { AudioPlayer } from "../components/AudioPlayer";
import { Feedback } from "../components/Feedback";
import { Btn } from "../components/Btn";
import { playSfx } from "../services/audioService";
import { shuffled } from "../services/shuffle";
import { answerTilesFor } from "../services/questionTypes";
import { useAutoSpeak } from "../hooks/useAutoSpeak";

export function SentenceBuilder({ question, onResult, allowRetry = true, ttsEnabled = true }) {
  const target = question.correct_answer;
  const audioAsset = question.audio_asset ?? question.audio;
  const [bank] = useState(() => shuffled(question.letters));
  const [slots, setSlots] = useState(() => new Array(answerTilesFor(question).length).fill(null));
  const [status, setStatus] = useState("idle");
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
    const built = slots.map((bankIdx) => bank[bankIdx]).join(" ");
    resolve(built === target);
  };

  const retry = () => {
    setSlots(new Array(answerTilesFor(question).length).fill(null));
    setStatus("idle");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, textAlign: "center", margin: 0 }}>
        {question.prompt ?? question.question}
      </p>
      {audioAsset && <AudioPlayer asset={audioAsset} />}

      {/* Slots: the sentence being assembled, left to right */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
        {slots.map((bankIdx, slotIdx) => {
          const filled = bankIdx !== null;
          let state = "idle";
          if (status === "correct") state = "correct";
          else if (status === "wrong") state = "wrong";
          else if (filled) state = "picked";
          return (
            <WordTile
              key={slotIdx}
              word={filled ? bank[bankIdx] : "   "}
              state={state}
              disabled={!filled || status !== "idle"}
              onClick={filled ? () => clearSlot(slotIdx) : undefined}
            />
          );
        })}
      </div>

      {/* Tile bank: tap to place into the next open slot */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
        {bank.map((word, i) => (
          <WordTile
            key={i}
            word={word}
            disabled={placedIndices.has(i) || status !== "idle"}
            onClick={() => placeTile(i)}
          />
        ))}
      </div>

      {status === "idle" && (
        <Btn variant="gold" size="md" onClick={check} disabled={!isFull}>
          Check my sentence
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
