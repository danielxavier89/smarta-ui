import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { DatePicker } from "./DatePicker";

const de = (ui: React.ReactNode, labels = {}) =>
  render(
    <ThemeProvider locale="de-DE" labels={labels}>
      {ui}
    </ThemeProvider>,
  );

const ymd = (d: Date | null | undefined) => (d ? [d.getFullYear(), d.getMonth() + 1, d.getDate()] : d);

describe("DatePicker, typed", () => {
  it("reads a German date on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox", { name: "Booked on" }), "03.06.2026");
    expect(onValueChange).not.toHaveBeenCalled(); // silent while typing
    await user.tab();
    expect(ymd(onValueChange.mock.calls.at(-1)?.[0])).toEqual([2026, 6, 3]);
  });

  it("shows what it holds the locale's way", () => {
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} />);
    expect(screen.getByRole("textbox", { name: "Booked on" })).toHaveValue("03.06.2026");
  });

  /** It says how to write one, rather than "Invalid date", and does not report it. */
  it("explains a date it cannot read, and does not report it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" onValueChange={onValueChange} />);
    const field = screen.getByRole("textbox", { name: "Booked on" });
    await user.type(field, "31.02.2026");
    await user.tab();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(/^Write the date like \d\d\.\d\d\.\d{4}\.$/);
  });

  it("goes live once it has spoken: the message clears as soon as the date reads", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" />);
    const field = screen.getByRole("textbox", { name: "Booked on" });
    await user.type(field, "99");
    await user.tab();
    expect(field).toHaveAttribute("aria-invalid", "true");
    await user.clear(field);
    await user.type(field, "03.06.2026");
    expect(field).not.toHaveAttribute("aria-invalid");
  });

  it("says when a typed date is outside the range", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" min={new Date(2026, 5, 1)} />);
    const field = screen.getByRole("textbox", { name: "Booked on" });
    await user.type(field, "31.05.2026");
    await user.tab();
    expect(field).toHaveAccessibleDescription("Choose 01.06.2026 or later.");
  });

  it("reports empty as null", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} onValueChange={onValueChange} />);
    await user.clear(screen.getByRole("textbox", { name: "Booked on" }));
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("lets the product's own error win", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" error="June is closed. Pick a date in July." />);
    const field = screen.getByRole("textbox", { name: "Booked on" });
    await user.type(field, "nonsense");
    await user.tab();
    expect(field).toHaveAccessibleDescription("June is closed. Pick a date in July.");
  });
});

describe("DatePicker, picked", () => {
  it("opens a calendar dialog from its button", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} />);
    await user.click(screen.getByRole("button", { name: "Choose a date" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a date" });
    expect(within(dialog).getByRole("grid", { name: "Juni 2026" })).toBeInTheDocument();
  });

  it("opens with Alt+ArrowDown from the field", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" />);
    screen.getByRole("textbox", { name: "Booked on" }).focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("commits the picked day and closes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Choose a date" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^15\. Juni 2026/ }));
    expect(ymd(onValueChange.mock.calls.at(-1)?.[0])).toEqual([2026, 6, 15]);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("textbox", { name: "Booked on" })).toHaveValue("15.06.2026");
  });

  it("names the selected day as selected", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} />);
    await user.click(screen.getByRole("button", { name: "Choose a date" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "3. Juni 2026, selected" })).toBeInTheDocument();
  });

  /** react-day-picker's own words are English whatever its locale; ours are not. */
  it("speaks the product's language in the calendar", async () => {
    const user = userEvent.setup();
    de(<DatePicker label="Gebucht am" defaultValue={new Date(2026, 5, 3)} />, {
      chooseDate: "Datum wählen",
      previousMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
      selected: "ausgewählt",
    });
    await user.click(screen.getByRole("button", { name: "Datum wählen" }));
    const dialog = await screen.findByRole("dialog", { name: "Datum wählen" });
    expect(within(dialog).getByRole("button", { name: "Vorheriger Monat" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Nächster Monat" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "3. Juni 2026, ausgewählt" })).toBeInTheDocument();
  });

  it("will not pick a day outside the range", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(
      <DatePicker
        label="Booked on"
        defaultValue={new Date(2026, 5, 10)}
        min={new Date(2026, 5, 5)}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Choose a date" }));
    const dialog = await screen.findByRole("dialog");
    const early = within(dialog).getByRole("button", { name: /^2\. Juni 2026/ });
    expect(early).toBeDisabled();
  });
});

/** Found in review. */
describe("DatePicker, the edges", () => {
  it("keeps the date when the chosen day is clicked again", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" defaultValue={new Date(2026, 5, 3)} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Choose a date" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^3\. Juni 2026/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Booked on" })).toHaveValue("03.06.2026");
  });

  it("refuses a typed day the field excludes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    de(<DatePicker label="Booked on" isDisabled={weekend} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "06.06.2026");
    await user.tab();
    expect(screen.getByRole("alert")).toHaveTextContent("That date can't be chosen here.");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("drops leftover text and message when the parent sets a value", async () => {
    const user = userEvent.setup();
    function Reset() {
      const [v, setV] = React.useState<Date | null>(null);
      return (
        <>
          <DatePicker label="Booked on" value={v} onValueChange={setV} />
          <button type="button" onClick={() => setV(new Date(2026, 5, 1))}>Reset</button>
        </>
      );
    }
    de(<Reset />);
    await user.type(screen.getByRole("textbox"), "31.02.2026");
    await user.tab();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("01.06.2026");
  });

  it("does not report null when it was already empty", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<DatePicker label="Booked on" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "1");
    await user.clear(screen.getByRole("textbox"));
    await user.tab();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
