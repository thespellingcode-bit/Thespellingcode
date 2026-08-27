// src/services/questionTypes.js
//
// Comparison-type questions (same/different, loud/soft, fast/slow)
// aren't about identifying a picturable object — they're a judgment
// about a quality. Showing one arbitrary sound's picture or offering
// per-option playback doesn't make sense for them the way it does for
// "which sound is this" or "which word rhymes" questions. Shared
// between LessonPlayer (example-stage picture) and MultipleChoice
// (option pictures/sound) so the rule lives in exactly one place.
export const COMPARE_TYPES = ["same_different", "loud_soft", "fast_slow"];
