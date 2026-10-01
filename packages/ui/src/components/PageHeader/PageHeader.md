---
component: PageHeader
category: Navigation
import: "import { PageHeader } from '@smarta/ui'"
similar: [AppShell, Card]
tokens_only: true
---

# PageHeader

The top of a page: where it sits, its h1, how it stands, and the one thing to do here.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to PageHeader.

## Use it when

- Every page. It is where the page's one h1 lives.
- A page has a primary action that belongs to the whole page: "Upload a receipt".
- A page is one level down and needs a way back.

## Don't use it when

| Situation | Use instead |
|---|---|
| A heading inside a page — a section, a card | `CardTitle`, or an h2 |
| A heading inside a Panel or Dialog | their `title` prop |
| A filter row or a search under the header | a toolbar row of its own; the header holds actions, not filters |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | `ReactNode` | yes | — | Rendered as the h1. |
| `description` | `ReactNode` | no | — | One sentence on where things stand. |
| `actions` | `ReactNode` | no | — | The page's primary Button, and at most one more. |
| `breadcrumbs` | `{ label, href?, onClick? }[]` | no | — | The trail *above* this page. Not the page itself. |
| `back` | `{ label, href?, onClick? }` | no | — | One way up instead of a trail. |
| `meta` | `ReactNode` | no | — | Beside the title: a status `Chip`, a period. |

For a client-side router, pass `href` and an `onClick` that calls `e.preventDefault()` and navigates — the link still opens in a new tab with a middle click.

## States

- **Plain** — title and description.
- **With actions** — on a phone the actions wrap under the title rather than squeezing it.
- **One level down** — `back`, or `breadcrumbs` for deeper trees.

## Rules

1. **One per page, and every page has one.** It is the h1; a page without one cannot be jumped to.
2. **The description states the situation**, not the page's purpose: "53 charges, 41 with a receipt", not "Here you can see your charges".
3. **One primary action.** The house rule, at the top of the page where it is most tempting to break.
4. **Breadcrumbs are real links** with `href`s, in a nav named "Breadcrumb". The current page is the title, not a crumb.

## Do and don't

```
✓  Accounting › 2026 ›                              ✗  Charges › Charges list › Charges
   June charges  [In progress]        [Upload a receipt]
   53 charges, 41 with a receipt.                   ✗  Welcome to your charges page!
```

## Examples

```tsx
<PageHeader
  title="June charges"
  meta={<Chip tone="warn">2 days to file</Chip>}
  description="53 charges on the statement. 41 have a receipt behind them."
  actions={<Button variant="primary">Upload a receipt</Button>}
/>

<PageHeader title="Café Miradouro" back={{ label: "Charges", href: "/charges", onClick: navigate }} />
```

## Related

`AppShell` · `Button` · `Chip`
