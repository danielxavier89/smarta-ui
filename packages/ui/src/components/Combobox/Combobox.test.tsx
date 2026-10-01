import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { Dialog } from "../Dialog";
import { Combobox } from "./Combobox";

const cities = [
  { value: "lis", label: "Lisboa" },
  { value: "prt", label: "Porto" },
  { value: "mun", label: "München" },
  { value: "ber", label: "Berlin", description: "Hauptstadt" },
  { value: "fao", label: "Faro", disabled: true },
];

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("Combobox", () => {
  it("is a combobox named by its label, controlling a listbox", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} />);
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute("id", input.getAttribute("aria-controls"));
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });

  it("narrows ignoring case and accents, and searches the description", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} />);
    await user.type(screen.getByRole("combobox"), "munc");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["München"]);
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "haupt");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["BerlinHauptstadt"]);
  });

  it("chooses with the keyboard and reports value and option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} onValueChange={onValueChange} />);
    await user.type(screen.getByRole("combobox"), "por");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("prt", cities[1]);
    expect(screen.getByRole("combobox")).toHaveValue("Porto");
  });

  it("lists everything when reopened, not just the chosen one", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} defaultValue="lis" />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(5);
    expect(screen.getByRole("option", { name: "Lisboa" })).toHaveAttribute("aria-selected", "true");
  });

  it("says when nothing matches, outside the listbox", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent("Nothing matches");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("puts the chosen name back when left with unmatched text", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} defaultValue="lis" />);
    const input = screen.getByRole("combobox");
    await user.clear(input);
    await user.type(input, "zzz");
    await user.tab();
    expect(input).toHaveValue("Lisboa");
  });

  it("clears the choice when the text is emptied and left", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} defaultValue="lis" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.clear(input);
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null, null);
    expect(input).toHaveValue("");
  });

  it("does not wipe the choice on Escape with the list closed", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} defaultValue="lis" onValueChange={onValueChange} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("combobox")).toHaveValue("Lisboa");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clears with the clear button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} defaultValue="lis" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null, null);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("skips disabled options", async () => {
    const user = userEvent.setup();
    wrap(<Combobox label="City" options={cities} />);
    await user.type(screen.getByRole("combobox"), "faro");
    expect(screen.getByRole("option", { name: "Faro" })).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps the chosen name when server results move on", async () => {
    const user = userEvent.setup();
    function Remote() {
      const [opts, setOpts] = React.useState(cities.slice(0, 2));
      const [v, setV] = React.useState<string | null>(null);
      return (
        <Combobox
          label="City"
          options={opts}
          filter={false}
          value={v}
          onValueChange={setV}
          onInputChange={(t) => setOpts(cities.filter((c) => c.label.toLowerCase().startsWith(t.toLowerCase())))}
        />
      );
    }
    wrap(<Remote />);
    await user.type(screen.getByRole("combobox"), "por");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox")).toHaveValue("Porto");
    await user.type(screen.getByRole("combobox"), "x");
    await user.keyboard("{Escape}");
    await user.tab();
    expect(screen.getByRole("combobox")).toHaveValue("Porto");
  });

  it("submits the value with a native form", () => {
    const { container } = wrap(<Combobox label="City" name="city" options={cities} defaultValue="prt" />);
    expect(container.querySelector('input[type="hidden"][name="city"]')).toHaveValue("prt");
  });

  it("closes on the first Escape inside a Dialog, and the Dialog on the second", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    wrap(
      <Dialog open title="Move the charge" onOpenChange={onOpenChange}>
        <Combobox label="City" options={cities} />
      </Dialog>,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeVisible();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false"));
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
