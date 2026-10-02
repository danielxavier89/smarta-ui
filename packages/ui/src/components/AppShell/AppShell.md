---
component: AppShell
category: Navigation
import: "import { AppShell, NavItem, NavGroup } from '@smarta/ui'"
similar: [PageHeader, Tabs]
tokens_only: true
---

# AppShell

The frame every screen sits in: a skip link, the navigation, a top bar, and the page in `<main>`.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to AppShell.

## Use it when

- A product built on the library from the start — it owns the page's landmarks.
- A new section of an existing product that is being moved to the library page by page, rendered inside `ThemeProvider asRoot`.

## Don't use it when

| Situation | Use instead |
|---|---|
| The product already has a shell (the webapp's, the backoffice's) and a page is being moved into the library | keep the product's shell; render the page's content with `PageHeader` and friends inside it |
| Switching between views of one page | `Tabs` |
| A settings sub-navigation inside a page | a list of `NavItem`s inside a `NavGroup` in the page, not a second shell |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `nav` | `ReactNode` | yes | — | `NavGroup`s of `NavItem`s. |
| `brand` | `ReactNode` | no | — | The product's mark. |
| `navFooter` | `ReactNode` | no | — | Pinned to the sidebar's foot: the account, the company switcher. |
| `topBar` | `ReactNode` | no | — | Search, notifications, avatar. Without it, the bar shows only on a phone. |
| `mainId` | `string` | no | `"main"` | Where the skip link jumps. |

`NavItem`: `href`, `icon`, `active`, `count`, `asChild` (for a router `Link`). `NavGroup`: `label`.

## States

- **Desktop** — a fixed sidebar at `--sidebar-width`, the page beside it.
- **Phone** — a top bar with a menu button; the navigation opens as a drawer and closes when an item is followed.
- **Keyboard** — the first Tab stop is "Skip to content", visible only when focused.

## Rules

1. **One shell, one `<main>`, one main navigation.** It owns the landmarks so a page cannot end up with two.
2. **The current item says so with `aria-current="page"`**, not only with a tint.
3. **Nav items are links.** They go somewhere, and they open in a new tab.
4. **Counts are things waiting**, not totals. "Receipts 12" means twelve to look at.
5. **Following an item closes the drawer.** The drawer is a way to get somewhere, not a place.

## Do and don't

```
✓  ▸ Charges        12                          ✗  a <div onClick> as a nav item
     Receipts                                   ✗  "Charges 1,284" — a total is not a call to act
     Returns
```

## Examples

```tsx
<ThemeProvider product="webapp" asRoot>
  <AppShell
    brand={<Logo />}
    nav={
      <>
        <NavGroup>
          <NavItem asChild icon={<Home size={16} />} active={path === "/"}><Link to="/">Overview</Link></NavItem>
        </NavGroup>
        <NavGroup label="Accounting">
          <NavItem asChild icon={<CreditCard size={16} />} active={path === "/charges"} count={12}>
            <Link to="/charges">Charges</Link>
          </NavItem>
        </NavGroup>
      </>
    }
    topBar={<Avatar name="Lena Brandt" />}
  >
    <PageHeader title="June charges" />
    …
  </AppShell>
</ThemeProvider>
```

## Related

`PageHeader` · `ThemeProvider` (`asRoot`) · `Tabs`
