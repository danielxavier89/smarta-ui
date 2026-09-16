#!/usr/bin/env node
/**
 * Generates docs/inventory.md: every component and every semantic token, on one
 * page.
 *
 * Generated rather than written, because an inventory that is maintained by
 * hand is an inventory that is wrong within a month — and the whole point is
 * that an agent can survey what exists before inventing something that already
 * does. Run it from `npm run check`.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const COMPONENTS = join(ROOT, "packages/ui/src/components");
const OUT = join(ROOT, "packages/ui/docs/inventory.md");

// ---- components, from each folder's .md frontmatter and summary line --------
const rows = [];
for (const name of readdirSync(COMPONENTS)) {
  const dir = join(COMPONENTS, name);
  if (!statSync(dir).isDirectory()) continue;
  let md;
  try {
    md = readFileSync(join(dir, `${name}.md`), "utf8");
  } catch {
    rows.push({ name, category: "—", summary: "(no .md yet)", exports: [] });
    continue;
  }
  const category = /^category:\s*(.+)$/m.exec(md)?.[1]?.trim() ?? "—";
  // The first prose line after the H1 is the component's one-line summary.
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, "");
  const summary =
    body
      .split("\n")
      .slice(1)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#") && !l.startsWith(">")) ?? "—";

  const index = readFileSync(join(dir, "index.ts"), "utf8");
  const exports = [...index.matchAll(/(?:^|[{,]\s*)([A-Z]\w+)/g)]
    .map((m) => m[1])
    .filter((n) => n !== "Meta");

  rows.push({ name, category, summary, exports: [...new Set(exports)] });
}

const order = ["Actions", "Form", "Status", "Containers", "Navigation", "Overlays", "Foundations", "—"];
rows.sort(
  (a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name),
);

// ---- tokens, from the typed metadata the Storybook sheet also renders -------
const tokensSrc = readFileSync(join(ROOT, "packages/tokens/src/index.ts"), "utf8");
function readGroups(constName) {
  const start = tokensSrc.indexOf(`export const ${constName}`);
  const end = tokensSrc.indexOf("export const", start + 10);
  const chunk = tokensSrc.slice(start, end === -1 ? undefined : end);
  const groups = [];
  for (const g of chunk.matchAll(/title:\s*"([^"]+)"([\s\S]*?)(?=\n  \{\s*\n    title:|\n\];)/g)) {
    const tokens = [...g[2].matchAll(/\{ name: "([^"]+)", utility: "([^"]+)", use: "([^"]+)" \}/g)]
      .map((m) => ({ name: m[1], utility: m[2], use: m[3] }));
    groups.push({ title: g[1], tokens });
  }
  return groups;
}

const colour = readGroups("COLOR_TOKENS");
const scales = readGroups("SCALE_TOKENS");

// ---- write -----------------------------------------------------------------
const lines = [];
lines.push("---");
lines.push("kind: inventory");
lines.push("generated: true");
lines.push("source: npm run gen:inventory");
lines.push("load: before choosing a component or a token");
lines.push("---");
lines.push("");
lines.push("# Inventory");
lines.push("");
lines.push("**Generated — do not edit.** Run `npm run gen:inventory` after adding a component or a token.");
lines.push("");
lines.push(
  "Everything that exists, on one page, so nothing gets rebuilt that is already here. " +
    "If what you need is not in these tables, say so rather than inventing a component — " +
    "adding one is a decision for the design system, not for the screen you happen to be on.",
);
lines.push("");
lines.push(`## Components (${rows.length})`);
lines.push("");
let current = null;
for (const r of rows) {
  if (r.category !== current) {
    current = r.category;
    lines.push("");
    lines.push(`### ${current}`);
    lines.push("");
    lines.push("| Component | What it is | Exports |");
    lines.push("|---|---|---|");
  }
  lines.push(`| \`${r.name}\` | ${r.summary} | ${r.exports.map((e) => `\`${e}\``).join(", ")} |`);
}

lines.push("");
lines.push("## Semantic colour tokens");
lines.push("");
lines.push("The only colours a component may read. Anything not listed here does not exist.");
for (const g of colour) {
  lines.push("");
  lines.push(`### ${g.title}`);
  lines.push("");
  lines.push("| Token | Utility | Use |");
  lines.push("|---|---|---|");
  for (const t of g.tokens) lines.push(`| \`--${t.name}\` | \`bg-${t.utility}\` | ${t.use} |`);
}

lines.push("");
lines.push("## Scale tokens");
for (const g of scales) {
  lines.push("");
  lines.push(`### ${g.title}`);
  lines.push("");
  lines.push("| Token | Utility | Use |");
  lines.push("|---|---|---|");
  for (const t of g.tokens) lines.push(`| \`--${t.name}\` | \`${t.utility}\` | ${t.use} |`);
}
lines.push("");

writeFileSync(OUT, lines.join("\n"));
console.log(
  `inventory.md: ${rows.length} components, ` +
    `${colour.reduce((n, g) => n + g.tokens.length, 0)} colour tokens, ` +
    `${scales.reduce((n, g) => n + g.tokens.length, 0)} scale tokens`,
);
