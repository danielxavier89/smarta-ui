import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "./TextLink";
import { docsPage } from "../../lib/docs";
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
    <p className="sui:m-0 sui:max-w-[56ch] sui:text-base sui:text-fg-muted">
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
    <p className="sui:m-0 sui:text-base sui:text-fg-muted">
      Contact <TextLink>the tax office</TextLink> about this.
    </p>
  ),
};

export const Disabled: Story = {
  name: "Disabled, and why that is usually wrong",
  render: () => (
    <div className="sui:flex sui:max-w-[60ch] sui:flex-col sui:gap-[16px]">
      <p className="sui:m-0 sui:text-base sui:text-fg-muted">
        The statement is ready. You can{" "}
        <TextLink disabled>download it</TextLink> once Ana has signed off.
      </p>
      <p className="sui:m-0 sui:text-sm sui:text-fg-subtle">
        Read that again: the sentence carries the reason, which is the only thing that
        makes the dead link tolerable. A bare disabled link in prose reads as a bug.
      </p>
      <p className="sui:m-0 sui:text-base sui:text-fg-muted">
        Better still, keep it live and answer on click —{" "}
        <TextLink aria-disabled onClick={() => {}}>download it</TextLink> — because a
        disabled control is skipped by the tab order, so a screen-reader user never
        learns it is there to wait for.
      </p>
    </div>
  ),
};
