import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { Combobox, type ComboboxProps, type ComboboxOption } from "./Combobox";
import { docsPage } from "../../lib/docs";
import rules from "./Combobox.md?raw";

export const accounts: ComboboxOption[] = [
  { value: "4930", label: "Bürobedarf", description: "4930" },
  { value: "4940", label: "Zeitschriften, Bücher", description: "4940" },
  { value: "4650", label: "Bewirtungskosten", description: "4650" },
  { value: "4670", label: "Reisekosten Unternehmer", description: "4670" },
  { value: "4806", label: "Wartungskosten für Hard- und Software", description: "4806" },
  { value: "4920", label: "Telefon", description: "4920" },
  { value: "4925", label: "Internetkosten", description: "4925" },
  { value: "4950", label: "Rechts- und Beratungskosten", description: "4950" },
  { value: "4955", label: "Buchführungskosten", description: "4955" },
  { value: "4970", label: "Nebenkosten des Geldverkehrs", description: "4970" },
  { value: "4210", label: "Miete", description: "4210", disabled: true },
];

const meta = {
  title: "Form/Combobox",
  component: Combobox,
  parameters: docsPage(rules),
  args: { label: "Category", options: accounts, defaultValue: "4930" },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: ComboboxProps) => (
    <div className="sui:max-w-[320px]">
      <Combobox {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:max-w-[320px] sui:gap-[16px]">
      <Combobox label="Category" options={accounts} placeholder="Type a name or number" hint="SKR03, as your accountant set it up." />
      <Combobox label="Category" options={accounts} defaultValue="4650" />
      <Combobox label="Category" options={accounts} error="Choose a category before booking the charge." />
      <Combobox label="Category" options={accounts} defaultValue="4955" disabled hint="Set by your accountant." />
    </div>
  ),
};

/** Open and narrowed, so the browser gate checks the list itself. */
export const Open: Story = {
  render: () => (
    <div className="sui:min-h-[360px] sui:max-w-[320px]">
      <Combobox label="Category" options={accounts} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "kosten");
  },
};

export const NothingMatches: Story = {
  name: "Nothing matches",
  render: () => (
    <div className="sui:min-h-[200px] sui:max-w-[320px]">
      <Combobox
        label="Category"
        options={accounts}
        emptyMessage="No category has that name. Your accountant can add one."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "Leasing");
  },
};

/** The product searches; `filter={false}` shows what comes back. Type "be". */
export const FromTheServer: Story = {
  name: "From the server",
  render: function Remote() {
    const [results, setResults] = React.useState<ComboboxOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    return (
      <div className="sui:min-h-[320px] sui:max-w-[320px]">
        <Combobox
          label="Category"
          options={results}
          filter={false}
          loading={loading}
          onInputChange={(text) => {
            setLoading(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
              setResults(accounts.filter((a) => a.label.toLowerCase().includes(text.toLowerCase())));
              setLoading(false);
            }, 600);
          }}
          emptyMessage="Type part of a name or a number."
        />
      </div>
    );
  },
};
