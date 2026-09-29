// src/services/questionTypes.js
//
// Comparison-type questions (same/different, loud/soft, fast/slow)
// aren't about identifying a picturable object — they're a judgment
// about a quality. Showing one arbitrary sound's picture or offering
// per-option playback doesn't make sense for them the way it does for
// "which sound is this" or "which word rhymes" questions. Shared
// between LessonPlayer (example-stage picture) and MultipleChoice
// (option pictures/sound) so the rule lives in exactly one place.
export const COMPARE_TYPES = ["same_different", "loud_soft", "fast_slow", "segment_count"];

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
// their OWN two sounds said quickly together. Narration must not call a
// digraph a "blend" or vice versa, so this is a real lookup, not just a
// "more than one character" length check. Extend this set as later
// modules teach more digraphs (e.g. ck, tch, dge, ng, nk).
const DIGRAPHS = new Set(["sh", "ch", "th", "wh"]);
export function graphemeKindFor(grapheme) {
  if (DIGRAPHS.has(grapheme)) return "digraph";
  if (grapheme.length > 1) return "blend";
  return "letter";
}
