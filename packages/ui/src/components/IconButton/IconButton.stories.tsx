import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, MoreHorizontal, X, Download, Pencil } from "lucide-react";
import { IconButton } from "./IconButton";

const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  args: { label: "Notifications", icon: <Bell size={16} /> },
  argTypes: {
    variant: { control: "inline-radio", options: ["secondary", "ghost", "primary", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-[10px]">
      <IconButton label="Notifications" icon={<Bell size={16} />} />
      <IconButton variant="ghost" label="More" icon={<MoreHorizontal size={16} />} />
      <IconButton variant="primary" label="Edit" icon={<Pencil size={16} />} />
      <IconButton variant="danger" label="Close" icon={<X size={16} />} />
    </div>
  ),
};

export const WithIndicator: Story = {
  render: () => (
    <div className="flex items-center gap-[16px]">
      <IconButton label="Notifications, 3 unread" icon={<Bell size={16} />} indicator />
      <IconButton label="Downloads ready" icon={<Download size={16} />} indicator indicatorTone="ok" variant="ghost" />
    </div>
  ),
};

export const LabelIsNotOptional: Story = {
  name: "The label is not optional",
  render: () => (
    <div className="flex max-w-[52ch] flex-col gap-[10px]">
      <IconButton label="Open the notifications panel" icon={<Bell size={16} />} />
      <p className="m-0 text-sm text-fg-subtle">
        An icon-only control is unreadable to a screen reader and unguessable to anyone
        new, so <code className="text-fg">label</code> is required by the type and is used
        for both <code className="text-fg">aria-label</code> and the native tooltip.
      </p>
    </div>
  ),
};
