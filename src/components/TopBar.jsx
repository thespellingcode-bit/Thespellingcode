// src/components/TopBar.jsx
import React from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";

export function TopBar({ view, setView, profile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${T.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="magnifier" size={26} color={T.gold} />
        <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, color: T.ink }}>The Spelling Code</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setView("child")}
          style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, cursor: "pointer",
            border: `1.5px solid ${view === "child" ? T.ink : T.line}`,
            background: view === "child" ? T.ink : "transparent", color: view === "child" ? "#fff" : T.inkSoft,
          }}
        >
          {profile?.avatar} Child view
        </button>
        <button
          onClick={() => setView("parent")}
          style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, cursor: "pointer",
            border: `1.5px solid ${view === "parent" ? T.ink : T.line}`,
            background: view === "parent" ? T.ink : "transparent", color: view === "parent" ? "#fff" : T.inkSoft,
          }}
        >
          Parent dashboard
        </button>
      </div>
    </div>
  );
}
