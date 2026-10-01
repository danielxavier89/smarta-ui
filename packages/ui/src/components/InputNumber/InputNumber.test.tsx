import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { InputNumber } from "./InputNumber";
import { CurrencyInput } from "../CurrencyInput";

const de = (ui: React.ReactNode) => render(<ThemeProvider locale="de-DE">{ui}</ThemeProvider>);
const en = (ui: React.ReactNode) => render(<ThemeProvider locale="en-GB">{ui}</ThemeProvider>);

describe("InputNumber", () => {
  it("is a spinbutton with its value", () => {
    de(<InputNumber label="Useful life" defaultValue={5} min={1} max={30} />);
    const field = screen.getByRole("spinbutton", { name: "Useful life" });
    expect(field).toHaveAttribute("aria-valuenow", "5");
    expect(field).toHaveAttribute("aria-valuemin", "1");
    expect(field).toHaveAttribute("aria-valuemax", "30");
  });

  /** The whole reason it exists: a German user's 1.234,56 is a number. */
  it("reads what a German user types", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<InputNumber label="Amount" decimals={2} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("spinbutton"), "1.234,56");
    expect(onValueChange).toHaveBeenLastCalledWith(1234.56);
  });

  it("reads what an English user types", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    en(<InputNumber label="Amount" decimals={2} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("spinbutton"), "1,234.56");
    expect(onValueChange).toHaveBeenLastCalledWith(1234.56);
  });

  it("groups the number the locale's way once the field is left", async () => {
    const user = userEvent.setup();
    de(<InputNumber label="Amount" />);
    const field = screen.getByRole("spinbutton");
    await user.type(field, "1234567");
    await user.tab();
    expect(field).toHaveValue("1.234.567");
  });

  it("does not reformat what is being typed", async () => {
    const user = userEvent.setup();
    de(<InputNumber label="Amount" />);
    const field = screen.getByRole("spinbutton");
    await user.type(field, "1234");
    expect(field).toHaveValue("1234");
  });

  it("clamps to min and max on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<InputNumber label="Useful life" min={1} max={30} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("spinbutton"), "45");
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(30);
  });

  it("rounds to its decimals on blur", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<InputNumber label="Rate" decimals={1} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("spinbutton"), "19,46");
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(19.5);
  });

  it("falls back to the last good value when what was typed is not a number", async () => {
    const user = userEvent.setup();
    de(<InputNumber label="Amount" defaultValue={12} />);
    const field = screen.getByRole("spinbutton");
    // Select and overtype, so the field never passes through empty — which
    // is a real value (null) and would rightly become the last good one.
    await user.tripleClick(field);
    await user.keyboard("abc");
    await user.tab();
    expect(field).toHaveValue("12");
  });

  it("reports empty as null", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<InputNumber label="Amount" defaultValue={12} onValueChange={onValueChange} />);
    await user.clear(screen.getByRole("spinbutton"));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("steps with the arrow keys, by ten with PageUp", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<InputNumber label="Useful life" defaultValue={5} onValueChange={onValueChange} />);
    screen.getByRole("spinbutton").focus();
    await user.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await user.keyboard("{PageUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(16);
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(15);
  });

  it("keeps its steppers out of the tab order", () => {
    de(<InputNumber label="Useful life" steppers defaultValue={5} />);
    for (const name of ["Increase", "Decrease"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute("tabindex", "-1");
    }
  });

  it("disables the stepper that has nowhere to go", () => {
    de(<InputNumber label="Useful life" steppers defaultValue={30} max={30} />);
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrease" })).not.toBeDisabled();
  });
});

describe("CurrencyInput", () => {
  it("puts the symbol after the amount in German", () => {
    const { container } = de(<CurrencyInput label="Net" defaultValue={1234.5} />);
    const field = screen.getByRole("spinbutton", { name: "Net" });
    expect(field).toHaveValue("1.234,50");
    // The symbol renders after the input.
    const text = container.textContent ?? "";
    expect(text.indexOf("€")).toBeGreaterThan(-1);
    expect(field.compareDocumentPosition(screen.getByText("€")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("puts the symbol before the amount in English", () => {
    en(<CurrencyInput label="Net" defaultValue={1234.5} />);
    const field = screen.getByRole("spinbutton", { name: "Net" });
    expect(field).toHaveValue("1,234.50");
    expect(field.compareDocumentPosition(screen.getByText("€")) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it("tells a screen reader the amount with its currency", () => {
    de(<CurrencyInput label="Net" defaultValue={86.4} />);
    expect(screen.getByRole("spinbutton").getAttribute("aria-valuetext")?.replace(/\s/g, " ")).toBe("86,40 €");
  });

  it("keeps cents", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    de(<CurrencyInput label="Net" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("spinbutton"), "70,245");
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(70.25);
  });
});
