// src/components/AudioPlayer.jsx
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon, iconForAsset } from "./Icon";
import { Illustration } from "./Illustration";
import { playAsset, assetDurationMs } from "../services/audioService";

// A note on scope: this plays the placeholder synthesized sounds today.
// When real audio files exist, this component's job stays the same
// (play / replay / clear visual feedback / disabled-while-playing) —
// only playAsset() in audioService needs to change to play real files.
export function AudioPlayer({ asset, label = "Play sound" }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (playing) return;
    playAsset(asset);
    setPlaying(true);
    setTimeout(() => setPlaying(false), assetDurationMs(asset));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Illustration name={iconForAsset(asset)} size={84} />
      <button
        onClick={handlePlay}
        disabled={playing}
        aria-label={label}
        style={{
          width: 88, height: 88, borderRadius: "50%", border: "none",
          background: playing ? T.gold : T.ink, cursor: playing ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? `0 0 0 8px ${T.mist}` : "none",
          transition: "box-shadow 0.25s ease, background 0.15s ease",
          opacity: playing ? 0.85 : 1,
        }}
      >
        <Icon name="play" size={38} color="#fff" />
      </button>
      <div style={{ display: "flex", gap: 3, height: 16, alignItems: "flex-end" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              width: 4, borderRadius: 2, background: T.goldDeep,
              height: playing ? [6, 14, 8, 16, 10][i] : 4,
              transition: "height 0.2s ease",
              opacity: playing ? 1 : 0.3,
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: T.textMute }}>
        Tap to listen
      </span>
    </div>
  );
}
