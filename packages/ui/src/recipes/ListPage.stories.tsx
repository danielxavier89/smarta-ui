import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "../components/DropdownMenu";
import { EmptyState } from "../components/EmptyState";
import { KeyValue } from "../components/KeyValue";
import { Pagination } from "../components/Pagination";
import { Panel, PanelSection } from "../components/Panel";
import { SearchInput } from "../components/SearchInput";
import { SkeletonList } from "../components/Skeleton";
import { Table, THead, TBody, TR, TH, TD, TableEmpty } from "../components/Table";
import { Tabs, TabsList, Tab, TabPanel } from "../components/Tabs";
import { docsPage } from "../lib/docs";
import recipe from "../../docs/recipes/list-page.md?raw";

/**
 * The recipe, running.
 *
 * The Docs tab is docs/recipes/list-page.md — the same file an agent loads
 * before writing a screen. This tab is that file executed, which is the part
 * prose cannot do: a recipe nobody has run is a recipe that compiles in
 * somebody's head and nowhere else.
 */
const meta: Meta = {
  title: "Recipes/A list page",
  parameters: {
    layout: "padded",
    ...docsPage(recipe),
  },
};
export default meta;
type Story = StoryObj;

/**
 * Money is formatted by the product, never by a component — so it is defined
 * here, in the screen, exactly as conventions.md says it should be. Copy this
 * into your app once and import it everywhere; two of these in one codebase is
 * how a minus sign ends up on the wrong side of a currency symbol.
 */
const eur = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

type Row = {
  id: string;
  date: string;
  supplier: string;
  amount: number;
  status: "matched" | "missing" | "waiting";
  account: string;
  booked: string;
  nif?: string;
  net?: number;
  vat?: number;
  why: string;
};

// Sample data. The suppliers are real brands because a reconciliation screen
// reads wrong with invented ones — but every tax number here deliberately fails
// its checksum, so none of them can be a real registration. Keep it that way:
// Storybook is published to a public URL.
const ROWS: Row[] = [
  { id: "r1", date: "3 Jun", supplier: "Staples Lisboa", amount: 86.4, status: "matched",
    account: "Visa ···· 4417", booked: "3 June 2026", nif: "503 214 665", net: 70.24, vat: 16.16,
    why: "Same amount, same day, and the supplier appears on the statement line." },
  { id: "r2", date: "3 Jun", supplier: "Galp Energia", amount: 61.02, status: "missing",
    account: "Visa ···· 4417", booked: "3 June 2026",
    why: "No receipt has been uploaded for this charge. Fuel needs one to be deductible." },
  { id: "r3", date: "5 Jun", supplier: "Vodafone", amount: 39.9, status: "matched",
    account: "Direct debit", booked: "5 June 2026", nif: "502 544 187", net: 32.44, vat: 7.46,
    why: "Matched to the June invoice by reference number." },
  { id: "r4", date: "8 Jun", supplier: "Uber BV", amount: 12.1, status: "waiting",
    account: "Visa ···· 4417", booked: "8 June 2026",
    why: "Lena was asked for this receipt on 14 June. No reply yet." },
  { id: "r5", date: "11 Jun", supplier: "Continente", amount: 204.55, status: "missing",
    account: "Visa ···· 4417", booked: "11 June 2026",
    why: "Over €150 and uncategorised, so Ana will want to see the receipt before June is filed." },
];

const TONE = {
  matched: { tone: "ok", label: "Matched" },
  missing: { tone: "bad", label: "No receipt" },
  waiting: { tone: "warn", label: "Waiting on Lena" },
} as const;

