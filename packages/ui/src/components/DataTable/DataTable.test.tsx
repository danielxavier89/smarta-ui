import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { EmptyState } from "../EmptyState";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Charge {
  id: string;
  merchant: string;
  amount: number;
  date: Date;
}

const rows: Charge[] = [
  { id: "c1", merchant: "Café Miradouro", amount: 9.5, date: new Date(2026, 5, 12) },
  { id: "c2", merchant: "Aral Tankstelle", amount: 71.2, date: new Date(2026, 5, 3) },
  { id: "c3", merchant: "Ökostrom Nord", amount: 48, date: new Date(2026, 5, 20) },
];

const columns: DataTableColumn<Charge>[] = [
  { id: "merchant", header: "Merchant", cell: (r) => r.merchant, sort: (r) => r.merchant },
  { id: "amount", header: "Amount", cell: (r) => r.amount.toFixed(2), sort: (r) => r.amount, numeric: true },
  { id: "date", header: "Date", cell: (r) => r.date.toISOString().slice(0, 10), sort: (r) => r.date },
];

const empty = <EmptyState title="No charges in June" description="Charges show up here as the bank sends them." />;

const wrap = (ui: React.ReactNode) => render(<ThemeProvider locale="de-DE">{ui}</ThemeProvider>);
const firstColumn = () => screen.getAllByRole("row").slice(1).map((r) => within(r).getAllByRole("cell")[0].textContent);

describe("DataTable", () => {
  it("is a table with a caption", () => {
    wrap(<DataTable caption="Charges in June" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} />);
    expect(screen.getByRole("table", { name: "Charges in June" })).toBeInTheDocument();
  });

  it("sorts asc, desc, then back to the product's order — with aria-sort", async () => {
    const user = userEvent.setup();
    wrap(<DataTable caption="Charges" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} />);
    const header = screen.getByRole("columnheader", { name: /Merchant/ });
    expect(header).toHaveAttribute("aria-sort", "none");
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    // The locale's collation: Ö sorts with O in German, not after Z.
    expect(firstColumn()).toEqual(["Aral Tankstelle", "Café Miradouro", "Ökostrom Nord"]);
    await user.click(within(header).getByRole("button"));
    expect(firstColumn()).toEqual(["Ökostrom Nord", "Café Miradouro", "Aral Tankstelle"]);
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "none");
    expect(firstColumn()).toEqual(["Café Miradouro", "Aral Tankstelle", "Ökostrom Nord"]);
  });

  it("leaves sorting to the product when the sort is controlled", async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    wrap(
      <DataTable caption="Charges" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} sort={null} onSortChange={onSortChange} />,
    );
    await user.click(within(screen.getByRole("columnheader", { name: /Amount/ })).getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "amount", direction: "asc" });
    expect(firstColumn()).toEqual(["Café Miradouro", "Aral Tankstelle", "Ökostrom Nord"]);
  });

  it("selects rows by name, and the header selects the page", async () => {
    const onSelectedChange = vi.fn();
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        selectable
        rowLabel={(r) => r.merchant}
        onSelectedChange={onSelectedChange}
        bulkActions={(ids) => <button type="button">Export {ids.length}</button>}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select Café Miradouro" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["c1"]);
    const all = screen.getByRole("checkbox", { name: "Select all rows on this page" });
    expect(all).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByRole("toolbar", { name: "1 selected" })).toBeInTheDocument();
    await user.click(all);
    expect(onSelectedChange).toHaveBeenLastCalledWith(["c1", "c2", "c3"]);
    await user.click(all);
    expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("activates a row by click and keyboard, but not through its checkbox", async () => {
    const onRowActivate = vi.fn();
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        selectable
        rowLabel={(r) => r.merchant}
        onRowActivate={onRowActivate}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select Aral Tankstelle" }));
    expect(onRowActivate).not.toHaveBeenCalled();
    await user.click(screen.getByText("Aral Tankstelle"));
    expect(onRowActivate).toHaveBeenLastCalledWith(rows[1]);
    screen.getByText("Ökostrom Nord").closest("tr")!.focus();
    await user.keyboard("{Enter}");
    expect(onRowActivate).toHaveBeenLastCalledWith(rows[2]);
  });

  it("shows the product's empty state, never a bare 'No data'", () => {
    wrap(<DataTable caption="Charges" columns={columns} rows={[]} getRowId={(r) => r.id} empty={empty} />);
    expect(screen.getByText("No charges in June")).toBeInTheDocument();
  });

  it("is busy while loading, and the skeleton is hidden from the reader", () => {
    wrap(<DataTable caption="Charges" columns={columns} rows={[]} getRowId={(r) => r.id} empty={empty} loading />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No charges in June")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row", { hidden: false })).toHaveLength(1);
  });

  it("says what went wrong and offers a retry", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        error="The bank connection timed out."
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("The bank connection timed out.")).toBeInTheDocument();
    expect(screen.queryByText("Café Miradouro")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("pages in the browser with pageSize, after sorting", async () => {
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        pageSize={2}
        defaultSort={{ columnId: "amount", direction: "desc" }}
      />,
    );
    expect(firstColumn()).toEqual(["Aral Tankstelle", "Ökostrom Nord"]);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(firstColumn()).toEqual(["Café Miradouro"]);
  });
});
