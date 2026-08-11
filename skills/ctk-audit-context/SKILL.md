---
name: ctk-audit-context
description: Read-only audit of current project state, changes, gaps, and risks before a milestone or handoff.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Do not edit or compact. Read project instructions and `docs/PROJECT_STATE.md` when present. Inspect current git status/diff when available and only scope-relevant files. Return under 12 bullets: confirmed state, stale/missing state, unvalidated or risky changes, and the single best next action. Label uncertainty.
