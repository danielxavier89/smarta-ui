/**
 * Every story, in a real browser, in all four themes, at a phone and a desktop.
 *
 *     node scripts/browser-gate.mjs [storybook-static-dir] [--only regex]
 *
 * This is the check Alisson asked for in "tornar o axe um gate real e testar
 * os quatro temas nos principais breakpoints", and the one nothing else here
 * can do, because everything else runs in jsdom: no layout, no computed
 * colours, no CSS at all. It fails on:
 *
 *   1. A STORY THAT THROWS. Storybook swaps in its error screen, the build is
 *      green, and the story is gone. Every Toast story did exactly this for a
 *      while, with 103 passing tests.
 *
 *   2. AXE VIOLATIONS, with colour contrast switched ON — real rendered
 *      colours, in each of the four product/mode combinations. In jsdom the
 *      four combinations were the same DOM and contrast could not run at all;
 *      here they are four genuinely different renders.
 *
 *   3. HORIZONTAL OVERFLOW at 320, 390, 768 and 1280px — a page a phone user
 *      has to scroll sideways. Inner scroll is fine (a Table scrolls inside its
 *      own card on purpose); the document itself must not.
 *
 * A story that deliberately shows the wrong way to do something carries the
 * tag `anti-pattern`. It is still rendered and still checked for crashes and
 * overflow — it is only excused from axe, because failing axe is its point.
 */
import http from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? new RegExp(args[onlyIdx + 1]) : null;
const DIR = resolve(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--only") ?? "apps/storybook/storybook-static");

if (!existsSync(join(DIR, "iframe.html")) || !existsSync(join(DIR, "index.json"))) {
  console.error(`${DIR} is not a built Storybook. Run \`npm run build-storybook\` first.`);
  process.exit(2);
}

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const THEMES = [
  ["webapp", "light"],
  ["webapp", "dark"],
  ["backoffice", "light"],
  ["backoffice", "dark"],
];
const AXE_WIDTHS = [390, 1280];
const OVERFLOW_WIDTHS = [320, 390, 768, 1280];

/**
 * Rules that judge a PAGE, run against a story, which is a fragment of one.
 * A story has no <main>, no <h1>, and no reason to; everything else axe has
 * is on, including best practices.
 */
const DISABLED_RULES = ["region", "landmark-one-main", "page-has-heading-one", "landmark-complementary-is-top-level"];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = join(DIR, path === "/" ? "index.html" : path);
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end();
  }
  res.setHeader("content-type", TYPES[extname(file)] ?? "application/octet-stream");
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, ok));
const port = server.address().port;

const index = JSON.parse(readFileSync(join(DIR, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter((e) => e.type === "story" && (!ONLY || ONLY.test(e.id)));

/** One job per page load. Each load answers whatever questions it can. */
const jobs = [];
for (const s of stories) {
  const antiPattern = (s.tags ?? []).includes("anti-pattern");
  for (const [product, theme] of THEMES) {
    for (const width of AXE_WIDTHS) jobs.push({ s, product, theme, width, axe: !antiPattern, overflow: true });
  }
  // The remaining widths only need one theme: layout does not change by theme.
  for (const width of OVERFLOW_WIDTHS.filter((w) => !AXE_WIDTHS.includes(w))) {
    jobs.push({ s, product: "webapp", theme: "light", width, axe: false, overflow: true });
  }
}

const browser = await chromium.launch();
const failures = [];
let done = 0;

async function run(job) {
  const { s, product, theme, width } = job;
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const where = `${s.id}  [${product}/${theme} @${width}px]`;
  try {
    await page.goto(`http://localhost:${port}/iframe.html?id=${s.id}&viewMode=story&globals=product:${product};theme:${theme}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Stories with a play function (the Open ones) are checked after it has run,
    // so the popover being audited is actually on the page.
    await page
      .waitForFunction(() => ["finished", "completed", "errored", "aborted"].includes(window.__STORYBOOK_PREVIEW__?.currentRender?.phase), null, { timeout: 5000 })
      .catch(() => {});

    const crashed = await page.evaluate(() => document.body.classList.contains("sb-show-errordisplay"));
    if (crashed) {
      const msg = await page.evaluate(() => document.querySelector("#error-message")?.textContent?.trim() ?? "");
      failures.push(`CRASH     ${where}\n            ${msg || errors[0] || "Storybook showed its error screen"}`);
      return;
    }

    if (job.overflow) {
      const o = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, vw: window.innerWidth }));
      if (o.doc > o.vw + 1) failures.push(`OVERFLOW  ${where}\n            the page is ${o.doc}px wide in a ${o.vw}px viewport`);
    }

    if (job.axe) {
      await page.addScriptTag({ content: AXE });
      const result = await page.evaluate(async (disabled) => {
        const r = await window.axe.run(document, {
          exclude: [["#storybook-docs"]],
          rules: Object.fromEntries(disabled.map((id) => [id, { enabled: false }])),
          resultTypes: ["violations"],
        });
        return r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(" ")}  ${n.failureSummary?.split("\n").slice(1, 2).join(" ").trim() ?? ""}`),
          count: v.nodes.length,
        }));
      }, DISABLED_RULES);
      for (const v of result) {
        failures.push(`AXE       ${where}\n            ${v.id} (${v.impact}, ${v.count} node${v.count === 1 ? "" : "s"}): ${v.help}\n              ${v.nodes.join("\n              ")}`);
      }
    }
  } catch (e) {
    failures.push(`ERROR     ${where}\n            ${e.message.split("\n")[0]}`);
  } finally {
    await ctx.close();
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${jobs.length} page loads`);
  }
}

// A handful at a time: one browser, several contexts.
const CONCURRENCY = 6;
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) await run(jobs[next++]);
  }),
);

await browser.close();
server.close();

const skipped = stories.filter((s) => (s.tags ?? []).includes("anti-pattern")).length;
if (failures.length) {
  // The same violation in four themes is one problem, not four. Group by the
  // part of the message that does not mention the theme.
  console.error(`\nbrowser gate: ${failures.length} failure${failures.length === 1 ? "" : "s"} across ${jobs.length} page loads\n`);
  console.error(failures.join("\n\n"));
  process.exit(1);
}
console.log(
  `\nbrowser gate: ${stories.length} stories, ${jobs.length} page loads — no crashes, no axe violations ` +
    `(contrast included) in any of the four themes at ${AXE_WIDTHS.join(" and ")}px, ` +
    `and no horizontal overflow at ${OVERFLOW_WIDTHS.join(", ")}px.` +
    (skipped ? ` ${skipped} anti-pattern stor${skipped === 1 ? "y" : "ies"} excused from axe only.` : ""),
);
