// src/components/Onboarding.jsx
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";
import { Btn } from "./Btn";

const AVATARS = ["🦊", "🐼", "🦉", "🐸", "🐨", "🐧", "🦁", "🐰"];

export function Onboarding({ onCreate }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <div style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 440, width: "100%", background: T.panel, borderRadius: 24, padding: "2.2rem 2rem", border: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Icon name="magnifier" size={46} color={T.gold} />
        </div>
        <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, color: T.ink, textAlign: "center", margin: "0 0 4px" }}>
          Welcome to The Spelling Code
        </h1>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, textAlign: "center", margin: "0 0 24px" }}>
          Let's set up your Sound Detective.
        </p>
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: T.inkSoft }}>Child's name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maya"
          style={{
            width: "100%", boxSizing: "border-box", marginTop: 6, marginBottom: 18, padding: "12px 14px",
            borderRadius: 12, border: `1.5px solid ${T.line}`, fontFamily: "'Manrope', sans-serif", fontSize: 15, outline: "none",
          }}
        />
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: T.inkSoft }}>Pick an avatar</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 8, marginBottom: 24 }}>
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              style={{
                fontSize: 28, padding: "10px 0", borderRadius: 14, cursor: "pointer",
                border: a === avatar ? `2px solid ${T.gold}` : `1.5px solid ${T.line}`,
                background: a === avatar ? T.mist : "#fff",
              }}
            >
              {a}
            </button>
          ))}
        </div>
        <Btn
          variant="gold" size="lg" style={{ width: "100%" }}
          disabled={!name.trim()}
          onClick={() => onCreate({ child_id: `child_${Date.now()}`, name: name.trim(), avatar, createdAt: Date.now() })}
        >
          Start exploring
        </Btn>
      </div>
    </div>
  );
}
