import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, SearchX, Lock, CloudOff } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { TextLink } from "../TextLink";
import { docsPage } from "../../lib/docs";
import rules from "./EmptyState.md?raw";

const meta = {
  title: "Containers/EmptyState",
  component: EmptyState,
  parameters: docsPage(rules),
  args: { title: "No receipts yet" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourVariants: Story = {
  render: () => (
    <div className="grid gap-[12px] lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          variant="first-run"
          icon={<Receipt size={20} />}
          title="No receipts yet"
          description="Photograph or forward a receipt and it will appear here, matched to the charge it belongs to."
          action={<Button variant="primary" size="sm">Upload the first one</Button>}
        />
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          variant="no-results"
          icon={<SearchX size={20} />}
          title="Nothing matches “vodaphone”"
          description="Check the spelling, or clear the search to see all 53 charges."
          action={<Button size="sm">Clear the search</Button>}
        />
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          variant="locked"
          icon={<Lock size={20} />}
          title="May 2026 is closed"
          description="Ana filed it on 18 June. Nothing in a closed period can change."
          action={<Button size="sm">Go to June</Button>}
          secondaryAction={<TextLink muted>Ask Ana to reopen it</TextLink>}
        />
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          variant="error"
          icon={<CloudOff size={20} />}
          title="We could not load the charges"
          description="The bank connection timed out. Nothing has been lost."
          action={<Button variant="primary" size="sm">Try again</Button>}
        />
      </div>
    </div>
  ),
};

export const NeverJustNoData: Story = {
  name: "Never just “No data”",
  render: () => (
    <div className="flex max-w-[64ch] flex-col gap-[12px]">
      <div className="grid gap-[12px] sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState size="sm" title="No data" />
        </div>
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            size="sm"
            icon={<Receipt size={18} />}
            title="Nothing to match yet"
            description="Every June charge already has a receipt behind it."
          />
        </div>
      </div>
      <p className="m-0 text-sm text-fg-subtle">
        An empty state explains the situation and offers the next action. The one on the
        left tells the user nothing they did not already know from looking at the screen.
      </p>
    </div>
  ),
};
