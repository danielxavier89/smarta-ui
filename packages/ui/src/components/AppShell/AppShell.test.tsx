import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { PageHeader } from "../PageHeader";
import { AppShell, NavItem, NavGroup } from "./AppShell";

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

const nav = (
  <NavGroup label="Accounting">
    <NavItem href="/charges" active count={12}>
      Charges
    </NavItem>
    <NavItem href="/receipts">Receipts</NavItem>
  </NavGroup>
);

describe("AppShell", () => {
  it("gives the page its landmarks and a skip link to main", () => {
    wrap(
      <AppShell nav={nav}>
        <p>Page</p>
      </AppShell>,
    );
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("marks the current destination with aria-current, not only a colour", () => {
    wrap(<AppShell nav={nav}>x</AppShell>);
    expect(screen.getByRole("link", { name: /Charges/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Receipts" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("group", { name: "Accounting" })).toBeInTheDocument();
  });

  it("opens the drawer from the menu button and closes it on navigating", async () => {
    const user = userEvent.setup();
    const go = vi.fn((e: React.MouseEvent) => e.preventDefault());
    wrap(
      <AppShell
        nav={
          <NavItem href="/receipts" onClick={go}>
            Receipts
          </NavItem>
        }
      >
        x
      </AppShell>,
    );
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = await screen.findByRole("dialog", { name: "Main" });
    await user.click(drawer.querySelector('a[href="/receipts"]')!);
    expect(go).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("renders a router link as the item with asChild", () => {
    wrap(
      <AppShell
        nav={
          <NavItem asChild active icon={<svg data-testid="i" />}>
            <a href="/settings" data-router="">
              Settings
            </a>
          </NavItem>
        }
      >
        x
      </AppShell>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("aria-current", "page");
  });
});

describe("PageHeader", () => {
  it("renders the page's h1 and breadcrumbs in a named nav", () => {
    wrap(
      <PageHeader
        title="June charges"
        description="53 charges, 41 with a receipt."
        breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: "2026" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "June charges" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accounting" })).toHaveAttribute("href", "/accounting");
  });

  it("offers a single way back instead of breadcrumbs", () => {
    wrap(<PageHeader title="Café Miradouro" back={{ label: "Charges", href: "/charges" }} />);
    expect(screen.getByRole("link", { name: "Charges" })).toHaveAttribute("href", "/charges");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
