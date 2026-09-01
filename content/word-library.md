# The Spelling Code — Word & Sound Library

**Purpose:** a single reference for every word/sound this app currently uses or can safely draw on next, organized by module and by phonics category. The curriculum source docs (`The_Spelling_Code_Master_Curriculum_Blueprint_v0.1.docx`, `The_Spelling_Code_Level_1_Content_Engine.xlsx`) give the *module structure and objectives* but only a partial word list — this file is where that gets filled in and kept consistent as new modules get built, so nobody (human or AI) has to re-derive it from the source spreadsheets each time, and so the same word doesn't quietly drift to mean two different things in two modules.

**Ground rule (updated):** §1 is copied verbatim from the curriculum spreadsheet — that boundary stays, as the traceable baseline. §1b is a substantial **developer-authored expansion**, explicitly requested so the library isn't limited to the curriculum's starter list. Everything in §1b still obeys the progression rules already fixed for Level 1 — **short-vowel CVC/CCVC only, no C/K/CK, no silent-E, no vowel teams, no digraphs** — those are structural rules for this level, not just "the curriculum's idea," so they still apply even though the word *list* itself no longer has to. Anything outside those rules is out of scope regardless of who's authoring.

---

## 1. Curriculum-approved CVC word bank (from Content Engine → `Word_Library` sheet)

The exact 38-word set the curriculum engine ships — kept as-is, unedited, as the traceable baseline.

**short_a** — -at: cat, bat, hat, mat, sat · -an: am, an, can, man, fan, pan · -ap: map, cap, tap, nap
**short_e** — -ed: bed, red · -en: hen, men, pen · -et: pet
**short_i** — -it: sit · -ig: pig · -ip: lip · -in: pin, fin
**short_o** — -og: dog, log · -ot: hot, pot · -op: hop
**short_u** — -un: sun, run, fun · -up: cup · -us: bus

## 1b. Developer-added CVC word bank (short-vowel only — fills the gaps §1 left thin)

Every word below is a common, concrete, everyday English word appropriate for ages 4–6 — nothing obscure, nothing that needs an adult to explain. "🖼" marks a concrete noun usable for picture-matching (like Module 2's rhyme_match format); without it, a word is fine for audio-only formats but not a picture-based one.

**short_a**
| Rime | New words |
|---|---|
| -ag | bag 🖼, tag 🖼, wag, rag 🖼 |
| -ad | dad 🖼, pad 🖼, sad, mad |

**short_e**
| Rime | New words |
|---|---|
| -et | net 🖼, jet 🖼, vet 🖼, wet, get, set |
| -ell | bell*, shell 🖼, well 🖼, tell *(★ — see collision note below)* |

**short_i**
| Rime | New words |
|---|---|
| -ig | big, dig, fig 🖼, wig 🖼, jig |
| -ip | chip 🖼, dip, hip, rip, sip, ship 🖼*(★)*, tip, whip 🖼, zip |
| -it | bit, fit, hit, kit 🖼 |
| -id | kid 🖼, lid 🖼, hid |

**short_o**
| Rime | New words |
|---|---|
| -op | mop 🖼, pop 🖼, shop 🖼*(★)*, top 🖼, cop 🖼 |
| -ot | cot 🖼, dot 🖼, tot 🖼, got, jot, lot, not, rot |
| -ox | box 🖼, fox 🖼 |

**short_u**
| Rime | New words |
|---|---|
| -up | pup 🖼 |
| -ug | bug 🖼, hug, jug 🖼, mug 🖼, rug 🖼, tug |
| -ub | cub 🖼, rub, tub 🖼, sub 🖼 |

That takes every short-vowel family from "1 usable word" to at least 2, most to 4+ — see §3 for what this unlocks for rhyme-match-style activities.

**★ Two new collisions to watch, same rule as §5:**
- **"shop" contains "hop"** as a substring. If a future lesson implements icons for both, the substring-matching `iconForAsset()`/`labelToIcon()` helpers would resolve "shop" to the "hop" picture unless the icon set is built carefully (word-boundary-aware matching, or picking only one of the two for picture-matching). Flagging now, before either is wired in, rather than after.
- **"bell"** here means the *spelling word* rhyming with shell/well; Module 1 already uses "bell" as a *sound-effect asset name*. If -ell ever becomes a Module 2+ rhyme family, it needs a disambiguated asset id (e.g. treat the rhyme word and the sound effect as different asset namespaces) so a rhyme_match item for "bell" doesn't accidentally render Module 1's bell chime/picture.

## 2. Curriculum-approved phonemes (from Content Engine → `Phonemes` sheet)

Unchanged from before — the keyword column is the curriculum's own child-facing example for each sound. **Module 3 ships with different words than these keywords** (moon/fish/snake/nose are all outside Level 1's short-vowel CVC scope) — see §5 for the actual substitutions and why.

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

## 3. Rhyme families usable today (§1 + §1b combined)

Every family now has enough concrete nouns for a picture-matching rhyme activity — this was the actual blocker before.

