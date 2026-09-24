# The Spelling Code — Master Document

> **Generated file — do not edit by hand.** Edit `docs/project-notes.md` for the written sections and the content JSON under `content/` for the curriculum, then run `npm run docs`. Everything from “Curriculum” down is built directly from the live content files, so it always matches the app.

## Contents
1. Project notes (purpose, scope, architecture, decisions, workflow)
2. Curriculum at a glance
3. Curriculum in full (every module, lesson and question)
4. Content library (pictures, audio, badges)
5. Code map

---

## 1. Project notes

### What this is
**The Spelling Code** is a web app that teaches young children (launch target: about ages 4–7) to listen, read and spell using synthetic phonics: letters are taught in small clusters, and children immediately use them to build, read and spell real words. It is playful on purpose — a Detective Fox mascot, missions, badges — not test-like.

- **Live app:** https://the-spelling-code.netlify.app (public, no login)
- **Owner:** the product and curriculum owner decides what is taught; the developer (Claude) builds it and documents every substitution or gap here and in `content/word-library.md`.
- **Progress storage:** the child's browser (`localStorage`), one child profile, no accounts, no backend.
- **Feedback loop:** the Parent Dashboard has “Share my progress” and “Send feedback” buttons that open WhatsApp to the owner with a pre-filled message. No server involved.

### Where the build stands
| Piece | State |
|---|---|
| Level 1 “Sound Explorer”, Modules 1–7 | **Built and deployed** (the agreed launch set) |
| Modules 8–11 (sentences, tricky words, spiral review, master assessment) | Not built. Listed as inactive in `content/modules.json`. Build only when the owner asks. |
| Level 2 and beyond, payments, accounts, teacher/school features, AI tutor, analytics, CMS, placement test | Out of scope until the owner asks |

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

### Access rules (free vs full)
- Module 1 is free. **Module 2 unlocks free if the child scores 85% or more on Module 1's challenge** (`FREE_UNLOCK_FROM_MODULE_ID = 1`, `MODULE_UNLOCK_THRESHOLD = 0.85` in `progressService.js`). This shortcut applies only at the Module 1 → 2 boundary.
- Every other module unlocks only after the previous module is fully mastered.
- Parent Dashboard has an “unlock all” switch for reviewing and testing.

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
- **Only one 85% unlock**, at Module 1 → 2, because the owner does not want later modules free.
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
- Modules 8–11 and Level 2 are not built.

### Build log
- Level 1 first built as 15 planned modules (one skill each), then **redesigned into letter-cluster modules** after playing through showed thin, repetitive word pools.
- Added the Detective Fox mascot, an accordion module list, the score-gated free unlock, the “unlock all” switch, WhatsApp sharing and feedback.
- Fixed per-example headers, missing pictures, decoy-letter demonstration, and the loud/soft audio (several rounds, ending with chart-based sounds).
- Added tap-to-sound-out for written words.
- Built Letter Clusters 1–4 and the Level 1 Review; added 11 word pictures from Noto Emoji; set up this master document and GitHub.

---

## Curriculum at a glance

- **Level 1** — Sound Explorer — Listening → phonemic awareness → phonics → CVC reading → CVC spelling → simple sentences.

| Module | Name | Status | Lessons | Practice items | Assessment items |
|---|---|---|---|---|---|
| 1 | Listening Detective | **Live** | 6 | 28 | 34 |
| 2 | Rhyme Detective | **Live** | 6 | 35 | 47 |
| 3 | Letter Cluster 1: s a t p i n | **Live** | 5 | 19 | 27 |
| 4 | Letter Cluster 2: m d g o c | **Live** | 5 | 20 | 28 |
| 5 | Letter Cluster 3: k b h r e | **Live** | 5 | 20 | 28 |
| 6 | Letter Cluster 4: l f u | **Live** | 5 | 20 | 28 |
| 7 | Level 1 Review | **Live** | 5 | 20 | 31 |
| 8 | My First Sentences | Not built | 0 | 0 | 0 |
| 9 | Tricky Words | Not built | 0 | 0 | 0 |
| 10 | Spelling Detective Review | Not built | 0 | 0 | 0 |
| 11 | Level 1 Master Assessment | Not built | 0 | 0 | 0 |

## Curriculum in full

Read it as: what the child hears or sees → what they choose or build → the correct answer. “Practice” items appear in the warm-up and solo rounds; “Assessment” items are the scored challenge.

### Module 1 — Listening Detective

*Goal:* Build careful listening and auditory discrimination.

#### Lesson 1: What Is a Sound? (`L1-M01-01`)

- **Objective:** Identify and match familiar environmental sounds.
- **Skill:** auditory_discrimination · **Activity:** listen_choose · **Time:** 4–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Welcome, Sound Detective! Put on your listening ears.
- **Narration (teach):** A sound is something we can hear. We hear sounds all around us.
- **Narration (model):** Listen. What do you hear?
- **Narration (transition):** Now you try! Listen first, then choose.
- **Narration (close):** Fantastic listening! You are becoming a Sound Detective.

**Practice**

| ID | Item |
|---|---|
| Q-M01-01 | sound: bell \| options Bell, Phone, Wind \| answer **Bell** |
| Q-M01-02 | sound: clock \| options Clock, Wind, Bell \| answer **Clock** |
| Q-M01-03 | sound: car \| options Car, Phone, Clock \| answer **Car** |
| Q-M01-04 | sound: rain \| options Rain, Wind, Car \| answer **Rain** |
| Q-M01-05 | sound: bell \| options Bell, Phone, Rain \| answer **Bell** |
| Q-M01-26 | sound: phone \| options Phone, Bell, Wind \| answer **Phone** |
| Q-M01-27 | sound: wind \| options Wind, Rain, Phone \| answer **Wind** |
| Q-M01-28 | sound: siren \| options Siren, Bell, Thunder \| answer **Siren** |
| Q-M01-29 | sound: thunder \| options Thunder, Car, Siren \| answer **Thunder** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M01-01-1 | sound: car \| options Car, Siren, Wind \| answer **Car** | Vocabulary widened to 6 sounds (bell/clock/car/rain/phone/wind — see content/word-library.md §4), which fixes distractor variety, but a 'name this sound' item still can't test a truly novel (sound, answer) pair once practice has already established every sound's own correct identity - that's inherent to an identity-matching format, not a vocabulary-size problem. An 'odd one out' style item (compare 3 sounds, pick the different one, as used in Module 2 Lesson 3) would give genuine transfer here. |
| AS-M01-01-2 | sound: rain \| options Rain, Wind, Phone \| answer **Rain** | Vocabulary widened to 6 sounds (bell/clock/car/rain/phone/wind — see content/word-library.md §4), which fixes distractor variety, but a 'name this sound' item still can't test a truly novel (sound, answer) pair once practice has already established every sound's own correct identity - that's inherent to an identity-matching format, not a vocabulary-size problem. An 'odd one out' style item (compare 3 sounds, pick the different one, as used in Module 2 Lesson 3) would give genuine transfer here. |
| AS-M01-01-3 | sound: bell \| options Bell, Thunder, Phone \| answer **Bell** | Vocabulary widened to 6 sounds (bell/clock/car/rain/phone/wind — see content/word-library.md §4), which fixes distractor variety, but a 'name this sound' item still can't test a truly novel (sound, answer) pair once practice has already established every sound's own correct identity - that's inherent to an identity-matching format, not a vocabulary-size problem. An 'odd one out' style item (compare 3 sounds, pick the different one, as used in Module 2 Lesson 3) would give genuine transfer here. |
| AS-M01-01-4 | sound: clock \| options Clock, Phone, Wind \| answer **Clock** | Vocabulary widened to 6 sounds (bell/clock/car/rain/phone/wind — see content/word-library.md §4), which fixes distractor variety, but a 'name this sound' item still can't test a truly novel (sound, answer) pair once practice has already established every sound's own correct identity - that's inherent to an identity-matching format, not a vocabulary-size problem. An 'odd one out' style item (compare 3 sounds, pick the different one, as used in Module 2 Lesson 3) would give genuine transfer here. |
| AS-M01-01-5 | sound: car \| options Car, Bell, Thunder \| answer **Car** | Vocabulary widened to 6 sounds (bell/clock/car/rain/phone/wind — see content/word-library.md §4), which fixes distractor variety, but a 'name this sound' item still can't test a truly novel (sound, answer) pair once practice has already established every sound's own correct identity - that's inherent to an identity-matching format, not a vocabulary-size problem. An 'odd one out' style item (compare 3 sounds, pick the different one, as used in Module 2 Lesson 3) would give genuine transfer here. |

#### Lesson 2: Same or Different? (`L1-M01-02`)

- **Objective:** Determine whether two sounds are the same or different.
- **Skill:** auditory_discrimination · **Activity:** same_different · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today we are going to compare sounds.
- **Narration (teach):** If two sounds match, they are the same. If they do not match, they are different.
- **Narration (model):** Listen to these two sounds. Same or different?
- **Narration (close):** Great comparing! Your ears noticed the difference.

**Practice**

| ID | Item |
|---|---|
| Q-M01-06 | sound: clap_clap \| options Same, Different \| answer **Same** |
| Q-M01-07 | sound: clap_tap \| options Same, Different \| answer **Different** |
| Q-M01-08 | sound: bell_bell \| options Same, Different \| answer **Same** |
| Q-M01-09 | sound: clock_bell \| options Same, Different \| answer **Different** |
| Q-M01-10 | sound: tap_clap \| options Same, Different \| answer **Different** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M01-02-1 | sound: finger_finger \| options Same, Different \| answer **Same** |  |
| AS-M01-02-2 | sound: clap_finger \| options Same, Different \| answer **Different** |  |
| AS-M01-02-3 | sound: tap_tap \| options Same, Different \| answer **Same** |  |
| AS-M01-02-4 | sound: clock_tap \| options Same, Different \| answer **Different** |  |
| AS-M01-02-5 | sound: bell_finger \| options Same, Different \| answer **Different** |  |

#### Lesson 3: Loud and Soft (`L1-M01-03`)

