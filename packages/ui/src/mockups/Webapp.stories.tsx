import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, CheckCircle2, Circle, MoreHorizontal, Plus } from "lucide-react";
import { formatDate } from "../lib/format";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from "../components/Card";
import { Callout } from "../components/Callout";
import { Button } from "../components/Button";
import { TextLink } from "../components/TextLink";
import { List, ListItem } from "../components/ListItem";
import { Chip } from "../components/Chip";
import { Progress } from "../components/Progress";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { SearchInput } from "../components/SearchInput";
import { MultiSelect } from "../components/MultiSelect";
import { DateRangePicker, type DateRange } from "../components/DateRangePicker";
import { Tabs, TabsList, Tab, TabPanel } from "../components/Tabs";
import { Panel, PanelSection } from "../components/Panel";
import { FilePreview } from "../components/FilePreview";
import { KeyValue } from "../components/KeyValue";
import { Combobox } from "../components/Combobox";
import { Upload, type UploadItem } from "../components/Upload";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { DatePicker } from "../components/DatePicker";
import { CurrencyInput } from "../components/CurrencyInput";
import { RadioGroup } from "../components/RadioGroup";
import { Checkbox } from "../components/Checkbox";
import { Textarea } from "../components/Textarea";
import { Avatar } from "../components/Avatar";
import { IconButton } from "../components/IconButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/DropdownMenu";
import { useToast } from "../components/Toast";
import { WebappShell, eur } from "./shells";
import {
  bankAccounts,
  categories,
  categoryLabel,
  charges,
  company,
  receiptImage,
  returnChecklist,
  statusWord,
  team,
  type Charge,
} from "./data";

/**
 * Whole pages of the client-facing webapp, built only from the library and
 * filled with invented data — to show how the parts sit together, not to
 * document any one of them. Each component's own page has its rules.
 */