| Family | Concrete-noun words available | In use (Module 2) |
|---|---|---|
| -at | cat, hat, mat, bat | ✅ Lesson 1 |
| -an | can, man, fan, pan | ✅ Lesson 2 |
| -og | dog, log | ✅ Lesson 4 |
| -en | hen, pen | ✅ Lesson 4 |
| -ap | cap, map, nap | ✅ Lesson 5 |
| -in | pin, fin | Available, unused |
| -ag | bag, tag, rag | Available, unused |
| -ad | dad, pad | Available, unused |
| -et | net, jet, vet | Available, unused |
| -ig | fig, wig | Available, unused |
| -ip | chip, whip *(ship — see ★ collision)* | Available, unused |
| -id | kid, lid | Available, unused |
| -op | mop, pop, top, cop *(shop — see ★ collision)* | Available, unused |
| -ot | cot, dot, tot, pot, hot | Available, unused |
| -ox | box, fox | Available, unused |
| -ug | bug, jug, mug, rug | Available, unused |
| -ub | cub, tub, sub | Available, unused |
| -un | sun (+ run/fun, not nouns) | Available, unused — still needs a 2nd concrete noun |

**Enough here for 3–4 more Module-2-style lessons or a Module 2 extension** (e.g. a "Rhyme Detective Part 2") without touching the curriculum spreadsheet or inventing anything outside the short-vowel CVC boundary.

## 4. Environmental/sound-effect assets (Module 1 style — not spelling words)

**Curriculum-approved:** bell, clock*, car, rain *(*clock replaced the original "dog" in Round 1 — see project history)*
**Currently implemented, developer-added, already wired into Lesson 1:** phone, wind
**New candidates — documented here, not yet wired into any lesson:** siren *(frequency sweep — synthesizes very well)*, thunder *(low rumble, same technique as the car engine)*, footsteps *(rhythmic low thuds)*, door knock *(sharp percussive hit, easy to tell apart from clap/tap)*. All four were screened the same way phone/wind were — mechanical/percussive/ambient sounds that a Web Audio oscillator can render convincingly, avoiding the animal/voice category that struggled in Round 1 (the original dog-bark problem).

## 5. Module 3 (Beginning Sound Detective) word choices

Curriculum's own example words for this module (`Level_1_Program_Complete.docx`)
— moon, fish, snake, nose — all violate Level 1's own short-vowel CVC/CCVC
scope from the ground rule above: "moon" is a vowel team, "fish"/"snake"
use a digraph/silent-E, "nose" is silent-E. Substituted with clean CVC
words that still start with the target phoneme, reusing the existing §1b
bank wherever possible:

| Phoneme | Curriculum's word (out of scope) | Words actually used | Source |
|---|---|---|---|
| /m/ | moon | mat, map, man, mop | §1/§1b (all already illustrated from Modules 1–2) |
| /s/ | sun, sock, snake | sun, sit, sad | sun from §1 (`short_u`); **sit, sad are new** — first Module 2/3 use of an /s/-initial word |
| /f/ | fish | fan, fig | §1b (already illustrated) |
| /n/ | nose, net | net, nap | §1b/§3 (already illustrated) |

**Thin pools, honestly disclosed rather than papered over:** /f/ and /n/
each have only 2 usable CVC words in the current bank (fan/fig, net/nap),
and /s/ has only 3 (sun/sit/sad) — every directed pair among them gets
used at least once across Lesson 3/4's practice bank, so 3 of Lesson 6's
8 assessment items necessarily repeat a practice (word, answer) pair.
Each is marked with `review_flag` in `content/assessments.json` rather
than hidden. **Adding a 3rd /f/-word, a 3rd /n/-word, and a 4th /s/-word
would resolve this** — worth prioritizing before Module 3 gets revisited,
listed here so it's not lost.

**Isolated phoneme audio — deliberately not attempted.** Browser
text-to-speech reads a bare letter like "m" as its *name* ("em"), not its
*sound* ("mmm") — for a phonics module whose entire point is sound-not-
letter-name, that would actively teach the wrong thing. Module 3 teaches
beginning sounds entirely through whole real words (TTS handles those
correctly) with captions that state the phoneme in text, never audio. If
real recordings of an adult voice saying "mmm/sss/fff/nnn" become
available later (the same path used for the car/thunder/wind recordings
in `public/audio/`), they'd slot in as an enhancement.

## 6. Naming collisions to avoid (engineering note, not curriculum content)

`src/components/Icon.jsx` maps a word/asset id to a picture by substring match — two different modules can't reuse the same word (or a word that's a substring of another) to mean different pictures.

- **"tap"** = Module 1's percussive sound icon. Module 2's -ap rhyme family uses cap/map/nap instead.
- **"shop" contains "hop"**, **"bell"** means two different things in two modules — see the ★ notes in §1b.
- Before adding a new word to any lesson, check this file's used-icon list (§1b, §3, §4) for an exact or substring match first.

