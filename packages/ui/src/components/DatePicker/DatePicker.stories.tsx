import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { DatePicker, type DatePickerProps } from "./DatePicker";
import { ThemeProvider } from "../ThemeProvider";
import { docsPage } from "../../lib/docs";
import rules from "./DatePicker.md?raw";

const meta = {
  title: "Form/DatePicker",
  component: DatePicker,
  parameters: docsPage(rules),
  args: { label: "Booked on", defaultValue: new Date(2026, 5, 3) },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: DatePickerProps) => (
    <div className="sui:max-w-[280px]">
      <DatePicker {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[300px] sui:gap-[16px]">
      <DatePicker label="Booked on" hint="As it appears on the statement." />
      <DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} />
      <DatePicker label="Bought on" defaultValue={new Date(2026, 4, 28)} error="May is closed. Pick a date in June or later." />
      <DatePicker label="Filed on" defaultValue={new Date(2026, 5, 18)} disabled hint="Set when the return was accepted." />
      <DatePicker label="Due by" optional />
    </div>
  ),
};

/** Open, so the browser gate checks the calendar itself — contrast, names, grid — not just the field. */
export const Open: Story = {
  render: () => (
    <div className="sui:min-h-[420px] sui:max-w-[300px]">
      <DatePicker
        label="Booked on"
        defaultValue={new Date(2026, 5, 3)}
        min={new Date(2026, 5, 2)}
        max={new Date(2026, 5, 28)}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Choose a date" }));
  },
};

/** Type 03.06.2026 into the German one and 03/06/2026 into the English one, then leave the field. */
export const InEachLocale: Story = {
  name: "In each locale",
  render: function Locales() {
    const [d, setD] = React.useState<Date | null>(new Date(2026, 5, 3));
    return (
      <div className="sui:grid sui:max-w-[300px] sui:gap-[16px]">
        <ThemeProvider locale="de-DE" className="sui:bg-transparent">
          <DatePicker label="Deutsch" value={d} onValueChange={setD} />
        </ThemeProvider>
        <ThemeProvider locale="pt-PT" className="sui:bg-transparent">
          <DatePicker label="Português" value={d} onValueChange={setD} />
        </ThemeProvider>
        <ThemeProvider locale="en-GB" className="sui:bg-transparent">
          <DatePicker label="English" value={d} onValueChange={setD} />
        </ThemeProvider>
      </div>
    );
  },
};
