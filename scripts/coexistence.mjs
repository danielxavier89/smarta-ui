/**
 * Proves @smarta/ui can share a page with the CSS the products already run.
 *
 * The backoffice runs Ant Design 4 and Bootstrap together; the webapp is
 * moving from styled-components to Tailwind. Alisson's P0-2 was that this
 * library's stylesheet would break those pages, and he was right twice: first
 * through a global reset, then — after the reset was split out — through
 * Tailwind's own preflight still riding along in `@import "tailwindcss"`.
 * Neither was visible to any test, because no test rendered CSS.
 *
 * This one does, in a real browser, in both directions:
 *
 *   1. THE HOST IS UNTOUCHED. Every probe element on the host page — headings,
 *      paragraphs, lists, links, Bootstrap and Ant Design buttons, a table, an
 *      image, form controls, a Tailwind-styled paragraph, <html> itself —
 *      computes exactly the same styles with our stylesheet loaded as without.
 *
 *   2. WE ARE UNTOUCHED. Every element inside a ThemeProvider island computes
 *      exactly the same styles on that hostile page as it does on a page with
 *      nothing but our CSS. Bootstrap's reboot and Ant Design's globals are
 *      unlayered, and unlayered CSS beats anything in a cascade layer — so a
 *      library that ships everything in @layer loses every one of these
 *      fights without noticing.
 *
 *   3. NO CAPTURE. A host element INSIDE our island that carries the host's
 *      own Tailwind class keeps the host's value. Our utilities must not reach
 *      it just because it happens to sit inside one of our Panels.
 *
 * Both import orders are tested, because "it works if you import ours last" is
 * not a property a product can be relied on to keep.
 *
 * Components are rendered with React's server renderer from the BUILT package,
 * through its exports map — the same files a product would get.
 */
import http from "node:http";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";

const ROOT = process.cwd();
const require = createRequire(join(ROOT, "package.json"));
const WORK = resolve(ROOT, ".coexistence");
rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });
process.on("exit", () => rmSync(WORK, { recursive: true, force: true }));

const ui = await import("@smarta/ui");
const h = React.createElement;

/* ------------------------------------------------------------ stylesheets */

const css = {
  ours: readFileSync(require.resolve("@smarta/ui/styles.css"), "utf8"),
  antd: readFileSync(require.resolve("antd/dist/antd.css"), "utf8"),
  bootstrap: readFileSync(require.resolve("bootstrap/dist/css/bootstrap.css"), "utf8"),
  // A product's own Tailwind v4 build: preflight and utilities, both layered.
  tailwind: buildHostTailwind(),
  // A product's legacy Tailwind v3-style utilities: unlayered single classes,
  // which is what v3 emits and what a styled-components codebase looks like.
  legacy: `.text-base{font-size:16px;line-height:24px}.p-4{padding:16px}.rounded-md{border-radius:6px}.mt-2{margin-top:8px}`,
};

function buildHostTailwind() {
  const input = join(WORK, "host-in.css");
  const output = join(WORK, "host-out.css");
  writeFileSync(input, `@import "tailwindcss";\n@source inline("text-base p-4 rounded-md mt-2 bg-white");\n`);
  const pj = require.resolve("@tailwindcss/cli/package.json");
  const cli = resolve(dirname(pj), JSON.parse(readFileSync(pj, "utf8")).bin.tailwindcss);
  execFileSync(process.execPath, [cli, "-i", input, "-o", output], { cwd: ROOT, stdio: "ignore" });
  return readFileSync(output, "utf8");
}

/* ----------------------------------------------------------------- markup */

