import * as React from "react";
import { cn } from "../../lib/utils";
import { useLabels, useLocale } from "../ThemeProvider";
import { Table, THead, TBody, TR, TH, TD } from "../Table";
import { Checkbox } from "../Checkbox";
import { Skeleton } from "../Skeleton";
import { EmptyState } from "../EmptyState";
import { Button } from "../Button";
import { Pagination } from "../Pagination";
import { SearchInput } from "../SearchInput";
import { MultiSelect } from "../MultiSelect";
import { DateRangePicker, type DateRange, type DateRangePreset } from "../DateRangePicker";
import { fold, type ComboboxOption } from "../Combobox/OptionList";

export type SortDirection = "asc" | "desc";
export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /**
   * Makes the column sortable. A function sorts in the browser by what it
   * returns; `true` only renders the control and leaves sorting to the
   * product, through `onSortChange`.
   */
  sort?: true | ((row: T) => string | number | Date | null | undefined);
  /** Right-aligned and tabular. Every column of money. */
  numeric?: boolean;
  /** Quieter text: a date, a reference. */
  muted?: boolean;
  align?: "left" | "right" | "center";
  /** A CSS width for the column: "120px", "30%". */
  width?: string;
}

/**
 * A filter above the table. Three kinds, which between them cover the list
 * screens in both products: words to search for, values to pick several of,
 * and a period.
 */
export type DataTableFilter<T> =
  | {
      id: string;
      type: "search";
      /** Names the field for a screen reader: "Search charges". */
      label: string;
      placeholder?: string;
      /** Whether a row matches. Defaults to any of the row's own text and numbers, ignoring case and accents. */
      match?: (row: T, query: string) => boolean;
    }
  | {
      id: string;
      type: "options";
      label: string;
      options: ComboboxOption[];
      /** The row's value, or values, for this filter. A row matches if any is picked. */
      value: (row: T) => string | string[] | null | undefined;
    }
  | {
      id: string;
      type: "dateRange";
      label: string;
      /** The row's date for this filter. Rows without one never match a period. */
      value: (row: T) => Date | null | undefined;
      presets?: DateRangePreset[];
    };

/** Per filter id: the search text, the picked values, or the period. */
export type DataTableFilterValues = Record<string, string | string[] | DateRange | undefined>;

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Stable per row — the record's id, never its index. */
  getRowId: (row: T) => string;
  /** What the table is, for a screen reader: "Charges in June". Rendered as a hidden caption. */
  caption: string;
  /** Required: what an empty table says and offers. An EmptyState, usually. Never "No data". */
  empty: React.ReactNode;

  /** Controlled sort. Omit both to let the table sort itself by the columns' `sort` functions. */
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;

  /** Row checkboxes, with a header checkbox for the page. */
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Names each row's checkbox: "Select Café Miradouro, 9,50 €". Required with `selectable`. */
  rowLabel?: (row: T) => string;
  /** The actions for the selected rows, shown above the table while any are selected. */
  bulkActions?: (ids: string[]) => React.ReactNode;

  /** Makes every row activatable — click, Enter, Space. Opens the record. */
  onRowActivate?: (row: T) => void;
  /** The row currently open in a Panel, highlighted. */
  activeRowId?: string;

  /** Rows are on their way. Shows skeleton rows in the real columns. */
  loading?: boolean;
  /** Loading failed. Replaces the rows with the message and a retry. */
  error?: React.ReactNode;
  onRetry?: () => void;

  /**
   * Filters above the table. Uncontrolled, the table filters `rows` itself;
   * with `filterValues`, the product filters (on the server, usually) and the
   * table only shows the controls — the same split as sorting.
   */
  filters?: DataTableFilter<T>[];
  filterValues?: DataTableFilterValues;
  defaultFilterValues?: DataTableFilterValues;
  onFiltersChange?: (values: DataTableFilterValues) => void;
  /**
   * What the table says when the filters, not the data, left it empty.
   * Defaults to "Nothing matches these filters" with a button to clear them.
   */
  emptyFiltered?: React.ReactNode;

  /** Server pagination: the product slices, the table shows the control. */
  pagination?: { page: number; pageCount: number; onPageChange: (page: number) => void; totalItems?: number; pageSize?: number };
  /** Client pagination: the table slices `rows` itself into pages this long. */
  pageSize?: number;

  stickyHeader?: boolean;
  className?: string;
}

function isActive(v: DataTableFilterValues[string]): boolean {
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v && (v.from || v.to));
}

