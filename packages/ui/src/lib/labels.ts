/**
 * The words this library says on its own behalf.
 *
 * Not the product's copy. Everything a screen actually says — a button that
 * names an outcome, an empty state that explains a situation — is passed in as
 * a prop and always was. What is collected here is the residue: the handful of
 * strings a component has to produce without being asked, because the markup
 * would be wrong without them. A close button needs an accessible name whether
 * or not the caller thought about it; a spinner needs to announce itself; a
 * pagination nav needs a landmark label.
 *
 * Those were hardcoded English. The backoffice is German and the webapp is
 * German and English, so "Close" and "Previous page" reached German screens
 * through the accessibility tree, where they are least visible and most
 * harmful — a screen-reader user got a control announced in the wrong language
 * with no way for the product to fix it.
 *
 * The library does not depend on i18next or any other framework. A product
 * passes a partial object to ThemeProvider, English fills the rest:
 *
 *     <ThemeProvider product="backoffice" labels={{ close: "Schließen" }}>
 *
 * Interpolated strings are functions, not templates with placeholders, because
 * word order is not universal — `${n} of ${total}` is "von" in the middle in
 * German and somewhere else again in Portuguese, and a function lets the
 * product write the whole sentence.
 */

export interface SmartaLabels {
  /** Accessible name for a close control on a Dialog or Panel. */
  close: string;
  /** Accessible name for a dismiss control on a Callout or Toast. */
  dismiss: string;
  /** The default cancel action in a Dialog. */
  cancel: string;
  /** Announced by Spinner and by a loading Skeleton list. */
  loading: string;

  /** Accessible name and placeholder for a SearchInput given neither. */
  search: string;
  /** Accessible name for SearchInput's clear button. */
  clearSearch: string;

  /** Card's stretched affordance when the caller names no label. */
  cardSeeMore: string;
  cardOpen: string;

  /** Dropzone's own instruction, and the text of its browse link. */
  dropFiles: string;
  chooseFiles: string;

  /** Follows a Label whose field is not required. */
  optional: string;

  /** Landmark name for Pagination's <nav>. */
  pagination: string;
  /** Accessible name for a numbered page button. */
  page: (n: number) => string;
  previousPage: string;
  nextPage: string;
  /** "1–20 of 53" — the whole sentence, so word order is the product's. */
  pageRange: (first: number, last: number, total: number) => string;
  /** "53 in total", when the range is not known. */
  totalItems: (total: number) => string;

  /**
   * Names a Table's scroll container while — and only while — the table is
   * wider than its card, which is when a keyboard user needs to reach it to
   * scroll. A table's own aria-label is used instead when it has one.
   */
  scrollableTable: string;

  /* ---- InputNumber, CurrencyInput ---------------------------------------- */
  /** The stepper buttons. */
  increase: string;
  decrease: string;
  /** Under a number field whose text is not a number. Gets an example in the locale's format. */
  numberNotRecognised: (example: string) => string;

  /* ---- DatePicker, DateRangePicker ---------------------------------------- */
  /** The button that opens the calendar. */
  chooseDate: string;
  /** The trigger of a range picker with nothing chosen yet. */
  chooseDateRange: string;
  previousMonth: string;
  nextMonth: string;
  /** Names the calendar's row of month buttons, a <nav>: unnamed, it was announced as just "navigation". */
  calendarNavigation: string;
  /** Appended to a calendar day's name when it is today / chosen. */
  today: string;
  selected: string;
  /** Clears a field's value. */
  clearValue: string;
  /**
   * Shown under a DatePicker when what was typed is not a date, with an
   * example written the locale's way. Says what to do, not "Invalid date".
   */
  dateNotRecognised: (example: string) => string;
  /** A typed date the field excludes — a weekend, a closed period. */
  dateUnavailable: string;
  /** Shown when a typed date is outside min/max. Receives the bound, formatted. */
  dateTooEarly: (min: string) => string;
  dateTooLate: (max: string) => string;

  /* ---- Combobox, MultiSelect ---------------------------------------------- */
  /** The toggle button beside the search field. */
  showOptions: string;
  /** Shown in the list when the search matches nothing. */
  noMatches: string;
  /** Shown in the list while results are loading. */
  loadingOptions: string;
  /** A selected item's remove button in a MultiSelect. */
  removeItem: (label: string) => string;
  /** Announced count of selected items. */
  selectedCount: (n: number) => string;