const HOST = `
<h1 id="h-h1">Host heading</h1>
<h3 id="h-h3">Host subheading</h3>
<p id="h-p">Host paragraph</p>
<ul id="h-ul"><li id="h-li">Host item</li></ul>
<a id="h-a" href="#x">Host link</a>
<button id="h-btn" class="btn btn-primary">Bootstrap</button>
<button id="h-antbtn" class="ant-btn ant-btn-primary">Ant Design</button>
<button id="h-plainbtn">Plain</button>
<table id="h-table" class="table"><tbody><tr><td id="h-td">Cell</td></tr></tbody></table>
<img id="h-img" alt="" width="10" height="10" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
<label id="h-label" for="h-input">Label</label><input id="h-input">
<p id="h-tw" class="text-base p-4 rounded-md">Tailwind paragraph</p>
<code id="h-code">code</code>
`;

const island = renderToStaticMarkup(
  h(ui.ThemeProvider, { product: "backoffice", theme: "light", id: "island" },
    h(ui.Card, null,
      h(ui.CardHeader, null, h(ui.CardTitle, null, "Staples Lisboa"), h(ui.CardDescription, null, "3 June 2026")),
      h(ui.CardBody, null,
        h("p", null, "A paragraph a component renders."),
        h(ui.KeyValue, { rows: [{ key: "Total", value: "86,40 €" }, { key: "VAT", value: "16,16 €" }] }),
      ),
      h(ui.CardFooter, null,
        h(ui.Button, { variant: "primary" }, "Upload it"),
        h(ui.Button, { variant: "secondary" }, "Ask Ana"),
      ),
    ),
    h(ui.Callout, { tone: "warn", title: "June is closed" }, h("p", null, "The period is read-only.")),
    h(ui.Input, { label: "Company name", hint: "As it appears on the statement." }),
    h(ui.Chip, { tone: "ok" }, "Matched"),
    h("a", { href: "#x", className: "smarta-link" }, "See the 12 charges"),
    h(ui.Table, null,
      h(ui.THead, null, h(ui.TR, null, h(ui.TH, null, "Supplier"), h(ui.TH, { align: "right" }, "Amount"))),
      h(ui.TBody, null, h(ui.TR, null, h(ui.TD, null, "Vodafone"), h(ui.TD, { numeric: true }, "39,90 €"))),
    ),
  ),
);

// A second island holding nothing but host content with the host's own class.
// Kept apart from the first so that the host's 16px — which is the CORRECT
// outcome — cannot move anything the island comparison measures.
const captiveIsland = renderToStaticMarkup(
  h(ui.ThemeProvider, { product: "backoffice", theme: "light", id: "island-capture" },
    h("p", { id: "captive", className: "text-base" }, "Host content inside a library panel"),
  ),
);

/**
 * The harness pins the island's container, identically on every page, with an
 * id selector no host rule outranks. Without it the bare page keeps the
 * browser's 8px body margin and the host pages zero it, and every width in the
 * island differs by 16px for reasons that have nothing to do with our CSS.
 */
const HARNESS = `<style>html,body{margin:0!important;padding:0!important}#mount#mount{display:block;width:900px;margin:0;padding:0;border:0}</style>`;

const page = (sheets) => `<!doctype html><html><head><meta charset="utf-8">
${HARNESS}
${sheets.map((s) => `<style>${css[s]}</style>`).join("\n")}
</head><body><main id="host">${HOST}</main><section id="mount">${island}</section><section>${captiveIsland}</section></body></html>`;

/* --------------------------------------------------------------- measure */

const PROPS = [
  "display", "position", "box-sizing", "vertical-align", "text-align",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border-top-width", "border-top-style", "border-top-color",
  "border-left-width", "border-left-style",
  "border-top-left-radius", "border-bottom-right-radius",
  "font-family", "font-size", "font-weight", "line-height", "letter-spacing",
  "color", "background-color", "list-style-type", "text-decoration-line",
  "box-shadow", "outline-style", "cursor", "width", "height", "color-scheme",
];

