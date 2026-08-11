---
name: release
description: Cut a new version of claude-toolkit itself (this repo) and trigger the CI publish to npm.
disable-model-invocation: true
allowed-tools: Read Edit Bash Grep
---

Maintainer-only. This skill is local to the claude-toolkit repo and is never packaged or shipped to consumers (`package.json`'s `files` field does not include `.claude/`).

1. Inspect `git status` and `git log` since the last `vX.Y.Z` tag to see what actually changed. Stop and ask if the working tree is dirty with unrelated changes.
2. Decide the version bump (patch/minor/major) from the nature of the changes; confirm with the user if ambiguous.
3. Update `"version"` in `package.json` to the new value. Do not hand-edit anything else.
4. Commit with a concise message (e.g. `chore(release): vX.Y.Z`).
5. Create an annotated tag `vX.Y.Z` on that commit.
6. Push the commit and the tag: `git push && git push origin vX.Y.Z`.
7. Report the tag pushed and remind the user that GitHub Actions (`.github/workflows/publish.yml`) will publish to npm automatically; it needs the `NPM_TOKEN` repo secret (an npm Automation/Granular token with the 2FA-bypass option, ideally scoped to this package) to be configured once in the GitHub repo settings.

Never publish to npm directly from this machine as part of this skill; publishing is CI's job.
