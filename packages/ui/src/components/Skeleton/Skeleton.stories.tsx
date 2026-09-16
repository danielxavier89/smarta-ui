import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonList } from "./Skeleton";
import { docsPage } from "@/lib/docs";
import rules from "./Skeleton.md?raw";

const meta = { title: "Status/Skeleton", component: Skeleton ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Shapes: Story = {
  render: () => (
    <div className="flex max-w-[360px] flex-col gap-[12px]">
      <Skeleton width="70%" />
      <Skeleton width="45%" />
      <Skeleton shape="block" width="100%" height="88px" />
      <div className="flex items-center gap-[10px]">
        <Skeleton shape="circle" width="30px" height="30px" />
        <Skeleton width="140px" />
      </div>
    </div>
  ),
};

export const AList: Story = {
  render: () => (
    <div className="max-w-[520px] overflow-hidden rounded-lg border border-border bg-surface">
      <SkeletonList rows={5} />
    </div>
  ),
};

export const WhenNotTo: Story = {
  name: "When not to use one",
  render: () => (
    <p className="m-0 max-w-[62ch] text-base text-fg-muted">
      A skeleton only earns its place when it resembles what is coming. Under about
      300ms it is a flash of grey that makes the page feel less finished, not more — keep
      the old content in place with <code className="text-fg">aria-busy</code> instead.
    </p>
  ),
};
