import * as React from "react";
import { Dialog, Slot } from "radix-ui";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels, ThemeScope } from "../ThemeProvider";
import { IconButton } from "../IconButton";

export interface AppShellProps {
  /** The product's mark, top of the sidebar and of the phone's top bar. */
  brand?: React.ReactNode;
  /** The navigation: NavItems, NavGroups. Rendered in the sidebar, and in a drawer on a phone. */
  nav: React.ReactNode;
  /** Below the navigation, pinned to the sidebar's foot: the account, the company switcher. */
  navFooter?: React.ReactNode;
  /** The top bar right of the page — search, notifications, the avatar. Hidden on a phone if omitted. */
  topBar?: React.ReactNode;
  /** The page. Rendered in <main>. */
  children: React.ReactNode;
  /** The id the skip link jumps to. Change it only if the product already uses "main". */
  mainId?: string;
  className?: string;
}

const DrawerContext = React.createContext<(() => void) | null>(null);

/**
 * The frame every screen sits in: a skip link, a sidebar of navigation, a top
 * bar, and the page in <main>.
 *
 * On a phone the sidebar becomes a drawer behind a menu button, and following
 * a NavItem closes it — the drawer is a way to get somewhere, not a place.
 *
 * It owns the page's landmarks, so a screen built inside it gets a navigation,
 * a main and a skip link without doing anything, and cannot end up with two.
 */
export function AppShell({ brand, nav, navFooter, topBar, children, mainId = "main", className }: AppShellProps) {
  const labels = useLabels();
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  // A drawer left open while the window widens past the sidebar breakpoint
  // would stay a modal over a page whose button for it is gone.
  React.useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia("(min-width: 48rem)"); // Tailwind's md
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open]);

  const sidebar = (
    <>
      <div className="sui:flex sui:min-h-0 sui:flex-1 sui:flex-col sui:gap-[2px] sui:overflow-y-auto sui:px-[12px] sui:py-[8px]">
        {nav}
      </div>
      {navFooter && <div className="sui:border-t sui:border-border sui:p-[12px]">{navFooter}</div>}
    </>
  );

  return (
    <DrawerContext.Provider value={close}>
      <div className={cn("sui:flex sui:min-h-dvh sui:bg-canvas", className)}>
        <a
          href={`#${mainId}`}
          // Focus, not navigation: in a hash-routed app "#main" is a route, and
          // the link would send the page to it. The href stays for no-JS.
          onClick={(e) => {
            const main = document.getElementById(mainId);
            if (!main) return;
            e.preventDefault();
            main.focus();
          }}
          className={cn(
            "sui:sr-only sui:focus:not-sr-only sui:focus:fixed sui:focus:left-[12px] sui:focus:top-[12px] sui:focus:z-[var(--z-toast)]",
            "sui:focus:rounded-md sui:focus:bg-surface-raised sui:focus:px-[14px] sui:focus:py-[8px] sui:focus:text-sm sui:focus:text-fg sui:focus:shadow-lg",
          )}
        >
          {labels.skipToContent}
        </a>

        {/* Desktop: a fixed sidebar. */}
        <nav
          aria-label={labels.mainNavigation}
          className={cn(
            "sui:sticky sui:top-0 sui:hidden sui:h-dvh sui:w-[var(--sidebar-width)] sui:shrink-0 sui:flex-col",
            "sui:border-r sui:border-border sui:bg-surface sui:md:flex",
          )}
        >
          {brand && <div className="sui:flex sui:h-[var(--topbar-height)] sui:items-center sui:px-[20px]">{brand}</div>}
          {sidebar}
        </nav>

        <div className="sui:flex sui:min-w-0 sui:flex-1 sui:flex-col">
          <div
            className={cn(
              "sui:sticky sui:top-0 sui:z-[var(--z-sticky)] sui:flex sui:h-[var(--topbar-height)] sui:items-center sui:gap-[12px]",
              "sui:border-b sui:border-border sui:bg-canvas/90 sui:px-[16px] sui:backdrop-blur sui:md:px-[24px]",
              !topBar && "sui:md:hidden",
            )}
          >
            {/* Phone: the drawer. */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <IconButton variant="ghost" label={labels.openNavigation} icon={<Menu size={18} />} className="sui:md:hidden" />
              </Dialog.Trigger>
              <Dialog.Portal>
                <ThemeScope>
                  <Dialog.Overlay className="sui:fixed sui:inset-0 sui:z-[var(--z-overlay)] sui:bg-overlay sui:data-[state=open]:animate-in sui:data-[state=closed]:animate-out" />
                  <Dialog.Content
                    aria-describedby={undefined}
                    className={cn(
                      "sui:fixed sui:inset-y-0 sui:left-0 sui:z-[var(--z-panel)] sui:flex sui:w-[min(var(--sidebar-width),85vw)] sui:flex-col",
                      "sui:border-r sui:border-border sui:bg-surface-raised sui:shadow-panel sui:focus:outline-none",
                      "sui:data-[state=open]:animate-in sui:data-[state=open]:slide-in-from-left",
                    )}
                  >
                    <Dialog.Title className="sui:sr-only">{labels.mainNavigation}</Dialog.Title>
                    <div className="sui:flex sui:h-[var(--topbar-height)] sui:items-center sui:justify-between sui:gap-[8px] sui:pl-[20px] sui:pr-[8px]">
                      {brand}
                      <Dialog.Close asChild>
                        <IconButton variant="ghost" label={labels.closeNavigation} icon={<X size={18} />} />
                      </Dialog.Close>
                    </div>
                    <nav aria-label={labels.mainNavigation} className="sui:flex sui:min-h-0 sui:flex-1 sui:flex-col">
                      {sidebar}
                    </nav>
                  </Dialog.Content>
                </ThemeScope>
              </Dialog.Portal>
            </Dialog.Root>
            {brand && <div className="sui:md:hidden">{brand}</div>}
            {topBar && <div className="sui:ml-auto sui:flex sui:min-w-0 sui:items-center sui:gap-[8px]">{topBar}</div>}
          </div>

          <main id={mainId} tabIndex={-1} className="sui:min-w-0 sui:flex-1 sui:p-[16px] sui:focus:outline-none sui:md:p-[24px] sui:lg:px-[32px]">
            {children}
          </main>
        </div>
      </div>
    </DrawerContext.Provider>
  );
}

