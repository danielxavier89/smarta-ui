import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrencyInput, type CurrencyInputProps } from "./CurrencyInput";
import { ThemeProvider } from "../ThemeProvider";
import { docsPage } from "../../lib/docs";
import rules from "./CurrencyInput.md?raw";

const meta = {
  title: "Form/CurrencyInput",
  component: CurrencyInput,
  parameters: docsPage(rules),
  args: { label: "Net", defaultValue: 70.24 },
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: CurrencyInputProps) => (
    <div className="sui:max-w-[280px]">
      <CurrencyInput {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
      <CurrencyInput label="Net" hint="Before VAT." />
      <CurrencyInput label="VAT" defaultValue={16.16} />
      <CurrencyInput label="Receipt total" currency="USD" defaultValue={540} hint="As printed on the receipt." />
      <CurrencyInput label="Limit" defaultValue={12500} max={10000} error="The monthly limit is 10.000 €." />
      <CurrencyInput label="Charged" defaultValue={486.22} disabled hint="Taken from the bank statement." />
    </div>
  ),
};

/** The same amount in each locale: where the symbol goes, and what the separators are. */
export const InEachLocale: Story = {
  name: "In each locale",
  render: function Locales() {
    const [n, setN] = React.useState<number | null>(1234.56);
    return (
      <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
        <ThemeProvider locale="de-DE" className="sui:bg-transparent">
          <CurrencyInput label="Deutsch" value={n} onValueChange={setN} />
        </ThemeProvider>
        <ThemeProvider locale="pt-PT" className="sui:bg-transparent">
          <CurrencyInput label="Português" value={n} onValueChange={setN} />
        </ThemeProvider>
        <ThemeProvider locale="en-GB" className="sui:bg-transparent">
          <CurrencyInput label="English" value={n} onValueChange={setN} />
        </ThemeProvider>
      </div>
    );
  },
};
