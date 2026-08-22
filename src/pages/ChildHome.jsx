// src/pages/ChildHome.jsx
import React from "react";
import { theme as T } from "../theme";
import { Icon } from "../components/Icon";
import { Btn } from "../components/Btn";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { getLessonsByModule, getModule, getActiveBadges, getBadges } from "../services/contentService";
import { statusOfLesson } from "../services/progressService";

export function ChildHome({ profile, state, onOpenLesson, moduleId = 1 }) {
  const module = getModule(moduleId);
  const lessons = getLessonsByModule(moduleId);
  const masteredCount = lessons.filter((l) => state.progress[l.lesson_id]?.mastery).length;
  const moduleComplete = masteredCount === lessons.length;
  const nextLesson = lessons.find((l) => statusOfLesson(state, l.lesson_id) !== "mastered") || lessons[lessons.length - 1];
  const activeBadges = getActiveBadges();
  const lockedBadges = getBadges().filter((b) => !b.active).slice(0, 3);

  return (
    <div style={{ padding: "28px 20px 60px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
        <ProgressBar value={masteredCount / lessons.length} size={82}>
          <span style={{ fontSize: 34 }}>{profile.avatar}</span>
        </ProgressBar>
        <div>
          <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 25, color: T.ink, margin: 0 }}>Hi {profile.name}!</h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, margin: "4px 0 0" }}>
            Level 1 · Sound Explorer — Module {module.module_id}: {module.module_name}
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: T.goldDeep, fontWeight: 600, margin: "4px 0 0" }}>
            {masteredCount} of {lessons.length} lessons mastered
          </p>
        </div>
      </div>

      <Btn variant="gold" size="lg" style={{ marginBottom: 30 }} onClick={() => onOpenLesson(nextLesson.lesson_id)}>
        {masteredCount === 0 ? "Start your first mission!" : moduleComplete ? "Replay a mission" : "Continue your mission"}
      </Btn>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, color: T.ink, marginBottom: 14 }}>{module.module_name} path</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 34 }}>
        {lessons.map((l, idx) => {
          const status = statusOfLesson(state, l.lesson_id);
          const prevMastered = idx === 0 || state.progress[lessons[idx - 1].lesson_id]?.mastery;
          const locked = !prevMastered && status === "not_started";
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
        {activeBadges.map((b) => <Badge key={b.badge_id} name={b.name} earned={moduleComplete} />)}
        {lockedBadges.map((b) => <Badge key={b.badge_id} name={b.name} locked />)}
      </div>
    </div>
  );
}
