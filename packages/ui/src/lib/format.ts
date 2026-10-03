/**
 * Dates, numbers and money, formatted the same way in both products.
 *
 * The house rule has not changed: a component never formats a value. It
 * receives a string and renders it, because a component that formats has to
 * know the locale, the currency and the user's preferences, and that knowledge
 * belongs to the product. What was missing was the other half — the products
 * had nowhere to get a consistent answer from, so each screen wrote its own
 * `Intl.NumberFormat` call and they disagreed. The webapp recipe already
 * carried a comment saying two of these in one codebase is how a minus sign
 * ends up on the wrong side of a currency symbol.
 *
 * So these are helpers a product calls, not something a component does. They
 * are exported from @smarta/ui because there is nowhere better to put them and
 * every screen needs the same ones.
 *
 * Locales the products ship in:
 *   de-DE   the backoffice, and the German webapp        1.234,56 €
 *   pt-PT   the Portuguese webapp                        1 234,56 €
 *   en-GB   the English webapp                           €1,234.56
 *
 * Note how much moves between those three: the decimal separator, the grouping
 * separator, whether there is a space before the symbol, and which side the
 * symbol is on. None of that is worth anyone reimplementing, and all of it is
 * what Intl already knows.
 */

/** The locales the smarta products ship in. A string is accepted for the rest. */
export type SmartaLocale = "de-DE" | "pt-PT" | "en-GB" | (string & {});

/**
 * Formatters are expensive to construct and are built per render otherwise.
 * One cache, keyed by everything that changes the output.
 */
const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

function numberFormat(locale: SmartaLocale, options: Intl.NumberFormatOptions) {
  const key = `n:${locale}:${JSON.stringify(options)}`;
  let f = cache.get(key) as Intl.NumberFormat | undefined;
  if (!f) {
    f = new Intl.NumberFormat(locale, options);
    cache.set(key, f);
  }
  return f;
}

function dateFormat(locale: SmartaLocale, options: Intl.DateTimeFormatOptions) {
  const key = `d:${locale}:${JSON.stringify(options)}`;
  let f = cache.get(key) as Intl.DateTimeFormat | undefined;
  if (!f) {
    f = new Intl.DateTimeFormat(locale, options);
    cache.set(key, f);
  }
  return f;
}

/* ------------------------------------------------------------------ money */

export interface CurrencyOptions {
  /** ISO 4217. The products are EUR, but a receipt can arrive in anything. */
  currency?: string;
  /**
   * Drop the decimals when the amount is whole. For a total in a heading,
   * not for a column — a column of money keeps its decimals so the figures
   * line up under each other.
   */
  compactWhole?: boolean;
}

/**
 * Money, in the product's locale.
 *
 *   formatCurrency(1234.56, "de-DE")  ->  "1.234,56 €"
 *   formatCurrency(1234.56, "pt-PT")  ->  "1 234,56 €"
 *   formatCurrency(1234.56, "en-GB")  ->  "€1,234.56"
 */
export function formatCurrency(
  amount: number,
  locale: SmartaLocale,
  { currency = "EUR", compactWhole = false }: CurrencyOptions = {},
): string {
  const whole = compactWhole && Number.isInteger(amount);
  return numberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

/**
 * A signed amount, where the sign is the point — a difference, an adjustment,
 * a correction. Always carries + or −, because "0,00 €" and "+0,00 €" answer
 * different questions.
 *
 * The minus is U+2212, not a hyphen: at 13px a hyphen in a column of figures
 * is barely visible, and this is the one place the distinction is load-bearing.
 */
export function formatSignedCurrency(
  amount: number,
  locale: SmartaLocale,
  options: CurrencyOptions = {},
): string {
  const formatted = formatCurrency(Math.abs(amount), locale, options);
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `−${formatted}`;
  return formatted;
}

/* ----------------------------------------------------------------- number */

export function formatNumber(
  value: number,
  locale: SmartaLocale,
  options: Intl.NumberFormatOptions = {},
): string {
  return numberFormat(locale, options).format(value);
}

/**
 * A percentage. Takes the number as it reads, not as a fraction: `formatPercent(23)`
 * is "23 %", because a VAT rate is written 23 everywhere in both products and
 * converting to 0.23 at every call site is how one of them ends up 100x wrong.
 */
export function formatPercent(
  value: number,
  locale: SmartaLocale,
  { maximumFractionDigits = 2 }: { maximumFractionDigits?: number } = {},
): string {
  return numberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
  }).format(value / 100);
}

