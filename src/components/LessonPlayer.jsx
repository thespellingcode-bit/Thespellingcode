// src/components/LessonPlayer.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { theme as T } from "../theme";
import { Icon } from "./Icon";
import { Btn } from "./Btn";
import { QuestionCard } from "./QuestionCard";
import { NarrationScreen } from "./NarrationScreen";
import { ResultScreen } from "./ResultScreen";
import { AudioPlayer } from "./AudioPlayer";
import { WordSoundRow } from "./WordSoundRow";
import { LetterTile } from "./LetterTile";
import { WordTile } from "./WordTile";
import { Illustration } from "./Illustration";
import { labelToIcon } from "./Icon";
import { getPracticeActivities, getAssessmentQuestions } from "../services/contentService";
import { scoreAssessment, isMastered } from "../services/assessmentService";
import { pickRemediation } from "../services/remediationService";
import { shuffled } from "../services/shuffle";
import { isTtsEnabled, setTtsEnabled as persistTtsEnabled } from "../services/ttsPreference";
import { answerTilesFor, graphemeKindFor } from "../services/questionTypes";
import { spellOutWord } from "../services/audioService";
import { useAutoSpeak } from "../hooks/useAutoSpeak";

// Question types shaped like "does word X share [some phonetic property]
// with word Y" — single correct_answer, audio_asset is the anchor word.
// Grows every time a new comparison type ships (beginning/ending/vowel
// sound so far) so the two lists below don't need editing per type beyond
// this one place.
const WORD_MATCH_TYPES = ["rhyme_match", "beginning_sound_match", "ending_sound_match", "vowel_match"];

// Lesson types whose model-stage examples are fundamentally about
// comparing individual spoken words — these get WordSoundRow's individual
// word cards (instead of a single AudioPlayer) and a per-example dynamic
// heading. Broader than PREVIEW_CONFIRM_TYPES in questionTypes.js: that
// one only covers MultipleChoice's tap-to-preview gate, while rhyme_select
// has its own separate multi-select component but still belongs here for
// the model-stage treatment.
const WORD_CARD_LESSON_TYPES = [...WORD_MATCH_TYPES, "rhyme_select"];

const STAGE_LABELS = {
  welcome: "Welcome", teach: "Teach", model: "Watch", transition: "Get ready",
  instruction: "Instructions", guided: "Warm-up round", independent: "Solo mission",
  assessment: "Challenge", result: "Result", remediation: "Practice more", complete: "Done",
};

