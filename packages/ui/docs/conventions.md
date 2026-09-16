---
kind: conventions
system: smarta-ui
load: before writing any UI copy, state handling, or layout
---

# Conventions

Rules that hold across every component. A component's own `.md` only records
what is *particular* to it; everything here is assumed.

Most of these were decided once, in the two shipped prototypes, usually after
getting it wrong. The reason is given for each, because a rule without its
reason gets re-litigated.

## Copy

- **Sentence case everywhere.** Buttons, headings, tabs, labels, chips, menu
  items. Never Title Case.
- **Buttons say what happens.** "Upload it", "Match them", "Send to Ana",
  "Reject & tell the customer", "Convert Petra". Never "Submit", "OK",
  "Confirm", "Yes".
- **Name the thing, don't count it.** "Revolut ···· 7731 missing" beats "2 of 3
  — 1 missing". A standalone count makes the reader guess which one.
  *Exception:* a count is fine when the items are listed by name directly
  underneath, so nobody has to guess.
- **Don't report that fine things are fine.** A tile that reads "0 overdue"
  every day is a tile nobody reads on the day it says 3.
- **No full stops on labels, chips or buttons.** Sentences in body copy keep them.
- **Never blame the user.** "Nothing matches 'vodaphone'" plus a way out, not
  "Invalid search".
- **Say the consequence, including to other people.** "Lena will be told what to
  send instead, and the onboarding goes back to waiting on the customer."

## States every screen owes the user

Handle all of these or say explicitly why one cannot happen.

| State | Rule |
|---|---|
| **Empty** | `EmptyState`. It explains the situation and offers the next action, or names who to wait for. Never "No data". |
| **Loading** | `Skeleton` where the shape is predictable; `Spinner` in the control that is working. Under ~300ms show nothing and keep the old content with `aria-busy`. Never a full-page spinner. |
| **Error** | In place — a `Callout`, or the field's own `error`. **Never only a toast**: a toast leaves before it can be acted on and cannot be re-read. |
| **Disabled** | Only with a reachable reason: a `Tooltip`, a line beside it, or a `Callout`. Prefer staying enabled with `aria-disabled` and explaining on click, since a `disabled` control is skipped by the tab order and a screen-reader user never learns it exists. |
| **Locked** | Explain why and offer the way out: "May 2026 is closed. Ana filed it on 18 June." |
| **Partial** | Name what is missing and who owes it. |

## Actions

- **One primary button per view**, or per Panel/Dialog footer. Two primaries
  means the page has not decided what it is for.
- **Reversible destructive actions**: do it, then offer **Undo** in a toast.
- **Irreversible destructive actions**: a `Dialog` whose confirm button names the
  act. Never a bare "Are you sure? / OK".
- **A change the user can see needs no toast.** Toasts are for state that moved
  off-screen — a row reassigned, something sent.

## Forms

- **Validate on blur, then live.** Silent while first typing; validate when the
  field loses focus; once it has complained, re-validate on every keystroke so
  the message clears the moment it is fixed.
- **The error replaces the hint**, never stacks with it.
- **Optional is marked; required is not.** An asterisk on everything required
  marks most of the form and points at nothing.
- **The error says what to do**: "A NIF is nine digits. This one has six."
- **Native `<select>` and `<input type="date">`.** On a phone the platform picker
  beats anything we would build, and it cannot be the reason a form is unusable
  with a keyboard.

## Colour and meaning

- **Status is never colour alone.** A `Chip` always carries a word; the dot or
  tint reinforces it. It has to survive greyscale, colour-blindness, and being
  read aloud.
- **Tone means something.** `ok` done · `warn` waiting or approaching · `bad`
  overdue, failed, missing · `info` a neutral fact · `neutral` no status yet.
  Never pick a tone because it looks good on the row.
- **`--fg-faint` is decoration only.** Dots, empty-state icons, hover borders. It
  does not reach 4.5:1 and must never carry a word.

## Icons

**Lucide only** (`lucide-react`). One library keeps weight and optical size
consistent; mixing two is visible immediately at 14px.

These glyphs have fixed meanings. Using a different one for the same concept is
how two products end up disagreeing about what a warning looks like.

