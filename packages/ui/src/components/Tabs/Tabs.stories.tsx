import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, Tab, TabPanel } from "./Tabs";
import { docsPage } from "../../lib/docs";
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
      <div className="sui:max-w-[520px]">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <Tab value="all" count={data.all.length}>All charges</Tab>
            <Tab value="missing" count={data.missing.length}>No receipt</Tab>
            <Tab value="matched" count={data.matched.length}>Matched</Tab>
          </TabsList>
          <TabPanel value={tab}>
            <ul className="sui:m-0 sui:flex sui:list-none sui:flex-col sui:gap-[6px] sui:p-0">
              {rows.map((r) => (
                <li key={r} className="sui:rounded-md sui:border sui:border-border sui:bg-surface sui:px-[12px] sui:py-[9px] sui:text-base sui:text-fg">
                  {r}
                </li>
              ))}
            </ul>
          </TabPanel>
        </Tabs>
        <p className="sui:m-0 sui:mt-[14px] sui:max-w-[60ch] sui:text-sm sui:text-fg-subtle">
          Each count is <code className="sui:text-fg">rows.length</code> for the list that tab
          renders. Derive it, never pass it separately — a count passed in on its own is a
          count that will eventually disagree with the list underneath it.
        </p>
      </div>
    );
  },
};

export const Plain: Story = {
  render: () => (
    <div className="sui:max-w-[520px]">
      <Tabs defaultValue="master">
        <TabsList>
          <Tab value="master">Master data</Tab>
          <Tab value="docs">Documents</Tab>
          <Tab value="taxops">Tax Ops</Tab>
          <Tab value="locked" disabled>Archive</Tab>
        </TabsList>
        <TabPanel value="master"><p className="sui:m-0 sui:text-base sui:text-fg-muted">Name, addresses, tax numbers.</p></TabPanel>
        <TabPanel value="docs"><p className="sui:m-0 sui:text-base sui:text-fg-muted">Everything the customer has sent.</p></TabPanel>
        <TabPanel value="taxops"><p className="sui:m-0 sui:text-base sui:text-fg-muted">Open work that does not block a conversion.</p></TabPanel>
      </Tabs>
    </div>
  ),
};
