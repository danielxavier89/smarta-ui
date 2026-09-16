import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "./TextLink";
import { docsPage } from "@/lib/docs";
import rules from "./TextLink.md?raw";

const meta = {
  title: "Actions/TextLink",
  component: TextLink,
  args: { children: "see what is missing" },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InProse: Story = {
  render: () => (
    <p className="m-0 max-w-[56ch] text-base text-fg-muted">
      Twelve charges have no receipt behind them, totalling €3,094.10. You can{" "}
      <TextLink>upload them now</TextLink> or{" "}
      <TextLink muted>ask Ana to chase the suppliers</TextLink>.
    </p>
  ),
};

export const UnderlinedInTheBackoffice: Story = {
  name: "Underlined in the backoffice",
  parameters: {
    ...docsPage(rules), docs: { description: { story: "Switch Compare to \"Webapp + backoffice\" in the toolbar. A grayscale palette has no hue left to say \"link\" with, so the backoffice says it with a rule instead. The component does not branch — it reads --link-decoration." } } },
  render: () => (
    <p className="m-0 text-base text-fg-muted">
      Contact <TextLink>the tax office</TextLink> about this.
    </p>
  ),
};
