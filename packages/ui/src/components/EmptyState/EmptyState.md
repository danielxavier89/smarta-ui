---
component: EmptyState
category: Containers
import: "import { EmptyState } from '@smarta/ui'"
similar: [Callout, Skeleton]
tokens_only: true
---

# EmptyState

The state a list is in when it has nothing to list.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to EmptyState.

## Use it when

- A list, table, panel section or card has no rows.
- A search or filter matched nothing.
- A period or record is locked.
- A load failed.

## Don't use it when

| Situation | Use instead |
|---|---|
| The data is still arriving | `Skeleton` |
| There *is* content, but a rule applies to it | `Callout` |
| A single field is wrong | the field's `error` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | `ReactNode` | **yes** | — | What the situation is. |
| `description` | `ReactNode` | no | — | Why it is empty and what would fill it. |
| `action` | `ReactNode` | no | — | The next step. See rule 1. |
| `secondaryAction` | `ReactNode` | no | — | |
| `variant` | `first-run \| no-results \| locked \| error` | no | `first-run` | Decides the tone and the right kind of offer. `error` sets `role="alert"`. |
| `icon` | `ReactNode` | no | — | 20px inside a tinted circle. |
| `size` | `sm \| md` | no | `md` | `sm` inside a table or a card. |

## The four variants

| Variant | Means | The offer should be |
|---|---|---|
| `first-run` | Nothing here yet, and that is normal | How to create the first one |
| `no-results` | A search or filter hid everything | Clear the filter, or broaden it |
| `locked` | There is data, but not for this user or period | Where to go instead, or who to ask |
| `error` | Something failed | Retry — not an explanation of HTTP |

## Rules

1. **Every empty state offers an action, or says who to wait for and when.** "Nothing to match — Ana has everything for June" is a valid ending. **"No data" never is.** An empty state that tells the user what they could already see from looking at the screen has wasted the space.
2. **The variant decides the offer.** Clearing a filter is not the same offer as uploading the first receipt — using `first-run` copy on a `no-results` state sends the user to create something they already have.
3. **Inside a table, the header row stays** — use `TableEmpty` so the user can still see what the columns were.
4. **`size="sm"` inside a card or table**; the full size only for a whole page or panel.
5. **The description is at most two lines.** Past that, it is a `Callout`.
6. **Never blame the user.** "Nothing matches 'vodaphone'" plus a way out, not "Invalid search".

## Do and don't

```
✓  No receipts yet
   Forward one to receipts@… and it lands here, matched to its charge.
   [Upload the first one]

✓  Nothing to match
   Ana has everything for June.

✗  No data
✗  No results found.            — no way out
```

## Examples

```tsx
<EmptyState
  variant="first-run"
  icon={<Receipt size={20} />}
  title="No receipts yet"
  description="Photograph or forward a receipt and it will appear here, matched to the charge it belongs to."
  action={<Button variant="primary" size="sm">Upload the first one</Button>}
/>

<EmptyState
  variant="locked"
  icon={<Lock size={20} />}
  title="May 2026 is closed"
  description="Ana filed it on 18 June. Nothing in a closed period can change."
  action={<Button size="sm">Go to June</Button>}
  secondaryAction={<TextLink muted>Ask Ana to reopen it</TextLink>}
/>
```

## Related

`Callout` · `Table` · `List` · `Skeleton`
