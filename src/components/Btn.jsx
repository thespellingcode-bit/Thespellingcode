// src/components/Btn.jsx
import React from "react";
import { theme as T } from "../theme";

export function Btn({ children, onClick, variant = "primary", size = "md", disabled, style }) {
  const sizes = { sm: { padding: "8px 16px", fontSize: 14 }, md: { padding: "12px 22px", fontSize: 16 }, lg: { padding: "16px 30px", fontSize: 19 } };
  const variants = {
    primary: { background: T.ink, color: "#fff", border: "none" },
    gold: { background: T.gold, color: T.ink, border: "none" },
    outline: { background: "transparent", color: T.ink, border: `2px solid ${T.ink}` },
    ghost: { background: "transparent", color: T.inkSoft, border: "none" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 600,
        borderRadius: 999,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "transform 0.12s ease",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}
