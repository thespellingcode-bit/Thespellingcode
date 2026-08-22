// src/components/LessonPlayer.jsx
import React, { useState, useCallback } from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";
import { Btn } from "./Btn";
import { QuestionCard } from "./QuestionCard";
import { NarrationScreen } from "./NarrationScreen";
import { ResultScreen } from "./ResultScreen";
import { getPracticeActivities, getAssessmentQuestions } from "../services/contentService";
import { scoreAssessment, isMastered } from "../services/assessmentService";
import { pickRemediation } from "../services/remediationService";

const STAGE_LABELS = {
  welcome: "Welcome", teach: "Teach", model: "Watch", transition: "Get ready",
  instruction: "Instructions", guided: "Guided practice", independent: "Your turn",
  assessment: "Challenge", result: "Result", remediation: "Practice more", complete: "Done",
};

// Which stages this lesson runs, driven entirely by which narration
// scenes actually exist in this lesson's content — NOT a fixed template.
// A future module's lesson with a different narration shape (e.g. no
// "model" scene, or an extra scene) is handled automatically.
function stagesFor(lesson) {
  if (lesson.activity_type === "assessment") {
    return ["welcome", "instruction", "assessment", "result", "remediation", "complete"];
  }
  const s = ["welcome", "teach"];
  if (lesson.narration.model) s.push("model");
  s.push("guided", "independent", "assessment", "result", "remediation", "complete");
  return s;
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// onFinish receives { lessonId, mastery, ratio, attemptNumber, responses }
// — the caller (LessonPage) is responsible for persisting progress via
// progressService. LessonPlayer itself has no storage dependency.
export function LessonPlayer({ lesson, onExit, onFinish }) {
  const stages = stagesFor(lesson);
  const [stageIdx, setStageIdx] = useState(0);
  const stage = stages[stageIdx];
  const goTo = (name) => setStageIdx(stages.indexOf(name));
  const next = () => setStageIdx((i) => Math.min(i + 1, stages.length - 1));

  const practiceQuestions = getPracticeActivities(lesson.lesson_id);
  // Assessment questions come from the SEPARATE assessment bank in
  // content — never the practice items. This is what makes "no reusing
  // practice questions as assessment questions" an architectural
  // guarantee rather than a content-authoring convention to remember.
  const assessmentQuestions = getAssessmentQuestions(lesson.lesson_id);

  const guidedQs = practiceQuestions.slice(0, 2);
  const independentQs = practiceQuestions.slice(2);

  const [guidedIdx, setGuidedIdx] = useState(0);
  const [indepIdx, setIndepIdx] = useState(0);
  const [assessSeq, setAssessSeq] = useState(() => shuffled(assessmentQuestions));
  const [assessIdx, setAssessIdx] = useState(0);
  const [responses, setResponses] = useState([]); // [{questionId, skill, errorTag, correct}]
  const [attemptNumber, setAttemptNumber] = useState(1);

  const restartAssessment = useCallback(() => {
    setAssessSeq(shuffled(assessmentQuestions));
    setAssessIdx(0);
    setResponses([]);
    setAttemptNumber((n) => n + 1);
    goTo("assessment");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentQuestions]);

  const { correctCount, ratio, errorTags } = scoreAssessment(
    responses.map((r) => ({ correct: r.correct, errorTag: r.errorTag }))
  );
  const totalQuestions = assessmentQuestions.length;
  const attemptComplete = responses.length === totalQuestions && totalQuestions > 0;
  const mastered = attemptComplete && isMastered(ratio, lesson.masteryThreshold);
  const remediation = attemptComplete ? pickRemediation(errorTags) : null;

  const recordResponse = (question, result) => {
    setResponses((prev) => [...prev, {
      questionId: question.assessment_id,
      skill: question.skill,
      errorTag: question.error_tag,
      correct: result.correct,
    }]);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "20px 18px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: 13, color: T.textMute }}>
          ← Back to path
        </button>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, fontWeight: 600 }}>
          {STAGE_LABELS[stage]}
        </span>
      </div>

      <div style={{ background: T.panel, borderRadius: 22, border: `1px solid ${T.line}`, padding: "32px 26px", minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {stage === "welcome" && (
          <NarrationScreen text={lesson.narration.welcome} illustrationAsset="magnifier" onNext={next} />
        )}
        {stage === "teach" && (
          <NarrationScreen text={lesson.narration.teach} illustrationAsset={lesson.activity_type} onNext={next} />
        )}
        {stage === "instruction" && (
          <NarrationScreen text={lesson.narration.instruction} illustrationAsset="magnifier" buttonLabel="I'm ready" onNext={next} />
        )}
        {stage === "model" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
            <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, maxWidth: 420, margin: 0 }}>{lesson.narration.model}</p>
            <Btn variant="gold" size="lg" onClick={next}>{lesson.narration.transition || "Now you try!"}</Btn>
          </div>
        )}
        {stage === "guided" && guidedQs.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, marginBottom: 4 }}>
              Guided practice · {guidedIdx + 1} of {guidedQs.length}
            </p>
            <QuestionCard
              key={guidedQs[guidedIdx].activity_id}
              question={guidedQs[guidedIdx]}
              mode="practice"
              onResult={() => (guidedIdx + 1 < guidedQs.length ? setGuidedIdx((i) => i + 1) : next())}
            />
          </div>
        )}
        {stage === "independent" && independentQs.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, marginBottom: 4 }}>
              Independent practice · {indepIdx + 1} of {independentQs.length}
            </p>
            <QuestionCard
              key={independentQs[indepIdx].activity_id}
              question={independentQs[indepIdx]}
              mode="practice"
              onResult={() => (indepIdx + 1 < independentQs.length ? setIndepIdx((i) => i + 1) : next())}
            />
          </div>
        )}
        {stage === "assessment" && assessIdx < totalQuestions && (
          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, marginBottom: 4 }}>
              Assessment · {assessIdx + 1} of {totalQuestions}{attemptNumber > 1 ? ` · attempt ${attemptNumber}` : ""}
            </p>
            <QuestionCard
              key={assessSeq[assessIdx].assessment_id + attemptNumber}
              question={assessSeq[assessIdx]}
              mode="assessment"
              onResult={(r) => {
                recordResponse(assessSeq[assessIdx], r);
                setAssessIdx((i) => i + 1);
                if (assessIdx + 1 >= totalQuestions) next();
              }}
            />
          </div>
        )}
        {stage === "result" && (
          <ResultScreen
            ratio={ratio}
            masteryThreshold={lesson.masteryThreshold}
            mastered={mastered}
            closeText={lesson.narration.close}
            score={correctCount}
            total={totalQuestions}
            onFinish={() => goTo("complete")}
            onSeeRemediation={() => goTo("remediation")}
          />
        )}
        {stage === "remediation" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", maxWidth: 440 }}>
            <Icon name="magnifier" size={40} color={T.goldDeep} />
            <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, color: T.ink, margin: 0 }}>Let's strengthen this skill</p>
            {remediation ? (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5, margin: 0 }}>
                {remediation.strategy}
              </p>
            ) : (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: T.coralDeep, lineHeight: 1.5, margin: 0 }}>
                No remediation content found for this skill — EDUCATIONAL REVIEW REQUIRED.
              </p>
            )}
            <Btn variant="gold" size="lg" onClick={restartAssessment}>Try the challenge again</Btn>
          </div>
        )}
        {stage === "complete" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <Icon name="check" size={54} color="#2C7A3C" />
            <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 21, color: T.ink, margin: 0 }}>Lesson complete!</p>
            <Btn
              variant="gold" size="lg"
              onClick={() => onFinish({ lessonId: lesson.lesson_id, mastery: mastered, ratio, attemptNumber, responses })}
            >
              Back to path
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
