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

export const ACTIVITY_REGISTRY = {
  listen_choose: ListenChoose,
  same_different: SameDifferent,
  loud_soft: Sort,
  fast_slow: Sort,
  sound_memory: SoundMemory,
  rhyme_match: RhymeMatch,
  rhyme_select: RhymeSelect,
  beginning_sound_match: BeginningSoundMatch,
};

export function componentForType(type) {
  return ACTIVITY_REGISTRY[type] || ListenChoose; // safe fallback, never a blank screen
}
