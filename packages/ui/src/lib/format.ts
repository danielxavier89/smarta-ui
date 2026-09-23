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
