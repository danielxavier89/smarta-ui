import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  [
    "inline-flex items-center gap-[5px] whitespace-nowrap align-middle",
    "rounded-full font-medium",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "bg-neutral-bg text-neutral-fg",
        ok: "bg-ok-bg text-ok-fg",
        warn: "bg-warn-bg text-warn-fg",
        bad: "bg-bad-bg text-bad-fg",
        info: "bg-info-bg text-info-fg",
        accent: "bg-accent-soft text-accent-soft-fg",
      },
      size: {
        sm: "px-[7px] py-[1px] text-2xs",
        md: "px-[9px] py-[3px] text-xs",
      },
      /** Outline reads quieter on a busy row than a filled tint. */
      appearance: {
        solid: "",
        outline: "bg-transparent border",
      },
    },
    compoundVariants: [
      { appearance: "outline", tone: "neutral", class: "border-border text-fg-muted" },
      { appearance: "outline", tone: "ok", class: "border-ok text-ok-fg" },
      { appearance: "outline", tone: "warn", class: "border-warn text-warn-fg" },
      { appearance: "outline", tone: "bad", class: "border-bad text-bad-fg" },
      { appearance: "outline", tone: "info", class: "border-info text-info-fg" },
      { appearance: "outline", tone: "accent", class: "border-accent text-accent-soft-fg" },
    ],
    defaultVariants: { tone: "neutral", size: "md", appearance: "solid" },
  },
);

const dotTone = {
  neutral: "bg-neutral",
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  info: "bg-info",
  accent: "bg-accent",
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
          className={cn("size-[6px] rounded-full", dotTone[tone ?? "neutral"])}
        />
      )}
      {icon}
      {children}
    </span>
  );
});

export { chipVariants };
