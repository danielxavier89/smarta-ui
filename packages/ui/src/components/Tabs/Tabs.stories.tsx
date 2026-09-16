import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, Tab, TabPanel } from "./Tabs";
import { docsPage } from "@/lib/docs";
import rules from "./Tabs.md?raw";

const meta = { title: "Navigation/Tabs", component: Tabs ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  all: ["Staples Lisboa", "Lisbon Coffee", "Vodafone Portugal", "Revolut top-up", "Conference fee"],
  missing: ["Lisbon Coffee", "Conference fee"],
  matched: ["Staples Lisboa", "Vodafone Portugal"],
};

export const WithCounts: Story = {
  render: function WithCounts() {
    const [tab, setTab] = React.useState("all");
    const rows = data[tab as keyof typeof data];
    return (
      <div className="max-w-[520px]">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <Tab value="all" count={data.all.length}>All charges</Tab>
            <Tab value="missing" count={data.missing.length}>No receipt</Tab>
            <Tab value="matched" count={data.matched.length}>Matched</Tab>
          </TabsList>
          <TabPanel value={tab}>
            <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
              {rows.map((r) => (
                <li key={r} className="rounded-md border border-border bg-surface px-[12px] py-[9px] text-base text-fg">
                  {r}
                </li>
              ))}
            </ul>
          </TabPanel>
        </Tabs>
        <p className="m-0 mt-[14px] max-w-[60ch] text-sm text-fg-subtle">
          Each count is <code className="text-fg">rows.length</code> for the list that tab
          renders. Derive it, never pass it separately — a count passed in on its own is a
          count that will eventually disagree with the list underneath it.
        </p>
      </div>
    );
  },
};

export const Plain: Story = {
  render: () => (
    <div className="max-w-[520px]">
      <Tabs defaultValue="master">
        <TabsList>
          <Tab value="master">Master data</Tab>
          <Tab value="docs">Documents</Tab>
          <Tab value="taxops">Tax Ops</Tab>
          <Tab value="locked" disabled>Archive</Tab>
        </TabsList>
        <TabPanel value="master"><p className="m-0 text-base text-fg-muted">Name, addresses, tax numbers.</p></TabPanel>
        <TabPanel value="docs"><p className="m-0 text-base text-fg-muted">Everything the customer has sent.</p></TabPanel>
        <TabPanel value="taxops"><p className="m-0 text-base text-fg-muted">Open work that does not block a conversion.</p></TabPanel>
      </Tabs>
    </div>
  ),
};
