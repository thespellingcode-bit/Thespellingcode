// src/services/ttsPreference.js
//
// Whether narration/prompts read aloud automatically. Plain localStorage
// (not React state) so every part of the tree that needs the current
// value — LessonPlayer's header toggle, every screen's useAutoSpeak call —
// reads/writes the same flag without threading it through the whole app.
const KEY = "spelling-code-tts-enabled";

export function isTtsEnabled() {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? true : v === "1";
  } catch (e) {
    return true;
  }
}

export function setTtsEnabled(on) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch (e) {
    // ignore — worst case the preference doesn't persist this session
  }
}
