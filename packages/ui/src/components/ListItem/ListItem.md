---
component: ListItem
category: Containers
import: "import { ListItem, List } from '@smarta/ui'"
similar: [Table, Card, KeyValue]
tokens_only: true
---

# ListItem

One row in a list of things that are read rather than compared.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to ListItem.

## Use it when

- Rows are read **across**: a title, a sentence of context, maybe an avatar.
- Fields vary from row to row.
- Messages, notifications, tasks, documents, activity.

## Don't use it when

| Situation | Use instead |
|---|---|
| Every row has the same columns and the user compares down them | `Table` |
| It is one thing with a title and several actions | `Card` |
| It is the facts about a single thing | `KeyValue` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | `ReactNode` | **yes** | — | Truncates on one line. |
| `description` | `ReactNode` | no | — | The line under it. |
| `leading` | `ReactNode` | no | — | An `Avatar`, a `Chip`, an icon in a tinted circle. |
| `meta` | `ReactNode` | no | — | Right-aligned: a timestamp, an amount. |
| `actions` | `ReactNode` | no | — | Buttons. Wrap to a full-width row on a phone. |
| `clickable` | `boolean` | no | `false` | Renders a `<button>`. |
| `unread` | `boolean` | no | `false` | Bolder title and a leading dot. |
| `selected` | `boolean` | no | `false` | `--accent-soft` fill — the row a Panel is open for. |
| `disabled` | `boolean` | no | `false` | |

`List` is the bordered surface a run of them sits on.

## States

Default · Hover (when `clickable`) · Focus · Selected · Unread · Disabled.
Empty is not a state of this component — render an `EmptyState` inside the `List` instead.

## Rules

1. **`clickable` and `actions` are a conflict.** A `clickable` ListItem renders a `<button>`, so buttons inside it are invalid. Pick one: either the row opens something, or it carries its own actions. (If you need both, use a `Card` with `CardFooter`.)
2. **`selected` is for the row whose Panel is open**, so the user does not lose their place when they look right.
3. **`unread` uses a dot *and* weight**, never colour alone.
4. **The description is one line of real context**, not a repeat of the title.
5. **`meta` is the smallest fact** — a relative time, an amount. Anything longer belongs in the description.
6. **Actions go full-width on a phone**, handled for you. Do not override it: a button squeezed beside two lines of text is a button nobody can hit.

## Do and don't

```
✓  ● About the Lisbon Coffee charge                     2h ago
     Could you tell me whether the €12.10 was a meeting?

✓  Revolut ···· 7731 statement          [Upload it]
     The only thing still missing for June.

✗  clickable row that also contains [Upload it]
✗  ● unread shown by colour alone, no dot, no weight
```

## Examples

```tsx
<List>
  {messages.map((m) => (
    <ListItem
      key={m.id}
      clickable
      unread={!m.read}
      selected={openId === m.id}
      leading={<Avatar name={m.from} src={m.face} />}
      title={m.subject}
      description={m.preview}
      meta={m.when}
      onClick={() => setOpenId(m.id)}
    />
  ))}
  {messages.length === 0 && (
    <EmptyState title="Nothing from Ana yet" description="She writes when something needs you." />
  )}
</List>
```

## Related

`Table` · `Card` · `Avatar` · `EmptyState` · `Panel`
