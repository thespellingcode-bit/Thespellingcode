// src/components/NarrationScreen.jsx
import React from "react";
import { theme as T } from "../theme";
import { Icon, iconForAsset } from "./Icon";
import { Btn } from "./Btn";

export function NarrationScreen({ text, illustrationAsset = "magnifier", buttonLabel = "Continue", onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, textAlign: "center", padding: "20px 10px" }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: T.mist, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={iconForAsset(illustrationAsset)} size={48} color={T.goldDeep} />
      </div>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 21, color: T.ink, maxWidth: 420, margin: 0, lineHeight: 1.4 }}>{text}</p>
      <Btn variant="gold" size="lg" onClick={onNext}>{buttonLabel}</Btn>
    </div>
  );
}
