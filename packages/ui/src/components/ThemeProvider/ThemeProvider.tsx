import * as React from "react";
import type { Product, Theme } from "@smarta/tokens";
import { cn } from "../../lib/utils";
import { mergeLabels, type PartialLabels, type SmartaLabels } from "../../lib/labels";

/** One level deep, which is all a labels object ever is. */
function shallowEqual(a?: PartialLabels, b?: PartialLabels): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => a[k as keyof PartialLabels] === b[k as keyof PartialLabels]);
}

/** useLayoutEffect on the client, useEffect on the server, without the warning. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface ThemeContextValue {
  product: Product;
  /** undefined means "follow the operating system". */
  theme: Theme | undefined;
  /** Always complete: the product's partial overrides merged over English. */
  labels: SmartaLabels;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  product: "webapp",
  theme: undefined,
  labels: mergeLabels(),
});

/**
 * Reads the product and mode the surrounding surface is rendering in.
 *
 * Components should almost never need this. The point of the token layer is
 * that a component looks right in either product without asking which one it
 * is in. Reach for it only when a behaviour, not a value, differs — and when
 * it does, prefer adding a token (see --link-decoration) over a branch.
 */
export function useTheme() {
  return React.useContext(ThemeContext);
}

/**
 * The words the library says on its own behalf — a close button's accessible
 * name, a spinner's announcement, the pagination landmark.
 *
 * Always returns a complete set, so a component reads one without checking
 * whether the product supplied it. Outside a ThemeProvider it is English,
 * which keeps an unwrapped component legible rather than blank.
 */
export function useLabels(): SmartaLabels {
  return React.useContext(ThemeContext).labels;
}

/**
 * Re-applies the current theme scope inside a portal.
 *
 * Radix portals render into document.body, which sits outside the element
 * carrying data-product/data-theme — so a tooltip, menu, dialog or panel
 * resolved its tokens from :root instead, and on a dark-mode machine came out
 * in a different palette from the surface that opened it.
 *
 * display:contents means the wrapper adds no box, so Floating UI's positioning
 * and Radix's focus management are untouched, while custom properties still
 * inherit through it. Portalling into the themed element instead would have
 * worked too, but any ancestor with overflow or a transform would then clip the
 * thing being portalled — which is the reason to portal in the first place.
 */
export function ThemeScope({ children }: { children: React.ReactNode }) {
  const { product, theme } = useTheme();
  return (
    <div data-product={product} data-theme={theme} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  product?: Product;
  /** Omit to follow prefers-color-scheme. */
  theme?: Theme;
  /**
   * Render the attributes onto <html> instead of a wrapper div. What a real
   * application wants; Storybook wants the wrapper, so it can put four
   * combinations on one page.
   */
  asRoot?: boolean;
  /**
   * Overrides for the strings the components produce themselves — a close
   * button's accessible name, the pagination landmark. Partial: anything
   * omitted stays English.
   *
   * Compared by contents, so an inline object literal is fine.
   */
  labels?: PartialLabels;
  children?: React.ReactNode;
}

/**
 * Owns a theme scope. Everything below it resolves its tokens from the
 * data-product / data-theme pair this sets.
 *
 * Nesting is legal and does what you would expect: an inner provider overrides
 * an outer one, because the tokens are plain inherited custom properties.
 */
export function ThemeProvider({
  product = "webapp",
  theme,
  asRoot = false,
  labels,
  className,
  children,
  ...props
}: ThemeProviderProps) {
  // Before paint, not after: a useEffect here lets the document render one frame
  // in the operating system's theme before the chosen one lands, which reads as
  // a flash of the wrong palette on every load.
  useIsomorphicLayoutEffect(() => {
    if (!asRoot) return;
    const el = document.documentElement;
    el.setAttribute("data-product", product);
    if (theme) el.setAttribute("data-theme", theme);
    else el.removeAttribute("data-theme");
  }, [asRoot, product, theme]);

  /**
   * Compared by contents, not by identity.
   *
   * `labels={{ close: "Schließen" }}` is the shape everyone writes, including
   * the README's own example, and an object literal is a new reference on every
   * render. Keying the memo on identity meant the context value changed every
   * time the provider's parent rendered, re-rendering every component beneath
   * it — a performance footgun documented in a JSDoc nobody reads at the call
   * site. A shallow compare costs a handful of key lookups once per render and
   * removes it.
   */
  const labelsRef = React.useRef<PartialLabels | undefined>(labels);
  if (!shallowEqual(labelsRef.current, labels)) labelsRef.current = labels;
  const stableLabels = labelsRef.current;

  const merged = React.useMemo(() => mergeLabels(stableLabels), [stableLabels]);
  const value = React.useMemo(
    () => ({ product, theme, labels: merged }),
    [product, theme, merged],
  );

  if (asRoot) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-product={product}
        data-theme={theme}
        className={cn("font-sans text-base text-fg", className)}
        {...props}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
