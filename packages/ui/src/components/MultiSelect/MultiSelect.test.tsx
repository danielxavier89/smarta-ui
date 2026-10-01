import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { MultiSelect } from "./MultiSelect";

const categories = [
  { value: "travel", label: "Travel" },
  { value: "meals", label: "Meals" },
  { value: "software", label: "Software" },
  { value: "office", label: "Office supplies" },
];

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("MultiSelect", () => {
  it("is a combobox over a multi-selectable listbox", async () => {
    const user = userEvent.setup();
    wrap(<MultiSelect label="Categories" options={categories} />);
    await user.click(screen.getByRole("combobox", { name: "Categories" }));
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("adds with Enter and stays open for the next one", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<MultiSelect label="Categories" options={categories} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "trav");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["travel"], [categories[0]]);
    expect(input).toHaveValue("");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.type(input, "soft");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["travel", "software"], [categories[0], categories[2]]);
  });

  it("removes a chosen option when it is chosen again", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<MultiSelect label="Categories" options={categories} defaultValue={["meals"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Meals" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("option", { name: "Meals" }));
    expect(onValueChange).toHaveBeenLastCalledWith([], []);
  });

  it("removes with the tag's button, named for what it removes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<MultiSelect label="Categories" options={categories} defaultValue={["meals", "travel"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Remove Meals" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["travel"], [categories[0]]);
  });

  it("removes the last one with Backspace from an empty field", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<MultiSelect label="Categories" options={categories} defaultValue={["meals", "travel"]} onValueChange={onValueChange} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["meals"], [categories[1]]);
  });

  it("announces how many are chosen", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<MultiSelect label="Categories" options={categories} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Travel" }));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent("1 selected");
  });

  it("submits each value with a native form", () => {
    const { container } = wrap(<MultiSelect label="Categories" name="cat" options={categories} defaultValue={["meals", "travel"]} />);
    const hidden = [...container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="cat"]')].map((i) => i.value);
    expect(hidden).toEqual(["meals", "travel"]);
  });
});
