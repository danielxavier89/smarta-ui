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
    default: "sui:border-border",
    warn: "sui:border-warn/40 sui:bg-warn-bg",
    bad: "sui:border-bad/40 sui:bg-bad-bg",
    accent: "sui:border-accent/40 sui:bg-accent-soft",
  }[tone];

  // The one element that is actually pressed. Its ::after covers the card, so
  // a click anywhere on the surface lands here.
  const stretch =
    "sui:after:absolute sui:after:inset-0 sui:after:content-[''] sui:after:rounded-lg sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring";

  const control = !interactive ? null : affordanceAsChild ? (
    <Slot.Root
      className={cn(stretch, "sui:relative")}
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
        "sui:absolute sui:right-[var(--density-card-p)] sui:top-[var(--density-card-p)]",
        "sui:grid sui:size-[26px] sui:place-items-center sui:rounded-full",
        "sui:border sui:border-border sui:bg-surface sui:text-fg-subtle",
        "sui:transition-[background-color,border-color,color,transform] sui:duration-[var(--duration-fast)]",
        "sui:group-hover:border-accent sui:group-hover:bg-accent sui:group-hover:text-accent-fg",
        "sui:motion-safe:group-hover:translate-x-[2px]",
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
        "sui:mx-[var(--density-card-p)] sui:mb-[var(--density-card-p)] sui:mt-auto sui:self-start",
        "sui:inline-flex sui:items-center sui:gap-[5px] sui:rounded-xs sui:border-0 sui:bg-transparent sui:p-0",
        "sui:text-sm sui:font-medium sui:text-link sui:[text-decoration:var(--link-decoration)]",
        "sui:transition-colors sui:duration-[var(--duration-fast)]",
        "sui:group-hover:text-link-hover sui:group-hover:underline",
      )}
    >
      {affordanceLabel ?? labels.cardSeeMore}
      <ArrowRight
        size={13}
        aria-hidden
        className="sui:transition-transform sui:duration-[var(--duration-fast)] sui:motion-safe:group-hover:translate-x-[2px]"
      />
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        stretch,
        "sui:mx-[var(--density-card-p)] sui:mb-[var(--density-card-p)] sui:mt-auto sui:self-start",
        "sui:inline-flex sui:h-[var(--control-height-sm)] sui:items-center sui:gap-[6px]",
        "sui:rounded-md sui:border sui:border-border sui:bg-surface sui:px-[var(--control-padding-x-sm)]",
        "sui:text-xs sui:font-medium sui:text-fg",
        "sui:transition-[background-color,border-color] sui:duration-[var(--duration-fast)]",
        "sui:group-hover:border-border-strong sui:group-hover:bg-surface-hover",
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
        "sui:relative sui:flex sui:flex-col sui:rounded-lg sui:border sui:bg-surface sui:text-left",
        tones,
        interactive && [
          "group",
          "sui:transition-[border-color,box-shadow,transform] sui:duration-[var(--duration-fast)]",
          "sui:hover:border-border-strong sui:hover:shadow-xs",
          // Suppressed by the reduced-motion rule in reset.css.
          "sui:motion-safe:hover:-translate-y-[1px]",
          // Keyboard users get the same lift as the mouse.
          "sui:has-[:focus-visible]:border-border-strong sui:has-[:focus-visible]:shadow-xs",
          // Reserve the arrow's width plus a real gap, measured from the card
          // padding. At 40px the reserve was exactly the arrow, so a chip in the
          // header ended up touching it.
          affordance === "arrow" &&
            "sui:[&>*:first-child]:pr-[calc(var(--density-card-p)+36px)]",
          // The in-flow affordance is the last child, so :nth-last-child(2) is
          // whatever sits above it. Drop that element's bottom padding, or the
          // card's own padding stacks with the affordance's margin.
          affordance !== "arrow" && "sui:[&>*:nth-last-child(2)]:pb-[12px]",
        ],
        disabled && "sui:pointer-events-none sui:opacity-60",
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
          "sui:flex sui:flex-wrap sui:items-start sui:justify-between sui:gap-[12px]",
          "sui:px-[var(--density-card-p)] sui:pt-[var(--density-card-p)] sui:pb-[10px]",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The heading level. `h3` is the common case — a card inside a section
   * inside a page — but only the page knows its own outline, and a card
   * directly under an `h1` needs `h2` or the document skips a level.
   *
   * Size is a token, not a consequence of the tag, so changing this changes
   * the structure and not the look.
   */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, as: Tag = "h3", ...props }, ref) {
    return (
      <Tag
        ref={ref}
        className={cn("sui:m-0 sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg", className)}
        {...props}
      />
    );
  },
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("sui:m-0 sui:mt-[2px] sui:text-sm sui:text-fg-subtle", className)} {...props} />;
  },
);

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("sui:flex sui:flex-col sui:px-[var(--density-card-p)] sui:pb-[var(--density-card-p)]", className)}
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
          "sui:relative sui:z-[1] sui:mt-auto sui:flex sui:items-center sui:gap-[8px]",
          "sui:border-t sui:border-border-soft sui:bg-surface-sunken/60",
          "sui:px-[var(--density-card-p)] sui:py-[12px] sui:rounded-b-lg",
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
    return <div ref={ref} className={cn("sui:relative sui:z-[1]", className)} {...props} />;
  },
);
