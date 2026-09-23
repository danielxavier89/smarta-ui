import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, HelpCircle } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { IconButton } from "../IconButton";
import { Button } from "../Button";
import { docsPage } from "../../lib/docs";
import rules from "./Tooltip.md?raw";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: docsPage(rules),
  args: { content: "A short label", children: null },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-[16px]">
      <Tooltip content="Depreciated over 4 years">
        <IconButton variant="ghost" label="About depreciation" icon={<Info size={15} />} />
      </Tooltip>
      <Tooltip content="Nine digits, no spaces" side="right">
        <span className="inline-flex items-center gap-[5px] text-base text-fg-muted">
          NIF <HelpCircle size={13} className="text-fg-faint" />
        </span>
      </Tooltip>
      <Tooltip content="Two documents and one tax number are still missing" side="bottom">
        <Button disabled>Convert Petra</Button>
      </Tooltip>
    </div>
  ),
};

export const WhatNotToPutInOne: Story = {
  name: "What not to put in one",
  render: () => (
    <div className="flex max-w-[62ch] flex-col gap-[12px]">
      <Tooltip content="€3,094.10 across 12 charges">
        <span className="w-fit cursor-help text-base text-fg underline decoration-dotted underline-offset-4">
          Unsupported total
        </span>
      </Tooltip>
      <p className="m-0 text-sm text-fg-subtle">
        A tooltip is a label or a unit, never a paragraph and never an action. On a touch
        screen hover does not fire, so anything that lives only in a tooltip is simply
        gone. If the user has to read it to decide something, it belongs on the page.
      </p>
    </div>
  ),
};
