/**
 * Renders a component's .md rule file as its Storybook Docs description.
 *
 * The point is that there is one file. The rules a designer reads in Storybook
 * and the rules an agent reads before writing code are literally the same
 * bytes, so they cannot drift — which is the failure mode of every design
 * system that keeps "the docs" and "the usage notes" in two places.
 */

/**
 * Strips the YAML frontmatter, which is for machines and would render as text,
 * and the leading H1, which Storybook already prints as the page title.
 */
export function docsFrom(markdown: string): string {
  return markdown
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/^\s*#\s+.+\n/, "")
    .trim();
}

/** Spread into a story meta's `parameters`. */
export function docsPage(markdown: string) {
  return {
    docs: {
      description: { component: docsFrom(markdown) },
    },
  };
}
