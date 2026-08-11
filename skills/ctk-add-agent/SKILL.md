---
name: ctk-add-agent
description: Create a new Claude Code subagent (.claude/agents/*.md) for the current project, following current best practices for frontmatter, tool scoping, and model/effort choice. Use when the user asks to add, create, or scaffold an agent, or wants to delegate a recurring kind of task to a dedicated subagent.
disable-model-invocation: true
allowed-tools: Read Write Edit Glob Grep Bash
---

Author a new subagent into the current project's `.claude/agents/`, not this toolkit's own `agents/` directory (that is only for `ctk-*` agents shipped by claude-toolkit itself, synced into `.claude/agents/ctk/` by `ctk update`).

## 1. Gather requirements

Ask only for what the user hasn't already stated:
- The task the agent handles, and its boundaries (what it should and should not do).
- Read-only (research, review) vs. editing (implementation, fixes)?
- Cost/quality tradeoff: cheap and narrow, or does it need strong reasoning?
- Should Claude delegate to it proactively on its own judgment, or only when explicitly asked?
- Any hard bound on turns, or need for an isolated worktree copy of the repo?

## 2. Pick a name

- Run `Glob` on `.claude/agents/*.md` (and, if this project depends on `@damian.diego/claude-toolkit`, note the existing `ctk-*` agents under `.claude/agents/ctk/`) to avoid collisions.
- `name` must be lowercase letters and hyphens only — this is a hard requirement, not a style preference.
- Do not use the `ctk-` prefix — reserved for claude-toolkit's own agents, overwritten on `ctk update`.

## 3. Frontmatter cheat sheet

| Field | When to set it |
|---|---|
| `name` | Always. Lowercase + hyphens only. |
| `description` | Always, required. This is what Claude matches against to decide when to delegate — be explicit about triggers ("Use for...", "Use before...", "Use proactively to..."). A vague description means the agent never gets picked, or gets picked for the wrong thing. |
| `tools` | List the minimum tools the agent needs (comma- or space-separated, e.g. `Read, Glob, Grep, Bash`). Omitting it inherits every tool available in the session — fine for a broad implementer agent, but a read-only reviewer or a narrow/cheap agent should get an explicit least-privilege list (no `Edit`/`Write` for reviewers; no ability to spawn further agents for narrow/tiny agents). |
| `disallowedTools` | Alternative to `tools` when it's easier to name the few things to exclude than the many things to allow. |
| `model` | `haiku` for cheap/narrow/high-volume work, `sonnet` for typical implementation and debugging, `opus` for consequential/architectural judgment calls. Full model IDs also work. Omit to inherit the session's model. |
| `effort` | `low` / `medium` / `high` / `xhigh` / `max`, roughly matching the `model` choice and task weight. |
| `maxTurns` | A hard ceiling appropriate to the task's scope — small for tiny/maintenance agents, larger for deep investigation. Prevents runaway loops. |
| `permissionMode` | Only if this agent needs a non-default permission behavior (e.g. `plan` for a design-only agent). |
| `isolation: worktree` | Only if the agent should work on an isolated git worktree copy rather than the live tree. |
| `memory` | Only if the agent should persist learnings across runs (`project` to share with the team, `user` for personal-only). |
| `color` | Cosmetic only; skip unless the user wants one. |

## 4. Write the body

- Imperative, concise: what evidence to establish first, what to prefer, what to report back (files changed, validation run, remaining risk) — mirror the shape of this toolkit's own agents (e.g. `agents/ctk-feature-normal.md`, `agents/ctk-pr-reviewer.md`) rather than writing a long narrative.
- State scope boundaries explicitly (e.g. "do not edit code," "escalate to X before a consequential structural choice") so the agent doesn't overreach.
- Keep it short — a dense paragraph or a few bullets is normally enough; this isn't a place for exhaustive procedure, that's what the calling context's Agent-tool prompt supplies per invocation.

## 5. Finish

- Write `.claude/agents/<name>.md`.
- Report the path, the model/effort chosen and why, and a one-line reminder to try delegating one real task to it before relying on it, since a mis-scoped `description` is the most common reason an agent never gets picked.
