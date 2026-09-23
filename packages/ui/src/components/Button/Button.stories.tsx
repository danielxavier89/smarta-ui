import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Check, Trash2, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { docsPage } from "../../lib/docs";
import rules from "./Button.md?raw";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Upload it" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger", "danger-quiet"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: docsPage(rules),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: "primary" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[10px]">
      <Button variant="primary">Send to Ana</Button>
      <Button variant="secondary">Save a draft</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete the upload</Button>
      <Button variant="danger-quiet">Reject it</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[10px]">
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[10px]">
      <Button variant="primary" iconLeft={<Plus size={14} />}>Add an asset</Button>
      <Button iconLeft={<Check size={14} />}>Match them</Button>
      <Button variant="ghost" iconRight={<ArrowRight size={14} />}>See the list</Button>
      <Button variant="danger-quiet" iconLeft={<Trash2 size={14} />}>Remove</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[14px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <Button variant="primary">Default</Button>
        <Button variant="primary" loading>Sending</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        Loading keeps the label in place and swaps the leading icon for a spinner, so the
        button does not resize under the cursor. Disabled is only for a control that
        cannot work yet — if there is a reason, say it beside the button rather than
        leaving the user to guess.
      </p>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="max-w-[320px] rounded-lg border border-border bg-surface p-[16px]">
      <Button variant="primary" fullWidth>Upload it</Button>
    </div>
  ),
};
