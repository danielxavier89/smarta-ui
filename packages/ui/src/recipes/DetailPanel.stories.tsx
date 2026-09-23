import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Copy } from "lucide-react";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { Dialog } from "../components/Dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/DropdownMenu";
import { IconButton } from "../components/IconButton";
import { KeyValue } from "../components/KeyValue";
import { Panel, PanelSection } from "../components/Panel";
import { docsPage } from "../lib/docs";
import recipe from "../../docs/recipes/detail-panel.md?raw";

/**
 * Every detail view in both products is a caller of this one Panel. The point
 * of running the recipe here is to make that concrete: what changes between a
 * receipt, a transaction and a message is the body, never the container.
 */
const meta: Meta = {
  title: "Recipes/A detail panel",
  parameters: {
    layout: "padded",
    ...docsPage(recipe),
  },
};
export default meta;
type Story = StoryObj;

const eur = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

export const TheScreen: Story = {
  name: "The screen",
  render: function TheScreen() {
    const [open, setOpen] = React.useState(true);
    const [confirming, setConfirming] = React.useState(false);

    return (
      <div className="flex flex-col items-start gap-[10px]">
        <Button onClick={() => setOpen(true)}>Open the receipt</Button>
        <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
          Header, then one PanelSection per group of facts, then the footer: ghost Close
          on the left, one primary on the right. Delete opens a Dialog on top, because
          deleting the file is not something Undo can walk back.
        </p>

        <Panel
          open={open}
          onOpenChange={setOpen}
          title="Staples Lisboa"
          subtitle={`3 June 2026 · ${eur(86.4)}`}
          headerAction={
            <>
              <Chip tone="ok" size="sm">Matched</Chip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label="More actions"
                    icon={<MoreHorizontal size={16} />}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Replace the file</DropdownMenuItem>
                  <DropdownMenuItem>Unmatch from the charge</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem tone="danger" onSelect={() => setConfirming(true)}>
                    Delete the upload
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              <Button variant="primary" className="ml-auto">Send to Ana</Button>
            </>
          }
        >
          <PanelSection title="The charge">
            <KeyValue
              rows={[
                { key: "Account", value: "Visa ···· 4417", nowrap: true },
                { key: "Booked", value: "3 June 2026", nowrap: true },
                { key: "Amount", value: `−${eur(86.4)}`, nowrap: true },
              ]}
            />
          </PanelSection>

          <PanelSection title="The receipt">
            <KeyValue
              rows={[
                { key: "Supplier", value: "Staples Lisboa" },
                {
                  key: "NIF",
                  value: "503 214 665",
                  nowrap: true,
                  action: (
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label="Copy the NIF"
                      icon={<Copy size={13} />}
                    />
                  ),
                },
                { key: "Net", value: eur(70.24), nowrap: true },
                {
                  key: "VAT at 23%",
                  value: eur(16.16),
                  nowrap: true,
                  note: "Taken from the receipt, not recalculated from the total — the two disagree by a cent often enough to matter.",
                },
                { key: "Total", value: eur(86.4), nowrap: true },
                {
                  key: "Input VAT",
                  value: "Not reclaimable",
                  tone: "warn",
                  note: "Office supplies under €150 are fully deductible, but this supplier is not VAT registered in Portugal.",
                },
              ]}
            />
          </PanelSection>

          <PanelSection title="Why these were matched">
            <p className="m-0 text-base text-fg-muted">
              Same amount, same day, and &ldquo;STAPLES LIS&rdquo; on the statement line
              matches the supplier on the receipt.
            </p>
          </PanelSection>
        </Panel>

        <Dialog
          open={confirming}
          onOpenChange={setConfirming}
          title="Delete the upload?"
          description="The file goes for good, and the charge goes back to having no receipt behind it."
          confirm={{
            label: "Delete the upload",
            variant: "danger",
            onConfirm: () => { setConfirming(false); setOpen(false); },
          }}
        />
      </div>
    );
  },
};

export const OnePanelEveryDetailView: Story = {
  name: "One panel, every detail view",
  parameters: {
    docs: {
      description: {
        story:
          "The same component, three bodies. This is the rule both prototypes wrote down by name: do not build a second panel. A new detail view is another caller, not another component — which is why a receipt, a message and a transaction all open the same way and close the same way.",
      },
    },
  },
  render: function OnePanel() {
    const [which, setWhich] = React.useState<null | "message" | "asset">(null);

    return (
      <div className="flex flex-wrap items-start gap-[10px]">
        <Button variant="secondary" onClick={() => setWhich("message")}>A message</Button>
        <Button variant="secondary" onClick={() => setWhich("asset")}>An asset</Button>

        <Panel
          open={which === "message"}
          onOpenChange={(o) => !o && setWhich(null)}
          title="About the Lisbon Coffee charge"
          subtitle="Ana Rodrigues · 2 hours ago"
          footer={
            <>
              <Button variant="ghost" onClick={() => setWhich(null)}>Close</Button>
              <Button variant="primary" className="ml-auto">Reply to Ana</Button>
            </>
          }
        >
          <PanelSection>
            <p className="m-0 text-base text-fg-muted">
              Could you tell me whether the €12.10 on 5 June was a client meeting? If it
              was, I need the client name for the deduction.
            </p>
          </PanelSection>
        </Panel>

        <Panel
          open={which === "asset"}
          onOpenChange={(o) => !o && setWhich(null)}
          title="MacBook Pro 14”"
          subtitle={`Bought 12 January 2026 · ${eur(2399)}`}
          headerAction={<Chip tone="neutral" size="sm">Depreciating</Chip>}
          footer={
            <>
              <Button variant="ghost" onClick={() => setWhich(null)}>Close</Button>
              <Button variant="primary" className="ml-auto">Edit the asset</Button>
            </>
          }
        >
          <PanelSection title="The asset">
            <KeyValue
              rows={[
                { key: "Category", value: "Computer equipment" },
                { key: "Useful life", value: "3 years", nowrap: true },
                { key: "Written down to", value: eur(1599.33), nowrap: true },
                {
                  key: "This year",
                  value: `−${eur(799.67)}`,
                  nowrap: true,
                  note: "Straight-line over three years, from the month of purchase.",
                },
              ]}
            />
          </PanelSection>
        </Panel>
      </div>
    );
  },
};
