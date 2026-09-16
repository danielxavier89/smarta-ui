import * as React from "react";
import type { Product, Theme } from "@smarta/tokens";
import { cn } from "@/lib/utils";

/** useLayoutEffect on the client, useEffect on the server, without the warning. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface ThemeContextValue {
  product: Product;
  /** undefined means "follow the operating system". */
  theme: Theme | undefined;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  product: "webapp",
  theme: undefined,
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

  const value = React.useMemo(() => ({ product, theme }), [product, theme]);

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
