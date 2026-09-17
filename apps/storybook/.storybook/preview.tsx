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

/**
 * The screens worth checking, rather than the forty the addon ships with.
 *
 * There is one breakpoint in this system — Tailwind's `sm`, at 640px — and it
 * is the line the Panel crosses from a bottom sheet to a side panel. So the
 * set below is: comfortably under it, right under it, and over it. `Narrow
 * phone` is the one that finds things; 320px is still a live width and almost
 * nothing is designed at it.
 *
 * Touch behaviour does NOT follow from these. `touch:` and `.touch-target` key
 * off `pointer: coarse`, and a desktop browser reports a mouse however narrow
 * the frame is. To see the 44px targets, open the preview in device emulation
 * (or on a phone) — that is the only place the pointer changes.
 */
const viewports = {
  narrow: {
    name: "Narrow phone (320)",
    styles: { width: "320px", height: "640px" },
    type: "mobile" as const,
  },
  phone: {
    name: "Phone (390)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  phoneLandscape: {
    name: "Phone, landscape (844 × 390)",
    styles: { width: "844px", height: "390px" },
    type: "mobile" as const,
  },
  belowSm: {
    name: "Just below sm (639)",
    styles: { width: "639px", height: "900px" },
    type: "mobile" as const,
  },
  tablet: {
    name: "Tablet (834)",
    styles: { width: "834px", height: "1112px" },
    type: "tablet" as const,
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
    // asRoot puts the attributes on the preview iframe's own <html>, rather than
    // on a wrapper inside it. A wrapper only paints a background: the document
    // still resolved :root from prefers-color-scheme, so color-scheme stayed
    // dark on a dark-mode machine and the scrollbars and native controls went
    // with it, under a story the toolbar said was Light.
    <ThemeProvider asRoot product={product} theme={theme}>
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
                // auto-fit rather than a hard `repeat(2, ...)`: in a phone
                // viewport two cells of a component side by side are 150px
                // wide each and tell you nothing. They stack instead.
                gridTemplateColumns:
                  compare === "all"
                    ? "repeat(auto-fit, minmax(min(320px, 100%), 1fr))"
                    : "1fr",
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
  // Every component gets a Docs page, which is where its .md rule file renders.
  // One file: the rules a designer reads here and the rules an agent reads
  // before writing code are the same bytes.
  tags: ["autodocs"],
  globalTypes,
  initialGlobals,
  decorators: [withTheme],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        // Read top to bottom, this is the order someone should meet the system
        // in: what it is, the rules, the states those rules are mostly about,
        // then the raw material, then whole screens, then the parts.
        order: [
          "Foundations",
          [
            "Start here",
            "Introduction",
            "Conventions",
            "States",
            "Design tokens",
            "Colour",
            "Type and space",
            "Inventory",
          ],
          "Recipes",
          ["A list page", "A detail panel", "A form"],
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
    viewport: { options: viewports },
  },
};

export default preview;