function measure(selectorList) {
  return (sel) => {
    const out = {};
    const els = sel === "ISLAND" ? [...document.querySelectorAll("#island, #island *")] : sel.map((s) => document.querySelector(s));
    els.forEach((el, i) => {
      if (!el) return;
      const cs = getComputedStyle(el);
      const key = el.id ? `#${el.id}` : `island[${i}] <${el.tagName.toLowerCase()}${el.getAttribute("class") ? ` .${el.getAttribute("class").split(/\s+/).slice(0, 2).join(".")}` : ""}>`;
      out[key] = Object.fromEntries(window.__PROPS.map((p) => [p, cs.getPropertyValue(p)]));
    });
    return out;
  };
}

const HOST_PROBES = ["html", "body", ...[...HOST.matchAll(/id="([^"]+)"/g)].map((m) => `#${m[1]}`)];

const server = http.createServer((req, res) => {
  const name = req.url.slice(1);
  res.setHeader("content-type", "text/html");
  res.end(pages[name] ?? "not found");
});
const pages = {
  "host-only": page(["antd", "bootstrap", "tailwind", "legacy"]),
  "host-then-ours": page(["antd", "bootstrap", "tailwind", "legacy", "ours"]),
  "ours-then-host": page(["ours", "antd", "bootstrap", "tailwind", "legacy"]),
  "ours-only": page(["ours"]),
};
await new Promise((ok) => server.listen(0, ok));
const port = server.address().port;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
await ctx.addInitScript((p) => { window.__PROPS = p; }, PROPS);

async function read(name, sel) {
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${port}/${name}`, { waitUntil: "load" });
  const fn = measure();
  const r = await pg.evaluate(fn, sel === "ISLAND" ? "ISLAND" : sel);
  await pg.close();
  return r;
}

/**
 * The focus ring, reached the way a keyboard user reaches it: by tabbing until
 * focus lands inside the island. A resting-state comparison cannot see a host
 * rule that only applies under :focus — Ant Design's `a:focus { outline: 0 }`
 * kind — and a focus ring that vanishes on one product is the most important
 * thing on this list to catch.
 */
const FOCUS_PROPS = ["outline-style", "outline-width", "outline-color", "outline-offset", "box-shadow"];
async function readFocus(name) {
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${port}/${name}`, { waitUntil: "load" });
  const seen = {};
  for (let i = 0; i < 60; i++) {
    await pg.keyboard.press("Tab");
    const r = await pg.evaluate((props) => {
      const el = document.activeElement;
      if (!el || !el.closest("#island")) return null;
      const cs = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const text = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || el.id || "").trim().slice(0, 30);
      return { key: `focus <${tag}> "${text}"`, styles: Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])) };
    }, FOCUS_PROPS);
    if (r && !seen[r.key]) seen[r.key] = r.styles;
  }
  await pg.close();
  return seen;
}

function diff(a, b) {
  const out = [];
  for (const k of Object.keys(a)) {
    for (const p of PROPS) {
      if (a[k]?.[p] !== b[k]?.[p]) out.push(`${k}  ${p}: ${a[k]?.[p]}  ->  ${b[k]?.[p]}`);
    }
  }
  return out;
}

const failures = [];

// 1. The host is untouched.
const hostBaseline = await read("host-only", HOST_PROBES);
for (const order of ["host-then-ours", "ours-then-host"]) {
  const d = diff(hostBaseline, await read(order, HOST_PROBES)).filter(
    // The host probes are measured, not the island, but the island's own
    // presence on the page is not under test here.
    (l) => !l.startsWith("body  height") && !l.startsWith("html  height"),
  );
  if (d.length) failures.push(`HOST CHANGED when @smarta/ui/styles.css is loaded (${order}):\n    ${d.join("\n    ")}`);
}

// 2. We are untouched.
const islandBaseline = await read("ours-only", "ISLAND");
for (const order of ["host-then-ours", "ours-then-host"]) {
  const got = await read(order, "ISLAND");
  const d = diff(islandBaseline, got);
  if (d.length) failures.push(`OUR COMPONENTS CHANGED on a page running Ant Design, Bootstrap and Tailwind (${order}):\n    ${d.slice(0, 40).join("\n    ")}${d.length > 40 ? `\n    ...and ${d.length - 40} more` : ""}`);

  // 3. No capture.
  const hostTw = (await read("host-only", ["#h-tw"]))["#h-tw"]["font-size"];
  const captive = (await read(order, ["#captive"]))["#captive"]?.["font-size"];
  if (captive !== hostTw) {
    failures.push(`CAPTURE (${order}): a host <p class="text-base"> inside our island computes font-size ${captive}, not the host's ${hostTw}. Our utilities are reaching host content.`);
  }
}

