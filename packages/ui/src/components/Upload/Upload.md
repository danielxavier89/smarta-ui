---
component: Upload
category: Form
import: "import { Upload } from '@smarta/ui'"
similar: [Dropzone, FilePreview]
tokens_only: true
---

# Upload

A Dropzone with the list of what was dropped: each file, its size, where it is, and what can be done about it.

> Cross-cutting rules — copy and tone, the six states every screen owes the user, validation, accessibility, spacing — live in [conventions](../../../docs/conventions.md) and are assumed here. This file records only what is particular to Upload.

## Use it when

- People upload several files and need to see each one arrive: receipts for a month, a year's statements.
- An upload can fail for a reason the person can fix — a format, a size, a dropped connection.
- The files stay on the screen after uploading, to be removed or replaced.

## Don't use it when

| Situation | Use instead |
|---|---|
| One file, uploaded and immediately processed somewhere else | `Dropzone` with `uploading` |
| Showing a file already uploaded | `FilePreview` |
| An attachment list with nothing uploading | `ListItem`s |

## Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `files` | `UploadItem[]` | yes | — | `{ id, name, size, status, progress?, error?, type? }` |
| `onFiles` | `(files: File[]) => void` | yes | — | Start uploading, add them to `files`. |
| `onRetry` | `(id) => void` | no | — | Shows "Try scan.heic again" on failed files. |
| `onRemove` | `(id) => void` | no | — | Shows "Remove beleg.jpg" on every file. |
| `accept` / `multiple` / `disabled` / `label` / `hint` / `error` | | no | — | As `Dropzone`. |

`status` is `"queued" | "uploading" | "uploaded" | "failed"`.

## States

- **Empty** — the Dropzone alone.
- **Waiting / uploading** — the word, and while uploading a bar named "rechnung.pdf: Uploading".
- **Uploaded** — the word, in the ok colour.
- **Failed** — the word, a red border, the product's reason underneath, and retry if `onRetry` is set.
- Arriving and failing are announced; the percentages in between are not.

## Rules

1. **It does not upload.** The product does — auth, signed URLs, backoff — and passes back a status per file.
2. **Every status is a word.** Colour adds to it, never replaces it.
3. **A failure says what to do**: "HEIC isn't supported. Export it as JPG." — not "Error 415".
4. **Only the ends are announced.** "receipt.pdf: Uploaded" once, not "40 percent" every half second.
5. **Every button names its file.** Three "Remove" buttons in a row are three guesses.
6. **Ids are the product's**, not the file name: two "scan.jpg" from two phones are two uploads.

## Do and don't

```
✓  rechnung-118.pdf  1.3 MB    Uploading       ✗  a spinner over the whole Dropzone for ten files
   ▓▓▓▓▓▓░░░░░░                                ✗  "Upload failed" with no reason
✓  scan.heic  3 MB  Failed  [↻] [×]
   HEIC isn't supported. Export it as JPG.
```

## Examples

```tsx
const [files, setFiles] = React.useState<UploadItem[]>([]);

<Upload
  label="Drop this month's receipts here"
  hint="JPG, PNG or PDF, up to 10 MB each"
  accept="image/jpeg,image/png,application/pdf"
  files={files}
  onFiles={(chosen) => chosen.forEach((file) => startUpload(file, setFiles))}
  onRetry={(id) => retryUpload(id, setFiles)}
  onRemove={(id) => setFiles((fs) => fs.filter((f) => f.id !== id))}
/>
```

## Related

`Dropzone` · `FilePreview` · `Progress`
