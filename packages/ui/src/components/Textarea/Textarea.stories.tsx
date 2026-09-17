import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";
import { docsPage } from "@/lib/docs";
import rules from "./Textarea.md?raw";

const meta = {
  title: "Form/Textarea",
  component: Textarea,
  parameters: docsPage(rules),
  args: { label: "What should Ana know?", placeholder: "One or two sentences is plenty." },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (a) => <div className="max-w-[420px]"><Textarea {...a} /></div> };

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-[420px] gap-[18px]">
      <Textarea label="Note" hint="Only your team sees this." />
      <Textarea label="Message to the customer" maxLength={240} showCount defaultValue="We received your Gewerbeanmeldung." />
      <Textarea label="Reason for rejecting" error="Say what the customer has to change." />
      <Textarea label="Grows as you type" autoResize rows={2} placeholder="Keep going…" />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled, with the reason beside it",
  render: () => (
    <div className="flex max-w-[420px] flex-col gap-[8px]">
      <Textarea
        label="Reason for rejecting"
        disabled
        defaultValue="May 2026 is closed."
      />
      <p className="m-0 text-sm text-fg-subtle">
        Ana filed the period on 18 June. Reopen it to change anything in it.
      </p>
    </div>
  ),
};
