import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";
import { docsPage } from "../../lib/docs";
import rules from "./DateRangePicker.md?raw";

const june = { from: new Date(2026, 5, 1), to: new Date(2026, 5, 30) };
const may = { from: new Date(2026, 4, 1), to: new Date(2026, 4, 31) };
const q2 = { from: new Date(2026, 3, 1), to: new Date(2026, 5, 30) };

const meta = {
  title: "Form/DateRangePicker",
  component: DateRangePicker,
  parameters: docsPage(rules),
  args: {
    label: "Period",
    defaultValue: june,
    presets: [
      { label: "June", range: june },
      { label: "May", range: may },
      { label: "Second quarter", range: q2 },
    ],
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: DateRangePickerProps) => (
    <div className="sui:max-w-[320px]">
      <DateRangePicker {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
      <DateRangePicker label="Period" hint="The charges booked in it." />
      <DateRangePicker label="Period" defaultValue={{ from: new Date(2026, 5, 1), to: null }} />
      <DateRangePicker label="Period" defaultValue={june} />
      <DateRangePicker label="Period" defaultValue={may} error="May is closed. Its charges can't be changed." />
      <DateRangePicker label="Period" defaultValue={june} disabled hint="Fixed by the return being filed." />
    </div>
  ),
};

/** Open, so the browser gate checks the calendar and the presets, not just the trigger. */
export const Open: Story = {
  render: (a: DateRangePickerProps) => (
    <div className="sui:min-h-[460px] sui:max-w-[320px]">
      <DateRangePicker {...a} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /^Period/ }));
  },
};
