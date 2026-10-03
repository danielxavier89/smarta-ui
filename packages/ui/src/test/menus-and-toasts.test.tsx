import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../components/ThemeProvider";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel } from "../components/DropdownMenu";
import { ToastProvider, useToast } from "../components/Toast";
import { Button } from "../components/Button";

/**
 * Both of these were claimed as covered by "overlays opening and closing" and
 * were in no test at all. ToastProvider in particular is in the README's
 * integration snippet, so every product mounts it.
 */

describe("DropdownMenu", () => {
  function Menu({ onPick }: { onPick?: () => void }) {
    return (
      <ThemeProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">More actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onPick}>Tax Ops</DropdownMenuItem>
            <DropdownMenuItem>Waiting on the customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ThemeProvider>
    );
  }

  it("is closed to begin with, and the trigger says so", () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "More actions" });

    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("runs an item and closes", async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    render(<Menu onPick={onPick} />);

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Tax Ops" }));

    expect(onPick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("reports a checkbox item's state", async () => {
    const user = userEvent.setup();
    function Filters() {
      const [only, setOnly] = React.useState(false);
      return (
        <ThemeProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Filters</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked={only} onCheckedChange={(v) => setOnly(Boolean(v))}>
                Only charges needing attention
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ThemeProvider>
      );
    }
    render(<Filters />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    const item = await screen.findByRole("menuitemcheckbox", {
      name: "Only charges needing attention",
    });
    expect(item).toHaveAttribute("aria-checked", "false");

    await user.click(item);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(
      await screen.findByRole("menuitemcheckbox", { name: "Only charges needing attention" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  /** Radix portals to body, outside the element carrying the theme attributes. */
  it("carries the theme scope into the portal", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider product="backoffice" theme="dark">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Mehr</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tax Ops</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Mehr" }));
    const scoped = (await screen.findByRole("menu")).closest("[data-product]");
    expect(scoped).toHaveAttribute("data-product", "backoffice");
    expect(scoped).toHaveAttribute("data-theme", "dark");
  });
});

describe("Toast", () => {
  function Screen({ labels }: { labels?: Record<string, string> }) {
    function Trigger() {
      const { toast } = useToast();
      return (
        <Button onClick={() => toast({ title: "June is now closed", tone: "ok" })}>
          Close June
        </Button>
      );
    }
    return (
      <ThemeProvider labels={labels}>
        <ToastProvider>
          <Trigger />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  it("shows nothing until something happens", () => {
    render(<Screen />);
    expect(screen.queryByText("June is now closed")).not.toBeInTheDocument();
  });

  it("announces a message when one is raised", async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.click(screen.getByRole("button", { name: "Close June" }));

    expect(await screen.findByText("June is now closed")).toBeInTheDocument();
  });

  it("names its dismiss control in the product's language", async () => {
    const user = userEvent.setup();
    render(<Screen labels={{ dismiss: "Schließen" }} />);

    await user.click(screen.getByRole("button", { name: "Close June" }));
    await screen.findByText("June is now closed");

    expect(screen.getByRole("button", { name: "Schließen" })).toBeInTheDocument();
  });

  it("dismisses on request", async () => {
    const user = userEvent.setup();
    render(<Screen />);

    await user.click(screen.getByRole("button", { name: "Close June" }));
    await screen.findByText("June is now closed");

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    await waitFor(() => expect(screen.queryByText("June is now closed")).not.toBeInTheDocument());
  });

  it("throws a useful error when useToast is used outside the provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useToast();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/ToastProvider/);
    error.mockRestore();
  });
});
