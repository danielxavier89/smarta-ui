import * as React from "react";
import { Toast as RToast } from "radix-ui";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "ok" | "warn" | "bad" | "info";

export interface ToastMessage {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /** One button. "Undo" is the one that earns its place most often. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds. A toast carrying an action gets longer by default. */
  duration?: number;
}

interface ToastContextValue {
  toast: (message: Omit<ToastMessage, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const icons = { ok: CheckCircle2, warn: AlertTriangle, bad: XCircle, info: Info };

/**
 * Toasts, and the hook that raises them.
 *
 * The rule from the backoffice prototype, worth keeping: a state change the
 * user cannot see on screen gets a toast; everything else shows in place. A
 * toast that announces something already visible is noise, and a toast is the
 * wrong home for anything the user has to act on — it leaves.
 */
export function ToastProvider({
  children,
  swipeDirection = "right",
}: {
  children: React.ReactNode;
  swipeDirection?: "right" | "up" | "down" | "left";
}) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setMessages((m) => m.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((msg: Omit<ToastMessage, "id"> & { id?: string }) => {
    const id = msg.id ?? Math.random().toString(36).slice(2);
    setMessages((m) => [...m, { tone: "ok", ...msg, id }]);
    return id;
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RToast.Provider swipeDirection={swipeDirection}>
        {children}
        {messages.map((m) => {
          const Icon = icons[m.tone ?? "ok"];
          const tones = {
            ok: "text-ok",
            warn: "text-warn",
            bad: "text-bad",
            info: "text-info",
          }[m.tone ?? "ok"];
          return (
            <RToast.Root
              key={m.id}
              // An action needs time to be read and reached; a bare
              // confirmation does not.
              duration={m.duration ?? (m.action ? 8000 : 4500)}
              onOpenChange={(open) => !open && dismiss(m.id)}
              className={cn(
                "flex items-start gap-[10px] rounded-lg border border-border bg-surface-raised",
                "px-[14px] py-[12px] shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[swipe=end]:animate-out",
              )}
            >
              <Icon size={16} aria-hidden className={cn("mt-[1px] shrink-0", tones)} />
              <div className="min-w-0 flex-1">
                <RToast.Title className="m-0 text-sm font-medium text-fg">{m.title}</RToast.Title>
                {m.description && (
                  <RToast.Description className="m-0 mt-[2px] text-xs text-fg-subtle">
                    {m.description}
                  </RToast.Description>
                )}
              </div>
              {m.action && (
                <RToast.Action asChild altText={m.action.label}>
                  <button
                    type="button"
                    onClick={m.action.onClick}
                    className="shrink-0 rounded-xs bg-transparent p-0 text-sm font-medium text-link hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring"
                  >
                    {m.action.label}
                  </button>
                </RToast.Action>
              )}
              <RToast.Close
                aria-label="Dismiss"
                className="shrink-0 rounded-xs text-fg-faint hover:text-fg-muted focus-visible:outline-2 focus-visible:outline-focus-ring"
              >
                <X size={14} aria-hidden />
              </RToast.Close>
            </RToast.Root>
          );
        })}
        <RToast.Viewport
          className={cn(
            "fixed bottom-0 right-0 z-[var(--z-toast)] m-0 flex w-[min(400px,100vw)] list-none flex-col gap-[8px] p-[16px]",
            "pb-[max(16px,env(safe-area-inset-bottom))] outline-none",
          )}
        />
      </RToast.Provider>
    </ToastContext.Provider>
  );
}
