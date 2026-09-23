import * as React from "react";
import { Slot } from "radix-ui";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Fired by the affordance, which is the element actually pressed. */
  onClick?: () => void;
  /**
   * Makes the whole card one target. The card itself stays a <div>; the real
   * control is the affordance, stretched over the card with ::after.
   *
   * This is not a detail. Wrapping a card in a <button> makes every button and
   * link inside it illegal HTML and unreachable by keyboard — the browser
   * flattens nested interactive content. Stretching the affordance instead
   * keeps the whole surface clickable AND lets the card carry its own actions,
   * which sit above the stretched layer.
   */
  interactive?: boolean;
  /**
   * What the user can see and press. A clickable card always shows one —
   * an invisible click target is a click target nobody finds.
   *
   *   arrow   a circled chevron in the corner. For a card whose title
   *           already says where it goes.
   *   link    a text link at the foot: "See the 12 charges".
   *   button  a secondary button at the foot, for a heavier destination.
   */
  affordance?: "arrow" | "link" | "button";
  /** The affordance's words, and the accessible name of the whole card. */
  affordanceLabel?: string;
  /** Render the affordance as a real <a> / router link instead of a button. */
  affordanceAsChild?: React.ReactNode;
  /** Muted and inert: a closed period, a locked section. */
  disabled?: boolean;
  tone?: "default" | "warn" | "bad" | "accent";
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    className,
    interactive = false,
    affordance = "arrow",
    affordanceLabel,
    affordanceAsChild,
    disabled = false,
    tone = "default",
    asChild = false,
    onClick,
    children,
    ...props
  },
  ref,
) {
  const labels = useLabels();

  const Comp = (asChild ? Slot.Root : "div") as React.ElementType;
  const tones = {
    default: "border-border",
    warn: "border-warn/40 bg-warn-bg",
    bad: "border-bad/40 bg-bad-bg",
    accent: "border-accent/40 bg-accent-soft",
  }[tone];

  // The one element that is actually pressed. Its ::after covers the card, so
  // a click anywhere on the surface lands here.
  const stretch =
    "after:absolute after:inset-0 after:content-[''] after:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

  const control = !interactive ? null : affordanceAsChild ? (
    <Slot.Root
      className={cn(stretch, "relative")}
      aria-label={affordanceLabel}
    >
      {affordanceAsChild}
    </Slot.Root>
  ) : affordance === "arrow" ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={affordanceLabel}
      className={cn(
        stretch,
        // Inset to the card's own padding, not to numbers of its own: the arrow
        // then shares the grid everything else in the card sits on, and its top
        // edge lines up with whatever the header puts on its first row.
        "absolute right-[var(--density-card-p)] top-[var(--density-card-p)]",
        "grid size-[26px] place-items-center rounded-full",
        "border border-border bg-surface text-fg-subtle",
        "transition-[background-color,border-color,color,transform] duration-[var(--duration-fast)]",
        "group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg",
        "motion-safe:group-hover:translate-x-[2px]",
      )}
    >
      <ArrowRight size={14} aria-hidden />
    </button>
  ) : affordance === "link" ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        stretch,
        // Inset to the card's own padding, so it lines up with the title and
        // the body text above it rather than hanging off the left edge.
        // mt-auto pins it to the foot: in an equal-height grid row a short card
        // otherwise leaves its affordance floating in the middle, out of line
        // with its neighbours'. With no spare height it resolves to 0.
        "mx-[var(--density-card-p)] mb-[var(--density-card-p)] mt-auto self-start",
        "inline-flex items-center gap-[5px] rounded-xs border-0 bg-transparent p-0",
        "text-sm font-medium text-link [text-decoration:var(--link-decoration)]",
        "transition-colors duration-[var(--duration-fast)]",
        "group-hover:text-link-hover group-hover:underline",
      )}
    >
      {affordanceLabel ?? labels.cardSeeMore}
      <ArrowRight
        size={13}
        aria-hidden
        className="transition-transform duration-[var(--duration-fast)] motion-safe:group-hover:translate-x-[2px]"
      />
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        stretch,
        "mx-[var(--density-card-p)] mb-[var(--density-card-p)] mt-auto self-start",
        "inline-flex h-[var(--control-height-sm)] items-center gap-[6px]",
        "rounded-md border border-border bg-surface px-[var(--control-padding-x-sm)]",
        "text-xs font-medium text-fg",
        "transition-[background-color,border-color] duration-[var(--duration-fast)]",
        "group-hover:border-border-strong group-hover:bg-surface-hover",
      )}
    >
      {affordanceLabel ?? labels.cardOpen}
      <ArrowRight size={13} aria-hidden />
    </button>
  );

  return (
    <Comp
      ref={ref}
      className={cn(
        "relative flex flex-col rounded-lg border bg-surface text-left",
        tones,
        interactive && [
          "group",
          "transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)]",
          "hover:border-border-strong hover:shadow-xs",
          // Suppressed by the reduced-motion rule in reset.css.
          "motion-safe:hover:-translate-y-[1px]",
          // Keyboard users get the same lift as the mouse.
          "has-[:focus-visible]:border-border-strong has-[:focus-visible]:shadow-xs",
          // Reserve the arrow's width plus a real gap, measured from the card
          // padding. At 40px the reserve was exactly the arrow, so a chip in the
          // header ended up touching it.
          affordance === "arrow" &&
            "[&>*:first-child]:pr-[calc(var(--density-card-p)+36px)]",
          // The in-flow affordance is the last child, so :nth-last-child(2) is
          // whatever sits above it. Drop that element's bottom padding, or the
          // card's own padding stacks with the affordance's margin.
          affordance !== "arrow" && "[&>*:nth-last-child(2)]:pb-[12px]",
        ],
        disabled && "pointer-events-none opacity-60",
        className,
      )}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
      {control}
    </Comp>
  );
});

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          // Wraps rather than squeezes: a CardAction is a whole control, and a
          // narrow card would otherwise crush the title to fit it on the line.
          "flex flex-wrap items-start justify-between gap-[12px]",
          "px-[var(--density-card-p)] pt-[var(--density-card-p)] pb-[10px]",
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn("m-0 text-lg font-semibold tracking-tight text-fg", className)}
        {...props}
      />
    );
  },
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("m-0 mt-[2px] text-sm text-fg-subtle", className)} {...props} />;
  },
);

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col px-[var(--density-card-p)] pb-[var(--density-card-p)]", className)}
        {...props}
      />
    );
  },
);

/**
 * The shelf at the foot of a card.
 *
 * Anything interactive in here sits above the stretched affordance, so a
 * clickable card can still carry its own buttons — which is the whole reason
 * the card is not itself a <button>.
 */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-[1] mt-auto flex items-center gap-[8px]",
          "border-t border-border-soft bg-surface-sunken/60",
          "px-[var(--density-card-p)] py-[12px] rounded-b-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

/** Wrap any control that must stay clickable inside an interactive card. */
export const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardAction({ className, ...props }, ref) {
    return <div ref={ref} className={cn("relative z-[1]", className)} {...props} />;
  },
);
