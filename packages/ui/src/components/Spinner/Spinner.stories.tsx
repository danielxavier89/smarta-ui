import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Button } from "../Button";
import { docsPage } from "../../lib/docs";
import rules from "./Spinner.md?raw";

const meta = { title: "Status/Spinner", component: Spinner ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="sui:flex sui:items-center sui:gap-[16px] sui:text-fg-muted">
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
    <div className="sui:flex sui:flex-wrap sui:items-center sui:gap-[12px]">
      <Button variant="primary" loading>Sending</Button>
      <Button loading>Checking</Button>
      <span className="sui:inline-flex sui:items-center sui:gap-[6px] sui:text-bad"><Spinner size={13} label="" /> Retrying</span>
      <span className="sui:inline-flex sui:items-center sui:gap-[6px] sui:text-fg-subtle"><Spinner size={13} label="" /> Reading the statement</span>
    </div>
  ),
};
