import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type DataTableColumn } from "./DataTable";
import { Chip } from "../Chip";
import { Button } from "../Button";
import { EmptyState } from "../EmptyState";
import { docsPage } from "../../lib/docs";
import rules from "./DataTable.md?raw";

// Untyped by component: DataTable is generic, and its stories render it with their own rows.
const meta: Meta = {
  title: "Containers/DataTable",
  component: DataTable,
  parameters: docsPage(rules),
};

export default meta;
type Story = StoryObj;

type Charge = { id: string; date: Date; supplier: string; amount: number; status: "matched" | "missing" | "waiting" };

const eur = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
const day = (d: Date) => new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short" }).format(d);

const suppliers = [
  "Bäckerei Sonnenkorn", "Druckerei Weidmann", "Café Miradouro", "Ökostrom Nord", "Tankstelle am Ring",
  "Kanzlei Vogt & Partner", "Bürowelt Hansen", "Hotel Seeblick", "Taxi Krüger", "Papeterie Lindqvist",
];
const statuses: Charge["status"][] = ["matched", "missing", "matched", "waiting", "matched"];
const charges: Charge[] = Array.from({ length: 23 }, (_, i) => ({
  id: `ch-${i + 1}`,
  date: new Date(2026, 5, 1 + ((i * 7) % 29)),
  supplier: suppliers[i % suppliers.length],
  amount: Math.round(((i * 37.31) % 290) * 100) / 100 + 4.5,
  status: statuses[i % statuses.length],
}));

const TONE = {
  matched: { tone: "ok", label: "Matched" },
  missing: { tone: "bad", label: "No receipt" },
  waiting: { tone: "warn", label: "Waiting" },
} as const;

const columns: DataTableColumn<Charge>[] = [
  { id: "date", header: "Date", cell: (c) => day(c.date), sort: (c) => c.date, muted: true, width: "90px" },
  { id: "supplier", header: "Supplier", cell: (c) => c.supplier, sort: (c) => c.supplier },
  { id: "amount", header: "Amount", cell: (c) => eur(c.amount), sort: (c) => c.amount, numeric: true },
  {
    id: "status",
    header: "Status",
    cell: (c) => (
      <Chip tone={TONE[c.status].tone} size="sm">
        {TONE[c.status].label}
      </Chip>
    ),
  },
];

const empty = (
  <EmptyState
    size="sm"
    title="No charges in June yet"
    description="They show up here as the bank sends them, usually the next morning."
  />
);

export const TheList: Story = {
  name: "Sort, select, open",
  render: function TheList() {
    const [openId, setOpenId] = React.useState<string | undefined>();
    return (
      <DataTable
        caption="Charges in June"
        columns={columns}
        rows={charges}
        getRowId={(c) => c.id}
        empty={empty}
        defaultSort={{ columnId: "date", direction: "asc" }}
        selectable
        rowLabel={(c) => `${c.supplier}, ${eur(c.amount)}`}
        bulkActions={(ids) => (
          <>
            <Button size="sm" variant="primary">
              Ask for {ids.length === 1 ? "the receipt" : "the receipts"}
            </Button>
            <Button size="sm">Export</Button>
          </>
        )}
        onRowActivate={(c) => setOpenId(c.id)}
        activeRowId={openId}
        pageSize={8}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <DataTable caption="Charges in June" columns={columns} rows={[]} getRowId={(c) => c.id} empty={empty} loading pageSize={5} />
  ),
};

export const Empty: Story = {
  render: () => <DataTable caption="Charges in June" columns={columns} rows={[]} getRowId={(c) => c.id} empty={empty} />,
};

export const Failed: Story = {
  render: () => (
    <DataTable
      caption="Charges in June"
      columns={columns}
      rows={charges}
      getRowId={(c) => c.id}
      empty={empty}
      error="The connection to Sparkasse timed out. Nothing was changed."
      onRetry={() => {}}
    />
  ),
};

/** Search, pick several, and a period — all filtering in the browser. Type "zzz" to see the filtered-empty state. */
export const Filtered: Story = {
  render: () => (
    <DataTable
      caption="Charges in June"
      columns={columns}
      rows={charges}
      getRowId={(c) => c.id}
      empty={empty}
      defaultSort={{ columnId: "date", direction: "asc" }}
      pageSize={8}
      filters={[
        { id: "q", type: "search", label: "Search charges", placeholder: "Search by supplier" },
        {
          id: "status",
          type: "options",
          label: "Status",
          value: (c: Charge) => c.status,
          options: [
            { value: "matched", label: "Matched" },
            { value: "missing", label: "No receipt" },
            { value: "waiting", label: "Waiting" },
          ],
        },
        {
          id: "period",
          type: "dateRange",
          label: "Period",
          value: (c: Charge) => c.date,
          presets: [
            { label: "First half of June", range: { from: new Date(2026, 5, 1), to: new Date(2026, 5, 15) } },
            { label: "Second half of June", range: { from: new Date(2026, 5, 16), to: new Date(2026, 5, 30) } },
          ],
        },
      ]}
      defaultFilterValues={{ status: ["missing", "waiting"] }}
    />
  ),
};

/** The filters left nothing: the table says so and offers the way back, instead of the product's "no charges yet". */
export const FilteredToNothing: Story = {
  name: "Filtered to nothing",
  render: () => (
    <DataTable
      caption="Charges in June"
      columns={columns}
      rows={charges}
      getRowId={(c) => c.id}
      empty={empty}
      filters={[{ id: "q", type: "search", label: "Search charges", placeholder: "Search by supplier" }]}
      defaultFilterValues={{ q: "Leasing" }}
    />
  ),
};
