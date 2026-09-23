import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { Button } from "../components/Button";
import { Callout } from "../components/Callout";
import { Card, CardHeader, CardTitle, CardBody } from "../components/Card";
import { Chip } from "../components/Chip";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { KeyValue } from "../components/KeyValue";
import { List, ListItem } from "../components/ListItem";
import { Progress } from "../components/Progress";
import { SkeletonList } from "../components/Skeleton";
import { Table, THead, TBody, TR, TH, TD, TableEmpty } from "../components/Table";
import { TextLink } from "../components/TextLink";
import { Tooltip } from "../components/Tooltip";

/**
 * The six states, in one place.
 *
 * conventions.md states the rule; this page is the rule rendered, so nobody has
 * to picture it. It exists because a component library shows you the happy path
 * by default — every story is a component with its data already in it — and the
 * five states around that path are where screens actually go wrong.
 */
const meta: Meta = {
  title: "Foundations/States",
  parameters: {
    docs: {
      description: {
        component: [
          "Every screen owes the user six states. Handle all of them, or be able to say why one cannot happen here.",
          "",
          "Each section below is the state, the rule, and the components that answer it. The copy is real — a state handled with lorem ipsum is a state nobody checked.",
          "",
          "| State | Answer it with |",
          "|---|---|",
          "| **Empty** | `EmptyState`, in one of four variants |",
          "| **Loading** | `Skeleton` / `SkeletonList`, or a `Spinner` inside the control that is working |",
          "| **Error** | A `Callout`, or the field's own `error`. Never only a `Toast` |",
          "| **Disabled** | Only ever with a reachable reason |",
          "| **Locked** | Say why, name who closed it, and offer the way out |",
          "| **Partial** | Name what is missing and who owes it |",
        ].join("\n"),
      },
    },
  },
};
export default meta;
type Story = StoryObj;

/** One labelled block, so the six read as one page rather than six demos. */
function State({
  name,
  rule,
  children,
}: {
  name: string;
  rule: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[12px] border-b border-border-soft pb-[28px] last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-[4px]">
        <h3 className="m-0 text-lg font-semibold tracking-tight text-fg">{name}</h3>
        <p className="m-0 max-w-[70ch] text-sm text-fg-muted">{rule}</p>
      </div>
      {children}
    </section>
  );
}

