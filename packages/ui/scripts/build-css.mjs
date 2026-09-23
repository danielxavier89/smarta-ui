/**
 * Compiles the two stylesheets the library ships.
 *
 *   dist/styles.css   tokens + every utility the components actually use
 *   dist/reset.css    the opt-in page reset, on its own
 *
 * Why the reset is copied rather than compiled: it contains no utilities, only
 * plain rules inside `@layer base`. Running it through Tailwind would emit a
 * second copy of the layer declaration and of every utility, and a product
 * importing both files would get the whole library's CSS twice.
 *
 * The order a product imports them in matters and is documented in the README:
 * styles.css first, because that is what declares the layer order the reset's
 * `@layer base` block joins.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, "..");
const dist = resolve(pkg, "dist");
const tokens = resolve(pkg, "../tokens");

mkdirSync(dist, { recursive: true });

// Resolved through Node rather than taken off PATH: npm only reliably exposes a
// workspace's own node_modules/.bin, this repository's checkout path contains
// spaces, and in a workspace the CLI is hoisted to the root anyway.
// Via package.json and the `bin` field, because the CLI's own dist path is not
// listed in its `exports` and so cannot be resolved directly.
const require = createRequire(import.meta.url);
const cliPkgPath = require.resolve("@tailwindcss/cli/package.json");
const cliPkg = JSON.parse(readFileSync(cliPkgPath, "utf8"));
const tailwindCli = resolve(dirname(cliPkgPath), cliPkg.bin.tailwindcss);

// Tailwind scans the `@source` directories declared in src/styles.css, which is
// what makes the utilities the components use survive into the build.
execFileSync(
  process.execPath,
  [
    tailwindCli,
    "--input",
    resolve(pkg, "src/styles.css"),
    "--output",
    resolve(dist, "styles.css"),
  ],
  { cwd: pkg, stdio: "inherit" },
);

/**
 * reset.css is assembled rather than copied, because it opens with
 * `@import "tailwindcss/preflight.css"` and a browser cannot resolve a bare
 * specifier. Inlining the file is the whole job — there are no utilities in it
 * to compile, and running it through Tailwind would emit a second copy of every
 * utility in the library, which a product importing both files would download
 * twice.
 */
{
  const preflight = readFileSync(
    require.resolve("tailwindcss/preflight.css"),
    "utf8",
  );
  const src = readFileSync(resolve(tokens, "src/reset.css"), "utf8");
  const inlined = src.replace(
    /@import "tailwindcss\/preflight\.css" layer\(base\);/,
    `@layer base {\n${preflight}\n}`,
  );
  if (inlined === src) {
    console.error("\nbuild:css could not inline Tailwind's preflight into reset.css.\n");
    process.exit(1);
  }
  writeFileSync(resolve(dist, "reset.css"), inlined);
}

// A stylesheet that compiled to almost nothing is the failure this library has
// already had once: Tailwind skips node_modules, the `@source` lines went
// missing, and every component rendered unstyled with a green build. Assert a
// floor rather than trust the exit code.
const css = readFileSync(resolve(dist, "styles.css"), "utf8");
const bytes = statSync(resolve(dist, "styles.css")).size;
const MIN_BYTES = 20_000;
const mustContain = [
  "--canvas",        // a token made it through
  "data-product",    // the scoped ground rule survived
  "prefers-reduced-motion",
];

const missing = mustContain.filter((s) => !css.includes(s));
if (bytes < MIN_BYTES || missing.length) {
  console.error(
    `\nbuild:css produced a stylesheet that cannot be right.\n` +
      `  size: ${bytes} bytes (floor ${MIN_BYTES})\n` +
      (missing.length ? `  missing: ${missing.join(", ")}\n` : "") +
      `\nThe usual cause is the @source lines in src/styles.css.\n`,
  );
  process.exit(1);
}

/**
 * Nothing in styles.css may reach past [data-product].
 *
 * This shipped once, and the README claimed the opposite in writing. The
 * hand-written reset had been split out correctly, but `@import "tailwindcss"`
 * was still pulling in Tailwind's preflight — about 150 lines of unscoped
 * element selectors that restyle every heading, list, image, form control and
 * table on the host page. It is the most destructive thing this stylesheet
 * could do to the backoffice, and reading the source told you nothing: the
 * damage existed only in the compiled output.
 *
 * So the check is on the compiled output. A bare element selector, a `:root`
 * arm, a global `*`, or `color-scheme` anywhere now fails the build.
 */
