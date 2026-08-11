---
name: ctk-checkpoint
description: Record a concise project milestone after a feature, bug fix, decision, or release-ready slice.
disable-model-invocation: true
allowed-tools: Read Edit Write Glob Grep Bash
---

Do not compact the conversation. Read `docs/PROJECT_STATE.md`; if it does not exist, offer to create it from `node_modules/@damian.diego/claude-toolkit/templates/PROJECT_STATE.md` (fall back to a minimal state file with the same four sections if that path isn't present). Inspect only relevant changed files and validation evidence. Update the state concisely: record the "why" (decisions and discarded approaches), not the "what" already in git log and code. If the file has grown past 1-2 screens, prune/consolidate stale entries in place — do not archive the whole file. Do not claim checks that did not run. Do not change application code. Reply with the milestone and any blocker.
