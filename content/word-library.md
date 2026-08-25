# The Spelling Code — Word & Sound Library

**Purpose:** a single reference for every word/sound this app currently uses or can safely draw on next, organized by module and by phonics category. The curriculum source docs (`The_Spelling_Code_Master_Curriculum_Blueprint_v0.1.docx`, `The_Spelling_Code_Level_1_Content_Engine.xlsx`) give the *module structure and objectives* but only a partial word list — this file is where that gets filled in and kept consistent as new modules get built, so nobody (human or AI) has to re-derive it from the source spreadsheets each time, and so the same word doesn't quietly drift to mean two different things in two modules.

**Ground rule:** everything under "Curriculum-approved" below came directly from the source `.xlsx`/`.docx` — copied, not invented. Everything under "Added by the developer" was introduced while implementing a specific lesson because the curriculum didn't specify enough items for it, and is flagged for curriculum-owner review rather than treated as silently approved. When a future module needs a word not yet in this file, add it here first (with its source), then use it in content — keep this file as the single source of truth rather than letting word choices live only inside `content/*.json`.

---

## 1. Curriculum-approved CVC word bank (from Content Engine → `Word_Library` sheet)

Grouped by vowel sound, with rime family noted — this is the exact set the curriculum engine ships, 38 words:

**short_a**
| Rime | Words |
|---|---|
| -at | cat, bat, hat, mat, sat |
| -an | am, an, can, man, fan, pan |
| -ap | map, cap, tap, nap |

**short_e**
| Rime | Words |
|---|---|
| -ed | bed, red |
| -en | hen, men, pen |
| -et | pet |

**short_i**
| Rime | Words |
|---|---|
| -it | sit |
| -ig | pig |
| -ip | lip |
| -in | pin, fin |

**short_o**
| Rime | Words |
|---|---|
| -og | dog, log |
| -ot | hot, pot |
| -op | hop |

**short_u**
| Rime | Words |
|---|---|
| -un | sun, run, fun |
| -up | cup |
| -us | bus |

Also present as VC (not CVC): **at, am, an, as**.

## 2. Curriculum-approved phonemes (from Content Engine → `Phonemes` sheet)

The keyword column is the curriculum's own child-facing example for each sound — use these first before picking a different example word for a "beginning sound" style lesson (Module 3+).

| Phoneme | Grapheme | Keyword | Introduced at | Type |
|---|---|---|---|---|
| /m/ | m | moon | Module 3 | continuous |
| /s/ | s | sun | Module 3 | continuous |
| /f/ | f | fish | Module 3 | continuous |
| /n/ | n | net | Module 3 | continuous |
| /t/ | t | top | Module 4 | continuous |
| /p/ | p | pig | Module 4 | continuous |
| /k/ | k | kite | Module 8 | continuous |
| /b/ | b | bat | Module 8 | continuous |
| /h/ | h | hat | Module 8 | continuous |
| /r/ | r | run | Module 8 | continuous |
| /l/ | l | lip | Module 8 | continuous |
| /d/ | d | dog | Module 8 | continuous |
| /g/ | g | goat | Module 8 | continuous |
| /ă/ | a | apple | Module 5 | vowel |
| /ĕ/ | e | egg | Module 5 | vowel |
| /ĭ/ | i | igloo | Module 5 | vowel |
| /ŏ/ | o | octopus | Module 5 | vowel |
| /ŭ/ | u | umbrella | Module 5 | vowel |

## 3. Rhyme families actually usable today (derived from §1 — used to build Module 2)

Only families with 2+ concrete, drawable-as-a-picture nouns are usable for a picture-matching rhyme activity. Thinner families are listed too, so it's visible what would strengthen them.

| Family | Usable now (concrete nouns) | Non-noun members in §1 (usable for audio-only, not picture-matching) |
|---|---|---|
| -at | cat, hat, mat, bat | sat |
| -an | can, man, fan, pan | am, an |
| -ap | cap, map, nap | tap *(name collision — see §5)* |
| -og | dog, log | — |
| -ot | pot | hot |
| -en | hen, pen | men |
| -in | pin, fin | — |
| -un | sun | run, fun |
| -ed, -et, -it, -ig, -ip, -op, -up, -us | *(each has only 1 concrete noun — not enough for a rhyme-match activity yet)* | bed/red, pet, sit, pig, lip, hop, cup, bus |

**Module 2 used:** -at, -an, -og, -en, -ap (as cap/map/nap — see §5 for why "tap" was excluded). **Still available for a Module 2 extension or a future module:** -in (pin/fin), -un (sun alone — needs a 2nd word to be usable), -ot (pot alone — needs a 2nd word).

**Gaps if Module 2 gets extended:** -ed, -et, -it, -ig, -ip, -op, -up, -us each need one more concrete-noun word before they're usable for picture-matching. Recommend the curriculum team supply one per family (e.g. a 2nd -ip word, a 2nd -ug-type word) rather than the developer picking new vocabulary unilaterally.

## 4. Module 1 sound-effect assets (not spelling words — environmental/percussive sounds for "Listening Detective")

**Curriculum-approved (from Content Engine → `Media_Manifest` sheet):** bell, dog *(bark — replaced with clock in Round 1, see project history)*, car, rain — the original Lesson 1 "What Is a Sound?" set.

**Currently implemented in `audioService.js`:** bell, clock, car, rain, clap, tap, drum, whisper, finger.

**Added by the developer, needs curriculum review:** phone (ringing), wind (blowing) — added to Lesson 1 to address user feedback that the 4-sound vocabulary felt repetitive on replay. Chosen because they're mechanical/ambient sounds that synthesize convincingly with Web Audio oscillators (the same reason "dog" was replaced with "clock" during Round 1 — animal vocalizations don't synthesize convincingly, mechanical/ambient sounds do). **Not yet in the curriculum's Media_Manifest — flagging for the curriculum owner to confirm or replace.**

## 5. Naming collisions to avoid (engineering note, not curriculum content)

`src/components/Icon.jsx` maps a word/asset id to a picture by substring match. Two different modules can't reuse the same word to mean different pictures:

- **"tap"** = Module 1's percussive "finger tap" sound icon (concentric ripple circles). Module 2's -ap rhyme family therefore uses **cap/map/nap**, not tap, even though "tap" (water tap) is a curriculum-listed -ap word — it's available as a *word* for audio-only rhyme items, just not for the picture-matching format without a new icon disambiguating it from the Module 1 sound.
- Before adding a new word to any future module, check this file's used-icon list (§1–§4 above) for an exact or substring match first.

---

*Maintained alongside the content JSON in `content/`. Update this file whenever a module adds new vocabulary — treat it as the first stop before writing new lesson content, not an afterthought.*
