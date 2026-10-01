import * as React from "react";
import { Popover } from "radix-ui";
import { useCombobox, useMultipleSelection } from "downshift";
import { ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels, useLocale } from "../ThemeProvider";
import { Field } from "../Field";
import { inputShell } from "../Input/Input";
import { OptionList, defaultFilter, type ComboboxOption } from "../Combobox/OptionList";
import { iconButton } from "../Combobox/Combobox";

export interface MultiSelectProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  id?: string;
  /** Submitted with a native form, once per chosen value. */
  name?: string;
  options: ComboboxOption[];
  /** The chosen values, in the order they were chosen. Controlled when passed. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], options: ComboboxOption[]) => void;
  /** Every keystroke. Fetch here when the options come from the server, and pass `filter={false}`. */
  onInputChange?: (text: string) => void;
  /** As Combobox. */
  filter?: boolean | ((options: ComboboxOption[], query: string, locale: string) => ComboboxOption[]);
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** Only when there is no visible label. */
  "aria-label"?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

/**
 * Several options out of a list too long for checkboxes: type to narrow,
 * Enter to add, and the choices sit in the field as removable tags.
 *
 * The list stays open while choosing — picking five categories is five
 * keystrokes, not five trips. Choosing a chosen option again removes it, and
 * so does Backspace from an empty field, one at a time.
 */
