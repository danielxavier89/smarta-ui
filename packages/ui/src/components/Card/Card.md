---
component: Card
category: Containers
import: "import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardAction } from '@smarta/ui'"
similar: [StatCard, ListItem, Panel]
tokens_only: true
---

# Card

A bordered surface holding one thing.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Card.

## Use it when

- A page needs to group related content into a unit with a title.
- The unit navigates somewhere, carries its own actions, or both.

## Don't use it when

| Situation | Use instead |
|---|---|
| It is one number with a caption | `StatCard` |
| It is one row in a list of similar rows | `ListItem` inside `List` |
| Every row has the same columns | `Table` |
| It is detail about a row the user just clicked | `Panel` |

## Anatomy

```
<Card interactive affordance="arrow" affordanceLabel="Open the June period" onClick={…}>
  <CardHeader>
    <div><CardTitle/><CardDescription/></div>
    <CardAction><Chip/></CardAction>     ← stays clickable
  </CardHeader>
  <CardBody/>
  <CardFooter><Button/><Button/></CardFooter>   ← stays clickable
</Card>
```

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `interactive` | `boolean` | no | `false` | Makes the whole surface a target and renders the affordance. |
| `affordance` | `arrow \| link \| button` | no | `arrow` | What the user can see and press. |
| `affordanceLabel` | `string` | no | — | The affordance's words, and the card's accessible name. |
| `affordanceAsChild` | `ReactNode` | no | — | Use a real `<a>` or router link as the control. |
| `onClick` | `() => void` | no | — | Fired by the affordance. |
| `tone` | `default \| warn \| bad \| accent` | no | `default` | |
| `disabled` | `boolean` | no | `false` | Muted and inert: a closed period. |

**`CardTitle`**

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `as` | `h2 \| h3 \| h4 \| h5 \| h6` | no | `h3` | The heading level. Size is a token, so this changes the document outline and not the look. |

## States

Default · Hover (border strengthens, 1px lift, **and the affordance reacts**) · Focus-visible (same treatment, driven by `has-[:focus-visible]`) · Disabled.

## Rules

1. **Set `as` on `CardTitle` when the page needs it.** `h3` suits a card inside a section inside a page, but only the page knows its own outline — a card directly under an `h1` needs `h2`, or the document skips a level and axe says so.
2. **A clickable card always shows what it does.** Never a surface that turns out to be pressable. Pick `arrow` when the title already says where it goes, `link` when the destination needs naming ("See the 12 charges"), `button` for a heavier action.
3. **The card is a `<div>`, never a `<button>`.** The affordance is the real control, stretched over the surface with `::after`. Wrapping the card in a button makes every control inside it invalid HTML and unreachable by keyboard — the browser flattens nested interactive content.
4. **Anything interactive inside goes in `CardFooter` or `CardAction`**, which sit above the stretched layer. That is the whole reason for the pattern: the card navigates *and* keeps its own buttons.
5. **One destination per card.** Two competing navigations on one surface is a coin toss.
6. **The hover state is on the affordance, not only the border** — that is what tells the user the surface is live.
7. **The affordance sits on the card's own grid.** All three inset by `--density-card-p`, the same padding `CardHeader` and `CardBody` use, so the arrow's top-right corner matches the title's top-left and the link lines up under the body text. The in-flow affordances are pinned to the foot, so a row of equal-height cards has its affordances on one baseline rather than floating at different heights.
8. **The lift is suppressed under `prefers-reduced-motion`**, globally. Do not re-add it.
9. **Tone is a status, not a theme.** `warn`/`bad` mean the content is in that state, not that it is important.

## Do and don't

```
✓  [ Receipts                                    (→) ]
     12 charges with nothing behind them

✓  [ June 2026                        [1 missing]     ]
     Revolut ···· 7731 still to arrive          (→)
     ─────────────────────────────────────────────
     [Upload it]  [Ask Ana]        ← still clickable

✗  <button><Card>…<Button/>…</Card></button>
✗  a card that is clickable with no visible affordance
```

## Examples

```tsx
<Card interactive affordance="link" affordanceLabel="See the 12 charges" onClick={goToCharges}>
  <CardHeader><CardTitle>Missing receipts</CardTitle></CardHeader>
  <CardBody><p>€3,094.10 unsupported this period.</p></CardBody>
</Card>

// Real navigation, so middle-click works
<Card interactive affordanceAsChild={<a href="/receipts">See all receipts</a>} affordance="link">
  …
</Card>
```

## Related

`StatCard` · `ListItem` · `Panel` · `Button`