- **Objective:** Distinguish loud and soft sounds.
- **Skill:** auditory_discrimination · **Activity:** sort · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today we are listening for loud and soft sounds.
- **Narration (teach):** A loud sound is strong and easy to hear. A soft sound is gentle and quiet.
- **Narration (model):** Listen to this sound. Was it loud or soft?
- **Narration (close):** Excellent! You listened for volume.

**Practice**

| ID | Item |
|---|---|
| Q-M01-11 | sound: thunder \| options Loud, Soft \| answer **Loud** |
| Q-M01-12 | sound: wind \| options Loud, Soft \| answer **Soft** |
| Q-M01-13 | sound: clap \| options Loud, Soft \| answer **Loud** |
| Q-M01-14 | sound: birds \| options Loud, Soft \| answer **Soft** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M01-03-1 | sound: drip \| options Loud, Soft \| answer **Soft** |  |
| AS-M01-03-2 | sound: thunder \| options Loud, Soft \| answer **Loud** | Identical audio+answer pair to practice item Q-M01-11. Only 2 reliable loud anchor sounds exist (thunder, clap), so the loud assessment items necessarily reuse them. Recommend a kid-appropriate real recording of another chart loud sound (e.g. a bang) to widen the pool. |
| AS-M01-03-3 | sound: bell \| options Loud, Soft \| answer **Soft** |  |
| AS-M01-03-4 | sound: clap \| options Loud, Soft \| answer **Loud** | Identical audio+answer pair to practice item Q-M01-13. Same thin loud-anchor pool as AS-M01-03-2. |

#### Lesson 4: Fast and Slow (`L1-M01-04`)

- **Objective:** Distinguish fast and slow sound patterns.
- **Skill:** auditory_discrimination · **Activity:** sort · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today we are listening for speed.
- **Narration (teach):** A fast pattern happens quickly. A slow pattern takes more time.
- **Narration (model):** Listen to the pattern. Fast or slow?
- **Narration (close):** You caught the speed!

**Practice**

| ID | Item |
|---|---|
| Q-M01-16 | sound: clap_fast \| options Fast, Slow \| answer **Fast** |
| Q-M01-17 | sound: clap_slow \| options Fast, Slow \| answer **Slow** |
| Q-M01-18 | sound: tap_fast \| options Fast, Slow \| answer **Fast** |
| Q-M01-19 | sound: tap_slow \| options Fast, Slow \| answer **Slow** |
| Q-M01-20 | sound: slow_compare \| options Pattern A, Pattern B \| answer **Pattern B** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M01-04-1 | sound: finger_fast \| options Fast, Slow \| answer **Fast** |  |
| AS-M01-04-2 | sound: finger_slow \| options Fast, Slow \| answer **Slow** |  |
| AS-M01-04-3 | sound: drum_fast \| options Fast, Slow \| answer **Fast** |  |
| AS-M01-04-4 | sound: drum_slow \| options Fast, Slow \| answer **Slow** |  |
| AS-M01-04-5 | sound: fast_compare \| options Pattern A, Pattern B \| answer **Pattern A** |  |

#### Lesson 5: Sound Memory (`L1-M01-05`)

- **Objective:** Remember and identify short sound sequences.
- **Skill:** auditory_memory · **Activity:** sound_memory · **Time:** 4–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today we are going to use our sound memory.
- **Narration (teach):** Listen to the whole pattern. Keep it in your mind. Then choose what you heard.
- **Narration (close):** Amazing memory!

**Practice**

| ID | Item |
|---|---|
| Q-M01-21 | sound: clap_tap \| options Clap-Tap, Tap-Clap \| answer **Clap-Tap** |
| Q-M01-22 | sound: tap_clap \| options Tap-Clap, Clap-Tap \| answer **Tap-Clap** |
| Q-M01-23 | sound: clap_tap_clap \| options Clap-Tap-Clap, Tap-Clap-Tap \| answer **Clap-Tap-Clap** |
| Q-M01-24 | sound: tap_tap_clap \| options Tap-Tap-Clap, Clap-Tap-Tap \| answer **Tap-Tap-Clap** |
| Q-M01-25 | sound: clap_tap_clap \| options Clap-Clap-Tap, Clap-Tap-Clap \| answer **Clap-Tap-Clap** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M01-05-1 | sound: finger_tap_seq \| options Finger-Tap, Tap-Finger \| answer **Finger-Tap** |  |
| AS-M01-05-2 | sound: tap_finger_seq \| options Tap-Finger, Finger-Tap \| answer **Tap-Finger** |  |
| AS-M01-05-3 | sound: clap_finger_clap \| options Clap-Finger-Clap, Finger-Clap-Finger \| answer **Clap-Finger-Clap** |  |
| AS-M01-05-4 | sound: finger_clap_tap \| options Finger-Clap-Tap, Tap-Clap-Finger \| answer **Finger-Clap-Tap** |  |
| AS-M01-05-5 | sound: tap_clap_tap \| options Tap-Clap-Tap, Clap-Tap-Clap \| answer **Tap-Clap-Tap** |  |

#### Lesson 6: Listening Detective Assessment (`L1-M01-06`)

- **Objective:** Demonstrate independent mastery of Module 1 listening skills.
- **Skill:** auditory_discrimination · **Activity:** assessment · **Time:** 6–8 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Listening Detective Challenge.
- **Narration (instruction):** Listen carefully. Take your time. Choose your answer when you are ready.
- **Narration (close):** Challenge complete! Your results are ready.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| A-M01-06-1 | sound: rain_rain \| options Same, Different \| answer **Same** |  |
| A-M01-06-2 | sound: drum_whisper \| options Same, Different \| answer **Different** |  |
| A-M01-06-3 | sound: phone_phone \| options Same, Different \| answer **Same** |  |
| A-M01-06-4 | sound: bell \| options Loud, Soft \| answer **Soft** |  |
| A-M01-06-5 | sound: clap \| options Loud, Soft \| answer **Loud** |  |
| A-M01-06-6 | sound: drum_compare \| options Whisper, Drum \| answer **Drum** |  |
| A-M01-06-7 | sound: finger_fast \| options Fast, Slow \| answer **Fast** |  |
| A-M01-06-8 | sound: drum_slow \| options Fast, Slow \| answer **Slow** |  |
| A-M01-06-9 | sound: finger_tap_seq \| options Finger-Tap, Tap-Finger \| answer **Finger-Tap** |  |
| A-M01-06-10 | sound: tap_clap_tap \| options Tap-Clap-Tap, Clap-Tap-Clap \| answer **Tap-Clap-Tap** |  |

### Module 2 — Rhyme Detective

*Goal:* Recognise and produce simple rhymes.

#### Lesson 1: Meet Rhyme (`L1-M02-01`)

- **Objective:** Recognise that rhyming words end with the same sound.
- **Skill:** rhyming · **Activity:** rhyme_match · **Time:** 3–4 min · **Mastery threshold:** 80%
- **Narration (welcome):** Hello, Rhyme Detective! Today we listen for words that sound alike at the end.
- **Narration (teach):** A rhyme is when two words end with the same sound, like cat and hat.
- **Narration (model):** Listen. Cat... hat. Do you hear how they end the same way?
- **Narration (transition):** Now you try! Listen, then choose the word that rhymes.
- **Narration (close):** Great listening! You found your first rhymes.

**Practice**

| ID | Item |
|---|---|
| Q-M02-01 | sound: cat \| options hat, dog, pen \| answer **hat** |
| Q-M02-02 | sound: hat \| options cat, log, fan \| answer **cat** |
| Q-M02-03 | sound: mat \| options bat, hen, can \| answer **bat** |
| Q-M02-04 | sound: bat \| options mat, pen, man \| answer **mat** |
| Q-M02-05 | sound: cat \| options mat, dog, cap \| answer **mat** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-01-1 | sound: hat \| options bat, dog, pen \| answer **bat** |  |
| AS-M02-01-2 | sound: mat \| options cat, hen, fan \| answer **cat** |  |
| AS-M02-01-3 | sound: bat \| options hat, log, can \| answer **hat** |  |
| AS-M02-01-4 | sound: cat \| options bat, pen, man \| answer **bat** |  |
| AS-M02-01-5 | sound: mat \| options hat, dog, cap \| answer **hat** |  |

#### Lesson 2: Find the Rhyme (`L1-M02-02`)

- **Objective:** Find the rhyme among a wider set of choices than before.
- **Skill:** rhyming · **Activity:** rhyme_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's find more rhymes today!
- **Narration (teach):** Listen carefully to the ending sound, then find its rhyming partner.
- **Narration (model):** Listen. Can... man. They rhyme!
- **Narration (transition):** Now you try! Find the rhyme.
- **Narration (close):** Wonderful! You found the rhymes.

**Practice**

| ID | Item |
|---|---|
| Q-M02-06 | sound: can \| options man, dog, hen, fig \| answer **man** |
| Q-M02-07 | sound: man \| options fan, log, pen, wig \| answer **fan** |
| Q-M02-08 | sound: fan \| options pan, cat, bat, net \| answer **pan** |
| Q-M02-09 | sound: pan \| options can, hat, mat, vet \| answer **can** |
| Q-M02-10 | sound: man \| options pan, cap, dog, jet \| answer **pan** |
| Q-M02-26 | sound: bag \| options tag, dog, pen, mop \| answer **tag** |
| Q-M02-27 | sound: tag \| options rag, hen, cap, top \| answer **rag** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-02-1 | sound: can \| options fan, dog, hen, vet \| answer **fan** |  |
| AS-M02-02-2 | sound: fan \| options can, log, pen, fig \| answer **can** |  |
| AS-M02-02-3 | sound: pan \| options fan, cat, bat, wig \| answer **fan** |  |
| AS-M02-02-4 | sound: man \| options can, hat, mat, net \| answer **can** |  |
| AS-M02-02-5 | sound: pan \| options man, cap, dog, jet \| answer **man** |  |
| AS-M02-02-6 | sound: rag \| options bag, dog, hen, mop \| answer **bag** |  |
| AS-M02-02-7 | sound: bag \| options rag, cat, pan, top \| answer **rag** |  |

