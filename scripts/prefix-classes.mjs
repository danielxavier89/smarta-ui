/**
 * Every utility this library uses carries the `sui:` prefix.
 *
 *     node scripts/prefix-classes.mjs           rewrite source in place
 *     node scripts/prefix-classes.mjs --check   fail if anything is unprefixed
 *
 * Why the prefix exists: without it, our class names are the host's class
 * names. The webapp is moving to its own Tailwind, which also defines
 * `.text-base` — at 16px, where ours is 14px. Whichever stylesheet loaded last
 * won, in both directions: the host's `.text-base` restyled our components, and
 * ours restyled the host's own content wherever it sat inside one of our
 * Panels. scripts/coexistence.mjs measured both. With the prefix the two sets
 * of names cannot meet.
 *
 * Why `--check` matters more than the rewrite: once Tailwind is configured with
 * `prefix(sui)`, an unprefixed `bg-canvas` is not an error — it is simply not
 * generated, and the component renders unstyled with a green build. This is the
 * line that says so.
 *
 * Deciding what is a class is the hard part, and it is done by asking
 * Tailwind's own design system whether each token generates CSS — not by
 * guessing from its shape. Context decides where to look:
 *
 *   - className / *ClassName JSX attributes
 *   - arguments to cn(), clsx(), cva(), twMerge(), twJoin() — with cva's
 *     defaultVariants and compoundVariants' variant keys left alone, because
 *     those strings are variant NAMES ("primary"), not classes
 *   - any other string whose every token is a Tailwind utility AND which is
 *     unambiguous — more than one token, or a token with `-`, `:` or `[` in it.
 *     A lone "hidden", "table" or "grid" outside a class context is just as
 *     likely to be a role or a display value in a style object, so it is
 *     reported for a human rather than rewritten.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createRequire } from "node:module";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const PREFIX = "sui";
const CHECK = process.argv.includes("--check");
const ROOT = process.cwd();
const UI_SRC = join(ROOT, "packages/ui/src");

const ROOTS = [UI_SRC, join(ROOT, "apps/storybook/.storybook")];
const CLASS_CALLS = new Set(["cn", "clsx", "cva", "twMerge", "twJoin"]);

/**
 * The design system the tokens are validated against is the library's own
 * stylesheet with the prefix removed, so "is this a utility?" is asked of the
 * bare token. Prefixed tokens are recognised separately.
 */
const stylesheet = readFileSync(join(UI_SRC, "styles.css"), "utf8").replace(/\s*prefix\(\w+\)/g, "");
const ds = await __unstable__loadDesignSystem(stylesheet, { base: UI_SRC });
const validity = new Map();
function isUtility(token) {
  if (!validity.has(token)) validity.set(token, ds.candidatesToCss([token])[0] != null);
  return validity.get(token);
}

const isPrefixed = (t) => t.startsWith(`${PREFIX}:`) || t.startsWith(`!${PREFIX}:`);

/** Class names this library defines by hand in @smarta/tokens, not utilities. */
const OWN_CLASSES = /^(smarta-ui|smarta-link|sui-[a-z-]+)$/;

function rewriteClassList(text, { strict }) {
  // Keep the exact whitespace: a template literal's pieces butt against ${}.
  const parts = text.split(/(\s+)/);
  let changed = false;
  const unprefixed = [];
  const out = parts.map((p) => {
    if (!p || /^\s+$/.test(p) || isPrefixed(p) || OWN_CLASSES.test(p)) return p;
    if (isUtility(p)) {
      unprefixed.push(p);
      changed = true;
      return `${PREFIX}:${p}`;
    }
    return p;
  });
  if (!strict) {
    // Outside a class context, all-or-nothing: rewrite only if every token
    // was a utility, otherwise this was prose that happened to contain one.
    const tokens = parts.filter((p) => p && !/^\s+$/.test(p));
    const allClassy = tokens.every((t) => isPrefixed(t) || OWN_CLASSES.test(t) || isUtility(t));
    if (!allClassy) return { text, changed: false, unprefixed: [] };
  }
  return { text: out.join(""), changed, unprefixed };
}

function looksUnambiguous(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.length > 1 || /[-:[\]/]/.test(tokens[0] ?? "");
}

/**
 * True when a string literal sits where a string is a NAME or a CONDITION —
 * a comparison operand, the test of a ternary, the left of &&, a case label,
 * a map key, a non-class JSX attribute, an argument to a function that is not
 * a class helper (buttonVariants({ variant: "primary" })), or cva's
 * defaultVariants. A class is never in any of those places.
 */
