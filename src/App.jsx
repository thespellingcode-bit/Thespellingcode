// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { theme as T, useFonts } from "./theme";
import { Onboarding } from "./components/Onboarding";
import { TopBar } from "./components/TopBar";
import { ChildHome } from "./pages/ChildHome";
import { ParentDashboard } from "./pages/ParentDashboard";
import { Lesson } from "./pages/Lesson";
import { loadState, saveState, DEFAULT_STATE, recordLessonAttempt } from "./services/progressService";

export default function App() {
  useFonts();
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

  const handleFinishLesson = ({ lessonId, mastery, ratio, attemptNumber, responses }) => {
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
    setActiveLessonId(null);
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
        <Lesson lessonId={activeLessonId} onExit={() => setActiveLessonId(null)} onFinish={handleFinishLesson} />
      ) : view === "child" ? (
        <ChildHome profile={state.profile} state={state} onOpenLesson={setActiveLessonId} />
      ) : (
        <ParentDashboard profile={state.profile} state={state} />
      )}
    </div>
  );
}