#### Lesson 3: Odd One Out (`L1-M02-03`)

- **Objective:** Identify the word that does not rhyme with the others.
- **Skill:** rhyming · **Activity:** rhyme_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today one word will be a trickster — it won't rhyme!
- **Narration (teach):** Listen to three words. Two of them rhyme. One does not belong.
- **Narration (model):** Listen. Cat... hat... dog. Which one does not rhyme?
- **Narration (transition):** Now you try! Find the word that does not rhyme.
- **Narration (close):** You caught the odd one out every time!

**Practice**

| ID | Item |
|---|---|
| Q-M02-11 | sound: cat, hat, dog \| options cat, hat, dog \| answer **dog** |
| Q-M02-12 | sound: can, fan, mat \| options can, fan, mat \| answer **mat** |
| Q-M02-13 | sound: bat, pen, mat \| options bat, pen, mat \| answer **pen** |
| Q-M02-14 | sound: man, pan, cat \| options man, pan, cat \| answer **cat** |
| Q-M02-15 | sound: hen, hat, pen \| options hen, hat, pen \| answer **hat** |
| Q-M02-28 | sound: bag, tag, dog \| options bag, tag, dog \| answer **dog** |
| Q-M02-29 | sound: net, jet, cat \| options net, jet, cat \| answer **cat** |
| Q-M02-30 | sound: fig, wig, sun \| options fig, wig, sun \| answer **sun** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-03-1 | sound: dog, log, cat \| options dog, log, cat \| answer **cat** |  |
| AS-M02-03-2 | sound: fan, pan, dog \| options fan, pan, dog \| answer **dog** |  |
| AS-M02-03-3 | sound: cap, map, hen \| options cap, map, hen \| answer **hen** |  |
| AS-M02-03-4 | sound: bat, cat, pen \| options bat, cat, pen \| answer **pen** |  |
| AS-M02-03-5 | sound: nap, cap, log \| options nap, cap, log \| answer **log** |  |
| AS-M02-03-6 | sound: mop, pop, dog \| options mop, pop, dog \| answer **dog** |  |
| AS-M02-03-7 | sound: bag, rag, pen \| options bag, rag, pen \| answer **pen** |  |
| AS-M02-03-8 | sound: vet, jet, cat \| options vet, jet, cat \| answer **cat** |  |

#### Lesson 4: Finish My Rhyme (`L1-M02-04`)

- **Objective:** Complete a rhyming pair with the matching word.
- **Skill:** rhyming · **Activity:** rhyme_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's finish some rhymes together!
- **Narration (teach):** I'll say a word. You find the word that finishes the rhyme.
- **Narration (model):** Dog... and? Listen for the matching sound: log!
- **Narration (transition):** Now you try! Finish the rhyme.
- **Narration (close):** You finished every rhyme!

**Practice**

