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
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
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

copyFileSync(resolve(tokens, "src/reset.css"), resolve(dist, "reset.css"));

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

console.log(`build:css  dist/styles.css ${(bytes / 1024).toFixed(1)} kB, dist/reset.css copied`);
