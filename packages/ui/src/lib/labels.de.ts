import type { SmartaLabels } from "./labels";

/**
 * Every word the library says for itself, in German — for the backoffice, and
 * for the webapp in German:
 *
 *     <ThemeProvider labels={labelsDe} locale="de-DE">
 *
 * Complete, not partial: it is typed as SmartaLabels, so a label added to the
 * library without a German one here fails the typecheck instead of quietly
 * reading English to a German screen-reader user.
 *
 * Instructions use the infinitive ("Datum im Format … eingeben"), the usual
 * register for German interfaces, which also stays clear of choosing du or
 * Sie on the product's behalf. Override any entry like any other label:
 *
 *     labels={{ ...labelsDe, close: "Zumachen" }}
 */
export const labelsDe: SmartaLabels = {
  close: "Schließen",
  dismiss: "Ausblenden",
  cancel: "Abbrechen",
  loading: "Wird geladen",

  search: "Suchen",
  clearSearch: "Suche löschen",

  cardSeeMore: "Mehr anzeigen",
  cardOpen: "Öffnen",

  dropFiles: "Dateien hierher ziehen",
  chooseFiles: "oder auswählen",

  optional: "optional",

  pagination: "Seitennavigation",
  page: (n) => `Seite ${n}`,
  previousPage: "Vorherige Seite",
  nextPage: "Nächste Seite",
  pageRange: (first, last, total) => `${first}–${last} von ${total}`,
  totalItems: (total) => `${total} insgesamt`,

  scrollableTable: "Tabelle, seitlich scrollbar",

  increase: "Erhöhen",
  numberNotRecognised: (example) => `Zahl im Format ${example} eingeben.`,
  decrease: "Verringern",

  chooseDate: "Datum auswählen",
  chooseDateRange: "Zeitraum auswählen",
  previousMonth: "Vorheriger Monat",
  nextMonth: "Nächster Monat",
  calendarNavigation: "Monat wechseln",
  today: "heute",
  selected: "ausgewählt",
  clearValue: "Auswahl entfernen",
  dateNotRecognised: (example) => `Datum im Format ${example} eingeben.`,
  dateUnavailable: "Dieses Datum ist hier nicht wählbar.",
  dateTooEarly: (min) => `Ein Datum ab ${min} wählen.`,
  dateTooLate: (max) => `Ein Datum bis ${max} wählen.`,

  showOptions: "Optionen anzeigen",
  noMatches: "Keine Treffer",
  loadingOptions: "Wird geladen",
  removeItem: (label) => `${label} entfernen`,
  selectedCount: (n) => `${n} ausgewählt`,

  uploadQueued: "Wartet",
  uploading: "Wird hochgeladen",
  uploaded: "Hochgeladen",
  uploadFailed: "Fehlgeschlagen",
  retryUpload: (name) => `${name} erneut hochladen`,
  removeFile: (name) => `${name} entfernen`,
  uploadStatusChanged: (name, status) => `${name}: ${status}`,

  openInNewTab: "In neuem Tab öffnen",
  download: "Herunterladen",
  zoomIn: "Originalgröße",
  fitToFrame: "An Rahmen anpassen",
  previewUnavailable: "Für diese Datei ist hier keine Vorschau möglich.",

  selectAllRows: "Alle Zeilen dieser Seite auswählen",
  selectRow: (label) => `${label} auswählen`,
  couldNotLoad: "Das konnte nicht geladen werden.",
  tryAgain: "Erneut versuchen",
  filterAll: "Alle",
  clearFilters: "Filter zurücksetzen",
  noFilterMatches: "Nichts passt zu diesen Filtern",
  noFilterMatchesHint: "Einen Filter ändern oder alle zurücksetzen, um alles zu sehen.",
  filteredCount: (shown, total) => `${shown} von ${total} angezeigt`,

  breadcrumb: "Pfadnavigation",
  skipToContent: "Zum Inhalt springen",
  mainNavigation: "Hauptnavigation",
  openNavigation: "Navigation öffnen",
  closeNavigation: "Navigation schließen",

  // Not lowercased, unlike the English: German nouns keep their capital.
  aboutValue: (label) => (label ? `Mehr zu ${label}` : "Mehr zu diesem Wert"),
};
