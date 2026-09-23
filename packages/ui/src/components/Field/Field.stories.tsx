import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { docsPage } from "../../lib/docs";
import rules from "./Field.md?raw";

const meta = {
  title: "Form/Field",
  component: Field,
  parameters: docsPage(rules),
  args: { children: () => null },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WrappingYourOwnControl: Story = {
  name: "Wrapping a control of your own",
  render: () => (
    <div className="flex max-w-[420px] flex-col gap-[16px]">
      <Field label="Filed on" hint="The date the return was accepted." optional>
        {(ids) => (
          <input
            type="date"
            defaultValue="2026-06-18"
            className="h-[var(--control-height-md)] rounded-md border border-border bg-surface px-[var(--control-padding-x-md)] text-base text-fg outline-none focus:border-accent focus:shadow-[var(--shadow-focus)]"
            {...ids}
          />
        )}
      </Field>
      <Field label="Colour" error="Pick one the customer can actually read.">
        {(ids) => (
          <input
            type="color"
            defaultValue="#9B3F92"
            className="h-[var(--control-height-md)] w-[64px] rounded-md border border-border bg-surface p-[3px]"
            {...ids}
          />
        )}
      </Field>
      <p className="m-0 text-sm text-fg-subtle">
        Field is the label / control / one-line-underneath scaffolding, wired so the hint
        and the error actually reach a screen reader. Every field-shaped component here is
        built on it; it is exported so a product can build one more without re-deriving
        the aria.
      </p>
    </div>
  ),
};
