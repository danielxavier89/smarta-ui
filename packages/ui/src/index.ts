/**
 * @smarta/ui — public surface.
 *
 * Every component here renders correctly in both products and both modes
 * without being told which one it is in. That property holds because no file
 * in this package contains a colour literal; see packages/tokens.
 */

// Theming
export * from "./components/ThemeProvider";
export { cn } from "./lib/utils";

/**
 * Re-exported because @smarta/tokens is a workspace package that is never
 * published: a consumer cannot import these from there, and ThemeProvider's
 * props are unusable without them. The build inlines the definitions.
 */
export type { Product, Theme } from "@smarta/tokens";

/**
 * The strings the components say on their own behalf. A product passes a
 * partial override to ThemeProvider; English fills the rest. See lib/labels.ts.
 */
export {
  defaultLabels,
  mergeLabels,
  type SmartaLabels,
  type PartialLabels,
} from "./lib/labels";

/**
 * Dates, numbers and money. Helpers a product calls before the value reaches a
 * component — components still never format. See lib/format.ts.
 */
export {
  formatCurrency,
  formatSignedCurrency,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDate,
  formatDateTime,
  formatMonth,
  formatRelativeDay,
  type SmartaLocale,
  type CurrencyOptions,
  type DateInput,
} from "./lib/format";

// Actions
export * from "./components/Button";
export * from "./components/IconButton";
export * from "./components/TextLink";

// Form
export * from "./components/Field";
export * from "./components/Label";
export * from "./components/Input";
export * from "./components/Textarea";
export * from "./components/Select";
export * from "./components/SearchInput";
export * from "./components/Checkbox";
export * from "./components/RadioGroup";
export * from "./components/Dropzone";

// Status and identity
export * from "./components/Chip";
export * from "./components/Badge";
export * from "./components/Avatar";
export * from "./components/Spinner";
export * from "./components/Progress";
export * from "./components/Skeleton";

// Containers
export * from "./components/Card";
export * from "./components/StatCard";
export * from "./components/Table";
export * from "./components/ListItem";
export * from "./components/KeyValue";
export * from "./components/EmptyState";

// Navigation
export * from "./components/Tabs";
export * from "./components/SegmentedControl";
export * from "./components/Pagination";
export * from "./components/DropdownMenu";

// Overlays and messages
export * from "./components/Panel";
export * from "./components/Dialog";
export * from "./components/Tooltip";
export * from "./components/Toast";
export * from "./components/Callout";
