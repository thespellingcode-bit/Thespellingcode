## 1. Project notes

### What this is
**The Spelling Code** is a web app that teaches young children (launch target: about ages 4–7) to listen, read and spell using synthetic phonics: letters are taught in small clusters, and children immediately use them to build, read and spell real words. It is playful on purpose — a Detective Fox mascot, missions, badges — not test-like.

- **Live app:** https://the-spelling-code.netlify.app (public, no login)
- **Owner:** the product and curriculum owner decides what is taught; the developer (Claude) builds it and documents every substitution or gap here and in `content/word-library.md`.
- **Progress storage:** the child's browser (`localStorage`), one child profile, no accounts, no backend.
- **Feedback loop:** the Parent Dashboard has “Share my progress” and “Send feedback” buttons that open WhatsApp to the owner with a pre-filled message. No server involved.

### The six-level roadmap (from the Master Curriculum Blueprint v0.1)
| Level | Name | Approx. age | Blueprint modules | State |
|---|---|---|---|---|
| 1 | Sound Explorer | 4–5 | 10 | **Modules 1–7 built** (structure redesigned into letter clusters) |
| 2 | Word Builder | 5–6 | 8 | **In progress** — 5 of 8 modules built (Modules 9–13); see the Level 2 plan for the rest |
| 3 | Pattern Detective | 6–7 | 10 | Not started |
| 4 | Spelling Detective | 7–9 | 13 | Not started |
| 5 | Word Builder Pro | 9–11 | 10 | Not started |
| 6 | Word Master | 11–15 | 10 | Not started |

