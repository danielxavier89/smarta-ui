#!/usr/bin/env node
/**
 * Checks every semantic text/background pair against WCAG AA (4.5:1), in all
 * four combinations of product and mode.
 *
 * Worth having as a script rather than a one-off: the dark palettes were
 * invented for this library, and two real defects turned up the first time it
 * ran — the backoffice's quiet grey at 4.0:1 on canvas, and white on the
 * webapp's dark accent at 4.35:1. Neither is visible by eye.
 *
 * It reads the token source, not the build, so it runs without one.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "packages/tokens/src");

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
// Top-level rules only: the @media fallback duplicates the explicit dark blocks
// by design, and is compared against them separately below.
const withoutMedia = (s) => s.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\}\s*)*\}/g, "");

function rules(css) {
  const out = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = m[2];
    if (!body.includes("--")) continue;
    for (const sel of m[1].split(",").map((s) => s.trim())) {
      out[sel] ??= {};
      for (const d of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) out[sel][d[1]] = d[2].trim();
    }
  }
  return out;
}

const source = withoutMedia(strip(
  ["primitives.css", "semantic.css"].map((f) => readFileSync(join(SRC, f), "utf8")).join("\n"),
));
const R = rules(source);
const merge = (...sels) => Object.assign({}, ...sels.map((s) => R[s] ?? {}));

const SCOPES = {
  "webapp light":     merge(":root", '[data-product="webapp"]'),
  "webapp dark":      merge(":root", '[data-product="webapp"]', '[data-product="webapp"][data-theme="dark"]'),
  "backoffice light": merge(":root", '[data-product="backoffice"]'),
  "backoffice dark":  merge(":root", '[data-product="backoffice"]', '[data-product="backoffice"][data-theme="dark"]'),
};

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const norm = (h) => (h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h);

function resolve(name, scope, depth = 0) {
  const v = scope[name];
  if (!v || depth > 10) return null;
  const m = /^var\((--[\w-]+)\)$/.exec(v);
  if (m) return resolve(m[1], scope, depth + 1);
  return HEX.test(v) ? norm(v).toLowerCase() : null;
}

const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// Every pair where one token is read as text on the other.
const PAIRS = [
  ["fg", "canvas"], ["fg", "surface"], ["fg", "surface-raised"], ["fg", "surface-sunken"], ["fg", "surface-hover"],
  ["fg-muted", "canvas"], ["fg-muted", "surface"], ["fg-subtle", "canvas"], ["fg-subtle", "surface"],
  ["accent-fg", "accent"], ["accent-fg", "accent-hover"],
  ["link", "canvas"], ["link", "surface"], ["link-hover", "canvas"],
  ["ok-fg", "ok-bg"], ["warn-fg", "warn-bg"], ["bad-fg", "bad-bg"], ["info-fg", "info-bg"],
  ["neutral-fg", "neutral-bg"], ["accent-soft-fg", "accent-soft"], ["selected-fg", "selected-bg"],
  ["inverse-fg", "inverse-surface"],
  ["on-status", "bad"], ["on-status", "ok"], ["on-status", "warn"], ["on-status", "info"],
];

const MIN = 4.5;
let checked = 0;
const low = [], unresolved = [];

for (const [scopeName, scope] of Object.entries(SCOPES)) {
  for (const [fg, bg] of PAIRS) {
    const f = resolve(`--${fg}`, scope), g = resolve(`--${bg}`, scope);
    if (!f || !g) { unresolved.push(`${scopeName}: --${fg} / --${bg}`); continue; }
    checked++;
    const r = ratio(f, g);
    if (r < MIN) low.push(`${scopeName}: --${fg} (${f}) on --${bg} (${g}) = ${r.toFixed(2)}:1`);
  }
}

console.log(`Checked ${checked} text/background pairs across ${Object.keys(SCOPES).length} themes.`);
if (unresolved.length) {
  console.log(`\n${unresolved.length} pair(s) did not resolve to a colour:`);
  unresolved.forEach((u) => console.log("  " + u));
}
if (low.length) {
  console.log(`\n${low.length} pair(s) below ${MIN}:1:`);
  low.forEach((l) => console.log("  " + l));
  process.exit(1);
}
if (unresolved.length) process.exit(1);

// ---------------------------------------------------------------------------
// Drift check.
//
// The prefers-color-scheme fallback repeats the explicit [data-theme="dark"]
// values, because CSS cannot express "this media query OR this attribute" in
// one place. Duplication nobody checks is duplication that diverges, so it is
// checked here — a token that changes in one block and not the other is a theme
// that is wrong only for users who never touched the toggle, which is the kind
// of bug that survives a long time.
//
// It compares EFFECTIVE scopes (light block + override), not raw declarations,
// so a token the fallback legitimately omits because it does not change between
// light and dark is not a false positive.
// ---------------------------------------------------------------------------
const full = strip(readFileSync(join(SRC, "semantic.css"), "utf8"));
const mediaBody = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*)\}\s*$/.exec(full);
const mediaRules = mediaBody ? rules(mediaBody[1]) : {};

const PARITY = [
  {
    product: "webapp",
    light: '[data-product="webapp"]',
    explicitDark: '[data-product="webapp"][data-theme="dark"]',
    systemDark: '[data-product="webapp"]:not([data-theme="light"])',
  },
  {
    product: "backoffice",
    light: '[data-product="backoffice"]',
    explicitDark: '[data-product="backoffice"][data-theme="dark"]',
    systemDark: '[data-product="backoffice"]:not([data-theme="light"])',
  },
];

const drift = [];
for (const { product, light, explicitDark, systemDark } of PARITY) {
  const base = Object.assign({}, R[":root"] ?? {}, R[light] ?? {});
  const withToggle = Object.assign({}, base, R[explicitDark] ?? {});
  const withSystem = Object.assign({}, base, mediaRules[systemDark] ?? {});

  for (const key of new Set([...Object.keys(withToggle), ...Object.keys(withSystem)])) {
    if (key === "color-scheme") continue;
    const a = resolve(key, withToggle) ?? withToggle[key];
    const b = resolve(key, withSystem) ?? withSystem[key];
    if (a !== b) {
      drift.push(`${product}: ${key} is "${a}" with data-theme="dark" but "${b}" on a system-dark screen`);
    }
  }
}

if (drift.length) {
  console.log(`\n${drift.length} drift(s) between the explicit dark blocks and the prefers-color-scheme fallback:`);
  drift.forEach((d) => console.log("  " + d));
  process.exit(1);
}

console.log(`Every pair clears ${MIN}:1 in webapp and backoffice, light and dark.`);
console.log("The prefers-color-scheme fallback matches the explicit dark blocks.");
