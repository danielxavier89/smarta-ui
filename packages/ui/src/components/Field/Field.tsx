import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/Label";

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: React.ReactNode;
  /** Steady guidance. Always visible, sits under the control. */
  hint?: React.ReactNode;
  /** A problem with what was entered. Replaces the hint while it is set. */
  error?: React.ReactNode;
  optional?: boolean;
  /**
   * Receives the ids the control has to carry. Render-prop rather than
   * cloneElement, so the wiring is visible at the call site instead of
   * happening to a child behind its back.
   */
  children: (ids: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
  }) => React.ReactNode;
  id?: string;
}

/**
 * Label, control, and the one line underneath — wired together so the
 * description and the error actually reach a screen reader.
 *
 * Every field-shaped component in this library is built on it, and it is
 * exported so a product can build one more without re-deriving the aria.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  className,
  children,
  id: idProp,
  ...props
}: FieldProps) {
  const reactId = React.useId();
  const id = idProp ?? reactId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  // The error replaces the hint rather than stacking with it: two lines of
  // small print under one input is where people stop reading either.
  const describedBy = errorId ?? hintId;

  return (
    <div className={cn("flex flex-col gap-[6px]", className)} {...props}>
      {label && (
        <Label htmlFor={id} optional={optional}>
          {label}
        </Label>
      )}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error ? (
        <p id={errorId} className="text-xs text-bad-fg" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
