import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Button } from "../Button";

const meta = { title: "Status/Spinner", component: Spinner } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-[16px] text-fg-muted">
      <Spinner size={12} />
      <Spinner size={16} />
      <Spinner size={22} />
      <Spinner size={30} />
    </div>
  ),
};

export const InheritsColour: Story = {
  name: "It inherits currentColor",
  render: () => (
    <div className="flex flex-wrap items-center gap-[12px]">
      <Button variant="primary" loading>Sending</Button>
      <Button loading>Checking</Button>
      <span className="inline-flex items-center gap-[6px] text-bad"><Spinner size={13} label="" /> Retrying</span>
      <span className="inline-flex items-center gap-[6px] text-fg-subtle"><Spinner size={13} label="" /> Reading the statement</span>
    </div>
  ),
};