export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  /** The page this item leads to is the one showing. */
  active?: boolean;
  /** A count beside the label — things waiting, not totals. */
  count?: number;
  /** Render the child (a router Link) as the item. */
  asChild?: boolean;
}

/**
 * One destination in the AppShell's navigation. A link, always: it goes
 * somewhere, it opens in a new tab, and the current one says so with
 * aria-current — not just a darker background.
 */
export const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { icon, active = false, count, asChild = false, className, children, onClick, ...props },
  ref,
) {
  const close = React.useContext(DrawerContext);
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      ref={ref}
      aria-current={active ? "page" : undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        close?.();
      }}
      className={cn(
        "sui:flex sui:h-[36px] sui:items-center sui:gap-[10px] sui:rounded-md sui:px-[10px] sui:text-sm sui:no-underline",
        "sui:text-fg-muted sui:hover:bg-surface-hover sui:hover:text-fg",
        active && "sui:bg-accent-soft sui:font-medium sui:text-fg sui:hover:bg-accent-soft",
        className,
      )}
      {...props}
    >
      {icon && (
        <span aria-hidden className={cn("sui:grid sui:shrink-0 sui:place-items-center", active ? "sui:text-accent" : "sui:text-fg-subtle")}>
          {icon}
        </span>
      )}
      {/* With asChild the router Link becomes the item and its text lands here. */}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : <span className="sui:min-w-0 sui:truncate">{children}</span>}
      {count !== undefined && count > 0 && (
        <span className="sui:ml-auto sui:shrink-0 sui:rounded-full sui:bg-surface-sunken sui:px-[7px] sui:text-xs sui:font-medium sui:tabular-nums sui:text-fg-muted">
          {count}
        </span>
      )}
    </Comp>
  );
});

/** A labelled group of NavItems: "Accounting", "Settings". */
export function NavGroup({ label, children, className }: { label?: React.ReactNode; children: React.ReactNode; className?: string }) {
  const id = React.useId();
  return (
    <div role="group" aria-labelledby={label ? id : undefined} className={cn("sui:flex sui:flex-col sui:gap-[2px] sui:pt-[12px] sui:first:pt-0", className)}>
      {label && (
        <div id={id} className="sui:px-[10px] sui:pb-[4px] sui:text-xs sui:font-medium sui:text-fg-subtle">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