// Generates a caption that STATES the answer, derived from the exact
// same fields already driving the practice question — so the example
// screen actually teaches instead of repeating the same unanswered
// question practice will ask. No new narration content needed per
// example, and it can't drift out of sync with the content.
function modelCaptionFor(item) {
  const answer = item.correct_answer;
  switch (item.type) {
    case "same_different":
    case "loud_soft":
    case "fast_slow":
      // A "_compare" item plays TWO sounds (e.g. violin then drum) and
      // asks which one wins a comparison — "Listen — that was drum!"
      // doesn't match what was actually heard (both sounds), it only
      // makes sense for a single-sound identity judgment. Comparison
      // items get their own caption naming the answer as the pick, not
      // as "the" sound just played.
      if ((item.audio_asset || "").includes("compare")) return `${answer} was the answer!`;
      // Only lowercase single-word answers (Fast/Slow/Loud/...) — a
      // multi-word answer like "Pattern B" reads oddly lowercased.
      return `Listen — that was ${answer.includes(" ") ? answer : answer.toLowerCase()}!`;
    case "sound_memory":
      return `Listen — you'd hear: ${answer}!`;
    case "rhyme_match": {
      if ((item.prompt || item.question || "").toLowerCase().includes("not rhyme")) {
        return `${answer} doesn't rhyme with the others!`;
      }
      const anchor = item.audio_asset?.replace(/^say:/, "").split(",")[0]?.trim();
      return anchor ? `${anchor} and ${answer} rhyme!` : `Listen — that's ${answer}!`;
    }
    case "rhyme_select": {
      const anchor = item.audio_asset?.replace(/^say:/, "").split(",")[0]?.trim();
      const answers = item.correct_answers.join(" and ");
      return anchor ? `${answers} both rhyme with ${anchor}!` : `Listen — ${answers} rhyme!`;
    }
    case "beginning_sound_match": {
      const anchor = item.audio_asset?.replace(/^say:/, "").split(",")[0]?.trim();
      return anchor ? `${anchor} and ${answer} start with the same sound!` : `Listen — that's ${answer}!`;
    }
    case "ending_sound_match": {
      const anchor = item.audio_asset?.replace(/^say:/, "").split(",")[0]?.trim();
      return anchor ? `${anchor} and ${answer} end with the same sound!` : `Listen — that's ${answer}!`;
    }
    case "vowel_match": {
      const anchor = item.audio_asset?.replace(/^say:/, "").split(",")[0]?.trim();
      return anchor ? `${anchor} and ${answer} have the same middle sound!` : `Listen — that's ${answer}!`;
    }
    case "segment_count":
      return `Listen — that word has ${answer} sounds!`;
    case "vowel_length": {
      const word = item.audio_asset?.replace(/^say:/, "");
      return word ? `${capitalize(word)} has a ${answer.toLowerCase()} vowel sound!` : `Listen — that's a ${answer.toLowerCase()} vowel sound!`;
    }
    case "letter_sound_match": {
      const kind = graphemeKindFor(answer); // "letter" | "blend" | "digraph" | "ending" | "qu"
      if (item.letter_prompt) return `${item.letter_prompt} makes the sound at the start of ${answer}!`;
      const word = item.audio_asset?.replace(/^say:/, "");
      // Module 35's silent-letter items reuse letter_sound_match with a
      // bare single-letter correct_answer — without this branch it falls
      // to the generic "starts/ends with the letter X" narration below,
      // which is true but misses the entire point (the letter is SILENT,
      // never actually said), caught live before shipping.
      if (item.silent && word) return `${word} has a silent ${answer}!`;
      // Module 36's "y as a vowel" items also reuse letter_sound_match,
      // with correct_answer being "e" or "i" (which long sound y makes),
      // not a grapheme at all — the generic "starts/ends with" fallback
      // would be nonsensical here ("happy ends with the letter e").
      if (item.yVowel) return `${word} ends with y, saying long ${answer}!`;
      // Module 47's "three sounds of -ed" items also reuse letter_sound_match,
      // with correct_answer being "t"/"d"/"id" (which sound -ed makes) — the
      // spelling is always -ed, so a grapheme-position fallback would be both
      // wrong and beside the point; this is purely an auditory task.
      if (item.edSound) return `${word} ends with -ed, saying the /${answer}/ sound!`;
      if (kind === "ending") return word ? `${word} ends with ${answer}!` : `That's the ending ${answer}!`;
      if (kind === "qu") return word ? `${word} starts with qu!` : `That's qu!`;
      if (kind === "digraph") {
        if (!word) return `That's the digraph ${answer}!`;
        const pos = graphemePosition(word, answer);
        return pos ? `${word} has the digraph ${answer} at the ${pos}!` : `${word} has the digraph ${answer} in it!`;
      }
      // A vowel team can sit at the start, middle or end of a word (the
      // "ai" in "rain" is neither — reusing graphemePosition's start/end
      // guess would wrongly claim rain "starts with" ai), so this never
      // claims a position at all, unlike digraph/ending/letter/blend above.
      if (kind === "vowel team") return word ? `${word} has the vowel team ${answer} in it!` : `That's the vowel team ${answer}!`;
      // Same reasoning as vowel team above — car ends with ar, but bird
      // has ir in the middle, so this never claims a position either.
      if (kind === "r-controlled vowel") return word ? `${word} has the r-controlled vowel ${answer} in it!` : `That's the r-controlled vowel ${answer}!`;
      // "letter" and "blend" are usually word-initial (every Level 1
      // letter and every Module 10 blend was taught that way), but a
      // single letter like "x" is almost always word-FINAL instead
      // (fox, box) — never assume, check the actual word.
      if (word && graphemePosition(word, answer) === "end") return `${word} ends with the ${kind} ${answer}!`;
      return word ? `${word} starts with the ${kind} ${answer}!` : `That's the ${kind} ${answer}!`;
    }
    case "word_build":
      return `That word is spelled ${answerTilesFor(item).join("-")}: ${answer}!`;
    case "read_word":
      return `You read it! That word is ${answer}.`;
    case "sight_word_match":
      return item.tricky_part ? `That word is ${answer} — the tricky part is ${item.tricky_part}!` : `That word is ${answer}!`;
    case "sentence_build":
      return `That sentence is: ${answer}`;
    case "sentence_read":
      return `You read it! That sentence is about a ${answer}.`;
    case "fix_sentence":
      return `That's right: ${answer}`;
    case "spelling_choice":
      // Module 50's word-family items reuse spelling_choice for a
      // genuinely different skill — both options are correctly spelled,
      // the point is which FORM fits the sentence — so "It's spelled X"
      // would be beside the point (nothing was misspelled).
      if (item.wordFamily) return `Yes! "${answer}" fits best here.`;
      return `Yes! It's spelled ${answer}.`;
    case "listen_choose":
    default:
      return `Listen — that's the ${answer.toLowerCase()} sound!`;
  }
}

