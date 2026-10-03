import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Upload, type UploadItem } from "./Upload";
import { docsPage } from "../../lib/docs";
import rules from "./Upload.md?raw";

const meta = {
  title: "Form/Upload",
  component: Upload,
  parameters: docsPage(rules),
  args: {
    label: "Drop this month's receipts here",
    hint: "JPG, PNG or PDF, up to 10 MB each",
    files: [],
    onFiles: () => {},
  },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

const some: UploadItem[] = [
  { id: "u1", name: "beleg-cafe-miradouro.jpg", size: 182_000, status: "uploaded", type: "image/jpeg" },
  { id: "u2", name: "rechnung-2026-118.pdf", size: 1_400_000, status: "uploading", progress: 62 },
  { id: "u3", name: "tankquittung-juni.pdf", size: 96_000, status: "queued" },
  { id: "u4", name: "scan-0611.heic", size: 3_100_000, status: "failed", error: "HEIC isn't supported. Export it as JPG and try again." },
];

export const States: Story = {
  render: (a) => (
    <div className="sui:max-w-[520px]">
      <Upload {...a} files={some} onRetry={() => {}} onRemove={() => {}} />
    </div>
  ),
};

/** Choose some files: each one waits, uploads, and arrives — or fails if its name contains "heic". */
export const Simulated: Story = {
  render: function Sim(a) {
    const [files, setFiles] = React.useState<UploadItem[]>([]);
    const patch = (id: string, p: Partial<UploadItem>) =>
      setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...p } : f)));
    const start = (id: string, name: string) => {
      let progress = 0;
      patch(id, { status: "uploading", progress: 0, error: undefined });
      const t = setInterval(() => {
        progress += 20;
        if (/heic/i.test(name) && progress >= 60) {
          clearInterval(t);
          patch(id, { status: "failed", error: "HEIC isn't supported. Export it as JPG and try again." });
        } else if (progress >= 100) {
          clearInterval(t);
          patch(id, { status: "uploaded", progress: 100 });
        } else patch(id, { progress });
      }, 400);
    };
    return (
      <div className="sui:max-w-[520px]">
        <Upload
          {...a}
          files={files}
          onFiles={(chosen) => {
            const added = chosen.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name,
              size: f.size,
              type: f.type,
              status: "queued" as const,
            }));
            setFiles((fs) => [...fs, ...added]);
            added.forEach((f, i) => setTimeout(() => start(f.id, f.name), 300 * (i + 1)));
          }}
          onRetry={(id) => start(id, "retried")}
          onRemove={(id) => setFiles((fs) => fs.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};