// 5. The README's override advice, as a test rather than a promise. A product
//    class that only ADDS a property applies as before; one that CHANGES a
//    property the component sets needs one more class, and with it, wins.
{
  const pg = await ctx.newPage();
  // The product's CSS goes in BEFORE ours: the hard case, and the one a
  // product cannot always control. Loaded after ours, even a single class
  // wins its tie with our single-class utilities.
  const productCss = `<style>.my-gap{margin-top:12px}.my-wide.my-wide{padding-left:24px}.my-wide-single{padding-left:24px}</style>`;
  const overridePage = page(["antd", "bootstrap", "ours"])
    .replace(HARNESS, HARNESS + productCss)
    .replace(
      "</body>",
      renderToStaticMarkup(
        h(ui.ThemeProvider, { product: "webapp" },
          h(ui.Button, { id: "ov-add", className: "my-gap" }, "Adds a margin"),
          h(ui.Button, { id: "ov-change", className: "my-wide" }, "Changes the padding"),
          h(ui.Button, { id: "ov-single", className: "my-wide-single" }, "One class only"),
        ),
      ) + `</body>`,
    );
  pages.override = overridePage;
  await pg.goto(`http://localhost:${port}/override`, { waitUntil: "load" });
  const got = await pg.evaluate(() => {
    const cs = (id) => getComputedStyle(document.getElementById(id));
    return {
      add: cs("ov-add").marginTop,
      change: cs("ov-change").paddingLeft,
      single: cs("ov-single").paddingLeft,
    };
  });
  await pg.close();
  if (got.add !== "12px") failures.push(`OVERRIDE: a product class adding margin-top did not apply (got ${got.add}).`);
  if (got.change !== "24px") failures.push(`OVERRIDE: a doubled product class did not override the component's padding (got ${got.change}).`);
  // Loaded before ours, a single class must lose its tie. If it ever wins, our
  // utilities have dropped below one class and the README's advice is wrong.
  if (got.single === "24px") {
    failures.push(
      `OVERRIDE: a single product class loaded BEFORE ours beat the component's padding (got ${got.single}). ` +
        `Our utilities should hold a tie they win on source order; the README's override advice no longer holds.`,
    );
  }
}

// 4. The focus ring survives the host.
const focusBaseline = await readFocus("ours-only");
if (Object.keys(focusBaseline).length === 0) {
  failures.push("FOCUS: tabbing never reached a control inside the island on the bare page, so nothing was compared.");
}
for (const order of ["host-then-ours", "ours-then-host"]) {
  const got = await readFocus(order);
  const d = [];
  for (const [k, styles] of Object.entries(focusBaseline)) {
    if (!got[k]) {
      d.push(`${k}  never received keyboard focus`);
      continue;
    }
    for (const p of FOCUS_PROPS) if (styles[p] !== got[k][p]) d.push(`${k}  ${p}: ${styles[p]}  ->  ${got[k][p]}`);
  }
  if (d.length) failures.push(`FOCUS RING CHANGED under host CSS (${order}):\n    ${d.join("\n    ")}`);
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`\ncoexistence: ${failures.length} failure${failures.length === 1 ? "" : "s"}\n\n${failures.join("\n\n")}\n`);
  process.exit(1);
}
console.log(
  `coexistence: the host page is untouched by our stylesheet, our components are untouched by Ant Design 4,\n` +
    `Bootstrap 5 and a host Tailwind, host content inside our island keeps its own classes, and the focus ring survives the host's :focus rules — in both import orders.`,
);
