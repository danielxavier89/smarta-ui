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
      alias: { ...(cfg.resolve?.alias ?? {}), "@": uiSrc },
    };
    return cfg;
  },
};

export default config;
