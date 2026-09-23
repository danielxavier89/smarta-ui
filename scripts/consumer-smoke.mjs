/**
 * Proves a product can actually install and build against @smarta/ui.
 *
 * The reason this exists: every other check in the repository runs against
 * `src`, through a workspace symlink, with Storybook's aliases in place. All of
 * them passed while the package was unusable from outside — private:true,
 * pointing at raw TypeScript, with 125 imports through an `@/` alias only
 * Storybook defined. A green build told us nothing about the question that
 * mattered.
 *
 * So this one goes through the front door. It runs `npm pack`, unpacks the
 * tarball into the fixture's own node_modules and builds against THAT, not
 * against packages/ui/dist through the workspace symlink. Only the packed copy
 * exercises the `files` field and the published layout, which is where "works
 * here, installs broken" lives.
 *
 * Then TypeScript twice — once with bundler resolution, once as CommonJS on
 * node16, because those read the `exports` map differently and only the second
 * can see a missing `require` types condition — and a build with each of the
 * two bundlers the products use.
 *
 * It is deliberately boring about what the app does. A consumer that imports
 * one component and renders it exercises the whole chain: exports map, module
 * format, JSX runtime, types, and the stylesheet being real CSS.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const ROOT = process.cwd();
const UI = resolve(ROOT, "packages/ui");
const DIST = resolve(UI, "dist");

const require = createRequire(import.meta.url);
const bin = (pkg, name = pkg) => {
  const p = require.resolve(`${pkg}/package.json`);
  const j = JSON.parse(readFileSync(p, "utf8"));
  const rel = typeof j.bin === "string" ? j.bin : j.bin[name];
  return resolve(dirname(p), rel);
};

function step(name) {
  console.log(`\n── ${name}`);
}

function fail(msg) {
  console.error(`\nconsumer-smoke: ${msg}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------- 0. dist
step("the package has been built");
for (const f of ["index.js", "index.cjs", "index.d.ts", "styles.css", "reset.css"]) {
  if (!existsSync(join(DIST, f))) fail(`packages/ui/dist/${f} is missing. Run \`npm run build\` first.`);
}
console.log("   dist/ has the five files a consumer resolves");

// ------------------------------------------------- 1. the exports map resolves
step("npm's exports map resolves");
{
  const consumerRequire = createRequire(join(ROOT, "node_modules", "x.js"));
  const entry = consumerRequire.resolve("@smarta/ui");
  if (!entry.includes("dist")) {
    fail(`@smarta/ui resolved to ${entry}, which is not in dist/. A consumer would compile our TypeScript.`);
  }
  const css = consumerRequire.resolve("@smarta/ui/styles.css");
  const reset = consumerRequire.resolve("@smarta/ui/reset.css");
  console.log(`   .            -> ${entry.replace(ROOT, ".")}`);
  console.log(`   ./styles.css -> ${css.replace(ROOT, ".")}`);
  console.log(`   ./reset.css  -> ${reset.replace(ROOT, ".")}`);
}

// ---------------------------------------- 2. the declarations stand on their own
step("the emitted types resolve without the workspace");
{
  const dts = readFileSync(join(DIST, "index.d.ts"), "utf8");
  const bare = [...dts.matchAll(/^\s*import[^;]*from\s+['"]([^'".][^'"]*)['"]/gm)].map((m) => m[1]);
  const unresolvable = bare.filter((spec) => {
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (pkg === "react" || pkg === "react-dom") return false;
    const deps = JSON.parse(readFileSync(join(UI, "package.json"), "utf8")).dependencies ?? {};
    return !(pkg in deps);
  });
  if (unresolvable.length) {
    fail(
      `dist/index.d.ts imports from ${unresolvable.join(", ")}, which a consumer cannot install.\n` +
        `Either declare it as a dependency or inline the types (see dts.resolve in scripts/build-js.mjs).`,
    );
  }
  console.log(`   every type import is react or a declared dependency`);
}

// ------------------------------------------------------- 3. build a real app
/**
 * Inside the repository, not in /tmp. The app has no node_modules of its own
 * and resolves by walking up, which is how any package in a workspace resolves
 * — including @types/react. A temp directory elsewhere on disk cannot do that,
 * and faking it with tsconfig `paths` produces a consumer that resolves React
 * differently from every real one.
 */
