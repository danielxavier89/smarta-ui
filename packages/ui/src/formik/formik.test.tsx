import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { ThemeProvider } from "../components/ThemeProvider";
import { Input } from "../components/Input";
import { CurrencyInput } from "../components/CurrencyInput";
import { DatePicker } from "../components/DatePicker";
import { Combobox } from "../components/Combobox";
import { Checkbox } from "../components/Checkbox";
import { Button } from "../components/Button";
import { useFormikField, useFormikValue, useFormikCheckbox, useFormikSubmit } from "./index";

type Values = { email: string; amount: number | null; bookedOn: Date | null; category: string | null; agreed: boolean };

const validate = (v: Values) => {
  const e: Partial<Record<keyof Values, string>> = {};
  if (!v.email.includes("@")) e.email = "Enter the email address the invoice goes to.";
  if (v.amount === null) e.amount = "Enter the amount on the receipt.";
  if (!v.bookedOn) e.bookedOn = "Enter the date on the receipt.";
  if (!v.category) e.category = "Choose a category.";
  if (!v.agreed) e.agreed = "Confirm the receipt is complete.";
  return e;
};

function Fields() {
  return (
    <Form noValidate>
      <Input label="Email" {...useFormikField("email")} />
      <CurrencyInput label="Amount" currency="EUR" {...useFormikValue<number | null>("amount")} />
      <DatePicker label="Booked on" {...useFormikValue<Date | null>("bookedOn")} />
      <Combobox
        label="Category"
        options={[
          { value: "4930", label: "Bürobedarf" },
          { value: "4650", label: "Bewirtungskosten" },
        ]}
        {...useFormikValue<string | null>("category")}
      />
      <Checkbox label="The receipt is complete" {...useFormikCheckbox("agreed")} />
      <Button type="submit" variant="primary" {...useFormikSubmit()}>
        Book the charge
      </Button>
    </Form>
  );
}

function renderForm(onSubmit = vi.fn()) {
  render(
    <ThemeProvider locale="de-DE">
      <Formik<Values>
        initialValues={{ email: "", amount: null, bookedOn: null, category: null, agreed: false }}
        validate={validate}
        onSubmit={onSubmit}
      >
        <Fields />
      </Formik>
    </ThemeProvider>,
  );
  return onSubmit;
}

describe("@smarta/ui/formik", () => {
  it("is silent while typing, speaks on blur, then goes live", async () => {
    const user = userEvent.setup();
    renderForm();
    const email = screen.getByLabelText("Email");
    await user.type(email, "lena");
    expect(screen.queryByText("Enter the email address the invoice goes to.")).not.toBeInTheDocument();
    await user.tab();
    expect(await screen.findByText("Enter the email address the invoice goes to.")).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
    await user.click(email);
    await user.type(email, "@brandt.de");
    await waitFor(() => expect(screen.queryByText("Enter the email address the invoice goes to.")).not.toBeInTheDocument());
  });

  it("shows every error on submit, and submits typed values", async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm();
    await user.click(screen.getByRole("button", { name: "Book the charge" }));
    expect(await screen.findByText("Enter the amount on the receipt.")).toBeInTheDocument();
    expect(screen.getByText("Enter the date on the receipt.")).toBeInTheDocument();
    expect(screen.getByText("Choose a category.")).toBeInTheDocument();
    expect(screen.getByText("Confirm the receipt is complete.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Email"), "lena@brandt.de");
    await user.type(screen.getByRole("spinbutton", { name: "Amount" }), "9,50");
    await user.type(screen.getByLabelText("Booked on"), "12.06.2026");
    await user.tab();
    await user.type(screen.getByRole("combobox", { name: "Category" }), "büro");
    await user.keyboard("{ArrowDown}{Enter}");
    await user.click(screen.getByRole("checkbox", { name: "The receipt is complete" }));
    await user.click(screen.getByRole("button", { name: "Book the charge" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0][0] as Values;
    expect(values).toMatchObject({ email: "lena@brandt.de", amount: 9.5, category: "4930", agreed: true });
    expect(values.bookedOn?.getFullYear()).toBe(2026);
    expect(values.bookedOn?.getMonth()).toBe(5);
    expect(values.bookedOn?.getDate()).toBe(12);
  });
});
