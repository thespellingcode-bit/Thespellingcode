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
export const PREVIEW_CONFIRM_TYPES = ["rhyme_match", "beginning_sound_match", "ending_sound_match", "vowel_match"];
