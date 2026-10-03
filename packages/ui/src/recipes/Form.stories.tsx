import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik, Form } from "formik";
import { Button } from "../components/Button";
import { Combobox } from "../components/Combobox";
import { CurrencyInput } from "../components/CurrencyInput";
import { DatePicker } from "../components/DatePicker";
import { MultiSelect } from "../components/MultiSelect";
import { useFormikField, useFormikValue, useFormikSubmit } from "../formik";
import { Callout } from "../components/Callout";
import { Input } from "../components/Input";
import { RadioGroup } from "../components/RadioGroup";
import { Select } from "../components/Select";
import { Textarea } from "../components/Textarea";
import { TextLink } from "../components/TextLink";
import { docsPage } from "../lib/docs";
import recipe from "../../docs/recipes/form.md?raw";

/**
 * The form recipe, running — validation timing included, because that is the
 * part prose has never once successfully conveyed. Type six digits into the NIF
 * field and tab away, then fix it: the error arrives on blur and clears on the
 * keystroke that fixes it, not on the next blur.
 */
const meta: Meta = {
  title: "Recipes/A form",
  parameters: {
    layout: "padded",
    ...docsPage(recipe),
  },
};
export default meta;
type Story = StoryObj;

const LAENDER = [
  { value: "be", label: "Berlin" },
  { value: "by", label: "Bayern" },
  { value: "hh", label: "Hamburg" },
  { value: "nw", label: "Nordrhein-Westfalen" },
];

/**
 * The house validation pattern, as a hook, so a screen cannot get the timing
 * wrong by accident: silent while first typed in, validates on blur, then goes
 * live on every keystroke once it has something to say.
 */
function useValidatedField(initial: string, validate: (v: string) => string | undefined) {
  const [value, setValue] = React.useState(initial);
  const [touched, setTouched] = React.useState(false);
  const message = validate(value);

  return {
    value,
    error: touched ? message : undefined,
    valid: !message,
    props: {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
      onBlur: () => setTouched(true),
    },
  };
}

export const TheScreen: Story = {
  name: "The screen",
  render: function TheScreen() {
    const name = useValidatedField("", (v) =>
      v.trim().length === 0 ? "A company needs a legal name to be registered." : undefined,
    );

    const nif = useValidatedField("503214", (v) =>
      v.replace(/\s/g, "").length === 9
        ? undefined
        : `A NIF is nine digits. This one has ${v.replace(/\s/g, "").length}.`,
    );

    const [land, setLand] = React.useState("");
    const [paid, setPaid] = React.useState("company");
    const [note, setNote] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      window.setTimeout(() => {
        setSaving(false);
        setFailed(true);
      }, 1200);
    };

    return (
      <form onSubmit={onSubmit} className="sui:flex sui:max-w-[420px] sui:flex-col sui:gap-[16px]">
        {/* A rule that applies before they start, not after they fail. */}
        <Callout tone="neutral" title="May 2026 is closed">
          <p>
            Ana filed it on 18 June, so this company starts in June. You can{" "}
            <TextLink>ask her to reopen May</TextLink> if the date matters.
          </p>
        </Callout>

        <Input label="Company name" placeholder="Marcondes & Vale, Lda" {...name.props} error={name.error} />

        <Input
          label="NIF"
          hint="Nine digits, no spaces."
          {...nif.props}
          error={nif.error}
        />

        <Input label="Trading name" optional hint="Only if it differs from the legal name." />

        <Select
          label="Bundesland"
          placeholder="Choose one"
          options={LAENDER}
          value={land}
          onChange={(e) => setLand(e.target.value)}
        />

        <RadioGroup
          label="How was this asset paid for?"
          appearance="card"
          value={paid}
          onValueChange={setPaid}
          options={[
            { value: "company", label: "From the company account", description: "The charge is already on the statement." },
            { value: "personal", label: "Privately, to be reimbursed", description: "We will add it to the next expense run." },
          ]}
        />

        <Textarea
          label="What should Ana know?"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="One or two sentences is plenty."
        />

        {/* Failure lands in place, above the actions, alongside the field
            errors — never only a toast, which leaves before it can be acted on. */}
        {failed && (
          <Callout tone="bad" title="We could not save this">
            <p>That NIF is already on another company. Check it, or ask Ana which one is right.</p>
          </Callout>
        )}

        <div className="sui:flex sui:gap-[8px]">
          <Button variant="ghost" type="button">Cancel</Button>
          <Button variant="primary" type="submit" loading={saving} className="sui:ml-auto">
            Convert Petra
          </Button>
        </div>

        <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">
          One primary, and it names the outcome. &ldquo;Submit&rdquo; tells the user what
          they are doing to the form; &ldquo;Convert Petra&rdquo; tells them what happens
          to Petra.
        </p>
      </form>
    );
  },
};

