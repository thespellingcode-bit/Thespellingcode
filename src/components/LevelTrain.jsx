// src/components/LevelTrain.jsx
//
// Replaces the plain pill-row level switcher with a chugging train — one
// car per level, a locomotive up front, continuous wheel-spin/bob/smoke
// animation (all disabled under prefers-reduced-motion, see theme.js's
// useGlobalAnimations). Click behavior is identical to the row it
// replaces: unlocked cars select a level, locked cars are inert.
import React from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";

// Pastel palette already used for word-picture backgrounds (Illustration.jsx's
// IMAGE_BG) — reused here so the train reads as part of the same visual
// world instead of introducing a new, clashing color set.
const CAR_COLORS = ["#FFF3D6", "#DCEBFF", "#FDE0E8", "#E1F3E6", "#F1E3D3", "#E4E1EA"];

function Wheel({ cx, cy, r, spin }) {
  return (
    <g style={spin ? { transformOrigin: `${cx}px ${cy}px`, animation: "scd-wheel-spin 2.6s linear infinite" } : undefined}>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={T.ink} strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill={T.ink} />
      {[0, 60, 120].map((deg) => (
        <line
          key={deg}
          x1={cx} y1={cy}
          x2={cx + r * Math.cos((deg * Math.PI) / 180)}
          y2={cy + r * Math.sin((deg * Math.PI) / 180)}
          stroke={T.ink} strokeWidth="1.6"
        />
      ))}
    </g>
  );
}

function Locomotive() {
  return (
    <div style={{ flex: "0 0 auto", position: "relative" }}>
      <svg width="86" height="92" viewBox="0 0 86 92" style={{ display: "block", overflow: "visible" }}>
        {/* smoke */}
        <circle cx="18" cy="14" r="5" fill="#D9DCE6" style={{ animation: "scd-smoke 2.4s ease-out infinite", ["--sx"]: "-4px" }} />
        <circle cx="18" cy="14" r="4" fill="#D9DCE6" style={{ animation: "scd-smoke 2.4s ease-out infinite 0.8s", ["--sx"]: "2px" }} />
        <circle cx="18" cy="14" r="4.5" fill="#D9DCE6" style={{ animation: "scd-smoke 2.4s ease-out infinite 1.6s", ["--sx"]: "-2px" }} />
        {/* chimney */}
        <rect x="13" y="20" width="10" height="16" rx="2" fill={T.ink} />
        {/* cab + body */}
        <rect x="6" y="34" width="58" height="34" rx="10" fill={T.coral} stroke={T.ink} strokeWidth="2.4" />
        {/* sloped nose */}
        <path d="M64 36 L80 50 L80 60 Q80 68 72 68 L64 68 Z" fill={T.coral} stroke={T.ink} strokeWidth="2.4" strokeLinejoin="round" />
        {/* cab window */}
        <rect x="16" y="42" width="18" height="16" rx="4" fill="#DCEBFF" stroke={T.ink} strokeWidth="2" />
        {/* cowcatcher */}
        <path d="M76 68 L86 68 L80 76 L72 76 Z" fill={T.ink} />
        {/* coupling */}
        <rect x="2" y="56" width="6" height="6" rx="1.5" fill={T.ink} />
        <Wheel cx={22} cy={74} r={12} spin />
        <Wheel cx={52} cy={74} r={9} spin />
      </svg>
    </div>
  );
}

function Car({ level, isSelected, onSelect, colorIndex }) {
  const color = CAR_COLORS[colorIndex % CAR_COLORS.length];
  const { unlocked, complete } = level;
  return (
    <button
      disabled={!unlocked}
      onClick={() => unlocked && onSelect(level.id)}
      aria-pressed={isSelected}
      style={{
        flex: "0 0 auto", border: "none", background: "none", padding: 0, cursor: unlocked ? "pointer" : "not-allowed",
        position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
        animation: unlocked ? "scd-train-bob 1.8s ease-in-out infinite" : undefined,
        animationDelay: `${(colorIndex % 4) * 0.15}s`,
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      {complete && (
        <div style={{
          position: "absolute", top: -16, right: 6, width: 0, height: 0,
          borderLeft: "14px solid " + T.gold, borderTop: "9px solid transparent", borderBottom: "9px solid transparent",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
        }} />
      )}
      {complete && <div style={{ position: "absolute", top: -16, right: 20, width: 2, height: 24, background: T.ink }} />}
      <svg width="96" height="86" viewBox="0 0 96 86" style={{ display: "block", overflow: "visible" }}>
        {/* coupling link to previous car */}
        <rect x="-6" y="40" width="10" height="6" rx="1.5" fill={T.ink} />
        {/* body */}
        <rect
          x="4" y="14" width="80" height="44" rx="12"
          fill={isSelected ? "#FFFBEF" : color}
          stroke={isSelected ? T.gold : T.ink}
          strokeWidth={isSelected ? 3 : 2.2}
        />
        {/* roof strip */}
        <rect x="4" y="14" width="80" height="9" rx="4" fill={isSelected ? T.gold : "rgba(0,0,0,0.08)"} />
        {/* porthole window */}
        <circle cx="44" cy="40" r="16" fill="#fff" stroke={T.ink} strokeWidth="2.2" />
        <Wheel cx={24} cy={62} r={10} spin={unlocked} />
        <Wheel cx={64} cy={62} r={10} spin={unlocked} />
      </svg>
      {/* window content: number, lock, or check — kept as normal DOM so
          text rendering/line-height matches the rest of the app instead
          of fighting SVG <text> metrics. */}
      <div style={{ position: "absolute", top: 24, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {!unlocked ? (
          <Icon name="lock" size={18} color={T.textMute} />
        ) : complete ? (
          <Icon name="check" size={20} color={T.gold} />
        ) : (
          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 18, color: T.ink }}>{level.id}</span>
        )}
      </div>
      <div style={{ marginTop: 4, maxWidth: 90, textAlign: "center" }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 12.5, color: unlocked ? T.ink : T.textMute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {level.info?.level_name || `Level ${level.id}`}
        </div>
        {unlocked && (
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10.5, fontWeight: 600, color: complete ? "#2C7A3C" : T.textMute }}>
            {complete ? "Complete!" : `${level.mastered}/${level.total}`}
          </div>
        )}
      </div>
    </button>
  );
}

export function LevelTrain({ levelSummaries, selectedLevel, onSelect }) {
  return (
    <div style={{
      position: "relative", marginBottom: 18, paddingBottom: 10,
      background: `repeating-linear-gradient(90deg, ${T.line} 0 18px, transparent 18px 34px)`,
      backgroundPosition: "0 78px", backgroundSize: "34px 4px", backgroundRepeat: "repeat-x",
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, overflowX: "auto", paddingTop: 6, paddingBottom: 14 }}>
        <Locomotive />
        {levelSummaries.map((lv, i) => (
          <Car key={lv.id} level={lv} isSelected={lv.id === selectedLevel} onSelect={onSelect} colorIndex={i} />
        ))}
      </div>
      {/* rail line under everything */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 4, background: T.ink, opacity: 0.25, borderRadius: 2 }} />
    </div>
  );
}