The blueprint's Level 1 has 10 one-skill modules; the app's Level 1 was redesigned (with the owner's approval) into letter-cluster modules, so its module list no longer matches the blueprint's.

### Where the build stands
| Piece | State |
|---|---|
| Level 1 “Sound Explorer”, Modules 1–7 | **Built and deployed** (the agreed launch set) |
| Level 1 Module 8 (Master Assessment) | **Built** — one cumulative 16-item test across every Level 1 skill; earns the “Level 1 Sound Explorer” badge |
| Level 2 “Word Builder”, Modules 9–16 (CVC Review, Consonant Blends, Digraphs, Common Endings, Qu & Patterns, Letter Cluster 5, Tricky Words, Sentence Spelling) | **Built and deployed** |
| Level 2 Module 17 (Review & Assessment) | Not built — the last module in Level 2 |
| Level 3 and beyond, payments, accounts, teacher/school features, AI tutor, analytics, CMS, placement test | Out of scope until the owner asks |

**Launch plan:** 7 modules for ages roughly 4–6; add Module 8 (My First Sentences) if many 7-year-olds are in the audience. Modules 1–2 may be easy for confident 7-year-olds; “unlock all” in the Parent Dashboard lets a parent skip ahead.

### Curriculum design
- **Modules 1–2 — Listening Detective, Rhyme Detective:** general sound awareness, no letters. Built first and kept as designed.
- **Modules 3–6 — Letter Clusters** (Jolly Phonics / Letters and Sounds style): s a t p i n → m d g o c → k b h r e → l f u. That is all 19 Level 1 letters.
- **Every cluster has the same five lessons:** Meet the Letters (hear a word, pick its first letter) → Blend & Build (build a heard word from a tray of exactly the right letters) → Read the Words (read a written word, pick its picture) → Spell the Words (build a heard word from a tray with one extra decoy letter) → Cluster Challenge (scored, mixed).
- **Module 7 — Level 1 Review:** the same five lessons but mixing words from all clusters; the final Level 1 Challenge has 11 items.
- **Word rules:** simple CVC words only. No digraphs, blends, silent e, vowel teams or r-controlled vowels (“her”, “car” are excluded). Curriculum boundary: no c/k/ck choices, no ff/ll/ss doubling.
- **The c/k decision:** “c” is taught as a second letter for the /k/ sound (needed for cat, cap, can, cup). No question ever makes a child choose between c and k: they are never offered together as letter options, and a decoy tray never pairs one with a word using the other.
- **Letter sounds, not names:** text-to-speech reads a bare letter by its name (“em”), which teaches the wrong thing. So the app never speaks an isolated letter; “tap a word to sound it out” uses phoneme approximations (n → “nnn”, a → “ah”, p → “puh”) and then the whole word.
- **Mastery:** each lesson has a mastery threshold (80%). A module is complete when all its lessons are mastered.

### Level 2 curriculum design (Modules 9–16 of 17 built)
- **Module 9, CVC Review & Automaticity:** no new letters — pure review of Level 1's 19 letters, plus one lesson teaching common doubled-letter-ending words (off, bell, hill, doll...) receptively only. A child builds/reads these correctly without ever being asked to *choose* a spelling — that choice stays a Level 4 topic, matching the c/k precedent from Level 1.
- **Module 10, Consonant Blends** (bl/cl/fl/gl/pl/sl, br/cr/dr/fr/gr/pr/tr): a blend is two already-known letters said quickly together, so it needs no new letter and no new tile — each blend letter is tapped separately, exactly like any other CVC word.
- **Module 11, Digraphs** (sh, ch, th, wh) and **Module 12, Common Endings** (-ck, -tch, -dge, -ng, -nk): unlike a blend, these are two-or-three letters making **one** sound, so the tray must offer them as a single tile (see “Multi-letter tiles” below). Digraphs can sit at the start or end of a word (ship vs. fish); endings only ever sit at the end.
- **Module 13, Qu & Common Patterns:** “qu” is tiled as one inseparable unit like a digraph (English never spells /kw/ with a bare q), plus s-blends and end-blends, which — like Module 10's blends — are just pairs of already-known letters needing no new tile.
- **Narration must name the right concept.** A blend is not a digraph is not an ending is not qu — conflating them (e.g. calling “ck” a “blend” because it's more than one character) is a real bug that shipped once and was caught by a live browser check, not by the test suite. `graphemeKindFor()` in `src/services/questionTypes.js` is the single source of truth for which is which; extend its `DIGRAPHS`/`ENDINGS` sets when a later module adds more, rather than guessing from a grapheme's length.
- **Multi-letter tiles.** A `word_build` item can set `answer_tiles` (e.g. `["sh", "i", "p"]` for “ship”) so a tray tile can hold a whole grapheme instead of always one letter. Every place that used to do `correct_answer.split("")` — the tile count, the decoy calculation, the Watch-stage demo, the narration — now goes through `answerTilesFor()` instead. Level 1 content never sets `answer_tiles`, so it's unaffected; this is purely additive.
- **Known letters gap — resolved.** Level 1's 19 letters never included j, v, w, x, y, z. Flagged while building Module 13, and fixed with a new **Module 14, Letter Cluster 5** (same 5-lesson shape as Level 1's clusters) — the alphabet is complete from here on (q is still never taught alone, only as "qu").
- **Module 15, Tricky Words:** a new activity type, `sight_word_match` — deliberately audio-first (hear the whole word, then pick it from similar-looking real-word decoys like was/saw/has), never the written-word tap-to-sound-out pattern, because sounding out an irregular word like "said" letter by letter teaches the wrong pronunciation. The Watch-stage demo highlights the word's irregular part in a different colour (`tricky_part` field, e.g. "ai" in "said") — the standard sight-word teaching technique.
- **Module 16, Sentence Spelling — three more new activity types**, all reusing `MultipleChoice`'s existing plain-text-option fallback rather than needing new picker UI:
  - `sentence_build`: the sentence-level sibling of `word_build`. A new `WordTile` component (auto-width, not a fixed square like `LetterTile`) and a new `SentenceBuilder` component — the one real behavioural difference from word-building is that words join with a **space**, not nothing, so this couldn't just reuse `WordBuilder` with different tiles. Content always sets `answer_tiles` explicitly (e.g. `["The", "cat", "sat."]`); `answerTilesFor()`/`decoyLettersFor()` needed no changes since they already treat a tray as a generic list of tiles, letters or words alike.
  - `sentence_read`: written_sentence field (deliberately separate from `written_word` — see next point) plus picture options, reusing `read_word`'s picture-matching idea at sentence scale.
  - `fix_sentence`: two plain-text options, one correctly capitalised/punctuated, one not — simpler than building an interactive text editor, while still testing the same recognition.
  - **Two bugs found live, not by the test suite, while verifying this module:** (1) `labelToIcon`'s substring matching, fine for isolated CVC words, false-positives on real running text — "then" contains "hen", so a sight/sentence option could silently show an unrelated picture; `sight_word_match` and `fix_sentence` options now never get a picture, matched or not. (2) `spellOutWord` strips punctuation and spaces then sounds out whatever's left as ONE word, so wiring a sentence into the existing `written_word` field would try to sound out "The cat sat." as "thecatsat" — hence the separate `written_sentence` field, rendered as plain non-interactive text instead.
  - Two of the app's own generic content-integrity tests didn't know about sentence-shaped content and needed updates: the "correct_answer is among options" test now recognises `sentence_build` as tile-based (like `word_build`) rather than expecting an `options` array it doesn't have, and the decodability test now splits a `correct_answer`/`written_sentence` on whitespace and checks each word separately, since a bare space or period was never a "taught letter" and was never meant to be one.

### Access rules (free vs paid) — business decision made 2026-09-30, not yet built
- **All of Level 1 (Modules 1–8) is free**, no exceptions. **Level 2 onward is paid.** This replaces an earlier score-gated shortcut (Module 1 → 2 unlocked free at an 85% score) that only applied to one boundary — removed as redundant once the owner decided all of Level 1 would be free outright.
- Every module still unlocks only after the previous one is fully mastered (`moduleUnlocked` in `ChildHome.jsx`) — that gating is unchanged; what's new is a *payment* gate still to be added at the Level 1 → Level 2 boundary specifically.
- **Not yet implemented:** there is no paywall in the app yet. Level 2 (Modules 9–14, all built) is currently reachable the same way Level 1 is, gated only by mastery — building the actual Level 2 payment gate is on hold until the payment gateway and pricing are decided (see “Monetisation” below).
- Parent Dashboard has an “unlock all” switch for reviewing and testing (unaffected by any of this).

### Monetisation (in progress, 2026-09-30 — not yet built)
- **Decision made:** free/paid boundary is Level 1 (free) / Level 2+ (paid), confirmed by the owner.
- **Decision deferred:** which payment gateway (Razorpay, Instamojo, Gumroad, or a manual UPI flow) — owner wants to build the app-side pieces (sign-up, payment screen UI) first and pick a gateway later. See the pricing research the assistant did on 2026-09-30 for Indian-market comparables and a recommended price point.
- **Reality check for whoever builds this next:** the app has zero backend today (`localStorage` only, no accounts). A real paywall needs *some* way to verify payment that a technical user can't trivially bypass by editing `localStorage` (the existing `settings.unlockAll` toggle is proof this is easy to flip today) — plan for at least a minimal serverless check (e.g. a Netlify Function verifying a payment/license token), not a client-only "if paid flag is true" gate, once real money is involved.

### Architecture (how the code is organised)
- **Stack:** Vite + React (plain JS/JSX, no TypeScript). Tests use Node's built-in runner. No backend.
- **Content is data.** The whole curriculum lives in `content/*.json`. Only `src/services/contentService.js` imports it, so the loading method can change later without touching the app. Adding a lesson or question means adding JSON, not code (shapes are in `src/data/schemas.md`).
- **Activity registry.** `src/activities/registry.js` maps a lesson's `activity_type` to a React component. A new question type is one component plus one registry line.
- **Lesson flow.** `LessonPlayer.jsx` runs each lesson as a fixed sequence of stages: welcome → teach → watch (worked examples) → warm-up → solo → challenge → result → (practice-more if not mastered) → done.
- **Audio.** `audioService.js` plays real recordings when one exists (`REAL_AUDIO_FILES`, files in `public/audio/`), otherwise synthesizes a placeholder with Web Audio, and speaks words with the browser's speech voice. Real recordings deliberately bypass the synthesizer's shared compressor, which had been squashing loud/soft contrast.
- **Pictures.** Hand-drawn inline SVG in `Illustration.jsx`, plus image files in `public/img/words/` (Google Noto Emoji). A new picture-only word = drop an SVG in that folder, add the word to `WORD_KEYS` in `Icon.jsx` and `IMAGE_BG` in `Illustration.jsx`.
- **Progress and scoring.** `progressService.js` (attempts, best score, mastery that never reverts), `assessmentService.js` (scoring), `remediationService.js` (error tags → “practice more” advice).

### Decisions worth remembering
- **Loud and Soft uses recognisable real-world sounds from the owner's reference chart** — thunder and a clap (loud); wind, bell, birds, dripping water (soft). Drums and violins were tried and rejected: the owner did not want children learning “that's a drum”; the lesson is loudness only.
- **Audio sources:** thunder, wind and car were supplied by the owner. Birds and dripping water come from Mixkit (free commercial use, no credit needed). Pixabay's sounds were rejected as low quality. The birds clip was trimmed and volume-boosted because the original was very quiet.
- **The old score-gated free unlock (85% at Module 1 → 2) was removed 2026-09-30** once the owner decided all of Level 1 would be free outright, making a partial shortcut redundant. See “Monetisation” above.
- **The mascot** appears on the welcome header and result screen only — not the top bar, the Parent Dashboard or per-question feedback.
- **Playfulness:** the owner wants a game-like feel, and practice questions are randomised.
- **Design inspiration** was taken from other children's apps for look and feel only, never for curriculum content.

### Working agreements
1. **Pictures and other assets:** when the library runs thin, take freely licensed material from the internet on judgment; store the license and credits beside the files and note the source here.
2. **This document stays in sync.** After any content or code change: run `npm run docs`, run `npm test` (a test fails if this document is stale), commit, push to GitHub, and deploy.
3. **Everything is committed to GitHub**, code and curriculum together.

### How to run, test, publish
```bash
npm install
npm run dev        # local app at http://localhost:5173
npm test           # content integrity, scoring/progress logic, and this document being up to date
npm run docs       # regenerate this document
npm run build && npx netlify-cli deploy --prod --dir=dist    # publish
```
Netlify hosting is on the paid Personal plan. If a Netlify project ever shows a login wall, change that project's own Visitor access setting; the team-wide default only applies to new projects.

### Known gaps and ideas
- Only about 49 word pictures exist, so pictures repeat as wrong-answer options. The “fog” picture (a cloud) is the least clear. More pictures are welcome.
- Only two reliable loud sounds (thunder, clap) exist, so loud assessment items repeat practice items; these are marked with review flags in the tables below. A friendly real recording of another loud sound from the chart (for example a bang) would widen it.
- Sound-out audio depends on each device's speech voice and should be tried on a real phone.
- Clap, bell, clock, rain, phone and siren are still synthesized placeholders; real recordings would improve them.
- Level 2 Modules 14–16 (Tricky Words, Sentence Spelling, Review & Assessment) are not built.
- j, v, w, x, y, z are never taught anywhere in Level 1 or Level 2 so far — see the Level 2 curriculum design note above.
- A handful of common digraph/ending words have no clean picture (ch, wh, -tch, -nk) — those lessons' Read the Words pool is thinner than other lessons', with real gaps marked by `review_flag` in the content.

### Build log
- Level 1 first built as 15 planned modules (one skill each), then **redesigned into letter-cluster modules** after playing through showed thin, repetitive word pools.
- Added the Detective Fox mascot, an accordion module list, the score-gated free unlock, the “unlock all” switch, WhatsApp sharing and feedback.
- Fixed per-example headers, missing pictures, decoy-letter demonstration, and the loud/soft audio (several rounds, ending with chart-based sounds).
- Added tap-to-sound-out for written words.
- Built Letter Clusters 1–4 and the Level 1 Review; added 11 word pictures from Noto Emoji; set up this master document and GitHub.
- Fixed a bug where a lesson's score was only saved after tapping all the way through to "Back to path" — a failed attempt, or leaving early, silently lost the score. Scores now save the instant a challenge is scored. Also fixed a double-tap on an answer counting as two answers.
- Moved GitHub ownership to a dedicated account/email for the project, separate from the owner's personal one; Netlify stays on the owner's personal account for now by their choice.
- Built Level 1 Module 8 (Master Assessment) and Level 2 Modules 9–13, plus the groundwork they needed (multi-letter tiles, blend/digraph/ending-aware narration). See the Level 2 curriculum design note above for what each module teaches and the known-letters gap it surfaced.
- Built Level 2 Module 14 (Letter Cluster 5: j v w x y z) once the known-letters gap started blocking real words; fixed a narration bug it surfaced (a single letter like "x" assumed to always be word-initial, wrong for "fox").
- Owner decided the monetisation boundary: all of Level 1 free, Level 2 onward paid. Removed the old score-gated 85% shortcut at Module 1 → 2 as redundant. No paywall is built yet — see “Monetisation” above.
- Owner changed plans: build out Level 2 fully before going live/monetising, rather than launching with only 2 levels. Built Level 2 Module 15 (Tricky Words, new sight_word_match type) and Module 16 (Sentence Spelling, three new activity types plus a WordTile component) — see the Level 2 curriculum design note above. Only Module 17 (Review & Assessment) is left to finish Level 2.
