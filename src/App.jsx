// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { theme as T, useFonts, useGlobalAnimations } from "./theme";
import { Onboarding } from "./components/Onboarding";
import { TopBar } from "./components/TopBar";
import { ChildHome } from "./pages/ChildHome";
import { ParentDashboard } from "./pages/ParentDashboard";
import { Lesson } from "./pages/Lesson";
import { loadState, saveState, DEFAULT_STATE, recordLessonAttempt } from "./services/progressService";

export default function App() {
  useFonts();
  useGlobalAnimations();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(DEFAULT_STATE);
  const [view, setView] = useState("child");
  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });
  }, []);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }, []);

  const handleCreateProfile = (profile) => persist((prev) => ({ ...prev, profile }));

  const handleToggleUnlockAll = (unlockAll) => persist((prev) => ({ ...prev, settings: { ...prev.settings, unlockAll } }));

  // Called the moment a challenge attempt is scored (pass or fail), while
  // the child is still on the result screen — leaving the lesson never
  // depends on it.
  const handleRecordAttempt = ({ lessonId, mastery, ratio, attemptNumber, responses }) => {
    persist((prev) =>
      recordLessonAttempt(prev, {
        lessonId,
        childId: prev.profile.child_id,
        responses,
        ratio,
        mastery,
        attemptNumber,
      })
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif", color: T.textMute }}>
        Loading…
      </div>
    );
  }

  const wrapperStyle = { fontFamily: "'Manrope', sans-serif", background: T.paper, minHeight: 600, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.line}` };

  if (!state.profile) {
    return <div style={wrapperStyle}><Onboarding onCreate={handleCreateProfile} /></div>;
  }

  return (
    <div style={wrapperStyle}>
      {!activeLessonId && <TopBar view={view} setView={setView} profile={state.profile} />}
      {activeLessonId ? (
        <Lesson lessonId={activeLessonId} state={state} onExit={() => setActiveLessonId(null)} onRecord={handleRecordAttempt} />
      ) : view === "child" ? (
        <ChildHome profile={state.profile} state={state} onOpenLesson={setActiveLessonId} />
      ) : (
        <ParentDashboard profile={state.profile} state={state} onToggleUnlockAll={handleToggleUnlockAll} />
      )}
    </div>
  );
}
