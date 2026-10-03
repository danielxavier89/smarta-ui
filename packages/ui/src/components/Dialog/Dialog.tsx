import * as React from "react";
import { Dialog as RDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";
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
  cancelLabel,
  blocking = false,
  size = "sm",
}: DialogProps) {
  const labels = useLabels();

  const stop = blocking ? (e: Event) => e.preventDefault() : undefined;
  const widths = { sm: "sui:max-w-[420px]", md: "sui:max-w-[560px]", lg: "sui:max-w-[720px]" }[size];

  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
      <ThemeScope>
        <RDialog.Overlay className="sui:fixed sui:inset-0 sui:z-[var(--z-overlay)] sui:bg-overlay sui:data-[state=open]:animate-in" />
        <RDialog.Content
          onEscapeKeyDown={stop}
          onPointerDownOutside={stop}
          onInteractOutside={stop}
          className={cn(
            "sui:fixed sui:left-1/2 sui:top-1/2 sui:z-[var(--z-dialog)] sui:-translate-x-1/2 sui:-translate-y-1/2",
            // 100% of the viewport, not 100vw: vw counts the scrollbar, so on
            // a desktop with one the dialog was 15px wider than the room it
            // had and the page gained a horizontal scroll behind the scrim.
            "sui:w-[calc(100%-32px)]",
            widths,
            // A centred box with no ceiling loses its top and bottom off the
            // screen the moment the content is taller than the viewport, and
            // nothing scrolls it back — a phone in landscape is about 380px
            // tall, so this was not an edge case. dvh, so the address bar
            // sliding away does not leave the footer under it.
            "sui:flex sui:max-h-[calc(100dvh-32px)] sui:flex-col",
            "sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised sui:shadow-lg sui:focus:outline-none",
            "sui:data-[state=open]:animate-in sui:data-[state=open]:zoom-in-95",
          )}
        >
          <div className="sui:flex sui:shrink-0 sui:items-start sui:gap-[10px] sui:px-[20px] sui:pt-[18px]">
            <div className="sui:min-w-0 sui:flex-1">
              <RDialog.Title className="sui:m-0 sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg">
                {title}
              </RDialog.Title>
              {description ? (
                <RDialog.Description className="sui:m-0 sui:mt-[6px] sui:text-base sui:text-fg-muted">
                  {description}
                </RDialog.Description>
              ) : (
                <RDialog.Description className="sui:sr-only">{title}</RDialog.Description>
              )}
            </div>
            {!blocking && (
              <RDialog.Close asChild>
                <IconButton variant="ghost" size="sm" label={labels.close} icon={<X size={16} />} />
              </RDialog.Close>
            )}
          </div>

          {children && (
            <div className="sui:min-h-0 sui:flex-1 sui:overflow-y-auto sui:overscroll-contain sui:px-[20px] sui:pt-[14px]">
              {children}
            </div>
          )}

          {confirm && (
            <div
              className={cn(
                "sui:mt-[18px] sui:flex sui:shrink-0 sui:gap-[8px] sui:border-t sui:border-border-soft sui:px-[20px] sui:py-[14px]",
                // A confirm button names the act — "Reject & tell the customer"
                // — so two of them side by side do not fit a phone. Stacked and
                // reversed: the DOM keeps cancel first for the keyboard, the
                // screen puts the act on top, where the thumb already is.
                "sui:flex-col-reverse sui:sm:flex-row sui:sm:justify-end",
                // Clear of the home indicator on a phone held upright.
                "sui:pb-[max(14px,env(safe-area-inset-bottom))] sui:sm:pb-[14px]",
              )}
            >
              <RDialog.Close asChild>
                <Button variant="ghost" className="sui:w-full sui:sm:w-auto">
                  {cancelLabel ?? labels.cancel}
                </Button>
              </RDialog.Close>
              <Button
                variant={confirm.variant ?? "primary"}
                loading={confirm.loading}
                disabled={confirm.disabled}
                onClick={() => void confirm.onConfirm()}
                className="sui:w-full sui:sm:w-auto"
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
