import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { FilePreview } from "./FilePreview";

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("FilePreview", () => {
  it("shows an image named by the file, with links out", () => {
    wrap(<FilePreview src="/r.jpg" name="beleg-0612.jpg" size={182_000} />);
    expect(screen.getByRole("img", { name: "beleg-0612.jpg" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open in a new tab" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute("download", "beleg-0612.jpg");
    expect(screen.getByText("178 KB")).toBeInTheDocument();
  });

  it("toggles actual size, and makes the scrolling frame reachable", async () => {
    const user = userEvent.setup();
    wrap(<FilePreview src="/r.jpg" name="beleg.jpg" />);
    await user.click(screen.getByRole("button", { name: "Actual size" }));
    expect(screen.getByRole("region", { name: "beleg.jpg" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Fit to frame" })).toBeInTheDocument();
  });

  it("puts a PDF in a titled frame", () => {
    const { container } = wrap(<FilePreview src="/i.pdf" name="Rechnung 2026-118.pdf" />);
    expect(container.querySelector("iframe")).toHaveAttribute("title", "Rechnung 2026-118.pdf");
  });

  it("says when it cannot preview, and still offers the download", () => {
    wrap(<FilePreview src="/x.xlsx" name="Kontoauszug.xlsx" />);
    expect(screen.getByText("This file can't be previewed here.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download" })).toBeInTheDocument();
  });

  it("falls back when the image does not load", () => {
    wrap(<FilePreview src="/gone.jpg" name="gone.jpg" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("This file can't be previewed here.")).toBeInTheDocument();
  });
});

/** asChild handed Slot several children — the icon beside the child — and Slot only takes one. */
describe("asChild on buttons", () => {
  it("IconButton renders the link as the button, icon inside", () => {
    wrap(
      <IconButton asChild label="Download" icon={<svg data-testid="icon" />}>
        <a href="/f.pdf" />
      </IconButton>,
    );
    const link = screen.getByRole("link", { name: "Download" });
    expect(link).toContainElement(screen.getByTestId("icon"));
  });

  it("Button renders the link as the button, icon and text inside", () => {
    wrap(
      <Button asChild iconLeft={<svg data-testid="icon" />}>
        <a href="/settings">Open settings</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Open settings" });
    expect(link).toContainElement(screen.getByTestId("icon"));
  });
});
