import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";
import { docsPage } from "@/lib/docs";
import rules from "./Label.md?raw";

const meta = { title: "Form/Label", component: Label, args: { children: "Company name" } ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OptionalIsMarked: Story = {
  name: "Optional is marked, required is not",
  render: () => (
    <div className="flex max-w-[56ch] flex-col gap-[10px]">
      <Label>Company name</Label>
      <Label optional>Trading name</Label>
      <p className="m-0 text-sm text-fg-subtle">
        The inverse — an asterisk on everything required — puts a mark on most of the form
        and draws the eye to the wrong thing. Marking the two fields a user can skip tells
        them something they did not already assume.
      </p>
    </div>
  ),
};

export const GoesQuietWithItsControl: Story = {
  name: "Goes quiet with its control",
  render: () => (
    <div className="flex max-w-[56ch] flex-col gap-[14px]">
      <div className="flex flex-col gap-[4px]">
        <Label htmlFor="vat-off">VAT number</Label>
        <input
          id="vat-off"
          disabled
          defaultValue="PT 503 214 665"
          className="peer h-[var(--control-height-md)] rounded-md border border-border bg-surface-sunken px-[var(--control-padding-x-md)] text-[length:var(--field-font-size)] text-fg opacity-70"
        />
      </div>
      <p className="m-0 text-sm text-fg-subtle">
        Label has no disabled prop of its own — it dims from the control beside it, through{" "}
        <code>peer-disabled</code>. So the pair always agrees, and there is no second
        boolean to keep in step.
      </p>
      <p className="m-0 text-sm text-fg-subtle">
        The dimming is the only thing the label does. It never carries the reason: a
        greyed-out field with no explanation is the thing the house rules ban, and the
        reason belongs on the page where it can be read and acted on.
      </p>
    </div>
  ),
};
