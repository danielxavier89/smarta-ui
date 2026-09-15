import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { COLOR_TOKENS, SCALE_TOKENS, type TokenGroup } from "@smarta/tokens";

const meta: Meta = {
  title: "Foundations/Design tokens",
  parameters: {
    docs: {
      description: {
        component:
          "Three layers. Primitives are raw ramps with no meaning. Semantics name a job — canvas, fg-muted, accent — and are the only colours a component may read. The Tailwind bridge maps semantics into bg-* / text-* / border-* utilities. Switch product and mode in the toolbar; every swatch below re-resolves, because nothing here is a literal.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function Swatch({ name }: { name: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = React.useState("");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Read it back off the page rather than from a table, so this sheet cannot
    // claim a value the stylesheet does not actually produce.
    const read = () =>
      setResolved(getComputedStyle(el).getPropertyValue(`--${name}`).trim());
    read();
    const t = setTimeout(read, 60);
    return () => clearTimeout(t);
  });

  return (
    <div ref={ref} className="flex items-center gap-[10px]">
      <span
        className="size-[34px] shrink-0 rounded-md border border-border"
        style={{ background: `var(--${name})` }}
      />
      <div className="min-w-0">
        <code className="block text-xs text-fg">--{name}</code>
        <span className="block text-2xs tabular-nums text-fg-subtle">{resolved || "—"}</span>
      </div>
    </div>
  );
}

function Group({ group, swatches }: { group: TokenGroup; swatches: boolean }) {
  return (
    <section className="mb-[28px]">
      <h3 className="m-0 text-lg font-semibold tracking-tight text-fg">{group.title}</h3>
      {group.note && <p className="m-0 mt-[3px] max-w-[70ch] text-sm text-fg-subtle">{group.note}</p>}
      <div className="mt-[12px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
        {group.tokens.map((t) => (
          <div key={t.name} className="rounded-lg border border-border bg-surface p-[12px]">
            {swatches ? (
              <Swatch name={t.name} />
            ) : (
              <code className="block text-xs text-fg">--{t.name}</code>
            )}
            <p className="m-0 mt-[8px] text-xs text-fg-subtle">{t.use}</p>
            {t.utility !== "—" && (
              <code className="mt-[6px] inline-block rounded-xs bg-surface-sunken px-[5px] py-[1px] text-2xs text-fg-muted">
                {swatches ? `bg-${t.utility}` : t.utility}
              </code>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export const Colour: Story = {
  render: () => (
    <div>
      {COLOR_TOKENS.map((g) => (
        <Group key={g.title} group={g} swatches />
      ))}
    </div>
  ),
};

export const Scales: Story = {
  name: "Type, radius, elevation, density",
  render: () => (
    <div>
      {SCALE_TOKENS.map((g) => (
        <Group key={g.title} group={g} swatches={false} />
      ))}
    </div>
  ),
};

export const TypeScale: Story = {
  name: "The type scale, set",
  render: () => (
    <div className="flex flex-col gap-[10px]">
      {[
        ["text-3xl", "30px — the one number a page is about"],
        ["text-2xl", "24px — a headline figure in a stat"],
        ["text-xl", "19px — page titles"],
        ["text-lg", "16px — card titles"],
        ["text-md", "15px — a lede line"],
        ["text-base", "14px — body, the default"],
        ["text-sm", "13px — buttons, tabs, dense cells"],
        ["text-xs", "12px — chips, captions"],
        ["text-2xs", "11px — badge counts"],
      ].map(([cls, note]) => (
        <div key={cls} className="flex flex-wrap items-baseline gap-[14px] border-b border-border-soft pb-[8px]">
          <span className={`${cls} text-fg`}>Twelve charges, €3,094.10</span>
          <code className="text-2xs text-fg-subtle">{cls}</code>
          <span className="text-2xs text-fg-subtle">{note}</span>
        </div>
      ))}
    </div>
  ),
};

export const DensityDiffers: Story = {
  name: "The backoffice runs tighter",
  parameters: {
    docs: {
      description: {
        story:
          "Set Compare to \"Webapp + backoffice\". Same component, same tokens; --control-height-md and --density-row-* are 2-4px tighter in the backoffice, because it is worked in all day rather than read once a month.",
      },
    },
  },
  render: () => (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {["Staples Lisboa", "Lisbon Coffee", "Vodafone Portugal"].map((r) => (
        <div
          key={r}
          className="flex items-center justify-between border-b border-border-soft px-[var(--density-row-x)] py-[var(--density-row-y)] last:border-b-0"
        >
          <span className="text-base text-fg">{r}</span>
          <span className="text-base tabular-nums text-fg-muted">-€86.40</span>
        </div>
      ))}
    </div>
  ),
};