/** A file size, for an upload. Binary units, because that is what an OS shows. */
export function formatFileSize(bytes: number, locale: SmartaLocale): string {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let unit = 0;
  while (n >= 1024 && unit < units.length - 1) {
    n /= 1024;
    unit += 1;
  }
  const digits = unit === 0 ? 0 : n < 10 ? 1 : 0;
  return `${numberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n)} ${units[unit]}`;
}

/* ------------------------------------------------------------------- date */

export type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * A date, in the product's locale.
 *
 *   formatDate("2026-06-03", "de-DE")  ->  "3. Juni 2026"
 *   formatDate("2026-06-03", "en-GB")  ->  "3 June 2026"
 *
 * `long` by default, and deliberately: both products deal in filing periods
 * and bank statements, where 03/06/2026 and 06/03/2026 are both real dates and
 * a reader cannot tell which convention they are looking at. A written month
 * cannot be misread.
 */
export function formatDate(
  value: DateInput,
  locale: SmartaLocale,
  style: "long" | "short" | "numeric" = "long",
): string {
  const options: Intl.DateTimeFormatOptions =
    style === "numeric"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : style === "short"
        ? { day: "numeric", month: "short" }
        : { day: "numeric", month: "long", year: "numeric" };
  return dateFormat(locale, options).format(toDate(value));
}

/** A date and a time, for an audit trail. */
export function formatDateTime(value: DateInput, locale: SmartaLocale): string {
  return dateFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(toDate(value));
}

/**
 * A filing period: the month a return covers.
 *
 *   formatMonth("2026-06-01", "de-DE")  ->  "Juni 2026"
 */
export function formatMonth(value: DateInput, locale: SmartaLocale): string {
  return dateFormat(locale, { month: "long", year: "numeric" }).format(toDate(value));
}

/**
 * "yesterday", "in 3 days" — for a deadline or a chase, where the distance is
 * the information and the date is not.
 *
 * Never for anything auditable. A receipt is dated, not "2 months ago": the
 * date is evidence and the phrase is a summary of it.
 */
export function formatRelativeDay(
  value: DateInput,
  locale: SmartaLocale,
  now: DateInput = new Date(),
): string {
  const a = toDate(value);
  const b = toDate(now);
  // Compare calendar days, not elapsed hours: 23:00 and 01:00 are "yesterday"
  // and "today" two hours apart, and elapsed time says neither.
  const days = Math.round(
    (Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
      Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) /
      86_400_000,
  );
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(days, "day");
}

/* ---------------------------------------------------------------- parsing */

/**
 * The decimal and grouping characters of a locale, read from Intl rather than
 * hardcoded: de-DE writes 1.234,5, pt-PT 1 234,5 with a narrow no-break space,
 * en-GB 1,234.5.
 */
export function numberSeparators(locale: SmartaLocale): { decimal: string; group: string } {
  const parts = numberFormat(locale, { useGrouping: true }).formatToParts(12345.6);
  return {
    decimal: parts.find((p) => p.type === "decimal")?.value ?? ".",
    group: parts.find((p) => p.type === "group")?.value ?? ",",
  };
}

