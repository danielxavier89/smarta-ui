import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { DateRangePicker } from "./DateRangePicker";

const de = (ui: React.ReactNode) => render(<ThemeProvider locale="de-DE">{ui}</ThemeProvider>);
const june = { from: new Date(2026, 5, 1), to: new Date(2026, 5, 30) };

describe("DateRangePicker", () => {
  /** A button named only by its label would keep its value a secret. */
  it("is named by its label and its range", () => {
    de(<DateRangePicker label="Period" defaultValue={june} />);
    expect(screen.getByRole("button", { name: "Period 1. Juni 2026 – 30. Juni 2026" })).toBeInTheDocument();
  });

  it("says what to do when nothing is chosen", () => {
    de(<DateRangePicker label="Period" />);
    expect(screen.getByRole("button", { name: "Period Choose dates" })).toBeInTheDocument();
  });

  it("opens a two-month range calendar", async () => {
    const user = userEvent.setup();
    de(<DateRangePicker label="Period" defaultValue={june} />);
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    const dialog = await screen.findByRole("dialog", { name: "Choose dates" });
    expect(within(dialog).getAllByRole("grid")).toHaveLength(2);
  });

  it("stays open after the first click and closes once there is a range", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DateRangePicker label="Period" defaultValue={{ from: null, to: null }} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    const dialog = await screen.findByRole("dialog");
    // The calendar opens on the current month; pick two days in whichever grid comes first.
    const grid = within(dialog).getAllByRole("grid")[0];
    const days = within(grid).getAllByRole("button");
    await user.click(days[2]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(days[9]);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const last = onValueChange.mock.calls.at(-1)?.[0];
    expect(last.from).toBeInstanceOf(Date);
    expect(last.to).toBeInstanceOf(Date);
    expect(last.to.getTime()).toBeGreaterThan(last.from.getTime());
  });

  it("applies a preset in one click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DateRangePicker label="Period" presets={[{ label: "June", range: june }]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    await user.click(await screen.findByRole("button", { name: "June" }));
    expect(onValueChange).toHaveBeenLastCalledWith(june);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  /** Found in review: the first click extended the old range and closed the calendar. */
  it("starts a new range on every opening, and takes the same day twice as one day", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DateRangePicker label="Period" defaultValue={june} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    const dialog = await screen.findByRole("dialog");
    const day10 = within(within(dialog).getAllByRole("grid")[0]).getByRole("button", { name: /10\. Juni/ });
    await user.click(day10);
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 5, 10), to: null });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(within(within(screen.getByRole("dialog")).getAllByRole("grid")[0]).getByRole("button", { name: /10\. Juni/ }));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 5, 10), to: new Date(2026, 5, 10) });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("marks the preset that matches the current range", async () => {
    const user = userEvent.setup();
    de(<DateRangePicker label="Period" defaultValue={june} presets={[{ label: "June", range: june }]} />);
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    expect(await screen.findByRole("button", { name: "June" })).toHaveAttribute("aria-pressed", "true");
  });
});
