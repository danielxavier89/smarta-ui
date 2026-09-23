import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { Product, Theme } from "@smarta/tokens";

import { ThemeProvider } from "../components/ThemeProvider";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { RadioGroup } from "../components/RadioGroup";
import { SearchInput } from "../components/SearchInput";
import { Dropzone } from "../components/Dropzone";
import { Chip } from "../components/Chip";
import { Badge } from "../components/Badge";
import { Progress } from "../components/Progress";
import { Spinner } from "../components/Spinner";
import { Card, CardHeader, CardTitle, CardBody } from "../components/Card";
import { StatCard } from "../components/StatCard";
import { Table, THead, TBody, TR, TH, TD } from "../components/Table";
import { KeyValue } from "../components/KeyValue";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { Tabs, TabsList, Tab, TabPanel } from "../components/Tabs";
import { Callout } from "../components/Callout";
import { Dialog } from "../components/Dialog";
import { Panel } from "../components/Panel";
import { Tooltip } from "../components/Tooltip";

/**
 * axe as a gate, not a suggestion. These fail the build.
 *
 * Be precise about what the four-way loop below is and is not. No component in
 * this library branches its markup on product or theme — that is the entire
 * point of the token layer — and `vitest.config.ts` sets `css: false`, so no
 * token CSS is loaded here at all. The four renders therefore produce identical
 * DOM apart from two attributes on a wrapper div. These are three distinct
 * assertions run four times, not twelve.
 *
 * The loop is kept anyway, because it costs milliseconds and is the thing that
 * would catch a component that started branching on product. It is not
 * evidence that theming is accessible, and nothing here should be read that
 * way.
 *
 * What axe cannot do in this environment at all: colour contrast. jsdom has no
 * layout and no computed colours, so the rule comes back "incomplete" rather
 * than passing. Contrast is covered by `npm run audit:contrast`, which reads
 * the token values directly — 35 pairs across the four themes, 140 checks.
 *
 * Note also that `toHaveNoViolations` only inspects axe's `violations` bucket.
 * Anything axe cannot determine lands in `incomplete` and is silently dropped.
 * Today that is only contrast. It will not always be.
 */

const COMBINATIONS: Array<{ product: Product; theme: Theme }> = [
  { product: "webapp", theme: "light" },
  { product: "webapp", theme: "dark" },
  { product: "backoffice", theme: "light" },
  { product: "backoffice", theme: "dark" },
];

/** A screen wide enough to catch the interactions between components. */
function Surface() {
  return (
    <main>
      <h1>June charges</h1>

      <section aria-label="Summary">
        <StatCard label="Missing charges" value="12" />
        <Progress value={62} label="Uploading receipts" />
        <Spinner />
      </section>

      <Callout tone="warn" title="June is closed">
        <p>The period is read-only.</p>
      </Callout>

      <form>
        <Input label="Company name" hint="As it appears on the bank statement." />
        <Input label="NIF" error="A NIF is nine digits. This one has six." defaultValue="503214" />
        <Textarea label="What should Ana know?" />
        <Select
          label="Assignee"
          options={[
            { value: "ana", label: "Ana Ribeiro" },
            { value: "erik", label: "Erik Braun" },
          ]}
          defaultValue="ana"
        />
        <Checkbox label="I have checked the NIF" />
        <RadioGroup
          label="Category"
          options={[
            { value: "fuel", label: "Fuel" },
            { value: "office", label: "Office" },
          ]}
          defaultValue="fuel"
        />
        <SearchInput value="" onChange={() => {}} onClear={() => {}} />
        <Dropzone onFiles={() => {}} hint="PDF or a photograph." />
        <Button variant="primary">Upload it</Button>
        <Button variant="secondary" disabled>
          Match them
        </Button>
        <IconButton label="More actions" icon={<span aria-hidden>⋯</span>} />
      </form>

      <Tabs value="all" onValueChange={() => {}}>
        <TabsList>
          <Tab value="all" count={5}>
            All charges
          </Tab>
          <Tab value="open" count={2}>
            Needs a receipt
          </Tab>
        </TabsList>
        <TabPanel value="all">
          <Table>
            <THead sticky>
              <TR>
                <TH>Supplier</TH>
                <TH align="right">Amount</TH>
                <TH sort="asc" onSort={() => {}}>
                  Status
                </TH>
              </TR>
            </THead>
            <TBody>
              <TR onActivate={() => {}} selected>
                <TD>Staples Lisboa</TD>
                <TD numeric>86,40 €</TD>
                <TD>
                  <Chip tone="ok" size="sm">
                    Matched
                  </Chip>
                </TD>
              </TR>
              <TR onActivate={() => {}}>
                <TD>Galp Energia</TD>
                <TD numeric>61,02 €</TD>
                <TD>
                  <Badge tone="bad" count={3} />
                </TD>
              </TR>
            </TBody>
          </Table>
        </TabPanel>
      </Tabs>

      <Pagination page={1} pageCount={3} pageSize={20} totalItems={53} onPageChange={() => {}} />

      <Card>
        <CardHeader>
          <CardTitle as="h2">Staples Lisboa</CardTitle>
        </CardHeader>
        <CardBody>
          <KeyValue
            rows={[
              { key: "NIF", value: "503 214 665", note: "Copied from the invoice." },
              { key: "Total", value: "86,40 €" },
            ]}
          />
        </CardBody>
      </Card>

      <EmptyState title="Everything for June is in" description="Nothing is waiting on you." />

      <Tooltip content="A charge with no receipt behind it">
        <button type="button">Why this is flagged</button>
      </Tooltip>
    </main>
  );
}

describe.each(COMBINATIONS)("axe: $product / $theme", ({ product, theme }) => {
  it("finds no violations on a full surface", async () => {
    const { container } = render(
      <ThemeProvider product={product} theme={theme}>
        <Surface />
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 30_000);

  it("finds no violations in an open Dialog", async () => {
    const { baseElement } = render(
      <ThemeProvider product={product} theme={theme}>
        <Dialog
          open
          onOpenChange={() => {}}
          title="Close June"
          description="June will become read-only."
          confirm={{ label: "Close it", onConfirm: () => {} }}
        />
      </ThemeProvider>,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  }, 30_000);

  it("finds no violations in an open Panel", async () => {
    const { baseElement } = render(
      <ThemeProvider product={product} theme={theme}>
        <Panel open onOpenChange={() => {}} title="Staples Lisboa">
          <KeyValue rows={[{ key: "Total", value: "86,40 €" }]} />
        </Panel>
      </ThemeProvider>,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  }, 30_000);
});