export const TheScreen: Story = {
  name: "The screen",
  render: function TheScreen() {
    const [tab, setTab] = React.useState("all");
    const [q, setQ] = React.useState("");
    const [openId, setOpenId] = React.useState<string | null>(null);
    const [hideMatched, setHideMatched] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const byTab = tab === "all" ? ROWS : ROWS.filter((r) => r.status !== "matched");
    const rows = byTab
      .filter((r) => (hideMatched ? r.status !== "matched" : true))
      .filter((r) => r.supplier.toLowerCase().includes(q.trim().toLowerCase()));

    const open = ROWS.find((r) => r.id === openId);

    return (
      <div className="flex flex-col gap-[16px]">
        {/* The page header is assembled by hand because there is no PageHeader
            component. The recipe's shape diagram names one; the inventory does
            not have one. Until that is resolved, every page invents this row —
            which is the argument for adding it. */}
        <div className="flex flex-wrap items-end justify-between gap-[12px]">
          <div>
            <h1 className="m-0 text-xl font-semibold tracking-tight text-fg">June charges</h1>
            <p className="m-0 mt-[2px] text-sm text-fg-subtle">
              53 charges on the statement. 41 have a receipt behind them.
            </p>
          </div>
          <Button variant="primary">Upload a receipt</Button>
        </div>

        {/* Toolbar: search, then filters. One row, wraps on a phone. */}
        <div className="flex flex-wrap items-center gap-[10px]">
          <SearchInput
            containerClassName="flex-1 min-w-[200px] max-w-[340px]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClear={() => setQ("")}
            placeholder="Search by supplier"
            label="Search charges"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" iconLeft={<SlidersHorizontal size={14} />}>
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={hideMatched}
                onCheckedChange={(v) => setHideMatched(Boolean(v))}
              >
                Only charges needing attention
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Counts come off the same arrays the panels render. A count fetched
            separately is a count that will eventually disagree with its list. */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <Tab value="all" count={ROWS.length}>All charges</Tab>
            <Tab value="open" count={ROWS.filter((r) => r.status !== "matched").length}>
              Needs a receipt
            </Tab>
          </TabsList>

          <TabPanel value={tab}>
            <Table>
              <THead sticky>
                <TR>
                  <TH>Date</TH>
                  <TH>Supplier</TH>
                  <TH align="right">Amount</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR
                    key={r.id}
                    clickable
                    tabIndex={0}
                    selected={openId === r.id}
                    onClick={() => setOpenId(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenId(r.id);
                      }
                    }}
                  >
                    <TD muted>{r.date}</TD>
                    <TD>{r.supplier}</TD>
                    <TD numeric>{eur(r.amount)}</TD>
                    <TD>
                      <Chip tone={TONE[r.status].tone} size="sm">
                        {TONE[r.status].label}
                      </Chip>
                    </TD>
                  </TR>
                ))}

                {rows.length === 0 && (
                  <TableEmpty colSpan={4}>
                    <EmptyState
                      size="sm"
                      variant="no-results"
                      title={`Nothing matches “${q}”`}
                      description="Check the spelling, or clear the search to see all 53 charges."
                      action={
                        <Button size="sm" onClick={() => { setQ(""); setHideMatched(false); }}>
                          Clear the search
                        </Button>
                      }
                    />
                  </TableEmpty>
                )}
              </TBody>
            </Table>
          </TabPanel>
        </Tabs>

        <Pagination
          page={page}
          pageCount={3}
          onPageChange={setPage}
          totalItems={53}
          pageSize={20}
        />

        {/* The detail panel. One Panel component, every detail view a caller. */}
        <Panel
          open={Boolean(open)}
          onOpenChange={(o) => !o && setOpenId(null)}
          title={open?.supplier ?? ""}
          subtitle={open ? `${open.booked} · ${eur(open.amount)}` : undefined}
          headerAction={
            open ? (
              <Chip tone={TONE[open.status].tone} size="sm">
                {TONE[open.status].label}
              </Chip>
            ) : undefined
          }
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpenId(null)}>Close</Button>
              <Button variant="primary" className="ml-auto">
                {open?.status === "matched" ? "Send to Ana" : "Upload the receipt"}
              </Button>
            </>
          }
        >
          {open && (
            <>
              <PanelSection title="The charge">
                <KeyValue
                  rows={[
                    { key: "Account", value: open.account, nowrap: true },
                    { key: "Booked", value: open.booked, nowrap: true },
                    { key: "Amount", value: `−${eur(open.amount)}`, nowrap: true },
                  ]}
                />
              </PanelSection>

              {open.nif && (
                <PanelSection title="The receipt">
                  <KeyValue
                    rows={[
                      { key: "Supplier", value: open.supplier },
                      { key: "NIF", value: open.nif, nowrap: true },
                      { key: "Net", value: eur(open.net ?? 0), nowrap: true },
                      {
                        key: "VAT at 23%",
                        value: eur(open.vat ?? 0),
                        nowrap: true,
                        note: "Taken from the receipt, not recalculated from the total.",
                      },
                      { key: "Total", value: eur(open.amount), nowrap: true },
                    ]}
                  />
                </PanelSection>
              )}

              <PanelSection title={open.nif ? "Why these were matched" : "What is missing"}>
                <p className="m-0 text-base text-fg-muted">{open.why}</p>
              </PanelSection>
            </>
          )}
        </Panel>
      </div>
    );
  },
};

export const WhileItLoads: Story = {
  name: "While it loads",
  parameters: {
    docs: {
      description: {
        story:
          "The skeleton sits inside the same shell the rows will land in, so nothing moves when the data arrives. Under about 300ms, show nothing at all and keep the old rows with aria-busy — a flash of skeleton is worse than a beat of stillness.",
      },
    },
  },
  render: function WhileItLoads() {
    return (
      <div className="flex flex-col gap-[16px]">
        <div>
          <h1 className="m-0 text-xl font-semibold tracking-tight text-fg">June charges</h1>
          <p className="m-0 mt-[2px] text-sm text-fg-subtle">Loading the statement…</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-surface p-[var(--density-card-p)]">
          <SkeletonList rows={5} />
        </div>
      </div>
    );
  },
};

export const NothingYet: Story = {
  name: "Nothing yet",
  parameters: {
    docs: {
      description: {
        story:
          "First run is not the same as no results. This one offers the action that creates the first row; the no-results state inside the table above offers to clear the filter. Never the same button.",
      },
    },
  },
  render: () => (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <EmptyState
        variant="first-run"
        title="No charges yet"
        description="Once the bank connection is live, charges land here within a day and we match your receipts to them."
        action={<Button variant="primary" size="sm">Connect a bank account</Button>}
      />
    </div>
  ),
};
