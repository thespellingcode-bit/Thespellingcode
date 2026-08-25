// src/pages/ParentDashboard.jsx
import React from "react";
import { theme as T } from "../theme";
import { getLessonsByModule, getActiveModules, getParentPractice, getRemediationByErrorTag } from "../services/contentService";
import { statusOfLesson, errorTagCounts } from "../services/progressService";

function pct(n) {
  return `${Math.round(n * 100)}%`;
}

function Card({ children, style }) {
  return <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, padding: "18px 20px", ...style }}>{children}</div>;
}

// Aggregates per-skill status from lesson-level mastery. With only two
// skills in Module 1 this is simple; a future module with more skills
// still works unchanged since it just groups by lesson.skill.
function skillStatuses(lessons, state) {
  const bySkill = {};
  lessons.forEach((l) => {
    if (!bySkill[l.skill]) bySkill[l.skill] = { mastered: 0, attempted: 0, total: 0 };
    bySkill[l.skill].total += 1;
    const p = state.progress[l.lesson_id];
    if (p?.mastery) bySkill[l.skill].mastered += 1;
    else if (p?.attempts > 0) bySkill[l.skill].attempted += 1;
  });
  return Object.entries(bySkill).map(([skill, s]) => ({
    skill,
    status: s.mastered === s.total ? "Mastered" : s.attempted > 0 || s.mastered > 0 ? "Developing" : "Not started",
  }));
}

const SKILL_LABELS = { auditory_discrimination: "Listening", auditory_memory: "Sound memory", rhyming: "Rhyming" };

export function ParentDashboard({ profile, state }) {
  const activeModules = [...getActiveModules()].sort((a, b) => a.module_id - b.module_id);
  const lessons = activeModules.flatMap((m) => getLessonsByModule(m.module_id));
  const completedCount = lessons.filter((l) => state.progress[l.lesson_id]?.completed).length;
  const masteredCount = lessons.filter((l) => state.progress[l.lesson_id]?.mastery).length;

  const skills = skillStatuses(lessons, state);

  const lastAttempted = [...lessons]
    .filter((l) => state.progress[l.lesson_id]?.updatedAt)
    .sort((a, b) => (state.progress[b.lesson_id].updatedAt || 0) - (state.progress[a.lesson_id].updatedAt || 0))[0];
  const lastResult = lastAttempted ? state.progress[lastAttempted.lesson_id] : null;

  const errorCounts = errorTagCounts(state);
  const weakestTag = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const weakestRemediation = weakestTag ? getRemediationByErrorTag(weakestTag) : null;
  // Recommend practice from whichever module the child is currently working through.
  const currentModule = activeModules.find((m) => getLessonsByModule(m.module_id).some((l) => !state.progress[l.lesson_id]?.mastery)) || activeModules[activeModules.length - 1];
  const homePractice = getParentPractice(currentModule.module_id)[0];

  return (
    <div style={{ padding: "28px 20px 60px", maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: T.ink, margin: "0 0 4px" }}>{profile.name}'s progress</h1>
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, margin: "0 0 22px" }}>
        Level 1 — Sound Explorer · {activeModules.map((m) => m.module_name).join(" + ")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 22 }}>
        <Card><div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute }}>Lessons completed</div><div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, fontWeight: 700, color: T.ink }}>{completedCount} / {lessons.length}</div></Card>
        <Card><div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute }}>Overall progress</div><div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, fontWeight: 700, color: T.ink }}>{pct(masteredCount / lessons.length)}</div></Card>
      </div>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 15, color: T.ink, marginBottom: 8 }}>Skills</h2>
      <Card style={{ marginBottom: 22, padding: 0, overflow: "hidden" }}>
        {skills.map((s, i) => (
          <div key={s.skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: i === 0 ? "none" : `1px solid ${T.line}` }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.ink }}>{SKILL_LABELS[s.skill] || s.skill}</span>
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 700,
              color: s.status === "Mastered" ? "#2C7A3C" : s.status === "Developing" ? T.goldDeep : T.textMute,
            }}>
              {s.status === "Mastered" ? "🟢 " : s.status === "Developing" ? "🟡 " : "⚪ "}{s.status}
            </span>
          </div>
        ))}
      </Card>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 15, color: T.ink, marginBottom: 8 }}>Recent assessment performance</h2>
      <Card style={{ marginBottom: 22 }}>
        {lastAttempted ? (
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.inkSoft, margin: 0 }}>
            {lastAttempted.title}: scored {pct(lastResult.bestScore || 0)} {lastResult.mastery ? "(mastered)" : "(not yet at mastery)"}
          </p>
        ) : (
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, margin: 0 }}>No lessons attempted yet.</p>
        )}
      </Card>

      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 15, color: T.ink, marginBottom: 8 }}>This week's practice</h2>
      <Card>
        {weakestRemediation ? (
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.inkSoft, margin: 0 }}>{weakestRemediation.strategy}</p>
        ) : homePractice ? (
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.inkSoft, margin: 0 }}>
            <strong>{homePractice.title}:</strong> {homePractice.instructions} ({homePractice.time})
          </p>
        ) : (
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: T.textMute, margin: 0 }}>Nothing to recommend yet — start Lesson 1.</p>
        )}
      </Card>
    </div>
  );
}
