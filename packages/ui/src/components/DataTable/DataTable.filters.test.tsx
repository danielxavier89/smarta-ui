import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { EmptyState } from "../EmptyState";
import { DataTable, type DataTableColumn, type DataTableFilter } from "./DataTable";

interface Charge {
  id: string;
  supplier: string;
  category: string;
  date: Date;
  amount: number;
}

const rows: Charge[] = [
  { id: "c1", supplier: "Café Miradouro", category: "meals", date: new Date(2026, 5, 3, 18, 30), amount: 48.5 },
  { id: "c2", supplier: "Druckerei Weidmann", category: "print", date: new Date(2026, 5, 12), amount: 208.01 },
  { id: "c3", supplier: "Ökostrom Nord", category: "utilities", date: new Date(2026, 4, 28), amount: 61 },
  { id: "c4", supplier: "Bürowelt Hansen", category: "office", date: new Date(2026, 5, 30, 18, 0), amount: 164.2 },
];

const columns: DataTableColumn<Charge>[] = [
  { id: "supplier", header: "Supplier", cell: (r) => r.supplier },
  { id: "amount", header: "Amount", cell: (r) => r.amount.toFixed(2), numeric: true },
];

const filters: DataTableFilter<Charge>[] = [
  { id: "q", type: "search", label: "Search charges", placeholder: "Search by supplier" },
  {
    id: "category",
    type: "options",
    label: "Category",
    value: (r) => r.category,
    options: [
      { value: "meals", label: "Meals" },
      { value: "print", label: "Printing" },
      { value: "office", label: "Office" },
      { value: "utilities", label: "Utilities" },
    ],
  },
  { id: "period", type: "dateRange", label: "Period", value: (r) => r.date },
];

const empty = <EmptyState title="No charges yet" description="They arrive from the bank each morning." />;
const wrap = (ui: React.ReactNode) => render(<ThemeProvider locale="de-DE">{ui}</ThemeProvider>);
const suppliers = () => screen.queryAllByRole("row").slice(1).map((r) => within(r).queryAllByRole("cell")[0]?.textContent);

describe("DataTable filters", () => {
  it("searches the row's own text, ignoring case and accents", async () => {
    const user = userEvent.setup();
    wrap(<DataTable caption="Charges" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} filters={filters} />);
    await user.type(screen.getByRole("searchbox", { name: "Search charges" }), "okostrom");
    expect(suppliers()).toEqual(["Ökostrom Nord"]);
  });

  it("keeps rows matching any picked option", async () => {
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        filters={filters}
        defaultFilterValues={{ category: ["meals", "office"] }}
      />,
    );
    expect(suppliers()).toEqual(["Café Miradouro", "Bürowelt Hansen"]);
    await user.click(screen.getByRole("button", { name: "Remove Office" }));
    expect(suppliers()).toEqual(["Café Miradouro"]);
  });

  it("takes whole days at both ends of a period", () => {
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        filters={filters}
        defaultFilterValues={{ period: { from: new Date(2026, 5, 3), to: new Date(2026, 5, 30) } }}
      />,
    );
    // 3 June at 18:30 and 30 June at 18:00 are both in; 28 May is not.
    expect(suppliers()).toEqual(["Café Miradouro", "Druckerei Weidmann", "Bürowelt Hansen"]);
  });

  it("says when the filters emptied it, not the data, and clears them", async () => {
    const user = userEvent.setup();
    wrap(<DataTable caption="Charges" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} filters={filters} />);
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("Nothing matches these filters")).toBeInTheDocument();
    expect(screen.queryByText("No charges yet")).not.toBeInTheDocument();
    const clears = screen.getAllByRole("button", { name: "Clear the filters" });
    await user.click(clears[clears.length - 1]);
    expect(suppliers()).toHaveLength(4);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("shows the product's own empty state when there is no data at all", () => {
    wrap(<DataTable caption="Charges" columns={columns} rows={[]} getRowId={(r) => r.id} empty={empty} filters={filters} />);
    expect(screen.getByText("No charges yet")).toBeInTheDocument();
  });

  it("announces how many rows remain", async () => {
    const user = userEvent.setup();
    const { container } = wrap(
      <DataTable caption="Charges" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} filters={filters} />,
    );
    await user.type(screen.getByRole("searchbox"), "druck");
    const regions = [...container.querySelectorAll('[aria-live="polite"]')].map((n) => n.textContent);
    expect(regions).toContain("1 of 4 shown");
  });

  it("leaves filtering to the product when the values are controlled", async () => {
    const onFiltersChange = vi.fn();
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        filters={filters}
        filterValues={{ q: "" }}
        onFiltersChange={onFiltersChange}
      />,
    );
    await user.type(screen.getByRole("searchbox"), "d");
    expect(onFiltersChange).toHaveBeenLastCalledWith({ q: "d" });
    expect(suppliers()).toHaveLength(4);
  });

  it("goes back to the first page when a filter changes", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 25 }, (_, i) => ({ ...rows[i % 4], id: `r${i}`, supplier: `${rows[i % 4].supplier} ${i}` }));
    wrap(<DataTable caption="Charges" columns={columns} rows={many} getRowId={(r) => r.id} empty={empty} filters={filters} pageSize={5} />);
    await user.click(screen.getByRole("button", { name: /page 3/i }));
    await user.type(screen.getByRole("searchbox"), "café");
    expect(suppliers()[0]).toBe("Café Miradouro 0");
  });

  it("drops selected rows the filters hide from the bulk actions", async () => {
    const user = userEvent.setup();
    wrap(
      <DataTable
        caption="Charges"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={empty}
        filters={filters}
        selectable
        rowLabel={(r) => r.supplier}
        bulkActions={() => null}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select Café Miradouro" }));
    await user.click(screen.getByRole("checkbox", { name: "Select Druckerei Weidmann" }));
    expect(screen.getByRole("toolbar", { name: "2 selected" })).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox"), "café");
    expect(screen.getByRole("toolbar", { name: "1 selected" })).toBeInTheDocument();
  });
});
