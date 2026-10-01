# Changesets

Every pull request that changes what a product gets from `@smarta/ui` carries
one of these: a small Markdown file saying which version bump it needs and what
an upgrading product should know.

```sh
npm run changeset
```

asks which package, which bump, and for the note. Write the note for the person
upgrading: "a clickable row now needs `onActivate`", not "refactored Table".
What counts as patch, minor and major for a design system — a token's value
changing is at least minor; a component becoming more accessible can be major —
is in [docs/OWNERSHIP.md](../docs/OWNERSHIP.md).

CI runs `changeset status` on every pull request and fails one that changes
`packages/ui` or `packages/tokens` without a changeset. A change with nothing
for a product to know — a story, a test, a comment — gets an empty one:

```sh
npm run changeset -- --empty
```

On `main`, the release workflow collects the pending changesets into a
"Version packages" pull request, which bumps the version and writes
`packages/ui/CHANGELOG.md`. Merging that pull request is the release.
