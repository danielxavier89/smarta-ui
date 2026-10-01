import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { Upload, type UploadItem } from "./Upload";

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

const files: UploadItem[] = [
  { id: "1", name: "beleg-0612.jpg", size: 182_000, status: "uploaded", type: "image/jpeg" },
  { id: "2", name: "rechnung-118.pdf", size: 1_400_000, status: "uploading", progress: 40 },
  { id: "3", name: "scan.heic", size: 3_100_000, status: "failed", error: "HEIC isn't supported. Export it as JPG." },
];

describe("Upload", () => {
  it("says where every file is in words", () => {
    wrap(<Upload files={files} onFiles={() => {}} />);
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Uploading")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("HEIC isn't supported. Export it as JPG.")).toBeInTheDocument();
  });

  it("names each progress bar by its file", () => {
    wrap(<Upload files={files} onFiles={() => {}} />);
    expect(screen.getByRole("progressbar", { name: "rechnung-118.pdf: Uploading" })).toBeInTheDocument();
  });

  it("offers retry only on failed files, and names what it acts on", async () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();
    wrap(<Upload files={files} onFiles={() => {}} onRetry={onRetry} onRemove={onRemove} />);
    expect(screen.getAllByRole("button", { name: /^Try / })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Try scan.heic again" }));
    expect(onRetry).toHaveBeenCalledWith("3");
    await user.click(screen.getByRole("button", { name: "Remove beleg-0612.jpg" }));
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("announces a file arriving, not every percent", () => {
    const { container, rerender } = wrap(<Upload files={files} onFiles={() => {}} />);
    const live = container.querySelector('[aria-live="polite"]')!;
    const at = (progress: number, status: UploadItem["status"]) =>
      rerender(
        <ThemeProvider>
          <Upload files={[files[0], { ...files[1], progress, status }, files[2]]} onFiles={() => {}} />
        </ThemeProvider>,
      );
    at(80, "uploading");
    expect(live).toHaveTextContent("");
    at(100, "uploaded");
    expect(live).toHaveTextContent("rechnung-118.pdf: Uploaded");
  });

  it("hands chosen files to the product", async () => {
    const onFiles = vi.fn();
    const user = userEvent.setup();
    const { container } = wrap(<Upload files={[]} onFiles={onFiles} />);
    const file = new File(["x"], "beleg.pdf", { type: "application/pdf" });
    await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });
});
