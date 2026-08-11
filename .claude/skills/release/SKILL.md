---
name: release
description: Add a changeset for a change about to land on main, or explain the release flow for claude-toolkit itself.
disable-model-invocation: true
allowed-tools: Read Edit Bash Grep
---

Maintainer-only. This skill is local to the claude-toolkit repo and is never packaged or shipped to consumers (`package.json`'s `files` field does not include `.claude/`).

Release is fully automated via `@changesets/cli` and `.github/workflows/release.yml` (`changesets/action`) — there is no manual version bump, tag, or `npm publish` step anymore.

1. For a change that should ship, add a changeset before/alongside the commit: `npx changeset add` (interactive: pick bump type, write a one-line summary) or `npx changeset add --empty` for changes that don't need a release. Commit the generated `.changeset/*.md` file with the change.
2. On push to `main`, the Release workflow opens/updates a "Version Packages" PR that bundles all pending changesets into a version bump and `CHANGELOG.md` entry. Do not hand-edit `package.json`'s version or `CHANGELOG.md` — they're generated.
3. Merging that PR triggers the same workflow to run `npm run release` (`changeset publish`), which publishes to npm and pushes the version tag. Nothing further to do.

Requires the `NPM_TOKEN` repo secret (already configured for the previous flow) and the workflow's own `contents: write` / `pull-requests: write` permissions for the default `GITHUB_TOKEN` — no separate PAT needed unless the repo's default token permissions have been restricted to read-only at the org level.

Never publish to npm directly from this machine; publishing is CI's job.
