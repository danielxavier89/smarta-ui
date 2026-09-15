#!/usr/bin/env node
/**
 * Fails if a component contains a colour.
 *
 * This is the mechanism behind "components use tokens, never hardcoded values".
 * The moment a component contains #9B3F92 it belongs to the webapp in light
 * mode, and the library quietly becomes two libraries. Grep is the enforcement.
 *
 * Token files are exempt — defining the colours is their job.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// .pathname is percent-encoded; this repo lives under a path with spaces.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN = join(ROOT, "packages/ui/src");

const RULES = [
  { name: "hex colour", re: /#[0-9a-fA-F]{3,8}\b/g },
  { name: "rgb()/rgba()", re: /\brgba?\s*\(/g },
  { name: "hsl()/hsla()", re: /\bhsla?\s*\(/g },
  { name: "named CSS colour", re: /\b(?:bg|text|border|fill|stroke|ring|shadow)-(?:red|blue|green|gray|grey|slate|zinc|neutral|stone|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|orange)-\d{2,3}\b/g },
  { name: "raw white/black utility", re: /\b(?:bg|border|ring)-(?:white|black)\b/g },
  { name: "primitive token in a component", re: /var\(--p-[a-z]+-\d+\)/g },
];

// Places a literal would be legitimate, each needing a stated reason.
// Currently empty, and worth keeping that way.
const ALLOW = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let failures = 0;
for (const file of walk(SCAN)) {
  if (!/\.(tsx?|css)$/.test(file)) continue;
  if (/\.stories\.tsx$/.test(file)) continue;   // stories may show a literal to make a point
  if (/foundations\//.test(file)) continue;

  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    if (ALLOW.some((a) => a.test(line))) return;
    for (const { name, re } of RULES) {
      re.lastIndex = 0;
      const m = re.exec(line);
      if (m) {
        failures++;
        console.log(
          `${relative(ROOT, file)}:${i + 1}  ${name}: ${m[0]}\n    ${line.trim()}`,
        );
      }
    }
  });
}

if (failures) {
  console.log(`\n${failures} hardcoded value(s). Use a semantic token — see packages/tokens/src/theme.css.`);
  process.exit(1);
}
console.log("No hardcoded colours in packages/ui/src. Every component is themeable.");
