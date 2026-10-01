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
      <div className="sui:max-w-[340px]">
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
      <div className="sui:flex sui:items-center sui:gap-[12px] sui:rounded-lg sui:border sui:border-border sui:bg-surface sui:px-[16px] sui:py-[12px]">
        <span className="sui:font-semibold sui:text-fg">Receipts</span>
        <SearchInput
          className="sui:flex-1"
          containerClassName="sui:flex-1 sui:max-w-[340px]"
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
    <div className="sui:max-w-[240px]">
      <SearchInput size="sm" placeholder="Filter rows" label="Filter rows" />
    </div>
  ),
};
