import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { SegmentedControl } from "./SegmentedControl";
import { docsPage } from "@/lib/docs";
import rules from "./SegmentedControl.md?raw";

const meta = {
  title: "Navigation/SegmentedControl",
  component: SegmentedControl,
  parameters: docsPage(rules),
  args: { label: "View", value: "", onValueChange: () => {}, options: [] },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [v, setV] = React.useState("month");
    return (
      <SegmentedControl
        label="Period"
        value={v}
        onValueChange={setV}
        options={[
          { value: "month", label: "Month" },
          { value: "quarter", label: "Quarter" },
          { value: "year", label: "Year" },
        ]}
      />
    );
  },
};

export const WithIcons: Story = {
  render: function WithIcons() {
    const [v, setV] = React.useState("grid");
    return (
      <SegmentedControl
        label="View"
        size="sm"
        value={v}
        onValueChange={setV}
        options={[
          { value: "grid", label: "Grid", icon: <LayoutGrid size={13} /> },
          { value: "list", label: "List", icon: <ListIcon size={13} /> },
        ]}
      />
    );
  },
};

export const VersusTabs: Story = {
  name: "Segmented control or tabs?",
  render: function Versus() {
    const [v, setV] = React.useState("list");
    return (
      <div className="flex max-w-[62ch] flex-col gap-[12px]">
        <SegmentedControl
          label="View"
          value={v}
          onValueChange={setV}
          fullWidth
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "calendar", label: "Calendar" },
          ]}
        />
        <p className="m-0 text-sm text-fg-subtle">
          A segmented control changes <em>how</em> the same content is shown. Tabs change
          <em> what</em> is shown, and carry counts. A RadioGroup records an answer in a
          form. Past four options, or once the labels stop fitting on one line, it is a
          Select.
        </p>
      </div>
    );
  },
};
