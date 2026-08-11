---
name: ctk-deps-audit
description: Read-only summary of outdated and vulnerable dependencies — what to update, what's breaking, and what can wait. Use when the user asks to check dependencies, audit packages, or review what's outdated/vulnerable.
disable-model-invocation: true
allowed-tools: Read Bash Glob Grep
---

Do not edit `package.json`, lockfiles, or run install/update commands — this is a report, not a fix.

1. Detect the package manager from the lockfile present (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn).
2. Run its audit command (`npm audit` / `pnpm audit` / `yarn audit`) and its outdated command (`npm outdated` / `pnpm outdated` / `yarn outdated`).
3. Cross-reference: for each outdated package, note whether the version jump is a major (likely breaking, check its changelog/release notes if readily available) or a minor/patch (usually safe).

Report as three groups, most urgent first:
- **Vulnerable** — advisories from the audit, with severity and whether a non-breaking fix version exists.
- **Safe to update** — outdated but minor/patch only.
- **Breaking / needs review** — outdated with a major version jump; name what's likely to break if known, otherwise say it needs manual review.

Do not recommend updating dependencies pinned or excluded by project convention (check for a `.npmrc`/comment/CLAUDE.md note first). Keep the report scannable — a table or grouped list, not prose.
