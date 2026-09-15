import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardAction } from "./Card";
import { Button } from "../Button";
import { Chip } from "../Chip";

const meta = {
  title: "Containers/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="max-w-[420px]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>June VAT return</CardTitle>
            <CardDescription>Due on 20 August 2026</CardDescription>
          </div>
          <Chip tone="warn" dot>In 3 days</Chip>
        </CardHeader>
        <CardBody>
          <p className="m-0 text-base text-fg-muted">
            Ana has everything except the Revolut statement. Once that is in, she can file.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Upload it</Button>
          <Button variant="ghost" size="sm">Ask Ana</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Affordances: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A clickable card always shows what it does. The whole surface is the target; the arrow, link or button is the real control, stretched over the card with ::after. Hover the card — the affordance reacts, not just the border.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-[720px] gap-[12px] sm:grid-cols-3">
      <Card interactive affordance="arrow" affordanceLabel="Open receipts" onClick={() => {}}>
        <CardHeader><CardTitle>Receipts</CardTitle></CardHeader>
        <CardBody>
          <p className="m-0 text-sm text-fg-subtle">12 charges with nothing behind them.</p>
        </CardBody>
      </Card>

      <Card interactive affordance="link" affordanceLabel="See the 12 charges" onClick={() => {}}>
        <CardHeader><CardTitle>Missing receipts</CardTitle></CardHeader>
        <CardBody>
          <p className="m-0 text-sm text-fg-subtle">€3,094.10 unsupported this period.</p>
        </CardBody>
      </Card>

      <Card interactive affordance="button" affordanceLabel="Open the thread" onClick={() => {}}>
        <CardHeader><CardTitle>Ana asked a question</CardTitle></CardHeader>
        <CardBody>
          <p className="m-0 text-sm text-fg-subtle">About the Lisbon Coffee charge on 5 June.</p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const ClickableWithItsOwnActions: Story = {
  name: "Clickable, and still carrying buttons",
  parameters: {
    docs: {
      description: {
        story:
          "The card is a <div>, never a <button>. Wrapping it in a button would make every control inside illegal HTML and unreachable by keyboard. The affordance is stretched over the surface instead, and anything in a CardFooter or CardAction sits above it — so the card navigates, and its own buttons still work.",
      },
    },
  },
  render: () => (
    <div className="max-w-[420px]">
      <Card interactive affordance="arrow" affordanceLabel="Open the June period" onClick={() => {}}>
        <CardHeader>
          <div>
            <CardTitle>June 2026</CardTitle>
            <CardDescription>Open until 20 August</CardDescription>
          </div>
          <CardAction>
            <Chip tone="warn" dot>1 missing</Chip>
          </CardAction>
        </CardHeader>
        <CardBody>
          <p className="m-0 text-sm text-fg-subtle">
            Revolut ···· 7731 is the only statement still to arrive.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Upload it</Button>
          <Button variant="ghost" size="sm">Ask Ana</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid max-w-[620px] gap-[12px] sm:grid-cols-2">
      <Card tone="warn"><CardBody><p className="m-0 text-sm">Two documents are still blocking the conversion.</p></CardBody></Card>
      <Card tone="bad"><CardBody><p className="m-0 text-sm">The Modelo 22 deadline passed on 31 May.</p></CardBody></Card>
      <Card tone="accent"><CardBody><p className="m-0 text-sm">This period is ready to close.</p></CardBody></Card>
      <Card disabled><CardBody><p className="m-0 text-sm">May 2026 is closed. Nothing here can change.</p></CardBody></Card>
    </div>
  ),
};
