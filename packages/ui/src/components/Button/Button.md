---
component: Button
category: Actions
import: "import { Button } from '@smarta/ui'"
similar: [IconButton, TextLink, Card]
tokens_only: true
---

# Button

A labelled control that does something when pressed.

## Use it when

- The user is committing to an action: uploading, sending, matching, verifying, converting.
- The action happens on this page, or opens a Panel or Dialog.
- The label can name the outcome in two or three words.

## Don't use it when

| Situation | Use instead |
|---|---|
| The control is an icon with no room for words | `IconButton` — the label is required there, as `aria-label` |
| It reads as part of a sentence, inline in prose | `TextLink` |
| The whole card should be the target | `Card` with `interactive` |
| It navigates to another URL and should support middle-click | `Button asChild` wrapping a real `<a>` or router link |
| It opens a list of further actions | `DropdownMenu` with a `Button` as the trigger |
| It chooses a value rather than performing an action | `Select`, `SegmentedControl`, or `RadioGroup` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | — | The label. See the copy rules below. |
| `variant` | `primary \| secondary \| ghost \| danger \| danger-quiet` | no | `secondary` | |
| `size` | `sm \| md \| lg` | no | `md` | `md` matches Input and Select at the same size. |
| `loading` | `boolean` | no | `false` | Swaps the leading icon for a Spinner and blocks the click. The label stays put. |
| `loadingLabel` | `string` | no | the button's own text | Announced while busy. |
| `iconLeft` / `iconRight` | `ReactNode` | no | — | 14px at `sm`/`md`, 16px at `lg`. |
| `disabled` | `boolean` | no | `false` | Must be accompanied by a reason — see States. |
| `fullWidth` | `boolean` | no | `false` | For panel footers and narrow columns. |
| `asChild` | `boolean` | no | `false` | Render as the child element, keeping the styling. |
| `type` | `button \| submit \| reset` | no | `button` | Defaults to `button` on purpose: a `<button>` in a form submits it otherwise. |

## States

- **Default** — the resting state.
- **Hover** — primary darkens to `--accent-hover`; secondary gains `--border-strong`; ghost gains a `--surface-sunken` fill.
- **Focus** — a 2px `--focus-ring` outline, offset by 2px. Never removed, never restyled per variant.
- **Loading** — spinner replaces `iconLeft`, click blocked, `aria-busy="true"`. The button does not resize.
- **Disabled** — 55% opacity, pointer events off. **A disabled button must carry a reachable reason** (a Tooltip, a line beside it, or a Callout). Better still, keep it enabled with `aria-disabled` and explain on click — a `disabled` button is skipped by the tab order, so a screen-reader user never learns it exists.
- There is no "empty" or "error" state. A button that failed shows the failure in place, next to itself.

## Rules

1. **One primary per view.** Exactly one filled accent button per screen, or per Panel/Dialog footer — the single thing the user came to do. Everything else is `secondary` or `ghost`. Two primaries side by side means the page has not decided what it is for.
2. **The label says what happens.** "Upload it", "Match them", "Send to Ana", "Reject & tell the customer", "Convert Petra". Never "Submit", "OK", "Confirm", "Yes".
3. **Sentence case.** Never Title Case.
4. **`danger` is for the irreversible.** Use `danger-quiet` when the destructive action is present but is not what the page is about.
5. **Every button does something.** A button with no handler is the cheapest way to lose a room during a demo.
6. **Destructive actions follow the confirmation rule.** If it can be undone, do it and raise an Undo toast. If it cannot, open a `Dialog` whose confirm button names the act. Never a bare "Are you sure? / OK".
7. **Icons support the label, they do not replace it.** Drop the icon before you drop the words.

## Do and don't

```
✓  [Upload it]   [Ask Ana]   [Cancel]
    primary      secondary    ghost

✗  [Upload it]   [Send to Ana]
    primary      primary            — two primaries, no point of view

✓  [Convert Petra]  (disabled) + tooltip "2 documents missing"
✗  [Convert Petra]  (disabled, silent)

✓  [Reject & tell the customer]
✗  [Submit]  [OK]  [Confirm]
```

## Examples

```tsx
// The one thing this panel is for
<Button variant="primary" onClick={send}>Send to Ana</Button>

// In flight — the label stays, so the button does not move
<Button variant="primary" loading loadingLabel="Sending to Ana">Send to Ana</Button>

// A real navigation, so middle-click and copy-link still work
<Button asChild variant="ghost">
  <a href="/receipts">See all receipts</a>
</Button>

// Destructive, and irreversible: it opens a Dialog rather than acting
<Button variant="danger-quiet" onClick={() => setConfirmOpen(true)}>
  Reject the document
</Button>
```

## Related

`IconButton` · `TextLink` · `Dialog` · `DropdownMenu` · `Spinner`