// Which words a rhyme model example should show as individual, separately
// tappable cards (WordSoundRow) — replaces the old single merged-phrase
// AudioPlayer. Odd One Out's audio_asset already lists all 3 comparison
// words ("say:cat, hat, dog"); everything else is anchor + correct
// answer(s), so the child hears the anchor AND every rhyme, not just the
// anchor (the previous gap: narration promised "Cat... hat" but only "cat"
// ever played).
function modelWordsFor(item) {
  const raw = (item.audio_asset || "").replace(/^say:/, "");
  if (raw.includes(",")) return raw.split(",").map((w) => w.trim()).filter(Boolean);
  const anchor = raw.trim();
  const answers = item.type === "rhyme_select" ? item.correct_answers : [item.correct_answer];
  return [anchor, ...(answers || [])].filter(Boolean);
}

// Multiset difference: which tiles in a word_build item's tray don't end
// up used to build the target word — i.e. the decoy tile(s) the model
// stage should visibly call out, since the child never otherwise SEES
// that concept (the demo previously only played audio and showed text,
// never the actual tray — reported directly: "no extra letter" shown).
// Compares against answerTilesFor, not correct_answer's raw characters —
// a Level 2 item's tray tiles can be whole graphemes (e.g. "sh"), which a
// per-character diff against the answer text would wrongly flag as decoys.
function decoyLettersFor(item) {
  const counts = {};
  for (const l of item.letters || []) counts[l] = (counts[l] || 0) + 1;
  for (const l of answerTilesFor(item)) counts[l] = (counts[l] || 0) - 1;
  const decoys = [];
  for (const [l, c] of Object.entries(counts)) for (let i = 0; i < c; i++) decoys.push(l);
  return decoys;
}

