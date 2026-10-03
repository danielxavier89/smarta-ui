/**
 * Generates packages/tokens/src/preflight.css: Tailwind's preflight, scoped to
 * the .smarta-ui root and placed on a deliberate rung of the specificity ladder.
 *
 *     node scripts/gen-preflight.mjs           write it
 *     node scripts/gen-preflight.mjs --check   fail if the committed file is stale
 *
 * Generated rather than hand-written because the hand-written version was
 * wrong. It reproduced "the parts the components rely on", and the components
 * relied on more than that: it left out preflight's `code { font-size: 1em }`,
 * and every inline code sample in Storybook rendered at the browser's
 * monospace size. A screenshot diff found it; nothing else could. Generating it
 * from Tailwind's own file means a Tailwind upgrade cannot leave it behind
 * either — `--check` runs in `npm run check` and fails if they drift.
 *
 * The ladder, and why each rung is where it is:
 *
 *   (0,0,1)-(0,0,2)  the host's element rules — Bootstrap's reboot, Ant Design's
 *                    globals: `h3 { font-size }`, `p { margin-bottom }`,
 *                    `ul ul { … }`. Unlayered, so they beat any @layer.
 *   (0,0,3)+         THIS FILE. Every selector is scoped under .smarta-ui and
 *                    carries three :not(sui-…) — each a type selector that can
 *                    never match, so each adds exactly one element's worth of
 *                    specificity and nothing else. Enough to beat the host's
 *                    element rules inside our island.
 *   (0,1,0)          a host CLASS — `.ant-btn`, a styled-components class. Beats
 *                    this file, deliberately: an Ant Design button a product
 *                    places inside one of our panels keeps looking like an Ant
 *                    Design button.
 *   (0,1,0)+         our sui: utilities. Beat this file, as they must, and tie
 *                    with a host class — so source order decides, and a
 *                    product's own stylesheet, loaded after ours, wins.
 *
 * Everything is wrapped in :where() so the scope itself adds nothing to the
 * count; only the bump does. That keeps the arithmetic above exact.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const postcss = require("postcss");
const parser = require("postcss-selector-parser");

const ROOT = process.cwd();
const OUT = join(ROOT, "packages/tokens/src/preflight.css");
const CHECK = process.argv.includes("--check");
const SOURCE = require.resolve("tailwindcss/preflight.css");
const VERSION = JSON.parse(readFileSync(require.resolve("tailwindcss/package.json"), "utf8")).version;

const SCOPE = ".smarta-ui";
const BUMP = ":not(sui-z):not(sui-y):not(sui-x)";

function scopeSelector(sel) {
  // The source lists selectors one per line, so the first node of each carries
  // a leading newline. Left in place it lands between the bump and a
  // pseudo-element — `X:not(…)\n::after` — and that newline is a descendant
  // combinator: "the ::after of any descendant", not "X's ::after".
  if (sel.first) sel.first.spaces.before = "";
  sel.spaces.before = "";
  sel.spaces.after = "";
  const text = sel.toString().trim();

  // The document's root rules belong to OUR root here, never to <html> —
  // setting font-size on <html> changes what a rem is for the entire page.
  if (text === "html" || text === ":host") return parser.string({ value: `:where(${SCOPE})${BUMP}` });
  if (text === "body") return null;

  const nodes = sel.nodes;
  const hasCombinator = nodes.some((n) => n.type === "combinator");

  // Find the last compound (after the last combinator) and the position of its
  // first pseudo-element, which must stay last in the compound.
  let lastCompoundStart = 0;
  nodes.forEach((n, i) => {
    if (n.type === "combinator") lastCompoundStart = i + 1;
  });
  let bumpAt = nodes.length;
  for (let i = lastCompoundStart; i < nodes.length; i++) {
    if (nodes[i].type === "pseudo" && nodes[i].value.startsWith("::")) {
      bumpAt = i;
      break;
    }
  }

  const before = nodes.slice(0, bumpAt).map(String).join("");
  const after = nodes.slice(bumpAt).map(String).join("");
  const bumped = `${before}${BUMP}${after}`.trim();

  // `*`, `::placeholder`, `[hidden]`, `:-moz-focusring` — a single compound
  // that names no element. It has to match the root as well as everything
  // under it, the way `*` matches <html> in the original.
  const namesAnElement = nodes.some((n) => n.type === "tag");
  if (!hasCombinator && !namesAnElement) {
    return parser.string({ value: `:where(${SCOPE}, ${SCOPE} *)${bumped.replace(/^\*/, "")}` });
  }

  return parser.string({ value: `:where(${SCOPE}) ${bumped}` });
}

const processor = parser((selectors) => {
  const out = [];
  selectors.each((sel) => {
    const s = scopeSelector(sel);
    // `html, :host` both map to the root; once is enough.
    if (s && !out.includes(s.toString())) out.push(s.toString());
  });
  selectors.removeAll();
  if (out.length) selectors.append(parser.string({ value: out.join(",\n") }));
});

const root = postcss.parse(readFileSync(SOURCE, "utf8"));
root.walkComments((c) => c.remove());
root.walkRules((rule) => {
  const next = processor.processSync(rule.selector).trim();
  if (!next) rule.remove();
  else rule.selector = next;
});
// An at-rule left empty by a removed `body` rule is noise.
root.walkAtRules((a) => {
  if (a.nodes && a.nodes.length === 0) a.remove();
});

const header = `/* ==========================================================================
   GENERATED by scripts/gen-preflight.mjs from tailwindcss@${VERSION}/preflight.css.
   Do not edit by hand: \`npm run gen:preflight\` rewrites it, and
   \`npm run check\` fails if it is stale.

   Tailwind's preflight, scoped to .smarta-ui and given a specificity of at
   least (0,0,3) — above a host's element rules, below any class. See the
   header of the generator for the full ladder and why each rung is there.
   Unlayered on purpose: a host's unlayered CSS beats any cascade layer.
   ========================================================================== */
`;
const output = header + "\n" + root.toString().replace(/\n{3,}/g, "\n\n").trim() + "\n";

if (CHECK) {
  if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== output) {
    console.error(
      `\npackages/tokens/src/preflight.css is stale against tailwindcss@${VERSION}.\n` +
        `Run \`npm run gen:preflight\` and commit the result.\n`,
    );
    process.exit(1);
  }
  console.log(`preflight.css matches tailwindcss@${VERSION}.`);
} else {
  writeFileSync(OUT, output);
  console.log(`wrote packages/tokens/src/preflight.css from tailwindcss@${VERSION}`);
}
