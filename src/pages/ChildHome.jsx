// src/pages/ChildHome.jsx
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon } from "../components/Icon";
import { Btn } from "../components/Btn";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { getLessonsByModule, getActiveModules, getActiveBadges, getBadges } from "../services/contentService";
import { statusOfLesson, MODULE_UNLOCK_THRESHOLD, FREE_UNLOCK_FROM_MODULE_ID } from "../services/progressService";

function pct(n) {
  return `${Math.round(n * 100)}%`;
}

function isModuleComplete(state, moduleId) {
  const lessons = getLessonsByModule(moduleId);
  return lessons.length > 0 && lessons.every((l) => state.progress[l.lesson_id]?.mastery);
}

// A module's score is its own final Challenge/Assessment lesson's best
// score — null if that module doesn't end in one (shouldn't happen for
// any module built so far, but keeps this honest rather than assuming).
function moduleScore(state, moduleId) {
  const lessons = getLessonsByModule(moduleId);
  const final = lessons[lessons.length - 1];
  if (!final || final.activity_type !== "assessment") return null;
  return state.progress[final.lesson_id]?.bestScore ?? null;
}


// moduleId is an optional override (e.g. a future deep link) — when
// omitted, the child lands on their first not-yet-complete UNLOCKED
// module so returning users don't have to re-navigate past what they've
// finished, and never default onto a module they can't actually open yet.
export function ChildHome({ profile, state, onOpenLesson, moduleId }) {
  const activeModules = [...getActiveModules()].sort((a, b) => a.module_id - b.module_id);

  // A module unlocks either by the previous module being fully mastered
  // (the normal rule, every boundary), OR — only immediately after
  // Module 1 specifically — by clearing the score-gated free-unlock
  // threshold instead. Scoring well on Module 2's, 3's, ... own Challenge
  // never grants a free unlock; only finishing every lesson does.
  const moduleUnlocked = (idx) => {
    if (state.settings?.unlockAll || idx === 0) return true;
    const prevModule = activeModules[idx - 1];
    if (isModuleComplete(state, prevModule.module_id)) return true;
    if (prevModule.module_id === FREE_UNLOCK_FROM_MODULE_ID) {
      const score = moduleScore(state, prevModule.module_id);
      return score !== null && score >= MODULE_UNLOCK_THRESHOLD;
    }
    return false;
  };

  const unlockedModules = activeModules.filter((m, idx) => moduleUnlocked(idx));
  const firstIncomplete = unlockedModules.find((m) => !isModuleComplete(state, m.module_id));
  const defaultModuleId = (firstIncomplete || unlockedModules[unlockedModules.length - 1] || activeModules[0]).module_id;
  const [selectedModuleId, setSelectedModuleId] = useState(moduleId || defaultModuleId);

  const selectedIdx = activeModules.findIndex((m) => m.module_id === selectedModuleId);
  const module = activeModules[selectedIdx] || activeModules[0];

  // The next locked module after the child's current unlock frontier —
  // shown as a standing goal card ONLY for the Module 1 → 2 free-unlock
  // boundary, since that's the only transition with a score target to
  // show progress toward. Every other locked module just shows its plain
  // lock icon in the chips row above, same as before this mechanic
  // existed.
  const nextLockedIdx = activeModules.findIndex((m, idx) => !moduleUnlocked(idx));
  const nextLockedModuleRaw = nextLockedIdx > 0 ? activeModules[nextLockedIdx] : null;
  const gatingModule = nextLockedModuleRaw ? activeModules[nextLockedIdx - 1] : null;
  const nextLockedModule = gatingModule?.module_id === FREE_UNLOCK_FROM_MODULE_ID ? nextLockedModuleRaw : null;
  const gatingScore = nextLockedModule ? moduleScore(state, gatingModule.module_id) || 0 : 0;

  const lessons = getLessonsByModule(module.module_id);
  const masteredCount = lessons.filter((l) => state.progress[l.lesson_id]?.mastery).length;
  const moduleComplete = masteredCount === lessons.length;
  const nextLesson = lessons.find((l) => statusOfLesson(state, l.lesson_id) !== "mastered") || lessons[lessons.length - 1];

  const totalMastered = activeModules.reduce((sum, m) => sum + getLessonsByModule(m.module_id).filter((l) => state.progress[l.lesson_id]?.mastery).length, 0);
  const totalLessons = activeModules.reduce((sum, m) => sum + getLessonsByModule(m.module_id).length, 0);

  const activeBadges = getActiveBadges();
  const lockedBadges = getBadges().filter((b) => !b.active).slice(0, 3);

  return (
    <div style={{ padding: "28px 20px 60px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        <ProgressBar value={totalLessons ? totalMastered / totalLessons : 0} size={82}>
          <span style={{ fontSize: 34 }}>{profile.avatar}</span>
        </ProgressBar>
        <div>
          <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 25, color: T.ink, margin: 0 }}>Hi {profile.name}!</h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, margin: "4px 0 0" }}>
            Level 1 · Sound Explorer
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: T.goldDeep, fontWeight: 600, margin: "4px 0 0" }}>
            {totalMastered} of {totalLessons} lessons mastered
          </p>
        </div>
      </div>

      {activeModules.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          {activeModules.map((m, idx) => {
            const unlocked = moduleUnlocked(idx);
            const selected = m.module_id === module.module_id;
            return (
              <button
                key={m.module_id}
                disabled={!unlocked}
                onClick={() => setSelectedModuleId(m.module_id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, cursor: unlocked ? "pointer" : "not-allowed",
                  border: `1.5px solid ${selected ? T.gold : T.line}`, background: selected ? "#FFFBEF" : "#fff",
                  fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 13.5, color: unlocked ? T.ink : T.textMute,
                  opacity: unlocked ? 1 : 0.6,
                }}
              >
                {!unlocked && <Icon name="lock" size={14} color={T.textMute} />}
                Module {m.module_id}: {m.module_name}
              </button>
            );
          })}
        </div>
      )}

      {nextLockedModule && (
        <div style={{ border: `1.5px dashed ${T.line}`, background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 22 }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 13.5, color: T.textMute, marginBottom: 8 }}>
            🔒 Module {nextLockedModule.module_id} — {nextLockedModule.module_name}
          </div>
          <div style={{ height: 8, borderRadius: 999, background: T.mist, overflow: "hidden", marginBottom: 6 }}>
            <div style={{
              height: "100%", width: `${Math.min(100, Math.round((gatingScore / MODULE_UNLOCK_THRESHOLD) * 100))}%`,
              background: `linear-gradient(90deg, ${T.goldDeep}, ${T.gold})`, borderRadius: 999,
            }} />
          </div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: T.textMute }}>
            Your Module {gatingModule.module_id} score: <b style={{ color: T.ink }}>{pct(gatingScore)}</b> · Module {nextLockedModule.module_id} unlocks free at <b style={{ color: T.ink }}>{pct(MODULE_UNLOCK_THRESHOLD)}</b>
          </div>
        </div>
      )}

      <Btn variant="gold" size="lg" style={{ marginBottom: 30 }} onClick={() => onOpenLesson(nextLesson.lesson_id)}>
        {masteredCount === 0 ? "Start your first mission!" : moduleComplete ? "Replay a mission" : "Continue your mission"}
      </Btn>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, color: T.ink, marginBottom: 14 }}>{module.module_name} path</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 34 }}>
        {lessons.map((l, idx) => {
          const status = statusOfLesson(state, l.lesson_id);
          const prevMastered = idx === 0 || state.progress[lessons[idx - 1].lesson_id]?.mastery;
          const locked = !state.settings?.unlockAll && !prevMastered && status === "not_started";
          return (
            <button
              key={l.lesson_id}
              disabled={locked}
              onClick={() => onOpenLesson(l.lesson_id)}
              style={{
                display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                padding: "14px 18px", borderRadius: 18, cursor: locked ? "not-allowed" : "pointer",
                border: `1.5px solid ${status === "mastered" ? T.gold : T.line}`,
                background: status === "mastered" ? "#FFFBEF" : "#fff",
                opacity: locked ? 0.55 : 1,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: status === "mastered" ? T.gold : status === "not_started" ? T.mist : T.mistDeep,
              }}>
                {locked ? <Icon name="lock" size={20} color={T.textMute} /> :
                  status === "mastered" ? <Icon name="check" size={22} color="#fff" /> :
                    <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: T.ink }}>{l.number}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 0.4, color: T.goldDeep, textTransform: "uppercase" }}>
                  Mission {l.number}
                </div>
                <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 16, color: T.ink }}>{l.title}</div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute }}>
                  {l.estimated_time} · {status === "mastered" ? "Mastered" : status === "in_progress" ? "In progress" : locked ? "Locked" : "Not started"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, color: T.ink, marginBottom: 14 }}>Badges</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {activeBadges.map((b) => <Badge key={b.badge_id} name={b.name} earned={isModuleComplete(state, b.module_id)} />)}
        {lockedBadges.map((b) => <Badge key={b.badge_id} name={b.name} locked />)}
      </div>
    </div>
  );
}
