---
name: ctk-context-brief
description: Summarize docs/PROJECT_STATE.md plus recent git history into a short catch-up brief when resuming a project. Read counterpart of ctk-checkpoint (which writes state).
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Do not edit or compact. Read `docs/PROJECT_STATE.md` if present; if missing, say so instead of inventing one. Run `git log --oneline -15` and `git status` for recent activity. Combine both into a brief, under 10 bullets:

- Current state (from `PROJECT_STATE.md`'s own summary, not re-derived).
- Active decisions and discarded approaches worth knowing before touching related code.
- What's changed recently in git that the state file doesn't yet reflect.
- The next known step, if any.

If `PROJECT_STATE.md` exceeds roughly 1-2 screens, say so and suggest running `/ctk-checkpoint` to prune/consolidate it — do not edit it yourself. Do not touch application code.
