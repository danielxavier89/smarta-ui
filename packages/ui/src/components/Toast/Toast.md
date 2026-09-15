---
component: Toast
category: Overlays
import: "import { ToastProvider, useToast } from '@smarta/ui'"
similar: [Callout, Dialog]
tokens_only: true
---

# Toast

A transient message about something that just happened.

Mount `<ToastProvider>` once near the root; raise messages with `useToast()`.

## Use it when

- **A state change the user cannot see on screen.** A row moved to another queue, a lead was reassigned, something was sent.
- A reversible action just happened and deserves an **Undo**.

## Don't use it when

| Situation | Use instead |
|---|---|
| **Anything went wrong** | a `Callout` in place, or the field's `error` |
| The change is visible on screen | nothing — the screen already said it |
| The user must act on it | `Callout` or `Dialog` |
| It is a standing rule about the page | `Callout` |

## API

```tsx
const { toast, dismiss } = useToast();
toast({ title, description?, tone?, action?, duration? });
```

| Field | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | — | Required. One line. |
| `description` | `ReactNode` | — | One more line, at most. |
| `tone` | `ok \| warn \| bad \| info` | `ok` | |
| `action` | `{ label, onClick }` | — | One button. "Undo" earns its place most often. |
| `duration` | `number` | 4500, or 8000 with an action | An action needs time to be read and reached. |

## States

Visible · Swiped away · Dismissed · With action.
Stacked bottom-right; on a phone the viewport is padded for the home indicator.

## Rules

1. **A state change the user cannot see gets a toast; everything else shows in place.** This is the backoffice prototype's rule, and it is the whole test. A toast that announces something already visible is noise.
2. **Never the only place an error appears.** A toast leaves before the user can act on it and cannot be re-read. Errors land where the thing failed.
3. **No actions except Undo-shaped ones.** Anything the user must *decide* belongs on the page.
4. **One at a time where you can.** Three stacked toasts is a log, and nobody reads a log.
5. **Never fire one on a timer.** An unprompted toast rewrites the screen under the presenter's cursor. Make it a consequence of a click.
6. **The title is what happened, past tense.** "Moved to Tax Ops", not "Moving…".

## Do and don't

```
✓  ✓ Moved to Tax Ops
     Petra Lang is now with Annekatrin.

✓  Receipt deleted                     [Undo]

✗  ✕ Upload failed                     — errors go in place
✓  dropzone error="IMG_4821.jpg is 14 MB. The limit is 10 MB."

✗  ✓ Saved            — when the screen already shows the saved value
```

## Examples

```tsx
// once, near the root
<ToastProvider><App /></ToastProvider>

// anywhere below
const { toast } = useToast();

toast({ title: "Moved to Tax Ops", description: "Petra Lang is now with Annekatrin." });

toast({
  title: "Receipt deleted",
  description: "staples.pdf is no longer on the June charge.",
  action: { label: "Undo", onClick: restore },
});
```

## Related

`Callout` · `Dialog` · `Dropzone`
