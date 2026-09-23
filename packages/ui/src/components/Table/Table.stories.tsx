import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, THead, TBody, TR, TH, TD, TableEmpty } from "./Table";
import { Chip } from "../Chip";
import { EmptyState } from "../EmptyState";
import { Button } from "../Button";
import { docsPage } from "../../lib/docs";
import rules from "./Table.md?raw";

const rows = [
  { date: "3 Jun", who: "Staples Lisboa", acct: "Visa ···· 4417", amount: "-€86.40", status: "ok" as const, label: "Matched" },
  { date: "5 Jun", who: "Lisbon Coffee", acct: "Visa ···· 4417", amount: "-€12.10", status: "warn" as const, label: "No receipt" },
  { date: "8 Jun", who: "Vodafone Portugal", acct: "Millennium ···· 9021", amount: "-€412.60", status: "ok" as const, label: "Matched" },
  { date: "11 Jun", who: "Revolut top-up", acct: "Revolut ···· 7731", amount: "€1,500.00", status: "neutral" as const, label: "Transfer" },
  { date: "14 Jun", who: "Conference fee", acct: "Visa ···· 4417", amount: "-€486.22", status: "bad" as const, label: "Mismatch" },
];

const meta = { title: "Containers/Table", component: Table ,
  parameters: docsPage(rules),
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Table>
      <THead>
        <TR>
          <TH>Date</TH>
          <TH>Supplier</TH>
          <TH>Account</TH>
          <TH align="right">Amount</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((r) => (
          <TR key={r.who}>
            <TD muted>{r.date}</TD>
            <TD>{r.who}</TD>
            <TD muted>{r.acct}</TD>
            <TD numeric>{r.amount}</TD>
            <TD><Chip tone={r.status} size="sm">{r.label}</Chip></TD>
          </TR>
        ))}
      </TBody>
    </Table>
  ),
};

export const Sortable: Story = {
  render: function Sortable() {
    const [sort, setSort] = React.useState<"asc" | "desc">("asc");
    const sorted = [...rows].sort((a, b) =>
      sort === "asc" ? a.who.localeCompare(b.who) : b.who.localeCompare(a.who),
    );
    return (
      <Table>
        <THead>
          <TR>
            <TH>Date</TH>
            <TH sort={sort} onSort={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}>Supplier</TH>
            <TH align="right">Amount</TH>
          </TR>
        </THead>
        <TBody>
          {sorted.map((r) => (
            <TR key={r.who}>
              <TD muted>{r.date}</TD>
              <TD>{r.who}</TD>
              <TD numeric>{r.amount}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    );
  },
};

export const ClickableRows: Story = {
  render: function Clickable() {
    const [picked, setPicked] = React.useState<string | null>("Lisbon Coffee");
    return (
      <Table>
        <THead>
          <TR><TH>Supplier</TH><TH align="right">Amount</TH><TH>Status</TH></TR>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR
              key={r.who}
              clickable
              selected={picked === r.who}
              tabIndex={0}
              onClick={() => setPicked(r.who)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(r.who); }
              }}
            >
              <TD>{r.who}</TD>
              <TD numeric>{r.amount}</TD>
              <TD><Chip tone={r.status} size="sm">{r.label}</Chip></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <Table>
      <THead><TR><TH>Date</TH><TH>Supplier</TH><TH align="right">Amount</TH></TR></THead>
      <TBody>
        <TableEmpty colSpan={3}>
          <EmptyState
            size="sm"
            variant="no-results"
            title="Nothing matches “vodaphone”"
            description="Check the spelling, or clear the search to see all 53 charges."
            action={<Button size="sm">Clear the search</Button>}
          />
        </TableEmpty>
      </TBody>
    </Table>
  ),
};
