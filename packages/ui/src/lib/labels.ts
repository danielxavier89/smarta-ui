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
