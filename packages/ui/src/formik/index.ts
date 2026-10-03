/**
 * Formik, wired to the library's fields: `import { … } from "@smarta/ui/formik"`.
 *
 * Hooks rather than a FormikInput, FormikSelect, FormikDatePicker… — one
 * wrapper per field is a second API to keep in step with the first, and it
 * hides the field's own props behind the wrapper's. A hook returns the props;
 * the field stays the field:
 *
 *   const email = useFormikField("email");
 *   <Input label="Email" {...email} />
 *
 *   const amount = useFormikValue<number | null>("amount");
 *   <CurrencyInput label="Amount" {...amount} />
 *
 * The error each hook returns follows the house validation rule — silent while
 * typing, on blur, then live — which is Formik's `touched`: an untouched field
 * shows nothing, a field that has been left shows its error, and from then on
 * the error updates as the person types. A submit touches every field, so a
 * submit shows every error at once.
 *
 * Formik is an optional peer dependency. A product that does not use it never
 * imports this entry and never needs it installed.
 */
import * as React from "react";
import { useField, useFormikContext, getIn, type FieldValidator } from "formik";

function useShownError(name: string): string | undefined {
  const { errors, touched, submitCount } = useFormikContext<Record<string, unknown>>();
  const error = getIn(errors, name);
  const wasTouched = Boolean(getIn(touched, name)) || submitCount > 0;
  // A nested error object (an array field's) is not a message; leave it to its children.
  return wasTouched && typeof error === "string" ? error : undefined;
}

/**
 * For the native-event fields: Input, Textarea, Select, SearchInput.
 * Spreads `name`, `value`, `onChange`, `onBlur` and `error`.
 */
/**
 * Declared, not inferred: inferred, the emitted .d.ts copied Formik's handler
 * types as resolved against React 19's — `ChangeEvent<any, Element>`, two type
 * arguments — and a React 18 product's typecheck failed on our declarations.
 */
export interface FormikFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onBlur: (e: React.FocusEvent<any>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  error: string | undefined;
}

export interface FormikValueProps<V> {
  name: string;
  value: V;
  onValueChange: (value: V) => void;
  onBlur: () => void;
  error: string | undefined;
}

export interface FormikCheckboxProps {
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | "indeterminate") => void;
  onBlur: () => void;
  error: string | undefined;
}

export function useFormikField(name: string, options?: { validate?: FieldValidator }): FormikFieldProps {
  const [field] = useField<string>({ name, validate: options?.validate });
  const error = useShownError(name);
  return {
    name: field.name,
    // A field that starts as undefined is uncontrolled, then controlled, and React says so.
    value: field.value ?? "",
    onChange: field.onChange,
    onBlur: field.onBlur,
    error,
  };
}

/**
 * For the value fields: InputNumber, CurrencyInput, DatePicker,
 * DateRangePicker, Combobox, MultiSelect, RadioGroup, SegmentedControl.
 * Spreads `name`, `value`, `onValueChange`, `onBlur` and `error`.
 */
export function useFormikValue<V>(name: string): FormikValueProps<V> {
  const [field, , helpers] = useField<V>(name);
  const error = useShownError(name);
  // Stable, so a field memoising on its handlers does not re-render on every keystroke elsewhere.
  const { setValue, setTouched } = helpers;
  const onValueChange = React.useCallback((value: V) => void setValue(value), [setValue]);
  const onBlur = React.useCallback(() => void setTouched(true), [setTouched]);
  return { name: field.name, value: field.value, onValueChange, onBlur, error };
}

/**
 * For Checkbox and Switch-shaped fields holding a boolean.
 * Spreads `name`, `checked`, `onCheckedChange`, `onBlur` and `error`.
 */
export function useFormikCheckbox(name: string): FormikCheckboxProps {
  const [field, , helpers] = useField<boolean>(name);
  const error = useShownError(name);
  const { setValue, setTouched } = helpers;
  const onCheckedChange = React.useCallback((v: boolean | "indeterminate") => void setValue(v === true), [setValue]);
  const onBlur = React.useCallback(() => void setTouched(true), [setTouched]);
  return { name: field.name, checked: Boolean(field.value), onCheckedChange, onBlur, error };
}

/**
 * For the submit button: `<Button type="submit" {...useFormikSubmit()}>`.
 * Busy while Formik submits, so the label stays and the button cannot be
 * pressed twice.
 */
export function useFormikSubmit(): { loading: boolean } {
  const { isSubmitting } = useFormikContext();
  return { loading: isSubmitting };
}
