# Working rules and effort routing

Shared, project-agnostic defaults for working with Claude Code via the claude-workflow agents and skills. A project's own `CLAUDE.md` should reference this file and add only what is specific to that project.

## Working rules

- Build the smallest coherent increment that fulfils the request. Do not invent a roadmap, framework, or abstraction without a concrete need.
- Inspect relevant code before editing it. Preserve existing conventions and keep changes local.
- Run the narrowest relevant validation after a change; report what was not run.
- Do not modify dependencies, project-wide tooling, generated assets, or public APIs unless the task requires it.
- Ask before destructive actions, migrations, large refactors, or decisions that materially change product direction.
- Keep the project's state file (e.g. `docs/PROJECT_STATE.md`) concise and factual. Update it only at a completed milestone, a material decision, or when `/workflow-checkpoint` is requested. Do not update it after every small task.
- Do not run `/compact` automatically after tasks. Use it only when the user asks, or when the session is genuinely nearing its context limit; preserve the current goal and open decisions first.

## Effort routing

Delegate only when the separate context or specialised constraints provide a clear benefit. Use no subagent for a small, obvious edit.

| Level | Agent | Use for |
| --- | --- | --- |
| tiny | `workflow-maintenance-tiny` | State updates, narrow checks, short diffs, file discovery, simple documentation. |
| normal | `workflow-feature-normal` | A bounded, self-contained feature, integration, UI change, or focused bug fix. |
| deep | `workflow-systems-deep` | Reproducible difficult bugs, performance issues, cross-cutting systems, or risky refactors. |
| architect | `workflow-architecture-review` | Compare consequential architectural options before committing to one. |

Routing is a default, not a restriction: a small issue stays in the main conversation; escalation is appropriate when evidence warrants it. Keep delegated prompts bounded and request a short result with files changed, validation, risks, and next step.

## Milestone definition

A milestone is a user-visible feature slice, a completed bug investigation/fix, a validated system change, a release/commit-ready checkpoint, or a decision that changes future implementation. At a milestone, run `/workflow-checkpoint` (or make its equivalent update) once.
