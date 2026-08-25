// src/components/NarrationScreen.jsx
import React from "react";
import { theme as T } from "../theme";
import { iconForAsset } from "./Icon";
import { Illustration } from "./Illustration";
import { Btn } from "./Btn";

export function NarrationScreen({ text, illustrationAsset = "magnifier", buttonLabel = "Continue", onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, textAlign: "center", padding: "20px 10px" }}>
      <Illustration name={iconForAsset(illustrationAsset)} size={104} />
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 21, color: T.ink, maxWidth: 420, margin: 0, lineHeight: 1.4 }}>{text}</p>
      <Btn variant="gold" size="lg" onClick={onNext}>{buttonLabel}</Btn>
    </div>
  );
}
