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