## 7. Modules 4-7 word/mechanic choices

- **Module 4 (Ending Sound Detective)** — curriculum's own lesson 4.3 is
  "Final /m/ and /n/," but the app has zero /m/-ending CVC words illustrated.
  Substituted **/g/ and /n/** instead (bag/tag/rag/fig/wig vs.
  can/man/fan/pan/hen/pen/sun — both already well-stocked), teaching the
  identical skill (distinguish two final consonant sounds) without needing
  new art.
- **Module 5 (Short Vowel Explorer)** — curriculum's vowel keyword pictures
  (apple, igloo, octopus, umbrella) are all multisyllabic, same class of
  issue as Module 3's moon/fish/snake. Substituted genuine CVC words per
  vowel, drawn mostly from the existing bank. Short /u/ had only one usable
  word (sun) — not enough to form a same-vowel pair at all — so **cup** and
  **bus** were added (new illustrations) to bring it to 3, matching short
  /i/'s pool size (sit, fig, wig). Both pools are thin enough that some
  assessment items necessarily repeat a practice pair — `review_flag`'d
  rather than hidden, same convention as Module 3's /s/.
- **Module 6 (Sound Blending)** — same "don't isolate a bare phoneme via
  TTS" reasoning as Module 3 applies doubly here, since blending by
  definition needs separate sounds. Built as whole-word listen-and-choose
  (reusing `listen_choose` exactly, zero new code) rather than attempting
  real phoneme-by-phoneme audio — the "Continuous Blending" lesson frames
  this as a slow/stretched version of the same word, not literally isolated
  sounds.
- **Module 7 (Sound Segmenting)** — the app's whole CVC word bank is
  uniformly 3 phonemes (no 2-phoneme VC words like "at"/"up" are
  illustrated), so a true "count 2 vs. 3 sounds" discrimination task isn't
  achievable without new short vocabulary. Built as "how many sounds — 2, 3,
  or 4?" instead, always correctly answered "3" — a legitimate, simpler
  phonological-awareness task (can the child correctly count a word's
  sounds at all), not a discrimination task between word lengths. Flagging
  here in case 2-phoneme words get added later and this should be revisited
  to a genuine 2-vs-3 comparison.

## 8. Modules 8-11 word/mechanic choices

- **Module 8 (Letter–Sound Connections)** — the C/K conflict: curriculum
  example words for Modules 4/5/7/9/10/11 constantly use cat/cap/can/cup,
  but the Phonemes sheet only ever teaches "k" as the grapheme for /k/, and
  Program_Complete.docx's own "Level 1 Boundaries" explicitly excludes
  "Hard C / soft C and C/K/CK spelling choices." Resolved by judgment: the
  boundary protects against asking a child to *choose* between c/k/ck when
  *encoding* an unfamiliar word (that's Level 4 material) — it says nothing
  about *reading* a C-spelled word, or about a dictation item that always
  has exactly one correct spelling already baked into its content. So
  Module 8 teaches **"c" as a second grapheme for /k/ alongside "k"**
  (both receptive only), and no lesson in this app (Module 8 through 11)
  ever constructs a task where the child must decide which of c/k/ck is
  correct for the same sound — every relevant word's spelling is simply
  given. This keeps the natural, common word pool (cat/cap/can/cup) instead
  of the few available "k"-only words.
- **Module 9 (Build Your First Words) and Module 11 (Spell Your First
  Words)** — `word_build` items need **no illustration at all** (the UI is
  letter tiles, not pictures), unlike every audio/picture-matching type
  before it. This freed word choice from the illustrated-word constraint
  that shaped Modules 1-7 and Module 10 — any real, phonetically regular
  CVC word can be used. Module 9 clusters words into rime families (-at,
  -an, -ap) with an exact letter bank (only the target word's own letters,
  scrambled). Module 11 reuses the identical `word_build` mechanic but adds
  1-2 **decoy letters** to the tray (present in the shuffled bank, never
  used in the target word) — turning the task from letter *sequencing*
  (Module 9) into genuine letter *recall/selection* (Module 11), which is
  what actually distinguishes "building" from "spelling." Decoy letters are
  chosen to never include "k" alongside a word using "c" (or vice versa),
  so the C/K boundary above is never accidentally reintroduced through a
  decoy tile.
- **Module 10 (Read CVC Words)** — the reverse of Module 9: the central
  prompt is the written word itself (a new `written_word` content field,
  rendered as large styled text) instead of audio, and the child picks the
  matching picture — so it's constrained by the same illustrated-word list
  as Modules 1-7 (unlike Module 9/11's `word_build`). Lesson 7 ("CVC in
  Sentences") extends `written_word` to hold a full short sentence (e.g.
  "The cat sat.") rather than a single word, with `correct_answer` set to
  the sentence's illustrated subject.

---

*Maintained alongside the content JSON in `content/`. Update this file whenever a module adds new vocabulary — treat it as the first stop before writing new lesson content, not an afterthought.*
