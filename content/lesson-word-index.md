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
- **Skill:** auditory_discrimination · **Status:** Approved
- **Objective:** Distinguish loud and soft sounds.
- **Words/sounds:** Drum, Clap (loud); Tap, Finger, Whisper (soft) *(all curriculum, Activities ACT-01)*
- **Why:** Wide, unambiguous volume gap between the loud and soft sets for a 4-5 year old.

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
