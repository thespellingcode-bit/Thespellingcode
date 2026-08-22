// src/theme.js
export const theme = {
  ink: "#1F2246",
  inkSoft: "#3A3D6B",
  paper: "#FAF9F4",
  panel: "#FFFFFF",
  mist: "#E4EEE9",
  mistDeep: "#CFE3DA",
  gold: "#F2B705",
  goldDeep: "#C99400",
  coral: "#FF6F59",
  coralDeep: "#CC4A37",
  line: "#E3E0D4",
  textMute: "#6B6E8F",
};

const FONT_LINK_ID = "scd-fonts";
export function useFonts() {
  if (typeof document === "undefined" || document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

// Small shared keyframes for fun-factor micro-interactions (streak badge
// pop, correct-answer bounce, celebration burst). Injected once globally
// since this project has no CSS file — everything else is inline styles.
const STYLE_TAG_ID = "scd-anim-styles";
export function useGlobalAnimations() {
  if (typeof document === "undefined" || document.getElementById(STYLE_TAG_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    @keyframes scd-pop {
      0% { transform: scale(0.7); opacity: 0; }
      60% { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1); }
    }
    @keyframes scd-bounce {
      0%, 100% { transform: scale(1); }
      35% { transform: scale(1.14); }
      60% { transform: scale(0.96); }
    }
    @keyframes scd-confetti-fall {
      0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--dx), 160px) rotate(var(--rot)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