| ID | Item |
|---|---|
| Q-M02-16 | sound: dog \| options log, cat, pen \| answer **log** |
| Q-M02-17 | sound: log \| options dog, hat, fan \| answer **dog** |
| Q-M02-18 | sound: hen \| options pen, mat, can \| answer **pen** |
| Q-M02-19 | sound: pen \| options hen, bat, man \| answer **hen** |
| Q-M02-20 | sound: dog \| options log, hen, cap \| answer **log** |
| Q-M02-31 | sound: net \| options jet, cat, hen \| answer **jet** |
| Q-M02-32 | sound: jet \| options vet, dog, fan \| answer **vet** |
| Q-M02-33 | sound: fig \| options wig, cat, pen \| answer **wig** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-04-1 | sound: hat \| options bat, dog, pen \| answer **bat** |  |
| AS-M02-04-2 | sound: man \| options pan, log, cap \| answer **pan** |  |
| AS-M02-04-3 | sound: fan \| options can, hen, mat \| answer **can** |  |
| AS-M02-04-4 | sound: bat \| options cat, pen, dog \| answer **cat** |  |
| AS-M02-04-5 | sound: dog \| options log, hat, fan \| answer **log** | Only 2 words exist in this rhyme family (dog/log) within the current vocabulary, so this item necessarily reuses the same anchor-to-answer pair as practice item Q-M02-16 (a true novel pair isn't possible without a 3rd -og word). Distractors differ from practice. Recommend the curriculum team consider a 3rd -og word (e.g. "fog" or "jog") for genuine transfer here. |
| AS-M02-04-6 | sound: vet \| options net, cat, hen \| answer **net** |  |
| AS-M02-04-7 | sound: jet \| options net, dog, pan \| answer **net** |  |
| AS-M02-04-8 | sound: wig \| options fig, cat, pen \| answer **fig** |  |

#### Lesson 5: Make a Rhyme (`L1-M02-05`)

- **Objective:** Select every word that rhymes with a given word, not just one.
- **Skill:** rhyming · **Activity:** rhyme_select · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Today you get to make your own rhymes!
- **Narration (teach):** Think of a word that ends the same way, then choose it.
- **Narration (model):** Cap... what could rhyme with cap? Listen for map!
- **Narration (transition):** Now you try! Make a rhyme.
- **Narration (close):** You are a rhyming champion!

**Practice**

| ID | Item |
|---|---|
| Q-M02-21 | sound: cap \| options map, nap, dog, hen \| answer **undefined** |
| Q-M02-22 | sound: map \| options cap, nap, fan, pen \| answer **undefined** |
| Q-M02-23 | sound: nap \| options cap, map, log, vet \| answer **undefined** |
| Q-M02-24 | sound: cap \| options map, nap, bag, net \| answer **undefined** |
| Q-M02-25 | sound: map \| options cap, nap, fig, mop \| answer **undefined** |
| Q-M02-34 | sound: mop \| options pop, cat, hen \| answer **pop** |
| Q-M02-35 | sound: pop \| options top, dog, fan \| answer **top** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-05-1 | sound: cap \| options map, nap, jet, wig \| answer **undefined** | The -ap family only has 3 usable words (cap/map/nap), so every possible anchor has exactly one correct pair - this item's pair (map+nap for anchor cap) necessarily repeats practice item Q-M02-21/24's pair, just with different distractors. A 4th -ap word from the curriculum team would resolve it; the other 4 assessment items here use cumulative review from other families instead, which are genuinely novel. |
| AS-M02-05-2 | sound: cat \| options hat, bat, dog, pen \| answer **undefined** |  |
| AS-M02-05-3 | sound: can \| options man, fan, log, vet \| answer **undefined** |  |
| AS-M02-05-4 | sound: dog \| options log, hen, pen, fig \| answer **undefined** |  |
| AS-M02-05-5 | sound: hen \| options pen, dog, cat, map \| answer **undefined** |  |

#### Lesson 6: Rhyme Challenge (`L1-M02-06`)

- **Objective:** Demonstrate independent mastery of Module 2 rhyming skills.
- **Skill:** rhyming · **Activity:** assessment · **Time:** 8–10 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Rhyme Challenge.
- **Narration (instruction):** Listen carefully. Take your time. Choose your answer when you are ready.
- **Narration (close):** Challenge complete! Your results are ready.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M02-06-1 | sound: cat \| options hat, dog, pen \| answer **hat** |  |
| AS-M02-06-2 | sound: can \| options fan, log, cap \| answer **fan** |  |
| AS-M02-06-3 | sound: dog \| options log, cat, man \| answer **log** |  |
| AS-M02-06-4 | sound: hen \| options pen, bat, map \| answer **pen** |  |
| AS-M02-06-5 | sound: cap \| options map, hen, fan \| answer **map** |  |
| AS-M02-06-6 | sound: bat \| options mat, can, nap \| answer **mat** |  |
| AS-M02-06-7 | sound: pan \| options man, dog, hat \| answer **man** |  |
| AS-M02-06-8 | sound: nap \| options cap, pen, cat \| answer **cap** |  |
| AS-M02-06-9 | sound: hen, pen, dog \| options hen, pen, dog \| answer **dog** |  |
| AS-M02-06-10 | sound: cat, hat, fan \| options cat, hat, fan \| answer **fan** |  |
| AS-M02-06-11 | sound: bag \| options tag, dog, pen \| answer **tag** |  |
| AS-M02-06-12 | sound: net \| options jet, cat, fan \| answer **jet** |  |
| AS-M02-06-13 | sound: fig \| options wig, dog, pan \| answer **wig** |  |
| AS-M02-06-14 | sound: mop, pop, cat \| options mop, pop, cat \| answer **cat** |  |

### Module 3 — Letter Cluster 1: s a t p i n

*Goal:* Learn s, a, t, p, i, n and use them together to build, read, and spell real words.

#### Lesson 1: Meet the Letters (`L1-M03-01`)

- **Objective:** Learn the letters s, a, t, p, i, n and their sounds.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** letter_sound_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Hello, Letter Detective! Six new letters are waiting for you.
- **Narration (teach):** Listen to a word, then find the letter it starts with.
- **Narration (model):** Listen. Sun starts with the letter s.
- **Narration (transition):** Now you try! Listen to the word, then choose its letter.
- **Narration (close):** Great matching! You met every letter — s, a, t, p, i, n.

**Practice**

| ID | Item |
|---|---|
| Q-M03-01 | hear “sun” → letter \| options s n t \| answer **s** |
| Q-M03-02 | hear “at” → letter \| options a i n \| answer **a** |
| Q-M03-03 | hear “top” → letter \| options t p s \| answer **t** |
| Q-M03-04 | hear “pan” → letter \| options p t s \| answer **p** |
| Q-M03-05 | hear “in” → letter \| options i a n \| answer **i** |
| Q-M03-06 | hear “nap” → letter \| options n t p \| answer **n** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M03-01-1 | hear “sip” → letter \| options s t p \| answer **s** |  |
| AS-M03-01-2 | hear “ant” → letter \| options a n i \| answer **a** |  |
| AS-M03-01-3 | hear “tin” → letter \| options t s n \| answer **t** |  |
| AS-M03-01-4 | hear “pit” → letter \| options p s t \| answer **p** |  |
| AS-M03-01-5 | hear “it” → letter \| options i n a \| answer **i** |  |
| AS-M03-01-6 | hear “nip” → letter \| options n p t \| answer **n** |  |

#### Lesson 2: Blend & Build (`L1-M03-02`)

- **Objective:** Build real words using s, a, t, p, i, n.
- **Skill:** word_building · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Now let's put your letters to work!
- **Narration (teach):** Listen to the word, then tap each letter tile in order to build it.
- **Narration (model):** Listen. Sat. Tap s, then a, then t to build it!
- **Narration (transition):** Now you try! Listen, then build the word.
- **Narration (close):** Great building! You made real words with your new letters.

**Practice**

| ID | Item |
|---|---|
| Q-M03-07 | hear “sat” → build \| tray t s a \| answer **sat** |
| Q-M03-08 | hear “tap” → build \| tray p t a \| answer **tap** |
| Q-M03-09 | hear “sit” → build \| tray i t s \| answer **sit** |
| Q-M03-10 | hear “pin” → build \| tray n i p \| answer **pin** |
| Q-M03-11 | hear “nap” → build \| tray p a n \| answer **nap** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M03-02-1 | hear “pat” → build \| tray a p t \| answer **pat** |  |
| AS-M03-02-2 | hear “sap” → build \| tray p s a \| answer **sap** |  |
| AS-M03-02-3 | hear “tin” → build \| tray n t i \| answer **tin** |  |
| AS-M03-02-4 | hear “tan” → build \| tray a n t \| answer **tan** |  |
| AS-M03-02-5 | hear “pit” → build \| tray t i p \| answer **pit** |  |

#### Lesson 3: Read the Words (`L1-M03-03`)

- **Objective:** Read words built from s, a, t, p, i, n and match them to pictures.
- **Skill:** decoding · **Activity:** read_word · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's read the words you can already build!
- **Narration (teach):** Look at the written word, then find the matching picture.
- **Narration (model):** Read. Sit. Find the picture that matches!
- **Narration (transition):** Now you try! Read the word, then choose its picture.
- **Narration (close):** You read every word!

**Practice**

| ID | Item |
|---|---|
| Q-M03-12 | read “sit” → picture \| options sit, cat, dog \| answer **sit** |
| Q-M03-13 | read “tap” → picture \| options tap, hen, log \| answer **tap** |
| Q-M03-14 | read “nap” → picture \| options nap, bus, fig \| answer **nap** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M03-03-1 | read “pan” → picture \| options pan, hen, mop \| answer **pan** |  |
| AS-M03-03-2 | read “sip” → picture \| options sip, cap, rag \| answer **sip** |  |
| AS-M03-03-3 | read “pin” → picture \| options pin, dog, top \| answer **pin** |  |

#### Lesson 4: Spell the Words (`L1-M03-04`)

- **Objective:** Spell dictated words using s, a, t, p, i, n, choosing the right letters from a mixed tray.
- **Skill:** spelling · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Now let's spell some words — you pick the letters yourself!
- **Narration (teach):** Listen to the word. The tray has an extra letter that doesn't belong — leave it out!
- **Narration (model):** Listen. Tan. Pick t, a, n — and leave the extra letter behind!
- **Narration (transition):** Now you try! Listen, then spell the word.
- **Narration (close):** Great spelling! You picked every right letter.

**Practice**

| ID | Item |
|---|---|
| Q-M03-15 | hear “tan” → spell (1 extra tile) \| tray t a n p \| answer **tan** |
| Q-M03-16 | hear “nip” → spell (1 extra tile) \| tray n i p t \| answer **nip** |
| Q-M03-17 | hear “pit” → spell (1 extra tile) \| tray p i t s \| answer **pit** |
| Q-M03-18 | hear “tin” → spell (1 extra tile) \| tray t i n a \| answer **tin** |
| Q-M03-19 | hear “sap” → spell (1 extra tile) \| tray s a p n \| answer **sap** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M03-04-1 | hear “sit” → spell (1 extra tile) \| tray s i t n \| answer **sit** |  |
| AS-M03-04-2 | hear “sat” → spell (1 extra tile) \| tray s a t p \| answer **sat** |  |
| AS-M03-04-3 | hear “tap” → spell (1 extra tile) \| tray t a p i \| answer **tap** |  |
| AS-M03-04-4 | hear “nap” → spell (1 extra tile) \| tray n a p t s \| answer **nap** |  |
| AS-M03-04-5 | hear “pin” → spell (1 extra tile) \| tray p i n t a \| answer **pin** |  |

#### Lesson 5: Cluster Challenge (`L1-M03-05`)

- **Objective:** Demonstrate independent mastery of Letter Cluster 1: letter sounds, building, reading, and spelling.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** assessment · **Time:** 8–10 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Cluster Challenge.
- **Narration (instruction):** Letters, building, reading, spelling — any of it could show up. Take your time.
- **Narration (close):** Challenge complete! You know s, a, t, p, i, n.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M03-05-1 | hear “sap” → letter \| options s n p \| answer **s** |  |
| AS-M03-05-2 | hear “tin” → letter \| options t p n \| answer **t** |  |
| AS-M03-05-3 | hear “tan” → build \| tray t a n \| answer **tan** |  |
| AS-M03-05-4 | hear “pit” → build \| tray p i t \| answer **pit** |  |
| AS-M03-05-5 | read “sip” → picture \| options sip, cat, dog \| answer **sip** |  |
| AS-M03-05-6 | read “pan” → picture \| options pan, hat, mat \| answer **pan** |  |
| AS-M03-05-7 | hear “nip” → spell (1 extra tile) \| tray n i p t \| answer **nip** |  |
| AS-M03-05-8 | hear “sat” → spell (1 extra tile) \| tray s a t n \| answer **sat** |  |

**Words used in this module:** ant, at, in, it, nap, nip, pan, pat, pin, pit, sap, sat, sip, sit, sun, tan, tap, tin, top

### Module 4 — Letter Cluster 2: m d g o c

*Goal:* Learn m, d, g, o, c and use every letter known so far to build, read, and spell more words.

#### Lesson 1: Meet the Letters (`L1-M04-01`)

- **Objective:** Learn the letters m, d, g, o, c and their sounds.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** letter_sound_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Hello again, Letter Detective! Five more letters are waiting for you.
- **Narration (teach):** Listen to a word, then find the letter it starts with.
- **Narration (model):** Listen. Man starts with the letter m.
- **Narration (transition):** Now you try! Listen to the word, then choose its letter.
- **Narration (close):** Great matching! You met every letter — m, d, g, o, c.

**Practice**

| ID | Item |
|---|---|
| Q-M04-01 | hear “man” → letter \| options m d c \| answer **m** |
| Q-M04-02 | hear “dad” → letter \| options d g m \| answer **d** |
| Q-M04-03 | hear “gap” → letter \| options g c d \| answer **g** |
| Q-M04-04 | hear “on” → letter \| options o a i \| answer **o** |
| Q-M04-05 | hear “cat” → letter \| options c m g \| answer **c** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M04-01-1 | hear “mat” → letter \| options m d g \| answer **m** |  |
| AS-M04-01-2 | hear “dog” → letter \| options d g c \| answer **d** |  |
| AS-M04-01-3 | hear “gas” → letter \| options g c m \| answer **g** |  |
| AS-M04-01-4 | hear “ox” → letter \| options o a i \| answer **o** |  |
| AS-M04-01-5 | hear “cap” → letter \| options c g m \| answer **c** |  |

#### Lesson 2: Blend & Build (`L1-M04-02`)

- **Objective:** Build real words using every letter learned so far.
- **Skill:** word_building · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's put all your letters to work!
- **Narration (teach):** Listen to the word, then tap each letter tile in order to build it.
- **Narration (model):** Listen. Dog. Tap d, then o, then g to build it!
- **Narration (transition):** Now you try! Listen, then build the word.
- **Narration (close):** Great building! Look how many words you can make now.

**Practice**

| ID | Item |
|---|---|
| Q-M04-06 | hear “dog” → build \| tray o d g \| answer **dog** |
| Q-M04-07 | hear “cat” → build \| tray t c a \| answer **cat** |
| Q-M04-08 | hear “man” → build \| tray n m a \| answer **man** |
| Q-M04-09 | hear “pig” → build \| tray g i p \| answer **pig** |
| Q-M04-10 | hear “mop” → build \| tray p m o \| answer **mop** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M04-02-1 | hear “can” → build \| tray n a c \| answer **can** |  |
| AS-M04-02-2 | hear “tag” → build \| tray g a t \| answer **tag** |  |
| AS-M04-02-3 | hear “cog” → build \| tray g o c \| answer **cog** |  |
| AS-M04-02-4 | hear “dim” → build \| tray m i d \| answer **dim** |  |
| AS-M04-02-5 | hear “gap” → build \| tray p a g \| answer **gap** |  |

#### Lesson 3: Read the Words (`L1-M04-03`)

- **Objective:** Read words built from every letter learned so far and match them to pictures.
- **Skill:** decoding · **Activity:** read_word · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's read even more words!
- **Narration (teach):** Look at the written word, then find the matching picture.
- **Narration (model):** Read. Dog. Find the picture that matches!
- **Narration (transition):** Now you try! Read the word, then choose its picture.
- **Narration (close):** You read every word!

**Practice**

| ID | Item |
|---|---|
| Q-M04-11 | read “cat” → picture \| options cat, hen, log \| answer **cat** |
| Q-M04-12 | read “mat” → picture \| options mat, bus, fig \| answer **mat** |
| Q-M04-13 | read “can” → picture \| options can, wig, pop \| answer **can** |
| Q-M04-14 | read “man” → picture \| options man, net, jet \| answer **man** |
| Q-M04-15 | read “dog” → picture \| options dog, vet, rag \| answer **dog** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M04-03-1 | read “cap” → picture \| options cap, hen, log \| answer **cap** |  |
| AS-M04-03-2 | read “map” → picture \| options map, bus, fig \| answer **map** |  |
| AS-M04-03-3 | read “mop” → picture \| options mop, wig, pop \| answer **mop** |  |
| AS-M04-03-4 | read “top” → picture \| options top, net, jet \| answer **top** |  |
| AS-M04-03-5 | read “pig” → picture \| options pig, vet, rag \| answer **pig** |  |

#### Lesson 4: Spell the Words (`L1-M04-04`)

- **Objective:** Spell dictated words using every letter learned so far, choosing the right letters from a mixed tray.
- **Skill:** spelling · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Time to spell some trickier words!
- **Narration (teach):** Listen to the word. The tray has an extra letter that doesn't belong — leave it out!
- **Narration (model):** Listen. Cap. Pick c, a, p — and leave the extra letter behind!
- **Narration (transition):** Now you try! Listen, then spell the word.
- **Narration (close):** Great spelling! You picked every right letter.

**Practice**

| ID | Item |
|---|---|
| Q-M04-16 | hear “cap” → spell (1 extra tile) \| tray c a p d \| answer **cap** |
| Q-M04-17 | hear “tan” → spell (1 extra tile) \| tray t a n g \| answer **tan** |
| Q-M04-18 | hear “cot” → spell (1 extra tile) \| tray c o t p \| answer **cot** |
| Q-M04-19 | hear “mad” → spell (1 extra tile) \| tray m a d g \| answer **mad** |
| Q-M04-20 | hear “nod” → spell (1 extra tile) \| tray n o d s \| answer **nod** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M04-04-1 | hear “tag” → spell (1 extra tile) \| tray t a g c \| answer **tag** |  |
| AS-M04-04-2 | hear “dip” → spell (1 extra tile) \| tray d i p o \| answer **dip** |  |
| AS-M04-04-3 | hear “cog” → spell (1 extra tile) \| tray c o g t \| answer **cog** |  |
| AS-M04-04-4 | hear “man” → spell (1 extra tile) \| tray m a n d \| answer **man** |  |
| AS-M04-04-5 | hear “din” → spell (1 extra tile) \| tray d i n g \| answer **din** |  |

#### Lesson 5: Cluster Challenge (`L1-M04-05`)

- **Objective:** Demonstrate independent mastery of Letter Cluster 2: letter sounds, building, reading, and spelling.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** assessment · **Time:** 8–10 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Cluster Challenge.
- **Narration (instruction):** Letters, building, reading, spelling — any of it could show up. Take your time.
- **Narration (close):** Challenge complete! You know s, a, t, p, i, n, m, d, g, o, c.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M04-05-1 | hear “mop” → letter \| options m c d \| answer **m** |  |
| AS-M04-05-2 | hear “on” → letter \| options o a i \| answer **o** |  |
| AS-M04-05-3 | hear “pig” → build \| tray p i g \| answer **pig** |  |
| AS-M04-05-4 | hear “cot” → build \| tray c o t \| answer **cot** |  |
| AS-M04-05-5 | read “map” → picture \| options map, hat, wig \| answer **map** |  |
| AS-M04-05-6 | read “top” → picture \| options top, pen, fig \| answer **top** |  |
| AS-M04-05-7 | hear “tag” → spell (1 extra tile) \| tray t a g p \| answer **tag** |  |
| AS-M04-05-8 | hear “dip” → spell (1 extra tile) \| tray d i p g \| answer **dip** |  |

**Words used in this module:** can, cap, cat, cog, cot, dad, dim, din, dip, dog, gap, gas, mad, man, map, mat, mop, nod, on, ox, pig, tag, tan, top

### Module 5 — Letter Cluster 3: k b h r e

*Goal:* Learn k, b, h, r, e and use every letter known so far to build, read, and spell more words.

#### Lesson 1: Meet the Letters (`L1-M05-01`)

- **Objective:** Learn the letters k, b, h, r, e and their sounds.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** letter_sound_match · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Hello again, Letter Detective! Five brand new letters are waiting for you.
- **Narration (teach):** Listen to a word, then find the letter it starts with.
- **Narration (model):** Listen. Kid starts with the letter k.
- **Narration (transition):** Now you try! Listen to the word, then choose its letter.
- **Narration (close):** Great matching! You met every letter — k, b, h, r, e.

**Practice**

| ID | Item |
|---|---|
| Q-M05-01 | hear “kid” → letter \| options k b h \| answer **k** |
| Q-M05-02 | hear “bat” → letter \| options b h r \| answer **b** |
| Q-M05-03 | hear “hen” → letter \| options h k r \| answer **h** |
| Q-M05-04 | hear “egg” → letter \| options e a i \| answer **e** |
| Q-M05-05 | hear “rag” → letter \| options r b h \| answer **r** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M05-01-1 | hear “keg” → letter \| options k r b \| answer **k** |  |
| AS-M05-01-2 | hear “bag” → letter \| options b r h \| answer **b** |  |
| AS-M05-01-3 | hear “hat” → letter \| options h b k \| answer **h** |  |
| AS-M05-01-4 | hear “end” → letter \| options e o a \| answer **e** |  |
| AS-M05-01-5 | hear “rat” → letter \| options r h k \| answer **r** |  |

#### Lesson 2: Blend & Build (`L1-M05-02`)

- **Objective:** Build real words using every letter learned so far.
- **Skill:** word_building · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's put all your letters to work!
- **Narration (teach):** Listen to the word, then tap each letter tile in order to build it.
- **Narration (model):** Listen. Hen. Tap h, then e, then n to build it!
- **Narration (transition):** Now you try! Listen, then build the word.
- **Narration (close):** Great building! Look how many words you can make now.

**Practice**

| ID | Item |
|---|---|
| Q-M05-06 | hear “hen” → build \| tray n h e \| answer **hen** |
| Q-M05-07 | hear “bat” → build \| tray t b a \| answer **bat** |
| Q-M05-08 | hear “red” → build \| tray d r e \| answer **red** |
| Q-M05-09 | hear “kid” → build \| tray d k i \| answer **kid** |
| Q-M05-10 | hear “bed” → build \| tray d b e \| answer **bed** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M05-02-1 | hear “pen” → build \| tray n e p \| answer **pen** |  |
| AS-M05-02-2 | hear “hat” → build \| tray t h a \| answer **hat** |  |
| AS-M05-02-3 | hear “rib” → build \| tray b r i \| answer **rib** |  |
| AS-M05-02-4 | hear “keg” → build \| tray g k e \| answer **keg** |  |
| AS-M05-02-5 | hear “ram” → build \| tray m a r \| answer **ram** |  |

#### Lesson 3: Read the Words (`L1-M05-03`)

- **Objective:** Read words built from every letter learned so far and match them to pictures.
- **Skill:** decoding · **Activity:** read_word · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's read even more words!
- **Narration (teach):** Look at the written word, then find the matching picture.
- **Narration (model):** Read. Hen. Find the picture that matches!
- **Narration (transition):** Now you try! Read the word, then choose its picture.
- **Narration (close):** You read every word!

**Practice**

| ID | Item |
|---|---|
| Q-M05-11 | read “hen” → picture \| options hen, log, bus \| answer **hen** |
| Q-M05-12 | read “bat” → picture \| options bat, wig, cup \| answer **bat** |
| Q-M05-13 | read “kid” → picture \| options kid, fan, jet \| answer **kid** |
| Q-M05-14 | read “bed” → picture \| options bed, log, bus \| answer **bed** |
| Q-M05-15 | read “rat” → picture \| options rat, fig, top \| answer **rat** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M05-03-1 | read “hat” → picture \| options hat, mop, lip \| answer **hat** |  |
| AS-M05-03-2 | read “bag” → picture \| options bag, pop, gum \| answer **bag** |  |
| AS-M05-03-3 | read “bin” → picture \| options bin, run, sad \| answer **bin** |  |
| AS-M05-03-4 | read “cab” → picture \| options cab, dad, tub \| answer **cab** |  |
| AS-M05-03-5 | read “pig” → picture \| options pig, vet, sit \| answer **pig** |  |

#### Lesson 4: Spell the Words (`L1-M05-04`)

- **Objective:** Spell dictated words using every letter learned so far, choosing the right letters from a mixed tray.
- **Skill:** spelling · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Time to spell some trickier words!
- **Narration (teach):** Listen to the word. The tray has an extra letter that doesn't belong — leave it out!
- **Narration (model):** Listen. Bed. Pick b, e, d — and leave the extra letter behind!
- **Narration (transition):** Now you try! Listen, then spell the word.
- **Narration (close):** Great spelling! You picked every right letter.

**Practice**

| ID | Item |
|---|---|
| Q-M05-16 | hear “bed” → spell (1 extra tile) \| tray b e d s \| answer **bed** |
| Q-M05-17 | hear “hat” → spell (1 extra tile) \| tray h a t p \| answer **hat** |
| Q-M05-18 | hear “pen” → spell (1 extra tile) \| tray p e n k \| answer **pen** |
| Q-M05-19 | hear “rag” → spell (1 extra tile) \| tray r a g m \| answer **rag** |
| Q-M05-20 | hear “keg” → spell (1 extra tile) \| tray k e g o \| answer **keg** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M05-04-1 | hear “net” → spell (1 extra tile) \| tray n e t c \| answer **net** |  |
| AS-M05-04-2 | hear “hip” → spell (1 extra tile) \| tray h i p r \| answer **hip** |  |
| AS-M05-04-3 | hear “rib” → spell (1 extra tile) \| tray r i b e \| answer **rib** |  |
| AS-M05-04-4 | hear “hog” → spell (1 extra tile) \| tray h o g k \| answer **hog** |  |
| AS-M05-04-5 | hear “beg” → spell (1 extra tile) \| tray b e g a \| answer **beg** |  |

#### Lesson 5: Cluster Challenge (`L1-M05-05`)

- **Objective:** Demonstrate independent mastery of Letter Cluster 3: letter sounds, building, reading, and spelling.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** assessment · **Time:** 8–10 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Cluster Challenge.
- **Narration (instruction):** Letters, building, reading, spelling — any of it could show up. Take your time.
- **Narration (close):** Challenge complete! You know s, a, t, p, i, n, m, d, g, o, c, k, b, h, r, e.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M05-05-1 | hear “kit” → letter \| options k b h \| answer **k** |  |
| AS-M05-05-2 | hear “egg” → letter \| options e i o \| answer **e** |  |
| AS-M05-05-3 | hear “bed” → build \| tray d b e \| answer **bed** |  |
| AS-M05-05-4 | hear “rat” → build \| tray t r a \| answer **rat** |  |
| AS-M05-05-5 | read “kid” → picture \| options kid, mop, sun \| answer **kid** |  |
| AS-M05-05-6 | read “map” → picture \| options map, fig, net \| answer **map** |  |
| AS-M05-05-7 | hear “hen” → spell (1 extra tile) \| tray h e n b \| answer **hen** |  |
| AS-M05-05-8 | hear “rag” → spell (1 extra tile) \| tray r a g h \| answer **rag** |  |

**Words used in this module:** bag, bat, bed, beg, bin, cab, egg, end, hat, hen, hip, hog, keg, kid, kit, map, net, pen, pig, rag, ram, rat, red, rib

### Module 6 — Letter Cluster 4: l f u

*Goal:* Learn l, f, u — the last Level 1 letters — and use the full letter set to build, read, and spell words.

#### Lesson 1: Meet the Letters (`L1-M06-01`)

- **Objective:** Learn the letters l, f, u and their sounds.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** letter_sound_match · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Hello again, Letter Detective! Three last letters are waiting for you.
- **Narration (teach):** Listen to a word, then find the letter it starts with.
- **Narration (model):** Listen. Lip starts with the letter l.
- **Narration (transition):** Now you try! Listen to the word, then choose its letter.
- **Narration (close):** Great matching! You met every letter — l, f, u.

**Practice**

| ID | Item |
|---|---|
| Q-M06-01 | hear “lip” → letter \| options l b r \| answer **l** |
| Q-M06-02 | hear “fan” → letter \| options f h k \| answer **f** |
| Q-M06-03 | hear “up” → letter \| options u o e \| answer **u** |
| Q-M06-04 | hear “log” → letter \| options l k b \| answer **l** |
| Q-M06-05 | hear “fun” → letter \| options f r h \| answer **f** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M06-01-1 | hear “leg” → letter \| options l k r \| answer **l** |  |
| AS-M06-01-2 | hear “fig” → letter \| options f h b \| answer **f** |  |
| AS-M06-01-3 | hear “us” → letter \| options u a i \| answer **u** |  |
| AS-M06-01-4 | hear “lap” → letter \| options l d g \| answer **l** |  |
| AS-M06-01-5 | hear “fin” → letter \| options f t p \| answer **f** |  |

#### Lesson 2: Blend & Build (`L1-M06-02`)

- **Objective:** Build real words using every letter learned so far.
- **Skill:** word_building · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's put all your letters to work!
- **Narration (teach):** Listen to the word, then tap each letter tile in order to build it.
- **Narration (model):** Listen. Fun. Tap f, then u, then n to build it!
- **Narration (transition):** Now you try! Listen, then build the word.
- **Narration (close):** Great building! You now know every Level 1 letter.

**Practice**

| ID | Item |
|---|---|
| Q-M06-06 | hear “fun” → build \| tray n f u \| answer **fun** |
| Q-M06-07 | hear “lip” → build \| tray p l i \| answer **lip** |
| Q-M06-08 | hear “log” → build \| tray g l o \| answer **log** |
| Q-M06-09 | hear “mug” → build \| tray g m u \| answer **mug** |
| Q-M06-10 | hear “cup” → build \| tray p c u \| answer **cup** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M06-02-1 | hear “fan” → build \| tray n a f \| answer **fan** |  |
| AS-M06-02-2 | hear “leg” → build \| tray g l e \| answer **leg** |  |
| AS-M06-02-3 | hear “hug” → build \| tray g h u \| answer **hug** |  |
| AS-M06-02-4 | hear “fit” → build \| tray t f i \| answer **fit** |  |
| AS-M06-02-5 | hear “bug” → build \| tray g b u \| answer **bug** |  |

#### Lesson 3: Read the Words (`L1-M06-03`)

- **Objective:** Read words built from every letter learned so far and match them to pictures.
- **Skill:** decoding · **Activity:** read_word · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's read even more words!
- **Narration (teach):** Look at the written word, then find the matching picture.
- **Narration (model):** Read. Cup. Find the picture that matches!
- **Narration (transition):** Now you try! Read the word, then choose its picture.
- **Narration (close):** You read every word!

**Practice**

| ID | Item |
|---|---|
| Q-M06-11 | read “fan” → picture \| options fan, pen, wig \| answer **fan** |
| Q-M06-12 | read “log” → picture \| options log, hat, bus \| answer **log** |
| Q-M06-13 | read “cup” → picture \| options cup, net, rag \| answer **cup** |
| Q-M06-14 | read “nut” → picture \| options nut, kid, pop \| answer **nut** |
| Q-M06-15 | read “lip” → picture \| options lip, bag, cat \| answer **lip** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M06-03-1 | read “fig” → picture \| options fig, hen, hut \| answer **fig** |  |
| AS-M06-03-2 | read “bug” → picture \| options bug, bat, dad \| answer **bug** |  |
| AS-M06-03-3 | read “tub” → picture \| options tub, pan, sit \| answer **tub** |  |
| AS-M06-03-4 | read “fog” → picture \| options fog, map, vet \| answer **fog** |  |
| AS-M06-03-5 | read “hut” → picture \| options hut, cap, jet \| answer **hut** |  |

#### Lesson 4: Spell the Words (`L1-M06-04`)

- **Objective:** Spell dictated words using every letter learned so far, choosing the right letters from a mixed tray.
- **Skill:** spelling · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Time to spell some trickier words!
- **Narration (teach):** Listen to the word. The tray has an extra letter that doesn't belong — leave it out!
- **Narration (model):** Listen. Lip. Pick l, i, p — and leave the extra letter behind!
- **Narration (transition):** Now you try! Listen, then spell the word.
- **Narration (close):** Great spelling! You picked every right letter.

**Practice**

| ID | Item |
|---|---|
| Q-M06-16 | hear “fun” → spell (1 extra tile) \| tray f u n t \| answer **fun** |
| Q-M06-17 | hear “lip” → spell (1 extra tile) \| tray l i p s \| answer **lip** |
| Q-M06-18 | hear “leg” → spell (1 extra tile) \| tray l e g m \| answer **leg** |
| Q-M06-19 | hear “cup” → spell (1 extra tile) \| tray c u p d \| answer **cup** |
| Q-M06-20 | hear “bud” → spell (1 extra tile) \| tray b u d l \| answer **bud** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M06-04-1 | hear “log” → spell (1 extra tile) \| tray l o g b \| answer **log** |  |
| AS-M06-04-2 | hear “hug” → spell (1 extra tile) \| tray h u g f \| answer **hug** |  |
| AS-M06-04-3 | hear “fan” → spell (1 extra tile) \| tray f a n r \| answer **fan** |  |
| AS-M06-04-4 | hear “cut” → spell (1 extra tile) \| tray c u t l \| answer **cut** |  |
| AS-M06-04-5 | hear “fit” → spell (1 extra tile) \| tray f i t n \| answer **fit** |  |

#### Lesson 5: Cluster Challenge (`L1-M06-05`)

- **Objective:** Demonstrate independent mastery of Letter Cluster 4: letter sounds, building, reading, and spelling.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** assessment · **Time:** 8–10 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the Cluster Challenge.
- **Narration (instruction):** Letters, building, reading, spelling — any of it could show up. Take your time.
- **Narration (close):** Challenge complete! You now know all 19 Level 1 letters.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M06-05-1 | hear “lid” → letter \| options l b d \| answer **l** |  |
| AS-M06-05-2 | hear “up” → letter \| options u o e \| answer **u** |  |
| AS-M06-05-3 | hear “fun” → build \| tray u n f \| answer **fun** |  |
| AS-M06-05-4 | hear “rug” → build \| tray g r u \| answer **rug** |  |
| AS-M06-05-5 | read “log” → picture \| options log, net, fig \| answer **log** |  |
| AS-M06-05-6 | read “cup” → picture \| options cup, hen, bus \| answer **cup** |  |
| AS-M06-05-7 | hear “mud” → spell (1 extra tile) \| tray m u d f \| answer **mud** |  |
| AS-M06-05-8 | hear “leg” → spell (1 extra tile) \| tray l e g u \| answer **leg** |  |

**Words used in this module:** bud, bug, cup, cut, fan, fig, fin, fit, fog, fun, hug, hut, lap, leg, lid, lip, log, mud, mug, nut, rug, tub, up, us

### Module 7 — Level 1 Review

*Goal:* Cumulative mixed practice and challenge across every Level 1 letter and word learned.

#### Lesson 1: Letter Sounds Review (`L1-M07-01`)

- **Objective:** Match words to their first letter across every Level 1 letter.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** letter_sound_match · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Welcome to the Level 1 Review, Letter Detective!
- **Narration (teach):** Listen to a word, then find the letter it starts with.
- **Narration (model):** Listen. Sun starts with the letter s.
- **Narration (transition):** Now you try! Listen to the word, then choose its letter.
- **Narration (close):** Great matching! You know your letters.

**Practice**

| ID | Item |
|---|---|
| Q-M07-01 | hear “sun” → letter \| options s n m \| answer **s** |
| Q-M07-02 | hear “dog” → letter \| options d b g \| answer **d** |
| Q-M07-03 | hear “kid” → letter \| options k h r \| answer **k** |
| Q-M07-04 | hear “fun” → letter \| options f l t \| answer **f** |
| Q-M07-05 | hear “egg” → letter \| options e a i \| answer **e** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M07-01-1 | hear “pan” → letter \| options p b d \| answer **p** |  |
| AS-M07-01-2 | hear “cat” → letter \| options c g s \| answer **c** |  |
| AS-M07-01-3 | hear “bug” → letter \| options b d h \| answer **b** |  |
| AS-M07-01-4 | hear “lip” → letter \| options l h r \| answer **l** |  |
| AS-M07-01-5 | hear “ox” → letter \| options o a u \| answer **o** |  |

#### Lesson 2: Build It (`L1-M07-02`)

- **Objective:** Build words from across every Level 1 cluster.
- **Skill:** word_building · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Time to build words from every cluster!
- **Narration (teach):** Listen to the word, then tap each letter tile in order to build it.
- **Narration (model):** Listen. Sit. Tap s, then i, then t to build it!
- **Narration (transition):** Now you try! Listen, then build the word.
- **Narration (close):** Great building! You can make words from any letters you know.

**Practice**

| ID | Item |
|---|---|
| Q-M07-06 | hear “sit” → build \| tray t s i \| answer **sit** |
| Q-M07-07 | hear “hen” → build \| tray n h e \| answer **hen** |
| Q-M07-08 | hear “dog” → build \| tray g d o \| answer **dog** |
| Q-M07-09 | hear “cup” → build \| tray p c u \| answer **cup** |
| Q-M07-10 | hear “kid” → build \| tray d k i \| answer **kid** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M07-02-1 | hear “map” → build \| tray p m a \| answer **map** |  |
| AS-M07-02-2 | hear “bed” → build \| tray d b e \| answer **bed** |  |
| AS-M07-02-3 | hear “fun” → build \| tray n f u \| answer **fun** |  |
| AS-M07-02-4 | hear “pig” → build \| tray g p i \| answer **pig** |  |
| AS-M07-02-5 | hear “bus” → build \| tray s b u \| answer **bus** |  |

#### Lesson 3: Read It (`L1-M07-03`)

- **Objective:** Read words from across every Level 1 cluster and match them to pictures.
- **Skill:** decoding · **Activity:** read_word · **Time:** 4–5 min · **Mastery threshold:** 80%
- **Narration (welcome):** Let's read words from everywhere!
- **Narration (teach):** Look at the written word, then find the matching picture.
- **Narration (model):** Read. Sun. Find the picture that matches!
- **Narration (transition):** Now you try! Read the word, then choose its picture.
- **Narration (close):** You read every word!

**Practice**

| ID | Item |
|---|---|
| Q-M07-11 | read “sun” → picture \| options sun, hen, fig \| answer **sun** |
| Q-M07-12 | read “pig” → picture \| options pig, bus, rag \| answer **pig** |
| Q-M07-13 | read “kid” → picture \| options kid, cat, pan \| answer **kid** |
| Q-M07-14 | read “bug” → picture \| options bug, dog, net \| answer **bug** |
| Q-M07-15 | read “nap” → picture \| options nap, bag, lip \| answer **nap** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M07-03-1 | read “pin” → picture \| options pin, cap, gum \| answer **pin** |  |
| AS-M07-03-2 | read “leg” → picture \| options leg, run, hat \| answer **leg** |  |
| AS-M07-03-3 | read “bed” → picture \| options bed, top, sit \| answer **bed** |  |
| AS-M07-03-4 | read “hut” → picture \| options hut, wig, mat \| answer **hut** |  |
| AS-M07-03-5 | read “bin” → picture \| options bin, pen, tag \| answer **bin** |  |

#### Lesson 4: Spell It (`L1-M07-04`)

- **Objective:** Spell dictated words from across every Level 1 cluster.
- **Skill:** spelling · **Activity:** word_build · **Time:** 5–6 min · **Mastery threshold:** 80%
- **Narration (welcome):** Time to spell words from every cluster!
- **Narration (teach):** Listen to the word. The tray has an extra letter that doesn't belong — leave it out!
- **Narration (model):** Listen. Pig. Pick p, i, g — and leave the extra letter behind!
- **Narration (transition):** Now you try! Listen, then spell the word.
- **Narration (close):** Great spelling! You picked every right letter.

**Practice**

| ID | Item |
|---|---|
| Q-M07-16 | hear “pig” → spell (1 extra tile) \| tray p i g d \| answer **pig** |
| Q-M07-17 | hear “rat” → spell (1 extra tile) \| tray r a t n \| answer **rat** |
| Q-M07-18 | hear “mud” → spell (1 extra tile) \| tray m u d l \| answer **mud** |
| Q-M07-19 | hear “bed” → spell (1 extra tile) \| tray b e d h \| answer **bed** |
| Q-M07-20 | hear “cot” → spell (1 extra tile) \| tray c o t m \| answer **cot** |

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M07-04-1 | hear “hen” → spell (1 extra tile) \| tray h e n f \| answer **hen** |  |
| AS-M07-04-2 | hear “sip” → spell (1 extra tile) \| tray s i p l \| answer **sip** |  |
| AS-M07-04-3 | hear “tag” → spell (1 extra tile) \| tray t a g b \| answer **tag** |  |
| AS-M07-04-4 | hear “hug” → spell (1 extra tile) \| tray h u g r \| answer **hug** |  |
| AS-M07-04-5 | hear “dot” → spell (1 extra tile) \| tray d o t e \| answer **dot** |  |

#### Lesson 5: Level 1 Challenge (`L1-M07-05`)

- **Objective:** Demonstrate independent mastery of Level 1: letter sounds, building, reading, and spelling.
- **Skill:** grapheme_phoneme_correspondence · **Activity:** assessment · **Time:** 10–12 min · **Mastery threshold:** 80%
- **Narration (welcome):** You are ready for the big Level 1 Challenge.
- **Narration (instruction):** Letters, building, reading, spelling — anything you have learned could show up. Take your time.
- **Narration (close):** Level 1 complete! You are a real Sound Explorer.

**Assessment**

| ID | Item | Review flag |
|---|---|---|
| AS-M07-05-1 | hear “leg” → letter \| options l b r \| answer **l** |  |
| AS-M07-05-2 | hear “kit” → letter \| options k h f \| answer **k** |  |
| AS-M07-05-3 | hear “ham” → letter \| options h m n \| answer **h** |  |
| AS-M07-05-4 | hear “hat” → build \| tray t h a \| answer **hat** |  |
| AS-M07-05-5 | hear “mug” → build \| tray g m u \| answer **mug** |  |
| AS-M07-05-6 | read “hen” → picture \| options hen, cup, map \| answer **hen** |  |
| AS-M07-05-7 | read “nut” → picture \| options nut, bag, lip \| answer **nut** |  |
| AS-M07-05-8 | read “pig” → picture \| options pig, dad, cap \| answer **pig** |  |
| AS-M07-05-9 | hear “fog” → spell (1 extra tile) \| tray f o g t \| answer **fog** |  |
| AS-M07-05-10 | hear “rub” → spell (1 extra tile) \| tray r u b n \| answer **rub** |  |
| AS-M07-05-11 | hear “nap” → spell (1 extra tile) \| tray n a p c \| answer **nap** |  |

**Words used in this module:** bed, bin, bug, bus, cat, cot, cup, dog, dot, egg, fog, fun, ham, hat, hen, hug, hut, kid, kit, leg, lip, map, mud, mug, nap, nut, ox, pan, pig, pin, rat, rub, sip, sit, sun, tag

## Content library

### Pictures

- **Hand-drawn (inline SVG, 58):** bell, clock, car, rain, clap, tap, drum, whisper, finger, same, different, fast, slow, magnifier, cat, hat, mat, bat, can, man, fan, pan, dog, log, hen, pen, cap, map, nap, phone, wind, siren, thunder, birds, drip, bag, tag, rag, net, jet, vet, fig, wig, mop, pop, top, sun, sit, sad, kid, run, lip, dad, gum, cup, bus, sip, pin
- **Image files (11, `public/img/words/`):** pig, bug, bed, rat, nut, leg, cab, fog, bin, tub, hut — Google Noto Emoji; license and credits stored alongside the files.

### Audio

| Sound | Kind | Source / note |
|---|---|---|
| bell | Synthesized in-browser (placeholder) | Clear single bell ring, ~1s, no background noise. |
| clock | Synthesized in-browser (placeholder) | Mechanical clock tick-tock, 2 alternating ticks, ~1.3s. |
| car | Real recording | Real recording supplied by the user, served from public/audio/car.aac. Synthesized version kept as an automatic fallback in audioService.js if playback fails on some browser. |
| rain | Synthesized in-browser (placeholder) | Gentle rain patter, ~1.5s. |
| phone | Synthesized in-browser (placeholder) | Classic two-tone phone ring, ~1s. |
| wind | Real recording | Real recording supplied by the user, served from public/audio/wind.aac. Synthesized version kept as an automatic fallback in audioService.js if playback fails on some browser. Added by the developer to widen Lesson 1's vocabulary — not in the original curriculum Media_Manifest, needs curriculum review (see content/word-library.md §4). |
| siren | Synthesized in-browser (placeholder) | Rising-falling alarm siren, ~1s. |
| thunder | Real recording | Real recording supplied by the user, served from public/audio/thunder.aac. Synthesized version kept as an automatic fallback in audioService.js if playback fails on some browser. Developer-added — see content/word-library.md §4. |
| birds | Real recording | Real recording: Mixkit 'Little birds singing in the trees' (mixkit.co, sfx id 17, Mixkit License — free commercial use, no attribution required). Trimmed to 4s and volume-normalized (the original was very quiet), served from public/audio/birds.wav. |
| drip | Real recording | Real recording: Mixkit 'Bathroom sink water drip' (mixkit.co, sfx id 1879, Mixkit License — free commercial use, no attribution required). Served from public/audio/drip.mp3, playback capped at 4s in audioService.js. |
| clap | Synthesized in-browser (placeholder) | Single hand clap, sharp attack. |
| tap | Synthesized in-browser (placeholder) | Single soft finger tap on a table. |
| drum | Synthesized in-browser (placeholder) | Single low drum hit. |
| whisper | Synthesized in-browser (placeholder) | Soft breathy whisper sound, non-verbal. |
| finger | Synthesized in-browser (placeholder) | Very soft single fingertip tap. |

Spoken words (26 listed in `content/media.json`, plus every `say:word` used in lessons) use the browser's text-to-speech voice. Letter sounds are spoken as sounds (for example “nnn”, “puh”), not letter names.

### Badges

| Badge | Name | Status |
|---|---|---|
| BADGE-01 | Sound Starter | Live |
| BADGE-02 | Rhyme Ranger | Live |
| BADGE-03 | Letter Champion | Not built |
| BADGE-04 | Word Builder | Not built |
| BADGE-05 | Reading Star | Not built |
| BADGE-06 | Sentence Star | Not built |
| BADGE-07 | Level 1 Sound Explorer | Not built |

## Code map

The full source is in the GitHub repository; this map says what every file is for (taken from each file's own header comment).

### App and pages

| File | Purpose |
|---|---|
| `src/App.jsx` |  |
| `src/main.jsx` |  |
| `src/theme.js` |  |
| `src/pages/ChildHome.jsx` |  |
| `src/pages/Lesson.jsx` |  |
| `src/pages/ParentDashboard.jsx` |  |

### Activities (one per question type)

| File | Purpose |
|---|---|
| `src/activities/Assessment.jsx` | Wraps any question type for the scored assessment stage: no hints, no retry, first response counts. This is what actually enforces "no second chances during scoring" — activity-type components themselves don't know or care whether they're in practice or ass... |
| `src/activities/BeginningSoundMatch.jsx` | Thin wrapper over MultipleChoice for Module 3's "beginning_sound_match" activity type — structurally identical to RhymeMatch (compare a first sound instead of a last sound), same content shape and same preview-then-confirm interaction (see PREVIEW_CONFIRM_T... |
| `src/activities/EndingSoundMatch.jsx` | Thin wrapper over MultipleChoice for Module 4's "ending_sound_match" activity type — compares a word's LAST sound instead of its first (beginning_sound_match, Module 3) or its rhyme (rhyme_match, Module 2). A genuinely distinct skill: cat/hot share an endin... |
| `src/activities/LetterSoundMatch.jsx` | Thin wrapper over MultipleChoice for Module 8's "letter_sound_match" activity type — MultipleChoice itself renders the LetterTile branches (central prompt when question.letter_prompt is set, option tiles when an option is a single letter). Kept as its own f... |
| `src/activities/ListenChoose.jsx` | Thin wrapper: today this is identical to MultipleChoice, but kept as its own file/type per the activity-type registry so this interaction can diverge (e.g. different layout) later without touching the other activity types or the generic renderer. |
| `src/activities/MultipleChoice.jsx` | The generic answer-option renderer used by every activity type below. Handles: option buttons, per-option pictures/sound (for pre-readers), correct/wrong styling, retry vs scored (no-retry) modes. Nothing here knows about "listen_choose" vs "same_different"... |
| `src/activities/ReadWord.jsx` | Thin wrapper over MultipleChoice for Module 10's "read_word" activity type — the reverse of word_build: instead of hearing a word and building it, the child sees the WRITTEN word (question.written_word, rendered as styled text by MultipleChoice) and picks t... |
| `src/activities/RhymeMatch.jsx` | Thin wrapper over MultipleChoice for Module 2's "rhyme_match" activity type (ACT-04 in the curriculum content engine). Kept as its own file per the activity-type registry, matching every other activity type. |
| `src/activities/RhymeSelect.jsx` | Genuinely different mechanic from MultipleChoice's single-tap-select: the child taps every option that rhymes (multiple can be active at once), then confirms with "Check my answer." Used by Module 2 Lesson 5 ("Make a Rhyme") so it isn't just a reworded copy... |
| `src/activities/SameDifferent.jsx` | Thin wrapper over MultipleChoice for the "same_different" activity type(s). Kept as its own file per the activity-type registry so this interaction can get a bespoke UI later without touching the others. |
| `src/activities/Sort.jsx` | Thin wrapper over MultipleChoice for the "loud_soft/fast_slow" activity type(s). Kept as its own file per the activity-type registry so this interaction can get a bespoke UI later without touching the others. |
| `src/activities/SoundMemory.jsx` | Thin wrapper over MultipleChoice for the "sound_memory" activity type(s). Kept as its own file per the activity-type registry so this interaction can get a bespoke UI later without touching the others. |
| `src/activities/VowelMatch.jsx` | Thin wrapper over MultipleChoice for Module 5's "vowel_match" activity type — compares a word's MIDDLE vowel sound instead of its first (beginning_sound_match) or last (ending_sound_match). Same content shape and preview-then-confirm interaction as the othe... |
| `src/activities/WordBuilder.jsx` | Module 9's "word_build" activity type — hear (or, for dictation-style items, be shown) a target word, then assemble it by tapping letter tiles into order from a shuffled bank. Tap-to-place rather than drag-and-drop: far more reliable to implement and test o... |
| `src/activities/registry.js` | Adding a NEW activity type (e.g. drag-and-drop letter tiles for a later module) means: (1) create the component, (2) add one line here. No other file needs to change — LessonPlayer and QuestionCard both go through this registry, never a type-specific switch... |

### Components

| File | Purpose |
|---|---|
| `src/components/AudioPlayer.jsx` |  |
| `src/components/Badge.jsx` |  |
| `src/components/Btn.jsx` |  |
| `src/components/Celebration.jsx` | Lightweight CSS-keyframe particle burst — no external animation/confetti library. Uses the "scd-confetti-fall" keyframe injected globally by theme.js's useGlobalAnimations(). Purely decorative: renders nothing interactive, sits absolutely positioned over it... |
| `src/components/Feedback.jsx` |  |
| `src/components/Icon.jsx` |  |
| `src/components/Illustration.jsx` | Bigger, full-color "hero" pictures — distinct from Icon.jsx's small single-stroke outlines. Icon.jsx stays monochrome on purpose (its color prop signals correct/wrong state on answer buttons); these illustrations own their own palette and are used wherever ... |
| `src/components/LessonPlayer.jsx` |  |
| `src/components/LetterTile.jsx` | A single letter, big and bold in a rounded tile — the visual unit for Module 8 (Letter-Sound Connections) onward. Deliberately NOT hand-drawn SVG art like Illustration.jsx: a letter doesn't need to be illustrated, just shown clearly and consistently, the wa... |
| `src/components/Mascot.jsx` | A single recurring character (a fox detective, tying into the "Sound Detective" / "Letter Detective" narration voice already used throughout the lesson content) for the app's biggest emotional moment — the end-of-lesson result screen. Deliberately NOT a new... |
| `src/components/NarrationScreen.jsx` |  |
| `src/components/Onboarding.jsx` |  |
| `src/components/ProgressBar.jsx` |  |
| `src/components/QuestionCard.jsx` |  |
| `src/components/ResultScreen.jsx` |  |
| `src/components/TopBar.jsx` |  |
| `src/components/WordSoundRow.jsx` | Individual per-word playback: each word gets its own picture and its own tap-to-hear button, no merged "say:a, b, c" phrase. Used wherever a rhyme comparison needs a child to hear each word separately rather than parse one run-on TTS sentence — the model/ex... |

### Services (logic with no UI)

| File | Purpose |
|---|---|
| `src/services/assessmentService.js` | Pure functions — no React, no storage, no side effects. Easy to unit test in isolation (see /test/assessmentService.test.mjs). |
| `src/services/audioService.js` | Mostly a placeholder audio engine — this synthesizes short, distinguishable tones/noise textures in-browser so the app is fully usable before real audio production happens. car, thunder, and wind are the first exceptions: real user-supplied recordings (see ... |
| `src/services/contentService.js` | The only file that imports the raw content JSON. Every other file in the app goes through these functions instead of importing content/*.json directly — that indirection is what lets the loading mechanism change later (e.g. fetch from a CMS instead of a sta... |
| `src/services/progressService.js` | Persistence for this MVP uses the browser's localStorage. There is no backend/server in this environment, and a real relational database is unnecessary complexity for a single-child prototype with no auth. The record shapes below are deliberately relational... |
| `src/services/questionTypes.js` | Comparison-type questions (same/different, loud/soft, fast/slow) aren't about identifying a picturable object — they're a judgment about a quality. Showing one arbitrary sound's picture or offering per-option playback doesn't make sense for them the way it ... |
| `src/services/remediationService.js` |  |
| `src/services/shuffle.js` | Fisher-Yates shuffle, pulled out so both LessonPlayer (question order) and MultipleChoice (option order) can vary presentation without ever touching the underlying content data. |
| `src/services/ttsPreference.js` | Whether narration/prompts read aloud automatically. Plain localStorage (not React state) so every part of the tree that needs the current value — LessonPlayer's header toggle, every screen's useAutoSpeak call — reads/writes the same flag without threading i... |
| `src/hooks/useAutoSpeak.js` | Reads narration/prompt text aloud once when it changes, so pre-readers don't have to read the screen themselves. Gated by the caller's `enabled` flag (see ttsPreference.js) — tap-to-hear sounds (word cards, options) are a separate path entirely and unaffect... |

### Content (the curriculum as data)

| File | Purpose |
|---|---|
| `content/activities.json` |  |
| `content/assessments.json` |  |
| `content/badges.json` |  |
| `content/lessons.json` |  |
| `content/levels.json` |  |
| `content/media.json` |  |
| `content/modules.json` |  |
| `content/parent_practice.json` |  |
| `content/remediation.json` |  |

### Tests

| File | Purpose |
|---|---|
| `test/assessmentService.test.mjs` |  |
| `test/content-integrity.test.mjs` | Validates structural guarantees of the content layer itself — the things that would silently break the app if a content edit introduced a typo'd lesson_id or a dangling error_tag. Run with: npm test |
| `test/docs-up-to-date.test.mjs` |  |
| `test/progressService.test.mjs` |  |

### Scripts

| File | Purpose |
|---|---|
| `scripts/build-docs.mjs` | Generates docs/THE-SPELLING-CODE.md — the single master document — from the real content JSON, the source tree, and the hand-written docs/project-notes.md. Run with `npm run docs`. A test (test/docs-up-to-date.test.mjs) fails if the committed document is st... |

