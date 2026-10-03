import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonList } from "./Skeleton";
import { docsPage } from "../../lib/docs";
import rules from "./Skeleton.md?raw";

const meta = { title: "Status/Skeleton", component: Skeleton ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Shapes: Story = {
  render: () => (
    <div className="sui:flex sui:max-w-[360px] sui:flex-col sui:gap-[12px]">
      <Skeleton width="70%" />
      <Skeleton width="45%" />
      <Skeleton shape="block" width="100%" height="88px" />
      <div className="sui:flex sui:items-center sui:gap-[10px]">
        <Skeleton shape="circle" width="30px" height="30px" />
        <Skeleton width="140px" />
      </div>
    </div>
  ),
};

export const AList: Story = {
  render: () => (
    <div className="sui:max-w-[520px] sui:overflow-hidden sui:rounded-lg sui:border sui:border-border sui:bg-surface">
      <SkeletonList rows={5} />
    </div>
  ),
};

export const WhenNotTo: Story = {
  name: "When not to use one",
  render: () => (
    <p className="sui:m-0 sui:max-w-[62ch] sui:text-base sui:text-fg-muted">
      A skeleton only earns its place when it resembles what is coming. Under about
      300ms it is a flash of grey that makes the page feel less finished, not more — keep
      the old content in place with <code className="sui:text-fg">aria-busy</code> instead.
    </p>
  ),
};
