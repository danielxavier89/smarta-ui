import * as React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { ThemeProvider, TooltipProvider, ToastProvider } from "@smarta/ui";
import type { Product, Theme } from "@smarta/tokens";
import "@smarta/ui/styles.css";

/**
 * Two independent toolbars, because the two axes are independent: a component
 * has to be checked in four states, not two. The third control puts all four
 * on screen at once, which is the only way to notice that a tone drifted in
 * one of them.
 */
const globalTypes = {
  product: {
    description: "Which product's tokens to resolve against",
    toolbar: {
      title: "Product",
      icon: "component",
      items: [
        { value: "webapp", title: "Webapp", right: "plum" },
        { value: "backoffice", title: "Backoffice", right: "grey" },
      ],
      dynamicTitle: true,
    },
  },
  theme: {
    description: "Light or dark",
    toolbar: {
      title: "Mode",
      icon: "sun",
      items: [
        { value: "light", title: "Light", icon: "sun" },
        { value: "dark", title: "Dark", icon: "moon" },
      ],
      dynamicTitle: true,
    },
  },
  compare: {
    description: "Show more than one combination side by side",
    toolbar: {
      title: "Compare",
      icon: "grid",
      items: [
        { value: "off", title: "Single" },
        { value: "modes", title: "Light + dark" },
        { value: "products", title: "Webapp + backoffice" },
        { value: "all", title: "All four" },
      ],
      dynamicTitle: true,
    },
  },
};

const initialGlobals = { product: "webapp", theme: "light", compare: "off" };

function Surface({
  product,
  theme,
  label,
  children,
}: {
  product: Product;
  theme: Theme;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider product={product} theme={theme} className="rounded-lg">
      {label && (
        <div className="border-b border-border-soft px-[14px] py-[7px] text-2xs font-medium uppercase tracking-wide text-fg-subtle">
          {label}
        </div>
      )}
      <div className="p-[20px]">
        <TooltipProvider>
          <ToastProvider>{children}</ToastProvider>
        </TooltipProvider>
      </div>
    </ThemeProvider>
  );
}

const withTheme: Decorator = (Story, ctx) => {
  const product = (ctx.globals.product ?? "webapp") as Product;
  const theme = (ctx.globals.theme ?? "light") as Theme;
  const compare = (ctx.globals.compare ?? "off") as "off" | "modes" | "products" | "all";

  if (compare === "off") {
    return (
      <Surface product={product} theme={theme}>
        <Story />
      </Surface>
    );
  }

  const combos: Array<[Product, Theme]> =
    compare === "modes"
      ? [[product, "light"], [product, "dark"]]
      : compare === "products"
        ? [["webapp", theme], ["backoffice", theme]]
        : [
            ["webapp", "light"],
            ["webapp", "dark"],
            ["backoffice", "light"],
            ["backoffice", "dark"],
          ];

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: compare === "all" ? "repeat(2, minmax(0,1fr))" : "1fr",
      }}
    >
      {combos.map(([p, t]) => (
        // Each cell is its own theme scope. The tokens are inherited custom
        // properties, so four scopes on one page cost nothing and cannot leak.
        <div key={`${p}-${t}`} style={{ border: "1px solid #0001", borderRadius: 14, overflow: "hidden" }}>
          <Surface product={p} theme={t} label={`${p} · ${t}`}>
            <Story />
          </Surface>
        </div>
      ))}
    </div>
  );
};

const preview: Preview = {
  globalTypes,
  initialGlobals,
  decorators: [withTheme],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Introduction", "Design tokens", "Colour", "Type and space"],
          "Actions",
          "Form",
          "Status",
          "Containers",
          "Navigation",
          "Overlays",
        ],
      },
    },
    a11y: { test: "todo" },
    backgrounds: { disable: true },
  },
};

export default preview;
