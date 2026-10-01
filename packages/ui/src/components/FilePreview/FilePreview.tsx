import * as React from "react";
import { Download, ExternalLink, FileText, Maximize, Minimize } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatFileSize } from "../../lib/format";
import { useLabels, useLocale } from "../ThemeProvider";
import { IconButton } from "../IconButton";

export interface FilePreviewProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Where the file is. A signed URL, an object URL — anything an <img> or <iframe> can load. */
  src: string;
  /** The file's name. Heads the frame and names the image or document. */
  name: string;
  /** The content type. Decides image, PDF or "can't be previewed". Guessed from the name when omitted. */
  type?: string;
  /** Bytes, shown beside the name. */
  size?: number;
  /** The frame's height. Default 480px; a Panel usually wants "100%". */
  height?: number | string;
  /** Hide the download link — when the product must log downloads through its own route. */
  downloadable?: boolean;
}

function kindOf(type: string | undefined, name: string): "image" | "pdf" | "other" {
  const t = type ?? "";
  if (t.startsWith("image/") || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name)) return "image";
  if (t === "application/pdf" || /\.pdf$/i.test(name)) return "pdf";
  return "other";
}

/**
 * A receipt, an invoice, a contract — shown in place, next to the thing it
 * proves, with a way out to a full tab and a download.
 *
 * Images fit the frame and can be shown at actual size to read the small
 * print. PDFs use the browser's own viewer in an iframe: it already has
 * paging, search and zoom, and anything we drew would be worse. Anything else
 * says it can't be previewed and offers the download, rather than a broken
 * frame.
 */
export function FilePreview({
  src,
  name,
  type,
  size,
  height = 480,
  downloadable = true,
  className,
  ...props
}: FilePreviewProps) {
  const labels = useLabels();
  const locale = useLocale();
  const kind = kindOf(type, name);
  const [actual, setActual] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => setBroken(false), [src]);

  return (
    <figure
      className={cn(
        "sui:m-0 sui:flex sui:min-w-0 sui:flex-col sui:overflow-hidden sui:rounded-lg sui:border sui:border-border sui:bg-surface",
        className,
      )}
      {...props}
    >
      <figcaption className="sui:flex sui:items-center sui:gap-[8px] sui:border-b sui:border-border sui:py-[6px] sui:pl-[12px] sui:pr-[6px]">
        <span className="sui:min-w-0 sui:truncate sui:text-sm sui:font-medium sui:text-fg">{name}</span>
        {size !== undefined && (
          <span className="sui:shrink-0 sui:text-xs sui:text-fg-subtle sui:tabular-nums">{formatFileSize(size, locale)}</span>
        )}
        <span className="sui:ml-auto sui:flex sui:shrink-0 sui:gap-[2px]">
          {kind === "image" && !broken && (
            <IconButton
              variant="ghost"
              size="sm"
              label={actual ? labels.fitToFrame : labels.zoomIn}
              icon={actual ? <Minimize size={14} /> : <Maximize size={14} />}
              onClick={() => setActual((a) => !a)}
            />
          )}
          <IconButton
            asChild
            variant="ghost"
            size="sm"
            label={labels.openInNewTab}
            icon={<ExternalLink size={14} />}
          >
            <a href={src} target="_blank" rel="noopener noreferrer" />
          </IconButton>
          {downloadable && (
            <IconButton asChild variant="ghost" size="sm" label={labels.download} icon={<Download size={14} />}>
              <a href={src} download={name} />
            </IconButton>
          )}
        </span>
      </figcaption>
      <div
        className={cn(
          "sui:relative sui:min-h-0 sui:bg-surface-sunken",
          kind === "image" && actual ? "sui:overflow-auto" : "sui:overflow-hidden",
        )}
        style={{ height }}
        // Scrollable at actual size, so it has to be reachable to scroll by keyboard.
        tabIndex={kind === "image" && actual ? 0 : undefined}
        role={kind === "image" && actual ? "region" : undefined}
        aria-label={kind === "image" && actual ? name : undefined}
      >
        {kind === "image" && !broken ? (
          <img
            src={src}
            alt={name}
            onError={() => setBroken(true)}
            className={cn(
              "sui:block",
              actual ? "sui:max-w-none" : "sui:mx-auto sui:h-full sui:w-full sui:object-contain",
            )}
          />
        ) : kind === "pdf" ? (
          <iframe src={src} title={name} className="sui:block sui:h-full sui:w-full sui:border-0" />
        ) : (
          <div className="sui:flex sui:h-full sui:flex-col sui:items-center sui:justify-center sui:gap-[8px] sui:p-[24px] sui:text-center">
            <FileText size={28} aria-hidden className="sui:text-fg-subtle" />
            <p className="sui:m-0 sui:text-sm sui:text-fg-muted">{labels.previewUnavailable}</p>
          </div>
        )}
      </div>
    </figure>
  );
}