// Whether a grapheme sits at the start or end of a word — used wherever
// narration needs to say "starts with"/"ends with" instead of assuming.
// Defaults to "start" for the (rare) case a grapheme is neither, or a
// short word where prefix and suffix overlap (e.g. a 1-letter word).
// Returns null (rather than guessing "start") when a digraph sits in the
// middle of a word (e.g. ph in "dolphin"/"elephant") — callers fall back
// to a position-free phrasing instead of claiming a wrong position, the
// same shape of bug Module 35's silent-letter narration caught live.
function graphemePosition(word, grapheme) {
  if (!word) return "start";
  if (word.startsWith(grapheme)) return "start";
  if (word.endsWith(grapheme)) return "end";
  return null;
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// "letter" reads correctly when every tray tile is one character (all of
// Level 1); once a tray can hold a whole grapheme like "sh" (Level 2
// digraphs on), "tile" is the accurate word for what's being left out.
function decoyNounFor(item) {
  if (item.type === "sentence_build") return "word";
  return (item.letters || []).every((t) => t.length === 1) ? "letter" : "tile";
}

// The model-stage heading text. Every lesson type here needs its own
// PER-EXAMPLE heading, not the lesson's static narration.model line —
// that line is only ever written once in content, so leaving it as the
// heading meant every example in a lesson showed the exact same "Sun
// starts with the letter s." text even as the word/letter/sound actually
// being demonstrated changed underneath it (reported directly: Module 3's
// example screens all read identically). Falls back to the static line
// only when an item genuinely doesn't have enough of its own fields to
// build a real per-example sentence (e.g. Module 8-style letter_prompt
// items with no audio anchor).
function modelHeadingFor(lesson, item) {
  if (WORD_CARD_LESSON_TYPES.includes(lesson.activity_type) && item.prompt) return item.prompt;
  if (item.type === "letter_sound_match") {
    const word = item.audio_asset?.replace(/^say:/, "");
    const kind = graphemeKindFor(item.correct_answer);
    if (item.silent && word) return `Listen. Which letter is silent in ${capitalize(word)}?`;
    if (item.yVowel && word) return `Listen. Does the y in ${capitalize(word)} say long e or long i?`;
    if (item.edSound && word) return `Listen. Does the -ed in ${capitalize(word)} say /t/, /d/ or /id/?`;
    if (word && kind === "ending") return `Listen. ${capitalize(word)} ends with ${item.correct_answer}.`;
    if (word && kind === "qu") return `Listen. ${capitalize(word)} starts with qu.`;
    if (word && kind === "digraph") {
      const pos = graphemePosition(word, item.correct_answer);
      return pos
        ? `Listen. ${capitalize(word)} has the digraph ${item.correct_answer} at the ${pos}.`
        : `Listen. ${capitalize(word)} has the digraph ${item.correct_answer} in it.`;
    }
    if (word && kind === "vowel team") return `Listen. ${capitalize(word)} has the vowel team ${item.correct_answer} in it.`;
    if (word && kind === "r-controlled vowel") return `Listen. ${capitalize(word)} has the r-controlled vowel ${item.correct_answer} in it.`;
    if (word && graphemePosition(word, item.correct_answer) === "end") return `Listen. ${capitalize(word)} ends with the ${kind} ${item.correct_answer}.`;
    return word ? `Listen. ${capitalize(word)} starts with the ${kind} ${item.correct_answer}.` : lesson.narration.model;
  }
  if (item.type === "word_build") {
    const word = capitalize(item.audio_asset?.replace(/^say:/, "") || item.correct_answer);
    const tiles = answerTilesFor(item);
    const decoyCount = (item.letters?.length || 0) - tiles.length;
    const noun = decoyNounFor(item);
    return decoyCount > 0
      ? `Listen. ${word}. Pick ${tiles.join(", ")} — and leave the extra ${noun}${decoyCount > 1 ? "s" : ""} behind!`
      : `Listen. ${word}. Tap ${tiles.join(", then ")} to build it!`;
  }
  if (item.type === "read_word" && item.written_word) {
    return `Read. ${capitalize(item.written_word.replace(/\.$/, ""))}. Find the picture that matches!`;
  }
  if (item.type === "sight_word_match") {
    return `Listen. This tricky word is ${item.correct_answer}. You can't sound out every letter — you just have to know it!`;
  }
  if (item.type === "sentence_build") {
    const words = answerTilesFor(item);
    const decoyCount = (item.letters?.length || 0) - words.length;
    return decoyCount > 0
      ? `Listen. "${item.correct_answer}" Tap the words in order — and leave the extra word behind!`
      : `Listen. "${item.correct_answer}" Tap the words in order to build it!`;
  }
  if (item.type === "sentence_read" && item.written_sentence) {
    return `Read the sentence, then find the picture it's about!`;
  }
  if (item.type === "fix_sentence") {
    return `A sentence starts with a capital letter and ends with a full stop. Which one is written correctly?`;
  }
  if (item.type === "spelling_choice" && item.wordFamily) {
    return item.prompt || "Which word fits best in this sentence?";
  }
  if (item.type === "spelling_choice") {
    const word = item.audio_asset?.replace(/^say:/, "");
    return word ? `Listen. Which spelling of "${word}" is correct?` : `Listen. Which spelling is correct?`;
  }
  if (item.type === "vowel_length") {
    const word = item.audio_asset?.replace(/^say:/, "");
    return word ? `Listen. Is the vowel sound in "${word}" short or long?` : lesson.narration.model;
  }
  return lesson.narration.model;
}

// A normalized signature for "is this example meaningfully the same rhyme
// family as one we've already shown" — used to dedupe the model carousel.
// Finish My Rhyme surfaced only 2 families across 5 cards because the first
// 5 unshuffled items were dog->log, log->dog, hen->pen, pen->hen, and a
// literal content duplicate of dog->log — this signature treats a
// reversed pair (or an exact repeat) as the same family so distinct
// families further down the item list get pulled in instead.
function exampleSignature(item) {
  if (WORD_MATCH_TYPES.includes(item.type) || item.type === "rhyme_select") {
    const anchor = (item.audio_asset || "").replace(/^say:/, "");
    const answers = item.type === "rhyme_select" ? item.correct_answers : [item.correct_answer];
    return [anchor, ...(answers || [])].map((w) => w.trim().toLowerCase()).sort().join("|");
  }
  return `${item.audio_asset}__${item.correct_answer}`;
}

// Picks up to `max` examples with distinct signatures, scanning the FULL
// item list (not just the first few in file order) so a lesson with
// several genuinely different families further down the list isn't
// crowded out by near-duplicates that happen to come first.
function pickDistinctExamples(items, max = 5) {
  const seen = new Set();
  const picked = [];
  for (const item of items) {
    const sig = exampleSignature(item);
    if (seen.has(sig)) continue;
    seen.add(sig);
    picked.push(item);
    if (picked.length >= max) break;
  }
  return picked;
}

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

// Shows once the child has gotten 2+ questions right in a row on the
// first try (a retry breaks the streak — this rewards clean answers,
// not eventual ones). Purely a session-local fun signal, not persisted.
function StreakBadge({ streak }) {
  if (streak < 2) return null;
  return (
    <div
      key={streak}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        margin: "0 auto 10px", width: "fit-content", padding: "4px 14px", borderRadius: 999,
        background: "#FFF4D6", border: `1.5px solid ${T.gold}`,
        fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 13, color: T.goldDeep,
        animation: "scd-pop 0.35s ease",
      }}
    >
      <Icon name="star" size={16} color={T.gold} /> {streak} in a row!
    </div>
  );
}

