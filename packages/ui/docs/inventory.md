---
kind: inventory
generated: true
source: npm run gen:inventory
load: before choosing a component or a token
---

# Inventory

**Generated — do not edit.** Run `npm run gen:inventory` after adding a component or a token.

Everything that exists, on one page, so nothing gets rebuilt that is already here. If what you need is not in these tables, say so rather than inventing a component — adding one is a decision for the design system, not for the screen you happen to be on.

## Components (34)


### Actions

| Component | What it is | Exports |
|---|---|---|
| `Button` | A labelled control that does something when pressed. | `Button` |
| `IconButton` | A circular control carrying an icon and no visible words. | `IconButton` |
| `TextLink` | Text that behaves like a link. Renders a `<button>` by default. | `TextLink` |

### Form

| Component | What it is | Exports |
|---|---|---|
| `Checkbox` | An independent on/off choice, or a row selector in a table. | `Checkbox` |
| `Dropzone` | A drop target that is also a button that is also a file input. | `Dropzone` |
| `Field` | Label, control, and the one line underneath — wired together so the hint and the error actually reach a screen reader. | `Field` |
| `Input` | A single-line text field with its label, hint and error wired to it. | `Input` |
| `Label` | The words naming a control. | `Label` |
| `RadioGroup` | One choice from a small set, with every option visible. | `RadioGroup` |
| `SearchInput` | The pill-shaped search field from both products' top bars. | `SearchInput` |
| `Select` | A native `<select>`, styled. One value from a known list. | `Select` |
| `Textarea` | A multi-line text field. | `Textarea` |

### Status

| Component | What it is | Exports |
|---|---|---|
| `Avatar` | A person, as a circle. | `Avatar`, `AvatarStack` |
| `Badge` | A count on top of something else: the unread bubble on a nav item, the number beside a tab. | `Badge` |
| `Chip` | A short, non-interactive status pill: "Matched", "Overdue", "Waiting on Ana". | `Chip` |
| `Progress` | A bar for work whose end is known. | `Progress` |
| `Skeleton` | A placeholder in the shape of the thing that is coming. | `Skeleton`, `SkeletonList` |
| `Spinner` | The one busy indicator, for work with no knowable end. | `Spinner` |

### Containers

| Component | What it is | Exports |
|---|---|---|
| `Card` | A bordered surface holding one thing. | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`, `CardAction` |
| `EmptyState` | The state a list is in when it has nothing to list. | `EmptyState` |
| `KeyValue` | The facts about one thing, as a real `<dl>`. | `KeyValue` |
| `ListItem` | One row in a list of things that are read rather than compared. | `ListItem`, `List` |
| `StatCard` | One number, named. | `StatCard` |
| `Table` | Rows with the same columns, meant to be compared. | `Table`, `THead`, `TBody`, `TR`, `TH`, `TD`, `TableEmpty` |

### Navigation

| Component | What it is | Exports |
|---|---|---|
| `DropdownMenu` | A list of **actions**, opened from a control. | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuLabel`, `DropdownMenuSeparator` |
| `Pagination` | Moves through a list too long to show at once. | `Pagination` |
| `SegmentedControl` | Switches **how** the same content is shown. | `SegmentedControl` |
| `Tabs` | Switches **what** is shown, within one page. | `Tabs`, `TabsList`, `Tab`, `TabPanel` |

### Overlays

| Component | What it is | Exports |
|---|---|---|
| `Callout` | A message that stays on the page. | `Callout` |
| `Dialog` | A modal that interrupts to ask one question. | `Dialog` |
| `Panel` | The right-hand detail view. A bottom sheet on a narrow screen. | `Panel`, `PanelSection` |
| `Toast` | A transient message about something that just happened. | `ToastProvider` |
| `Tooltip` | A short label on hover and on keyboard focus. | `Tooltip`, `TooltipProvider` |

### Foundations

