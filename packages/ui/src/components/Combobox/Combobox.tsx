import * as React from "react";
import { Popover } from "radix-ui";
import { useCombobox } from "downshift";
import { ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels, useLocale } from "../ThemeProvider";
import { Field } from "../Field";
import { inputShell } from "../Input/Input";
import { OptionList, defaultFilter, type ComboboxOption } from "./OptionList";

export type { ComboboxOption };

export interface ComboboxProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  id?: string;
  /** Submitted with a native form, as the chosen option's value. */
  name?: string;
  options: ComboboxOption[];
  /** The chosen option's value, or null. Controlled when passed. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
  /** Every keystroke. Fetch here when the options come from the server, and pass `filter={false}`. */
  onInputChange?: (text: string) => void;
  /**
   * How typed text narrows the options. The default matches anywhere in the
   * label or description, ignoring case and accents. `false` leaves it to the
   * product — the options it passes are already the results.
   */
  filter?: boolean | ((options: ComboboxOption[], query: string, locale: string) => ComboboxOption[]);
  /** The options are on their way. Says so in the list. */
  loading?: boolean;
  /** What the list says when nothing matches. Defaults to the `noMatches` label. */
  emptyMessage?: React.ReactNode;
  placeholder?: string;
  /** Shows a clear button while something is chosen. Default true. */
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  /** Only when there is no visible label — a filter in a table toolbar. */
  "aria-label"?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