// Shows a tricky word with its irregular part (the bit that doesn't sound
// out the normal way, e.g. the "ai" in "said") picked out in a different
// colour — the standard "look at the tricky part" teaching technique for
// sight words. Falls back to plain text if an item has no tricky_part.
function TrickyWordDisplay({ word, trickyPart }) {
  const i = trickyPart ? word.toLowerCase().indexOf(trickyPart.toLowerCase()) : -1;
  if (i === -1) {
    return (
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 44, color: T.ink, letterSpacing: 1, margin: 0 }}>{word}</p>
    );
  }
  const before = word.slice(0, i), mid = word.slice(i, i + trickyPart.length), after = word.slice(i + trickyPart.length);
  return (
    <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 44, letterSpacing: 1, margin: 0 }}>
      <span style={{ color: T.ink }}>{before}</span>
      <span style={{ color: T.coralDeep }}>{mid}</span>
      <span style={{ color: T.ink }}>{after}</span>
    </p>
  );
}

// The Model/"Watch" stage: a carousel of worked examples. Its own
// component (rather than inline in LessonPlayer) so its auto-speak hook
// call is unconditional within ITS render — LessonPlayer only mounts this
// while stage === "model", so the hook's own lifecycle is always valid.
function ModelStage({ lesson, exampleItems, modelIdx, setModelIdx, next, ttsEnabled }) {
  const currentIdx = Math.min(modelIdx, exampleItems.length - 1);
  const currentExample = exampleItems[currentIdx];
  const isLast = currentIdx + 1 >= exampleItems.length;
  const isWordCardLesson = WORD_CARD_LESSON_TYPES.includes(lesson.activity_type);
  const heading = modelHeadingFor(lesson, currentExample);

  useAutoSpeak(heading, ttsEnabled);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, margin: 0 }}>
        Example {currentIdx + 1} of {exampleItems.length}
      </p>
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: T.ink, maxWidth: 420, margin: 0 }}>{heading}</p>
      {currentExample.written_word ? (
        <>
          <button
            onClick={() => spellOutWord(currentExample.correct_answer)}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 44, color: T.ink, letterSpacing: 1,
            }}
          >
            {currentExample.written_word}
          </button>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: T.textMute, marginTop: -8 }}>
            🔊 Tap the word to sound it out
          </span>
          {labelToIcon(currentExample.correct_answer) && <Illustration name={labelToIcon(currentExample.correct_answer)} size={88} />}
        </>
      ) : currentExample.letter_prompt ? (
        <LetterTile key={currentExample.activity_id} letter={currentExample.letter_prompt} size={96} />
      ) : isWordCardLesson ? (
        <WordSoundRow key={currentExample.activity_id} words={modelWordsFor(currentExample)} />
      ) : currentExample.type === "word_build" || currentExample.type === "sentence_build" ? (
        <>
          <AudioPlayer key={currentExample.activity_id} asset={currentExample.audio_asset} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {answerTilesFor(currentExample).map((piece, i) =>
              currentExample.type === "sentence_build"
                ? <WordTile key={`correct-${i}`} word={piece} state="correct" />
                : <LetterTile key={`correct-${i}`} letter={piece} size={44} state="correct" />
            )}
            {decoyLettersFor(currentExample).length > 0 && (
              <>
                <span style={{ color: T.textMute, fontSize: 18, fontFamily: "'Baloo 2', sans-serif" }}>+</span>
                {decoyLettersFor(currentExample).map((piece, i) =>
                  currentExample.type === "sentence_build"
                    ? <WordTile key={`decoy-${i}`} word={piece} state="wrong" disabled />
                    : <LetterTile key={`decoy-${i}`} letter={piece} size={44} state="wrong" disabled />
                )}
              </>
            )}
          </div>
          {decoyLettersFor(currentExample).length > 0 && (
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: T.coralDeep, margin: 0 }}>
              That extra {decoyNounFor(currentExample)} doesn't belong in this {currentExample.type === "sentence_build" ? "sentence" : "word"} — leave it out!
            </p>
          )}
        </>
      ) : currentExample.type === "sight_word_match" ? (
        <>
          <AudioPlayer key={currentExample.activity_id} asset={currentExample.audio_asset} />
          <TrickyWordDisplay word={currentExample.correct_answer} trickyPart={currentExample.tricky_part} />
        </>
      ) : currentExample.type === "sentence_read" ? (
        <>
          <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 26, color: T.ink, maxWidth: 380, lineHeight: 1.4, margin: 0 }}>
            {currentExample.written_sentence}
          </p>
          {labelToIcon(currentExample.correct_answer) && <Illustration name={labelToIcon(currentExample.correct_answer)} size={88} />}
        </>
      ) : currentExample.type === "fix_sentence" ? (
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 26, color: "#2C7A3C", maxWidth: 380, lineHeight: 1.4, margin: 0 }}>
          ✓ {currentExample.correct_answer}
        </p>
      ) : (
        <AudioPlayer key={currentExample.activity_id} asset={currentExample.audio_asset} />
      )}
      <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 17, color: T.goldDeep, margin: 0 }}>
        {modelCaptionFor(currentExample)}
      </p>
      <Btn
        variant="gold" size="lg"
        onClick={() => (isLast ? next() : setModelIdx((i) => Math.min(i + 1, exampleItems.length - 1)))}
      >
        {isLast ? (lesson.narration.transition || "Now you try!") : "Next example"}
      </Btn>
    </div>
  );
}

