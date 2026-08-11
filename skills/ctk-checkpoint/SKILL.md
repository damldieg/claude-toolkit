---
name: ctk-checkpoint
description: Record a concise project milestone after a feature, bug fix, decision, or release-ready slice.
disable-model-invocation: true
allowed-tools: Read Edit Write Glob Grep Bash
---

Do not compact the conversation. Read `docs/PROJECT_STATE.md`; if it does not exist, say so and offer to create a minimal project-specific state file. Inspect only relevant changed files and validation evidence. Update the state concisely, remove stale entries, and do not claim checks that did not run. Do not change application code. Reply with the milestone and any blocker.
