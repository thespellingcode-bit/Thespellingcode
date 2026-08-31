// src/hooks/useAutoSpeak.js
//
// Reads narration/prompt text aloud once when it changes, so pre-readers
// don't have to read the screen themselves. Gated by the caller's
// `enabled` flag (see ttsPreference.js) — tap-to-hear sounds (word cards,
// options) are a separate path entirely and unaffected by this.
import { useEffect } from "react";
import { speak } from "../services/audioService";

export function useAutoSpeak(text, enabled) {
  useEffect(() => {
    if (!enabled || !text) return;
    speak(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);
}
