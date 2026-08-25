// src/components/Illustration.jsx
//
// Bigger, full-color "hero" pictures — distinct from Icon.jsx's small
// single-stroke outlines. Icon.jsx stays monochrome on purpose (its color
// prop signals correct/wrong state on answer buttons); these illustrations
// own their own palette and are used wherever a sound/concept is the main
// visual focus: the AudioPlayer picture, the Model/demo stage, and the
// narration hero circle. Still 100% inline SVG — no external assets.
import React from "react";

const BG = {
  bell: "#FFF3D6", clock: "#FDE9D2", car: "#DCEBFF", rain: "#DCEEF6",
  clap: "#FFE7E0", tap: "#FFE7E0", drum: "#F1E3D3", whisper: "#E8E6F7",
  finger: "#FFE7E0", same: "#E1F3E6", different: "#FDEBE4", fast: "#FFF3D6",
  slow: "#E1F3E6", magnifier: "#FDE9D2", cat: "#FFE9D6", hat: "#FDE0E8",
  mat: "#E4EFFB", bat: "#EAE2F7", can: "#DCEBFF", man: "#FDE9D2",
  fan: "#E1F3E6", pan: "#F1E3D3", dog: "#F1E3D3", log: "#EAE2D3",
  hen: "#FDE9D2", pen: "#DCEBFF", cap: "#FFE7E0", map: "#E1F3E6", nap: "#E8E6F7",
  phone: "#E8E6F7", wind: "#DCEEF6",
  pattern: "#F2EFE6",
};

function Bubble({ children, bg }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ display: "block" }}>
      <circle cx="60" cy="60" r="58" fill={bg} />
      {children}
    </svg>
  );
}

