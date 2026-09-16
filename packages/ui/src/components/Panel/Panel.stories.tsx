import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Panel, PanelSection } from "./Panel";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { KeyValue } from "../KeyValue";
import { docsPage } from "@/lib/docs";
import rules from "./Panel.md?raw";

const meta = {
  title: "Overlays/Panel",
  component: Panel,
  parameters: docsPage(rules),
  args: { open: false, onOpenChange: () => {}, title: "Detail", children: null },
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ReceiptDetail: Story = {
  render: function ReceiptDetail() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col gap-[12px]">
        <Button variant="primary" onClick={() => setOpen(true)}>Open the receipt</Button>
        <Panel
          open={open}
          onOpenChange={setOpen}
          title="Staples Lisboa"
          subtitle="3 June 2026 · €86.40"
          headerAction={<Chip tone="ok" size="sm">Matched</Chip>}
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
                { key: "Account", value: "Visa ···· 4417" },
                { key: "Booked", value: "3 June 2026" },
                { key: "Amount", value: "-€86.40" },
              ]}
            />
          </PanelSection>
          <PanelSection title="The receipt">
            <KeyValue
              rows={[
                { key: "Supplier", value: "Staples Lisboa" },
                { key: "NIF", value: "503 214 665" },
                { key: "Net", value: "€70.24" },
                { key: "VAT at 23%", value: "€16.16" },
                { key: "Total", value: "€86.40" },
              ]}
            />
          </PanelSection>
          <PanelSection title="Why these were matched">
            <p className="m-0 text-base text-fg-muted">
              Same amount, same day, and the supplier appears on the statement line.
            </p>
          </PanelSection>
        </Panel>
      </div>
    );
  },
};

export const Wide: Story = {
  render: function Wide() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open a document</Button>
        <Panel
          open={open}
          onOpenChange={setOpen}
          width="wide"
          title="121460_Antwortschreiben_Finanzamt.pdf"
          subtitle="Tax numbers · Lena Hoffmann"
          footer={
            <>
              <Button variant="danger-quiet">Reject &amp; tell the customer</Button>
              <Button variant="primary" className="ml-auto">Verify it</Button>
            </>
          }
        >
          <div className="grid h-full gap-[16px] p-[20px] sm:grid-cols-2">
            <div className="grid min-h-[260px] place-items-center rounded-md border border-border bg-surface-sunken text-sm text-fg-subtle">
              The page
            </div>
            <KeyValue
              rows={[
                { key: "Steuernummer", value: "151/815/08155" },
                { key: "Issued", value: "4 March 2026" },
                { key: "Finanzamt", value: "Berlin Mitte/Tiergarten" },
              ]}
            />
          </div>
        </Panel>
      </>
    );
  },
};

export const OneComponentManyViews: Story = {
  name: "One panel, every detail view",
  render: function Many() {
    const [view, setView] = React.useState<null | "notifications" | "message" | "success">(null);
    const titles = {
      notifications: "Notifications",
      message: "About the Lisbon Coffee charge",
      success: "Sent to Ana",
    } as const;
    return (
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-wrap gap-[8px]">
          <Button onClick={() => setView("notifications")}>Notifications</Button>
          <Button onClick={() => setView("message")}>A message</Button>
          <Button onClick={() => setView("success")}>A success state</Button>
        </div>
        <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
          Both prototypes carry the same house rule: don&rsquo;t build a second panel
          component. Every detail view is another Panel caller — notifications, a receipt,
          a transaction, a picker, a wizard step, a success state.
        </p>
        <Panel
          open={view !== null}
          onOpenChange={(o) => !o && setView(null)}
          title={view ? titles[view] : ""}
        >
          <PanelSection>
            <p className="m-0 text-base text-fg-muted">
              The same component, a different body.
            </p>
          </PanelSection>
        </Panel>
      </div>
    );
  },
};
