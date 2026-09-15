import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const assignees = [
  { value: "erik", label: "Erik" },
  { value: "michael", label: "Michael" },
  { value: "annekatrin", label: "Annekatrin" },
];

const meta = {
  title: "Form/Select",
  component: Select,
  args: { label: "Assignee", options: assignees, defaultValue: "erik" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[300px]"><Select {...a} /></div> };

export const Grouped: Story = {
  render: () => (
    <div className="max-w-[300px]">
      <Select
        label="Move to"
        placeholder="Choose a queue"
        defaultValue=""
        options={[
          { value: "docs", label: "Documents", group: "Onboarding" },
          { value: "tax", label: "Tax numbers", group: "Onboarding" },
          { value: "ops", label: "Tax Ops", group: "Review" },
          { value: "done", label: "Converted", group: "Review" },
        ]}
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-[300px] gap-[16px]">
      <Select label="Period" options={[{ value: "jun", label: "June 2026" }]} hint="Closed periods are read-only." />
      <Select label="Bundesland" options={[{ value: "nw", label: "Nordrhein-Westfalen" }]} error="Pick the state the business is registered in." />
      <Select label="Currency" options={[{ value: "eur", label: "Euro" }]} disabled />
    </div>
  ),
};

export const WhyNative: Story = {
  name: "Why this is a native select",
  render: () => (
    <div className="flex max-w-[54ch] flex-col gap-[12px]">
      <Select label="Assignee" options={assignees} />
      <p className="m-0 text-sm text-fg-subtle">
        Both prototypes settled on native selects and native date inputs. On a phone the
        platform picker beats anything we would build, it needs no portal, no focus trap
        and no scroll lock, and it cannot be the reason a form is unusable with a keyboard.
        Reach for DropdownMenu only when the items are <em>actions</em> rather than a value.
      </p>
    </div>
  ),
};