| Component | What it is | Exports |
|---|---|---|
| `ThemeProvider` | Owns a theme scope: which product's tokens resolve, and in which mode. | `ThemeProvider`, `ThemeScope` |

## Semantic colour tokens

The only colours a component may read. Anything not listed here does not exist.

### Surfaces

| Token | Utility | Use |
|---|---|---|
| `--canvas` | `bg-canvas` | The page itself. Nothing else should use it as a fill. |
| `--surface` | `bg-surface` | Cards, tables, rows — anything that holds content on the canvas. |
| `--surface-raised` | `bg-surface-raised` | Menus, popovers, panels and dialogs. Separates from surface in dark mode only. |
| `--surface-sunken` | `bg-surface-sunken` | Wells: segmented-control tracks, code blocks, disabled input fills. |
| `--surface-hover` | `bg-surface-hover` | The hover state of a clickable row or card. |

### Text

| Token | Utility | Use |
|---|---|---|
| `--fg` | `bg-fg` | Headings, values, anything the user is here to read. |
| `--fg-muted` | `bg-fg-muted` | Body copy, icons, secondary lines that still matter. |
| `--fg-subtle` | `bg-fg-subtle` | Labels, captions, placeholder-adjacent text. The quietest text that is still text. |
| `--fg-faint` | `bg-fg-faint` | Dots, empty-state icons, hover borders. Never text — it does not reach 4.5:1. |

### Lines

| Token | Utility | Use |
|---|---|---|
| `--border` | `bg-border` | The default 1px line: card edges, table rules, control outlines. |
| `--border-soft` | `bg-border-soft` | Internal dividers inside a card, where a full border would be loud. |
| `--border-strong` | `bg-border-strong` | The hover border on a control, and dropzone dashes. |

### Brand

| Token | Utility | Use |
|---|---|---|
| `--accent` | `bg-accent` | Primary button fills, checked checkboxes, the active tab rule. |
| `--accent-hover` | `bg-accent-hover` | Hover state of an accent fill. |
| `--accent-fg` | `bg-accent-fg` | Text on an accent fill. |
| `--accent-soft` | `bg-accent-soft` | A tinted accent fill: selected rows, avatar backgrounds, quiet emphasis. |
| `--accent-soft-fg` | `bg-accent-soft-fg` | Text on accent-soft. |
| `--link` | `bg-link` | Brand colour used as text on canvas or surface. |
| `--link-hover` | `bg-link-hover` | Hover state of link text. |

### Selection and focus

| Token | Utility | Use |
|---|---|---|
| `--selected-bg` | `bg-selected-bg` | The nav pill, the chosen row, ::selection. |
| `--selected-fg` | `bg-selected-fg` | Text inside a selected surface. |
| `--focus-ring` | `bg-focus-ring` | The 2px focus outline. One treatment system-wide. |
| `--focus-halo` | `bg-focus-halo` | The 3px soft ring behind a focused control that has its own fill. |

### Status

| Token | Utility | Use |
|---|---|---|
| `--ok` | `bg-ok` | Done, matched, verified, paid. |
| `--ok-bg` | `bg-ok-bg` | The tint behind an ok chip. |
| `--ok-fg` | `bg-ok-fg` | Text on ok-bg. |
| `--warn` | `bg-warn` | Due soon, waiting on someone, needs a look. |
| `--warn-bg` | `bg-warn-bg` | The tint behind a warn chip. |
| `--warn-fg` | `bg-warn-fg` | Text on warn-bg. |
| `--bad` | `bg-bad` | Overdue, rejected, failed, missing. |
| `--bad-bg` | `bg-bad-bg` | The tint behind a bad chip. |
| `--bad-fg` | `bg-bad-fg` | Text on bad-bg. |
| `--info` | `bg-info` | Neutral information the user did not ask for but should see. |
| `--info-bg` | `bg-info-bg` | The tint behind an info chip. |
| `--info-fg` | `bg-info-fg` | Text on info-bg. |
| `--neutral` | `bg-neutral` | A status pill with no status: draft, none, not started. |
| `--neutral-bg` | `bg-neutral-bg` | The tint behind a neutral chip. |
| `--neutral-fg` | `bg-neutral-fg` | Text on neutral-bg. |
| `--on-status` | `bg-on-status` | Text on a SOLID status fill, such as a red count badge. White in light mode, near-black in dark, because the dark status colours are the light ones. |