const meta: Meta = {
  title: "Mockups/Webapp",
  // The webapp's pages in the webapp's colours, whatever the toolbar says.
  globals: { product: "webapp" },
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const day = (d: Date) => formatDate(d, "en-GB", "short");
const june = { from: new Date(2026, 5, 1), to: new Date(2026, 5, 30) };

function StatusChip({ status }: { status: Charge["status"] }) {
  return (
    <Chip tone={statusWord[status].tone} size="sm" dot>
      {statusWord[status].label}
    </Chip>
  );
}

/* ---------------------------------------------------------------- Overview */

export const Overview: Story = {
  render: () => {
    const missing = charges.filter((c) => c.status === "missing");
    const big = missing.filter((c) => c.amount > 150);
    const done = returnChecklist.filter((r) => r.done).length;
    return (
      <WebappShell current="overview">
        <div className="sui:flex sui:flex-col sui:gap-[24px]">
          <PageHeader
            title="Good morning, Lena"
            description={`June is filed in 9 days. ${missing.length} charges still need a receipt.`}
            actions={<Button variant="primary">Upload receipts</Button>}
          />

          <Callout
            tone="warn"
            title={`${big.length} receipts over 150 € are missing`}
            action={<Button size="sm">Show them</Button>}
          >
            <p className="sui:m-0">Ana needs them before June can be filed: {big.map((c) => c.supplier).join(", ")}.</p>
          </Callout>

          <div className="sui:grid sui:grid-cols-1 sui:gap-[16px] sui:sm:grid-cols-2 sui:xl:grid-cols-4">
            <StatCard label="Charges in June" value={String(charges.length)} caption="From 2 accounts" />
            <StatCard label="Without a receipt" value={String(missing.length)} tone="warn" caption="Upload them to stay deductible" />
            <StatCard label="Spent in June" value={eur(charges.reduce((s, c) => s + c.amount, 0))} caption="12 % less than May" />
            <StatCard label="Set aside for tax" value={eur(4180)} tone="ok" caption="Enough for Q2" />
          </div>

          <div className="sui:grid sui:grid-cols-1 sui:gap-[16px] sui:lg:grid-cols-[3fr_2fr]">
            <Card>
              <CardHeader>
                <CardTitle as="h2">Needs a receipt</CardTitle>
                <CardDescription>The oldest first. A photo of the paper one is enough.</CardDescription>
              </CardHeader>
              <List>
                {missing.map((c) => (
                  <ListItem
                    key={c.id}
                    leading={<Avatar name={c.supplier} kind="institution" size="sm" />}
                    title={c.supplier}
                    description={`${day(c.date)} · ${c.description}`}
                    meta={<span className="sui:tabular-nums sui:font-medium sui:text-fg">{eur(c.amount)}</span>}
                    actions={<Button size="sm">Upload it</Button>}
                  />
                ))}
              </List>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle as="h2">Tax return 2025</CardTitle>
                <CardDescription>Ana is preparing it. Two things are still with you.</CardDescription>
              </CardHeader>
              <CardBody className="sui:flex sui:flex-col sui:gap-[16px]">
                <Progress value={(done / returnChecklist.length) * 100} label="Tax return 2025" showLabel />
                <ul className="sui:m-0 sui:flex sui:list-none sui:flex-col sui:gap-[10px] sui:p-0">
                  {returnChecklist.map((r) => (
                    <li key={r.id} className="sui:flex sui:items-start sui:gap-[10px] sui:text-sm">
                      {r.done ? (
                        <CheckCircle2 size={16} aria-hidden className="sui:mt-[2px] sui:shrink-0 sui:text-ok" />
                      ) : (
                        <Circle size={16} aria-hidden className="sui:mt-[2px] sui:shrink-0 sui:text-fg-faint" />
                      )}
                      <span>
                        <span className={r.done ? "sui:text-fg-muted" : "sui:font-medium sui:text-fg"}>{r.title}</span>
                        <span className="sui:sr-only">{r.done ? ", done" : ", to do"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <TextLink>Open the return</TextLink>
              </CardFooter>
            </Card>
          </div>
        </div>
      </WebappShell>
    );
  },
};

/* ----------------------------------------------------------------- Charges */

function ChargePanel({ charge, onClose }: { charge: Charge | null; onClose: () => void }) {
  const { toast } = useToast();
  const [category, setCategory] = React.useState<string | null>(charge?.category ?? null);
  React.useEffect(() => setCategory(charge?.category ?? null), [charge]);
  if (!charge) return null;
  return (
    <Panel
      open
      onOpenChange={(o) => !o && onClose()}
      title={charge.supplier}
      subtitle={`${eur(charge.amount)} on ${formatDate(charge.date, "en-GB")}`}
      headerAction={<StatusChip status={charge.status} />}
      footer={
        charge.receipt ? (
          <Button
            variant="primary"
            className="sui:ml-auto"
            onClick={() => {
              toast({ tone: "ok", title: "Category saved", description: `${charge.supplier} is now under ${categoryLabel(category ?? "")}.` });
              onClose();
            }}
          >
            Save the category
          </Button>
        ) : (
          <Button variant="primary" className="sui:ml-auto">
            Upload the receipt
          </Button>
        )
      }
    >
      <PanelSection title="Receipt">
        {charge.receipt ? (
          <FilePreview
            src={receiptImage(charge.supplier, eur(charge.amount), formatDate(charge.date, "de-DE", "numeric"))}
            name={charge.receipt.name}
            type="image/svg+xml"
            size={charge.receipt.size}
            height={300}
          />
        ) : (
          <EmptyState
            size="sm"
            title="No receipt yet"
            description="Without one this charge is not deductible. Take a photo of the paper receipt or forward the email to receipts@smarta.example."
          />
        )}
      </PanelSection>
      <PanelSection title="Details">
        <KeyValue
          size="sm"
          rows={[
            { key: "What", value: charge.description },
            { key: "Paid with", value: charge.account },
            { key: "Booked", value: formatDate(charge.date, "en-GB") },
            { key: "VAT included", value: eur(charge.amount - charge.amount / 1.19) },
          ]}
        />
      </PanelSection>
      <PanelSection title="Category">
        <Combobox label="Category" options={categories} value={category} onValueChange={setCategory} clearable={false} />
      </PanelSection>
    </Panel>
  );
}

export const Charges: Story = {
  render: function ChargesPage() {
    const [query, setQuery] = React.useState("");
    const [cats, setCats] = React.useState<string[]>([]);
    const [period, setPeriod] = React.useState<DateRange>(june);
    const [tab, setTab] = React.useState("all");
    const [open, setOpen] = React.useState<Charge | null>(null);

    const matches = charges.filter(
      (c) =>
        (!query || `${c.supplier} ${c.description}`.toLowerCase().includes(query.toLowerCase())) &&
        (cats.length === 0 || cats.includes(c.category)) &&
        (!period.from || c.date >= period.from) &&
        (!period.to || c.date <= period.to),
    );
    const rows = tab === "open" ? matches.filter((c) => c.status !== "matched") : matches;

    const columns: DataTableColumn<Charge>[] = [
      { id: "date", header: "Date", cell: (c) => day(c.date), sort: (c) => c.date, muted: true, width: "90px" },
      {
        id: "supplier",
        header: "Supplier",
        sort: (c) => c.supplier,
        cell: (c) => (
          <span className="sui:flex sui:flex-col">
            <span>{c.supplier}</span>
            <span className="sui:text-xs sui:text-fg-subtle">{c.description}</span>
          </span>
        ),
      },
      { id: "category", header: "Category", cell: (c) => categoryLabel(c.category), sort: (c) => categoryLabel(c.category), muted: true },
      { id: "amount", header: "Amount", cell: (c) => eur(c.amount), sort: (c) => c.amount, numeric: true },
      { id: "status", header: "Receipt", cell: (c) => <StatusChip status={c.status} /> },
    ];

    const clear = () => {
      setQuery("");
      setCats([]);
      setPeriod(june);
    };

    return (
      <WebappShell current="charges">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader
            title="Charges"
            description={`${charges.length} charges in June from your Girokonto and Visa card. ${charges.filter((c) => c.status !== "matched").length} still need you.`}
            actions={
              <>
                <Button>Export for Ana</Button>
                <Button variant="primary" iconLeft={<Plus size={14} />}>
                  Upload receipts
                </Button>
              </>
            }
          />

          <div className="sui:flex sui:flex-wrap sui:items-end sui:gap-[12px]">
            <SearchInput
              label="Search charges"
              placeholder="Search by supplier"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              containerClassName="sui:w-full sui:sm:w-[260px]"
            />
            <MultiSelect
              aria-label="Categories"
              options={categories}
              value={cats}
              onValueChange={setCats}
              placeholder="All categories"
              className="sui:w-full sui:sm:w-[280px]"
            />
            <DateRangePicker
              label="Period"
              value={period}
              onValueChange={setPeriod}
              presets={[
                { label: "June", range: june },
                { label: "May", range: { from: new Date(2026, 4, 1), to: new Date(2026, 4, 31) } },
                { label: "Second quarter", range: { from: new Date(2026, 3, 1), to: new Date(2026, 5, 30) } },
              ]}
              className="sui:w-full sui:sm:w-[300px]"
            />
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <Tab value="all" count={matches.length}>
                All charges
              </Tab>
              <Tab value="open" count={matches.filter((c) => c.status !== "matched").length}>
                Needs you
              </Tab>
            </TabsList>
            <TabPanel value={tab} className="sui:pt-[16px]">
              <DataTable
                caption="Charges"
                columns={columns}
                rows={rows}
                getRowId={(c) => c.id}
                defaultSort={{ columnId: "date", direction: "desc" }}
                onRowActivate={setOpen}
                activeRowId={open?.id}
                selectable
                rowLabel={(c) => `${c.supplier}, ${eur(c.amount)}`}
                bulkActions={(ids) => (
                  <>
                    <Button size="sm" variant="primary">
                      Ask Ana about {ids.length === 1 ? "this charge" : `these ${ids.length}`}
                    </Button>
                    <Button size="sm">Mark as private</Button>
                  </>
                )}
                pageSize={10}
                empty={
                  <EmptyState
                    variant="no-results"
                    size="sm"
                    title="No charge matches these filters"
                    description="Try another period or category, or clear the filters to see all of June."
                    action={<Button size="sm" onClick={clear}>Clear the filters</Button>}
                  />
                }
              />
            </TabPanel>
          </Tabs>
        </div>
        <ChargePanel charge={open} onClose={() => setOpen(null)} />
      </WebappShell>
    );
  },
};

/** The same page with a charge open, so the panel can be seen without a click. */
export const ChargeOpen: Story = {
  name: "Charge open",
  render: () => (
    <WebappShell current="charges">
      <PageHeader title="Charges" description="One charge open in the panel." />
      <ChargePanel charge={charges[2]} onClose={() => {}} />
    </WebappShell>
  ),
};

/* --------------------------------------------------------- Upload receipts */

export const UploadReceipts: Story = {
  name: "Upload receipts",
  render: function UploadPage() {
    const [files, setFiles] = React.useState<UploadItem[]>([
      { id: "f1", name: "beleg-druckerei-weidmann.jpg", size: 1_240_000, status: "uploaded", type: "image/jpeg" },
      { id: "f2", name: "IMG_4821.jpg", size: 2_830_000, status: "uploading", progress: 64, type: "image/jpeg" },
      { id: "f3", name: "kuchenbaecker-rechnung.pdf", size: 310_000, status: "queued" },
      { id: "f4", name: "scan-taxi.heic", size: 3_100_000, status: "failed", error: "HEIC photos aren't supported yet. Export it as JPG and try again." },
    ]);
    const matched = charges.filter((c) => c.status === "missing").slice(0, 3);
    return (
      <WebappShell current="upload">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader
            back={{ label: "Charges", href: "#charges", onClick: (e) => e.preventDefault() }}
            title="Upload receipts"
            description="Drop them all at once. smarta reads each one and finds the charge it belongs to."
          />
          <div className="sui:grid sui:grid-cols-1 sui:gap-[20px] sui:lg:grid-cols-[3fr_2fr]">
            <Upload
              label="Drop your receipts here"
              hint="JPG, PNG or PDF, up to 10 MB each"
              accept="image/jpeg,image/png,application/pdf"
              files={files}
              onFiles={(chosen) =>
                setFiles((fs) => [
                  ...fs,
                  ...chosen.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size, type: f.type, status: "queued" as const })),
                ])
              }
              onRetry={(id) => setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 10, error: undefined } : f)))}
              onRemove={(id) => setFiles((fs) => fs.filter((f) => f.id !== id))}
            />
            <Card>
              <CardHeader>
                <CardTitle as="h2">Matched so far</CardTitle>
                <CardDescription>Check them; Ana sees them as soon as you do.</CardDescription>
              </CardHeader>
              <List>
                {matched.map((c, i) => (
                  <ListItem
                    key={c.id}
                    title={c.supplier}
                    description={`${day(c.date)} · ${eur(c.amount)}`}
                    meta={
                      i === 0 ? (
                        <Chip tone="ok" size="sm" dot>
                          Matched
                        </Chip>
                      ) : (
                        <Chip tone="neutral" size="sm" dot>
                          Reading…
                        </Chip>
                      )
                    }
                  />
                ))}
              </List>
              <CardFooter>
                <span className="sui:text-sm sui:text-fg-subtle">Forwarding works too: receipts@smarta.example</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </WebappShell>
    );
  },
};

