// src/pages/ChildHome.jsx
import React, { useState } from "react";
import { theme as T } from "../theme";
import { Icon } from "../components/Icon";
import { Btn } from "../components/Btn";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { getLessonsByModule, getActiveModules, getActiveBadges, getBadges, getLevel } from "../services/contentService";
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

  // Which module's lesson list is expanded inline below it — an
  // accordion, not a separate tab/section, so the lessons a parent or
  // child taps a module to see show up immediately under that same
  // module rather than requiring a second look elsewhere on the screen.
  // Only one open at a time; tapping the open one again closes it.
  const [expandedModuleId, setExpandedModuleId] = useState(moduleId || defaultModuleId);
  const module = activeModules.find((m) => m.module_id === expandedModuleId) || activeModules[0];

  // The next locked module after the child's current unlock frontier —
  // shown with a standing goal card ONLY for the Module 1 → 2 free-unlock
  // boundary, since that's the only transition with a score target to
  // show progress toward. Every other locked module just shows a plain
  // lock, same as before this mechanic existed.
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
            {[...new Set(activeModules.map((m) => m.level_id))].map((id) => `Level ${id} · ${getLevel(id)?.level_name || ""}`).join(" + ")}
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: T.goldDeep, fontWeight: 600, margin: "4px 0 0" }}>
            {totalMastered} of {totalLessons} lessons mastered
          </p>
        </div>
      </div>

      <Btn variant="gold" size="lg" style={{ marginBottom: 24 }} onClick={() => onOpenLesson(nextLesson.lesson_id)}>
        {masteredCount === 0 ? "Start your first mission!" : moduleComplete ? "Replay a mission" : "Continue your mission"}
      </Btn>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 34 }}>
        {activeModules.map((m, idx) => {
          const unlocked = moduleUnlocked(idx);
          const isFirstOfItsLevel = idx === 0 || activeModules[idx - 1].level_id !== m.level_id;
          const levelInfo = getLevel(m.level_id);
          const expanded = unlocked && m.module_id === expandedModuleId;
          const isGoalCardModule = !unlocked && m.module_id === nextLockedModule?.module_id;
          const moduleLessons = getLessonsByModule(m.module_id);
          const moduleMasteredCount = moduleLessons.filter((l) => state.progress[l.lesson_id]?.mastery).length;

          return (
            <React.Fragment key={m.module_id}>
              {isFirstOfItsLevel && (
                <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, color: T.ink, margin: idx === 0 ? "0 0 4px" : "20px 0 4px" }}>
                  Level {m.level_id} · {levelInfo?.level_name || ""}
                </h2>
              )}
              <div
                style={{
                  border: `1.5px solid ${expanded ? T.gold : T.line}`, borderRadius: 18, overflow: "hidden",
                  background: "#fff",
                }}
              >
              <button
                disabled={!unlocked}
                onClick={() => unlocked && setExpandedModuleId((cur) => (cur === m.module_id ? null : m.module_id))}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  padding: "14px 18px", border: "none", cursor: unlocked ? "pointer" : "not-allowed",
                  background: expanded ? "#FFFBEF" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {!unlocked && <Icon name="lock" size={16} color={T.textMute} />}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 15, color: unlocked ? T.ink : T.textMute }}>
                      Module {m.module_id}: {m.module_name}
                    </div>
                    {unlocked && (
                      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: T.textMute, marginTop: 1 }}>
                        {moduleMasteredCount} of {moduleLessons.length} mastered
                      </div>
                    )}
                  </div>
                </div>
                {unlocked && (
                  <span style={{ fontSize: 14, color: T.textMute, flexShrink: 0 }}>{expanded ? "▾" : "▸"}</span>
                )}
              </button>

              {expanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 14px 14px" }}>
                  {moduleLessons.map((l, lidx) => {
                    const status = statusOfLesson(state, l.lesson_id);
                    const prevMastered = lidx === 0 || state.progress[moduleLessons[lidx - 1].lesson_id]?.mastery;
                    const locked = !state.settings?.unlockAll && !prevMastered && status === "not_started";
                    return (
                      <button
                        key={l.lesson_id}
                        disabled={locked}
                        onClick={() => onOpenLesson(l.lesson_id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                          padding: "12px 14px", borderRadius: 14, cursor: locked ? "not-allowed" : "pointer",
                          border: `1.5px solid ${status === "mastered" ? T.gold : T.line}`,
                          background: status === "mastered" ? "#FFFBEF" : "#fff",
                          opacity: locked ? 0.55 : 1,
                        }}
                      >
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          background: status === "mastered" ? T.gold : status === "not_started" ? T.mist : T.mistDeep,
                        }}>
                          {locked ? <Icon name="lock" size={17} color={T.textMute} /> :
                            status === "mastered" ? <Icon name="check" size={19} color="#fff" /> :
                              <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 13.5, color: T.ink }}>{l.number}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 10.5, letterSpacing: 0.4, color: T.goldDeep, textTransform: "uppercase" }}>
                            Mission {l.number}
                          </div>
                          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{l.title}</div>
                          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: T.textMute }}>
                            {l.estimated_time} · {status === "mastered" ? "Mastered" : status === "in_progress" ? "In progress" : locked ? "Locked" : "Not started"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {isGoalCardModule && (
                <div style={{ padding: "0 16px 14px" }}>
                  <div style={{ height: 8, borderRadius: 999, background: T.mist, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{
                      height: "100%", width: `${Math.min(100, Math.round((gatingScore / MODULE_UNLOCK_THRESHOLD) * 100))}%`,
                      background: `linear-gradient(90deg, ${T.goldDeep}, ${T.gold})`, borderRadius: 999,
                    }} />
                  </div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: T.textMute }}>
                    Your Module {gatingModule.module_id} score: <b style={{ color: T.ink }}>{pct(gatingScore)}</b> · unlocks free at <b style={{ color: T.ink }}>{pct(MODULE_UNLOCK_THRESHOLD)}</b>
                  </div>
                </div>
              )}
              </div>
            </React.Fragment>
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
