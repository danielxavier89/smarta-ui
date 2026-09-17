import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, MoreHorizontal, X, Download, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "./IconButton";
import { docsPage } from "@/lib/docs";
import rules from "./IconButton.md?raw";

const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  parameters: docsPage(rules),
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

export const LoadingAndDisabled: Story = {
  name: "Working, and unavailable",
  render: () => (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[10px]">
        <IconButton label="Download the statement" icon={<Download size={15} />} />
        <IconButton label="Downloading the statement" icon={<Download size={15} />} loading />
        <IconButton label="Delete the upload" icon={<Trash2 size={15} />} variant="danger" disabled />
      </div>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        Loading swaps the icon for a spinner and blocks the click; the button keeps its
        size, so a toolbar does not reflow while one control is busy. The label stays
        required in every state — mid-request is exactly when someone asks what is
        happening, and an icon alone cannot answer.
      </p>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        The disabled one is only half a control until something says why. An icon button
        has no room for a reason, so it needs a Tooltip or a line beside it — see
        Foundations → States.
      </p>
    </div>
  ),
};