export const TheSixStates: Story = {
  name: "The six states every screen owes the user",
  render: function TheSixStates() {
    return (
      <div className="flex max-w-[760px] flex-col gap-[28px]">
        {/* ------------------------------------------------------- empty --- */}
        <State
          name="Empty"
          rule={
            <>
              Never the words &ldquo;No data&rdquo;. An empty state says what the
              situation is and offers the next action — or names the person the user is
              waiting on. Which of the four variants it is decides what that action
              should be.
            </>
          }
        >
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <EmptyState
              variant="first-run"
              title="No receipts yet"
              description="Upload the first one and we will match it to a charge on the statement."
              action={<Button variant="primary" size="sm">Upload a receipt</Button>}
            />
          </div>
          <p className="m-0 text-sm text-fg-subtle">
            Nothing yet is not the same as nothing found. See EmptyState for
            <code> first-run</code>, <code>no-results</code>, <code>locked</code> and
            <code> error</code> side by side.
          </p>
        </State>

        {/* ----------------------------------------------------- loading --- */}
        <State
          name="Loading"
          rule={
            <>
              A skeleton shaped like the thing that is coming, inside the shell the rows
              will land in, so the page does not jump. Under about 300ms show nothing and
              keep the old content with <code>aria-busy</code>. Never a full-page spinner
              — it hides the shape of the page for the sake of looking busy.
            </>
          }
        >
          <div className="overflow-hidden rounded-lg border border-border bg-surface p-[var(--density-card-p)]">
            <SkeletonList rows={3} />
          </div>
        </State>

        {/* ------------------------------------------------------- error --- */}
        <State
          name="Error"
          rule={
            <>
              In place, where the thing went wrong: a <code>Callout</code> above the
              content, or the field&rsquo;s own <code>error</code>. Never only a toast — a
              toast leaves before it can be acted on and cannot be re-read. The message
              says what to do, not what is wrong.
            </>
          }
        >
          <div className="flex flex-col gap-[12px]">
            <Callout
              tone="bad"
              title="The upload failed"
              action={<Button size="sm">Try again</Button>}
            >
              <p>
                The file was 31 MB and the limit is 20 MB. A photo of the receipt will be
                well under it.
              </p>
            </Callout>
            <div className="max-w-[360px]">
              <Input
                label="NIF"
                defaultValue="503214"
                error="A NIF is nine digits. This one has six."
              />
            </div>
          </div>
        </State>

        {/* ---------------------------------------------------- disabled --- */}
        <State
          name="Disabled"
          rule={
            <>
              Only with a reason the user can actually reach. Better still, keep the
              control enabled with <code>aria-disabled</code> and explain on click: a
              genuinely <code>disabled</code> control is skipped by the tab order, so a
              screen-reader user never learns it is there at all.
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-[10px]">
            <Tooltip content="Ana has to sign off June before it can be filed.">
              <Button aria-disabled onClick={() => {}}>
                File the VAT return
              </Button>
            </Tooltip>
            <span className="text-sm text-fg-subtle">
              Enabled, focusable, and it answers when pressed.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Button disabled>File the VAT return</Button>
            <span className="text-sm text-fg-subtle">
              Off with no reason anywhere. This is the one the house rules ban.
            </span>
          </div>
        </State>

        {/* ------------------------------------------------------ locked --- */}
        <State
          name="Locked"
          rule={
            <>
              Different from disabled: the thing is finished, not unavailable. Say why,
              name who closed it and when, and offer the way out. A locked period with no
              explanation reads as a bug in the product.
            </>
          }
        >
          <Callout
            tone="neutral"
            title="May 2026 is closed"
            action={<TextLink>Ask Ana to reopen it</TextLink>}
          >
            <p>Ana filed it on 18 June. Nothing in a closed period can change.</p>
          </Callout>
          <Table>
            <THead>
              <TR>
                <TH>Period</TH>
                <TH>Filed</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              <TR>
                <TD>May 2026</TD>
                <TD muted>18 June 2026</TD>
                <TD>
                  <Chip tone="neutral" size="sm">Closed</Chip>
                </TD>
              </TR>
              <TR>
                <TD>June 2026</TD>
                <TD muted>—</TD>
                <TD>
                  <Chip tone="warn" size="sm">Open until 20 August</Chip>
                </TD>
              </TR>
            </TBody>
          </Table>
        </State>

        {/* ----------------------------------------------------- partial --- */}
        <State
          name="Partial"
          rule={
            <>
              Some of it arrived. Name what is missing and who owes it — never round a
              partial total up to a whole one, and never show a half-loaded list as
              though it were the list. The user&rsquo;s next question is always
              &ldquo;what am I waiting for, and from whom?&rdquo;
            </>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>June is not ready to file</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-[14px]">
                <div className="flex flex-col gap-[6px]">
                  <Progress value={41} max={53} label="Receipts matched" />
                  <p className="m-0 text-sm text-fg-subtle">
                    41 of 53 charges have a receipt behind them.
                  </p>
                </div>

                <KeyValue
                  size="sm"
                  rows={[
                    { key: "Waiting on the customer", value: "9 receipts", nowrap: true },
                    { key: "Waiting on Tax Ops", value: "3 categorisations", nowrap: true },
                    {
                      key: "Blocked total",
                      value: "€3,094.10",
                      tone: "warn",
                      nowrap: true,
                      note: "The charges with no receipt. Not included in the June figure above.",
                    },
                  ]}
                />

                <Callout tone="warn" title="Two of the nine are over 90 days old">
                  <p>
                    Suppliers rarely reissue past three months. Ana usually writes those
                    off rather than chasing them.
                  </p>
                </Callout>
              </div>
            </CardBody>
          </Card>
        </State>
      </div>
    );
  },
};

export const EmptyIsNotOneState: Story = {
  name: "Empty is not one state",
  parameters: {
    docs: {
      description: {
        story:
          "The commonest mistake on this page. Nothing-yet, nothing-found, closed and broken all render an empty box, and each one owes the user a different sentence and a different next action. Getting this wrong is how a working filter ends up looking like an outage.",
      },
    },
  },
  render: function EmptyIsNotOneState() {
    return (
      <div className="flex max-w-[620px] flex-col gap-[16px]">
        <Table>
          <THead>
            <TR>
              <TH>Supplier</TH>
              <TH align="right">Amount</TH>
            </TR>
          </THead>
          <TBody>
            <TableEmpty colSpan={2}>
              <EmptyState
                size="sm"
                variant="no-results"
                title="Nothing matches “stapples”"
                description="Check the spelling, or clear the search to see all 53 charges."
                action={<Button size="sm">Clear the search</Button>}
              />
            </TableEmpty>
          </TBody>
        </Table>
        <p className="m-0 text-sm text-fg-subtle">
          Inside <code>TableEmpty</code>, so the header row survives and the user can see
          what they filtered. An empty state that replaces the whole table takes away the
          evidence of why it is empty.
        </p>

        <List>
          <ListItem
            leading={<Info size={16} className="text-fg-faint" />}
            title="Nothing here yet, versus nothing found"
            description="First-run offers the action that creates the first one. No-results offers to widen the search. They are never the same button."
          />
        </List>
      </div>
    );
  },
};