/**
 * What someone typed, as a number — in their locale. "1.234,56" is
 * one-thousand-and-something in German and an error in English.
 *
 * Returns null for an empty string and NaN for something that is not a number,
 * so a caller can tell "nothing yet" from "not valid".
 *
 * Grouping is accepted only where it really groups: in threes, with one kind
 * of mark. Anything looser turns a slip into a silent factor of a hundred —
 * "12.50" in German is not 1250, it is a mistake, and so is "1,5" in English.
 * Any kind of space groups in every locale, because people type a plain space
 * where Portuguese prints a narrow one; and where the decimal mark is a comma,
 * a dot groups too, because that is how Portuguese is written by hand.
 */
export function parseNumber(text: string, locale: SmartaLocale): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return null;
  const { decimal, group } = numberSeparators(locale);
  const t = trimmed.replace(/[\s   ]+/g, " ").replace(/^[−-]\s*/, "-");
  const negative = t.startsWith("-");
  const body = negative ? t.slice(1) : t;

  const at = body.indexOf(decimal);
  if (at !== body.lastIndexOf(decimal)) return Number.NaN;
  const whole = at < 0 ? body : body.slice(0, at);
  const fraction = at < 0 ? "" : body.slice(at + 1);
  if (at >= 0 && !/^\d+$/.test(fraction)) return Number.NaN;

  const marks = [" ", ...(group.trim() ? [group] : []), ...(decimal === "," ? ["."] : [])];
  const escape = (m: string) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const grouped = marks.some((m) => new RegExp(`^\\d{1,3}(${escape(m)}\\d{3})+$`).test(whole));
  const plain = /^\d+$/.test(whole) || (whole === "" && fraction !== "");
  if (!plain && !grouped) return Number.NaN;

  const n = Number(`${whole.replace(/\D/g, "") || "0"}.${fraction || "0"}`);
  return negative ? -n : n;
}

/**
 * The order a locale writes a numeric date in, and the separator between the
 * parts: day-month-year with "." in German, "/" in English and Portuguese.
 */
export function dateOrder(locale: SmartaLocale): {
  order: Array<"day" | "month" | "year">;
  separator: string;
} {
  const parts = dateFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(
    new Date(2026, 10, 25),
  );
  const order = parts
    .filter((p) => p.type === "day" || p.type === "month" || p.type === "year")
    .map((p) => p.type as "day" | "month" | "year");
  const separator = parts.find((p) => p.type === "literal")?.value ?? "/";
  return { order, separator };
}

/**
 * A typed date, in the locale's order: "25.11.2026" in German, "25/11/2026" in
 * English. Any non-digit separates the parts, so "25-11-2026" and "25 11 2026"
 * work too, and so do the digits alone — "25112026", "251126". A year is two
 * digits (read as 20xx) or four; anything else is a slip, not the year 202.
 *
 * Returns null for an empty string and an Invalid Date for anything that is not
 * a real date — 31.02.2026 is rejected rather than rolled into March.
 */
export function parseDate(text: string, locale: SmartaLocale): Date | null {
  const trimmed = text.trim();
  if (trimmed === "") return null;
  const { order } = dateOrder(locale);
  let pieces = trimmed.split(/\D+/).filter(Boolean);
  // Digits only — 25112026 or 251126 — because a phone's number pad has no
  // dot or slash to type between them.
  if (pieces.length === 1 && (pieces[0].length === 8 || pieces[0].length === 6)) {
    const digits = pieces[0];
    const widths = { day: 2, month: 2, year: digits.length - 4 };
    let from = 0;
    pieces = order.map((k) => digits.slice(from, (from += widths[k])));
  }
  if (pieces.length !== 3) return new Date(Number.NaN);
  const raw = (k: "day" | "month" | "year") => pieces[order.indexOf(k)];
  // Two digits or four: "25.11.202" is a digit short, not the year 202.
  if (raw("year").length !== 2 && raw("year").length !== 4) return new Date(Number.NaN);
  let year = Number(raw("year"));
  if (raw("year").length === 2) year += 2000;
  const month = Number(raw("month"));
  const day = Number(raw("day"));
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return new Date(Number.NaN);
  }
  return d;
}

/** True for a real Date; false for null, undefined and an Invalid Date. */
export function isValidDate(d: Date | null | undefined): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}
