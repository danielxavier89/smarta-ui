---
component: IconButton
category: Actions
import: "import { IconButton } from '@smarta/ui'"
similar: [Button, DropdownMenu]
tokens_only: true
---

# IconButton

A circular control carrying an icon and no visible words.

## Use it when

- The action is universally recognisable as a glyph: close, more, copy, download, back, next.
- Horizontal room is genuinely scarce — a table row, a toolbar, a panel header, a card corner.
- The control repeats across many rows, where a worded button would become visual noise.

## Don't use it when

| Situation | Use instead |
|---|---|
| The action is the page's main move | `Button` — a primary action deserves words |
| The icon needs a caption to be understood | `Button` with `iconLeft` |
| It is one of several actions on a row | one `IconButton` opening a `DropdownMenu` |
| It toggles between two states | `SegmentedControl`, or a `Checkbox` with a label |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `string` | **yes** | — | Enforced by the type. Becomes `aria-label` and the native `title`. |
| `icon` | `ReactNode` | **yes** | — | 16px at `md`. |
| `variant` | `secondary \| ghost \| primary \| danger` | no | `secondary` | |
| `size` | `sm \| md \| lg` | no | `md` | Matches the control height scale. |
| `loading` | `boolean` | no | `false` | Spinner replaces the icon; click blocked. |
| `indicator` | `boolean` | no | `false` | A 7px dot in the corner: unread, pending, changed. |
| `indicatorTone` | `bad \| warn \| ok \| accent` | no | `bad` | |
| `asChild` | `boolean` | no | `false` | |

## States

Default · Hover · Focus (2px `--focus-ring`) · Loading · Disabled.
With `indicator`, the dot is ringed in `--surface` so it reads as sitting *on* the button rather than floating over it.

There is no empty state: an IconButton with no icon is a bug.

## Rules

1. **`label` is not optional and never a repeat of the icon's name.** "Open the notifications panel", not "Bell".
2. **On a coarse pointer the target grows to 44px**, handled globally in `reset.css`. Do not shrink it back.
3. **A disabled IconButton needs a reachable reason**, exactly as a Button does. Because it has no words of its own, prefer a Tooltip.
4. **A count goes in a `Badge`, not in the icon.** Use `indicator` for "something changed" and a `Badge` for "how many".
5. **Never more than three in a row.** Past three, the fourth onwards belong in a `DropdownMenu`.

## Do and don't

```
✓  <IconButton label="Copy the NIF" icon={<Copy/>} />
✗  <IconButton label="Copy" icon={<Copy/>} />        — names the icon, not the act

✓  row: [⋯]  → menu with Edit / Download / Delete
✗  row: [✎][⭳][⇪][🗑]                                — four glyphs, no words

✓  <IconButton label="Notifications, 3 unread" indicator />
```

## Examples

```tsx
<IconButton label="Close the panel" icon={<X size={16} />} variant="ghost" />

<IconButton
  label="Notifications, 3 unread"
  icon={<Bell size={16} />}
  indicator
  onClick={openNotifications}
/>

// Four or more actions: one button, one menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <IconButton variant="ghost" label="More actions" icon={<MoreHorizontal size={16} />} />
  </DropdownMenuTrigger>
  …
</DropdownMenu>
```

## Related

`Button` · `DropdownMenu` · `Tooltip` · `Badge`
