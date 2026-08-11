---
name: ctk-add-skill
description: Create a new Claude Code skill (SKILL.md) for the current project, following current best practices for frontmatter and structure. Use when the user asks to add, create, or scaffold a skill, or wants to turn a repeated procedure/checklist into a reusable slash command.
disable-model-invocation: true
allowed-tools: Read Write Edit Glob Grep Bash
---

Author a new skill into the current project's `.claude/skills/`, not this toolkit's own `skills/` directory (that is only for `ctk-*` skills shipped by claude-toolkit itself, synced by `ctk update`).

## 1. Gather requirements

Ask only for what the user hasn't already stated:
- The core task/procedure the skill should perform.
- Trigger: should Claude invoke it automatically when relevant (model-invoked), or only when the user explicitly types `/name` (manual-only)?
- Is it read-only, or does it edit files / run state-changing commands (git push, deploy, send a message, call an API)?
- Any parameters it needs (e.g. a branch name, a file path)?
- Whether it should delegate a heavy sub-task to an isolated subagent rather than run inline.

## 2. Pick a name

- Run `Glob` on `.claude/skills/*/SKILL.md` (and, if this project itself depends on `@damian.diego/claude-toolkit`, note the existing `ctk-*` names) to avoid collisions.
- kebab-case, matches the directory name exactly.
- Do not use the `ctk-` prefix — that namespace is reserved for claude-toolkit itself and gets overwritten on `ctk update`.
- If `.claude/skills/<name>/` already exists, show its current content and confirm before overwriting.

## 3. Frontmatter cheat sheet

| Field | When to set it |
|---|---|
| `name` | Always; must match the directory name. |
| `description` | Always. Third person, states what it does **and** when to use it (explicit trigger phrasing, e.g. "Use when the user asks to..."). This is what Claude matches against to decide whether to invoke the skill, so vague descriptions cause missed or spurious triggers. Combined with `when_to_use` it is truncated at 1,536 characters — keep it to 1-3 sentences. |
| `disable-model-invocation: true` | Set for anything state-changing, side-effecting, or that the user should always trigger explicitly (mirrors this toolkit's own `ctk-commit`/`ctk-push`/`ctk-rebase`). Omit (default `false`) only for safe, read-only helpers Claude should reach for on its own judgment. |
| `allowed-tools` | List the minimum tools the skill actually needs (space- or comma-separated, e.g. `Read Bash Grep`). This pre-approves exactly those tools for the turn without expanding capability — anything else still goes through normal permission prompts. Prefer setting this over leaving it unset. |
| `argument-hint` / `arguments` | Only if the skill takes positional input substituted as `$name`. |
| `model` / `effort` | Only to override the session's default — rare for a skill; usually leave unset. |
| `context: fork` + `agent:` | Only when the task is a heavy, self-contained side task (e.g. a big search or multi-file audit) that would otherwise flood the main conversation — runs it as a subagent instead. |
| `paths` | Only if the skill should only be offered inside a specific glob-scoped part of the repo. |

Fields that exist but are rarely worth setting here: `disallowed-tools`, `hooks`, `shell`, `metadata`, `license`, `compatibility`, `user-invocable` (only set `false` to hide a skill from the `/` menu while keeping it model-invocable).

## 4. Write the body

- Imperative, concise instructions: state what to do, not why. Every line costs tokens whenever the skill loads.
- Numbered steps for anything with more than 2-3 sequential actions.
- Don't restate rules already in the project's `CLAUDE.md` — reference it instead.
- Keep `SKILL.md` itself under ~500 lines. If there's substantial reference material (schemas, long examples, lookup tables), put it in `references/*.md` or helper code in `scripts/` inside the skill's directory, and link to those files from the body rather than inlining them — Claude only loads them when the step actually needs them.

## 5. Finish

- Write `.claude/skills/<name>/SKILL.md` (and any `references/`/`scripts/` files).
- Report the path, whether it's manual (`/<name>`) or auto-triggered, and a one-line reminder to try it once in a fresh conversation to confirm it triggers/behaves as expected before relying on it.
