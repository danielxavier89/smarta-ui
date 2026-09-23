/**
 * No component says an English word on its own behalf.
 *
 * The sibling of lint-tokens.mjs, and the same argument. A hardcoded colour
 * makes a component belong to one product; a hardcoded string makes it belong
 * to one language. The backoffice is German, the webapp is German and English,
 * and an accessible name is the worst place to hide an untranslatable word —
 * it is invisible on screen and read aloud to the one user who cannot work
 * around it.
 *
 * Everything the library has to say for itself lives in lib/labels.ts and is
 * reached with useLabels(). This fails the build if one creeps back.
 *
 * What it deliberately does not check: the copy a product passes in. A `title`,
 * a button's children, an error message — those are the product's words and
 * always were.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = "packages/ui/src";
const ROOTS = [join(SRC, "components"), join(SRC, "lib")];

/** Attributes whose value reaches a user, directly or through a screen reader. */
const ATTRS = ["aria-label", "aria-description", "aria-placeholder", "title", "alt", "placeholder"];

/**
 * Props that are an accessible name by contract: IconButton's `label` is both
 * aria-label and title, so a literal there is the same defect one level up.
 */
const NAME_PROPS = ["label"];

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p) && !p.includes(".stories.")) files.push(p);
  }
}
for (const r of ROOTS) walk(r);

const problems = [];

for (const file of files) {
  // labels.ts is the one place the English words are supposed to be.
  if (file.endsWith("lib/labels.ts")) continue;

  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((line, i) => {
    const report = (what, text) =>
      problems.push({
        file: relative(process.cwd(), file),
        line: i + 1,
        what,
        text,
      });

    for (const attr of ATTRS) {
      // A literal string, not {expression}. Single word or sentence, letters.
      const m = line.match(new RegExp(`${attr}="([^"{}]*[A-Za-z]{2}[^"{}]*)"`));
      if (m) report(attr, m[1]);
    }

    for (const prop of NAME_PROPS) {
      const m = line.match(new RegExp(`(?<![\\w-])${prop}="([^"{}]*[A-Za-z]{2}[^"{}]*)"`));
      if (m) report(`${prop}=`, m[1]);
    }

    // `label = "Search"` — a default that bakes a language into the signature.
    const def = line.match(/^\s*(?:label|placeholder|cancelLabel|confirmLabel)\s*=\s*"([^"]*[A-Za-z]{2}[^"]*)"/);
    if (def) report("prop default", def[1]);
  });
}

if (problems.length) {
  console.error(
    `\n${problems.length} hardcoded user-facing string${problems.length === 1 ? "" : "s"} in packages/ui/src.\n`,
  );
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}  ${p.what}  "${p.text}"`);
  }
  console.error(
    `\nAdd it to SmartaLabels in packages/ui/src/lib/labels.ts, give it an\n` +
      `English default, and read it with useLabels(). If it is the product's\n` +
      `copy rather than the library's, take it as a prop instead.\n`,
  );
  process.exit(1);
}

console.log(
  `No hardcoded user-facing strings in packages/ui/src. ` +
    `Every word the library says for itself is overridable.`,
);
