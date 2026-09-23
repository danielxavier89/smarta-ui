import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../components/ThemeProvider";
import { Panel } from "../components/Panel";
import { Pagination } from "../components/Pagination";
import { SearchInput } from "../components/SearchInput";
import { Spinner } from "../components/Spinner";
import { Label } from "../components/Label";
import { defaultLabels, type PartialLabels } from "../lib/labels";

/**
 * The point of the labels layer is that a German product can change every word
 * the library says for itself. These assert the German, not the English — a
 * test that only checks the fallback would have passed before the change too.
 */
const de: PartialLabels = {
  close: "Schließen",
  search: "Suchen",
  clearSearch: "Suche zurücksetzen",
  loading: "Wird geladen",
  optional: "optional",
  pagination: "Seitennummerierung",
  previousPage: "Vorherige Seite",
  nextPage: "Nächste Seite",
  pageRange: (first, last, total) => `${first}–${last} von ${total}`,
};

function German({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider product="backoffice" labels={de}>
      {children}
    </ThemeProvider>
  );
}

describe("labels reach the accessibility tree", () => {
  it("names a Panel's close button in the product's language", () => {
    render(
      <German>
        <Panel open onOpenChange={() => {}} title="Beleg">
          <p>Inhalt</p>
        </Panel>
      </German>,
    );
    expect(screen.getByRole("button", { name: "Schließen" })).toBeInTheDocument();
  });

  it("names Pagination's landmark and its arrows", () => {
    render(
      <German>
        <Pagination page={2} pageCount={5} onPageChange={() => {}} />
      </German>,
    );
    expect(screen.getByRole("navigation", { name: "Seitennummerierung" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vorherige Seite" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nächste Seite" })).toBeInTheDocument();
  });

  it("builds the page range with the product's word order", () => {
    render(
      <German>
        <Pagination page={1} pageCount={3} pageSize={20} totalItems={53} onPageChange={() => {}} />
      </German>,
    );
    expect(screen.getByText("1–20 von 53")).toBeInTheDocument();
  });

  it("names a SearchInput and its clear button", () => {
    render(
      <German>
        <SearchInput value="abc" onChange={() => {}} onClear={() => {}} />
      </German>,
    );
    expect(screen.getByRole("searchbox", { name: "Suchen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suche zurücksetzen" })).toBeInTheDocument();
  });

  it("announces a Spinner in the product's language", () => {
    render(
      <German>
        <Spinner />
      </German>,
    );
    expect(screen.getByRole("status", { name: "Wird geladen" })).toBeInTheDocument();
  });
});

describe("the fallback", () => {
  it("is English when the product overrides nothing", () => {
    render(
      <ThemeProvider>
        <Spinner />
      </ThemeProvider>,
    );
    expect(screen.getByRole("status", { name: defaultLabels.loading })).toBeInTheDocument();
  });

  it("fills only the gaps in a partial override", () => {
    render(
      <ThemeProvider labels={{ close: "Schließen" }}>
        <Spinner />
      </ThemeProvider>,
    );
    // loading was not overridden, so it stays English rather than going blank.
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("keeps a component legible with no provider at all", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});

describe("explicit props still win over labels", () => {
  it("uses a caller's Spinner label", () => {
    render(
      <German>
        <Spinner label="Belege werden hochgeladen" />
      </German>,
    );
    expect(screen.getByRole("status", { name: "Belege werden hochgeladen" })).toBeInTheDocument();
  });

  /**
   * An empty label is the documented way to say "decorative". It has to survive
   * the labels layer, or every inline spinner starts announcing itself twice.
   */
  it("treats an empty Spinner label as decorative", () => {
    const { container } = render(
      <German>
        <Spinner label="" />
      </German>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Label", () => {
  it("marks optional with the product's word", () => {
    render(
      <ThemeProvider labels={{ optional: "freiwillig" }}>
        <Label optional>Handelsname</Label>
      </ThemeProvider>,
    );
    expect(screen.getByText("freiwillig")).toBeInTheDocument();
  });
});
