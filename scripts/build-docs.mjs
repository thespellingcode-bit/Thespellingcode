// scripts/build-docs.mjs
//
// Generates docs/THE-SPELLING-CODE.md — the single master document — from the
// real content JSON, the source tree, and the hand-written docs/project-notes.md.
// Run with `npm run docs`. A test (test/docs-up-to-date.test.mjs) fails if the
// committed document is stale, so it cannot drift from the app.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const json = (p) => JSON.parse(read(p));
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

function walk(dir, exts) {
  const out = [];
  for (const name of fs.readdirSync(path.join(ROOT, dir)).sort()) {
    const rel = `${dir}/${name}`;
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) out.push(...walk(rel, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(rel);
  }
  return out;
}

function headerComment(file) {
  const lines = read(file).split(/\r?\n/);
  const out = [];
  for (const l of lines) {
    if (l.startsWith("//")) out.push(l.replace(/^\/\/\s?/, ""));
    else if (out.length) break;
    else if (l.trim() === "" || l.startsWith("import")) continue;
    else break;
  }
  const text = out.filter((l) => l.trim() && !l.trim().startsWith(file)).join(" ").replace(/\s+/g, " ").trim();
  return text.length > 260 ? text.slice(0, 257) + "..." : text;
}

function itemCell(it) {
  const audio = it.audio_asset ? it.audio_asset.replace(/^say:/, "") : "";
  switch (it.type) {
    case "letter_sound_match":
      return `hear “${audio}” → letter | options ${it.options.join(" ")} | answer **${it.correct_answer}**`;
    case "word_build": {
      const spell = /spell/i.test(it.prompt || it.question || "");
      return `hear “${audio}” → ${spell ? "spell (1 extra tile)" : "build"} | tray ${it.letters.join(" ")} | answer **${it.correct_answer}**`;
    }
    case "read_word":
      return `read “${it.written_word}” → picture | options ${it.options.join(", ")} | answer **${it.correct_answer}**`;
    default: {
      const bits = [];
      if (audio) bits.push(`sound: ${audio}`);
      if (it.options) bits.push(`options ${it.options.join(", ")}`);
      bits.push(`answer **${it.correct_answer}**`);
      return bits.join(" | ");
    }
  }
}

export function buildDoc() {
  const levels = json("content/levels.json");
  const modules = json("content/modules.json");
  const lessons = json("content/lessons.json");
  const acts = json("content/activities.json");
  const asm = json("content/assessments.json");
  const media = json("content/media.json");
  const badges = json("content/badges.json");
  const notes = read("docs/project-notes.md").trim();

  const out = [];
  const w = (s = "") => out.push(s);

  w("# The Spelling Code — Master Document");
  w();
  w("> **Generated file — do not edit by hand.** Edit `docs/project-notes.md` for the written sections and the content JSON under `content/` for the curriculum, then run `npm run docs`. Everything from “Curriculum” down is built directly from the live content files, so it always matches the app.");
  w();
  w("## Contents");
  w("1. Project notes (purpose, roadmap, scope, architecture, decisions, workflow)");
  const planDir = path.join(ROOT, "docs", "plans");
  const plans = fs.existsSync(planDir) ? fs.readdirSync(planDir).filter((f) => f.endsWith(".md")).sort() : [];
  plans.forEach((f, i) => w(`${i + 2}. Plan: ${read(`docs/plans/${f}`).match(/^## \d+\.\s*(.+)$/m)?.[1] ?? f}`));
  let n = plans.length + 2;
  w(`${n++}. Curriculum at a glance`);
  w(`${n++}. Curriculum in full (every module, lesson and question)`);
  w(`${n++}. Content library (pictures, audio, badges)`);
  w(`${n++}. Code map`);
  w();
  w("---");
  w();
  w(notes);
  w();
  w("---");
  w();
  for (const f of plans) {
    w(read(`docs/plans/${f}`).trim());
    w();
    w("---");
    w();
  }

  // ---- curriculum at a glance
  w("## Curriculum at a glance");
  w();
  levels.forEach((l) => w(`- **Level ${l.level_id}** — ${l.level_name ?? l.name ?? ""} ${l.description ? "— " + l.description : ""}`.trim()));
  w();
  w("| Module | Name | Status | Lessons | Practice items | Assessment items |");
  w("|---|---|---|---|---|---|");
  for (const m of modules) {
    const ls = lessons.filter((l) => l.module_id === m.module_id);
    const ids = new Set(ls.map((l) => l.lesson_id));
    w(`| ${m.module_id} | ${esc(m.module_name)} | ${m.active ? "**Live**" : "Not built"} | ${ls.length} | ${acts.filter((a) => ids.has(a.lesson_id)).length} | ${asm.filter((a) => ids.has(a.lesson_id)).length} |`);
  }
  w();

  // ---- curriculum in full
  w("## Curriculum in full");
  w();
  w("Read it as: what the child hears or sees → what they choose or build → the correct answer. “Practice” items appear in the warm-up and solo rounds; “Assessment” items are the scored challenge.");
  w();
  for (const m of modules.filter((m) => m.active)) {
    w(`### Module ${m.module_id} — ${m.module_name}`);
    w();
    w(`*Goal:* ${m.module_goal}`);
    w();
    const ls = lessons.filter((l) => l.module_id === m.module_id).sort((a, b) => a.number - b.number);
    const wordSet = new Set();
    for (const l of ls) {
      w(`#### Lesson ${l.number}: ${l.title} (\`${l.lesson_id}\`)`);
      w();
      w(`- **Objective:** ${l.objective}`);
      w(`- **Skill:** ${l.skill} · **Activity:** ${l.activity_type} · **Time:** ${l.estimated_time} · **Mastery threshold:** ${Math.round(l.masteryThreshold * 100)}%`);
      if (l.narration) {
        for (const [k, v] of Object.entries(l.narration)) w(`- **Narration (${k}):** ${v}`);
      }
      w();
      const p = acts.filter((a) => a.lesson_id === l.lesson_id);
      const s = asm.filter((a) => a.lesson_id === l.lesson_id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const collect = (it) => {
        if (it.written_word) wordSet.add(it.written_word);
        if (it.type === "word_build") wordSet.add(it.correct_answer);
        if (it.type === "letter_sound_match" && it.audio_asset) wordSet.add(it.audio_asset.replace(/^say:/, ""));
      };
      p.forEach(collect); s.forEach(collect);
      if (p.length) {
        w("**Practice**");
        w();
        w("| ID | Item |");
        w("|---|---|");
        p.forEach((it) => w(`| ${it.activity_id} | ${esc(itemCell(it))} |`));
        w();
      }
      if (s.length) {
        w("**Assessment**");
        w();
        w("| ID | Item | Review flag |");
        w("|---|---|---|");
        s.forEach((it) => w(`| ${it.assessment_id} | ${esc(itemCell(it))} | ${esc(it.review_flag ?? "")} |`));
        w();
      }
    }
    if (/^Letter Cluster|Level 1 Review/.test(m.module_name)) {
      w(`**Words used in this module:** ${[...wordSet].sort().join(", ")}`);
      w();
    }
  }

  // ---- content library
  w("## Content library");
  w();
  w("### Pictures");
  w();
  const illo = read("src/components/Illustration.jsx");
  const drawn = [...illo.matchAll(/^  (\w+): \(/gm)].map((m) => m[1]).filter((k) => k !== "pattern");
  const imageKeys = Object.keys(
    Object.fromEntries([...(illo.match(/const IMAGE_BG = \{([\s\S]*?)\};/)?.[1] ?? "").matchAll(/(\w+):\s*"#/g)].map((m) => [m[1], 1])),
  );
  w(`- **Hand-drawn (inline SVG, ${drawn.length}):** ${drawn.join(", ")}`);
  w(`- **Image files (${imageKeys.length}, \`public/img/words/\`):** ${imageKeys.join(", ")} — Google Noto Emoji; license and credits stored alongside the files.`);
  w();
  w("### Audio");
  w();
  w("| Sound | Kind | Source / note |");
  w("|---|---|---|");
  for (const a of media.filter((x) => x.type === "audio" && !String(x.filename).startsWith("say:"))) {
    w(`| ${a.asset_id} | ${a.placeholder ? "Synthesized in-browser (placeholder)" : "Real recording"} | ${esc(a.placeholder ? a.production_brief : a.placeholder_note)} |`);
  }
  const tts = media.filter((x) => String(x.filename).startsWith("say:")).length;
  w();
  w(`Spoken words (${tts} listed in \`content/media.json\`, plus every \`say:word\` used in lessons) use the browser's text-to-speech voice. Letter sounds are spoken as sounds (for example “nnn”, “puh”), not letter names.`);
  w();
  w("### Badges");
  w();
  w("| Badge | Name | Status |");
  w("|---|---|---|");
  badges.forEach((b) => w(`| ${b.badge_id} | ${esc(b.name ?? b.badge_name)} | ${b.active ? "Live" : "Not built"} |`));
  w();

  // ---- code map
  w("## Code map");
  w();
  w("The full source is in the GitHub repository; this map says what every file is for (taken from each file's own header comment).");
  w();
  const groups = [
    ["App and pages", ["src/App.jsx", "src/main.jsx", "src/theme.js", ...walk("src/pages", [".jsx"])]],
    ["Activities (one per question type)", walk("src/activities", [".jsx", ".js"])],
    ["Components", walk("src/components", [".jsx"])],
    ["Services (logic with no UI)", walk("src/services", [".js"]).concat(walk("src/hooks", [".js"]))],
    ["Content (the curriculum as data)", walk("content", [".json"])],
    ["Tests", walk("test", [".mjs"])],
    ["Scripts", walk("scripts", [".mjs", ".cjs"])],
  ];
  for (const [title, files] of groups) {
    w(`### ${title}`);
    w();
    w("| File | Purpose |");
    w("|---|---|");
    for (const f of files) {
      const d = f.endsWith(".json") ? "" : headerComment(f);
      w(`| \`${f}\` | ${esc(d)} |`);
    }
    w();
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dest = path.join(ROOT, "docs", "THE-SPELLING-CODE.md");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buildDoc());
  console.log("wrote", path.relative(ROOT, dest));
}
