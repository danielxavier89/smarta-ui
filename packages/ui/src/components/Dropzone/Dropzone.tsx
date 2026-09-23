import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";
import { TextLink } from "../TextLink";

export interface DropzoneProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onDrop" | "children"> {
  onFiles: (files: File[]) => void;
  /** Passed straight to the input, e.g. "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Replaces the default line. Say what belongs here, not "Drop files". */
  label?: React.ReactNode;
  /** What is allowed: "JPG, PNG or PDF, up to 10 MB". */
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Renders the busy state; the zone stops accepting drops. */
  uploading?: boolean;
  children?: React.ReactNode;
}

/**
 * A drop target that is also a file input.
 *
 * Drag is the affordance, not the requirement: the whole zone is clickable and
 * reachable by keyboard, because dragging a file is impossible on a phone and
 * awkward with a screen reader.
 *
 * The zone is a <label> owning a real file input, not a div with
 * role="button". The div version failed axe twice over, and both were real:
 * the input inside it had no accessible name, and an interactive wrapper
 * containing an interactive input is nested-interactive, which leaves screen
 * readers disagreeing about what the control even is. A label gives the input
 * its name from the visible text, opens the picker natively on click, and
 * needs no key handler of its own — Enter and Space on a focused file input
 * already open it.
 */
export function Dropzone({
  className,
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  label,
  hint,
  error,
  uploading = false,
  children,
  ...props
}: DropzoneProps) {
  const labels = useLabels();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const blocked = disabled || uploading;

  // A counter, not a boolean: dragleave fires when the pointer crosses onto a
  // child element, so a boolean flickers the highlight off mid-drag.
  const depth = React.useRef(0);

  const handleFiles = (list: FileList | null) => {
    if (!list || blocked) return;
    const files = Array.from(list);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  const hintId = React.useId();
  const errorId = React.useId();
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-[6px]">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- the
          input is a child, which is the association. */}
      <label
        aria-disabled={blocked || undefined}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current += 1;
          if (!blocked) setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          depth.current -= 1;
          if (depth.current <= 0) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-[6px] text-center",
          "rounded-lg border-[length:var(--border-width-strong)] border-dashed border-border",
          "bg-surface px-[24px] py-[26px] text-sm text-fg-subtle",
          "transition-[border-color,background-color] duration-[var(--duration-fast)]",
          !blocked && "cursor-pointer hover:border-border-strong",
          // The input takes the focus and is visually hidden, so the zone draws
          // the ring on its behalf.
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring",
          over && "border-accent bg-accent-soft",
          error && "border-bad",
          blocked && "cursor-not-allowed opacity-60",
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <UploadCloud size={22} aria-hidden className="text-fg-faint" />
            <p className="m-0 text-base text-fg">
              {label ?? labels.dropFiles}{" "}
              <TextLink asChild>
                <span>{labels.chooseFiles}</span>
              </TextLink>
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={blocked}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset so choosing the same file twice still fires a change.
            e.target.value = "";
          }}
        />
      </label>

      {/* Outside the label on purpose: anything inside it becomes part of the
          input's accessible name, and a name that recites the size limit is
          read out in full every time the control takes focus. */}
      {hint && (
        <p id={hintId} className="m-0 text-xs text-fg-subtle">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-bad-fg">
          {error}
        </p>
      )}
    </div>
  );
}
