import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";
import { docsPage } from "@/lib/docs";
import rules from "./Progress.md?raw";

const meta = { title: "Status/Progress", component: Progress, args: { value: 62, label: "Uploading receipts" } ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[320px]"><Progress {...a} /></div> };

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-[320px] flex-col gap-[18px]">
      <Progress value={62} label="Uploading receipts" showLabel />
      <Progress value={100} label="Upload complete" tone="ok" showLabel />
      <Progress value={34} label="Documents verified" tone="warn" showLabel />
      <Progress value={null} label="Reading the statement" showLabel />
      <Progress value={45} label="Small" size="sm" />
    </div>
  ),
};

export const OrASpinner: Story = {
  name: "Progress or spinner?",
  render: () => (
    <p className="m-0 max-w-[62ch] text-base text-fg-muted">
      A Progress bar is for work whose end is known: an upload, a checklist, a period&rsquo;s
      completeness. For a request in flight with no knowable end, a Spinner says the same
      thing without implying a finish line. And do not draw a bar to report that fine
      things are fine — a bar that sits at 100% every day is decoration.
    </p>
  ),
};
