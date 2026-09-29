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
  phone: "#E8E6F7", wind: "#DCEEF6", siren: "#FDEBE4", thunder: "#E4E1EA",
  birds: "#E1F3E6", drip: "#DCEEF6",
  bag: "#DCEBFF", tag: "#FDE9D2", rag: "#E1F3E6", net: "#DCEEF6", jet: "#DCEBFF",
  vet: "#E1F3E6", fig: "#EAE2F7", wig: "#F1E3D3", mop: "#DCEEF6", pop: "#FDEBE4",
  top: "#FFF3D6",
  sun: "#FFF3D6", sit: "#F1E3D3", sad: "#DCEEF6",
  cup: "#E1F3E6", bus: "#FDE9D2",
  kid: "#FDEBE4", run: "#E1F3E6", lip: "#FFE7E0", dad: "#DCEBFF", gum: "#E8E6F7",
  sip: "#DCEBFF", pin: "#FDE9D2",
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
      <path d="M58 88 L58 70 C58 55 50 50 48 38 C46 26 52 18 60 18 C68 18 74 26 72 38 C70 50 62 55 62 70 L62 88 Z" fill="#C98A4E" stroke="#8B5E30" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M57 88h6M56 82h8M57 76h6" stroke="#6B4522" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
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
      <text x="52" y="86" fontSize="20" fontFamily="'Baloo 2', sans-serif" fill="#5A4C9E" fontWeight="700" aria-hidden="true">Zzz</text>
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
  siren: (
    <>
      <rect x="40" y="52" width="40" height="24" rx="6" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" />
      <path d="M46 52a14 10 0 0128 0z" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.2" />
      <circle cx="60" cy="46" r="4" fill="#FFF3D6" />
      <path d="M28 38l7 7M92 38l-7 7M60 24v9" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  thunder: (
    <>
      <path d="M32 52a16 16 0 0116-16 18 18 0 0117.6 14A14 14 0 0164 78H33a14 14 0 01-1-27.9z" fill="#8B8FA3" stroke="#585C70" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M62 58l-10 18h8l-6 14 16-20h-8z" fill="#F2B705" stroke="#C99400" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  birds: (
    <>
      <path d="M22 84h76" stroke="#8A6A4A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="46" cy="66" rx="16" ry="13" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" />
      <circle cx="58" cy="54" r="9" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" />
      <path d="M66 53l8 3-8 3z" fill="#FF6F59" />
      <circle cx="60" cy="52" r="1.8" fill="#1F2246" />
      <path d="M34 66q8-8 16 0" fill="none" stroke="#C99400" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M78 36q4-4 8 0M86 46q4-4 8 0" fill="none" stroke="#3E9B5A" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  drip: (
    <>
      <path d="M40 28h40v8a6 6 0 01-6 6H46a6 6 0 01-6-6z" fill="#B8BCC8" stroke="#7A7F91" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M60 46c-8 10-11 15-11 20a11 11 0 0022 0c0-5-3-10-11-20z" fill="#6FB8E8" stroke="#3E8CC4" strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="60" cy="96" rx="22" ry="5" fill="#B7DDF3" stroke="#3E8CC4" strokeWidth="2" />
      <path d="M55 62a5 5 0 013-4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  bag: (
    <>
      <path d="M34 48h52l-4 38a6 6 0 01-6 5H44a6 6 0 01-6-5z" fill="#6FA4FF" stroke="#2B5FCC" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M44 48v-8a16 16 0 0132 0v8" fill="none" stroke="#2B5FCC" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  tag: (
    <>
      <path d="M34 34l30 0 22 22-30 30-22-22z" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="46" cy="46" r="4" fill="#FFF9EE" />
    </>
  ),
  rag: (
    <>
      <path d="M30 40q30-10 60 0v14q-30-10-60 0z" fill="#8FC4B6" stroke="#2F7A6C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 54q30-10 60 0v14q-30-10-60 0z" fill="#A7D2C6" stroke="#2F7A6C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 68q30-10 60 0v10q-30-10-60 0z" fill="#8FC4B6" stroke="#2F7A6C" strokeWidth="2.2" strokeLinejoin="round" />
    </>
  ),
  net: (
    <>
      <circle cx="52" cy="46" r="22" fill="none" stroke="#4C8DFF" strokeWidth="2.6" />
      <path d="M34 34l36 24M70 34l-36 24M52 24v44M36 40h32M36 52h32" stroke="#8FB6FF" strokeWidth="1.3" opacity="0.85" />
      <path d="M70 66l16 18" stroke="#7A5230" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  jet: (
    <>
      <path d="M24 62l64-14-10 8-40 12z" fill="#B9BFCB" stroke="#6E7488" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M60 54l24-18 8 4-20 20z" fill="#DADFE6" stroke="#6E7488" strokeWidth="2" strokeLinejoin="round" />
      <path d="M46 58l-6 16 10-4 6-10z" fill="#DADFE6" stroke="#6E7488" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  vet: (
    <>
      <path d="M40 30v20a12 12 0 0024 0V30" fill="none" stroke="#8FC4B6" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M40 30a4 4 0 100-8 4 4 0 000 8zM64 30a4 4 0 100-8 4 4 0 000 8z" fill="#8FC4B6" />
      <path d="M52 50v14a10 10 0 1010-10" fill="none" stroke="#2F7A6C" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="62" cy="54" r="5" fill="none" stroke="#2F7A6C" strokeWidth="3" />
    </>
  ),
  fig: (
    <>
      <path d="M60 34c-16 0-24 16-24 30a24 24 0 0048 0c0-14-8-30-24-30z" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M60 34v-8M54 28l6-2 6 2" stroke="#5A4C9E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  wig: (
    <>
      <path d="M34 66a26 22 0 0152 0v6H34z" fill="#C98A4E" stroke="#A6733E" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M32 58a6 8 0 1112 0M76 58a6 8 0 10-12 0" fill="#C98A4E" stroke="#A6733E" strokeWidth="2.2" />
      <path d="M42 46q4-10 18-10t18 10" fill="none" stroke="#A6733E" strokeWidth="1.6" opacity="0.6" />
    </>
  ),
  mop: (
    <>
      <rect x="56" y="24" width="8" height="38" rx="3" fill="#C98A4E" stroke="#8B5E30" strokeWidth="2" />
      {[42, 50, 58, 66, 78].map((x, i) => (
        <path key={x} d={`M60 60L${x} 88`} stroke="#F2EAD0" strokeWidth="4" strokeLinecap="round" />
      ))}
    </>
  ),
  pop: (
    <>
      <path d="M46 40h28l-3 44a4 4 0 01-4 4H53a4 4 0 01-4-4z" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M50 40l3-8h14l3 8" fill="none" stroke="#CC4A37" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="54" cy="56" r="2.4" fill="#FFD9CF" /><circle cx="64" cy="50" r="2" fill="#FFD9CF" /><circle cx="58" cy="68" r="2.2" fill="#FFD9CF" />
    </>
  ),
  top: (
    <>
      <path d="M40 34h40l-6 14H46z" fill="#F2B705" stroke="#C99400" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M46 48h28l-14 34z" fill="#FFD65C" stroke="#C99400" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 40q10-4 10 4M90 40q-10-4-10 4" stroke="#C99400" strokeWidth="1.6" fill="none" opacity="0.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="60" cy="60" r="20" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line key={deg} x1="60" y1="28" x2="60" y2="18" stroke="#C99400" strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${deg} 60 60)`} />
      ))}
    </>
  ),
  // "Sit" is an action, not an object — a simple seated figure on a bench
  // reads clearly at this size, matching how "man"/"vet" already use small
  // figures rather than abstract symbols.
  sit: (
    <>
      <circle cx="60" cy="38" r="12" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.4" />
      <path d="M46 56a14 10 0 0128 0v14H46z" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="40" y="70" width="40" height="8" rx="3" fill="#A6733E" stroke="#7A5230" strokeWidth="2" />
      <path d="M40 78v8M80 78v8" stroke="#7A5230" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <circle cx="60" cy="60" r="26" fill="#8FB6E8" stroke="#3E6FA8" strokeWidth="2.4" />
      <circle cx="50" cy="54" r="3" fill="#1F2246" />
      <circle cx="70" cy="54" r="3" fill="#1F2246" />
      <path d="M44 46q4-4 10-2M76 46q-4-4-10-2" stroke="#1F2246" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M48 74q12-10 24 0" fill="none" stroke="#1F2246" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M50 60q-2 6-5 9" stroke="#4C8DFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  ),
  kid: (
    <>
      <circle cx="60" cy="38" r="15" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.4" />
      <path d="M42 88c0-15 8-24 18-24s18 9 18 24z" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="54" cy="36" r="2" fill="#1F2246" /><circle cx="66" cy="36" r="2" fill="#1F2246" />
      <path d="M54 42q6 4 12 0" fill="none" stroke="#1F2246" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  run: (
    <>
      <circle cx="66" cy="30" r="10" fill="#FFC9A8" stroke="#C97B4E" strokeWidth="2.2" />
      <path d="M62 40l-6 20 14 6-4 22M56 60l-16 10M70 66l14 14" fill="none" stroke="#4C8DFF" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 46l14-4" fill="none" stroke="#4C8DFF" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M22 40l6 4M22 60l6-4" stroke="#8FB6E8" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  lip: (
    <>
      <path d="M28 58q16-14 32-14t32 14q-16 16-32 16t-32-16z" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M28 58q16 6 32 6t32-6" fill="none" stroke="#CC4A37" strokeWidth="2" opacity="0.6" />
    </>
  ),
  dad: (
    <>
      <circle cx="60" cy="40" r="14" fill="#E0AD70" stroke="#A6733E" strokeWidth="2.4" />
      <path d="M40 90c0-16 9-26 20-26s20 10 20 26z" fill="#2C2E4A" stroke="#1F2246" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M52 46q8 4 16 0" fill="none" stroke="#7A5230" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="56" y="64" width="8" height="16" fill="#FF6F59" />
    </>
  ),
  gum: (
    <>
      <circle cx="70" cy="46" r="22" fill="#FF8FB6" stroke="#CC4A80" strokeWidth="2.4" />
      <circle cx="63" cy="38" r="5" fill="#FFC3D9" opacity="0.8" />
      <rect x="30" y="70" width="30" height="14" rx="4" fill="#8B7FD1" stroke="#5A4C9E" strokeWidth="2.2" transform="rotate(-8 45 77)" />
    </>
  ),
  cup: (
    <>
      <path d="M38 40h34v30a10 10 0 01-10 10H48a10 10 0 01-10-10z" fill="#5CB86B" stroke="#2C7A3C" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M72 48h6a8 8 0 010 16h-6" fill="none" stroke="#2C7A3C" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44 40q3-8 8-8M56 40q3-8 8-8" fill="none" stroke="#2C7A3C" strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
    </>
  ),
  bus: (
    <>
      <rect x="22" y="42" width="76" height="32" rx="8" fill="#F2B705" stroke="#C99400" strokeWidth="2.4" />
      <rect x="30" y="48" width="14" height="12" rx="2" fill="#DCEEF6" />
      <rect x="48" y="48" width="14" height="12" rx="2" fill="#DCEEF6" />
      <rect x="66" y="48" width="14" height="12" rx="2" fill="#DCEEF6" />
      <circle cx="38" cy="78" r="7" fill="#2C2E4A" />
      <circle cx="38" cy="78" r="2.6" fill="#C7CBE8" />
      <circle cx="82" cy="78" r="7" fill="#2C2E4A" />
      <circle cx="82" cy="78" r="2.6" fill="#C7CBE8" />
    </>
  ),
  sip: (
    <>
      <path d="M42 46h30v26a10 10 0 01-10 10h-10a10 10 0 01-10-10z" fill="#4C8DFF" stroke="#2B5FCC" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M60 46V30q0-8 8-8" fill="none" stroke="#2B5FCC" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M48 54h18" stroke="#CFE4FF" strokeWidth="1.8" opacity="0.6" />
    </>
  ),
  pin: (
    <>
      <circle cx="42" cy="42" r="10" fill="#FF6F59" stroke="#CC4A37" strokeWidth="2.4" />
      <path d="M48 48l28 28" stroke="#B9BFCB" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 76l6 10-10-6z" fill="#8B8FA3" />
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

// Pictures supplied as image files (Google Noto Emoji, public/img/words/)
// rather than hand-drawn inline SVG.
const IMAGE_BG = {
  pig: "#FDE0E8", bug: "#E1F3E6", bed: "#E8E6F7", rat: "#EAE2D3", nut: "#F1E3D3", leg: "#FFE7E0",
  cab: "#FFF3D6", fog: "#E4E1EA", bin: "#DCEEF6", tub: "#DCEBFF", hut: "#FDE9D2",
  jug: "#E1F3E6",
  flag: "#FDEBE4", crab: "#FFE7E0", frog: "#E1F3E6", drum: "#F1E3D3", plug: "#DCEEF6",
};

export function Illustration({ name = "pattern", size = 96 }) {
  if (IMAGE_BG[name]) {
    return (
      <div style={{ width: size, height: size }}>
        <Bubble bg={IMAGE_BG[name]}>
          <image href={`/img/words/${name}.svg`} x="22" y="22" width="76" height="76" />
        </Bubble>
      </div>
    );
  }
  const key = PICTURES[name] ? name : "pattern";
  return (
    <div style={{ width: size, height: size }}>
      <Bubble bg={BG[key] || BG.pattern}>{PICTURES[key]}</Bubble>
    </div>
  );
}
