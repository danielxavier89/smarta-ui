import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";
import { docsPage } from "@/lib/docs";
import rules from "./Input.md?raw";

const meta = {
  title: "Form/Input",
  component: Input,
  parameters: docsPage(rules),
  args: { label: "Company name", placeholder: "Marcondes & Vale, Lda" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[360px]"><Input {...a} /></div> };

export const States: Story = {
  render: () => (
    <div className="grid max-w-[360px] gap-[16px]">
      <Input label="NIF" placeholder="500 000 000" hint="Nine digits, no spaces." />
      <Input label="NIF" defaultValue="500 000" error="A NIF is nine digits. This one has six." />
      <Input label="Registered on" defaultValue="12 June 2026" disabled hint="Set when the company was created." />
      <Input label="Trading name" optional placeholder="If it differs from the legal name" />
    </div>
  ),
};

export const WithAffixes: Story = {
  render: () => (
    <div className="grid max-w-[360px] gap-[16px]">
      <Input label="Amount" prefix="€" defaultValue="3,094.10" />
      <Input label="VAT rate" suffix="%" defaultValue="23" />
      <Input label="Reference" prefix="#" placeholder="INV-0041" size="sm" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid max-w-[360px] gap-[12px]">
      <Input size="sm" label="Small" placeholder="30px tall" />
      <Input size="md" label="Medium" placeholder="36px tall — the default" />
      <Input size="lg" label="Large" placeholder="42px tall" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Controlled() {
    const [value, setValue] = React.useState("");
    const tooLong = value.length > 20;
    return (
      <div className="max-w-[360px]">
        <Input
          label="Supplier"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={tooLong ? "Twenty characters is the most the statement line fits." : undefined}
          hint="As it appears on the bank statement."
        />
      </div>
    );
  },
};