const work = resolve(ROOT, ".consumer-smoke");
rmSync(work, { recursive: true, force: true });
process.on("exit", () => rmSync(work, { recursive: true, force: true }));

step(`building a consumer app in ${work}`);
mkdirSync(join(work, "src"), { recursive: true });

writeFileSync(
  join(work, "src/App.tsx"),
  `import { ThemeProvider, Button, Table, THead, TBody, TR, TH, TD, Chip } from "@smarta/ui";
import type { Product, SmartaLabels } from "@smarta/ui";
import "@smarta/ui/styles.css";

const product: Product = "backoffice";
const labels: Partial<SmartaLabels> = { close: "Schließen" };

export default function App() {
  return (
    <ThemeProvider product={product} theme="dark" labels={labels}>
      <Table>
        <THead>
          <TR><TH>Supplier</TH><TH align="right">Amount</TH></TR>
        </THead>
        <TBody>
          <TR onActivate={() => console.log("row")}>
            <TD>Vodafone</TD>
            <TD numeric>39,90 €</TD>
          </TR>
        </TBody>
      </Table>
      <Chip tone="ok">Matched</Chip>
      <Button variant="primary">Upload it</Button>
    </ThemeProvider>
  );
}
`,
);

writeFileSync(
  join(work, "src/entry.tsx"),
  `import { createRoot } from "react-dom/client";
import App from "./App";
const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
`,
);

/**
 * Deliberately the tsconfig a real app has, including skipLibCheck: true —
 * almost every application sets it, and a check that only passes without it
 * would be testing a configuration nobody uses.
 *
 * That does mean tsc skips our own .d.ts as a file. What it does not skip is
 * the types where the consumer actually touches them, and App.tsx touches a
 * fair share on purpose: Product, SmartaLabels, a variant union, onActivate's
 * signature, TD's align and numeric. A declaration that does not survive being
 * used fails here.
 */
writeFileSync(
  join(work, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM"],
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      },
      include: ["src"],
    },
    null,
    2,
  ),
);

// -------------------------------------------- 3a. pack it and install it
step("a. packing the tarball and unpacking it into the fixture");
{
  // npm is the thing running this script, not a dependency, so it cannot be
  // resolved out of node_modules. npm exports the path to its own CLI for
  // exactly this; the fallback is for running the script with plain `node`.
  const npmCli = process.env.npm_execpath;
  if (!npmCli || !existsSync(npmCli)) {
    fail("npm_execpath is not set. Run this through `npm run test:consumer`.");
  }

  const out = execFileSync(
    process.execPath,
    [npmCli, "pack", "-w", "@smarta/ui", "--pack-destination", work, "--silent"],
    { cwd: ROOT, encoding: "utf8" },
  );
  const tarball = out.trim().split("\n").filter(Boolean).pop();
  if (!tarball) fail("npm pack printed no tarball name");

  const dest = join(work, "node_modules/@smarta/ui");
  mkdirSync(dest, { recursive: true });
  // npm tarballs put everything under package/.
  execFileSync("tar", ["-xzf", join(work, tarball), "-C", dest, "--strip-components=1"], {
    stdio: "inherit",
  });

  // Resolution from .consumer-smoke/src finds this copy before it walks up to
  // the workspace symlink, so everything below is the published package rather
  // than dist/ reached through a symlink. Only this exercises the `files` field
  // and the packed layout — which is where "works here, installs broken" lives.
  const required = [
    "package.json",
    "LICENSE",
    "dist/index.js",
    "dist/index.cjs",
    "dist/index.d.ts",
    "dist/index.d.cts",
    "dist/styles.css",
    "dist/reset.css",
  ];
  const absent = required.filter((f) => !existsSync(join(dest, f)));
  if (absent.length) {
    fail(
      `the packed tarball is missing ${absent.join(", ")}.\n` +
        `Check the "files" field in packages/ui/package.json.`,
    );
  }
  console.log(`   ${tarball} unpacked; the published layout has everything a consumer imports`);
}