/* ------------------------------------------------------------- Tax return */

export const TaxReturn: Story = {
  name: "Tax return",
  render: () => {
    const done = returnChecklist.filter((r) => r.done).length;
    return (
      <WebappShell current="return">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader
            title="Tax return 2025"
            meta={<Chip tone="warn" dot>2 things with you</Chip>}
            description={`Ana Ribeiro is preparing it. Filed by 31 July 2026.`}
            actions={<Button>Message Ana</Button>}
          />
          <div className="sui:grid sui:grid-cols-1 sui:gap-[16px] sui:md:grid-cols-3">
            <StatCard label="Income" value={eur(68_420)} caption="From 41 invoices" />
            <StatCard label="Business expenses" value={eur(19_870)} caption="214 charges" />
            <StatCard label="Expected refund" value={eur(1_240)} tone="ok" caption="An estimate until Ana signs off" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle as="h2">What's left</CardTitle>
              <CardDescription>
                {done} of {returnChecklist.length} done.
              </CardDescription>
            </CardHeader>
            <CardBody>
              <Progress value={(done / returnChecklist.length) * 100} label="Tax return 2025" />
            </CardBody>
            <List>
              {returnChecklist.map((r) => (
                <ListItem
                  key={r.id}
                  leading={
                    r.done ? (
                      <CheckCircle2 size={18} aria-hidden className="sui:text-ok" />
                    ) : (
                      <AlertTriangle size={18} aria-hidden className="sui:text-warn" />
                    )
                  }
                  title={r.title}
                  description={r.description}
                  meta={
                    <Chip tone={r.done ? "ok" : "warn"} size="sm">
                      {r.done ? "Done" : "To do"}
                    </Chip>
                  }
                  actions={!r.done && r.id !== "r5" ? <Button size="sm">Do it now</Button> : undefined}
                />
              ))}
            </List>
          </Card>
        </div>
      </WebappShell>
    );
  },
};

