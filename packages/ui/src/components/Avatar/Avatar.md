---
component: Avatar
category: Status
import: "import { Avatar, AvatarStack } from '@smarta/ui'"
similar: [Chip]
tokens_only: true
---

# Avatar

A person, as a circle.

## Use it when

- A row, message or header is *from* or *assigned to* somebody.
- The user needs to tell two people apart at a glance.

## Don't use it when

| Situation | Use instead |
|---|---|
| It represents a document or a file | an icon in a tinted circle |
| It is decoration on a card with one author already named | nothing |
| More than four people | `AvatarStack` with `max` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | `string` | **yes** | — | Required even with a photograph: it is the fallback *and* the alt text. |
| `src` | `string` | no | — | |
| `size` | `xs \| sm \| md \| lg \| xl` | no | `md` | `md` (30px) is the list default. |
| `status` | `ok \| warn \| bad` | no | — | A corner dot, ringed in `--surface`. |

`AvatarStack`: `people`, `max` (default 4), `size`.

## States

Initials (default) · Photograph · Photograph failing to load → initials, with no flash of empty circle · With status dot.

## Rules

1. **A photograph is for someone the user must recognise; initials for everyone else.** In both prototypes: the accountant gets a face; the tax authority, the banks and social security get letters — and so does the person holding the screen, who knows who they are. A face is a signal, not decoration.
   *(Proposed rule — the prototypes' existing behaviour, promoted to library policy. Flag it if you'd rather split it by client-facing vs. internal instead.)*
2. **Initials are at most two letters**, first and last name. `initialsOf()` is exported so the rule cannot drift.
3. **The name is always in the accessibility tree**, even when a photograph renders — the component adds it as visually-hidden text.
4. **A status dot needs a legend somewhere.** A coloured dot with no explanation is colour carrying meaning alone, which the Chip rule already forbids.
5. **Never use an avatar as the only identification.** The name goes beside it in a list.

## Do and don't

```
✓  [AR] Ana Ribeiro        — photo, because the client knows her
✓  [AT] Autoridade Tributária
✓  [JM] (the logged-in user, in the sidebar)

✗  [AR]                    — avatar with no name beside it
✗  a photo for every bank and authority
```

## Examples

```tsx
<Avatar name="Ana Ribeiro" src={anaFace} />
<Avatar name="Autoridade Tributária" />
<Avatar name="Contabilis, Lda" size="lg" status="ok" />

<AvatarStack people={team} max={4} size="sm" />
```

## Related

`ListItem` · `Chip` · `Table`
