import * as React from "react";
import { cn } from "@/lib/utils";
import { Field } from "@/components/Field";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  /** Grows with the content instead of scrolling inside a fixed box. */
  autoResize?: boolean;
  /** Shows "n / max" under the box. Requires maxLength. */
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      containerClassName,
      label,
      hint,
      error,
      optional,
      autoResize = false,
      showCount = false,
      maxLength,
      rows = 4,
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const [count, setCount] = React.useState(
      String(value ?? defaultValue ?? "").length,
    );

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      // Reset first: without it the box can only ever grow, because scrollHeight
      // is measured against the height we set on the previous keystroke.
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(resize, [resize, value]);

    const countHint =
      showCount && maxLength ? `${count} / ${maxLength}` : undefined;

    return (
      <Field
        label={label}
        hint={error ? undefined : (hint ?? countHint)}
        error={error}
        optional={optional}
        id={id}
        className={containerClassName}
      >
        {(ids) => (
          <textarea
            ref={innerRef}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              setCount(e.target.value.length);
              resize();
              onChange?.(e);
            }}
            className={cn(
              "w-full rounded-md border border-border bg-surface",
              "px-[var(--control-padding-x-md)] py-[8px] text-base text-fg",
              "placeholder:text-fg-subtle resize-y",
              "transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
              "outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]",
              "disabled:bg-surface-sunken disabled:opacity-70 disabled:cursor-not-allowed",
              "aria-[invalid=true]:border-bad aria-[invalid=true]:focus:shadow-none",
              autoResize && "resize-none overflow-hidden",
              className,
            )}
            {...ids}
            {...props}
          />
        )}
      </Field>
    );
  },
);
