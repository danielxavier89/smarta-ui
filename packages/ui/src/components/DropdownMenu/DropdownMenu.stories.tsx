import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Download, Pencil, Trash2, Share2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "./DropdownMenu";
import { IconButton } from "../IconButton";
import { Button } from "../Button";
import { docsPage } from "../../lib/docs";
import rules from "./DropdownMenu.md?raw";

const meta = { title: "Navigation/DropdownMenu", component: DropdownMenu, parameters: docsPage(rules) } satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton variant="ghost" label="More actions" icon={<MoreHorizontal size={16} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<Pencil size={14} />}>Edit the receipt</DropdownMenuItem>
        <DropdownMenuItem icon={<Download size={14} />}>Download the original</DropdownMenuItem>
        <DropdownMenuItem icon={<Share2 size={14} />}>Send to Ana</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger" icon={<Trash2 size={14} />}>Delete it</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Filters: Story = {
  render: function Filters() {
    const [tones, setTones] = React.useState<string[]>(["missing"]);
    const toggle = (k: string) =>
      setTones((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconRight={<MoreHorizontal size={14} />}>
            Status{tones.length ? ` · ${tones.length}` : ""}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Show charges that are</DropdownMenuLabel>
          {[
            ["missing", "Missing a receipt"],
            ["matched", "Matched"],
            ["mismatch", "A mismatch"],
          ].map(([k, label]) => (
            <DropdownMenuCheckboxItem
              key={k}
              checked={tones.includes(k)}
              onCheckedChange={() => toggle(k)}
              onSelect={(e) => e.preventDefault()}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const NotASelect: Story = {
  name: "A menu is not a select",
  render: () => (
    <p className="m-0 max-w-[62ch] text-base text-fg-muted">
      A DropdownMenu runs <em>actions</em>. If the items are values the user is choosing
      between, and the choice is then stored, it is a Select — native, keyboard-proof and
      better on a phone.
    </p>
  ),
};

export const DisabledItem: Story = {
  name: "An action that cannot run yet",
  render: () => (
    <div className="flex flex-col items-start gap-[10px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Open the receipt</DropdownMenuItem>
          <DropdownMenuItem>Ask the supplier again</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled meta="May is closed">
            Change the category
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger">Delete the upload</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="m-0 max-w-[60ch] text-sm text-fg-subtle">
        A menu is the one place a disabled control can carry its own reason: `meta` sits
        on the right of the row and is read with it. Everywhere else the reason has to
        live beside the control, because there is nowhere inside it to put one.
      </p>
    </div>
  ),
};
