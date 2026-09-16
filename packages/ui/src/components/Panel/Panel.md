---
component: Panel
category: Overlays
import: "import { Panel, PanelSection } from '@smarta/ui'"
similar: [Dialog, Card]
tokens_only: true
---

# Panel

The right-hand detail view. A bottom sheet on a narrow screen.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Panel.

## Use it when

- The user clicked a row and wants the detail without losing the list.
- A wizard step, a picker, an upload progress view, a success state.
- **Any detail view at all** — see rule 1.

## Don't use it when

| Situation | Use instead |
|---|---|
| The action is irreversible, or leaving loses work | `Dialog` |
| The content is the page | a route |
| It is one short fact | `Tooltip` or a `Chip` |
| It is a persistent rule about the page | `Callout` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `open` / `onOpenChange` | `boolean` / `(o) => void` | **yes** | — | Controlled. |
| `title` | `ReactNode` | **yes** | — | Always a heading; a panel with no title cannot be placed. |
| `subtitle` | `ReactNode` | no | — | A date, an amount, what this is about. |
| `headerAction` | `ReactNode` | no | — | A chip or kebab beside the title. |
| `footer` | `ReactNode` | no | — | The sticky action bar. Omit for a read-only panel. |
| `width` | `default \| wide` | no | `default` | `wide` for a two-column body — a document beside its fields. |

`PanelSection` — a padded, divided block with an optional small-caps heading.

## States

Closed (unmounted) · Open · Open with footer · Wide.
On a phone it becomes a bottom sheet at 88vh, with the footer padded for the home indicator.

## Rules

1. **There is exactly one Panel per product, and every detail view is a caller of it.** Both prototypes carry this in their house rules: *don't build a second panel component.* Notifications, a receipt, a transaction, a message, a match picker, an upload view, a wizard, a success state — all the same component with a different body.
2. **Closed means closed.** Radix unmounts the content, so nothing off-screen stays in the tab order or the accessibility tree. Do not replace this with a CSS-only hide.
3. **The footer holds at most one primary button**, on the right, and a ghost "Close"/"Cancel" on the left.
4. **A Panel does not need confirming to leave.** If leaving would lose work, it should have been a `Dialog`.
5. **Panel state is not in the URL** — deliberate. Pushing a history entry per panel means ten back-presses to leave a page after a normal session.
6. **Use `PanelSection` rather than ad-hoc padding**, so every panel in the product divides the same way.

## Do and don't

```
✓  Staples Lisboa                              [Matched] ×
   3 June 2026 · €86.40
   ── The charge ──────────────
   ── The receipt ─────────────
   ── Why these were matched ──
   [Close]                        [Send to Ana]

✗  a second bespoke drawer for "just this one screen"
✗  a Panel the user must confirm before closing
```

## Examples

```tsx
<Panel
  open={open}
  onOpenChange={setOpen}
  title={receipt.supplier}
  subtitle={`${receipt.date} · ${eur(receipt.total)}`}
  headerAction={<Chip tone="ok" size="sm">Matched</Chip>}
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
      <Button variant="primary" className="ml-auto">Send to Ana</Button>
    </>
  }
>
  <PanelSection title="The charge"><KeyValue rows={chargeRows} /></PanelSection>
  <PanelSection title="The receipt"><KeyValue rows={receiptRows} /></PanelSection>
</Panel>
```

## Related

`Dialog` · `KeyValue` · `ListItem` · `Card`
