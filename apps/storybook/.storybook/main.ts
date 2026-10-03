import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";

const here = dirname(fileURLToPath(import.meta.url));
const uiSrc = resolve(here, "../../../packages/ui/src");

const config: StorybookConfig = {
  // Stories live next to the component they document, along with its .md.
  // One folder per component holds the source, the rules and the examples.
  stories: [
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../docs/**/*.mdx",
  ],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        // The rule files lean on GFM tables — "don't use it when → use this
        // instead" is a table in every one of them. Without remark-gfm those
        // render as rows of literal pipe characters.
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    "@storybook/addon-a11y",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (cfg) => {
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    cfg.resolve = {
      ...cfg.resolve,
      /**
       * Storybook runs the library from source, not from dist — and it has to
       * be ONE copy.
       *
       * Once @smarta/ui's package.json pointed at the built dist, preview.tsx
       * (which imports ThemeProvider and ToastProvider from "@smarta/ui") got
       * the built providers while every story imported its component from
       * "./Thing" in src. Two module graphs, so two ThemeContexts and two Toast
       * contexts: every Toast story threw "useToast must be used inside
       * <ToastProvider>", and every portalled Panel, Dialog and menu rendered
       * in the webapp's purple palette inside the backoffice, because ThemeScope
       * read the default context instead of the one the provider set. The build
       * was green and all 103 tests passed; it took a screenshot to see it.
       *
       * A real consumer imports everything from dist and so has one copy. This
       * is Storybook's problem alone, and this is its fix. Order matters: the
       * stylesheet entries first, or "@smarta/ui" swallows them as a prefix.
       */
      alias: [
        { find: /^@smarta\/ui\/styles\.css$/, replacement: resolve(uiSrc, "styles.css") },
        { find: /^@smarta\/ui\/formik$/, replacement: resolve(uiSrc, "formik/index.ts") },
        { find: /^@smarta\/ui$/, replacement: resolve(uiSrc, "index.ts") },
        ...(Array.isArray(cfg.resolve?.alias)
          ? cfg.resolve.alias
          : Object.entries(cfg.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
      ],
    };
    return cfg;
  },
};

export default config;
