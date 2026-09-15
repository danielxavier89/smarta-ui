/**
 * @smarta/tokens
 *
 * The CSS is the source of truth; this file is the typed view of it, so that
 * a product can talk about "webapp in dark" without stringly-typed attributes,
 * and so Storybook can render a swatch sheet that cannot drift from the real
 * token list.
 */

export const PRODUCTS = ["webapp", "backoffice"] as const;
export type Product = (typeof PRODUCTS)[number];

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** What goes on the element that owns a theme scope. */
export interface ThemeAttributes {
  "data-product": Product;
  "data-theme"?: Theme;
}

/**
 * Omitting `theme` deliberately omits the attribute, which is how a surface
 * opts in to prefers-color-scheme instead of pinning a mode.
 */
export function themeAttributes(
  product: Product,
  theme?: Theme,
): ThemeAttributes {
  return theme ? { "data-product": product, "data-theme": theme } : { "data-product": product };
}

/** One semantic token, as documented on the tokens page in Storybook. */
export interface TokenSpec {
  /** The custom property, without the leading `--`. */
  name: string;
  /** The Tailwind utility suffix, e.g. `canvas` for `bg-canvas`. */
  utility: string;
  /** What it is for, in one line. Read by humans and by the AI. */
  use: string;
}

export interface TokenGroup {
  title: string;
  note?: string;
  tokens: TokenSpec[];
}

export const COLOR_TOKENS: TokenGroup[] = [
  {
    title: "Surfaces",
    note: "Back to front. A card sits on the canvas; a menu sits above the card.",
    tokens: [
      { name: "canvas", utility: "canvas", use: "The page itself. Nothing else should use it as a fill." },
      { name: "surface", utility: "surface", use: "Cards, tables, rows — anything that holds content on the canvas." },
      { name: "surface-raised", utility: "surface-raised", use: "Menus, popovers, panels and dialogs. Separates from surface in dark mode only." },
      { name: "surface-sunken", utility: "surface-sunken", use: "Wells: segmented-control tracks, code blocks, disabled input fills." },
      { name: "surface-hover", utility: "surface-hover", use: "The hover state of a clickable row or card." },
    ],
  },
  {
    title: "Text",
    note: "Most to least prominent. fg-faint is decoration only and never carries a word.",
    tokens: [
      { name: "fg", utility: "fg", use: "Headings, values, anything the user is here to read." },
      { name: "fg-muted", utility: "fg-muted", use: "Body copy, icons, secondary lines that still matter." },
      { name: "fg-subtle", utility: "fg-subtle", use: "Labels, captions, placeholder-adjacent text. The quietest text that is still text." },
      { name: "fg-faint", utility: "fg-faint", use: "Dots, empty-state icons, hover borders. Never text — it does not reach 4.5:1." },
    ],
  },
  {
    title: "Lines",
    tokens: [
      { name: "border", utility: "border", use: "The default 1px line: card edges, table rules, control outlines." },
      { name: "border-soft", utility: "border-soft", use: "Internal dividers inside a card, where a full border would be loud." },
      { name: "border-strong", utility: "border-strong", use: "The hover border on a control, and dropzone dashes." },
    ],
  },
  {
    title: "Brand",
    note: "accent is a fill; link is the same brand read as text. They diverge hard in dark mode.",
    tokens: [
      { name: "accent", utility: "accent", use: "Primary button fills, checked checkboxes, the active tab rule." },
      { name: "accent-hover", utility: "accent-hover", use: "Hover state of an accent fill." },
      { name: "accent-fg", utility: "accent-fg", use: "Text on an accent fill." },
      { name: "accent-soft", utility: "accent-soft", use: "A tinted accent fill: selected rows, avatar backgrounds, quiet emphasis." },
      { name: "accent-soft-fg", utility: "accent-soft-fg", use: "Text on accent-soft." },
      { name: "link", utility: "link", use: "Brand colour used as text on canvas or surface." },
      { name: "link-hover", utility: "link-hover", use: "Hover state of link text." },
    ],
  },
  {
    title: "Selection and focus",
    tokens: [
      { name: "selected-bg", utility: "selected-bg", use: "The nav pill, the chosen row, ::selection." },
      { name: "selected-fg", utility: "selected-fg", use: "Text inside a selected surface." },
      { name: "focus-ring", utility: "focus-ring", use: "The 2px focus outline. One treatment system-wide." },
      { name: "focus-halo", utility: "focus-halo", use: "The 3px soft ring behind a focused control that has its own fill." },
    ],
  },
  {
    title: "Status",
    note: "Meaning, not brand: identical in both products. Each has a line colour, a tint, and the text colour that clears 4.5:1 on that tint.",
    tokens: [
      { name: "ok", utility: "ok", use: "Done, matched, verified, paid." },
      { name: "ok-bg", utility: "ok-bg", use: "The tint behind an ok chip." },
      { name: "ok-fg", utility: "ok-fg", use: "Text on ok-bg." },
      { name: "warn", utility: "warn", use: "Due soon, waiting on someone, needs a look." },
      { name: "warn-bg", utility: "warn-bg", use: "The tint behind a warn chip." },
      { name: "warn-fg", utility: "warn-fg", use: "Text on warn-bg." },
      { name: "bad", utility: "bad", use: "Overdue, rejected, failed, missing." },
      { name: "bad-bg", utility: "bad-bg", use: "The tint behind a bad chip." },
      { name: "bad-fg", utility: "bad-fg", use: "Text on bad-bg." },
      { name: "info", utility: "info", use: "Neutral information the user did not ask for but should see." },
      { name: "info-bg", utility: "info-bg", use: "The tint behind an info chip." },
      { name: "info-fg", utility: "info-fg", use: "Text on info-bg." },
      { name: "neutral", utility: "neutral", use: "A status pill with no status: draft, none, not started." },
      { name: "neutral-bg", utility: "neutral-bg", use: "The tint behind a neutral chip." },
      { name: "neutral-fg", utility: "neutral-fg", use: "Text on neutral-bg." },
      { name: "on-status", utility: "on-status", use: "Text on a SOLID status fill, such as a red count badge. White in light mode, near-black in dark, because the dark status colours are the light ones." },
    ],
  },
  {
    title: "Inversion, scrim, loading",
    tokens: [
      { name: "inverse-surface", utility: "inverse-surface", use: "Tooltips. Dark in light mode, light in dark mode." },
      { name: "inverse-fg", utility: "inverse-fg", use: "Text on inverse-surface." },
      { name: "overlay", utility: "overlay", use: "The scrim behind a dialog or a panel." },
      { name: "skeleton", utility: "skeleton", use: "The loading placeholder block." },
      { name: "skeleton-sheen", utility: "skeleton-sheen", use: "The lighter half of the skeleton pulse." },
    ],
  },
];

