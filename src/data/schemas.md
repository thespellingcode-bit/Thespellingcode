# Content Data Schemas

This documents the shape of every file in `/content`. These are the contracts
`src/services/contentService.js` reads — if you add a new module, lesson, or
question, follow these shapes and no application code needs to change.

---

## `levels.json`
```
{
  level_id: number,
  level_name: string,
  description: string,
  total_units: number
}
```

## `modules.json`
```
{
  module_id: number,
  level_id: number,
  module_name: string,
  module_goal: string,
  units: number,
  active: boolean   // only Module 1 is true right now — this is the MVP scope gate
}
```

## `lessons.json`
```
{
  lesson_id: string,          // "L1-M01-01"
  module_id: number,
  number: number,              // position within the module
  title: string,
  skill: string,                // e.g. "auditory_discrimination" — used to
                                 //   aggregate parent-dashboard skill status
  objective: string,
  activity_type: string,        // key into src/activities/registry.js
  estimated_time: string,
  masteryThreshold: number,     // 0-1, e.g. 0.8. NOT hard-coded anywhere else.
  status: "active" | "draft" | "locked",
  narration: {
    welcome: string,
    teach?: string,
    model?: string,             // optional — LessonPlayer only renders a
                                 //   "model" stage if this key exists
    transition?: string,
    instruction?: string,       // used instead of teach/model for
                                 //   activity_type: "assessment" lessons
    close: string
  }
}
```

## `activities.json` (practice-stage questions)
```
{
  activity_id: string,          // "Q-M01-01"
  lesson_id: string,
  stage: "practice",
  type: string,                  // matches an activity_type / registry key
  prompt: string,
  options: string[],
  correct_answer: string,        // MUST be one of options (tested)
  audio_asset: string,           // asset_id, looked up in media.json
  image_asset: string,
  feedback: string,              // shown on correct answer
  retry_feedback: string,        // shown on wrong answer (practice only)
  skill: string,
  error_tag: string               // MUST have a matching remediation.json entry (tested)
}
```

## `assessments.json` (scored assessment-stage questions)
```
{
  assessment_id: string,         // "AS-M01-01-1" (new Lesson N item) or
                                  //   "A-M01-06-N" (Module 1 final assessment)
  lesson_id: string,
  order: number,
  type: string,
  question: string,
  options: string[],
  correct_answer: string,
  audio_asset: string,
  skill: string,
  error_tag: string,
  review_flag?: string           // present when this item is NOT a fully
                                  //   novel example vs. its lesson's practice
                                  //   items — see EDUCATIONAL REVIEW REQUIRED
                                  //   in the architecture review
}
```
**Important:** assessment questions live in a completely separate array from
practice questions. `LessonPlayer` never falls back to practice items for
scoring — if `assessments.json` has no entries for a lesson, that lesson's
assessment stage has zero questions, which will surface as a visible bug
(intentional — this makes the "don't reuse practice as assessment" rule an
architectural fact, not a content-authoring convention someone has to remember).

## `remediation.json`
```
{
  remediation_id: string,
  error_tag: string,             // the join key with activities/assessments
  skill: string,
  trigger: string,                // human-readable description, not executable logic
  strategy: string                // shown to the child/parent verbatim
}
```

## `media.json`
```
{
  asset_id: string,               // matches audio_asset / image_asset above
  type: "audio" | "image",
  filename: string,               // target filename once real media exists
  lesson_id: string,
  production_brief: string,
  priority: "high" | "medium" | "low",
  placeholder: boolean,           // true = currently synthesized/icon, not real media
  placeholder_note: string
}
```

## `badges.json`
```
{
  badge_id: string,
  name: string,
  criteria: string,
  type: "module" | "milestone" | "level",
  module_id: number | null,
  active: boolean                 // only BADGE-01 is true right now
}
```

## `parent_practice.json`
```
{
  practice_id: string,
  module_id: number,
  title: string,
  instructions: string,
  time: string,
  note: string
}
```

---

## Runtime state (not content — lives in Claude's storage, see `progressService.js`)
```
{
  profile: { child_id, name, avatar, createdAt } | null,
  progress: {
    [lesson_id]: { attempts, bestScore, mastery, completed, updatedAt }
  },
  errorLog: [
    { child_id, lesson_id, question_id, skill, error_tag, attempt_number, timestamp }
  ],
  badges: [badge_id, ...]
}
```
This is single-child only. Multi-child support means `profile` becomes a list
and every key under `progress`/`errorLog` becomes child-scoped — a real schema
change, not additive (flagged in the architecture review).
