import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import { EmptyState } from "../EmptyState";
import { DataTable, type DataTableColumn } from "./DataTable";

/** Defects found in review, kept as tests so they stay fixed. */

type Row = { id: string; n: number };
const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: `r${i}`, n: i }));
const columns: DataTableColumn<Row>[] = [{ id: "n", header: "Row", cell: (r) => `Row ${r.n}`, sort: (r) => r.n }];
const empty = <EmptyState title="No rows" />;
const wrap = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>);
const first = () => within(screen.getAllByRole("row")[1]).getAllByRole("cell")[0].textContent;

describe("DataTable, after review", () => {
  it("forgets selected rows that are no longer there", async () => {
    const bulk = vi.fn(() => null);
    const user = userEvent.setup();
    function Shrinking() {
      const [list, setList] = React.useState(rows.slice(0, 3));
      return (
        <>
          <button type="button" onClick={() => setList(rows.slice(2, 3))}>
            Delete two
          </button>
          <DataTable caption="Rows" columns={columns} rows={list} getRowId={(r) => r.id} empty={empty} selectable rowLabel={(r) => `Row ${r.n}`} bulkActions={bulk} />
        </>
      );
    }
    wrap(<Shrinking />);
    await user.click(screen.getByRole("checkbox", { name: "Select Row 0" }));
    await user.click(screen.getByRole("checkbox", { name: "Select Row 1" }));
    expect(screen.getByRole("toolbar", { name: "2 selected" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Delete two" }));
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("does not announce the open row as selected", () => {
    wrap(<DataTable caption="Rows" columns={columns} rows={rows.slice(0, 3)} getRowId={(r) => r.id} empty={empty} selectable rowLabel={(r) => `Row ${r.n}`} activeRowId="r1" onRowActivate={() => {}} />);
    const row = screen.getByText("Row 1").closest("tr")!;
    expect(row).not.toHaveAttribute("aria-selected", "true");
    expect(row).toHaveAttribute("aria-current", "true");
  });

  it("goes back to the first page on a new sort", async () => {
    const user = userEvent.setup();
    wrap(<DataTable caption="Rows" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} pageSize={10} />);
    await user.click(screen.getByRole("button", { name: /page 3/i }));
    expect(first()).toBe("Row 20");
    await user.click(within(screen.getByRole("columnheader", { name: /Row/ })).getByRole("button"));
    expect(first()).toBe("Row 0");
  });

  it("does not return to page 3 after a filter shrinks the list and is cleared", async () => {
    const user = userEvent.setup();
    function Filtered() {
      const [few, setFew] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setFew((f) => !f)}>
            Filter
          </button>
          <DataTable caption="Rows" columns={columns} rows={few ? rows.slice(0, 5) : rows} getRowId={(r) => r.id} empty={empty} pageSize={10} />
        </>
      );
    }
    wrap(<Filtered />);
    await user.click(screen.getByRole("button", { name: /page 3/i }));
    await user.click(screen.getByRole("button", { name: "Filter" }));
    await user.click(screen.getByRole("button", { name: "Filter" }));
    expect(first()).toBe("Row 0");
  });

  it("hides paging and the bulk bar while it has nothing to page", () => {
    wrap(<DataTable caption="Rows" columns={columns} rows={rows} getRowId={(r) => r.id} empty={empty} pageSize={10} error="The bank timed out." />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("does not open the row on a near miss beside its checkbox", async () => {
    const onRowActivate = vi.fn();
    const user = userEvent.setup();
    wrap(<DataTable caption="Rows" columns={columns} rows={rows.slice(0, 2)} getRowId={(r) => r.id} empty={empty} selectable rowLabel={(r) => `Row ${r.n}`} onRowActivate={onRowActivate} />);
    await user.click(screen.getByRole("checkbox", { name: "Select Row 0" }).closest("td")!);
    expect(onRowActivate).not.toHaveBeenCalled();
  });
});