export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  {
    label,
    hint,
    error,
    optional,
    id: idProp,
    name,
    options,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    onInputChange,
    filter = true,
    loading,
    emptyMessage,
    placeholder,
    disabled,
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
  const [inner, setInner] = React.useState<string[]>(defaultValue);
  const value = controlled ? valueProp : inner;

  // Remembered for the same reason as Combobox: server results move on, the
  // chosen tags still need their names.
  const known = React.useRef(new Map<string, ComboboxOption>());
  for (const o of options) known.current.set(o.value, o);
  const chosen = value.map((v) => known.current.get(v) ?? { value: v, label: v });

  const [query, setQuery] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const items =
    filter === false
      ? options
      : (typeof filter === "function" ? filter : defaultFilter)(options, query, locale);

  const commit = (next: ComboboxOption[]) => {
    const values = next.map((o) => o.value);
    if (!controlled) setInner(values);
    onValueChange?.(values, next);
    setAnnouncement(labels.selectedCount(next.length));
  };

  const toggle = (option: ComboboxOption) =>
    commit(
      value.includes(option.value) ? chosen.filter((o) => o.value !== option.value) : [...chosen, option],
    );

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection<ComboboxOption>({
    selectedItems: chosen,
    itemToKey: (o) => o?.value,
    onSelectedItemsChange: ({ selectedItems }) => commit(selectedItems ?? []),
  });

  const { isOpen, highlightedIndex, getInputProps, getMenuProps, getItemProps, getToggleButtonProps, closeMenu } =
    useCombobox<ComboboxOption>({
      id: `${id}-combobox`,
      inputId: id,
      labelId: `${id}-label`,
      menuId: `${id}-listbox`,
      items,
      // Selection lives in useMultipleSelection; the combobox never holds one.
      selectedItem: null,
      inputValue: query,
      itemToString: (o) => o?.label ?? "",
      itemToKey: (o) => o?.value,
      isItemDisabled: (o) => Boolean(o.disabled),
      stateReducer: (_state, { type, changes }) => {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            // Keep the list open and the highlight where it was: the next
            // choice is probably the next row.
            return { ...changes, isOpen: true, highlightedIndex: _state.highlightedIndex, inputValue: "" };
          case useCombobox.stateChangeTypes.InputBlur:
            return { ...changes, inputValue: "" };
          default:
            return changes;
        }
      },
      onStateChange: ({ type, selectedItem, inputValue }) => {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            if (selectedItem) toggle(selectedItem);
            setQuery("");
            break;
          case useCombobox.stateChangeTypes.InputChange:
            setQuery(inputValue ?? "");
            onInputChange?.(inputValue ?? "");
            break;
          case useCombobox.stateChangeTypes.InputBlur:
            setQuery("");
            break;
        }
      },
    });

  const menuProps = getMenuProps({}, { suppressRefError: true });
  const { onKeyDown: dropdownKeyDown, ...dropdownProps } = getDropdownProps({
    ref,
    disabled,
    placeholder: chosen.length ? undefined : placeholder,
    onBlur,
    // Downshift turns off its tag keys while the list is open, so the arrows
    // belong to the list...
    preventKeyAction: isOpen,
    ...(label ? {} : { "aria-labelledby": undefined, "aria-label": ariaLabel }),
  }) as Record<string, unknown> & { onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void };
  const tall = {
    sm: "sui:min-h-[var(--control-height-sm)]",
    md: "sui:min-h-[var(--control-height-md)]",
    lg: "sui:min-h-[var(--control-height-lg)]",
  }[size];

  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(ids) => (
        <Popover.Root open={isOpen}>
          <Popover.Anchor asChild>
            <div
              className={cn(
                inputShell({ size }),
                "sui:h-auto sui:flex-wrap sui:gap-[6px] sui:py-[4px] sui:pr-[4px]",
                tall,
              )}
            >
              {chosen.map((option, index) => (
                <span
                  key={option.value}
                  {...(disabled ? {} : getSelectedItemProps({ selectedItem: option, index }))}
                  // Dimmed with the field; disabled controls are exempt from contrast, and this says so.
                  aria-disabled={disabled || undefined}
                  className={cn(
                    "sui:inline-flex sui:max-w-full sui:items-center sui:gap-[2px] sui:rounded-sm sui:bg-surface-sunken",
                    "sui:py-[2px] sui:pl-[8px] sui:pr-[2px] sui:text-sm sui:text-fg",
                  )}
                >
                  <span className="sui:truncate">{option.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={labels.removeItem(option.label)}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedItem(option);
                      }}
                      className={cn(iconButton, "sui:size-[20px]")}
                    >
                      <X size={13} aria-hidden />
                    </button>
                  )}
                </span>
              ))}
              <input
                {...getInputProps({
                  ...dropdownProps,
                  "aria-describedby": ids["aria-describedby"],
                  "aria-invalid": ids["aria-invalid"],
                  // ...but the list stays open between choices, so without this
                  // Backspace-to-remove would almost never work. Passed to the
                  // combobox, because getDropdownProps drops a handler while
                  // preventKeyAction is on.
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (isOpen && e.key === "Backspace" && query === "" && chosen.length > 0) {
                      removeSelectedItem(chosen[chosen.length - 1]);
                    }
                    dropdownKeyDown?.(e);
                  },
                })}
                autoComplete="off"
                className={cn(
                  "sui:min-w-[80px] sui:flex-1 sui:border-0 sui:bg-transparent sui:p-0 sui:focus-visible:outline-none",
                  "sui:text-[inherit] sui:placeholder:text-fg-subtle sui:disabled:cursor-not-allowed",
                )}
              />
              {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
              <button
                type="button"
                {...getToggleButtonProps({ disabled, tabIndex: -1, "aria-label": labels.showOptions })}
                className={cn(iconButton, "sui:ml-auto")}
              >
                <ChevronDown size={15} aria-hidden className={cn("sui:transition-transform", isOpen && "sui:rotate-180")} />
              </button>
            </div>
          </Popover.Anchor>
          {!isOpen && <ul {...menuProps} hidden />}
          {isOpen && (
            <OptionList
              items={items}
              isSelected={(o) => value.includes(o.value)}
              highlightedIndex={highlightedIndex}
              menuProps={{ ...menuProps, "aria-multiselectable": true }}
              getItemProps={getItemProps}
              onEscape={closeMenu}
              loading={loading}
              emptyMessage={emptyMessage}
            />
          )}
          <span className="sui:sr-only" aria-live="polite">
            {announcement}
          </span>
        </Popover.Root>
      )}
    </Field>
  );
});
