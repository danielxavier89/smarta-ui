/**
 * Compiles the library to dist/.
 *
 * Consuming @smarta/ui used to mean compiling raw TypeScript out of
 * node_modules, which every product's build skips by default — so the package
 * could only be used from inside this workspace. This is the script that makes
 * it installable.
 *
 * tsup is driven through its Node API rather than a tsup.config.ts and the
 * `tsup` binary, because npm only puts a workspace's own node_modules/.bin on
 * PATH reliably, and this repository's checkout path contains spaces. Resolving
 * the tool in Node sidesteps both. It also keeps the build's one set of options
 * in one file instead of two.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "tsup";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(here, "../package.json"), "utf8"));

/**
 * Every declared runtime dependency stays external.
 *
 * Bundling them instead would ship a second private copy of Radix inside this
 * package. Radix passes state through React context, and two copies of a
 * context are two different contexts — so a product that also uses Radix, or
 * any setup that ends up with two copies of this library, gets components that
 * render but whose triggers no longer talk to their content. Leaving them
 * external lets the consumer's bundler and npm dedupe to one copy, and keeps
 * dist small enough to read.
 *
 * @smarta/tokens is deliberately NOT here. It is a workspace package that is
 * never published, and this library uses it for types only — so it must be
 * erased at build time rather than left as an import a consumer cannot resolve.
 * It lives in devDependencies for exactly that reason.
 */
const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  ...Object.keys(pkg.dependencies ?? {}),
];

await build({
  entry: { index: "src/index.ts" },

  // Both formats on purpose. The webapp builds with Webpack and the backoffice
  // with Vite; a package that ships only ESM is the kind of thing that works in
  // one and fails in the other for reasons nobody wants to debug mid-migration.
  format: ["esm", "cjs"],

  // Declarations are the whole point for a typed consumer, and without
  // sourcemaps a stack trace in the backoffice points at a minified column.
  //
  // `resolve` inlines @smarta/tokens' types into the emitted .d.ts. Without it
  // the declarations open with `import { Product, Theme } from '@smarta/tokens'`
  // — a package that is never published — so every consumer's typecheck fails
  // on an unresolvable import while the JavaScript works fine. That is a
  // particularly nasty shape of broken: the app runs, and only CI goes red.
  dts: { resolve: ["@smarta/tokens"] },
  sourcemap: true,

  clean: true,
  treeshake: true,
  target: "es2022",
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),

  external,

  silent: false,
});
