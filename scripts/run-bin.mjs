/**
 * Runs a dependency's CLI by resolving it, rather than hoping PATH is right.
 *
 *     node ../../scripts/run-bin.mjs storybook build
 *
 * Two things go wrong with the PATH npm builds for a workspace script, and the
 * second is genuinely dangerous:
 *
 * 1. This repository lives under an iCloud Drive path with spaces and tildes in
 *    it ("Mobile Documents/com~apple~CloudDocs/AI Projects"). The shell npm
 *    spawns finds nothing on those entries, so a plain `vitest` is "command not
 *    found" even though the symlink is there and works when invoked directly.
 *
 * 2. npm puts EVERY ancestor's node_modules/.bin on PATH, not just this
 *    project's. When the checkout is a git worktree nested inside the main one
 *    — .claude/worktrees/<name> — the parent checkout's node_modules is an
 *    ancestor. `storybook` resolved to the parent repository's copy and ran
 *    against this worktree's sources with the parent's dependency tree, failing
 *    on a module installed here and not there. A build that silently uses
 *    another checkout's dependencies is worse than one that fails, because it
 *    can also pass.
 *
 * Resolving from this package's own tree removes both. It is the same thing
 * build-css.mjs does for Tailwind.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const [name, ...args] = process.argv.slice(2);
if (!name) {
  console.error("usage: node ./scripts/run-bin.mjs <package> [args...]");
  process.exit(2);
}

const require = createRequire(import.meta.url);
const pkgJsonPath = require.resolve(`${name}/package.json`);
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

// `bin` is either a string (the package's own name) or a map of names to paths.
const binField = pkg.bin;
const relative = typeof binField === "string" ? binField : binField?.[name];
if (!relative) {
  console.error(`${name} declares no bin entry called "${name}"`);
  process.exit(2);
}

const bin = resolve(dirname(pkgJsonPath), relative);

try {
  execFileSync(process.execPath, [bin, ...args], { stdio: "inherit" });
} catch (err) {
  process.exit(typeof err.status === "number" ? err.status : 1);
}
