// src/activities/registry.js
//
// Adding a NEW activity type (e.g. drag-and-drop letter tiles for a later
// module) means: (1) create the component, (2) add one line here. No
// other file needs to change — LessonPlayer and QuestionCard both go
// through this registry, never a type-specific switch statement.
import { ListenChoose } from "./ListenChoose";
import { SameDifferent } from "./SameDifferent";
import { Sort } from "./Sort";
import { SoundMemory } from "./SoundMemory";
import { RhymeMatch } from "./RhymeMatch";
import { RhymeSelect } from "./RhymeSelect";
import { BeginningSoundMatch } from "./BeginningSoundMatch";
import { EndingSoundMatch } from "./EndingSoundMatch";
import { VowelMatch } from "./VowelMatch";
import { LetterSoundMatch } from "./LetterSoundMatch";
import { WordBuilder } from "./WordBuilder";
import { ReadWord } from "./ReadWord";

export const ACTIVITY_REGISTRY = {
  listen_choose: ListenChoose,
  same_different: SameDifferent,
  loud_soft: Sort,
  fast_slow: Sort,
  segment_count: Sort,
  sound_memory: SoundMemory,
  rhyme_match: RhymeMatch,
  rhyme_select: RhymeSelect,
  beginning_sound_match: BeginningSoundMatch,
  ending_sound_match: EndingSoundMatch,
  vowel_match: VowelMatch,
  letter_sound_match: LetterSoundMatch,
  word_build: WordBuilder,
  read_word: ReadWord,
};

export function componentForType(type) {
  return ACTIVITY_REGISTRY[type] || ListenChoose; // safe fallback, never a blank screen
}
