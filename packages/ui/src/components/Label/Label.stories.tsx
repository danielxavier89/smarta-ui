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
