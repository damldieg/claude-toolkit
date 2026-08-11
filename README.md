# Claude Workflow

A small, repository-agnostic Claude Code workflow for all local projects. It provides cost-aware agents, milestone/audit skills, safe manual Git workflows, and a read-only PR reviewer. It contains no project instructions, framework assumptions, or application code.

## Install

Both paths run the same installer (`bin/claude-workflow.js`), which changes only `~/.claude/agents/workflow/` and `~/.claude/skills/workflow-*`. Before replacing a previous version, it moves that version into `~/.claude/workflow-backups/`. Restart Claude Code only when its `~/.claude/agents` or `~/.claude/skills` directory did not exist when the session started.

### Option A: standalone clone

For a machine-wide install independent of any single project:

```bash
git clone https://github.com/YOUR-USER/claude-workflow.git ~/.config/claude-workflow
cd ~/.config/claude-workflow
./install.sh
```

To update: `git pull` inside the clone, then `./install.sh` again.

### Option B: per-project devDependency (recommended)

Add it as a `devDependency` pointing at the private repo, so every `npm install`/`pnpm install` keeps `~/.claude` in sync automatically via a `postinstall` hook:

```bash
pnpm add -D github:YOUR-USER/claude-workflow#main
```

pnpm blocks dependency build scripts by default; approve this one once per project:

```bash
pnpm approve-builds
```

To update: bump the dependency (`pnpm update claude-workflow`) and reinstall — `postinstall` re-syncs `~/.claude` automatically. Run `npx claude-workflow status` anytime to check whether the copy in `~/.claude` matches the version currently in `node_modules`.

## Use

Manual skills: `/workflow-checkpoint`, `/workflow-audit-context`, `/workflow-git-status`, `/workflow-commit`, `/workflow-push`, `/workflow-rebase`, and `/workflow-prepare-pr`.

Use `workflow-pr-reviewer` for a read-only PR/diff review. The other agents are routed by effort: `workflow-maintenance-tiny` (Haiku/low), `workflow-feature-normal` (Sonnet/medium), `workflow-systems-deep` (Sonnet/high), and `workflow-architecture-review` (Opus/xhigh).

## Shared working rules

`GUIDELINES.md` in this repo holds the project-agnostic working rules, the effort-routing table, and the milestone definition. Reference it from a project's root `CLAUDE.md` instead of repeating it, e.g.:

```markdown
Shared working rules, effort routing, and milestone policy: `~/.config/claude-workflow/GUIDELINES.md`.
```

Keep each project's own rules in its root `CLAUDE.md`, limited to what is actually specific to that project. If a project uses milestones, add its own `docs/PROJECT_STATE.md`; `/workflow-checkpoint` will not create or alter application files automatically.

No skill automatically compacts context, commits, pushes, rebases, opens PRs, or changes remote state.
