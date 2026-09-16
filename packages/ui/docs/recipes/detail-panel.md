---
kind: recipe
screen: the detail view for one record, beside the list it came from
components: [Panel, PanelSection, KeyValue, Chip, Button, Dialog, Toast]
---

# A detail panel

Every detail view in both products is a `Panel` caller. There is exactly one
`Panel` component per product and there is never a second one — not a bespoke
drawer "just for this screen".

Current callers in the prototypes: notifications, a receipt, a transaction, an
asset, a message, a match picker, an upload progress view, an add-asset wizard,
and success states. Each is the same component with a different body.

## Shape

```
Panel
  title        always. A panel with no title cannot be placed.
  subtitle     a date, an amount, what this is about
  headerAction a Chip or a kebab DropdownMenu
  PanelSection one per group of facts — KeyValue inside
  PanelSection "why this happened", in prose, when the state needs explaining
  footer       ghost Close on the left, ONE primary on the right
```

## Rules

- **Facts go in `KeyValue`**, one `PanelSection` per group. Money, tax numbers,
  references and dates carry `nowrap`.
- **Provenance goes on the row's `note`**, which renders as an info icon — not as
  a second line, which turns a column of figures into prose.
- **The footer holds at most one primary.** `<Button variant="ghost">Close</Button>`
  left, primary right with `className="ml-auto"`.
- **A Panel never needs confirming to leave.** If leaving would lose work, it
  should have been a `Dialog`.
- **A destructive action inside a Panel still obeys the rule**: reversible → do
  it and offer Undo; irreversible → open a `Dialog` on top.
- **`width="wide"`** only for a two-column body — a document beside its fields.
- **Panel state is not in the URL**, deliberately.
- **Mark the row behind it.** The list row gets `selected` while the panel is open.

## Skeleton

```tsx
<Panel
  open={Boolean(openId)}
  onOpenChange={(o) => !o && setOpenId(null)}
  title={receipt.supplier}
  subtitle={`${receipt.date} · ${eur(receipt.total)}`}
  headerAction={<Chip tone="ok" size="sm">Matched</Chip>}
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpenId(null)}>Close</Button>
      <Button variant="primary" className="ml-auto" onClick={send}>Send to Ana</Button>
    </>
  }
>
  <PanelSection title="The charge">
    <KeyValue rows={[
      { key: "Account", value: "Visa ···· 4417" },
      { key: "Booked", value: "3 June 2026", nowrap: true },
      { key: "Amount", value: eur(-86.4), nowrap: true },
    ]} />
  </PanelSection>

  <PanelSection title="The receipt">
    <KeyValue rows={[
      { key: "NIF", value: "503 214 665", nowrap: true,
        action: <IconButton size="sm" variant="ghost" label="Copy the NIF" icon={<Copy size={13} />} /> },
      { key: "VAT at 23%", value: eur(16.16), nowrap: true },
      { key: "Total", value: eur(86.4), nowrap: true },
      { key: "Input VAT", value: "Not reclaimable", tone: "warn",
        note: "A purchase outside the EU carries no Portuguese VAT." },
    ]} />
  </PanelSection>

  <PanelSection title="Why these were matched">
    <p className="m-0 text-base text-fg-muted">
      Same amount, same day, and the supplier appears on the statement line.
    </p>
  </PanelSection>
</Panel>
```

## Related

`docs/recipes/list-page.md` for the list it opens from.