export const ValidationTiming: Story = {
  name: "Validation, exactly",
  parameters: {
    docs: {
      description: {
        story:
          "The rule in three steps: silent while the field is first typed in, validate on blur, then re-validate on every keystroke once an error is showing. Tab into the field below, type four digits, tab out — then fix it and watch the message clear without blurring again. Getting step three wrong is what makes a form feel like it is arguing with you.",
      },
    },
  },
  render: function ValidationTiming() {
    const nif = useValidatedField("", (v) =>
      v.replace(/\s/g, "").length === 9
        ? undefined
        : `A NIF is nine digits. This one has ${v.replace(/\s/g, "").length}.`,
    );

    return (
      <div className="sui:flex sui:max-w-[420px] sui:flex-col sui:gap-[14px]">
        <Input label="NIF" hint="Nine digits, no spaces." {...nif.props} error={nif.error} />
        <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">
          The error replaces the hint rather than stacking under it. Two lines of small
          print beneath one field is where people stop reading either of them.
        </p>
        <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">
          Note what the message says: what a NIF is, and what is wrong with this one. Not
          &ldquo;Invalid input&rdquo;, which tells the user only that the computer is
          unhappy.
        </p>
      </div>
    );
  },
};

/**
 * The same timing, with Formik doing the bookkeeping: `@smarta/ui/formik`
 * returns each field's props with the error gated on `touched`, which is the
 * house rule. Submit an empty form to see every error at once.
 */
type Booking = { supplier: string | null; amount: number | null; bookedOn: Date | null; categories: string[]; note: string };

function BookingFields() {
  const supplier = useFormikValue<string | null>("supplier");
  const amount = useFormikValue<number | null>("amount");
  const bookedOn = useFormikValue<Date | null>("bookedOn");
  const categories = useFormikValue<string[]>("categories");
  const note = useFormikField("note");
  return (
    <Form noValidate className="sui:grid sui:max-w-[420px] sui:gap-[16px]">
      <Combobox
        label="Supplier"
        options={[
          { value: "s1", label: "Druckerei Weidmann" },
          { value: "s2", label: "Bürowelt Hansen" },
          { value: "s3", label: "Café Miradouro" },
        ]}
        {...supplier}
      />
      <CurrencyInput label="Amount" currency="EUR" {...amount} />
      <DatePicker label="Booked on" max={new Date(2026, 11, 31)} {...bookedOn} />
      <MultiSelect
        label="Categories"
        optional
        options={[
          { value: "office", label: "Office supplies" },
          { value: "print", label: "Printing" },
          { value: "meals", label: "Meals and entertainment" },
        ]}
        {...categories}
      />
      <Textarea label="Note for your accountant" optional rows={3} {...note} />
      <div>
        <Button type="submit" variant="primary" {...useFormikSubmit()}>
          Book the charge
        </Button>
      </div>
    </Form>
  );
}

export const WithFormik: Story = {
  name: "With Formik",
  render: () => (
    <Formik<Booking>
      initialValues={{ supplier: null, amount: null, bookedOn: null, categories: [], note: "" }}
      validate={(v) => {
        const e: Partial<Record<keyof Booking, string>> = {};
        if (!v.supplier) e.supplier = "Choose who the charge is from.";
        if (v.amount === null) e.amount = "Enter the amount on the receipt.";
        else if (v.amount <= 0) e.amount = "Enter an amount above zero.";
        if (!v.bookedOn) e.bookedOn = "Enter the date on the receipt.";
        return e;
      }}
      onSubmit={(_values, { setSubmitting }) => {
        setTimeout(() => setSubmitting(false), 800);
      }}
    >
      <BookingFields />
    </Formik>
  ),
};