/**
 * True when a block contains anything other than custom-property declarations.
 *
 * The distinction the whole guard turns on: declaring `--foo: 1px` on :root or
 * on `*` renders nothing, and the components read it from inside their own
 * subtree. Setting `margin`, `background` or `color-scheme` there restyles
 * somebody else's page.
 */
function declarationsPaint(block) {
  return block
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .some((d) => !d.startsWith("--"));
}

const ELEMENTS =
  "html|body|h[1-6]|p|a|ul|ol|li|menu|table|img|svg|button|input|select|textarea|" +
  "fieldset|legend|figure|blockquote|hr|pre|code|dialog|summary|details";

const SCOPE_RULES = [
  { re: new RegExp(`^\\s{0,4}(?:${ELEMENTS})\\b[^{;@]*\\{`, "gm"), what: "an unscoped element selector" },
  {
    re: /^\s{0,4}\*\s*[,{]/gm,
    what: "a global * selector that paints something",
    // Same test as :root, and it exists for Tailwind's own `@property`
    // polyfill: `*, ::before, ::after { --tw-translate-x: 0; ... }` inside
    // `@layer properties`. Declaring --tw-* on every element changes nothing
    // about how the host page looks. Setting `margin` there very much would.
    only: (block) => declarationsPaint(block),
  },
  {
    re: /^\s{0,4}:root\b[^{]*\{/gm,
    what: "a :root rule that paints something",
    // A :root block of nothing but custom properties is allowed. Declaring a
    // token there is inert — it renders nothing, and the components read it
    // from inside [data-product] where it inherits. Painting there is not: a
    // `background`, a `font-family` or a `color-scheme` on :root is the host's
    // document being restyled by an import.
    //
    // The residual cost of the tokens themselves is a name collision with a
    // host design system that happens to use the same names. That is real but
    // recoverable, and is called out in the README; forcing every token under
    // [data-product] would break the `var()` references in theme.css, which
    // resolve where they are declared.
    only: (block) => declarationsPaint(block),
  },
  // The declaration, not the media feature. `color-scheme: dark` inside
  // [data-product] is correct and wanted — it is how the browser paints the
  // scrollbars and native controls of OUR subtree. On :root it is a defect.
  { re: /(?<!prefers-)color-scheme\s*:/g, what: "color-scheme outside [data-product]" },
];

const lines = css.split("\n");

/**
 * The selector that opens the rule a line sits in.
 *
 * A declaration is on its own line, so checking that line for [data-product]
 * says nothing. Walk back to the nearest line that opens a block and read that.
 */
function enclosingSelector(lineNo) {
  for (let i = lineNo - 1; i >= 0; i--) {
    const l = lines[i];
    if (!l.includes("{")) continue;
    // Gather the whole selector list, which may span several lines.
    let sel = l;
    for (let j = i - 1; j >= 0 && /,\s*$/.test(lines[j]); j--) sel = lines[j] + " " + sel;
    return sel;
  }
  return "";
}

/** The declarations between a rule's opening brace and its closing one. */
function blockAt(index) {
  const open = css.indexOf("{", index);
  if (open === -1) return "";
  const close = css.indexOf("}", open);
  return close === -1 ? "" : css.slice(open + 1, close);
}

const leaks = [];
for (const { re, what, only } of SCOPE_RULES) {
  for (const m of css.matchAll(re)) {
    const lineNo = css.slice(0, m.index).split("\n").length;
    const line = lines[lineNo - 1] ?? "";
    // The scoped form is the whole point, and is fine.
    if (line.includes("[data-product")) continue;
    if (enclosingSelector(lineNo).includes("[data-product")) continue;
    if (only && !only(blockAt(m.index))) continue;
    leaks.push(`  dist/styles.css:${lineNo}  ${what}\n      ${line.trim().slice(0, 90)}`);
  }
}

if (leaks.length) {
  console.error(
    "\nbuild:css produced a stylesheet that reaches past the library.\n\n" +
      leaks.slice(0, 20).join("\n") +
      (leaks.length > 20 ? `\n  ...and ${leaks.length - 20} more\n` : "\n") +
      "\nstyles.css must not restyle the host page: the backoffice runs Ant Design,\n" +
      "Bootstrap and styled-components on the same screens. Anything document-wide\n" +
      "belongs in reset.css, which a product opts into.\n\n" +
      "If this appeared without you touching a selector, check that src/styles.css\n" +
      "still imports Tailwind in pieces. Plain `@import \"tailwindcss\"` silently\n" +
      "re-adds preflight.\n",
  );
  process.exit(1);
}

console.log(
  `build:css  dist/styles.css ${(bytes / 1024).toFixed(1)} kB (nothing unscoped), ` +
    `dist/reset.css assembled with preflight inlined`,
);
