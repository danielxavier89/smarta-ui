import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { Button } from "../Button";
import { Textarea } from "../Textarea";

// Required props live on meta so each story can stay a plain render().
const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  args: { open: false, onOpenChange: () => {}, title: "Are you sure?" },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: function Confirm() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="danger-quiet" onClick={() => setOpen(true)}>Reject the document</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Reject the Gewerbeanmeldung?"
          description="Lena will be told what to send instead, and the onboarding goes back to waiting on the customer."
          confirm={{
            label: "Reject & tell the customer",
            variant: "danger",
            onConfirm: () => setOpen(false),
          }}
        >
          <Textarea label="What should Lena send instead?" rows={3} />
        </Dialog>
      </>
    );
  },
};

export const Blocking: Story = {
  render: function Blocking() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col gap-[10px]">
        <Button onClick={() => setOpen(true)}>Convert Petra</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          blocking
          title="Convert Petra to a customer?"
          description="The offer she accepted becomes a contract, and the onboarding closes. This cannot be undone."
          confirm={{ label: "Convert Petra", onConfirm: () => setOpen(false) }}
          cancelLabel="Not yet"
        />
        <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
          Blocking removes Escape, the click-outside and the close button, so the only way
          out is an answer. Reserve it for something that genuinely cannot be shrugged off.
        </p>
      </div>
    );
  },
};

export const OrAPanel: Story = {
  name: "Dialog or panel?",
  render: () => (
    <p className="m-0 max-w-[62ch] text-base text-fg-muted">
      A Dialog interrupts to ask one question the user cannot postpone — deleting,
      rejecting, sending something to a customer. Anything they can back out of, read
      alongside the page, or leave open while they look at something else belongs in a
      Panel, which does not take the page hostage.
    </p>
  ),
};
