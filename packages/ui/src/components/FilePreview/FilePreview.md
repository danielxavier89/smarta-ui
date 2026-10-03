---
component: FilePreview
category: Containers
import: "import { FilePreview } from '@smarta/ui'"
similar: [Upload, Panel]
tokens_only: true
---

# FilePreview

A receipt, an invoice or a contract, shown in place with a way out to a full tab and a download.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to FilePreview.

## Use it when

- The document is the evidence for what is next to it: the receipt beside the charge, the invoice beside the booking.
- Someone has to read the document to decide something — approve, reject, categorise.
- A Panel shows one record and its attachment.

## Don't use it when

| Situation | Use instead |
|---|---|
| Files are being uploaded and their progress matters | `Upload` |
| A list of attachments, none of them open | `ListItem`s with a download `TextLink` each |
| The file is only a link to somewhere else | `TextLink` |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `src` | `string` | yes | — | Anything an `<img>` or `<iframe>` can load. |
| `name` | `string` | yes | — | Heads the frame and is the image's alt and the PDF frame's title. |
| `type` | `string` | no | from the name | `image/*`, `application/pdf`, or anything else. |
| `size` | `number` | no | — | Bytes; formatted for the locale. |
| `height` | `number \| string` | no | `480` | `"100%"` inside a Panel. |
| `downloadable` | `boolean` | no | `true` | Off when downloads go through the product's own logged route. |

## States

- **Image** — fitted to the frame; "Actual size" shows it 1:1 in a scrollable, keyboard-reachable frame.
- **PDF** — the browser's own viewer, in a titled iframe.
- **Anything else, or an image that fails to load** — "This file can't be previewed here." with the download still offered.

## Rules

1. **PDFs use the browser's viewer.** It already pages, searches and zooms; anything drawn here would be worse.
2. **The file's name is its accessible name.** "beleg-0612.jpg" tells a screen reader user which receipt this is; "Preview" does not.
3. **A broken preview still offers the file.** A dead frame with no way out is a dead end.
4. **Open in a new tab is always there**, because a receipt is easier to read at full size on a second screen.

## Do and don't

```
✓  beleg-0612.jpg  178 KB          [⤢] [↗] [⤓]      ✗  an <img> with no name in a card
   [ receipt, fitted to the frame ]                 ✗  a broken-image icon and nothing else
```

## Examples

```tsx
<Panel open={open} onOpenChange={setOpen} title="Charge at Café Miradouro">
  <FilePreview src={receipt.url} name={receipt.fileName} type={receipt.contentType} size={receipt.bytes} height="60vh" />
</Panel>
```

## Related

`Upload` · `Panel` · `Dropzone`
