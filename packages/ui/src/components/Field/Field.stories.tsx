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
    <div className="sui:flex sui:max-w-[420px] sui:flex-col sui:gap-[16px]">
      <Field label="Filed on" hint="The date the return was accepted." optional>
        {(ids) => (
          <input
            type="date"
            defaultValue="2026-06-18"
            className="sui:h-[var(--control-height-md)] sui:rounded-md sui:border sui:border-border sui:bg-surface sui:px-[var(--control-padding-x-md)] sui:text-base sui:text-fg sui:outline-none sui:focus:border-accent sui:focus:shadow-focus"
            {...ids}
          />
        )}
      </Field>
      <Field label="Colour" error="Pick one the customer can actually read.">
        {(ids) => (
          <input
            type="color"
            defaultValue="#9B3F92"
            className="sui:h-[var(--control-height-md)] sui:w-[64px] sui:rounded-md sui:border sui:border-border sui:bg-surface sui:p-[3px]"
            {...ids}
          />
        )}
      </Field>
      <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">
        Field is the label / control / one-line-underneath scaffolding, wired so the hint
        and the error actually reach a screen reader. Every field-shaped component here is
        built on it; it is exported so a product can build one more without re-deriving
        the aria.
      </p>
    </div>
  ),
};