function inNameOrConditionPosition(node) {
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isBinaryExpression(p)) {
      const op = p.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) {
        if (child === p.left) return true;
        continue;
      }
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken || op === ts.SyntaxKind.PlusToken) continue;
      return true;
    }
    if (ts.isConditionalExpression(p)) {
      if (child === p.condition) return true;
      continue;
    }
    if (ts.isCaseClause(p) || ts.isTypeNode(p)) return true;
    if (ts.isElementAccessExpression(p)) {
      if (child === p.argumentExpression) return true;
      continue;
    }
    if (ts.isJsxAttribute(p)) {
      const name = p.name.getText();
      return !(name === "className" || /ClassName$/.test(name));
    }
    if (ts.isPropertyAssignment(p)) {
      if (child === p.name) return true;
      const key = p.name.getText().replace(/['"]/g, "");
      if (key === "defaultVariants") return true;
      continue;
    }
    if (ts.isCallExpression(p)) {
      if (child === p.expression) return true;
      return !(ts.isIdentifier(p.expression) && CLASS_CALLS.has(p.expression.text));
    }
    if (
      ts.isObjectLiteralExpression(p) || ts.isArrayLiteralExpression(p) || ts.isParenthesizedExpression(p) ||
      ts.isTemplateExpression(p) || ts.isTemplateSpan(p) || ts.isAsExpression(p) || ts.isSpreadElement(p) ||
      ts.isJsxExpression(p)
    ) continue;
    return false; // a declaration, a return, a statement: a free-standing value
  }
  return false;
}

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p) && !/\.d\.ts$/.test(p)) files.push(p);
  }
}
for (const r of ROOTS) walk(r);

