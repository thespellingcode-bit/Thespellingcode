# Lesson-by-Lesson Word & Sound Index

Companion to `content/word-library.md` (the full word bank) — this file maps what's *actually used in each shipped lesson*, why, and whether it's curriculum-approved or developer-added. Regenerate/update this whenever lesson content changes. A rendered version (nicer to read) was published as an Artifact: see repo history / conversation for the link.

**Header fields every lesson entry below carries**, proposed as the standard for future modules too:
- **Module** — number + name
- **Lesson** — number + title (must match the app and the curriculum engine exactly)
- **Skill** — the taxonomy tag stored on the content (links to assessment/remediation logic)
- **Objective** — the one-sentence learning objective
- **Source** — Curriculum-approved (traceable to the source spreadsheet/doc) vs Developer-added (flagged for review)
- **Status** — Approved, or N items flagged

---

## Module 1 — Listening Detective
*Build careful listening and auditory discrimination · 6 lessons · skills: `auditory_discrimination`, `auditory_memory`*

### Lesson 1 — What Is a Sound?
- **Skill:** auditory_discrimination · **Status:** 2 flagged
- **Objective:** Identify and match familiar environmental sounds.
- **Words/sounds:** Bell, Clock, Car, Rain *(curriculum, Media_Manifest — Clock replaced the original "dog" in Round 1)* + Phone, Wind *(developer-added, pending curriculum review)*
- **Why:** Foundational sound-ID lesson; widened from 4 to 6 sounds this round because replaying the lesson always served the same 4. Phone/wind chosen as mechanical/ambient sounds — the category that synthesizes convincingly with Web Audio, same reasoning as the original dog→clock swap.

### Lesson 2 — Same or Different?
- **Skill:** auditory_discrimination · **Status:** Approved
- **Objective:** Tell whether two sounds are the same or different.
- **Words/sounds:** Clap+Clap, Clap+Tap, Bell+Bell, Clock+Bell, Tap+Clap *(all curriculum, Activities ACT-02)*
- **Why:** Pairs two new percussive sounds (clap/tap) with two already-known ones (bell/clock) so the same/different judgment tests discrimination, not recall of unfamiliar sounds.

