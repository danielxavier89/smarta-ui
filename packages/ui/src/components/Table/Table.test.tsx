import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, THead, TBody, TR, TH, TD } from "./Table";
import { IconButton } from "../IconButton";

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
