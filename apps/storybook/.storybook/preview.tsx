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
    <ThemeProvider
      product={product}
      theme={theme}
      // The border is inside the provider so it can use a token. An outer
      // wrapper sits outside the theme scope and would have to hardcode a
      // colour, which is invisible against a dark cell.
      className={label ? "overflow-hidden rounded-lg border border-border-strong" : ""}
    >
      {label && (
        <div className="border-b border-border-soft bg-surface-sunken px-[14px] py-[7px] text-2xs font-medium uppercase tracking-wide text-fg-subtle">
          {label}
        </div>
      )}
      <div className="p-[20px]">{children}</div>
    </ThemeProvider>
  );
}

const withTheme: Decorator = (Story, ctx) => {
  const product = (ctx.globals.product ?? "webapp") as Product;
  const theme = (ctx.globals.theme ?? "light") as Theme;
  const compare = (ctx.globals.compare ?? "off") as "off" | "modes" | "products" | "all";

  const combos: Array<[Product, Theme]> =
    compare === "off"
      ? [[product, theme]]
      : compare === "modes"
        ? [[product, "light"], [product, "dark"]]
        : compare === "products"
          ? [["webapp", theme], ["backoffice", theme]]
          : [
              ["webapp", "light"],
              ["webapp", "dark"],
              ["backoffice", "light"],
              ["backoffice", "dark"],
            ];

  const cells = combos.map(([p, t]) => (
    // Each cell is its own theme scope. The tokens are inherited custom
    // properties, so four scopes on one page cost nothing and cannot leak.
    <Surface key={`${p}-${t}`} product={p} theme={t} label={compare === "off" ? undefined : `${p} \u00b7 ${t}`}>
      <Story />
    </Surface>
  ));

  // One TooltipProvider and one ToastProvider for the whole preview, not one per
  // cell. Radix's toast viewport is a labelled landmark, so four of them made
  // the a11y addon report a landmark-unique violation that belonged to the
  // harness rather than to any component.
  return (
    <ThemeProvider product={product} theme={theme}>
      <TooltipProvider>
        <ToastProvider>
          {compare === "off" ? (
            cells
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
                padding: 12,
                gridTemplateColumns: compare === "all" ? "repeat(2, minmax(0,1fr))" : "1fr",
              }}
            >
              {cells}
            </div>
          )}
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
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
