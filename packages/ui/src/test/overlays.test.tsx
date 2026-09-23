import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../components/ThemeProvider";
import { Dialog } from "../components/Dialog";
import { Panel } from "../components/Panel";

/**
 * Overlays are where a design system either keeps its promises or quietly
 * stops: focus has to go in and come back, Escape has to work, and the thing
 * has to be announced. None of that is visible in a screenshot.
 */

function ControlledDialog(props: Partial<React.ComponentProps<typeof Dialog>> = {}) {
  const [open, setOpen] = React.useState(true);
  return (
    <ThemeProvider>
      <button>outside</button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Close June"
        description="June will become read-only."
        confirm={{ label: "Close it", onConfirm: () => setOpen(false) }}
        {...props}
      />
    </ThemeProvider>
  );
}

describe("Dialog", () => {
  it("is announced with its title and description", () => {
    render(<ControlledDialog />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Close June");
    expect(dialog).toHaveAccessibleDescription("June will become read-only.");
  });

  it("moves focus into itself when it opens", async () => {
    render(<ControlledDialog />);
    await waitFor(() => {
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ControlledDialog />);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not close on Escape when it is blocking", async () => {
    const user = userEvent.setup();
    render(<ControlledDialog blocking />);
    await user.keyboard("{Escape}");
    // Give the close a chance to happen before asserting it did not.
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("hides its close button when it is blocking", () => {
    const { rerender } = render(<ControlledDialog />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    rerender(<ControlledDialog blocking />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("runs the confirm action", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ControlledDialog confirm={{ label: "Close it", onConfirm }} />);
    await user.click(screen.getByRole("button", { name: "Close it" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not run a disabled confirm, and says why it is disabled", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ControlledDialog confirm={{ label: "Close it", onConfirm, disabled: true }} />,
    );
    const button = screen.getByRole("button", { name: "Close it" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe("Panel", () => {
  function ControlledPanel(props: Partial<React.ComponentProps<typeof Panel>> = {}) {
    const [open, setOpen] = React.useState(true);
    return (
      <ThemeProvider>
        <Panel open={open} onOpenChange={setOpen} title="Staples Lisboa" {...props}>
          <p>The charge</p>
        </Panel>
      </ThemeProvider>
    );
  }

  it("is announced with its title", () => {
    render(<ControlledPanel />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Staples Lisboa");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ControlledPanel />);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes from its close button", async () => {
    const user = userEvent.setup();
    render(<ControlledPanel />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  /**
   * Radix portals to document.body, which sits outside the element carrying
   * data-product/data-theme. ThemeScope re-applies it, and without that a panel
   * opened from a dark backoffice surface resolves its tokens from :root.
   */
  it("carries the theme scope into the portal", () => {
    render(
      <ThemeProvider product="backoffice" theme="dark">
        <Panel open onOpenChange={() => {}} title="Beleg">
          <p>Inhalt</p>
        </Panel>
      </ThemeProvider>,
    );
    const scoped = screen.getByRole("dialog").closest("[data-product]");
    expect(scoped).toHaveAttribute("data-product", "backoffice");
    expect(scoped).toHaveAttribute("data-theme", "dark");
  });
});
