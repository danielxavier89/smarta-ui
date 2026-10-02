---
component: TextLink
category: Actions
import: "import { TextLink } from '@smarta/ui'"
similar: [Button]
tokens_only: true
---

# TextLink

Text that behaves like a link. Renders a `<button>` by default.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to TextLink.

## Use it when

- The control belongs inside a sentence: "…or **ask Ana to chase them**".
- The action is secondary and a button would shout: a quiet "see what is missing" under a card.
- A real navigation to another URL — then pass `asChild` and give it a genuine `<a href>`.

## Don't use it when

| Situation | Use instead |
|---|---|
| It is the page's main action | `Button variant="primary"` |
| It stands alone on its own line as a control | `Button variant="ghost"` |
| It sits in a panel or dialog footer | `Button` |
| The whole card should navigate | `Card interactive` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | — | Lower case unless it starts a sentence. |
| `muted` | `boolean` | no | `false` | Reads as secondary text until hovered. |
| `asChild` | `boolean` | no | `false` | For a real `<a>` or router link. |

## States

Default · Hover (underlines, moves to `--link-hover`) · Focus (2px ring) · Disabled (55%, no underline).

## Rules

1. **Never `<a href="#">`.** Both prototypes learned this the hard way: the handler runs, then the anchor empties `location.hash`, the router hears `hashchange`, and the page jumps back to Home. Anything acting on the current page is a `<button>` wearing link clothes — which is this component's whole reason to exist.
2. **A real destination gets a real href**, via `asChild`, so middle-click, copy-link and open-in-new-tab keep working.
3. **The underline is a token, not a decision.** `--link-decoration` is `none` in the webapp and `underline` in the backoffice, because a grayscale palette has no hue left to signal "link" with. Never hardcode either.
4. **It is exempt from the 44px touch minimum**, because a finger-height word breaks the line it sits in. `reset.css` handles this.

## Do and don't

```
✓  You can <TextLink>upload them now</TextLink> or wait for Ana.
✗  You can <a href="#" onClick={…}>upload them now</a>.

✓  <TextLink asChild><Link to="/receipts">See all receipts</Link></TextLink>
✗  <TextLink onClick={() => navigate('/receipts')}>See all receipts</TextLink>
```

## Related

`Button` · `Callout` · `EmptyState`