  /* ---- Upload ------------------------------------------------------------- */
  uploadQueued: string;
  uploading: string;
  uploaded: string;
  uploadFailed: string;
  retryUpload: (fileName: string) => string;
  removeFile: (fileName: string) => string;
  /** Announced when a file's status changes. */
  uploadStatusChanged: (fileName: string, status: string) => string;

  /* ---- FilePreview -------------------------------------------------------- */
  openInNewTab: string;
  download: string;
  zoomIn: string;
  fitToFrame: string;
  previewUnavailable: string;

  /* ---- DataTable ---------------------------------------------------------- */
  selectAllRows: string;
  selectRow: (rowLabel: string) => string;
  couldNotLoad: string;
  tryAgain: string;
  /** The placeholder of a pick-several filter with nothing picked. */
  filterAll: string;
  clearFilters: string;
  /** The table's own empty state when the filters, not the data, emptied it. */
  noFilterMatches: string;
  noFilterMatchesHint: string;
  /** Announced when the filters change what is shown. */
  filteredCount: (shown: number, total: number) => string;

  /* ---- PageHeader, AppShell ----------------------------------------------- */
  breadcrumb: string;
  skipToContent: string;
  mainNavigation: string;
  openNavigation: string;
  closeNavigation: string;

  /**
   * Accessible name for the info control beside a KeyValue row.
   * `label` is the row's key when it is a string.
   */
  aboutValue: (label?: string) => string;
}

/**
 * English, and only as a fallback. A product that ships in another language
 * overrides what it needs; anything it misses stays legible rather than blank.
 */
export const defaultLabels: SmartaLabels = {
  close: "Close",
  dismiss: "Dismiss",
  cancel: "Cancel",
  loading: "Loading",

  search: "Search",
  clearSearch: "Clear search",

  cardSeeMore: "See more",
  cardOpen: "Open",

  dropFiles: "Drop files here",
  chooseFiles: "or choose them",

  optional: "optional",

  pagination: "Pagination",
  page: (n) => `Page ${n}`,
  previousPage: "Previous page",
  nextPage: "Next page",
  pageRange: (first, last, total) => `${first}–${last} of ${total}`,
  totalItems: (total) => `${total} in total`,

  scrollableTable: "Table, scrolls sideways",

  increase: "Increase",
  numberNotRecognised: (example) => `Write the number like ${example}.`,
  decrease: "Decrease",

  chooseDate: "Choose a date",
  chooseDateRange: "Choose dates",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  calendarNavigation: "Change month",
  today: "today",
  selected: "selected",
  clearValue: "Clear",
  dateNotRecognised: (example) => `Write the date like ${example}.`,
  dateUnavailable: "That date can't be chosen here.",
  dateTooEarly: (min) => `Choose ${min} or later.`,
  dateTooLate: (max) => `Choose ${max} or earlier.`,

  showOptions: "Show options",
  noMatches: "Nothing matches",
  loadingOptions: "Loading",
  removeItem: (label) => `Remove ${label}`,
  selectedCount: (n) => `${n} selected`,

  uploadQueued: "Waiting",
  uploading: "Uploading",
  uploaded: "Uploaded",
  uploadFailed: "Failed",
  retryUpload: (name) => `Try ${name} again`,
  removeFile: (name) => `Remove ${name}`,
  uploadStatusChanged: (name, status) => `${name}: ${status}`,

  openInNewTab: "Open in a new tab",
  download: "Download",
  zoomIn: "Actual size",
  fitToFrame: "Fit to frame",
  previewUnavailable: "This file can't be previewed here.",

  selectAllRows: "Select all rows on this page",
  selectRow: (label) => `Select ${label}`,
  couldNotLoad: "This could not be loaded.",
  tryAgain: "Try again",
  filterAll: "All",
  clearFilters: "Clear the filters",
  noFilterMatches: "Nothing matches these filters",
  noFilterMatchesHint: "Change a filter, or clear them to see everything.",
  filteredCount: (shown, total) => `${shown} of ${total} shown`,

  breadcrumb: "Breadcrumb",
  skipToContent: "Skip to content",
  mainNavigation: "Main",
  openNavigation: "Open navigation",
  closeNavigation: "Close navigation",

  // Lowercased because that is English sentence style; German overrides this
  // with a function that does not, since German nouns keep their capital.
  aboutValue: (label) =>
    label ? `About ${label.toLowerCase()}` : "More about this value",
};

/** What a product passes: some of them, not all of them. */
export type PartialLabels = Partial<SmartaLabels>;

export function mergeLabels(overrides?: PartialLabels): SmartaLabels {
  return overrides ? { ...defaultLabels, ...overrides } : defaultLabels;
}
