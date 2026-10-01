import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputNumber, type InputNumberProps } from "./InputNumber";
import { ThemeProvider } from "../ThemeProvider";
import { docsPage } from "../../lib/docs";
import rules from "./InputNumber.md?raw";

const meta = {
  title: "Form/InputNumber",
  component: InputNumber,
  parameters: docsPage(rules),
  args: { label: "Useful life", suffix: "years", min: 1, max: 30, defaultValue: 5, steppers: true },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: InputNumberProps) => (
    <div className="sui:max-w-[280px]">
      <InputNumber {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
      <InputNumber label="Useful life" suffix="years" hint="Between 1 and 30." min={1} max={30} />
      <InputNumber label="Useful life" suffix="years" defaultValue={45} error="Assets are written down over 30 years at most." />
      <InputNumber label="VAT rate" suffix="%" decimals={1} defaultValue={23} disabled hint="Set by the supplier's country." />
      <InputNumber label="Units" optional steppers min={0} defaultValue={2} />
    </div>
  ),
};

/**
 * The same number, typed the way each locale writes it. Type 1234567 into
 * either and leave the field.
 */
export const InEachLocale: Story = {
  name: "Typed in each locale",
  render: function Locales() {
    const [n, setN] = React.useState<number | null>(1234567.5);
    return (
      <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
        <ThemeProvider locale="de-DE" className="sui:bg-transparent">
          <InputNumber label="Deutsch" decimals={2} value={n} onValueChange={setN} />
        </ThemeProvider>
        <ThemeProvider locale="pt-PT" className="sui:bg-transparent">
          <InputNumber label="Português" decimals={2} value={n} onValueChange={setN} />
        </ThemeProvider>
        <ThemeProvider locale="en-GB" className="sui:bg-transparent">
          <InputNumber label="English" decimals={2} value={n} onValueChange={setN} />
        </ThemeProvider>
      </div>
    );
  },
};
