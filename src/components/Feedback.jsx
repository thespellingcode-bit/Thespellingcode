// src/components/Feedback.jsx
import React from "react";
import { theme as T } from "../theme";
import { Btn } from "./Btn";

export function Feedback({ status, correctText, retryText, correctAnswer, allowRetry, onRetry }) {
  if (status === "correct") {
    return <p style={{ fontFamily: "'Manrope', sans-serif", color: "#2C7A3C", fontWeight: 600, fontSize: 14 }}>{correctText || "Correct!"}</p>;
  }
  if (status === "wrong" && allowRetry) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Manrope', sans-serif", color: T.coralDeep, fontWeight: 600, fontSize: 14, margin: "0 0 10px" }}>
          {retryText || "Try again."}
        </p>
        <Btn size="sm" variant="outline" onClick={onRetry}>Try again</Btn>
      </div>
    );
  }
  if (status === "wrong" && !allowRetry) {
    return (
      <p style={{ fontFamily: "'Manrope', sans-serif", color: T.coralDeep, fontWeight: 600, fontSize: 14 }}>
        Not quite — the answer was {correctAnswer}.
      </p>
    );
  }
  return null;
}
