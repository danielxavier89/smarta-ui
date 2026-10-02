import * as React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";
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
  const labels = useLabels();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
      <ThemeScope>
        <Dialog.Overlay
          className={cn(
            "sui:fixed sui:inset-0 sui:z-[var(--z-overlay)] sui:bg-overlay",
            "sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out",
          )}
        />
        <Dialog.Content
          className={cn(
            "sui:fixed sui:z-[var(--z-panel)] sui:flex sui:flex-col sui:bg-surface-raised",
            "sui:focus:outline-none",
            // Phone: a bottom sheet. One rule, one owner — three competing
            // versions of this is how you get a half-applied sheet.
            // dvh, not vh: vh is the *large* viewport, measured as though the
            // browser chrome were hidden. At 88vh the sheet's footer sat under
            // Safari's toolbar until the user scrolled it away.
            "sui:inset-x-0 sui:bottom-0 sui:top-auto sui:h-[88dvh] sui:max-w-none",
            "sui:rounded-t-xl sui:border-t sui:border-border sui:shadow-sheet",
            "sui:data-[state=open]:animate-in sui:data-[state=open]:slide-in-from-bottom",
            "sui:data-[state=closed]:animate-out sui:data-[state=closed]:slide-out-to-bottom",
            // Tablet up: a side panel.
            "sui:sm:inset-y-0 sui:sm:right-0 sui:sm:left-auto sui:sm:h-auto sui:sm:rounded-none sui:sm:rounded-l-none",
            "sui:sm:border-t-0 sui:sm:border-l sui:sm:shadow-panel",
            // From the right only. The phone's slide-from-bottom above still
            // applies at this width — the two are separate variables, x and y —
            // and together they brought the panel in diagonally from the corner.
            "sui:sm:data-[state=open]:slide-in-from-right sui:sm:data-[state=open]:[--tw-enter-translate-y:0]",
            "sui:sm:data-[state=closed]:slide-out-to-right sui:sm:data-[state=closed]:[--tw-exit-translate-y:0]",
            width === "wide"
              ? "sui:sm:w-[min(760px,92vw)]"
              : "sui:sm:w-[min(var(--panel-width),88vw)]",
            className,
          )}
        >
          <div className="sui:flex sui:items-start sui:gap-[10px] sui:border-b sui:border-border sui:px-[20px] sui:py-[16px]">
            <div className="sui:min-w-0 sui:flex-1">
              <Dialog.Title className="sui:m-0 sui:truncate sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg">
                {title}
              </Dialog.Title>
              {subtitle ? (
                <Dialog.Description className="sui:m-0 sui:mt-[2px] sui:text-sm sui:text-fg-subtle">
                  {subtitle}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sui:sr-only">{title}</Dialog.Description>
              )}
            </div>
            {headerAction}
            <Dialog.Close asChild>
              <IconButton variant="ghost" size="sm" label={labels.close} icon={<X size={16} />} />
            </Dialog.Close>
          </div>

          {/* With no footer the body is the last thing in the sheet, so it owes
              the home indicator its own clearance. */}
          <div
            className={cn(
              "sui:flex-1 sui:overflow-y-auto sui:overscroll-contain",
              !footer && "sui:pb-[env(safe-area-inset-bottom)] sui:sm:pb-0",
            )}
          >
            {children}
          </div>

          {footer && (
            <div className="sui:flex sui:items-center sui:gap-[8px] sui:border-t sui:border-border sui:bg-surface-sunken/50 sui:px-[20px] sui:py-[12px] sui:pb-[max(12px,env(safe-area-inset-bottom))] sui:sm:pb-[12px]">
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
    <section className={cn("sui:border-b sui:border-border-soft sui:px-[20px] sui:py-[16px] sui:last:border-b-0", className)} {...props}>
      {/* h3, because the panel's own title is the h2 Radix renders for the
          dialog. It was h4, which skipped a level in every panel in both
          products; a real-browser axe run on the detail-panel recipe found it.
          The size comes from the classes, so the tag only changes the outline. */}
      {title && (
        <h3 className="sui:m-0 sui:mb-[8px] sui:text-xs sui:font-medium sui:uppercase sui:tracking-wide sui:text-fg-subtle">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
