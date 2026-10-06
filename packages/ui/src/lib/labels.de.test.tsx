import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../components/ThemeProvider";
import { Pagination } from "../components/Pagination";
import { SearchInput } from "../components/SearchInput";
import { defaultLabels } from "./labels";
import { labelsDe } from "./labels.de";

describe("labelsDe", () => {
  it("has every label the library has, and no extras", () => {
    expect(Object.keys(labelsDe).sort()).toEqual(Object.keys(defaultLabels).sort());
  });

  it("translates every one of them", () => {
    // Values that are rightly the same in both languages.
    const same = new Set(["optional", "uploadStatusChanged"]);
    for (const key of Object.keys(defaultLabels) as Array<keyof typeof defaultLabels>) {
      if (same.has(key)) continue;
      const en = defaultLabels[key];
      const de = labelsDe[key];
      const sample = (v: unknown) =>
        typeof v === "function" ? (v as (...a: unknown[]) => string)("X", "Y", "Z") : v;
      expect(sample(de), `${key} is still English`).not.toEqual(sample(en));
    }
  });

  it("reaches the components through the provider", () => {
    render(
      <ThemeProvider labels={labelsDe} locale="de-DE">
        <SearchInput value="Weidmann" onChange={() => {}} onClear={() => {}} />
        <Pagination page={2} pageCount={3} totalItems={53} pageSize={20} onPageChange={() => {}} />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button", { name: "Suche löschen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vorherige Seite" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Seitennavigation" })).toBeInTheDocument();
    expect(screen.getByText("21–40 von 53")).toBeInTheDocument();
  });
});