### Lesson 3 — Loud and Soft
- **Skill:** auditory_discrimination · **Status:** Approved (fixed — was 2 real bugs)
- **Objective:** Distinguish loud and soft sounds.
- **Words/sounds:** drum/tap/clap/finger/bell, each played through a genuinely gain-scaled `_loud`/`_soft` variant (see `audioService.js`'s `playAttenuated`) — not the raw identity sound.
- **Why:** User feedback: this lesson was hard to differentiate. Root cause was two bugs, not a tuning preference — the `_loud`/`_soft` naming existed but never actually attenuated anything (a "soft" item played identically to the plain sound), and one item's question format ("which sound is soft: Whisper or Drum?") didn't match its single-sound audio. Both fixed: real ~3.7x gain contrast between `_loud`/`_soft` variants, and every item now uses the same single-sound-judgment format.

### Lesson 4 — Fast and Slow
- **Skill:** auditory_discrimination · **Status:** Approved
- **Objective:** Distinguish fast and slow sound patterns.
- **Words/sounds:** Clap, Tap in fast/slow repeated patterns; Pattern A/B compare *(curriculum, Activities ACT-01)*
- **Why:** Deliberately reuses only clap/tap from Lessons 2-3 so tempo, not sound identity, is the tested variable.

### Lesson 5 — Sound Memory
- **Skill:** auditory_memory · **Status:** Approved
- **Objective:** Remember a short sound sequence.
- **Words/sounds:** Clap-Tap sequences, 2 and 3 items *(curriculum, Activities ACT-01)*
- **Why:** Restricted to the two most-drilled sounds so memory load comes from sequence length, not unfamiliar-sound recall.

### Lesson 6 — Listening Detective Assessment
- **Skill:** module review · **Status:** 1 flagged
- **Objective:** Demonstrate the module's listening skills independently.
- **Words/sounds:** Cumulative — Bell/Clock/Car/Rain/Phone/Wind, Same/Different pairs, Loud/Soft, Fast/Slow, Sound Memory sequences.
- **Why:** 10-item review across every skill taught, no new vocabulary. One sequence-memory item flagged as reusing a practice pattern exactly.

## Module 2 — Rhyme Detective
*Recognise and produce simple rhymes · 6 lessons · skill: `rhyming`*

### Lesson 1 — Meet Rhyme
- **Status:** Approved
- **Objective:** Recognise that rhyming words end with the same sound.
- **Words:** cat, hat, mat, bat (-at family, all 4 curriculum-approved members) + dog/pen/can as distractors
- **Why:** -at is the richest concrete-noun family in the curriculum's Word_Library (4 members) — natural first family.

### Lesson 2 — Find the Rhyme
- **Status:** Approved
- **Objective:** Choose the word that rhymes with a spoken word.
- **Words:** can, man, fan, pan (-an family) + review distractors from -at
- **Why:** Second full family; distractors reuse Lesson 1's words on purpose so the child discriminates between two familiar endings, not just spots "the new one."

### Lesson 3 — Odd One Out
- **Status:** Approved
- **Objective:** Identify the word that does not rhyme with the others.
- **Words:** Mixes -at, -an, -en across 5 three-word trios (e.g. cat/hat/dog → dog is odd one out)
- **Why:** First comparative format; cumulative review forcing attention onto the ending sound. Audio is one spoken phrase via TTS (e.g. `say:cat, hat, dog`).

### Lesson 4 — Finish My Rhyme
- **Status:** 1 flagged
- **Objective:** Complete a rhyming pair with the matching word.
- **Words:** dog, log (-og) and hen, pen (-en) — 2-member families
- **Why:** Smallest usable families; one assessment item necessarily repeats its practice pair exactly since there's no 3rd family member — flagged rather than hidden. A 3rd -og/-en word from the curriculum team would resolve it.

### Lesson 5 — Make a Rhyme
- **Status:** Approved
- **Objective:** Choose a word that could rhyme with a given word.
- **Words:** cap, map, nap (-ap family)
- **Why:** Curriculum's own -ap list includes "tap," deliberately swapped for "nap" here — "tap" is already the Module 1 percussive-sound icon name, reusing it would show the wrong picture (see word-library.md §5).

### Lesson 6 — Rhyme Challenge
- **Status:** Approved
- **Objective:** Demonstrate independent mastery of Module 2 rhyming skills.
- **Words:** 10-item cumulative review across -at, -an, -og, -en, -ap + 2 odd-one-out items
- **Why:** Same "pure assessment, no new practice" structure as Module 1 Lesson 6.

## Module 3 — Beginning Sound Detective
*Identify first sounds in spoken words · 6 lessons · skill: `beginning_sounds`*

### Lesson 1 — What Comes First?
- **Status:** Approved
- **Objective:** Notice that every word starts with a sound.
- **Words:** cat/can, bag/bat, man/map, top/tag, pop/pan — mixed already-known first sounds, no target phoneme yet
- **Why:** General concept preview before naming any specific phoneme, mirroring how Meet Rhyme opened Module 2.

### Lesson 2 — Meet /m/
- **Status:** Approved
- **Objective:** Identify words that start with the /m/ sound.
- **Words:** mat, map, man, mop — all 4 curriculum-approved (word-library.md §1/§1b), already illustrated from Modules 1–2
- **Why:** Curriculum's own keyword ("moon") is a vowel team, out of Level 1's CVC scope — substituted with this level's existing /m/-initial CVC words (see word-library.md §5).

### Lesson 3 — Meet /s/
- **Status:** Approved
- **Objective:** Identify words that start with the /s/ sound.
- **Words:** sun, sit, sad — sun from curriculum's own Word_Library; sit/sad are new (first /s/-initial words in the app, new illustrations added)
- **Why:** Curriculum's keywords ("sock," "snake") use a digraph/silent-E — substituted with clean CVC alternatives.

### Lesson 4 — Meet /f/ and /n/
- **Status:** Approved
- **Objective:** Tell the /f/ sound and the /n/ sound apart.
- **Words:** fan, fig (/f/) vs. net, nap (/n/) — pure 2-option discrimination between the two target sounds, not a 3rd distractor
- **Why:** Curriculum frames this lesson as "distinguish," not just "identify" — options are always one word from each target family so the child is genuinely choosing between /f/ and /n/, not filtering out an unrelated sound.

### Lesson 5 — Beginning Sound Mix
- **Status:** Approved
- **Objective:** Identify beginning sounds across /m/, /s/, /f/, /n/ together.
- **Words:** Cumulative — one item per phoneme, 4-option pools (wider than Lessons 2–4's 2–3 options)
- **Why:** Same "wider search pool" differentiation used for Module 2 Lesson 2.

### Lesson 6 — Beginning Sound Challenge
- **Status:** 3 flagged
- **Objective:** Demonstrate independent mastery of Module 3 beginning-sound skills.
- **Words:** 8-item cumulative review across /m/, /s/, /f/, /n/
- **Why:** /f/ and /n/'s 2-word pools and /s/'s 3-word pool are fully exhausted by Lessons 3–4's practice banks, so 3 assessment items necessarily repeat a practice pair — each flagged with `review_flag` rather than hidden. See word-library.md §5 for the "add a 3rd word per family" recommendation this surfaces.

**Isolated phoneme audio was deliberately not attempted** — see word-library.md §5 for why (browser TTS reads a bare letter by its *name*, not its *sound*, which would teach the wrong thing for this exact skill).