const PICTURES = {
  bell: (
    <>
      <path d="M60 24c-3 0-5.5 2.4-5.5 5.4v2C43 33.6 37 41 37 51v16l-7 11h60l-7-11V51c0-10-6-17.4-17.5-19.6v-2c0-3-2.5-5.4-5.5-5.4z" fill="#F2B705" stroke="#C99400" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 82a12 12 0 0024 0" fill="none" stroke="#C99400" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="48" cy="45" r="4" fill="#FFE9AE" opacity="0.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="60" cy="60" r="34" fill="#FFF9EE" stroke="#C99400" strokeWidth="4" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line key={deg} x1="60" y1="30" x2="60" y2="35" stroke="#C99400" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${deg} 60 60)`} />
      ))}
      <line x1="60" y1="60" x2="60" y2="40" stroke="#1F2246" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="76" y2="66" stroke="#FF6F59" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="60" r="4" fill="#1F2246" />
    </>
  ),
  car: (
    <>
      <rect x="24" y="66" width="72" height="18" rx="6" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.5" />
      <path d="M32 66l6-16a6 6 0 016-4h32a6 6 0 016 4l6 16z" fill="#6FA4FF" stroke="#2B5FCC" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 51l4-8h28l4 8z" fill="#CFE4FF" opacity="0.85" />
      <circle cx="40" cy="86" r="7" fill="#2C2E4A" />
      <circle cx="40" cy="86" r="2.6" fill="#C7CBE8" />
      <circle cx="80" cy="86" r="7" fill="#2C2E4A" />
      <circle cx="80" cy="86" r="2.6" fill="#C7CBE8" />
      <circle cx="92" cy="72" r="2.6" fill="#FF6F59" />
    </>
  ),
  rain: (
    <>
      <path d="M32 54a16 16 0 0116-16 18 18 0 0117.6 14A14 14 0 0164 80H33a14 14 0 01-1-27.9z" fill="#B9D9E8" stroke="#5D8FA6" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="46" cy="46" r="4" fill="#fff" opacity="0.55" />
      <path d="M40 88l-4 10M56 88l-4 10M72 88l-4 10" stroke="#4C8DFF" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  clap: (
    <>
      <path d="M40 74l12-30 9 2.5-10 30z" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M80 74l-12-30-9 2.5 10 30z" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M60 32l2 10M48 84h24" stroke="#C97B4E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M34 46l-6-4M86 46l6-4M60 26l0-7" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  tap: (
    <>
      <circle cx="60" cy="60" r="10" fill="#FF6F59" />
      <circle cx="60" cy="60" r="20" fill="none" stroke="#FF6F59" strokeWidth="3" opacity="0.55" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#FF6F59" strokeWidth="2.4" opacity="0.3" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#FF6F59" strokeWidth="1.8" opacity="0.18" />
    </>
  ),
  drum: (
    <>
      <ellipse cx="60" cy="42" rx="30" ry="10" fill="#FBEFDD" stroke="#A6733E" strokeWidth="2.5" />
      <path d="M30 42v26a30 10 0 0060 0V42" fill="#C98A4E" stroke="#A6733E" strokeWidth="2.5" />
      <path d="M30 55h60M30 42a30 10 0 0060 0" fill="none" stroke="#A6733E" strokeWidth="1.6" opacity="0.5" />
      <path d="M38 34l-8-10M82 34l8-10" stroke="#7A5230" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  whisper: (
    <>
      <circle cx="52" cy="56" r="20" fill="#E3DEFB" stroke="#8B7FD1" strokeWidth="2.4" />
      <path d="M46 60c1.5 2 3.5 3 6 3s4.5-1 6-3" fill="none" stroke="#5A4C9E" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="46" cy="52" r="2" fill="#5A4C9E" />
      <circle cx="58" cy="52" r="2" fill="#5A4C9E" />
      <path d="M76 48a10 10 0 010 16M84 42a18 18 0 010 28" fill="none" stroke="#8B7FD1" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="3 5" />
    </>
  ),
  finger: (
    <>
      <path d="M54 40v20M54 40a5 5 0 0110 0v20M54 60a10 10 0 0020 0v-10a5 5 0 00-10 0" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 60v6a18 18 0 0036 0v-4" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="80" cy="46" r="4" fill="#FF6F59" opacity="0.7" />
      <circle cx="86" cy="56" r="2.6" fill="#FF6F59" opacity="0.5" />
    </>
  ),
  same: (
    <>
      <circle cx="42" cy="60" r="18" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.6" />
      <circle cx="78" cy="60" r="18" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.6" />
      <path d="M56 60h8" stroke="#2C7A3C" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  different: (
    <>
      <circle cx="40" cy="60" r="17" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.6" />
      <rect x="66" y="43" width="34" height="34" rx="8" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.6" />
    </>
  ),
  fast: (
    <>
      <path d="M66 26L40 66h16l-6 28 30-42H64z" fill="#F2B705" stroke="#C99400" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M20 50h10M18 62h8M22 74h10" stroke="#C99400" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  slow: (
    <>
      <ellipse cx="62" cy="70" rx="26" ry="16" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.6" />
      <circle cx="34" cy="62" r="11" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.6" />
      <circle cx="30" cy="60" r="2" fill="#1F2246" />
      <path d="M46 82l-6 8M78 82l6 8M50 50l6-8M74 50l6 8" stroke="#2C7A3C" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="52" cy="52" r="24" fill="#DCEEF6" stroke="#C99400" strokeWidth="4.5" />
      <path d="M70 70l18 18" stroke="#C99400" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  cat: (
    <>
      <path d="M40 44l-6-16 16 10zM80 44l6-16-16 10z" fill="#F2B705" />
      <circle cx="60" cy="58" r="26" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" />
      <circle cx="50" cy="54" r="3" fill="#1F2246" />
      <circle cx="70" cy="54" r="3" fill="#1F2246" />
      <path d="M58 62h4l-2 3z" fill="#CC4A37" />
      <path d="M36 66h-10M36 70h-11M84 66h10M84 70h11" stroke="#1F2246" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  hat: (
    <>
      <ellipse cx="60" cy="82" rx="34" ry="8" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" />
      <path d="M42 82l6-38a12 12 0 0124 0l6 38z" fill="#FF8B72" stroke="#CC4A37" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="44" y="70" width="32" height="7" fill="#CC4A37" opacity="0.6" />
    </>
  ),
  mat: (
    <>
      <rect x="26" y="40" width="68" height="46" rx="8" fill="#6FA4FF" stroke="#2B5FCC" strokeWidth="2.6" />
      <rect x="34" y="48" width="52" height="30" rx="4" fill="#CFE4FF" />
      <path d="M34 58h52M34 68h52" stroke="#6FA4FF" strokeWidth="2" opacity="0.6" />
    </>
  ),
  bat: (
    <>
      <rect x="52" y="26" width="10" height="52" rx="4" fill="#C98A4E" stroke="#8B5E30" strokeWidth="2.2" />
      <path d="M52 30a26 20 0 000 44z" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="2.2" strokeLinejoin="round" />
    </>
  ),
  can: (
    <>
      <rect x="40" y="34" width="40" height="52" rx="6" fill="#6FA4FF" stroke="#2B5FCC" strokeWidth="2.6" />
      <ellipse cx="60" cy="34" rx="20" ry="6" fill="#CFE4FF" stroke="#2B5FCC" strokeWidth="2.2" />
      <path d="M40 50h40" stroke="#2B5FCC" strokeWidth="1.8" opacity="0.5" />
    </>
  ),
  man: (
    <>
      <circle cx="60" cy="42" r="14" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.4" />
      <path d="M40 90c0-16 9-26 20-26s20 10 20 26z" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.4" strokeLinejoin="round" />
    </>
  ),
  fan: (
    <>
      <circle cx="60" cy="60" r="6" fill="#2C2E4A" />
      {[0, 90, 180, 270].map((deg) => (
        <path key={deg} d="M60 60 Q78 46 60 30 Q42 46 60 60" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="1.8" transform={`rotate(${deg} 60 60)`} />
      ))}
    </>
  ),
  pan: (
    <>
      <ellipse cx="54" cy="58" rx="22" ry="14" fill="#B9BFCB" stroke="#6E7488" strokeWidth="2.4" />
      <ellipse cx="54" cy="55" rx="22" ry="8" fill="#DADFE6" />
      <path d="M76 58h20" stroke="#6E7488" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  dog: (
    <>
      <ellipse cx="46" cy="38" rx="12" ry="16" fill="#C98A4E" transform="rotate(-20 46 38)" />
      <ellipse cx="74" cy="38" rx="12" ry="16" fill="#C98A4E" transform="rotate(20 74 38)" />
      <circle cx="60" cy="58" r="26" fill="#E0AD70" stroke="#A6733E" strokeWidth="2.4" />
      <circle cx="52" cy="56" r="3" fill="#1F2246" />
      <circle cx="68" cy="56" r="3" fill="#1F2246" />
      <ellipse cx="60" cy="66" rx="4" ry="3" fill="#1F2246" />
    </>
  ),
  log: (
    <>
      <rect x="28" y="48" width="64" height="24" rx="12" fill="#A6733E" stroke="#7A5230" strokeWidth="2.4" />
      <ellipse cx="28" cy="60" rx="10" ry="12" fill="#D9B98A" stroke="#7A5230" strokeWidth="2.2" />
      <circle cx="28" cy="60" r="4" fill="#A6733E" />
      <path d="M40 52q6 8 0 16M56 52q6 8 0 16M72 52q6 8 0 16" fill="none" stroke="#7A5230" strokeWidth="1.6" opacity="0.6" />
    </>
  ),
  hen: (
    <>
      <ellipse cx="58" cy="64" rx="26" ry="20" fill="#FDE9D2" stroke="#C99400" strokeWidth="2.4" />
      <circle cx="82" cy="48" r="12" fill="#FDE9D2" stroke="#C99400" strokeWidth="2.4" />
      <circle cx="86" cy="46" r="2.2" fill="#1F2246" />
      <path d="M94 50l8 3-8 3z" fill="#F2B705" />
      <path d="M76 38q4-8 10-6q-2 8-10 6z" fill="#FF6F59" />
    </>
  ),
  pen: (
    <>
      <rect x="50" y="26" width="12" height="60" rx="4" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.2" transform="rotate(20 56 56)" />
      <path d="M76 78l6 14-14-6z" fill="#1F2246" transform="rotate(20 56 56)" />
    </>
  ),
  cap: (
    <>
      <path d="M30 66a30 24 0 0160 0z" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M60 42a24 24 0 0124 24H36a24 24 0 0124-24z" fill="#FF8B72" stroke="#CC4A37" strokeWidth="2.4" />
      <circle cx="60" cy="40" r="4" fill="#CC4A37" />
    </>
  ),
  map: (
    <>
      <path d="M32 34l20 8 20-8 20 8v46l-20-8-20 8-20-8z" fill="#F2EAD0" stroke="#A6733E" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M52 42v46M72 34v46" stroke="#A6733E" strokeWidth="1.6" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="62" cy="58" r="4" fill="#FF6F59" />
    </>
  ),
  nap: (
    <>
      <path d="M72 32a24 24 0 1014 30 18 18 0 01-14-30z" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="2.4" strokeLinejoin="round" />
      <text x="52" y="86" fontSize="20" fontFamily="'Baloo 2', sans-serif" fill="#5A4C9E" fontWeight="700">Zzz</text>
    </>
  ),
  phone: (
    <>
      <rect x="42" y="26" width="36" height="64" rx="10" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="2.4" />
      <rect x="48" y="34" width="24" height="40" rx="3" fill="#E3DEFB" />
      <circle cx="60" cy="82" r="2.6" fill="#E3DEFB" />
      <path d="M84 42a18 18 0 010 18" fill="none" stroke="#F2B705" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M92 34a30 30 0 010 34" fill="none" stroke="#F2B705" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  wind: (
    <>
      <path d="M22 46h48a10 10 0 10-8-16" fill="none" stroke="#5D8FA6" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M22 62h58a10 10 0 11-8 16" fill="none" stroke="#5D8FA6" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M22 78h36a8 8 0 106-13" fill="none" stroke="#5D8FA6" strokeWidth="4.2" strokeLinecap="round" />
    </>
  ),
  pattern: (
    <>
      <circle cx="34" cy="60" r="8" fill="#F2B705" />
      <rect x="52" y="52" width="16" height="16" fill="#FF6F59" rx="3" />
      <circle cx="86" cy="60" r="8" fill="none" stroke="#5CB86B" strokeWidth="3" />
    </>
  ),
};

export function Illustration({ name = "pattern", size = 96 }) {
  const key = PICTURES[name] ? name : "pattern";
  return (
    <div style={{ width: size, height: size }}>
      <Bubble bg={BG[key] || BG.pattern}>{PICTURES[key]}</Bubble>
    </div>
  );
}
