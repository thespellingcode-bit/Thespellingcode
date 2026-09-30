// src/services/questionTypes.js
//
// Comparison-type questions (same/different, loud/soft, fast/slow)
// aren't about identifying a picturable object — they're a judgment
// about a quality. Showing one arbitrary sound's picture or offering
// per-option playback doesn't make sense for them the way it does for
// "which sound is this" or "which word rhymes" questions. Shared
// between LessonPlayer (example-stage picture) and MultipleChoice
// (option pictures/sound) so the rule lives in exactly one place.
export const COMPARE_TYPES = ["same_different", "loud_soft", "fast_slow", "segment_count", "vowel_length"];

// Question types where tapping an option should PREVIEW it (play its
// sound, mark it picked) rather than immediately committing an answer —
// a separate "Check my answer" confirms. Lets a child listen to each
// option before deciding, which matters for types built entirely around
// comparing spoken words (rhyming, beginning sounds) the same way it
// already did for rhyme_match. Shared between MultipleChoice (the
// preview/confirm gate) and LessonPlayer (model-stage word cards, dynamic
// per-example heading, example dedup) so new word-comparison types only
// need to be added here once.
export const PREVIEW_CONFIRM_TYPES = ["rhyme_match", "beginning_sound_match", "ending_sound_match", "vowel_match", "letter_sound_match"];

// A word_build item's tray tiles, in build order. Plain CVC content never
// sets `answer_tiles` explicitly — every tile is one letter, so it falls
// back to splitting correct_answer into characters (unchanged behavior).
// Level 2 content sets it explicitly wherever a tile is a whole grapheme
// bigger than one letter (e.g. "sh" as a single tile for "ship"), since
// that can't be recovered by splitting the answer text itself.
export function answerTilesFor(item) {
  return item.answer_tiles || (item.correct_answer || "").split("");
}

// A digraph (sh, ch, th, wh...) is two letters making ONE sound — the
// opposite idea from a blend (fl, cr...), which is two letters keeping
// their OWN two sounds said quickly together. An ending (ck, tch, dge,
// ng, nk) is also two-or-three letters making one sound, like a digraph,
// but — unlike sh/ch/th/wh — it only ever appears at the end of a word,
// so narration calls it an "ending" rather than dynamically checking
// position. Narration must never call one of these the wrong name, so
// this is a real lookup, not just a "more than one character" check.
// Extend these sets as later modules teach more graphemes.
const DIGRAPHS = new Set(["sh", "ch", "th", "wh"]);
const ENDINGS = new Set(["ck", "tch", "dge", "ng", "nk"]);
// Level 3: two letters making ONE long-vowel sound (ai, ay...) — the same
// underlying definition as a digraph (two letters, one sound), but a vowel
// TEAM is not a consonant digraph, so it gets its own label rather than
// overloading "digraph" — matches the standing rule from Level 2 that
// narration must name the right concept. Extend as each later Level 3
// module teaches more (ee/ea, oa/ow, oi/oy, ou/ow).
// "ow" is reused across two Level 3 modules for two different sounds —
// long O (Module 22's "snow") and this module's /ow/ (as in "cow"). This
// set only needs to know it's a vowel team either way; which SOUND it
// makes is content, not something graphemeKindFor tracks.
const VOWEL_TEAMS = new Set(["ai", "ay", "ee", "ea", "oa", "ow", "oi", "oy", "ou"]);
// "qu" is always taught and tiled as one inseparable pair (English never
// spells /kw/ with a bare q) — not a digraph (it's two sounds, k+w, not
// one) and always word-initial like a blend, but it isn't "two already-
// known letters" either since w on its own is never taught. Its own kind
// keeps the narration honest without overloading "blend" or "digraph".
export function graphemeKindFor(grapheme) {
  if (grapheme === "qu") return "qu";
  if (DIGRAPHS.has(grapheme)) return "digraph";
  if (ENDINGS.has(grapheme)) return "ending";
  if (VOWEL_TEAMS.has(grapheme)) return "vowel team";
  if (grapheme.length > 1) return "blend";
  return "letter";
}
