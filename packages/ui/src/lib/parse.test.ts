import { describe, it, expect } from "vitest";
import { parseNumber, parseDate, isValidDate } from "./format";

/** Found in review: loose grouping turned slips into silent factors of a hundred. */
describe("parseNumber refuses grouping that does not group", () => {
  it("rejects groups that are not threes", () => {
    expect(parseNumber("12.50", "de-DE")).toBeNaN();
    expect(parseNumber("1.2.3", "de-DE")).toBeNaN();
    expect(parseNumber("1,5", "en-GB")).toBeNaN();
    expect(parseNumber("1,23,456", "en-GB")).toBeNaN();
    expect(parseNumber("1,2,3", "de-DE")).toBeNaN();
  });

  it("still reads real grouping, signs and bare fractions", () => {
    expect(parseNumber("1.234.567,8", "de-DE")).toBe(1234567.8);
    expect(parseNumber("−1.234,5", "de-DE")).toBe(-1234.5);
    expect(parseNumber("- 12", "en-GB")).toBe(-12);
    expect(parseNumber(",5", "de-DE")).toBe(0.5);
    expect(parseNumber("1234,5", "de-DE")).toBe(1234.5);
  });

  it("lets a dot group in Portuguese, where the decimal mark is a comma", () => {
    expect(parseNumber("1.234,56", "pt-PT")).toBe(1234.56);
    expect(parseNumber("1 234,56", "pt-PT")).toBe(1234.56);
  });
});

describe("parseDate, the edges", () => {
  it("refuses a three-digit year as a slip", () => {
    expect(isValidDate(parseDate("25.11.202", "de-DE"))).toBe(false);
  });

  it("reads digits alone, for a phone's number pad", () => {
    expect(parseDate("25112026", "de-DE")?.getTime()).toBe(new Date(2026, 10, 25).getTime());
    expect(parseDate("251126", "en-GB")?.getTime()).toBe(new Date(2026, 10, 25).getTime());
    expect(isValidDate(parseDate("3112026", "de-DE"))).toBe(false);
  });
});
