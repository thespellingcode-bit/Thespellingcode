# The Spelling Code — Module 1 (MVP architecture)

Content-driven learning engine. Level 1 → Module 1 (Listening Detective) only —
see the architecture review document for what's deliberately not built yet.

## Running it

This is a standard Vite + React project. **Requires Node.js and network access**
to install dependencies (this was built in a sandboxed environment with no
network access, so `npm install` has not been run or verified end-to-end here —
see the "Testing" note below for what has actually been verified).

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Testing

```bash
npm test
```

This runs `/test/*.test.mjs` under Node's built-in test runner — no install
required for this part, since the tests exercise the pure content/service
layer directly (no React, no bundler). Two kinds of tests:

- **Content integrity** (`test/content-integrity.test.mjs`) — validates the
  JSON content files themselves: every foreign-key-style reference resolves,
  every `correct_answer` is a valid option, every `error_tag` has a matching
  remediation entry, assessment questions don't silently duplicate practice
  questions, and exactly one module/badge is active (MVP scope guard).
- **Service unit tests** (`assessmentService`, `progressService`) — scoring,
  mastery threshold, error-tag aggregation, attempt accumulation.

**What has NOT been tested:** actual in-browser rendering, audio playback,
mobile/tablet responsiveness, or the full click-through lesson flow. Every
`.jsx`/`.js` file was individually syntax-checked with esbuild, and the field
names used by components were cross-checked against the JSON schema by hand —
but there is no substitute for `npm run dev` and clicking through Module 1 in
an actual browser before this is considered launch-ready. Do that next, on a
machine with network access.

## Folder structure

```
content/            Real JSON content files — the source of truth at runtime
  levels.json
  modules.json
  lessons.json
  activities.json      practice-stage questions
  assessments.json     assessment-stage questions (separate bank, not reused)
  remediation.json
  media.json
  badges.json
  parent_practice.json

src/
  components/        Reusable UI: LessonPlayer, QuestionCard, AudioPlayer,
                      ProgressBar, Badge, Feedback, ResultScreen, Icon,
                      NarrationScreen, TopBar, Onboarding, Btn
  activities/         One file per activity type + registry.js (the
                      type → component extension point)
  pages/              ChildHome, ParentDashboard, Lesson
  services/           contentService, assessmentService, progressService,
                      remediationService, audioService — all pure/testable,
                      contentService is the only file that imports content/*.json
  data/
    schemas.md         Documents every content JSON shape
  theme.js            Shared design tokens + font loading
  App.jsx             Top-level view state, wires services to pages
  main.jsx            React entry point

test/                Automated tests (see "Testing" above)
public/assets/        Placeholder folders for real audio/image files later
index.html, vite.config.js, package.json
```

## Adding a new Module 1 lesson

1. Add a row to `content/lessons.json`.
2. Add its practice questions to `content/activities.json` (`stage: "practice"`).
3. Add its **separate, novel** assessment questions to `content/assessments.json`.
4. If it needs an error tag not already in `content/remediation.json`, add a
   remediation entry — `npm test` will fail loudly if you forget.
5. No component code changes needed, unless the lesson needs a genuinely new
   activity type (see below).

## Adding a new activity type

1. Create `src/activities/YourType.jsx` (can usually just wrap `MultipleChoice`
   like the existing types do, if it's still an options-based question).
2. Add one line to `src/activities/registry.js`.

## Adding Module 2 (when ready)

1. Flip `active: true` for module 2 in `content/modules.json`.
2. Add its lessons/activities/assessments/remediation the same way as Module 1.
3. `ChildHome`, `ParentDashboard`, and `LessonPlayer` all iterate generically
   over whatever module/lesson data they're given — none of them assume
   there's only one module. `ChildHome` takes an optional `moduleId` prop
   (defaults to `1`) for exactly this reason. `ParentDashboard` currently
   still shows Module 1's lessons specifically (`getLessonsByModule(1)`
   hard-coded in that one file) — the equivalent small change there when
   Module 2 ships.
