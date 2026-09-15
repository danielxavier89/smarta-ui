import * as React from "react";
import type { Product, Theme } from "@smarta/tokens";
import { cn } from "@/lib/utils";

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
  React.useEffect(() => {
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
