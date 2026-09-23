import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../components/ThemeProvider";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { Checkbox } from "../components/Checkbox";
import { SearchInput } from "../components/SearchInput";
import { Dropzone } from "../components/Dropzone";
import { Button } from "../components/Button";

const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("Input wiring", () => {
  it("associates its label with the control", () => {
    wrap(<Input label="Company name" />);
    expect(screen.getByLabelText("Company name")).toBeInTheDocument();
  });

  it("describes the control with its hint", () => {
    wrap(<Input label="NIF" hint="Nine digits, no spaces." />);
    expect(screen.getByLabelText("NIF")).toHaveAccessibleDescription("Nine digits, no spaces.");
  });

  /**
   * The house rule is that an error replaces the hint rather than stacking
   * under it — two lines of advice under one field is how a user reads neither.
   */
  it("replaces the hint with the error, and marks the control invalid", () => {
    wrap(<Input label="NIF" hint="Nine digits, no spaces." error="A NIF is nine digits. This one has six." />);
    const input = screen.getByLabelText("NIF");
    expect(input).toHaveAccessibleDescription("A NIF is nine digits. This one has six.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Nine digits, no spaces.")).not.toBeInTheDocument();
  });

  it("is not marked invalid without an error", () => {
    wrap(<Input label="NIF" />);
    expect(screen.getByLabelText("NIF")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("accepts typing", async () => {
    const user = userEvent.setup();
    wrap(<Input label="Company name" />);
    const input = screen.getByLabelText("Company name");
    await user.type(input, "Marcondes");
    expect(input).toHaveValue("Marcondes");
  });
});

describe("Textarea", () => {
  it("associates its label", () => {
    wrap(<Textarea label="What should Ana know?" />);
    expect(screen.getByLabelText("What should Ana know?")).toBeInTheDocument();
  });
});

describe("Checkbox", () => {
  it("toggles from the keyboard", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Checkbox label="I have checked the NIF" onCheckedChange={onCheckedChange} />);

    await user.tab();
    await user.keyboard(" ");

    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("toggles by clicking its label", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    wrap(<Checkbox label="I have checked the NIF" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByText("I have checked the NIF"));

    expect(onCheckedChange).toHaveBeenCalled();
  });
});

describe("SearchInput", () => {
  it("clears and returns focus to the field", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    wrap(<SearchInput value="staples" onChange={() => {}} onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("shows no clear button when it is empty", () => {
    wrap(<SearchInput value="" onChange={() => {}} onClear={() => {}} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});

describe("Dropzone", () => {
  it("reports the files chosen through the input", async () => {
    const onFiles = vi.fn();
    const user = userEvent.setup();
    const { container } = wrap(<Dropzone onFiles={onFiles} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["receipt"], "receipt.pdf", { type: "application/pdf" });
    await user.upload(input, file);

    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0][0]).toBe(file);
  });

  it("takes no files while it is uploading", async () => {
    const onFiles = vi.fn();
    const { container } = wrap(<Dropzone onFiles={onFiles} uploading />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("takes no files while it is disabled", () => {
    const { container } = wrap(<Dropzone onFiles={() => {}} disabled />);
    expect(container.querySelector('input[type="file"]')).toBeDisabled();
  });
});

describe("Button", () => {
  it("does not fire while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    wrap(
      <Button loading onClick={onClick}>
        Upload it
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not fire while disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    wrap(
      <Button disabled onClick={onClick}>
        Upload it
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
