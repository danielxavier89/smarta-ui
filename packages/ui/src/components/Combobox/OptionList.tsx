import * as React from "react";
import { Popover } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels, ThemeScope } from "../ThemeProvider";
import { Spinner } from "../Spinner";

export interface ComboboxOption {
  value: string;
  label: string;
  /** A second, quieter line: an IBAN's last four, a category's account number. */
  description?: string;
  disabled?: boolean;
}

/** Case- and accent-insensitive, so "uber" finds "Über" and "conceicao" finds "Conceição". */
export function fold(text: string, locale: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase(locale);
}

export function defaultFilter(options: ComboboxOption[], query: string, locale: string) {
  const q = fold(query.trim(), locale);
  if (!q) return options;
  return options.filter((o) => fold(`${o.label} ${o.description ?? ""}`, locale).includes(q));
}

/**
 * The floating half of Combobox and MultiSelect: a listbox in a popover.
 *
 * Downshift owns the state and the keyboard; Radix only positions the box and
 * portals it out of whatever is clipping the field (a Dialog, a table cell).
 * The Content mounts only while open: a mounted Radix layer is the topmost
 * one, and a hidden one would swallow the Escape meant for the Dialog the
 * field sits in. Downshift's getMenuProps is called by the parent on every
 * render, as it insists, and its ref attaches whenever the list exists.
 */
export function OptionList({
  items,
  isSelected,
  highlightedIndex,
  menuProps,
  getItemProps,
  onEscape,
  loading,
  emptyMessage,
}: {
  items: ComboboxOption[];
  isSelected: (o: ComboboxOption) => boolean;
  highlightedIndex: number;
  // Downshift's props and getters, typed loosely so both hooks can pass theirs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuProps: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemProps: (...args: any[]) => any;
  /** Radix sees Escape first, as the topmost layer; this hands it back. */
  onEscape: () => void;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
}) {
  const labels = useLabels();
  const message = loading ? null : items.length === 0 ? (emptyMessage ?? labels.noMatches) : null;

  return (
    <Popover.Portal>
      <ThemeScope>
        <Popover.Content
          // A box around the listbox, not a dialog: focus never enters it.
          role="presentation"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          // Focus stays in the input the whole time: that is the pattern.
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            onEscape();
          }}
          // Downshift decides what a click outside means; Radix only places the box.
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "sui:z-[var(--z-dropdown)] sui:w-[var(--radix-popover-trigger-width)] sui:min-w-[200px]",
            "sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised sui:shadow-lg sui:p-[4px]",
          )}
        >
          <ul
            {...menuProps}
            className={cn(
              "sui:m-0 sui:max-h-[min(320px,var(--radix-popover-content-available-height))] sui:list-none sui:overflow-y-auto sui:p-0",
              // An empty listbox is an invalid one; the message below stands in for it.
              items.length === 0 && "sui:hidden",
            )}
          >
            {items.map((item, index) => {
              const selected = isSelected(item);
              return (
                <li
                  key={item.value}
                  {...getItemProps({ item, index, disabled: item.disabled })}
                  aria-selected={selected}
                  className={cn(
                    "sui:flex sui:cursor-pointer sui:items-start sui:gap-[8px] sui:rounded-md sui:px-[10px] sui:py-[7px] sui:text-sm sui:text-fg",
                    highlightedIndex === index && "sui:bg-surface-hover",
                    item.disabled && "sui:cursor-not-allowed sui:text-fg-subtle",
                  )}
                >
                  <Check
                    size={15}
                    aria-hidden
                    className={cn("sui:mt-[2px] sui:shrink-0 sui:text-accent", !selected && "sui:invisible")}
                  />
                  <span className="sui:flex sui:min-w-0 sui:flex-col">
                    <span className="sui:truncate">{item.label}</span>
                    {item.description && (
                      <span className="sui:truncate sui:text-xs sui:text-fg-muted">{item.description}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          {loading && (
            <p
              role="status"
              className="sui:m-0 sui:flex sui:items-center sui:gap-[8px] sui:px-[10px] sui:py-[7px] sui:text-sm sui:text-fg-muted"
            >
              <Spinner size={14} label="" />
              {labels.loadingOptions}
            </p>
          )}
          {message && (
            <p role="status" className="sui:m-0 sui:px-[10px] sui:py-[7px] sui:text-sm sui:text-fg-muted">
              {message}
            </p>
          )}
        </Popover.Content>
      </ThemeScope>
    </Popover.Portal>
  );
}
