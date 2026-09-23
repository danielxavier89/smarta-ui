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
    <div className="flex items-center gap-[12px]">
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
    <div className="w-[240px] overflow-hidden rounded-lg border border-border bg-surface p-[6px]">
      {[
        { icon: <Inbox size={16} />, label: "Messages", count: 3 },
        { icon: <Bell size={16} />, label: "Notifications", count: 0 },
      ].map((r) => (
        <div key={r.label} className="flex items-center gap-[10px] rounded-md px-[10px] py-[8px] text-base text-fg-muted hover:bg-surface-hover">
          <span className="text-fg-subtle">{r.icon}</span>
          <span className="flex-1">{r.label}</span>
          <Badge count={r.count} unit={`unread ${r.label.toLowerCase()}`} />
        </div>
      ))}
      <p className="m-0 px-[10px] pb-[6px] pt-[10px] text-xs text-fg-subtle">
        Notifications shows no badge, because a badge reading 0 is worse than no badge.
      </p>
    </div>
  ),
};

export const OnAnIconButton: Story = {
  render: () => (
    <div className="relative inline-flex">
      <IconButton label="Notifications, 5 unread" icon={<Bell size={16} />} />
      <span className="absolute -right-[6px] -top-[6px]">
        <Badge count={5} unit="unread notifications" />
      </span>
    </div>
  ),
};