/* --------------------------------------------------------------- Settings */

export const Settings: Story = {
  render: function SettingsPage() {
    const { toast } = useToast();
    const [tab, setTab] = React.useState("company");
    return (
      <WebappShell current="settings">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader title="Settings" description={`${company.name} · ${company.legalForm}`} />
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <Tab value="company">Company</Tab>
              <Tab value="banks" count={bankAccounts.length}>
                Bank accounts
              </Tab>
              <Tab value="team" count={team.length}>
                Team
              </Tab>
            </TabsList>

            <TabPanel value="company" className="sui:pt-[20px]">
              <form
                className="sui:grid sui:max-w-[640px] sui:gap-[16px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({ tone: "ok", title: "Company details saved" });
                }}
              >
                <div className="sui:grid sui:gap-[16px] sui:sm:grid-cols-2">
                  <Input label="Business name" defaultValue={company.name} />
                  <Input label="Owner" defaultValue={company.owner} />
                </div>
                <Input label="Address" defaultValue={company.address} hint="Printed on the invoices smarta writes for you." />
                <div className="sui:grid sui:gap-[16px] sui:sm:grid-cols-2">
                  <Select
                    label="Bundesland"
                    defaultValue="sn"
                    options={[
                      { value: "be", label: "Berlin" },
                      { value: "by", label: "Bayern" },
                      { value: "sn", label: "Sachsen" },
                      { value: "nw", label: "Nordrhein-Westfalen" },
                    ]}
                  />
                  <DatePicker label="In business since" defaultValue={company.founded} locale="en-GB" />
                </div>
                <CurrencyInput
                  label="Expected revenue this year"
                  currency="EUR"
                  defaultValue={72000}
                  hint="Ana uses it to estimate your tax prepayments."
                />
                <RadioGroup
                  label="VAT returns"
                  appearance="card"
                  defaultValue={company.vatFiling}
                  options={[
                    { value: "monthly", label: "Monthly", description: "Required above 9.000 € VAT a year." },
                    { value: "quarterly", label: "Quarterly", description: "Most freelancers. Due on the 10th after each quarter." },
                    { value: "yearly", label: "Once a year", description: "Only with very little VAT." },
                  ]}
                />
                <Textarea label="Anything Ana should know" optional rows={3} placeholder="A new car, a second business, a move…" />
                <Checkbox label="Email me when a receipt is missing for more than a week" defaultChecked />
                <div className="sui:flex sui:gap-[8px]">
                  <Button type="submit" variant="primary">
                    Save the details
                  </Button>
                </div>
              </form>
            </TabPanel>

            <TabPanel value="banks" className="sui:pt-[20px]">
              <Card>
                <List>
                  {bankAccounts.map((b) => (
                    <ListItem
                      key={b.id}
                      leading={<Avatar name={b.bank} kind="institution" />}
                      title={`${b.bank} · ${b.name}`}
                      description={`${b.masked} · last synced ${b.synced}`}
                      meta={
                        b.status === "connected" ? (
                          <Chip tone="ok" size="sm" dot>
                            Connected
                          </Chip>
                        ) : (
                          <Chip tone="bad" size="sm" dot>
                            Connection expired
                          </Chip>
                        )
                      }
                      actions={
                        b.status === "expired" ? (
                          <Button size="sm">Reconnect it</Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton variant="ghost" size="sm" label={`More for ${b.bank}`} icon={<MoreHorizontal size={16} />} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Sync now</DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem tone="danger">Disconnect</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )
                      }
                    />
                  ))}
                </List>
                <CardFooter>
                  <Button iconLeft={<Plus size={14} />}>Connect another account</Button>
                </CardFooter>
              </Card>
            </TabPanel>

            <TabPanel value="team" className="sui:pt-[20px]">
              <DataTable
                caption="People with access"
                columns={[
                  {
                    id: "name",
                    header: "Name",
                    sort: (p: (typeof team)[number]) => p.name,
                    cell: (p) => (
                      <span className="sui:flex sui:items-center sui:gap-[10px]">
                        <Avatar name={p.name} size="sm" />
                        <span className="sui:flex sui:flex-col">
                          <span>{p.name}</span>
                          <span className="sui:text-xs sui:text-fg-subtle">{p.email}</span>
                        </span>
                      </span>
                    ),
                  },
                  { id: "role", header: "Access", cell: (p) => p.role, muted: true },
                  { id: "seen", header: "Last seen", cell: (p) => p.lastSeen, muted: true },
                ]}
                rows={team}
                getRowId={(p) => p.id}
                empty={<EmptyState size="sm" title="Only you so far" description="Invite someone who sends you receipts." />}
              />
            </TabPanel>
          </Tabs>
        </div>
      </WebappShell>
    );
  },
};
