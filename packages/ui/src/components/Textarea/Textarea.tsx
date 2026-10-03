import * as React from "react";
import { cn } from "../../lib/utils";
import { Field } from "../Field";

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
              "sui:w-full sui:rounded-md sui:border sui:border-border sui:bg-surface",
              "sui:px-[var(--control-padding-x-md)] sui:py-[8px] sui:text-[length:var(--field-font-size)] sui:text-fg",
              "sui:placeholder:text-fg-subtle sui:resize-y",
              "sui:transition-[border-color,box-shadow] sui:duration-[var(--duration-fast)]",
              "sui:focus-visible:outline-none sui:focus:border-accent sui:focus:shadow-focus",
              "sui:disabled:bg-surface-sunken sui:disabled:opacity-70 sui:disabled:cursor-not-allowed",
              "sui:aria-[invalid=true]:border-bad sui:aria-[invalid=true]:focus:shadow-none",
              autoResize && "sui:resize-none sui:overflow-hidden",
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