/** A row's own words and numbers, for the default search. */
function rowText(row: unknown): string {
  if (row == null || typeof row !== "object") return String(row ?? "");
  return Object.values(row as Record<string, unknown>)
    .filter((v) => typeof v === "string" || typeof v === "number")
    .join(" ");
}

function compare(a: unknown, b: unknown, collator: Intl.Collator) {
  if (a == null && b == null) return 0;
  // Blanks last, whichever way the column is sorted.
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a), String(b));
}

/**
 * Table with the behaviour every list screen re-implements: sorting,
 * selection with bulk actions, activatable rows, loading, error, empty and
 * pagination. Built on Table, so a screen that needs something this does not
 * do can drop to Table without changing how it looks.
 *
 * It takes columns as data and rows as records. It does not fetch. With
 * `sort` functions and `pageSize` it sorts and pages in the browser; with
 * `onSortChange` and `pagination` the product does both on the server and the
 * table only shows the state.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  empty,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  selectable = false,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  rowLabel,
  bulkActions,
  onRowActivate,
  activeRowId,
  loading = false,
  error,
  onRetry,
  filters,
  filterValues: filterValuesProp,
  defaultFilterValues = {},
  onFiltersChange,
  emptyFiltered,
  pagination,
  pageSize,
  stickyHeader = false,
  className,
}: DataTableProps<T>) {
  const labels = useLabels();
  const locale = useLocale();

  React.useEffect(() => {
    if (selectable && !rowLabel && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[@smarta/ui] <DataTable selectable> needs rowLabel: twenty checkboxes all named by an id are twenty guesses.",
      );
    }
  }, [selectable, rowLabel]);

  // --- Filters ----------------------------------------------------------
  const filtersControlled = filterValuesProp !== undefined;
  const [innerFilters, setInnerFilters] = React.useState<DataTableFilterValues>(defaultFilterValues);
  const filterValues = filtersControlled ? filterValuesProp : innerFilters;
  const commitFilters = (next: DataTableFilterValues) => {
    if (!filtersControlled) setInnerFilters(next);
    onFiltersChange?.(next);
    // A narrower list starts at its first page, not on page 3 of it.
    setInnerPage(1);
  };
  const setFilter = (id: string, value: DataTableFilterValues[string]) => commitFilters({ ...filterValues, [id]: value });
  const anyActive = (filters ?? []).some((f) => isActive(filterValues[f.id]));
  const clearFilters = () => commitFilters({});

  const filtered = React.useMemo(() => {
    // Filtered here only when the table owns the filters.
    if (!filters?.length || filtersControlled) return rows;
    return rows.filter((row) =>
      filters.every((f) => {
        const v = filterValues[f.id];
        if (!isActive(v)) return true;
        if (f.type === "search") {
          const q = v as string;
          return f.match ? f.match(row, q) : fold(rowText(row), locale).includes(fold(q.trim(), locale));
        }
        if (f.type === "options") {
          const picked = v as string[];
          const own = f.value(row);
          const values = Array.isArray(own) ? own : own == null ? [] : [own];
          return values.some((x) => picked.includes(x));
        }
        const period = v as DateRange;
        const d = f.value(row);
        if (!d) return false;
        // Whole days at both ends: a charge at 18:00 on the 30th is in a period ending the 30th.
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const from = period.from ? new Date(period.from.getFullYear(), period.from.getMonth(), period.from.getDate()).getTime() : -Infinity;
        const to = period.to ? new Date(period.to.getFullYear(), period.to.getMonth(), period.to.getDate()).getTime() : Infinity;
        return day >= from && day <= to;
      }),
    );
  }, [rows, filters, filterValues, filtersControlled, locale]);

  // --- Sort -------------------------------------------------------------
  const sortControlled = sortProp !== undefined;
  const [innerSort, setInnerSort] = React.useState<DataTableSort | null>(defaultSort);
  const sort = sortControlled ? sortProp : innerSort;
  const cycle = (columnId: string) => {
    // asc → desc → off. Off matters: the order the product chose is a sort too.
    const next: DataTableSort | null =
      sort?.columnId !== columnId
        ? { columnId, direction: "asc" }
        : sort.direction === "asc"
          ? { columnId, direction: "desc" }
          : null;
    if (!sortControlled) setInnerSort(next);
    onSortChange?.(next);
    // A new order starts at its beginning, not on page 3 of it.
    setInnerPage(1);
  };

  const sorted = React.useMemo(() => {
    const column = columns.find((c) => c.id === sort?.columnId);
    // Sorted here only when the table owns the sort and the column says how.
    if (!sort || sortControlled || !column || typeof column.sort !== "function") return filtered;
    const by = column.sort;
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
    const dir = sort.direction === "asc" ? 1 : -1;
    return filtered
      .map((row, i) => ({ row, i, key: by(row) }))
      .sort((a, b) => {
        if (a.key == null || b.key == null) return compare(a.key, b.key, collator) || a.i - b.i;
        return dir * compare(a.key, b.key, collator) || a.i - b.i;
      })
      .map((x) => x.row);
  }, [filtered, columns, sort, sortControlled, locale]);

  // --- Pages ------------------------------------------------------------
  const [innerPage, setInnerPage] = React.useState(1);
  const clientPages = !pagination && pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const page = Math.min(innerPage, clientPages);
  // Stored, not only clamped for display: otherwise a filter that shrinks the
  // list to one page and is then cleared lands back on page 3.
  React.useEffect(() => {
    if (innerPage > clientPages) setInnerPage(clientPages);
  }, [innerPage, clientPages]);
  const visible = !pagination && pageSize ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  // --- Selection --------------------------------------------------------
  const selControlled = selectedProp !== undefined;
  const [innerSelected, setInnerSelected] = React.useState<string[]>(defaultSelected);
  // Only ids still in `rows` count — after a bulk delete or a filter, a
  // selection of rows nobody can see is a bulk action on records nobody can
  // see. With server pagination `rows` is one page and the product owns the
  // rest, so it is left alone.
  const rowIds = new Set(filtered.map(getRowId));
  const selected = (selControlled ? selectedProp : innerSelected).filter((id) => pagination || rowIds.has(id));
  const setSelected = (ids: string[]) => {
    if (!selControlled) setInnerSelected(ids);
    onSelectedChange?.(ids);
  };
  const pageIds = visible.map(getRowId);
  const onPage = pageIds.filter((id) => selected.includes(id)).length;
  const headerState: boolean | "indeterminate" =
    onPage === 0 ? false : onPage === pageIds.length ? true : "indeterminate";

  const colCount = columns.length + (selectable ? 1 : 0);
  const showRows = !loading && !error && visible.length > 0;

  return (
    <div className={cn("sui:flex sui:flex-col sui:gap-[12px]", className)}>
      {filters && filters.length > 0 && (
        <div className="sui:flex sui:flex-wrap sui:items-end sui:gap-[12px]">
          {filters.map((f) =>
            f.type === "search" ? (
              <SearchInput
                key={f.id}
                label={f.label}
                placeholder={f.placeholder}
                value={(filterValues[f.id] as string | undefined) ?? ""}
                onChange={(e) => setFilter(f.id, e.target.value)}
                onClear={() => setFilter(f.id, "")}
                containerClassName="sui:w-full sui:sm:w-[260px]"
              />
            ) : f.type === "options" ? (
              <MultiSelect
                key={f.id}
                label={f.label}
                options={f.options}
                value={(filterValues[f.id] as string[] | undefined) ?? []}
                onValueChange={(v) => setFilter(f.id, v)}
                placeholder={labels.filterAll}
                className="sui:w-full sui:sm:w-[340px]"
              />
            ) : (
              <DateRangePicker
                key={f.id}
                label={f.label}
                value={(filterValues[f.id] as DateRange | undefined) ?? { from: null, to: null }}
                onValueChange={(v) => setFilter(f.id, v)}
                presets={f.presets}
                className="sui:w-full sui:sm:w-[300px]"
              />
            ),
          )}
          {anyActive && (
            <Button variant="ghost" onClick={clearFilters}>
              {labels.clearFilters}
            </Button>
          )}
          {/* What a sighted user sees as the table shrinking. */}
          <span className="sui:sr-only" aria-live="polite">
            {anyActive && !filtersControlled ? labels.filteredCount(filtered.length, rows.length) : ""}
          </span>
        </div>
      )}

      {selectable && bulkActions && selected.length > 0 && !loading && !error && (
        <div
          role="toolbar"
          aria-label={labels.selectedCount(selected.length)}
          className="sui:flex sui:flex-wrap sui:items-center sui:gap-[12px] sui:rounded-lg sui:border sui:border-border sui:bg-accent-soft sui:px-[16px] sui:py-[8px]"
        >
          <span className="sui:text-sm sui:font-medium sui:text-fg">{labels.selectedCount(selected.length)}</span>
          <div className="sui:flex sui:flex-wrap sui:gap-[8px]">{bulkActions(selected)}</div>
        </div>
      )}

      <Table aria-busy={loading || undefined}>
        <caption className="sui:sr-only">{caption}</caption>
        <THead sticky={stickyHeader}>
          <tr>
            {selectable && (
              <TH className="sui:w-[1%]">
                <Checkbox
                  aria-label={labels.selectAllRows}
                  checked={headerState}
                  disabled={!showRows}
                  onCheckedChange={() =>
                    setSelected(
                      headerState === true
                        ? selected.filter((id) => !pageIds.includes(id))
                        : [...selected, ...pageIds.filter((id) => !selected.includes(id))],
                    )
                  }
                />
              </TH>
            )}
            {columns.map((c) => (
              <TH
                key={c.id}
                align={c.align ?? (c.numeric ? "right" : "left")}
                style={c.width ? { width: c.width } : undefined}
                sort={c.sort ? (sort?.columnId === c.id ? sort.direction : "none") : undefined}
                onSort={c.sort ? () => cycle(c.id) : undefined}
              >
                {c.header}
              </TH>
            ))}
          </tr>
        </THead>
        <TBody>
          {loading &&
            Array.from({ length: Math.min(pageSize ?? pagination?.pageSize ?? 5, 8) }, (_, i) => (
              <tr key={`loading-${i}`} aria-hidden>
                {selectable && <TD />}
                {columns.map((c) => (
                  <TD key={c.id} align={c.align ?? (c.numeric ? "right" : "left")}>
                    <Skeleton width={c.numeric ? "64px" : `${50 + ((i * 17 + c.id.length * 11) % 40)}%`} className={c.numeric ? "sui:ml-auto" : undefined} />
                  </TD>
                ))}
              </tr>
            ))}

          {!loading && error && (
            <tr>
              <td colSpan={colCount} className="sui:p-[8px]">
                <EmptyState
                  variant="error"
                  size="sm"
                  title={labels.couldNotLoad}
                  description={error}
                  action={onRetry ? <Button onClick={onRetry}>{labels.tryAgain}</Button> : undefined}
                />
              </td>
            </tr>
          )}

          {!loading && !error && visible.length === 0 && (
            <tr>
              <td colSpan={colCount} className="sui:p-[8px]">
                {/* Emptied by the filters, not the data: say so, and offer the way back. */}
                {anyActive
                  ? (emptyFiltered ?? (
                      <EmptyState
                        variant="no-results"
                        size="sm"
                        title={labels.noFilterMatches}
                        description={labels.noFilterMatchesHint}
                        action={<Button onClick={clearFilters}>{labels.clearFilters}</Button>}
                      />
                    ))
                  : empty}
              </td>
            </tr>
          )}

          {showRows &&
            visible.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              return (
                <TR
                  key={id}
                  // Only the checkbox selects. The open row is tinted and
                  // aria-current, not announced as selected.
                  selected={isSelected}
                  className={activeRowId === id && !isSelected ? "sui:bg-accent-soft" : undefined}
                  aria-current={activeRowId === id ? "true" : undefined}
                  onActivate={onRowActivate ? () => onRowActivate(row) : undefined}
                >
                  {selectable && (
                    // A near miss beside the checkbox must not open the row.
                    <TD className="sui:w-[1%]" onClick={(e) => e.preventDefault()}>
                      <Checkbox
                        aria-label={labels.selectRow(rowLabel ? rowLabel(row) : id)}
                        checked={isSelected}
                        onCheckedChange={(v) =>
                          setSelected(v === true ? [...selected, id] : selected.filter((s) => s !== id))
                        }
                      />
                    </TD>
                  )}
                  {columns.map((c) => (
                    <TD key={c.id} numeric={c.numeric} muted={c.muted} align={c.align}>
                      {c.cell(row)}
                    </TD>
                  ))}
                </TR>
              );
            })}
        </TBody>
      </Table>

      {loading || error ? null : pagination ? (
        pagination.pageCount > 1 && <Pagination {...pagination} aria-label={caption} />
      ) : pageSize && clientPages > 1 ? (
        <Pagination
          page={page}
          pageCount={clientPages}
          onPageChange={setInnerPage}
          totalItems={sorted.length}
          pageSize={pageSize}
          aria-label={caption}
        />
      ) : null}
    </div>
  );
}
