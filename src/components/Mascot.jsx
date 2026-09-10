// src/components/Mascot.jsx
//
// A single recurring character (a fox detective, tying into the "Sound
// Detective" / "Letter Detective" narration voice already used throughout
// the lesson content) for the app's biggest emotional moment — the
// end-of-lesson result screen. Deliberately NOT a new color: every fill
// below is an existing theme.js token or an existing Illustration.jsx fur
// tone, so this adds personality without adding visual noise.
//
// Two poses only, matching ResultScreen's two outcomes:
//   "celebrate" — mastered a lesson
//   "encourage" — good try, not yet at mastery (supportive, never sad)
import React from "react";
import { theme as T } from "../theme";

const FUR = "#E0AD70";
const FUR_DEEP = "#C98A4E";
const FUR_DARK = "#A6733E";
const BELLY = "#FBEFDD";

function FoxBase({ children }) {
  return (
    <>
      {/* ears */}
      <path d="M40 40l-8-22 20 14z" fill={FUR} stroke={FUR_DARK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M80 40l8-22-20 14z" fill={FUR} stroke={FUR_DARK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M36 36l-3-9 8 6z" fill={FUR_DEEP} />
      <path d="M84 36l3-9-8 6z" fill={FUR_DEEP} />
      {/* head */}
      <circle cx="60" cy="58" r="27" fill={FUR} stroke={FUR_DARK} strokeWidth="2.4" />
      {/* cheeks / muzzle */}
      <path d="M60 62a17 13 0 100 22 17 13 0 000-22z" fill={BELLY} />
      {children}
      {/* neckerchief — a nod to "detective on a case" */}
      <path d="M44 78q16 8 32 0l-4 10a24 8 0 01-24 0z" fill={T.coral} stroke={T.coralDeep} strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}

function CelebrateFace() {
  return (
    <>
      <path d="M48 54q3-5 8-3" fill="none" stroke={T.ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M72 54q-3-5-8-3" fill="none" stroke={T.ink} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="68" r="2.6" fill={T.ink} />
      <path d="M52 74q8 6 16 0" fill="none" stroke={T.ink} strokeWidth="2.2" strokeLinecap="round" />
      {/* raised paws */}
      <circle cx="28" cy="52" r="8" fill={FUR} stroke={FUR_DARK} strokeWidth="2" />
      <circle cx="92" cy="52" r="8" fill={FUR} stroke={FUR_DARK} strokeWidth="2" />
      <path d="M30 60q-4 14 0 24" fill="none" stroke={FUR_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M90 60q4 14 0 24" fill="none" stroke={FUR_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

function EncourageFace() {
  return (
    <>
      <circle cx="52" cy="55" r="2.6" fill={T.ink} />
      <circle cx="68" cy="55" r="2.6" fill={T.ink} />
      <path d="M52 72q8 5 16 0" fill="none" stroke={T.ink} strokeWidth="2.2" strokeLinecap="round" />
      {/* one paw up in a gentle thumbs-up, matching the "Good try!" warmth */}
      <circle cx="86" cy="60" r="8" fill={FUR} stroke={FUR_DARK} strokeWidth="2" />
      <path d="M84 54v-6a3 3 0 016 0v6" fill={FUR} stroke={FUR_DARK} strokeWidth="1.8" />
      <path d="M40 84q-6 8-4 18" fill="none" stroke={FUR_DARK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

export function Mascot({ pose = "celebrate", size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block", animation: pose === "celebrate" ? "scd-bounce 0.6s ease" : "none" }}>
      <circle cx="60" cy="60" r="58" fill={pose === "celebrate" ? "#FFF3D6" : T.mist} />
      <FoxBase>{pose === "celebrate" ? <CelebrateFace /> : <EncourageFace />}</FoxBase>
    </svg>
  );
}
