import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const chipVariants = cva(
  [
    "sui:inline-flex sui:items-center sui:gap-[5px] sui:whitespace-nowrap sui:align-middle",
    "sui:rounded-full sui:font-medium",
    "sui:[&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "sui:bg-neutral-bg sui:text-neutral-fg",
        ok: "sui:bg-ok-bg sui:text-ok-fg",
        warn: "sui:bg-warn-bg sui:text-warn-fg",
        bad: "sui:bg-bad-bg sui:text-bad-fg",
        info: "sui:bg-info-bg sui:text-info-fg",
        accent: "sui:bg-accent-soft sui:text-accent-soft-fg",
      },
      size: {
        sm: "sui:px-[7px] sui:py-[1px] sui:text-2xs",
        md: "sui:px-[9px] sui:py-[3px] sui:text-xs",
      },
      /** Outline reads quieter on a busy row than a filled tint. */
      appearance: {
        solid: "",
        outline: "sui:bg-transparent sui:border",
      },
    },
    compoundVariants: [
      { appearance: "outline", tone: "neutral", class: "sui:border-border sui:text-fg-muted" },
      { appearance: "outline", tone: "ok", class: "sui:border-ok sui:text-ok-fg" },
      { appearance: "outline", tone: "warn", class: "sui:border-warn sui:text-warn-fg" },
      { appearance: "outline", tone: "bad", class: "sui:border-bad sui:text-bad-fg" },
      { appearance: "outline", tone: "info", class: "sui:border-info sui:text-info-fg" },
      { appearance: "outline", tone: "accent", class: "sui:border-accent sui:text-accent-soft-fg" },
    ],
    defaultVariants: { tone: "neutral", size: "md", appearance: "solid" },
  },
);

const dotTone = {
  neutral: "sui:bg-neutral",
  ok: "sui:bg-ok",
  warn: "sui:bg-warn",
  bad: "sui:bg-bad",
  info: "sui:bg-info",
  accent: "sui:bg-accent",
} as const;

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof chipVariants> {
  /** A leading dot in the tone's colour. Carries the status without an icon. */
  dot?: boolean;
  icon?: React.ReactNode;
}

/**
 * A short, non-interactive status pill: "Matched", "Overdue", "Waiting on Ana".
 *
 * A Chip states a fact about the row it sits in. It never runs anything —
 * a pill you can press is a Button, and a pill that counts something is a
 * Badge.
 *
 * Tone is meaning, not decoration: ok for done, warn for waiting, bad for
 * overdue or failed, neutral for "no status yet". Colour alone does not carry
 * it, which is why the label is always a word and never only a colour.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { className, tone, size, appearance, dot = false, icon, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(chipVariants({ tone, size, appearance }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("sui:size-[6px] sui:rounded-full", dotTone[tone ?? "neutral"])}
        />
      )}
      {icon}
      {children}
    </span>
  );
});

export { chipVariants };