### Inversion, scrim, loading

| Token | Utility | Use |
|---|---|---|
| `--inverse-surface` | `bg-inverse-surface` | Tooltips. Dark in light mode, light in dark mode. |
| `--inverse-fg` | `bg-inverse-fg` | Text on inverse-surface. |
| `--overlay` | `bg-overlay` | The scrim behind a dialog or a panel. |
| `--skeleton` | `bg-skeleton` | The loading placeholder block. |
| `--skeleton-sheen` | `bg-skeleton-sheen` | The lighter half of the skeleton pulse. |

## Scale tokens

### Radius

| Token | Utility | Use |
|---|---|---|
| `--radius-xs` | `rounded-xs` | 4px — focus outlines, the smallest chips. |
| `--radius-sm` | `rounded-sm` | 6px — nested elements inside a control. |
| `--radius-md` | `rounded-md` | 10px — buttons, inputs, selects, textareas. |
| `--radius-lg` | `rounded-lg` | 14px — cards, tables, dialogs. |
| `--radius-xl` | `rounded-xl` | 16px — bottom sheets. |
| `--radius-full` | `rounded-full` | Pills, avatars, icon buttons, badges. |

### Type

| Token | Utility | Use |
|---|---|---|
| `--text-2xs` | `text-2xs` | 11px — badge counts, superscript meta. |
| `--text-xs` | `text-xs` | 12px — chips, table meta, captions. |
| `--text-sm` | `text-sm` | 13px — buttons, tabs, dense table cells. |
| `--text-base` | `text-base` | 14px — body. The default everything falls back to. |
| `--text-md` | `text-md` | 15px — a lede line, a panel's first sentence. |
| `--text-lg` | `text-lg` | 16px — card titles. |
| `--text-xl` | `text-xl` | 19px — page titles. |
| `--text-2xl` | `text-2xl` | 24px — a headline figure in a stat. |
| `--text-3xl` | `text-3xl` | 30px — the one number a page is about. |

### Elevation

| Token | Utility | Use |
|---|---|---|
| `--shadow-xs` | `shadow-xs` | A hairline lift on a hovered card. |
| `--shadow-sm` | `shadow-sm` | Sticky headers, toolbars. |
| `--shadow-md` | `shadow-md` | Toasts. |
| `--shadow-lg` | `shadow-lg` | Menus, popovers, dialogs. |
| `--shadow-panel` | `shadow-panel` | The right-hand panel, cast leftwards. |
| `--shadow-sheet` | `shadow-sheet` | The mobile bottom sheet, cast upwards. |

### Controls and density

| Token | Utility | Use |
|---|---|---|
| `--control-height-sm` | `—` | 30px webapp / 28px backoffice. |
| `--control-height-md` | `—` | 36px webapp / 34px backoffice. The default for every control. |
| `--control-height-lg` | `—` | 42px webapp / 40px backoffice. |
| `--density-row-y` | `—` | Vertical padding in a table row or list item. |
| `--density-row-x` | `—` | Horizontal padding in a table row or list item. |
| `--density-card-p` | `—` | Card padding. |

### Layering

| Token | Utility | Use |
|---|---|---|
| `--z-sticky` | `—` | 10 — sticky table headings. |
| `--z-dropdown` | `—` | 20 — menus and popovers. |
| `--z-overlay` | `—` | 30 — the scrim. |
| `--z-panel` | `—` | 40 — the side panel. |
| `--z-dialog` | `—` | 50 — modal dialogs. |
| `--z-toast` | `—` | 60 — toasts, above a dialog. |
| `--z-tooltip` | `—` | 70 — tooltips, above everything. |