export const SCALE_TOKENS: TokenGroup[] = [
  {
    title: "Radius",
    note: "Two numbers do almost all the work: md on anything you click, lg on anything that holds content.",
    tokens: [
      { name: "radius-xs", utility: "rounded-xs", use: "4px — focus outlines, the smallest chips." },
      { name: "radius-sm", utility: "rounded-sm", use: "6px — nested elements inside a control." },
      { name: "radius-md", utility: "rounded-md", use: "10px — buttons, inputs, selects, textareas." },
      { name: "radius-lg", utility: "rounded-lg", use: "14px — cards, tables, dialogs." },
      { name: "radius-xl", utility: "rounded-xl", use: "16px — bottom sheets." },
      { name: "radius-full", utility: "rounded-full", use: "Pills, avatars, icon buttons, badges." },
    ],
  },
  {
    title: "Type",
    tokens: [
      { name: "text-2xs", utility: "text-2xs", use: "11px — badge counts, superscript meta." },
      { name: "text-xs", utility: "text-xs", use: "12px — chips, table meta, captions." },
      { name: "text-sm", utility: "text-sm", use: "13px — buttons, tabs, dense table cells." },
      { name: "text-base", utility: "text-base", use: "14px — body. The default everything falls back to." },
      { name: "text-md", utility: "text-md", use: "15px — a lede line, a panel's first sentence." },
      { name: "text-lg", utility: "text-lg", use: "16px — card titles." },
      { name: "text-xl", utility: "text-xl", use: "19px — page titles." },
      { name: "text-2xl", utility: "text-2xl", use: "24px — a headline figure in a stat." },
      { name: "text-3xl", utility: "text-3xl", use: "30px — the one number a page is about." },
    ],
  },
  {
    title: "Elevation",
    note: "Tinted by --shadow-color, so a shadow is plum in the webapp and neutral in the backoffice.",
    tokens: [
      { name: "shadow-xs", utility: "shadow-xs", use: "A hairline lift on a hovered card." },
      { name: "shadow-sm", utility: "shadow-sm", use: "Sticky headers, toolbars." },
      { name: "shadow-md", utility: "shadow-md", use: "Toasts." },
      { name: "shadow-lg", utility: "shadow-lg", use: "Menus, popovers, dialogs." },
      { name: "shadow-panel", utility: "shadow-panel", use: "The right-hand panel, cast leftwards." },
      { name: "shadow-sheet", utility: "shadow-sheet", use: "The mobile bottom sheet, cast upwards." },
    ],
  },
  {
    title: "Controls and density",
    note: "Plain variables, not Tailwind utilities. Read them with h-[var(--control-height-md)]. The backoffice runs one notch tighter.",
    tokens: [
      { name: "control-height-sm", utility: "—", use: "30px webapp / 28px backoffice." },
      { name: "control-height-md", utility: "—", use: "36px webapp / 34px backoffice. The default for every control." },
      { name: "control-height-lg", utility: "—", use: "42px webapp / 40px backoffice." },
      { name: "density-row-y", utility: "—", use: "Vertical padding in a table row or list item." },
      { name: "density-row-x", utility: "—", use: "Horizontal padding in a table row or list item." },
      { name: "density-card-p", utility: "—", use: "Card padding." },
    ],
  },
  {
    title: "Layering",
    note: "Named, because a raw z-index is a number nobody can rank six months on.",
    tokens: [
      { name: "z-sticky", utility: "—", use: "10 — sticky table headings." },
      { name: "z-dropdown", utility: "—", use: "20 — menus and popovers." },
      { name: "z-overlay", utility: "—", use: "30 — the scrim." },
      { name: "z-panel", utility: "—", use: "40 — the side panel." },
      { name: "z-dialog", utility: "—", use: "50 — modal dialogs." },
      { name: "z-toast", utility: "—", use: "60 — toasts, above a dialog." },
      { name: "z-tooltip", utility: "—", use: "70 — tooltips, above everything." },
    ],
  },
];
