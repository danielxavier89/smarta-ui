import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropzone } from "./Dropzone";
import { docsPage } from "@/lib/docs";
import rules from "./Dropzone.md?raw";

const meta = {
  title: "Form/Dropzone",
  component: Dropzone,
  parameters: docsPage(rules),
  args: { onFiles: () => {} },
} satisfies Meta<typeof Dropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: function Basic() {
    const [files, setFiles] = React.useState<string[]>([]);
    return (
      <div className="flex max-w-[480px] flex-col gap-[10px]">
        <Dropzone
          onFiles={(f) => setFiles(f.map((x) => x.name))}
          accept="image/*,.pdf"
          label="Drop receipts here"
          hint="JPG, PNG or PDF, up to 10 MB each."
        />
        {files.length > 0 && (
          <ul className="m-0 list-none p-0 text-sm text-fg-muted">
            {files.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex max-w-[480px] flex-col gap-[14px]">
      <Dropzone onFiles={() => {}} label="Drop the statement here" hint="PDF or CSV." />
      <Dropzone onFiles={() => {}} uploading label="Uploading 3 receipts" hint="This takes a moment." />
      <Dropzone onFiles={() => {}} disabled label="June is closed" hint="Nothing can be added to a closed period." />
      <Dropzone onFiles={() => {}} label="Drop the ID scan here" error="That file is 14 MB. The limit is 10 MB." />
    </div>
  ),
};

export const DragIsNotTheRequirement: Story = {
  name: "Drag is the affordance, not the requirement",
  render: () => (
    <div className="flex max-w-[62ch] flex-col gap-[12px]">
      <Dropzone onFiles={() => {}} label="Drop files here" hint="Or press Enter to choose them." />
      <p className="m-0 text-sm text-fg-subtle">
        The whole zone is a button and is reachable by keyboard, because dragging a file
        is impossible on a phone and awkward with a screen reader. Never ship a drop zone
        that can only be dropped on.
      </p>
    </div>
  ),
};
