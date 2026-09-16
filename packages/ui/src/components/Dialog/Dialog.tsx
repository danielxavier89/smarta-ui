import * as React from "react";
import { Dialog as RDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeScope } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";

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
            "fixed left-1/2 top-1/2 z-[var(--z-dialog)] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2",
            widths,
            "rounded-lg border border-border bg-surface-raised shadow-lg focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-95",
          )}
        >
          <div className="flex items-start gap-[10px] px-[20px] pt-[18px]">
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

          {children && <div className="px-[20px] pt-[14px]">{children}</div>}

          {confirm && (
            <div className="mt-[18px] flex justify-end gap-[8px] border-t border-border-soft px-[20px] py-[14px]">
              <RDialog.Close asChild>
                <Button variant="ghost">{cancelLabel}</Button>
              </RDialog.Close>
              <Button
                variant={confirm.variant ?? "primary"}
                loading={confirm.loading}
                disabled={confirm.disabled}
                onClick={() => void confirm.onConfirm()}
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
