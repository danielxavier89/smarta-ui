import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Mail } from "lucide-react";
import { formatDate } from "../lib/format";
import { ThemeProvider } from "../components/ThemeProvider";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "../components/Card";
import { Callout } from "../components/Callout";
import { Button } from "../components/Button";
import { List, ListItem } from "../components/ListItem";
import { Chip } from "../components/Chip";
import { Avatar } from "../components/Avatar";
import { DataTable, type DataTableColumn, type DataTableFilterValues } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { Tabs, TabsList, Tab, TabPanel } from "../components/Tabs";
import { Panel, PanelSection } from "../components/Panel";
import { KeyValue } from "../components/KeyValue";
import { Dialog } from "../components/Dialog";
import { Textarea } from "../components/Textarea";
import { useToast } from "../components/Toast";
import { BackofficeShell, eur } from "./shells";
import {
  activity,
  charges,
  categoryLabel,
  clients,
  reviewStatusWord,
  staff,
  statusWord,
  type Charge,
  type Client,
} from "./data";

/**
 * Whole pages of the internal backoffice, built only from the library and
 * filled with invented data. German formatting, as the backoffice runs in
 * German; the copy is English so the mockups read for everyone.
 */
const meta: Meta = {
  title: "Mockups/Backoffice",
  // The backoffice's pages in the backoffice's colours, whatever the toolbar says.
  globals: { product: "backoffice" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ThemeProvider locale="de-DE" className="sui:bg-transparent">
        <Story />
      </ThemeProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj;

const de = (d: Date) => formatDate(d, "de-DE", "numeric");

/* ------------------------------------------------------------ Review queue */

function ClientPanel({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const { toast } = useToast();
  const [rejecting, setRejecting] = React.useState(false);
  if (!client) return null;
  const open = client.company === "Brandt Grafikdesign" ? charges.filter((c) => c.status !== "matched") : [];
  return (
    <>
      <Panel
        open
        onOpenChange={(o) => !o && onClose()}
        title={client.company}
        subtitle={`${client.period} · ${client.open} open items`}
        headerAction={
          <Chip tone={reviewStatusWord[client.status].tone} size="sm" dot>
            {reviewStatusWord[client.status].label}
          </Chip>
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejecting(true)}>
              Send back to the client
            </Button>
            <Button
              variant="primary"
              className="sui:ml-auto"
              onClick={() => {
                toast({ tone: "ok", title: `${client.period} approved`, description: `${client.company} moves to filing.` });
                onClose();
              }}
            >
              Approve {client.period}
            </Button>
          </>
        }
      >
        {client.flag && (
          <PanelSection>
            <Callout tone="warn" title={client.flag} />
          </PanelSection>
        )}
        <PanelSection title="Client">
          <KeyValue
            size="sm"
            rows={[
              { key: "Owner", value: client.owner },
              { key: "Legal form", value: client.legalForm },
              { key: "Assigned to", value: client.assignee },
              { key: "Due", value: de(client.due) },
            ]}
          />
        </PanelSection>
        <PanelSection title="Open items">
          {open.length ? (
            <List>
              {open.map((c: Charge) => (
                <ListItem
                  key={c.id}
                  title={c.supplier}
                  description={`${de(c.date)} · ${categoryLabel(c.category)}`}
                  meta={
                    <span className="sui:flex sui:items-center sui:gap-[8px]">
                      <span className="sui:tabular-nums sui:font-medium sui:text-fg">{eur(c.amount)}</span>
                      <Chip tone={statusWord[c.status].tone} size="sm">
                        {statusWord[c.status].label}
                      </Chip>
                    </span>
                  }
                />
              ))}
            </List>
          ) : (
            <EmptyState size="sm" title="Nothing open here" description="Every charge in this period has a receipt and a category." />
          )}
        </PanelSection>
      </Panel>
      <Dialog
        open={rejecting}
        onOpenChange={setRejecting}
        title={`Send ${client.period} back to ${client.owner}?`}
        description="They get an email listing what's missing, and the period leaves your queue until they answer."
        confirm={{
          label: "Send it back",
          onConfirm: () => {
            setRejecting(false);
            toast({ tone: "info", title: `Sent back to ${client.owner}` });
            onClose();
          },
        }}
      >
        <Textarea label="Message to the client" rows={4} defaultValue={client.flag ? `Hi ${client.owner.split(" ")[0]}, ${client.flag.toLowerCase()} — could you upload them this week?` : ""} />
      </Dialog>
    </>
  );
}

export const ReviewQueue: Story = {
  name: "Review queue",
  render: function QueuePage() {
    const [tab, setTab] = React.useState("to-review");
    const [filters, setFilters] = React.useState<DataTableFilterValues>({});
    const [open, setOpen] = React.useState<Client | null>(null);
    const { toast } = useToast();

    const query = ((filters.q as string | undefined) ?? "").trim().toLowerCase();
    const who = (filters.who as string[] | undefined) ?? [];
    const filtered = clients.filter(
      (c) =>
        (!query || `${c.company} ${c.owner}`.toLowerCase().includes(query)) &&
        (who.length === 0 || who.includes(c.assignee)),
    );
    const count = (s: string) => filtered.filter((c) => c.status === s).length;

    const columns: DataTableColumn<Client>[] = [
      {
        id: "company",
        header: "Client",
        sort: (c) => c.company,
        cell: (c) => (
          <span className="sui:flex sui:flex-col">
            <span className="sui:flex sui:items-center sui:gap-[6px]">
              {c.company}
              {c.flag && <AlertTriangle size={13} className="sui:text-warn" aria-label={c.flag} role="img" />}
            </span>
            <span className="sui:text-xs sui:text-fg-subtle">{c.owner}</span>
          </span>
        ),
      },
      { id: "period", header: "Period", cell: (c) => c.period, muted: true },
      { id: "open", header: "Open items", cell: (c) => String(c.open), sort: (c) => c.open, numeric: true },
      {
        id: "assignee",
        header: "Assigned to",
        sort: (c) => c.assignee,
        cell: (c) => (
          <span className="sui:flex sui:items-center sui:gap-[8px]">
            <Avatar name={c.assignee} size="xs" />
            {c.assignee}
          </span>
        ),
      },
      { id: "due", header: "Due", cell: (c) => de(c.due), sort: (c) => c.due, muted: true },
      {
        id: "status",
        header: "Status",
        cell: (c) => (
          <Chip tone={reviewStatusWord[c.status].tone} size="sm" dot>
            {reviewStatusWord[c.status].label}
          </Chip>
        ),
      },
    ];

    return (
      <BackofficeShell current="queue">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader
            title="Review queue"
            description="June and Q2 closes. Everything due on 10.07.2026."
            actions={<Button variant="primary">Start the next review</Button>}
          />
          <div className="sui:grid sui:grid-cols-1 sui:gap-[16px] sui:sm:grid-cols-3">
            <StatCard label="To review" value={String(clients.filter((c) => c.status === "to-review").length)} caption="Across 3 accountants" />
            <StatCard label="Waiting on clients" value={String(clients.filter((c) => c.status === "waiting").length)} tone="warn" caption="Oldest asked 6 days ago" />
            <StatCard label="Done this close" value={String(clients.filter((c) => c.status === "done").length)} tone="ok" caption="2 more than last month" />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <Tab value="to-review" count={count("to-review")}>
                To review
              </Tab>
              <Tab value="waiting" count={count("waiting")}>
                Waiting on client
              </Tab>
              <Tab value="done" count={count("done")}>
                Done
              </Tab>
            </TabsList>
            <TabPanel value={tab} className="sui:pt-[16px]">
              <DataTable
                caption="Review queue"
                columns={columns}
                rows={filtered.filter((c) => c.status === tab)}
                getRowId={(c) => c.id}
                defaultSort={{ columnId: "open", direction: "desc" }}
                onRowActivate={setOpen}
                activeRowId={open?.id}
                selectable
                rowLabel={(c) => c.company}
                bulkActions={(ids) => (
                  <>
                    <Button size="sm" variant="primary" onClick={() => toast({ tone: "ok", title: `${ids.length} assigned to you` })}>
                      Assign to me
                    </Button>
                    <Button size="sm" iconLeft={<Mail size={14} />}>
                      Remind {ids.length === 1 ? "the client" : `${ids.length} clients`}
                    </Button>
                  </>
                )}
                // Controlled: this page filters, so the tab counts can follow the
                // filters too. A product filtering on its server does the same.
                filters={[
                  { id: "q", type: "search", label: "Search the queue", placeholder: "Search by client or owner" },
                  { id: "who", type: "options", label: "Assigned to", options: staff, value: (c) => c.assignee },
                ]}
                filterValues={filters}
                onFiltersChange={setFilters}
                empty={
                  <EmptyState
                    variant="first-run"
                    size="sm"
                    title={tab === "done" ? "Nothing done yet this close" : "Nobody in this list"}
                    description="Periods move here as clients and accountants work through them."
                  />
                }
              />
            </TabPanel>
          </Tabs>
        </div>
        <ClientPanel client={open} onClose={() => setOpen(null)} />
      </BackofficeShell>
    );
  },
};

/* ----------------------------------------------------------- Client detail */

export const ClientDetail: Story = {
  name: "Client detail",
  render: () => {
    const client = clients[0];
    const missing = charges.filter((c) => c.status !== "matched");
    return (
      <BackofficeShell current="clients">
        <div className="sui:flex sui:flex-col sui:gap-[20px]">
          <PageHeader
            back={{ label: "Review queue", href: "#queue", onClick: (e) => e.preventDefault() }}
            title={client.company}
            meta={
              <Chip tone={reviewStatusWord[client.status].tone} dot>
                {reviewStatusWord[client.status].label}
              </Chip>
            }
            description={`${client.owner} · ${client.legalForm} · client since 03.2019`}
            actions={
              <>
                <Button iconLeft={<Mail size={14} />}>Email {client.owner.split(" ")[0]}</Button>
                <Button variant="primary">Review {client.period}</Button>
              </>
            }
          />
          {client.flag && (
            <Callout tone="warn" title={client.flag} action={<Button size="sm">Ask for them</Button>}>
              <p className="sui:m-0">Druckerei Weidmann, Bürowelt Hansen and Restaurant Kuchenbäcker. Without them the period cannot be closed.</p>
            </Callout>
          )}
          <div className="sui:grid sui:grid-cols-1 sui:gap-[16px] sui:lg:grid-cols-[2fr_3fr]">
            <div className="sui:flex sui:flex-col sui:gap-[16px]">
              <Card>
                <CardHeader>
                  <CardTitle as="h2">Client</CardTitle>
                </CardHeader>
                <CardBody>
                  <KeyValue
                    rows={[
                      { key: "Owner", value: client.owner },
                      { key: "Legal form", value: client.legalForm },
                      { key: "Address", value: "Karl-Heine-Straße 41, 04229 Leipzig" },
                      { key: "VAT returns", value: "Quarterly" },
                      { key: "Accountant", value: client.assignee },
                      { key: "Bank connections", value: "2 connected, 1 expired", tone: "warn", note: "N26 Tagesgeld expired on 12.05.2026." },
                    ]}
                  />
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle as="h2">Activity</CardTitle>
                  <CardDescription>The last two weeks.</CardDescription>
                </CardHeader>
                <List>
                  {activity.map((a) => (
                    <ListItem
                      key={a.id}
                      leading={<Avatar name={a.who} size="sm" />}
                      title={`${a.who} ${a.what}`}
                      description={a.when}
                    />
                  ))}
                </List>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle as="h2">{client.period}: open items</CardTitle>
                <CardDescription>{missing.length} of {charges.length} charges still need something.</CardDescription>
              </CardHeader>
              <CardBody>
                <DataTable
                  caption={`Open items for ${client.company}`}
                  columns={[
                    { id: "date", header: "Date", cell: (c: Charge) => de(c.date), sort: (c) => c.date, muted: true },
                    { id: "supplier", header: "Supplier", cell: (c) => c.supplier, sort: (c) => c.supplier },
                    { id: "amount", header: "Amount", cell: (c) => eur(c.amount), sort: (c) => c.amount, numeric: true },
                    {
                      id: "status",
                      header: "Status",
                      cell: (c) => (
                        <Chip tone={statusWord[c.status].tone} size="sm">
                          {statusWord[c.status].label}
                        </Chip>
                      ),
                    },
                  ]}
                  rows={missing}
                  getRowId={(c) => c.id}
                  defaultSort={{ columnId: "amount", direction: "desc" }}
                  empty={<EmptyState size="sm" title="Nothing open" description="This period is ready to review." />}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </BackofficeShell>
    );
  },
};
