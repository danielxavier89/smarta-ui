import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./SearchInput";
import { docsPage } from "../../lib/docs";
import rules from "./SearchInput.md?raw";

const meta = {
  title: "Form/SearchInput",
  component: SearchInput,
  parameters: docsPage(rules),
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [q, setQ] = React.useState("");
    return (
      <div className="max-w-[340px]">
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ("")}
          placeholder="Search receipts, charges, messages"
          label="Search the portal"
        />
      </div>
    );
  },
};

export const InATopBar: Story = {
  render: function InATopBar() {
    const [q, setQ] = React.useState("staples");
    return (
      <div className="flex items-center gap-[12px] rounded-lg border border-border bg-surface px-[16px] py-[12px]">
        <span className="font-semibold text-fg">Receipts</span>
        <SearchInput
          className="flex-1"
          containerClassName="flex-1 max-w-[340px]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ("")}
        />
      </div>
    );
  },
};

export const Small: Story = {
  render: () => (
    <div className="max-w-[240px]">
      <SearchInput size="sm" placeholder="Filter rows" label="Filter rows" />
    </div>
  ),
};
