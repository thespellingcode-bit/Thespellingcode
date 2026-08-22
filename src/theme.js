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
