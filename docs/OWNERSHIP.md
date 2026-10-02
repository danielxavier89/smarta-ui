# Ownership, distribution and release

Alisson's P0-5. Some of it is in the repository now; the rest is a handful of
settings that can only be changed in GitHub's own configuration, by someone
with admin on the account. This file is the list, so it is tracked rather than
remembered.

## Done

| | |
|---|---|
| **Licence** | `LICENSE` — proprietary, all rights reserved, taxit-tech. No licence file previously meant the same thing by accident. |
| **Code owners** | `.github/CODEOWNERS`. |
| **CI** | `.github/workflows/ci.yml` — check, build, unit tests, consumer build, coexistence with Ant Design / Bootstrap / Tailwind, every story in a real browser, a changeset on every library change, and `npm audit`. |
| **Versioning and changelog** | SemVer with the rules below, written automatically by Changesets — see "Releasing". |
| **Merges need a green CI** | Branch protection on `main`, applied 2026-10-01 from `.github/branch-protection.json`: `verify` and `audit` must pass on an up-to-date branch, one approval from a code owner, conversations resolved, no force pushes, no deletions. |
| **The release workflow may open its pull request** | Settings → Actions → "Allow GitHub Actions to create and approve pull requests", on. |
| **Storybook is published** | https://danielxavier89.github.io/smarta-ui/ — `.github/workflows/storybook-pages.yml`, enabled 2026-10-02. Built on every push to `main` and to `worktree-mobile-review` (PR #2) until that merges; the last run wins. The `github-pages` environment allows exactly those two branches (Settings → Environments). When PR #2 merges, drop the second branch from both the workflow and the environment. |

One consequence of the protection worth knowing: CODEOWNERS names a single
person, and GitHub does not let anyone approve their own pull request. Until a
second owner is added, merging needs an administrator to use "merge without
waiting for requirements" — which `enforce_admins: false` allows, and which is
visible in the pull request's history. Add a second owner to CODEOWNERS as soon
as the team exists.

## Still to do — each needs something this account does not have

### 1. Make the repository private — after giving Alisson access

It is the design system for an internal backoffice, on a personal account, and
it is public. It should be private.

But Alisson is reviewing it and is not a collaborator: making it private now
cuts him off from the pull request that answers his review. So, in this order,
with his GitHub username:

```sh
gh api -X PUT repos/danielxavier89/smarta-ui/collaborators/<his-username> -f permission=pull
gh repo edit danielxavier89/smarta-ui --visibility private --accept-visibility-change-consequences
```

Going private also stops GitHub Pages on the free plan, so the Storybook link
above goes dark. `netlify.toml` is ready as the alternative: a Netlify deploy
keeps serving the built Storybook at a public URL regardless — and the built
site contains the whole component source. Password protection is a paid
feature on Netlify and on Vercel.

### 2. Transfer to `taxit-tech`

The account that owns this repository is not a member of the taxit-tech
organisation, so the transfer needs someone who can create repositories there.
Transferring keeps issues, pull requests and branch protection, and leaves a
redirect from the old URL.

```sh
gh api -X POST repos/danielxavier89/smarta-ui/transfer -f new_owner=taxit-tech
```

Afterwards: update `origin` in every clone, and replace the single person in
CODEOWNERS with a team.

### 3. Build the library into the real products in CI

The `products` job in `ci.yml` installs the packed library into
kontax-webapp and kontax-backoffice and runs their own builds — Alisson's
consumer-build requirement, for real. It skips with a visible warning until
someone with access to those repositories sets `KONTAX_WEBAPP_REPO`,
`KONTAX_BACKOFFICE_REPO` and a `PRODUCTS_TOKEN` secret. The job's header in
`ci.yml` lists exactly what to set.

### 4. Publish somewhere the products can install from

The package builds, packs and is `publishConfig.access: restricted`, and the
release workflow will publish it — but it has nowhere to publish to yet.

- **GitHub Packages** requires the package scope to match the repository owner.
  After the transfer that means renaming the package `@taxit-tech/ui`; from a
  personal account it cannot work at all.
- **A private npm organisation named `smarta`** keeps `@smarta/ui`, and costs a
  subscription.

Choose one, then set `PUBLISH_ENABLED` and `NPM_TOKEN` as the header of
`.github/workflows/release.yml` describes. Until then a product can depend on
a git URL and a tag, which works and is worth saying out loud.

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

Automated, with [Changesets](https://github.com/changesets/changesets).

1. **Every pull request that changes the library carries a note** in
   `.changeset/` — `npm run changeset` asks for the bump and the text. CI
   fails a pull request that changes `packages/ui` or `packages/tokens`
   without one. A change with nothing for a product to know gets
   `npm run changeset -- --empty`.
2. **On `main`, `.github/workflows/release.yml` opens a "Version packages"
   pull request** that turns the pending notes into a version bump and
   `packages/ui/CHANGELOG.md`. It updates itself as more notes land.
3. **Merging that pull request is the release.** Once a registry is configured
   (`PUBLISH_ENABLED` and `NPM_TOKEN`, see the workflow's header) the same
   workflow builds and publishes; until then it versions and stops.

To see what the next release would be without making it:

```sh
npm run changeset:status
```

The release workflow needs one repository setting to open its pull request:
Settings → Actions → General → "Allow GitHub Actions to create and approve pull
requests".

