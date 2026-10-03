# Changelog

Release notes are generated, not kept by hand. Each package writes its own:

- **[`packages/ui/CHANGELOG.md`](packages/ui/CHANGELOG.md)** — `@smarta/ui`, the
  package products install. `@smarta/tokens` is built into it and has no
  release notes of its own.

They are assembled by [Changesets](https://github.com/changesets/changesets)
from the notes each pull request carries in `.changeset/`. Until the first
"Version packages" pull request is merged, the upcoming notes are in
[`.changeset/`](.changeset/) itself.

The rules for what counts as a patch, a minor and a major change in a design
system — a token's value changing is at least minor; a component becoming more
accessible can be major — are in [docs/OWNERSHIP.md](docs/OWNERSHIP.md). Notes
are written for the person upgrading: "a clickable row now needs
`onActivate`", not "refactored Table".
