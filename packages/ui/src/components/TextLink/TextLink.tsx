import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const base = [
  "inline items-baseline p-0 bg-transparent border-0 align-baseline",
  "font-[inherit] text-link [text-decoration:var(--link-decoration)] [text-underline-offset:2px]",
  "cursor-pointer",
  "hover:text-link-hover hover:underline",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-xs",
  "disabled:opacity-55 disabled:cursor-default disabled:no-underline",
].join(" ");

export interface TextLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Quiet variant: reads as secondary text until hovered. */
  muted?: boolean;
  /** Render as an <a>, a router Link, anything. */
  asChild?: boolean;
}

/**
 * Text that behaves like a link but is a <button>.
 *
 * Both prototypes learned this the hard way: an `<a href="#">` runs its handler
 * and *then* empties location.hash, the router hears hashchange and sends the
 * page back to Home — so the control visibly does the wrong thing. Anything
 * that acts on the current page is a button wearing link clothes.
 *
 * For an actual navigation to another URL, pass asChild and give it a real
 * href, so middle-click and copy-link keep working.
 */
export const TextLink = React.forwardRef<HTMLButtonElement, TextLinkProps>(
  function TextLink({ className, muted = false, asChild = false, type, ...props }, ref) {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        className={cn(base, muted && "text-fg-subtle no-underline", className)}
        {...props}
      />
    );
  },
);
