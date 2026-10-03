import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Inbox } from "lucide-react";
import { Badge } from "./Badge";
import { IconButton } from "../IconButton";
import { docsPage } from "../../lib/docs";
import rules from "./Badge.md?raw";

const meta = {
  title: "Status/Badge",
  component: Badge,
  parameters: docsPage(rules),
  args: { count: 3 },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Counts: Story = {
  render: () => (
    <div className="sui:flex sui:items-center sui:gap-[12px]">
      <Badge count={1} unit="unread messages" />
      <Badge count={12} unit="open tasks" />
      <Badge count={140} unit="notifications" />
      <Badge count={0} unit="none" />
      <Badge count={4} tone="accent" unit="new" />
      <Badge count={7} tone="neutral" unit="drafts" />
      <Badge count={2} dotOnly unit="changes" />
    </div>
  ),
};

export const OnANavItem: Story = {
  render: () => (
    <div className="sui:w-[240px] sui:overflow-hidden sui:rounded-lg sui:border sui:border-border sui:bg-surface sui:p-[6px]">
      {[
        { icon: <Inbox size={16} />, label: "Messages", count: 3 },
        { icon: <Bell size={16} />, label: "Notifications", count: 0 },
      ].map((r) => (
        <div key={r.label} className="sui:flex sui:items-center sui:gap-[10px] sui:rounded-md sui:px-[10px] sui:py-[8px] sui:text-base sui:text-fg-muted sui:hover:bg-surface-hover">
          <span className="sui:text-fg-subtle">{r.icon}</span>
          <span className="sui:flex-1">{r.label}</span>
          <Badge count={r.count} unit={`unread ${r.label.toLowerCase()}`} />
        </div>
      ))}
      <p className="sui:m-0 sui:px-[10px] sui:pb-[6px] sui:pt-[10px] sui:text-xs sui:text-fg-subtle">
        Notifications shows no badge, because a badge reading 0 is worse than no badge.
      </p>
    </div>
  ),
};

export const OnAnIconButton: Story = {
  render: () => (
    <div className="sui:relative sui:inline-flex">
      <IconButton label="Notifications, 5 unread" icon={<Bell size={16} />} />
      <span className="sui:absolute sui:-right-[6px] sui:-top-[6px]">
        <Badge count={5} unit="unread notifications" />
      </span>
    </div>
  ),
};
