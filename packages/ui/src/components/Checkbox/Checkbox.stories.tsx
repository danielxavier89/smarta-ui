import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { docsPage } from "@/lib/docs";
import rules from "./Checkbox.md?raw";

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
  parameters: docsPage(rules),
  args: { label: "Send Ana a copy" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[14px]">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" checked="indeterminate" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
      <Checkbox
        label="Keep the original file"
        description="The scan stays on the lead even after the value is copied into master data."
      />
      <Checkbox label="I have checked the NIF" error="Confirm before converting." />
    </div>
  ),
};

export const SelectAllRow: Story = {
  name: "Select-all in a table header",
  render: function SelectAll() {
    const rows = ["Staples", "Revolut", "Vodafone", "Lisbon Coffee"];
    const [picked, setPicked] = React.useState<string[]>(["Staples"]);
    const all = picked.length === rows.length;
    const some = picked.length > 0 && !all;

    return (
      <div className="w-[320px] overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex items-center gap-[10px] border-b border-border bg-surface-sunken/70 px-[16px] py-[10px]">
          <Checkbox
            size="sm"
            checked={all ? true : some ? "indeterminate" : false}
            onCheckedChange={(v) => setPicked(v === true ? rows : [])}
            aria-label="Select all suppliers"
          />
          <span className="text-xs text-fg-subtle">
            {picked.length ? `${picked.length} selected` : "Supplier"}
          </span>
        </div>
        {rows.map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-[10px] border-b border-border-soft px-[16px] py-[10px] last:border-b-0 hover:bg-surface-hover">
            <Checkbox
              size="sm"
              checked={picked.includes(r)}
              onCheckedChange={(v) =>
                setPicked((p) => (v === true ? [...p, r] : p.filter((x) => x !== r)))
              }
              aria-label={r}
            />
            <span className="text-base text-fg">{r}</span>
          </label>
        ))}
      </div>
    );
  },
};
