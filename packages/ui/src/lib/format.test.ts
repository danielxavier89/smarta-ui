import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatSignedCurrency,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDate,
  formatMonth,
  formatRelativeDay,
} from "./format";

/**
 * The separators are the whole point, so they are what is asserted. Intl uses
 * a narrow no-break space in several of these, which is invisible in a diff
 * and is exactly the kind of thing a loose assertion lets through — so the
 * expectations normalise whitespace rather than pretending it is a plain space.
 */
const norm = (s: string) => s.replace(/[\u00a0\u202f\u2009]/g, " ");

describe("formatCurrency", () => {
  it("puts the symbol after the amount in German, with a comma decimal", () => {
    expect(norm(formatCurrency(1234.56, "de-DE"))).toBe("1.234,56 €");
  });

  /**
   * Portuguese sets minimumGroupingDigits to 2, so a four-digit amount is not
   * grouped at all — 1234,56 €, not 1 234,56 €. Worth pinning both, because
   * "the separator is a space" is the half of the rule people remember.
   */
  it("groups with a space in Portuguese, and only past four digits", () => {
    expect(norm(formatCurrency(1234.56, "pt-PT"))).toBe("1234,56 €");
    expect(norm(formatCurrency(12345.67, "pt-PT"))).toBe("12 345,67 €");
  });

  it("puts the symbol before the amount in English", () => {
    expect(norm(formatCurrency(1234.56, "en-GB"))).toBe("€1,234.56");
  });

  it("keeps two decimals on a whole amount by default, so a column lines up", () => {
    expect(norm(formatCurrency(86, "de-DE"))).toBe("86,00 €");
  });

  it("drops them when asked", () => {
    expect(norm(formatCurrency(86, "de-DE", { compactWhole: true }))).toBe("86 €");
  });

  it("does not drop them from an amount that has them", () => {
    expect(norm(formatCurrency(86.4, "de-DE", { compactWhole: true }))).toBe("86,40 €");
  });

  it("takes another currency", () => {
    expect(norm(formatCurrency(540, "en-GB", { currency: "USD" }))).toBe("US$540.00");
  });
});

describe("formatSignedCurrency", () => {
  it("marks a positive difference", () => {
    expect(norm(formatSignedCurrency(12.1, "de-DE"))).toBe("+12,10 €");
  });

  it("uses a real minus sign, not a hyphen", () => {
    const out = formatSignedCurrency(-12.1, "de-DE");
    expect(out.startsWith("−")).toBe(true);
    expect(out.includes("-")).toBe(false);
    expect(norm(out)).toBe("−12,10 €");
  });

  it("leaves zero unsigned", () => {
    expect(norm(formatSignedCurrency(0, "de-DE"))).toBe("0,00 €");
  });
});

describe("formatNumber and formatPercent", () => {
  it("groups thousands per locale", () => {
    expect(norm(formatNumber(1234567, "de-DE"))).toBe("1.234.567");
    expect(norm(formatNumber(1234567, "en-GB"))).toBe("1,234,567");
  });

  it("reads a VAT rate as it is written, not as a fraction", () => {
    expect(norm(formatPercent(23, "de-DE"))).toBe("23 %");
    expect(norm(formatPercent(23, "en-GB"))).toBe("23%");
  });

  it("keeps a fractional rate", () => {
    expect(norm(formatPercent(19.5, "de-DE"))).toBe("19,5 %");
  });
});

describe("formatFileSize", () => {
  it("shows bytes whole", () => {
    expect(norm(formatFileSize(512, "de-DE"))).toBe("512 B");
  });

  it("shows one decimal below ten units", () => {
    expect(norm(formatFileSize(1536, "de-DE"))).toBe("1,5 KB");
  });

  it("steps up to MB", () => {
    expect(norm(formatFileSize(5 * 1024 * 1024, "en-GB"))).toBe("5.0 MB");
  });
});

describe("formatDate", () => {
  it("writes the month out, so 03/06 cannot be misread", () => {
    expect(norm(formatDate("2026-06-03", "de-DE"))).toBe("3. Juni 2026");
    expect(norm(formatDate("2026-06-03", "en-GB"))).toBe("3 June 2026");
  });

  it("has a short form for a dense column", () => {
    expect(norm(formatDate("2026-06-03", "en-GB", "short"))).toBe("3 Jun");
  });

  it("has a numeric form when the column is too narrow for anything else", () => {
    expect(norm(formatDate("2026-06-03", "de-DE", "numeric"))).toBe("03.06.2026");
  });

  it("names a filing period", () => {
    expect(norm(formatMonth("2026-06-01", "de-DE"))).toBe("Juni 2026");
  });
});

describe("formatRelativeDay", () => {
  /**
   * Local time throughout, constructed field by field rather than parsed from
   * an ISO string with a Z on it.
   *
   * "Yesterday" means the user's yesterday, so the function compares local
   * calendar days — which makes a test written in UTC instants pass or fail
   * depending on the machine's timezone. It did: 23:00Z on the 18th is already
   * the 19th in Berlin. These dates are unambiguous everywhere.
   */
  const at = (day: number, hour: number) => new Date(2026, 5, day, hour, 0, 0);
  const now = at(18, 9);

  it("says today, yesterday and tomorrow by name", () => {
    expect(formatRelativeDay(at(18, 23), "en-GB", now)).toBe("today");
    expect(formatRelativeDay(at(17, 1), "en-GB", now)).toBe("yesterday");
    expect(formatRelativeDay(at(19, 22), "en-GB", now)).toBe("tomorrow");
  });

  /**
   * The reason it compares calendar days rather than elapsed hours: these two
   * are two hours apart and are not the same day.
   */
  it("counts calendar days, not elapsed hours", () => {
    expect(formatRelativeDay(at(17, 23), "en-GB", at(18, 1))).toBe("yesterday");
  });

  it("counts further out", () => {
    expect(formatRelativeDay(at(21, 9), "en-GB", now)).toBe("in 3 days");
  });

  it("says it in German too", () => {
    expect(formatRelativeDay(at(17, 9), "de-DE", now)).toBe("gestern");
  });
});
