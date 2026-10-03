import * as React from "react";
import { FileText, Image as ImageIcon, RotateCcw, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatFileSize } from "../../lib/format";
import { useLabels, useLocale } from "../ThemeProvider";
import { Dropzone, type DropzoneProps } from "../Dropzone";
import { Progress } from "../Progress";
import { IconButton } from "../IconButton";

export type UploadStatus = "queued" | "uploading" | "uploaded" | "failed";

export interface UploadItem {
  /** Stable across re-renders: the product's id for this upload, not the file name. */
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  status: UploadStatus;
  /** 0–100 while uploading. Omit when the transport cannot tell. */
  progress?: number;
  /** Why it failed, in words the person can act on: "Larger than 10 MB." */
  error?: string;
  /** A content type, to choose the icon. */
  type?: string;
}

export interface UploadProps
  extends Pick<DropzoneProps, "accept" | "multiple" | "disabled" | "label" | "hint" | "error" | "className"> {
  /** Every file and where it is. The product owns the uploading; this shows it. */
  files: UploadItem[];
  /** New files chosen or dropped. Start uploading them and add them to `files`. */
  onFiles: (files: File[]) => void;
  /** Shows a retry button on failed files. */
  onRetry?: (id: string) => void;
  /** Shows a remove button on every file. */
  onRemove?: (id: string) => void;
}

/**
 * A Dropzone with the list of what was dropped: each file, its size, where it
 * is — waiting, uploading, uploaded, failed — and what can be done about it.
 *
 * It does not upload. The product does, with whatever its API wants, and
 * passes back `files` with a status for each. That keeps the component out of
 * auth headers, signed URLs and retries-with-backoff, which are the product's
 * business and differ between the two.
 *
 * A status change is announced — "receipt.pdf: Uploaded" — because the bar
 * filling up is something a screen reader user otherwise never learns about.
 */
export function Upload({ files, onFiles, onRetry, onRemove, className, ...dropzone }: UploadProps) {
  const labels = useLabels();
  const locale = useLocale();

  const word: Record<UploadStatus, string> = {
    queued: labels.uploadQueued,
    uploading: labels.uploading,
    uploaded: labels.uploaded,
    failed: labels.uploadFailed,
  };

  // Announce only the ends — uploaded or failed. Announcing every percent
  // would talk over everything else.
  // null until the first render: what is already on screen then is not news.
  const previous = React.useRef<Map<string, UploadStatus> | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  React.useEffect(() => {
    const said: string[] = [];
    for (const f of files) {
      if (!previous.current) break;
      const was = previous.current.get(f.id);
      const ended = f.status === "uploaded" || f.status === "failed";
      // A file rejected before it ever uploaded — too big, wrong type — arrives
      // already failed, and is announced too.
      const arrivedFailed = was === undefined && f.status === "failed";
      if ((was !== undefined && was !== f.status && ended) || arrivedFailed) {
        said.push(labels.uploadStatusChanged(f.name, word[f.status]));
      }
    }
    previous.current = new Map(files.map((f) => [f.id, f.status]));
    // The same words twice — a retry that fails again — would not change the
    // live region and would not be read. A trailing zero-width space toggles
    // so the text always differs.
    if (said.length) setAnnouncement((prev) => said.join(". ") + (prev.endsWith("​") ? "" : "​"));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- word is derived from labels
  }, [files, labels]);

  return (
    <div className={cn("sui:flex sui:flex-col sui:gap-[12px]", className)}>
      <Dropzone onFiles={onFiles} {...dropzone} />
      {files.length > 0 && (
        <ul className="sui:m-0 sui:flex sui:list-none sui:flex-col sui:gap-[8px] sui:p-0">
          {files.map((f) => {
            const Icon = f.type?.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li
                key={f.id}
                className={cn(
                  "sui:flex sui:items-start sui:gap-[12px] sui:rounded-md sui:border sui:border-border sui:bg-surface sui:p-[12px]",
                  f.status === "failed" && "sui:border-bad",
                )}
              >
                <Icon size={18} aria-hidden className="sui:mt-[1px] sui:shrink-0 sui:text-fg-subtle" />
                <div className="sui:flex sui:min-w-0 sui:flex-1 sui:flex-col sui:gap-[6px]">
                  <div className="sui:flex sui:items-baseline sui:gap-[8px]">
                    <span className="sui:min-w-0 sui:truncate sui:text-sm sui:font-medium sui:text-fg">{f.name}</span>
                    <span className="sui:shrink-0 sui:text-xs sui:text-fg-subtle sui:tabular-nums">
                      {formatFileSize(f.size, locale)}
                    </span>
                    {/* The word, always: status is never colour alone. */}
                    <span
                      className={cn(
                        "sui:ml-auto sui:shrink-0 sui:text-xs",
                        f.status === "failed" ? "sui:text-bad-fg" : f.status === "uploaded" ? "sui:text-ok-fg" : "sui:text-fg-muted",
                      )}
                    >
                      {word[f.status]}
                    </span>
                  </div>
                  {f.status === "uploading" && (
                    <Progress value={f.progress ?? null} label={`${f.name}: ${labels.uploading}`} size="sm" />
                  )}
                  {f.status === "failed" && f.error && <p className="sui:m-0 sui:text-xs sui:text-bad-fg">{f.error}</p>}
                </div>
                {(onRetry && f.status === "failed") || onRemove ? (
                  <div className="sui:-my-[4px] sui:flex sui:shrink-0 sui:gap-[2px]">
                    {onRetry && f.status === "failed" && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        label={labels.retryUpload(f.name)}
                        icon={<RotateCcw size={14} />}
                        onClick={() => onRetry(f.id)}
                      />
                    )}
                    {onRemove && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        label={labels.removeFile(f.name)}
                        icon={<X size={14} />}
                        onClick={() => onRemove(f.id)}
                      />
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <span className="sui:sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
