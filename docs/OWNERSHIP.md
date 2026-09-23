# Ownership, distribution and release

Alisson's P0-5. Some of it is in the repository now; the rest is a handful of
settings that can only be changed in GitHub's own configuration, by someone
with admin on the account. This file is the list, so it is tracked rather than
remembered.

## Done, in this repository

| | |
|---|---|
| **Licence** | `LICENSE` — proprietary, all rights reserved, taxit-tech. No licence file previously meant the same thing by accident. |
| **Code owners** | `.github/CODEOWNERS`. |
| **CI** | `.github/workflows/ci.yml` — check, build, tests, axe, consumer builds, Storybook, audit. |
| **Versioning** | SemVer, with the rules below. |
| **Changelog** | `CHANGELOG.md`, Keep a Changelog format. |

## Still to do, and only you can do it

These need admin on the GitHub account. They are listed in the order that
matters.

### 1. The repository is public

It is the design system for an internal backoffice, on a personal account. Make
it private or internal, and do that before anything else on this list.

```sh
gh repo edit danielxavier89/smarta-ui --visibility private \
  --accept-visibility-change-consequences
```

Note that the Netlify deploy keeps serving the built Storybook at its public URL
either way — that is a separate setting, and the built site contains the whole
component source. Password protection is a paid feature on Netlify and on
Vercel.

### 2. Transfer to `taxit-tech`

A shared design system on an individual's account is a single point of failure
for access, for billing and for whoever inherits it. Transferring preserves
issues, pull requests and stars, and leaves a redirect from the old URL.

```sh
gh api -X POST repos/danielxavier89/smarta-ui/transfer -f new_owner=taxit-tech
```

Afterwards: update `origin` in every clone, and update the Netlify site's
repository link.

### 3. Require CI to pass before merge

The workflow exists, but nothing yet stops a merge when it is red. On `main`,
require:

- a pull request before merging, with at least one approval
- review from Code Owners
- status checks `verify` and `audit` to pass, and branches to be up to date
- conversation resolution
- no force pushes, no deletions

```sh
gh api -X PUT repos/taxit-tech/smarta-ui/branches/main/protection \
  --input .github/branch-protection.json
```

### 4. Publish somewhere the products can install from

The package builds and is `publishConfig.access: restricted`, but it is not
published anywhere yet, so a product still has to consume it through the
workspace. Either:

- **GitHub Packages** — no new vendor, `.npmrc` per consumer pointing
  `@smarta:registry` at `npm.pkg.github.com`, and a token in each product's CI.
- **A private npm organisation** — simpler for consumers, another subscription.

Until one of those exists, a product can depend on a git URL and a tag. That
works and is worth saying out loud rather than leaving people to discover.

## Versioning

SemVer, read from the consumer's point of view rather than ours:

- **patch** — a fix that changes no API and no visual result a product depends
  on.
- **minor** — a new component, a new prop, a new token, a new label key. Adding
  a key to `SmartaLabels` is minor: English fills it in, so nothing breaks.
- **major** — a removed or renamed export, a changed prop type, a changed
  default, or a visual change a product would have to compensate for.

Two things that are easy to get wrong here:

- **A token's value changing is at least minor, and often major.** Products read
  these. Renaming or removing one is major.
- **A component becoming more accessible can be breaking.** `TR`'s `onActivate`
  was additive and `clickable` still renders, which is why that one was not —
  but the next such change might not be, and "it was a bug" is not a reason to
  skip the version bump.

## Releasing

1. `npm run check && npm run build && npm test && npm run test:consumer`
2. Move `CHANGELOG.md`'s `Unreleased` entries under a new version heading.
3. `npm version <patch|minor|major> -w @smarta/ui` — and the same for
   `@smarta/tokens` if its tokens moved, since the two are versioned together.
4. Tag `v<version>`, push the tag.
5. Publish, once a registry exists.

Nothing here is automated yet. It is written down first because an automated
release that nobody has done by hand is an automated release nobody can debug.