| Icon | Means |
|---|---|
| `Info` | Provenance, "why is this the way it is" |
| `AlertTriangle` | Warning, blocked, needs a look |
| `XCircle` | Failed, rejected |
| `CheckCircle2` / `Check` | Done, matched, verified |
| `Lock` | Locked, read-only, closed period |
| `ArrowRight` | Goes somewhere |
| `Copy` | Copies a value |
| `MoreHorizontal` | Opens a menu of further actions |
| `Search` | Narrows what is on screen |
| `UploadCloud` | Accepts files |

**Sizes**: 13px inside a chip or a dense row, 14px in a button, 15–16px in an
icon button or a callout, 20–22px in an empty state. Never scale a glyph past
24px — at that size it wants to be an illustration and Lucide is not one.

**An icon never replaces the words.** Drop the icon before you drop the label.

## Numbers and money

- **The product formats money, not the component.** Amounts arrive as strings.
- **Currency style**: leading symbol, comma thousands, cents only when there are
  cents — `€4,207`, `€412.60`, `-€486.22`, minus before the symbol.
- **Tabular figures are global**, so columns line up; right-align every column of
  money (`TD numeric`).
- **A number must never break across lines.** Pass `nowrap` on `KeyValue` rows
  carrying money, tax numbers, references or dates. `€486.2 / 2` is not a smaller
  number, it is a different one.
- **If the interface states a number, rows exist behind it.** No off-screen
  constants, no "and 196 more".

## Long lists

**Pagination is the default**, and it states the total: "121–140 of 318". Both
products are used by people looking for a specific row, and the total is itself
useful — it says how much work is left. Load-more hides that.

Use "load more" only for a feed that is scanned rather than searched, such as
activity. And never paginate a list whose total the interface cannot state:
"page 2 of ?" is a dead end.

## Accessibility

- **One focus treatment**, set globally: a 2px `--focus-ring` outline, offset 2px.
  Never restyled per component, never removed.
- **Icon-only controls carry a real label.** `IconButton` requires it in the type.
- **Never nest interactive elements.** A clickable card is a `<div>` with its
  affordance stretched over it, not a `<button>` wrapping buttons.
- **Hover never fires on touch.** Nothing may live only in a tooltip or only on
  hover. Coarse pointers get 44px targets, handled globally.
- **`prefers-reduced-motion` is honoured once**, in `reset.css`. Do not add a
  second rule.
- **Anything clickable by mouse is reachable by keyboard**, with the same
  affordance on `:focus-visible`.

## What may live only in a tooltip

Provenance and units. Nothing else.

| Allowed | Not allowed |
|---|---|
| Where a number came from — "Converted at 1.1105 on 14 June." | The value itself — a NIF the user needs to copy |
| The full date behind a relative one | An action, a link, or a button |
| Why a control is disabled — "2 documents still missing" | A consequence — "This will delete the receipt" |
| The name of an icon-only control | Anything that changes a decision |

The reason is that hover never fires on touch, and a tooltip cannot be re-read
once the pointer moves. Where provenance does live in a tooltip, its trigger is
a real `<button>` so a keyboard opens it on focus and a finger can tap it — see
`KeyValue`'s note icon.

## Layout and spacing

- **Spacing comes from tokens**: `--density-row-y`, `--density-row-x`,
  `--density-card-p`, `--control-height-*`. The backoffice runs one notch
  tighter and gets it for free.
- **Radius**: `rounded-md` (10px) on anything you click, `rounded-lg` (14px) on
  anything that holds content.
- **Elements inside a container share its inset.** An affordance in a card lines
  up with the card's own padding, not with a number of its own.
- **Never `overflow-hidden` on a table wrapper** — it scopes `position: sticky`
  and the headings scroll away. Clip corners on the cells instead.

## Theming

- `data-product` (`webapp` | `backoffice`) and `data-theme` (`light` | `dark` |
  absent = follow the OS) are inherited custom properties, so they nest.
- **Portalled content must re-apply the scope.** Radix renders into
  `document.body`, outside the themed element; `ThemeScope` fixes it. Already
  applied to `Tooltip`, `Panel`, `Dialog` and `DropdownMenu` — wrap any new
  portal the same way.
- **Set the theme with `asRoot` in a product**, so `color-scheme`, scrollbars and
  native controls follow too.

## Checks

```sh
npm run check   # typecheck + lint:tokens + audit:contrast
```

`lint:tokens` fails on any hardcoded colour in `packages/ui/src`.
`audit:contrast` measures 140 text/background pairs across the four themes and
fails below 4.5:1.
