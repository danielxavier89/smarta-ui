import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy } from "lucide-react";
import { KeyValue } from "./KeyValue";
import { IconButton } from "../IconButton";
import { Chip } from "../Chip";
import { docsPage } from "../../lib/docs";
import rules from "./KeyValue.md?raw";

const meta = {
  title: "Containers/KeyValue",
  component: KeyValue,
  args: { rows: [] },
} satisfies Meta<typeof KeyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every tax number below deliberately fails its checksum. KeyValue's whole job
// is showing identifiers, so it attracts realistic ones — but these stories are
// published to a public URL, and a checksum-valid NIF or USt-IdNr is somebody's
// real registration whether or not it was invented here.

export const InAPanel: Story = {
  render: () => (
    <div className="max-w-[360px] rounded-lg border border-border bg-surface p-[20px]">
      <KeyValue
        rows={[
          { key: "Supplier", value: "Staples Lisboa" },
          { key: "Date", value: "3 June 2026", nowrap: true },
          {
            key: "NIF",
            value: "503 214 665",
            nowrap: true,
            action: <IconButton size="sm" variant="ghost" label="Copy the NIF" icon={<Copy size={13} />} />,
          },
          { key: "Net", value: "€70.24", nowrap: true },
          { key: "VAT at 23%", value: "€16.16", nowrap: true },
          { key: "Total", value: "€86.40", nowrap: true },
          { key: "Status", value: <Chip tone="ok" size="sm">Matched</Chip> },
        ]}
      />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="max-w-[360px] rounded-lg border border-border bg-surface p-[20px]">
      <KeyValue
        rows={[
          { key: "Receipt total", value: "$540.00", nowrap: true },
          {
            key: "Charged",
            value: "€486.22",
            nowrap: true,
            note: "Converted at 1.1105 on 14 June.",
          },
          { key: "Difference", value: "€0.00", tone: "ok", nowrap: true },
          {
            key: "Input VAT",
            value: "Not reclaimable",
            tone: "warn",
            note: "A purchase outside the EU carries no Portuguese VAT.",
          },
        ]}
      />
    </div>
  ),
};

export const NarrowColumn: Story = {
  name: "A narrow column",
  parameters: {
    ...docsPage(rules),
    docs: {
      description: {
        story:
          "The case that decides the rules. In 200px the key gives way first; a prose value wraps at a space; a value marked nowrap stays whole. Nothing splits mid-word, because a number broken across two lines is a different number, not a smaller one.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-[16px]">
      <div className="w-[200px] rounded-lg border border-border bg-surface p-[16px]">
        <p className="m-0 mb-[10px] text-xs font-medium text-fg-subtle">200px, rows</p>
        <KeyValue
          size="sm"
          rows={[
            { key: "Charged", value: "€486.22", nowrap: true, note: "Converted at 1.1105 on 14 June." },
            { key: "Steuernummer", value: "151/815/08155", nowrap: true },
            { key: "Input VAT", value: "Not reclaimable", tone: "warn" },
            { key: "Registered office", value: "Prinzenstraße 84, 10969 Berlin" },
          ]}
        />
      </div>

      <div className="w-[200px] rounded-lg border border-border bg-surface p-[16px]">
        <p className="m-0 mb-[10px] text-xs font-medium text-fg-subtle">200px, stacked</p>
        <KeyValue
          size="sm"
          layout="stacked"
          rows={[
            { key: "Charged", value: "€486.22", note: "Converted at 1.1105 on 14 June." },
            { key: "Steuernummer", value: "151/815/08155" },
            { key: "Input VAT", value: "Not reclaimable", tone: "warn" },
            { key: "Registered office", value: "Prinzenstraße 84, 10969 Berlin" },
          ]}
        />
      </div>
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div className="max-w-[240px] rounded-lg border border-border bg-surface p-[16px]">
      <KeyValue
        layout="stacked"
        rows={[
          { key: "Steuernummer", value: "151/815/08155" },
          { key: "USt-IdNr", value: "DE 811 907 987" },
          { key: "Registered office", value: "Prinzenstraße 84, 10969 Berlin" },
        ]}
      />
    </div>
  ),
};