const report = { rewritten: 0, files: 0, ambiguous: [], unprefixed: [] };

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];

  const literalNodes = (node) =>
    ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node);

  function rawText(node) {
    // The literal's text between its delimiters, exactly as written.
    const full = node.getText(sf);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { start: node.getStart(sf) + 1, text: full.slice(1, -1) };
    if (ts.isTemplateHead(node)) return { start: node.getStart(sf) + 1, text: full.slice(1, -2) };
    if (ts.isTemplateMiddle(node)) return { start: node.getStart(sf) + 1, text: full.slice(1, -2) };
    return { start: node.getStart(sf) + 1, text: full.slice(1, -1) }; // tail
  }

  function consider(node, strict) {
    if (!literalNodes(node)) return;
    const { start, text } = rawText(node);
    if (!strict && !looksUnambiguous(text)) {
      const tokens = text.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 1 && isUtility(tokens[0]) && !OWN_CLASSES.test(tokens[0])) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        report.ambiguous.push(`${relative(ROOT, file)}:${line + 1}  "${text}"`);
      }
      return;
    }
    const r = rewriteClassList(text, { strict });
    if (r.changed) {
      edits.push({ start, end: start + text.length, text: r.text });
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
      for (const u of r.unprefixed) report.unprefixed.push(`${relative(ROOT, file)}:${line + 1}  ${u}`);
    }
  }

  /** Every literal under `node`, honouring cva's variant-name positions. */
  function walkClassContext(node, inCva = false) {
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key = prop.name.getText(sf).replace(/['"]/g, "");
        if (inCva && key === "defaultVariants") continue;
        if (inCva && key === "compoundVariants" && ts.isArrayLiteralExpression(prop.initializer)) {
          for (const el of prop.initializer.elements) {
            if (!ts.isObjectLiteralExpression(el)) continue;
            for (const p of el.properties) {
              if (ts.isPropertyAssignment(p) && /^(class|className)$/.test(p.name.getText(sf))) walkClassContext(p.initializer, false);
            }
          }
          continue;
        }
        // clsx object syntax — { "class names": condition } — puts the classes
        // in the KEY. The value-map pattern — { left: "text-left" }[align] —
        // puts them in the value. Tell them apart by what the value is.
        const valueIsLiteral = literalNodes(prop.initializer) || ts.isTemplateExpression(prop.initializer) || ts.isObjectLiteralExpression(prop.initializer) || ts.isArrayLiteralExpression(prop.initializer);
        if (valueIsLiteral) walkClassContext(prop.initializer, inCva);
        else if (ts.isStringLiteral(prop.name)) consider(prop.name, true);
      }
      return;
    }
    if (literalNodes(node)) return consider(node, true);
    if (ts.isTemplateExpression(node)) {
      consider(node.head, true);
      for (const span of node.templateSpans) {
        walkClassContext(span.expression, inCva);
        consider(span.literal, true);
      }
      return;
    }

    // Inside cn() not every string is a class. These are the positions where
    // a string is a CONDITION or a NAME, and rewriting it changes behaviour —
    // which the first version of this script did: `shape === "block"` inside
    // a cn() became `shape === "sui:block"`, and Skeleton's block shape
    // silently stopped matching.
    if (ts.isBinaryExpression(node)) {
      const op = node.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) return walkClassContext(node.right, inCva); // cond && "classes"
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken || op === ts.SyntaxKind.PlusToken) {
        walkClassContext(node.left, inCva);
        return walkClassContext(node.right, inCva);
      }
      return; // ===, !==, <, in, instanceof … — never a class list
    }
    if (ts.isConditionalExpression(node)) {
      walkClassContext(node.whenTrue, inCva);
      return walkClassContext(node.whenFalse, inCva);
    }
    if (ts.isElementAccessExpression(node)) return walkClassContext(node.expression, inCva); // map[key]: the key is a name
    if (ts.isArrayLiteralExpression(node)) return node.elements.forEach((e) => walkClassContext(e, inCva));
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node) || ts.isSpreadElement(node)) {
      return walkClassContext(node.expression, inCva);
    }
    if (ts.isCallExpression(node)) {
      // cn(…) nested in cn(…) is still classes; buttonVariants({ variant }) is
      // variant NAMES, and so is anything else we did not write as a class call.
      if (ts.isIdentifier(node.expression) && CLASS_CALLS.has(node.expression.text)) {
        node.arguments.forEach((a) => walkClassContext(a, node.expression.text === "cva"));
      }
      return;
    }
    // Identifiers, property access, functions: nothing literal to rewrite here.
  }

  const visited = new Set();
  function visit(node) {
    if (ts.isTypeNode(node) || ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      if (name === "className" || /ClassName$/.test(name)) {
        if (node.initializer) walkClassContext(node.initializer);
        markVisited(node);
        return;
      }
      // style={{ display: "contents" }}, role="table", variant="primary" —
      // the attribute's own value is never a class. But it can CONTAIN JSX
      // that has classes: leading={<Info className="text-fg-faint" />}. The
      // first version of this script stopped at the attribute and missed every
      // className nested inside one, and --check missed them with it — a
      // visual diff found an icon drawn in the wrong colour. So the value is
      // walked; a bare string inside it is still recognised as a name by
      // inNameOrConditionPosition and left alone.
      if (node.initializer && !ts.isStringLiteral(node.initializer)) ts.forEachChild(node.initializer, visit);
      return;
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && CLASS_CALLS.has(node.expression.text)) {
      const inCva = node.expression.text === "cva";
      for (const a of node.arguments) walkClassContext(a, inCva);
      markVisited(node);
      return;
    }

    if (literalNodes(node) && !visited.has(node)) {
      const parent = node.parent;
      // Object keys, element access keys and switch cases are names, not lists.
      const isKey = parent && (ts.isPropertyAssignment(parent) && parent.name === node);
      if (!isKey && !inNameOrConditionPosition(node)) consider(node, false);
    }
    ts.forEachChild(node, visit);
  }
  function markVisited(n) {
    visited.add(n);
    ts.forEachChild(n, markVisited);
  }
  visit(sf);

  if (edits.length) {
    report.files++;
    report.rewritten += edits.length;
    if (!CHECK) {
      let out = source;
      for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
      writeFileSync(file, out);
    }
  }
}

if (CHECK) {
  if (report.unprefixed.length) {
    console.error(
      `\n${report.unprefixed.length} unprefixed utilit${report.unprefixed.length === 1 ? "y" : "ies"} in ${report.files} file${report.files === 1 ? "" : "s"}:\n\n  ` +
        report.unprefixed.slice(0, 40).join("\n  ") +
        (report.unprefixed.length > 40 ? `\n  ...and ${report.unprefixed.length - 40} more` : "") +
        `\n\nEvery utility in this library is written ${PREFIX}:flex, not flex. Tailwind is configured\n` +
        `with prefix(${PREFIX}), so an unprefixed class is not an error to it — it is just not\n` +
        `generated, and the component renders unstyled. \`node scripts/prefix-classes.mjs\` fixes it.\n`,
    );
    process.exit(1);
  }
  console.log(`Every utility in ${files.length} files carries the ${PREFIX}: prefix.`);
} else {
  console.log(`rewrote ${report.rewritten} class strings in ${report.files} files`);
}

if (report.ambiguous.length) {
  console.log(
    `\n${report.ambiguous.length} lone utility-shaped string${report.ambiguous.length === 1 ? "" : "s"} outside a class context, left alone — check by eye:\n  ` +
      report.ambiguous.join("\n  "),
  );
}
