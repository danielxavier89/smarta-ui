import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Form/RadioGroup",
  component: RadioGroup,
  args: {
    label: "How was this asset paid for?",
    defaultValue: "statement",
    options: [
      { value: "statement", label: "It is on a bank statement" },
      { value: "cash", label: "Paid in cash" },
      { value: "other", label: "Something else", description: "We will ask Ana to look at it." },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[420px]"><RadioGroup {...a} /></div> };

export const Cards: Story = {
  render: () => (
    <div className="max-w-[420px]">
      <RadioGroup
        label="Which offer template?"
        appearance="card"
        defaultValue="de"
        options={[
          { value: "de", label: "German", description: "The customer receives it in German." },
          { value: "en", label: "English", description: "For customers who asked in English." },
        ]}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="max-w-[420px]">
      <RadioGroup
        label="Who owes the missing document?"
        options={[
          { value: "customer", label: "The customer" },
          { value: "taxops", label: "Tax Ops" },
          { value: "nobody", label: "Nobody — it is not needed", disabled: true },
        ]}
        error="Pick one before you convert."
      />
    </div>
  ),
};
