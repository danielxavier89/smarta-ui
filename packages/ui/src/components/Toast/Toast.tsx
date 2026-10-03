import * as React from "react";
import { Toast as RToast } from "radix-ui";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

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
  const labels = useLabels();
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
            ok: "sui:text-ok",
            warn: "sui:text-warn",
            bad: "sui:text-bad",
            info: "sui:text-info",
          }[m.tone ?? "ok"];
          return (
            <RToast.Root
              key={m.id}
              // An action needs time to be read and reached; a bare
              // confirmation does not.
              duration={m.duration ?? (m.action ? 8000 : 4500)}
              onOpenChange={(open) => !open && dismiss(m.id)}
              className={cn(
                "sui:flex sui:items-start sui:gap-[10px] sui:rounded-lg sui:border sui:border-border sui:bg-surface-raised",
                "sui:px-[14px] sui:py-[12px] sui:shadow-md",
                "sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out",
                "sui:data-[swipe=end]:animate-out",
              )}
            >
              <Icon size={16} aria-hidden className={cn("sui:mt-[1px] sui:shrink-0", tones)} />
              <div className="sui:min-w-0 sui:flex-1">
                <RToast.Title className="sui:m-0 sui:text-sm sui:font-medium sui:text-fg">{m.title}</RToast.Title>
                {m.description && (
                  <RToast.Description className="sui:m-0 sui:mt-[2px] sui:text-xs sui:text-fg-subtle">
                    {m.description}
                  </RToast.Description>
                )}
              </div>
              {m.action && (
                <RToast.Action asChild altText={m.action.label}>
                  <button
                    type="button"
                    onClick={m.action.onClick}
                    className="sui-touch-target sui:shrink-0 sui:rounded-xs sui:bg-transparent sui:p-0 sui:text-sm sui:font-medium sui:text-link sui:hover:underline sui:focus-visible:outline-2 sui:focus-visible:outline-focus-ring"
                  >
                    {m.action.label}
                  </button>
                </RToast.Action>
              )}
              <RToast.Close
                aria-label={labels.dismiss}
                className="sui-touch-target sui:shrink-0 sui:rounded-xs sui:text-fg-faint sui:hover:text-fg-muted sui:focus-visible:outline-2 sui:focus-visible:outline-focus-ring"
              >
                <X size={14} aria-hidden />
              </RToast.Close>
            </RToast.Root>
          );
        })}
        <RToast.Viewport
          className={cn(
            // 100%, not 100vw — vw counts the scrollbar, and a toast that is
            // fifteen pixels wider than the window scrolls the page sideways
            // behind it for the four seconds it is up.
            "sui:fixed sui:bottom-0 sui:right-0 sui:z-[var(--z-toast)] sui:m-0 sui:flex sui:w-[min(400px,100%)] sui:list-none sui:flex-col sui:gap-[8px] sui:p-[16px]",
            "sui:pb-[max(16px,env(safe-area-inset-bottom))] sui:focus-visible:outline-none",
            // A phone held sideways puts the notch over the right-hand edge.
            "sui:pr-[max(16px,env(safe-area-inset-right))]",
          )}
        />
      </RToast.Provider>
    </ToastContext.Provider>
  );
}
