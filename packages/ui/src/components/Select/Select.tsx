import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Field } from "../Field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Renders inside an <optgroup> with this heading. */
  group?: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "children"> {
  options: SelectOption[];
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  /** The "nothing chosen yet" row. Omit when a value is always set. */
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

/**
 * A native <select>, styled.
 *
 * Deliberately not a Radix listbox. Both prototypes settled on native selects
 * and native date inputs: on a phone the platform picker is better than
 * anything we would build, it needs no portal, no focus trap and no scroll
 * lock, and it cannot be the reason a form is unusable with a keyboard.
 *
 * Use DropdownMenu instead when the items are *actions* rather than a value —
 * a menu that runs something is not a select that stores something.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    containerClassName,
    options,
    label,
    hint,
    error,
    optional,
    placeholder,
    size = "md",
    id,
    ...props
  },
  ref,
) {
  const groups = React.useMemo(() => {
    const out: Array<{ name?: string; items: SelectOption[] }> = [];
    for (const opt of options) {
      const last = out[out.length - 1];
      if (last && last.name === opt.group) last.items.push(opt);
      else out.push({ name: opt.group, items: [opt] });
    }
    return out;
  }, [options]);

  const heights = {
    sm: "sui:h-[var(--control-height-sm)] sui:pl-[var(--control-padding-x-sm)] sui:text-[length:var(--field-font-size-sm)]",
    md: "sui:h-[var(--control-height-md)] sui:pl-[var(--control-padding-x-md)] sui:text-[length:var(--field-font-size)]",
    lg: "sui:h-[var(--control-height-lg)] sui:pl-[var(--control-padding-x-lg)] sui:text-[length:var(--field-font-size)]",
  }[size];

  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={containerClassName}>
      {(ids) => (
        <div className="sui:relative">
          <select
            ref={ref}
            className={cn(
              "sui:w-full sui:appearance-none sui:rounded-md sui:border sui:border-border sui:bg-surface",
              "sui:pr-[34px] sui:text-fg sui:focus-visible:outline-none sui:cursor-pointer",
              "sui:transition-[border-color,box-shadow] sui:duration-[var(--duration-fast)]",
              "sui:focus:border-accent sui:focus:shadow-focus",
              "sui:disabled:bg-surface-sunken sui:disabled:opacity-70 sui:disabled:cursor-not-allowed",
              "sui:aria-[invalid=true]:border-bad sui:aria-[invalid=true]:focus:shadow-none",
              heights,
              className,
            )}
            {...ids}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {groups.map((g, gi) =>
              g.name ? (
                <optgroup key={g.name} label={g.name}>
                  {g.items.map((o) => (
                    <option key={o.value} value={o.value} disabled={o.disabled}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                g.items.map((o) => (
                  <option key={`${gi}-${o.value}`} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))
              ),
            )}
          </select>
          <ChevronDown
            size={15}
            aria-hidden
            className="sui:pointer-events-none sui:absolute sui:right-[11px] sui:top-1/2 sui:-translate-y-1/2 sui:text-fg-subtle"
          />
        </div>
      )}
    </Field>
  );
});
