// src/components/WordSoundRow.jsx
//
// Individual per-word playback: each word gets its own picture and its own
// tap-to-hear button, no merged "say:a, b, c" phrase. Used wherever a rhyme
// comparison needs a child to hear each word separately rather than parse
// one run-on TTS sentence — the model/example carousel's worked examples,
// and Odd One Out's three candidate words.
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon, labelToIcon } from "./Icon";
import { Illustration } from "./Illustration";
import { playAsset, assetDurationMs } from "../services/audioService";

function WordCard({ word }) {
  const [playing, setPlaying] = useState(false);
  const asset = `say:${word.toLowerCase()}`;

  const handlePlay = () => {
    if (playing) return;
    playAsset(asset);
    setPlaying(true);
    setTimeout(() => setPlaying(false), assetDurationMs(asset));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Illustration name={labelToIcon(word) || "pattern"} size={64} />
      <button
        onClick={handlePlay}
        disabled={playing}
        aria-label={`Play ${word}`}
        style={{
          width: 52, height: 52, borderRadius: "50%", border: "none",
          background: playing ? T.gold : T.ink, cursor: playing ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? `0 0 0 6px ${T.mist}` : "none",
          transition: "box-shadow 0.25s ease, background 0.15s ease",
        }}
      >
        <Icon name="play" size={22} color="#fff" />
      </button>
      <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 14, color: T.ink }}>
        {word}
      </span>
    </div>
  );
}

export function WordSoundRow({ words }) {
  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
      {words.map((w, i) => <WordCard key={`${w}-${i}`} word={w} />)}
    </div>
  );
}
