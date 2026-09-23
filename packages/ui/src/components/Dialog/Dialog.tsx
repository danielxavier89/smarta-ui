import * as React from "react";
import { Dialog as RDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeScope } from "../ThemeProvider";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  /** The consequence, in plain words. Required for a destructive confirm. */
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** The button that does the thing. Its label says what happens, not "OK". */
  confirm?: {
    label: string;
    onConfirm: () => void | Promise<void>;
    variant?: "primary" | "danger";
    loading?: boolean;
    disabled?: boolean;
  };
  cancelLabel?: string;
  /** Forces a deliberate answer: no Escape, no click-outside, no close button. */
  blocking?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * A modal that interrupts to ask one question.
 *
 * Use it only when the answer cannot wait and cannot be undone — deleting,
 * rejecting, sending something to a customer. Anything the user can back out of
 * belongs in a Panel, which does not take the page hostage.
 *
 * The confirm button says what happens: "Reject & tell the customer",
 * "Convert Petra", "Delete the upload". Never "Submit", never "OK".
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirm,
  cancelLabel = "Cancel",
  blocking = false,
  size = "sm",
}: DialogProps) {
  const stop = blocking ? (e: Event) => e.preventDefault() : undefined;
  const widths = { sm: "max-w-[420px]", md: "max-w-[560px]", lg: "max-w-[720px]" }[size];

  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
      <ThemeScope>
        <RDialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-overlay data-[state=open]:animate-in" />
        <RDialog.Content
          onEscapeKeyDown={stop}
          onPointerDownOutside={stop}
          onInteractOutside={stop}
          className={cn(
            "fixed left-1/2 top-1/2 z-[var(--z-dialog)] -translate-x-1/2 -translate-y-1/2",
            // 100% of the viewport, not 100vw: vw counts the scrollbar, so on
            // a desktop with one the dialog was 15px wider than the room it
            // had and the page gained a horizontal scroll behind the scrim.
            "w-[calc(100%-32px)]",
            widths,
            // A centred box with no ceiling loses its top and bottom off the
            // screen the moment the content is taller than the viewport, and
            // nothing scrolls it back — a phone in landscape is about 380px
            // tall, so this was not an edge case. dvh, so the address bar
            // sliding away does not leave the footer under it.
            "flex max-h-[calc(100dvh-32px)] flex-col",
            "rounded-lg border border-border bg-surface-raised shadow-lg focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-95",
          )}
        >
          <div className="flex shrink-0 items-start gap-[10px] px-[20px] pt-[18px]">
            <div className="min-w-0 flex-1">
              <RDialog.Title className="m-0 text-lg font-semibold tracking-tight text-fg">
                {title}
              </RDialog.Title>
              {description ? (
                <RDialog.Description className="m-0 mt-[6px] text-base text-fg-muted">
                  {description}
                </RDialog.Description>
              ) : (
                <RDialog.Description className="sr-only">{title}</RDialog.Description>
              )}
            </div>
            {!blocking && (
              <RDialog.Close asChild>
                <IconButton variant="ghost" size="sm" label="Close" icon={<X size={16} />} />
              </RDialog.Close>
            )}
          </div>

          {children && (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[20px] pt-[14px]">
              {children}
            </div>
          )}

          {confirm && (
            <div
              className={cn(
                "mt-[18px] flex shrink-0 gap-[8px] border-t border-border-soft px-[20px] py-[14px]",
                // A confirm button names the act — "Reject & tell the customer"
                // — so two of them side by side do not fit a phone. Stacked and
                // reversed: the DOM keeps cancel first for the keyboard, the
                // screen puts the act on top, where the thumb already is.
                "flex-col-reverse sm:flex-row sm:justify-end",
                // Clear of the home indicator on a phone held upright.
                "pb-[max(14px,env(safe-area-inset-bottom))] sm:pb-[14px]",
              )}
            >
              <RDialog.Close asChild>
                <Button variant="ghost" className="w-full sm:w-auto">
                  {cancelLabel}
                </Button>
              </RDialog.Close>
              <Button
                variant={confirm.variant ?? "primary"}
                loading={confirm.loading}
                disabled={confirm.disabled}
                onClick={() => void confirm.onConfirm()}
                className="w-full sm:w-auto"
              >
                {confirm.label}
              </Button>
            </div>
          )}
        </RDialog.Content>
      </ThemeScope>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
