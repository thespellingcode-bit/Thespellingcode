import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDoc } from "../scripts/build-docs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("docs/THE-SPELLING-CODE.md is up to date — run `npm run docs` if this fails", () => {
  const norm = (s) => s.replace(/\r\n/g, "\n");
  const committed = fs.readFileSync(path.join(ROOT, "docs", "THE-SPELLING-CODE.md"), "utf8");
  assert.equal(norm(committed), norm(buildDoc()));
});