// onRecord receives { lessonId, mastery, ratio, attemptNumber, responses }
// the moment a challenge attempt is scored — pass or fail — so a score is
// never lost by leaving the screen early. The caller persists it via
// progressService; LessonPlayer itself has no storage dependency.
export function LessonPlayer({ lesson, onExit, onRecord }) {
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

  // Shuffled once per lesson mount (i.e. every time a lesson is opened —
  // Lesson/LessonPlayer fully remounts on open) so replaying a lesson
  // doesn't drill the exact same question order every time.
  const [practiceSeq] = useState(() => shuffled(practiceQuestions));
  const guidedQs = practiceSeq.slice(0, 2);
  const independentQs = practiceSeq.slice(2);

  // Up to 5 worked examples on the Model/"Watch" stage, drawn from the
  // lesson's own unshuffled practice items so every example is content
  // that's already authored — no separate example bank needed. Deduped by
  // rhyme family (see pickDistinctExamples) so a lesson whose first few
  // items happen to repeat a family still surfaces its full variety.
  const exampleItems = pickDistinctExamples(practiceQuestions, 5);
  const [modelIdx, setModelIdx] = useState(0);

  const [guidedIdx, setGuidedIdx] = useState(0);
  const [indepIdx, setIndepIdx] = useState(0);
  const [assessSeq, setAssessSeq] = useState(() => shuffled(assessmentQuestions));
  const [assessIdx, setAssessIdx] = useState(0);
  const [responses, setResponses] = useState([]); // [{questionId, skill, errorTag, correct}]
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [streak, setStreak] = useState(0);
  const [ttsEnabled, setTtsEnabledState] = useState(() => isTtsEnabled());
  const toggleTts = () => {
    setTtsEnabledState((v) => {
      const nextValue = !v;
      persistTtsEnabled(nextValue);
      return nextValue;
    });
  };

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

  const recordedAttempt = useRef(0);
  useEffect(() => {
    if (attemptComplete && recordedAttempt.current !== attemptNumber) {
      recordedAttempt.current = attemptNumber;
      onRecord({ lessonId: lesson.lesson_id, mastery: mastered, ratio, attemptNumber, responses });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptComplete, attemptNumber]);

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, fontWeight: 600 }}>
            {STAGE_LABELS[stage]}
          </span>
          <button
            onClick={toggleTts}
            aria-label={ttsEnabled ? "Turn off reading aloud" : "Turn on reading aloud"}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}
          >
            <Icon name={ttsEnabled ? "speaker" : "speaker-mute"} size={18} color={T.textMute} />
          </button>
        </div>
      </div>

      <div style={{ background: T.panel, borderRadius: 22, border: `1px solid ${T.line}`, padding: "32px 26px", minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {stage === "welcome" && (
          <NarrationScreen text={lesson.narration.welcome} illustrationAsset="magnifier" onNext={next} ttsEnabled={ttsEnabled} />
        )}
        {stage === "teach" && (
          <NarrationScreen text={lesson.narration.teach} illustrationAsset={lesson.activity_type} onNext={next} ttsEnabled={ttsEnabled} />
        )}
        {stage === "instruction" && (
          <NarrationScreen text={lesson.narration.instruction} illustrationAsset="magnifier" buttonLabel="I'm ready" onNext={next} ttsEnabled={ttsEnabled} />
        )}
        {stage === "model" && exampleItems.length > 0 && (
          <ModelStage
            lesson={lesson}
            exampleItems={exampleItems}
            modelIdx={modelIdx}
            setModelIdx={setModelIdx}
            next={next}
            ttsEnabled={ttsEnabled}
          />
        )}
        {stage === "guided" && guidedQs.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, marginBottom: 4 }}>
              Warm-up round · {guidedIdx + 1} of {guidedQs.length}
            </p>
            <StreakBadge streak={streak} />
            <QuestionCard
              key={guidedQs[guidedIdx].activity_id}
              question={guidedQs[guidedIdx]}
              mode="practice"
              ttsEnabled={ttsEnabled}
              onResult={(r) => {
                setStreak((s) => (r.attempts === 1 ? s + 1 : 0));
                guidedIdx + 1 < guidedQs.length ? setGuidedIdx((i) => i + 1) : next();
              }}
            />
          </div>
        )}
        {stage === "independent" && independentQs.length > 0 && (
          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: T.textMute, marginBottom: 4 }}>
              Solo mission · {indepIdx + 1} of {independentQs.length}
            </p>
            <StreakBadge streak={streak} />
            <QuestionCard
              key={independentQs[indepIdx].activity_id}
              question={independentQs[indepIdx]}
              mode="practice"
              ttsEnabled={ttsEnabled}
              onResult={(r) => {
                setStreak((s) => (r.attempts === 1 ? s + 1 : 0));
                indepIdx + 1 < independentQs.length ? setIndepIdx((i) => i + 1) : next();
              }}
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
              ttsEnabled={ttsEnabled}
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
            ttsEnabled={ttsEnabled}
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
            <Btn variant="gold" size="lg" onClick={onExit}>
              Back to path
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
