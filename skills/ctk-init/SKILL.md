---
name: ctk-init
description: Wire the current project's root CLAUDE.md into the shared claude-toolkit working rules (GUIDELINES.md), consolidating duplicated generic rules and keeping project-specific ones. Use proactively, without waiting to be asked, the first time you work in a project that depends on @damian.diego/claude-toolkit but whose CLAUDE.md does not yet reference GUIDELINES.md.
allowed-tools: Read Edit Write Bash Glob Grep
---

Goal: every project's `CLAUDE.md` stays small and project-specific; generic working rules, effort routing, and the milestone definition live once in the shared `GUIDELINES.md`.

1. Locate the installed toolkit's `GUIDELINES.md`: check `node_modules/@damian.diego/claude-toolkit/GUIDELINES.md` first (per-project install), then `~/.config/claude-toolkit/GUIDELINES.md` (standalone clone). If neither exists, stop — the toolkit isn't actually available here.
2. Read the project's root `CLAUDE.md` if it exists.
3. If `CLAUDE.md` does not exist, create it with just a project title and a pointer line to the resolved `GUIDELINES.md` path (see format below). Do not invent project-specific rules that were not asked for.
4. If `CLAUDE.md` exists and already references `GUIDELINES.md` (by path or content), do nothing further — report that it is already wired.
5. If `CLAUDE.md` exists without that reference: compare its content against `GUIDELINES.md`. Remove or shorten any rule that is a near-duplicate of a shared rule (working rules, effort-routing table, milestone definition, "routing is a default not a restriction," `/ctk-checkpoint` usage). Keep anything genuinely project-specific (domain rules, tech-stack notes, non-default routing). Add the pointer line. Do not remove unrelated project content you don't understand well enough to judge as duplicate — when unsure, keep it and ask.
6. Pointer line format (adjust the path to whichever `GUIDELINES.md` was resolved in step 1):

   ```markdown
   Shared working rules, effort routing, and milestone policy: `<resolved-path>/GUIDELINES.md`.
   ```

7. Show a brief diff-style summary of what changed (or that nothing changed) and why. This is a project-file edit — if the merge is non-trivial (more than removing exact duplicates), briefly confirm before writing rather than silently overwriting a hand-written CLAUDE.md.
