/**
 * Screenshots every story in two Storybook builds, in all four product/mode
 * combinations, and reports where they differ.
 *
 *     node scripts/visual-diff.mjs <baseline-static-dir> <candidate-static-dir> [--out dir]
 *
 * Why this exists: the unit tests run in jsdom with no CSS at all, so a change
 * that breaks how something LOOKS passes every one of them. That is not
 * hypothetical. Moving the tokens off :root left the @theme shadow scale —
 * declared on :root, and built from --focus-halo and --shadow-color — resolving
 * against variables that were no longer there. Every focus halo in the library
 * disappeared with 103 green tests.
 *
 * It is a local tool rather than a CI gate. Screenshots differ by a pixel
 * between machines and font rasterisers, and a gate that fails on that gets
 * ignored. The deterministic checks — axe including contrast, horizontal
 * overflow — run in CI through scripts/browser-gate.mjs. This one is for the
 * moment a change is supposed to be visually invisible and you need to know
 * that it was.
 */
import http from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = resolve(outIdx >= 0 ? args[outIdx + 1] : ".visual-diff");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? new RegExp(args[onlyIdx + 1]) : null;
const [A, B] = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--out" && args[i - 1] !== "--only").map((p) => resolve(p));

if (!A || !B) {
  console.error("usage: node scripts/visual-diff.mjs <baseline-dir> <candidate-dir> [--out dir] [--only regex]");
  process.exit(2);
}

for (const dir of [A, B]) {
  // The static server falls back to index.html, so a missing iframe.html
  // silently screenshots the Storybook manager instead of a story — which is
  // how a failed build once looked like "every story changed by 99%".
  if (!existsSync(join(dir, "iframe.html")) || !existsSync(join(dir, "index.json"))) {
    console.error(`${dir} is not a complete Storybook build (no iframe.html or index.json).`);
    process.exit(2);
  }
}

const THEMES = [
  ["webapp", "light"],
  ["webapp", "dark"],
  ["backoffice", "light"],
  ["backoffice", "dark"],
];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };

function serve(dir) {
  return new Promise((ok) => {
    const server = http.createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = join(dir, path === "/" ? "index.html" : path);
      if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, "index.html");
      res.setHeader("content-type", TYPES[extname(file)] ?? "application/octet-stream");
      createReadStream(file).pipe(res);
    });
    server.listen(0, () => ok(server));
  });
}

function stories(dir) {
  const idx = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
  return Object.values(idx.entries).filter((e) => e.type === "story").map((e) => e.id);
}

/** Everything that moves is stopped, so two runs of the same build agree. */
const FREEZE = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`;

async function shoot(page, port, id, product, theme) {
  const url = `http://localhost:${port}/iframe.html?id=${id}&viewMode=story&globals=product:${product};theme:${theme}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(80);
  // Storybook swaps in its own error screen when a story throws. That is a
  // broken story, not a visual change, and is reported as one.
  const crashed = await page.evaluate(() => document.body.classList.contains("sb-show-errordisplay"));
  const png = await page.screenshot({ fullPage: true });
  return { png, crashed };
}

function compare(bufA, bufB) {
  const a = PNG.sync.read(bufA);
  const b = PNG.sync.read(bufB);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const p = new PNG({ width, height });
    p.data.fill(255);
    PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0);
    return p;
  };
  const pa = pad(a);
  const pb = pad(b);
  const diff = new PNG({ width, height });
  const n = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.1 });
  return { ratio: n / (width * height), pixels: n, diff: PNG.sync.write(diff), sizeChanged: a.width !== b.width || a.height !== b.height };
}

const [sa, sb] = await Promise.all([serve(A), serve(B)]);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const pa = await ctx.newPage();
const pb = await ctx.newPage();

const idsA = new Set(stories(A));
const idsB = new Set(stories(B));
const common = [...idsA].filter((id) => idsB.has(id) && (!ONLY || ONLY.test(id)));
const added = [...idsB].filter((id) => !idsA.has(id));
const removed = [...idsA].filter((id) => !idsB.has(id));

mkdirSync(OUT, { recursive: true });
const changed = [];
const crashes = [];
let done = 0;
for (const id of common) {
  for (const [product, theme] of THEMES) {
    const [sa_, sb_] = await Promise.all([
      shoot(pa, sa.address().port, id, product, theme),
      shoot(pb, sb.address().port, id, product, theme),
    ]);
    if (sa_.crashed) crashes.push(`baseline  ${id} (${product}/${theme})`);
    if (sb_.crashed) crashes.push(`candidate ${id} (${product}/${theme})`);
    const ia = sa_.png;
    const ib = sb_.png;
    const r = compare(ia, ib);
    if (r.pixels > 0) {
      const name = `${id}--${product}-${theme}`;
      writeFileSync(join(OUT, `${name}.a.png`), ia);
      writeFileSync(join(OUT, `${name}.b.png`), ib);
      writeFileSync(join(OUT, `${name}.diff.png`), r.diff);
      changed.push({ name, ...r });
    }
  }
  done++;
  if (done % 20 === 0) console.log(`  ${done}/${common.length} stories`);
}

await browser.close();
sa.close();
sb.close();

changed.sort((x, y) => y.ratio - x.ratio);
const report = { compared: common.length * THEMES.length, crashes, changed: changed.map(({ diff, ...c }) => c), added, removed };
writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));

if (crashes.length) {
  console.log(`\n${crashes.length} story renders THREW:\n  ${crashes.join("\n  ")}`);
}
console.log(`\n${common.length} stories x 4 themes compared. ${changed.length} screenshots differ.`);
for (const c of changed.slice(0, 60)) {
  console.log(`  ${(c.ratio * 100).toFixed(3).padStart(8)}%  ${c.pixels.toString().padStart(7)}px  ${c.sizeChanged ? "[size] " : ""}${c.name}`);
}
if (added.length) console.log(`\nOnly in candidate: ${added.length}\n  ${added.join("\n  ")}`);
if (removed.length) console.log(`\nOnly in baseline: ${removed.length}\n  ${removed.join("\n  ")}`);
console.log(`\nImages and report.json in ${OUT}`);
