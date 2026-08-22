// src/components/Badge.jsx
import React from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";

export function Badge({ name, earned, locked }) {
  if (locked) {
    return (
      <div style={{ width: 108, textAlign: "center", padding: "16px 8px", borderRadius: 16, border: `1.5px dashed ${T.line}`, opacity: 0.45 }}>
        <Icon name="lock" size={26} color={T.textMute} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: T.textMute, marginTop: 6 }}>{name}</div>
      </div>
    );
  }
  return (
    <div style={{
      width: 108, textAlign: "center", padding: "16px 8px", borderRadius: 16,
      border: `1.5px solid ${earned ? T.gold : T.line}`, background: earned ? "#FFFBEF" : "#fff", opacity: earned ? 1 : 0.6,
    }}>
      <Icon name="star" size={30} color={earned ? T.gold : T.mistDeep} />
      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 12.5, fontWeight: 600, color: T.ink, marginTop: 6 }}>{name}</div>
    </div>
  );
}
