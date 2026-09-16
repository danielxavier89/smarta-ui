---
component: Avatar
category: Status
import: "import { Avatar, AvatarStack } from '@smarta/ui'"
similar: [Chip]
tokens_only: true
---

# Avatar

A person, as a circle.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Avatar.

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
| `kind` | `person \| institution` | no | `person` | Circle vs rounded square. |
| `src` | `string` | no | — | Bundled photograph or logo. Never a third-party URL. |
| `size` | `xs \| sm \| md \| lg \| xl` | no | `md` | `md` (30px) is the list default. |
| `status` | `ok \| warn \| bad` | no | — | A corner dot, ringed in `--surface`. |

`AvatarStack`: `people`, `max` (default 4), `size`.

## States

Initials (default) · Photograph · Photograph failing to load → initials, with no flash of empty circle · With status dot.

## Rules

1. **A circle is a person; a rounded square is an organisation.** Shape carries
   the distinction, not colour — it reads at a glance, survives greyscale, and
   costs no token the backoffice cannot spend.
2. **A photograph is for someone the user must recognise.** The accountant, the
   assigned case worker — someone they have a relationship with. The person
   holding the screen gets initials; they know who they are. A face is a signal,
   not decoration.
3. **An organisation may carry its logo**, and should where one exists: a bank
   or an authority is recognised faster by its mark than by two letters.
4. **Bundle every image.** Never point `src` at a third-party logo service. The
   request tells whoever hosts it which banks and authorities this client deals
   with, and a client portal must not leak that. It also puts a network
   dependency in front of a face.
5. **Initials are at most two letters**, first and last. `initialsOf()` is
   exported so the rule cannot drift.
6. **The name is always in the accessibility tree**, even when an image renders.
7. **A status dot needs a legend somewhere.** A coloured dot with no explanation
   is colour carrying meaning alone.
8. **Never the only identification.** The name goes beside it in a list.

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
