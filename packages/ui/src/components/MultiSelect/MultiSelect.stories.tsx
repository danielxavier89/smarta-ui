import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { MultiSelect, type MultiSelectProps } from "./MultiSelect";
import { docsPage } from "../../lib/docs";
import rules from "./MultiSelect.md?raw";

const categories = [
  { value: "travel", label: "Travel" },
  { value: "meals", label: "Meals and entertainment" },
  { value: "software", label: "Software and subscriptions" },
  { value: "office", label: "Office supplies" },
  { value: "phone", label: "Phone and internet" },
  { value: "advice", label: "Legal and tax advice" },
  { value: "bank", label: "Bank fees" },
  { value: "car", label: "Car" },
];

const meta = {
  title: "Form/MultiSelect",
  component: MultiSelect,
  parameters: docsPage(rules),
  args: {
    label: "Categories",
    options: categories,
    defaultValue: ["travel", "software"],
    placeholder: "All categories",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: MultiSelectProps) => (
    <div className="sui:max-w-[360px]">
      <MultiSelect {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[360px] sui:gap-[16px]">
      <MultiSelect label="Categories" options={categories} placeholder="All categories" hint="Only charges in these show up." />
      <MultiSelect label="Categories" options={categories} defaultValue={["travel", "meals", "software", "office", "advice"]} />
      <MultiSelect label="Categories" options={categories} error="Choose at least one category for the report." />
      <MultiSelect label="Categories" options={categories} defaultValue={["bank"]} disabled hint="Fixed for this report." />
    </div>
  ),
};

export const Open: Story = {
  render: (a: MultiSelectProps) => (
    <div className="sui:min-h-[420px] sui:max-w-[360px]">
      <MultiSelect {...a} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};