// --------------------------------------------------------------- 3b. tsc
step("b. typechecking the consumer against the packed .d.ts");
try {
  execFileSync(process.execPath, [bin("typescript", "tsc"), "-p", join(work, "tsconfig.json")], {
    stdio: "inherit",
    cwd: work,
  });
  console.log("   the emitted declarations typecheck from outside the workspace");
} catch {
  fail("the consumer failed to typecheck against the emitted .d.ts");
}

/**
 * The CommonJS door, on node16 resolution.
 *
 * This is the shape that was broken and that nothing else here could see. The
 * `exports` map used the flat form, with one `types` entry answering for both
 * conditions; the package is `"type": "module"`, so a CJS consumer read
 * index.d.ts as ESM and got TS1479 — "cannot be imported with require" — while
 * the index.d.cts being built and shipped was referenced by nothing.
 *
 * The bundler-resolution check above cannot catch it: `moduleResolution:
 * "Bundler"` ignores the conditions entirely. So this one pins node16 and
 * commonjs on purpose.
 */
step("c. typechecking a CommonJS consumer on node16 resolution");
{
  const cjsDir = join(work, "cjs");
  mkdirSync(join(cjsDir, "src"), { recursive: true });

  writeFileSync(join(cjsDir, "package.json"), JSON.stringify({ type: "commonjs" }, null, 2));
  writeFileSync(
    join(cjsDir, "src/app.ts"),
    `import { Button, formatCurrency } from "@smarta/ui";\n` +
      `import type { Product } from "@smarta/ui";\n` +
      `const p: Product = "backoffice";\n` +
      `export { Button, formatCurrency, p };\n`,
  );
  writeFileSync(
    join(cjsDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM"],
          module: "Node16",
          moduleResolution: "Node16",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
  );

  try {
    execFileSync(process.execPath, [bin("typescript", "tsc"), "-p", join(cjsDir, "tsconfig.json")], {
      stdio: "inherit",
      cwd: cjsDir,
    });
    console.log("   a CommonJS consumer resolves the .d.cts through the require condition");
  } catch {
    fail(
      "a CommonJS consumer on node16 resolution cannot import the package.\n" +
        'Check that "exports" nests "types" under each of "import" and "require".',
    );
  }
}

// -------------------------------------------------------------- 3d. Vite
step("d. building with Vite (the backoffice's bundler)");
writeFileSync(
  join(work, "vite.config.mjs"),
  `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  root: ${JSON.stringify(work)},
  plugins: [react()],
  resolve: { preserveSymlinks: false },
  logLevel: "warn",
  build: { outDir: "dist-vite", emptyOutDir: true, rollupOptions: { input: ${JSON.stringify(join(work, "index.html"))} } },
});
`,
);
writeFileSync(
  join(work, "index.html"),
  `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/entry.tsx"></script></body></html>`,
);

try {
  execFileSync(process.execPath, [bin("vite"), "build", "-c", join(work, "vite.config.mjs")], {
    stdio: "inherit",
    cwd: work,
  });
  console.log("   Vite bundled the library and its stylesheet");
} catch {
  fail("the consumer failed to build with Vite");
}

// ------------------------------------------------------------ 3e. Webpack
step("e. building with Webpack (the webapp's bundler)");
writeFileSync(
  join(work, "webpack.config.cjs"),
  `const path = require("path");
module.exports = {
  mode: "production",
  entry: path.join(${JSON.stringify(work)}, "src/entry.tsx"),
  output: { path: path.join(${JSON.stringify(work)}, "dist-webpack"), filename: "bundle.js" },
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },
  module: {
    rules: [
      { test: /\\.[jt]sx?$/, exclude: /node_modules/, use: { loader: "esbuild-loader", options: { target: "es2022", jsx: "automatic", loader: "tsx" } } },
      { test: /\\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  stats: "errors-warnings",
  performance: { hints: false },
};
`,
);

try {
  execFileSync(process.execPath, [bin("webpack", "webpack"), "-c", join(work, "webpack.config.cjs")], {
    stdio: "inherit",
    cwd: work,
  });
  console.log("   Webpack bundled the library and its stylesheet");
} catch {
  fail("the consumer failed to build with Webpack");
}

console.log("\nconsumer-smoke: @smarta/ui packs, resolves, typechecks (bundler and CJS) and builds in both bundlers.\n");
