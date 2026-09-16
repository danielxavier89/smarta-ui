---
component: Dropzone
category: Form
import: "import { Dropzone } from '@smarta/ui'"
similar: [Button, Callout, Progress]
tokens_only: true
---

# Dropzone

A drop target that is also a button that is also a file input.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Dropzone.

## Use it when

- The user is adding files: receipts, statements, scans, an ID document.
- Several files may arrive at once.

## Don't use it when

| Situation | Use instead |
|---|---|
| Exactly one file, in a dense form | a `Field`-wrapped `<input type="file">` |
| The file is being replaced rather than added | a `Button` labelled "Replace the scan" |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `onFiles` | `(files: File[]) => void` | **yes** | — | Already an array; respects `multiple`. |
| `accept` | `string` | no | — | e.g. `"image/*,.pdf"`. |
| `multiple` | `boolean` | no | `true` | |
| `label` | `ReactNode` | no | `"Drop files here"` | Say what belongs here. |
| `hint` | `ReactNode` | no | — | What is allowed, including the size limit. |
| `error` | `ReactNode` | no | — | |
| `uploading` | `boolean` | no | `false` | Busy; stops accepting drops. |
| `disabled` | `boolean` | no | `false` | |
| `children` | `ReactNode` | no | — | Replaces the whole inner layout. |

## States

- **Idle** — dashed `--border`.
- **Drag over** — `--accent` border and `--accent-soft` fill. Driven by a depth counter, not a boolean, so crossing onto a child element does not flicker the highlight off.
- **Uploading** — dimmed and inert. Show a `Progress` bar beside it, not inside it.
- **Error** — `--bad` border plus a message under the zone.
- **Disabled** — e.g. a closed period. Say why in the label.

## Rules

1. **Drag is the affordance, not the requirement.** The whole zone is a button and is reachable by keyboard, because dragging a file is impossible on a phone and awkward with a screen reader. Never ship a zone that can only be dropped on.
2. **State the limits before the user hits them.** `hint="JPG, PNG or PDF, up to 10 MB each."`
3. **Upload errors land here, not in a Toast.** A toast leaves before the user can act on it and cannot be re-read; the failure belongs beside the thing that failed.
4. **The file input resets after every change**, so choosing the same file twice still fires.
5. **Name the file in every message.** "That file is 14 MB. The limit is 10 MB." beats "Upload failed".

## Do and don't

```
✓  Drop receipts here or choose them
   JPG, PNG or PDF, up to 10 MB each.

✗  Drop files here                     — which files? how big?
✗  toast("Upload failed")              — gone before it can be read
✓  error="IMG_4821.jpg is 14 MB. The limit is 10 MB."
```

## Examples

```tsx
<Dropzone
  onFiles={(files) => upload(files)}
  accept="image/*,.pdf"
  label="Drop receipts here"
  hint="JPG, PNG or PDF, up to 10 MB each."
  error={tooBig ? `${tooBig.name} is ${mb(tooBig)} MB. The limit is 10 MB.` : undefined}
/>
```

## Related

`Progress` · `Callout` · `EmptyState` · `Button`
