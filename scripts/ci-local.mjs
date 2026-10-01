/**
 * Runs the CI sequence locally, in order, and stops at the first failure.
 *
 *     node scripts/ci-local.mjs
 *
 * The same list as .github/workflows/ci.yml, so "it passes here" means what it
 * says. Each step's output is shown only if it fails.
 */
import { spawnSync } from "node:child_process";

const STEPS = [
  ["check", ["run", "check"]],
  ["build", ["run", "build"]],
  ["test", ["test"]],
  ["consumer", ["run", "test:consumer"]],
  ["coexistence", ["run", "test:coexistence"]],
  ["browser gate", ["run", "test:browser"]],
  ["storybook", ["run", "build-storybook"]],
];

const npm = process.env.npm_execpath;
const only = process.argv.slice(2);
for (const [name, args] of STEPS) {
  if (only.length && !only.includes(name)) continue;
  const t = Date.now();
  const r = npm
    ? spawnSync(process.execPath, [npm, ...args], { encoding: "utf8" })
    : spawnSync("npm", args, { encoding: "utf8", shell: true });
  const secs = ((Date.now() - t) / 1000).toFixed(0).padStart(4);
  if (r.status !== 0) {
    console.log(`  FAIL ${secs}s  ${name}\n`);
    console.log((r.stdout + r.stderr).split("\n").slice(-60).join("\n"));
    process.exit(1);
  }
  console.log(`  pass ${secs}s  ${name}`);
}
console.log("\nThe CI sequence passes locally.");
