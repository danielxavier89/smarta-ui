/**
 * No component says an English word on its own behalf.
 *
 * The sibling of lint-tokens.mjs, and the same argument. A hardcoded colour
 * makes a component belong to one product; a hardcoded string makes it belong
 * to one language. The backoffice is German, the webapp is German and English,
 * and an accessible name is the worst place to hide one — it is invisible on
 * screen and read aloud to the one user who cannot work around it.
 *
 * Everything the library has to say for itself lives in lib/labels.ts and is
 * reached with useLabels(). This fails the build if one creeps back.
 *
 * ---
 *
 * This walks TypeScript's AST rather than matching lines, because the first
 * version of this file matched lines and an adversarial review got 8 of 9
 * planted regressions past it. Everything below is one of those 8:
 *
 *   aria-label={"Dismiss"}                 braced, so the line regex missed it
 *   aria-label={CLOSE}                     a const in the same file
 *   alt={`Avatar for ${name}`}             a template literal
 *   <span className="sr-only">Loading</span>   JSX text, where sr-only copy lives
 *   {...{ "aria-label": "Search" }}        spread
 *   aria-valuetext="3 of 5"                an attribute not on the list
 *
 * A regex over lines can be made to catch any one of these and will never
 * catch the next one. A parse catches the shape.
 *
 * What it deliberately does not check: the copy a product passes in. A `title`,
 * a button's children, an error message — those are the product's words and
 * always were. Stories and tests are call sites, so they are skipped too.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const SRC = "packages/ui/src";
const ROOTS = [join(SRC, "components"), join(SRC, "lib")];

/**
 * Attributes whose value reaches a user, directly or through a screen reader.
 * `label` is here because IconButton's contract makes it both aria-label and
 * title, so a literal there is the same defect one level up.
 */
const NAMED_ATTRS = new Set([
  "aria-label",
  "aria-description",
  "aria-placeholder",
  "aria-valuetext",
  "aria-roledescription",
  "aria-keyshortcuts",
  "title",
  "alt",
  "placeholder",
  "label",
  "cancelLabel",
  "confirmLabel",
  "loadingLabel",
  "affordanceLabel",
  "emptyLabel",
]);

/** Two or more letters in a row: a word, not a symbol, an arrow or a digit. */
const LOOKS_LIKE_PROSE = /[A-Za-z]{2}/;

/** Values that are words but are not language. */
const ALLOWED = new Set([
  "true",
  "false",
  "none",
  "polite",
  "assertive",
  "ascending",
  "descending",
  "button",
  "presentation",
  "status",
  "alert",
  "dialog",
  "region",
]);

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    // Stories and tests are call sites: they pass copy in, which is exactly
    // what a product does and what this rule is not about.
    else if (/\.tsx?$/.test(p) && !p.includes(".stories.") && !p.includes(".test.")) files.push(p);
  }
}
for (const r of ROOTS) walk(r);

const problems = [];

for (const file of files) {
  // labels.ts is the one place the English words are supposed to be.
  if (file.endsWith("lib/labels.ts")) continue;

  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  /** String-valued consts declared at module scope, for one hop of indirection. */
  const constStrings = new Map();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const decl of st.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        decl.initializer &&
        ts.isStringLiteral(decl.initializer)
      ) {
        constStrings.set(decl.name.text, decl.initializer.text);
      }
    }
  }

  const report = (node, what, value) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    problems.push({
      file: relative(process.cwd(), file),
      line: line + 1,
      what,
      text: value.replace(/\s+/g, " ").trim().slice(0, 60),
    });
  };

  const isProse = (v) => {
    // &hellip; and friends are punctuation spelled with letters.
    const withoutEntities = v.replace(/&[a-zA-Z]+\d*;|&#\d+;/g, "");
    return LOOKS_LIKE_PROSE.test(withoutEntities) && !ALLOWED.has(v.trim().toLowerCase());
  };

  /** The literal text an expression resolves to, or null if it is dynamic. */
  function literalOf(expr) {
    if (!expr) return null;
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
    if (ts.isTemplateExpression(expr)) {
      // `About ${x}` — the fixed parts are still baked-in language.
      const fixed = expr.head.text + expr.templateSpans.map((s) => s.literal.text).join(" ");
      return fixed.trim() ? fixed : null;
    }
    if (ts.isIdentifier(expr) && constStrings.has(expr.text)) return constStrings.get(expr.text);
    if (ts.isJsxExpression(expr)) return literalOf(expr.expression);
    // `cond ? "Open" : "Close"` — both arms count.
    if (ts.isConditionalExpression(expr)) {
      const a = literalOf(expr.whenTrue);
      const b = literalOf(expr.whenFalse);
      return [a, b].filter(Boolean).join(" / ") || null;
    }
    return null;
  }

  function visit(node) {
    // aria-label="Close" / aria-label={"Close"} / label={CLOSE} / alt={`...`}
    if (ts.isJsxAttribute(node) && node.name) {
      const name = node.name.getText(sf);
      if (NAMED_ATTRS.has(name)) {
        const v = literalOf(node.initializer);
        if (v && isProse(v)) report(node, name, v);
      }
    }

    // {...{ "aria-label": "Search" }}
    if (ts.isJsxSpreadAttribute(node) && ts.isObjectLiteralExpression(node.expression)) {
      for (const prop of node.expression.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key = ts.isStringLiteral(prop.name) ? prop.name.text : prop.name.getText(sf);
        if (!NAMED_ATTRS.has(key)) continue;
        const v = literalOf(prop.initializer);
        if (v && isProse(v)) report(prop, `${key} (spread)`, v);
      }
    }

    // Literal text between tags. Where sr-only copy lives, and the one the
    // line-based version had no way to see at all.
    if (ts.isJsxText(node)) {
      const v = node.text.trim();
      if (v && isProse(v)) report(node, "JSX text", v);
    }

    // A prop default in a destructure: `label = "Search"`.
    if (
      ts.isBindingElement(node) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer) &&
      ts.isIdentifier(node.name) &&
      NAMED_ATTRS.has(node.name.text)
    ) {
      if (isProse(node.initializer.text)) {
        report(node, `${node.name.text} default`, node.initializer.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
}

if (problems.length) {
  console.error(
    `\n${problems.length} hardcoded user-facing string${problems.length === 1 ? "" : "s"} in packages/ui/src.\n`,
  );
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}  ${p.what}  "${p.text}"`);
  }
  console.error(
    `\nAdd it to SmartaLabels in packages/ui/src/lib/labels.ts, give it an\n` +
      `English default, and read it with useLabels(). If it is the product's\n` +
      `copy rather than the library's, take it as a prop instead.\n`,
  );
  process.exit(1);
}

console.log(
  `No hardcoded user-facing strings in ${files.length} files. ` +
    `Every word the library says for itself is overridable.`,
);
