import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { Chip } from "./Chip";
import { docsPage } from "@/lib/docs";
import rules from "./Chip.md?raw";

const meta = {
  title: "Status/Chip",
  component: Chip,
  parameters: docsPage(rules),
  args: { children: "Matched", tone: "ok" },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "ok", "warn", "bad", "info", "accent"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    appearance: { control: "inline-radio", options: ["solid", "outline"] },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip tone="ok">Matched</Chip>
        <Chip tone="warn">Due in 3 days</Chip>
        <Chip tone="bad">Overdue</Chip>
        <Chip tone="info">In review</Chip>
        <Chip tone="accent">New</Chip>
        <Chip tone="neutral">Draft</Chip>
      </div>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        Tone is meaning, not decoration. Colour never carries the status on its own —
        the label is always a word, so the chip still works in greyscale, for a
        colour-blind reader, and when it is read aloud.
      </p>
    </div>
  ),
};

export const WithDotOrIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[8px]">
      <Chip tone="ok" dot>Verified</Chip>
      <Chip tone="warn" dot>Waiting on the customer</Chip>
      <Chip tone="ok" icon={<Check size={12} />}>Paid</Chip>
      <Chip tone="warn" icon={<Clock size={12} />}>Sent 2 days ago</Chip>
      <Chip tone="bad" icon={<AlertTriangle size={12} />}>Mismatch</Chip>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip appearance="outline" tone="ok">Matched</Chip>
        <Chip appearance="outline" tone="warn">Pending</Chip>
        <Chip appearance="outline" tone="bad">Rejected</Chip>
        <Chip appearance="outline" tone="neutral">Draft</Chip>
      </div>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        Outline reads quieter on a busy table row, where a column of filled tints turns
        into stripes.
      </p>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-[8px]">
      <Chip size="sm" tone="ok">Small</Chip>
      <Chip size="md" tone="ok">Medium</Chip>
    </div>
  ),
};
