import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./Callout";
import { Button } from "../Button";
import { TextLink } from "../TextLink";
import { docsPage } from "../../lib/docs";
import rules from "./Callout.md?raw";

const meta = {
  title: "Overlays/Callout",
  component: Callout,
  parameters: docsPage(rules),
  args: { title: "May 2026 is closed", children: <p>Ana filed it on 18 June. Nothing in a closed period can change.</p> },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex max-w-[560px] flex-col gap-[10px]">
      <Callout tone="info" title="June is open until 20 August">
        <p>Anything you upload before then lands in this period.</p>
      </Callout>
      <Callout tone="warn" title="Two documents are blocking the conversion" action={<Button size="sm">See what</Button>}>
        <p>The customer owes a Gewerbeanmeldung; Tax Ops owes the Steuernummer check.</p>
      </Callout>
      <Callout tone="bad" title="The Modelo 22 deadline passed on 31 May">
        <p>Ana has filed a late submission. There may be a penalty.</p>
      </Callout>
      <Callout tone="ok" title="Everything for June is in">
        <p>All four statements arrived and every charge has a receipt behind it.</p>
      </Callout>
      <Callout tone="neutral" title="This period is read-only">
        <p>
          You can still <TextLink>ask Ana to reopen it</TextLink>.
        </p>
      </Callout>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <div className="max-w-[560px]">
      <Callout tone="info" title="Receipts can be forwarded by email" onDismiss={() => {}}>
        <p>Send them to receipts@marcondesvale.pt and they will appear here.</p>
      </Callout>
    </div>
  ),
};

export const OrAToast: Story = {
  name: "Callout or toast?",
  render: () => (
    <p className="m-0 max-w-[62ch] text-base text-fg-muted">
      A Callout persists and belongs to a place — it is still there when the user comes
      back tomorrow. A Toast is transient and belongs to a moment. Use a toast for
      &ldquo;that worked&rdquo;, and a callout for &ldquo;here is why this is the way it
      is&rdquo;.
    </p>
  ),
};