/**
 * One option out of more than a Select can show: type to narrow, arrow to
 * choose. Built on downshift, so the keyboard and the ARIA are the
 * combobox pattern rather than an approximation of it.
 *
 * It chooses from the list and nothing else. Leaving the field with text that
 * matches no option puts the chosen option's name back; clearing the text and
 * leaving clears the choice.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    hint,
    error,
    optional,
    id: idProp,
    name,
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    onInputChange,
    filter = true,
    loading,
    emptyMessage,
    placeholder,
    clearable = true,
    disabled,
    required,
    size = "md",
    "aria-label": ariaLabel,
    onBlur,
    className,
  },
  ref,
) {
  const labels = useLabels();
  const locale = useLocale();
  const reactId = React.useId();
  const id = idProp ?? reactId;

  const controlled = valueProp !== undefined;
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const value = controlled ? (valueProp ?? null) : inner;

  // The chosen option is remembered, not only looked up: with server-side
  // search, the option the person chose is gone from `options` by the next
  // keystroke, and its name still has to show.
  const remembered = React.useRef<ComboboxOption | null>(null);
  const selected =
    value === null
      ? null
      : (options.find((o) => o.value === value) ??
        (remembered.current?.value === value ? remembered.current : null));
  if (selected) remembered.current = selected;

  // The text typed since the list opened. Kept apart from the input's value,
  // so opening a field that shows "Lisboa" lists everything, not just Lisboa.
  const [query, setQuery] = React.useState("");
  const items =
    filter === false
      ? options
      : (typeof filter === "function" ? filter : defaultFilter)(options, query, locale);

  const choose = (option: ComboboxOption | null) => {
    if (!controlled) setInner(option?.value ?? null);
    remembered.current = option;
    onValueChange?.(option?.value ?? null, option);
  };

  const {
    isOpen,
    inputValue,
    highlightedIndex,
    getInputProps,
    getMenuProps,
    getItemProps,
    getToggleButtonProps,
    setInputValue,
    closeMenu,
  } = useCombobox<ComboboxOption>({
    id: `${id}-combobox`,
    inputId: id,
    labelId: `${id}-label`,
    menuId: `${id}-listbox`,
    items,
    selectedItem: selected,
    itemToString: (o) => o?.label ?? "",
    itemToKey: (o) => o?.value,
    isItemDisabled: (o) => Boolean(o.disabled),
    onSelectedItemChange: ({ selectedItem }) => choose(selectedItem ?? null),
    onInputValueChange: ({ inputValue, type }) => {
      if (type === useCombobox.stateChangeTypes.InputChange) {
        setQuery(inputValue ?? "");
        onInputChange?.(inputValue ?? "");
      }
    },
    onIsOpenChange: ({ isOpen: open }) => {
      if (!open) setQuery("");
    },
    stateReducer: (state, { type, changes }) => {
      switch (type) {
        // Escape closes the list. With the list already closed, downshift
        // would also wipe the saved choice; one stray key should not.
        case useCombobox.stateChangeTypes.InputKeyDownEscape:
          return state.isOpen ? changes : { ...changes, selectedItem: state.selectedItem, inputValue: state.inputValue };
        // Leaving without choosing: emptied text clears the choice, any other
        // text gives way to the chosen option's name. It picks from the list.
        case useCombobox.stateChangeTypes.InputBlur:
          if (changes.selectedItem !== state.selectedItem) return changes;
          if (state.inputValue.trim() === "") return { ...changes, selectedItem: null, inputValue: "" };
          return { ...changes, inputValue: state.selectedItem?.label ?? "" };
        default:
          return changes;
      }
    },
  });

  const menuProps = getMenuProps({}, { suppressRefError: true });

  // Downshift only settles the text on blur while the list is open. Closed —
  // after Escape, or typing with the list dismissed — the same rule applies.
  const settleClosed = () => {
    if (isOpen) return;
    if (inputValue.trim() === "") {
      if (selected) choose(null);
    } else if (inputValue !== (selected?.label ?? "")) {
      setInputValue(selected?.label ?? "");
    }
  };

  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(ids) => (
        <Popover.Root open={isOpen}>
          <Popover.Anchor asChild>
            <div className={cn(inputShell({ size }), "sui:pr-[4px]")}>
              <input
                {...getInputProps({
                  ref,
                  disabled,
                  required,
                  placeholder,
                  // Arriving by keyboard selects the chosen name, so typing replaces it
                  // rather than searching for "Internetkostenkosten".
                  onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select(),
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    settleClosed();
                    onBlur?.(e);
                  },
                  "aria-describedby": ids["aria-describedby"],
                  "aria-invalid": ids["aria-invalid"],
                  ...(label ? {} : { "aria-labelledby": undefined, "aria-label": ariaLabel }),
                })}
                autoComplete="off"
                className={cn(
                  "sui:w-full sui:min-w-0 sui:border-0 sui:bg-transparent sui:p-0 sui:focus-visible:outline-none",
                  "sui:text-[inherit] sui:placeholder:text-fg-subtle sui:disabled:cursor-not-allowed",
                )}
              />
              {name && <input type="hidden" name={name} value={value ?? ""} />}
              {clearable && selected && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={labels.clearValue}
                  onClick={() => {
                    choose(null);
                    setInputValue("");
                  }}
                  className={iconButton}
                >
                  <X size={15} aria-hidden />
                </button>
              )}
              <button
                type="button"
                {...getToggleButtonProps({ disabled, tabIndex: -1, "aria-label": labels.showOptions })}
                className={iconButton}
              >
                <ChevronDown size={15} aria-hidden className={cn("sui:transition-transform", isOpen && "sui:rotate-180")} />
              </button>
            </div>
          </Popover.Anchor>
          {/* Called on every render, as downshift insists; the list mounts only while open. */}
          {!isOpen && <ul {...menuProps} hidden />}
          {isOpen && (
            <OptionList
              items={items}
              isSelected={(o) => o.value === value}
              highlightedIndex={highlightedIndex}
              menuProps={menuProps}
              getItemProps={getItemProps}
              onEscape={closeMenu}
              loading={loading}
              emptyMessage={emptyMessage}
            />
          )}
        </Popover.Root>
      )}
    </Field>
  );
});

export const iconButton = cn(
  "sui-touch-target sui:grid sui:size-[28px] sui:shrink-0 sui:place-items-center sui:rounded-sm",
  "sui:border-0 sui:bg-transparent sui:p-0 sui:text-fg-subtle sui:cursor-pointer",
  "sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:cursor-not-allowed",
);
