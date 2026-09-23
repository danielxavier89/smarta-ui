import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, THead, TBody, TR, TH, TD } from "./Table";
import { IconButton } from "../IconButton";
import { Checkbox } from "../Checkbox";

/**
 * The defect these cover: `clickable` gave a row the appearance of being
 * pressable and left tabIndex and the key handler to the caller. Callers
 * forgot, and the result was a row that worked with a mouse and was invisible
 * to a keyboard. onActivate exists so the four cannot come apart, so the tests
 * are about the keyboard, not the click.
 */
function Rows({
  onActivate,
  withButton = false,
  onButton,
}: {
  onActivate?: () => void;
  withButton?: boolean;
  onButton?: () => void;
}) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Supplier</TH>
          <TH>Actions</TH>
        </TR>
      </THead>
      <TBody>
        <TR onActivate={onActivate}>
          <TD>Vodafone</TD>
          <TD>
            {withButton && (
              <IconButton size="sm" label="Download the statement" icon={<span>↓</span>} onClick={onButton} />
            )}
          </TD>
        </TR>
      </TBody>
    </Table>
  );
}

describe("TR onActivate", () => {
  it("puts the row in the tab order", async () => {
    render(<Rows onActivate={() => {}} />);
    const row = screen.getByRole("row", { name: /Vodafone/ });
    expect(row).toHaveAttribute("tabindex", "0");
  });

  it("fires on Enter", async () => {
    const onActivate = vi.fn();
    const user = userEvent.setup();
    render(<Rows onActivate={onActivate} />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("fires on Space, and does not scroll the page", async () => {
    const onActivate = vi.fn();
    render(<Rows onActivate={onActivate} />);

    const row = screen.getByRole("row", { name: /Vodafone/ });
    row.focus();

    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    row.dispatchEvent(event);

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("fires on click", async () => {
    const onActivate = vi.fn();
    const user = userEvent.setup();
    render(<Rows onActivate={onActivate} />);

    await user.click(screen.getByText("Vodafone"));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("is not in the tab order without onActivate", () => {
    render(
      <Table>
        <TBody>
          <TR>
            <TD>Inert</TD>
          </TR>
        </TBody>
      </Table>,
    );
    expect(screen.getByRole("row")).not.toHaveAttribute("tabindex");
  });

  /**
   * The bug the hand-rolled version at every call site had: a button inside the
   * row bubbled its click up, so opening the panel and downloading the file
   * both happened on one press.
   */
  it("does not fire when a control inside the row is clicked", async () => {
    const onActivate = vi.fn();
    const onButton = vi.fn();
    const user = userEvent.setup();
    render(<Rows onActivate={onActivate} withButton onButton={onButton} />);

    await user.click(screen.getByRole("button", { name: "Download the statement" }));

    expect(onButton).toHaveBeenCalledTimes(1);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it("does not fire when Enter is pressed on a control inside the row", async () => {
    const onActivate = vi.fn();
    const onButton = vi.fn();
    const user = userEvent.setup();
    render(<Rows onActivate={onActivate} withButton onButton={onButton} />);

    screen.getByRole("button", { name: "Download the statement" }).focus();
    await user.keyboard("{Enter}");

    expect(onButton).toHaveBeenCalledTimes(1);
    expect(onActivate).not.toHaveBeenCalled();
  });
});

/**
 * A label is not itself interactive, so it was not in the "child control"
 * selector — but clicking one forwards the click to the control it names. The
 * result was a row that both toggled the checkbox and opened the panel on one
 * press, which is the same double-fire the guard exists to prevent, arriving
 * through the one element shape the library's own Checkbox renders.
 */
describe("TR onActivate, with a label inside", () => {
  function WithCheckbox({ onActivate, onCheck }: { onActivate: () => void; onCheck: () => void }) {
    return (
      <Table>
        <TBody>
          <TR onActivate={onActivate}>
            <TD>
              <Checkbox label="Select Vodafone" onCheckedChange={onCheck} />
            </TD>
            <TD>Vodafone</TD>
          </TR>
        </TBody>
      </Table>
    );
  }

  it("does not activate when the checkbox's own label is clicked", async () => {
    const onActivate = vi.fn();
    const onCheck = vi.fn();
    const user = userEvent.setup();
    render(<WithCheckbox onActivate={onActivate} onCheck={onCheck} />);

    await user.click(screen.getByText("Select Vodafone"));

    expect(onCheck).toHaveBeenCalledTimes(1);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it("still activates from a plain cell in the same row", async () => {
    const onActivate = vi.fn();
    const user = userEvent.setup();
    render(<WithCheckbox onActivate={onActivate} onCheck={() => {}} />);

    await user.click(screen.getByText("Vodafone"));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});

/**
 * tabIndex comes in through React.HTMLAttributes, so nothing stopped a caller
 * passing -1 and rebuilding, through a prop nobody would look at, exactly the
 * unreachable-by-keyboard row that onActivate exists to prevent.
 */
describe("TR onActivate, against a negative tabIndex", () => {
  it("keeps the row in the tab order and says so", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Table>
        <TBody>
          <TR onActivate={() => {}} tabIndex={-1}>
            <TD>Vodafone</TD>
          </TR>
        </TBody>
      </Table>,
    );

    expect(screen.getByRole("row")).toHaveAttribute("tabindex", "0");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("ignores a negative tabIndex"));
    warn.mockRestore();
  });

  it("honours a positive tabIndex the caller chose", () => {
    render(
      <Table>
        <TBody>
          <TR onActivate={() => {}} tabIndex={3}>
            <TD>Vodafone</TD>
          </TR>
        </TBody>
      </Table>,
    );
    expect(screen.getByRole("row")).toHaveAttribute("tabindex", "3");
  });

  it("leaves a non-activatable row's tabIndex alone", () => {
    render(
      <Table>
        <TBody>
          <TR tabIndex={-1}>
            <TD>Inert</TD>
          </TR>
        </TBody>
      </Table>,
    );
    expect(screen.getByRole("row")).toHaveAttribute("tabindex", "-1");
  });
});

describe("TR clickable, the deprecated path", () => {
  it("warns in development when used without onActivate", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Table>
        <TBody>
          <TR clickable>
            <TD>Looks pressable</TD>
          </TR>
        </TBody>
      </Table>,
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("cannot be reached or fired from a keyboard"));
    warn.mockRestore();
  });

  it("does not warn when onActivate is present", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Rows onActivate={() => {}} />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
