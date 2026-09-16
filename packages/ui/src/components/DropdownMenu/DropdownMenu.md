---
component: DropdownMenu
category: Navigation
import: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@smarta/ui'"
similar: [Select, Button, IconButton]
tokens_only: true
---

# DropdownMenu

A list of **actions**, opened from a control.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to DropdownMenu.

## Use it when

- A row or header has more actions than fit: edit, download, send, delete.
- A toolbar needs multi-select filters.
- The fourth-and-onward action on any row.

## Don't use it when

| Situation | Use instead |
|---|---|
| The items are **values** that get stored | `Select` |
| There are one or two actions | `Button` or `IconButton` directly |
| It is navigation between pages | a nav, or `Tabs` |
| It needs a form inside | `Panel` or `Dialog` |

## Anatomy

```
<DropdownMenu>
  <DropdownMenuTrigger asChild><IconButton label="More actions" …/></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel/>
    <DropdownMenuItem icon meta/>
    <DropdownMenuCheckboxItem/>
    <DropdownMenuSeparator/>
    <DropdownMenuItem tone="danger"/>
  </DropdownMenuContent>
</DropdownMenu>
```

## Props

**`DropdownMenuItem`** — `icon`, `tone` (`default | danger`), `meta`, plus Radix's `disabled` / `onSelect`.
**`DropdownMenuCheckboxItem`** — `checked`, `onCheckedChange`. Pass `onSelect={(e) => e.preventDefault()}` to keep the menu open while toggling several.
**`DropdownMenuContent`** — `align` (default `end`), `sideOffset`.

## States

Closed · Open · Item highlighted (keyboard or pointer — one visual state, driven by `data-highlighted`) · Item disabled · Checkbox item checked.

## Rules

1. **A menu runs things; a select stores things.** Getting this backwards produces a menu the user expects to remember its choice.
2. **Destructive items go last, below a separator, in `tone="danger"`.**
3. **A destructive item still obeys the confirmation rule** — it opens a `Dialog`, or acts and raises an Undo toast. The menu is not the confirmation.
4. **Never more than about eight items.** Past that, group with `DropdownMenuLabel` and a separator, or rethink.
5. **The trigger must be a real control** — pass `asChild` around a `Button` or `IconButton` so it keeps its label and focus ring.
6. **Item labels are verbs.** "Download the original", not "Original".

## Do and don't

```
✓  ⋯  → Edit the receipt
        Download the original
        Send to Ana
        ─────────────
        Delete it            (danger, last)

✗  ⋯  → Erik / Michael / Annekatrin     — values: use a Select
✗  Delete it → gone, no dialog, no undo
```

## Examples

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <IconButton variant="ghost" label="More actions" icon={<MoreHorizontal size={16} />} />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem icon={<Pencil size={14} />}>Edit the receipt</DropdownMenuItem>
    <DropdownMenuItem icon={<Download size={14} />}>Download the original</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="danger" icon={<Trash2 size={14} />} onSelect={() => setConfirmOpen(true)}>
      Delete it
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Related

`Select` · `IconButton` · `Dialog` · `Toast`
