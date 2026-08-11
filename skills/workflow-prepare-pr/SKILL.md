---
name: workflow-prepare-pr
description: Prepare a pull-request summary and review checklist from the current branch without publishing it.
disable-model-invocation: true
---

Inspect the branch against its likely base and run only appropriate existing validation. Produce a concise PR title, summary, validation section, risks, and reviewer checklist. Invoke workflow-pr-reviewer for a read-only review when useful. Do not create, publish, merge, or modify a remote PR unless explicitly asked in a later request.
