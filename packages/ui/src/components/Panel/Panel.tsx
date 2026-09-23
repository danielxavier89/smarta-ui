import * as React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeScope } from "../ThemeProvider";
import { IconButton } from "../IconButton";

export interface PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Always visible, always a heading. A panel with no title is a panel nobody can place. */
  title: React.ReactNode;
  /** A line under the title: what this is about, a date, an amount. */
  subtitle?: React.ReactNode;
  /** A control in the header row, right of the title — a kebab menu, a status chip. */
  headerAction?: React.ReactNode;
  /** The sticky action bar. Omit it for a panel that only shows things. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Wider for a two-column body (a document beside its fields). */
  width?: "default" | "wide";
  className?: string;
}

/**
 * The right-hand detail panel. On a narrow screen it becomes a bottom sheet.
 *
 * There is exactly one of these per product, and every detail view is a caller
 * of it — notifications, a receipt, a transaction, a message, a picker, a
 * wizard step, a success state. Both prototypes carry the same note in their
 * house rules: don't build a second panel component. If a new detail view is
 * needed, it is another Panel caller.
 *
 * Closed means closed: Radix unmounts the content, so nothing off-screen stays
 * in the tab order or in the accessibility tree.
 */
export function Panel({
  open,
  onOpenChange,
  title,
  subtitle,
  headerAction,
  footer,
  children,
  width = "default",
  className,
}: PanelProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
      <ThemeScope>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[var(--z-overlay)] bg-overlay",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed z-[var(--z-panel)] flex flex-col bg-surface-raised",
            "focus:outline-none",
            // Phone: a bottom sheet. One rule, one owner — three competing
            // versions of this is how you get a half-applied sheet.
            // dvh, not vh: vh is the *large* viewport, measured as though the
            // browser chrome were hidden. At 88vh the sheet's footer sat under
            // Safari's toolbar until the user scrolled it away.
            "inset-x-0 bottom-0 top-auto h-[88dvh] max-w-none",
            "rounded-t-xl border-t border-border shadow-[var(--shadow-sheet)]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
            // Tablet up: a side panel.
            "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-auto sm:rounded-none sm:rounded-l-none",
            "sm:border-t-0 sm:border-l sm:shadow-[var(--shadow-panel)]",
            "sm:data-[state=open]:slide-in-from-right",
            width === "wide"
              ? "sm:w-[min(760px,92vw)]"
              : "sm:w-[min(var(--panel-width),88vw)]",
            className,
          )}
        >
          <div className="flex items-start gap-[10px] border-b border-border px-[20px] py-[16px]">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="m-0 truncate text-lg font-semibold tracking-tight text-fg">
                {title}
              </Dialog.Title>
              {subtitle ? (
                <Dialog.Description className="m-0 mt-[2px] text-sm text-fg-subtle">
                  {subtitle}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            {headerAction}
            <Dialog.Close asChild>
              <IconButton variant="ghost" size="sm" label="Close" icon={<X size={16} />} />
            </Dialog.Close>
          </div>

          {/* With no footer the body is the last thing in the sheet, so it owes
              the home indicator its own clearance. */}
          <div
            className={cn(
              "flex-1 overflow-y-auto overscroll-contain",
              !footer && "pb-[env(safe-area-inset-bottom)] sm:pb-0",
            )}
          >
            {children}
          </div>

          {footer && (
            <div className="flex items-center gap-[8px] border-t border-border bg-surface-sunken/50 px-[20px] py-[12px] pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-[12px]">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </ThemeScope>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** A padded section inside a panel body. */
export function PanelSection({
  className,
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode }) {
  return (
    <section className={cn("border-b border-border-soft px-[20px] py-[16px] last:border-b-0", className)} {...props}>
      {title && (
        <h4 className="m-0 mb-[8px] text-xs font-medium uppercase tracking-wide text-fg-subtle">
          {title}
        </h4>
      )}
      {children}
    </section>
  );
}
