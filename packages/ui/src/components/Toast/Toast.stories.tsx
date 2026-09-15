import type { Meta, StoryObj } from "@storybook/react-vite";
import { useToast } from "./Toast";
import { Button } from "../Button";

const meta = { title: "Overlays/Toast", component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: function Tones() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-[8px]">
        <Button onClick={() => toast({ tone: "ok", title: "Moved to Tax Ops", description: "Petra Lang is now with Annekatrin." })}>
          Something moved
        </Button>
        <Button onClick={() => toast({ tone: "warn", title: "One document still blocks the conversion" })}>
          A warning
        </Button>
        <Button onClick={() => toast({ tone: "bad", title: "The upload failed", description: "IMG_4821.jpg is larger than 10 MB." })}>
          A failure
        </Button>
        <Button onClick={() => toast({ tone: "info", title: "June is now closed" })}>
          Information
        </Button>
      </div>
    );
  },
};

export const WithUndo: Story = {
  render: function WithUndo() {
    const { toast } = useToast();
    return (
      <Button
        variant="primary"
        onClick={() =>
          toast({
            title: "Receipt deleted",
            description: "staples.pdf is no longer on the June charge.",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Delete a receipt
      </Button>
    );
  },
};

export const WhenToUseOne: Story = {
  name: "When a toast is the right answer",
  render: function When() {
    const { toast } = useToast();
    return (
      <div className="flex max-w-[62ch] flex-col gap-[12px]">
        <Button onClick={() => toast({ title: "Sent to Ana", description: "She will see it in her queue this morning." })}>
          Send to Ana
        </Button>
        <p className="m-0 text-sm text-fg-subtle">
          The rule from the backoffice prototype: a state change the user cannot see on
          screen gets a toast; everything else shows in place. A toast that announces
          something already visible is noise, and it is the wrong home for anything the
          user has to act on — it leaves before they can.
        </p>
      </div>
    );
  },
};
