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
    <div ref={ref} className="sui:flex sui:items-center sui:gap-[10px]">
      <span
        className="sui:size-[34px] sui:shrink-0 sui:rounded-md sui:border sui:border-border"
        style={{ background: `var(--${name})` }}
      />
      <div className="sui:min-w-0">
        <code className="sui:block sui:text-xs sui:text-fg">--{name}</code>
        <span className="sui:block sui:text-2xs sui:tabular-nums sui:text-fg-subtle">{resolved || "—"}</span>
      </div>
    </div>
  );
}

function Group({ group, swatches }: { group: TokenGroup; swatches: boolean }) {
  return (
    <section className="sui:mb-[28px]">
      <h3 className="sui:m-0 sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg">{group.title}</h3>
      {group.note && <p className="sui:m-0 sui:mt-[3px] sui:max-w-[70ch] sui:text-sm sui:text-fg-subtle">{group.note}</p>}
      <div className="sui:mt-[12px] sui:grid sui:gap-[14px] sui:sm:grid-cols-2 sui:lg:grid-cols-3">
        {group.tokens.map((t) => (
          <div key={t.name} className="sui:rounded-lg sui:border sui:border-border sui:bg-surface sui:p-[12px]">
            {swatches ? (
              <Swatch name={t.name} />
            ) : (
              <code className="sui:block sui:text-xs sui:text-fg">--{t.name}</code>
            )}
            <p className="sui:m-0 sui:mt-[8px] sui:text-xs sui:text-fg-subtle">{t.use}</p>
            {t.utility !== "—" && (
              <code className="sui:mt-[6px] sui:inline-block sui:rounded-xs sui:bg-surface-sunken sui:px-[5px] sui:py-[1px] sui:text-2xs sui:text-fg-muted">
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
    <div className="sui:flex sui:flex-col sui:gap-[10px]">
      {[
        ["sui:text-3xl", "30px — the one number a page is about"],
        ["sui:text-2xl", "24px — a headline figure in a stat"],
        ["sui:text-xl", "19px — page titles"],
        ["sui:text-lg", "16px — card titles"],
        ["sui:text-md", "15px — a lede line"],
        ["sui:text-base", "14px — body, the default"],
        ["sui:text-sm", "13px — buttons, tabs, dense cells"],
        ["sui:text-xs", "12px — chips, captions"],
        ["sui:text-2xs", "11px — badge counts"],
      ].map(([cls, note]) => (
        <div key={cls} className="sui:flex sui:flex-wrap sui:items-baseline sui:gap-[14px] sui:border-b sui:border-border-soft sui:pb-[8px]">
          <span className={`${cls} sui:text-fg`}>Twelve charges, €3,094.10</span>
          <code className="sui:text-2xs sui:text-fg-subtle">{cls}</code>
          <span className="sui:text-2xs sui:text-fg-subtle">{note}</span>
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
    <div className="sui:overflow-hidden sui:rounded-lg sui:border sui:border-border sui:bg-surface">
      {["Staples Lisboa", "Lisbon Coffee", "Vodafone Portugal"].map((r) => (
        <div
          key={r}
          className="sui:flex sui:items-center sui:justify-between sui:border-b sui:border-border-soft sui:px-[var(--density-row-x)] sui:py-[var(--density-row-y)] sui:last:border-b-0"
        >
          <span className="sui:text-base sui:text-fg">{r}</span>
          <span className="sui:text-base sui:tabular-nums sui:text-fg-muted">-€86.40</span>
        </div>
      ))}
    </div>
  ),
};
