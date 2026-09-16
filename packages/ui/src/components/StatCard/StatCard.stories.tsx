import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, AlertTriangle, Mail } from "lucide-react";
import { StatCard } from "./StatCard";
import { docsPage } from "@/lib/docs";
import rules from "./StatCard.md?raw";

const meta = {
  title: "Containers/StatCard",
  component: StatCard,
  parameters: docsPage(rules),
  args: { label: "Missing charges", value: "12" },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[240px]"><StatCard {...a} /></div> };

export const ARow: Story = {
  render: () => (
    <div className="grid gap-[12px] sm:grid-cols-3">
      <StatCard label="Missing charges" value="12" caption="€3,094.10 unsupported" tone="bad" icon={<AlertTriangle size={15} />} onClick={() => {}} />
      <StatCard label="Receipts matched" value="41" caption="of 53 this period" tone="ok" icon={<Receipt size={15} />} />
      <StatCard label="Unread from Ana" value="3" icon={<Mail size={15} />} onClick={() => {}} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="grid gap-[12px] sm:grid-cols-3">
      <StatCard label="Missing charges" value="" loading />
      <StatCard label="Receipts matched" value="" loading />
      <StatCard label="Unread from Ana" value="" loading />
    </div>
  ),
};

export const DoNotReportThatFineThingsAreFine: Story = {
  name: "Don't report that fine things are fine",
  render: () => (
    <div className="flex max-w-[64ch] flex-col gap-[12px]">
      <div className="grid gap-[12px] sm:grid-cols-2">
        <StatCard label="Card statements" value="2 of 3" caption="one missing" tone="warn" />
        <StatCard label="Card statements" value="Revolut ···· 7731" caption="the one still missing" tone="warn" />
      </div>
      <p className="m-0 text-sm text-fg-subtle">
        The tile on the right is the one both prototypes settled on. A count that stands
        alone makes the reader guess which one is missing; naming it answers the question
        they actually had. Use a StatCard when the number is the point, and a ListItem
        when the answer is <em>which one</em>.
      </p>
    </div>
  ),
};
