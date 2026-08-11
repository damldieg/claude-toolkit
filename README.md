# Claude Toolkit

A small, repository-agnostic Claude Code toolkit for all local projects: cost-aware agents, milestone/audit skills, safe manual Git workflows, a read-only PR reviewer, shared working rules, and a CLI to install/update them. It contains no project instructions, framework assumptions, or application code.

Published as [`@damian.diego/claude-toolkit`](https://www.npmjs.com/package/@damian.diego/claude-toolkit).

## Install

Both paths run the same installer (`bin/claude-toolkit.js`), which changes only `~/.claude/agents/workflow/` and `~/.claude/skills/workflow-*`. Before replacing a previous version, it moves that version into `~/.claude/workflow-backups/`. Restart Claude Code only when its `~/.claude/agents` or `~/.claude/skills` directory did not exist when the session started.

npm 11+ and pnpm 10+ both block a new dependency's install-time scripts by default (unrelated supply-chain-security features, one per package manager) — the `postinstall` hook that syncs `~/.claude` may silently not run the first time until you approve it. See the per-tool notes below.

### Option A: per-project devDependency (recommended)

Add it as a `devDependency`, so every `npm install`/`pnpm install` keeps `~/.claude` in sync automatically via a `postinstall` hook:

```bash
pnpm add -D @damian.diego/claude-toolkit
```

pnpm 10+ blocks dependency build scripts by default; if `postinstall` doesn't run, approve it once per project:

```bash
pnpm approve-builds
```

Using plain `npm install` instead of pnpm, npm 11+ has its own equivalent gate — see the `allow-scripts` note under "CLI on your PATH" below; the same `npm config set allow-scripts=...` fix applies here too.

To update: `pnpm add -D @damian.diego/claude-toolkit@latest` (plain `pnpm update` won't cross a `0.x` minor bump under semver's caret rules while this package is pre-1.0) — `postinstall` re-syncs `~/.claude` automatically. Run `npx claude-toolkit status` anytime to check whether the copy in `~/.claude` matches the version currently in `node_modules`.

### Option B: standalone clone

For a machine-wide install independent of any single project:

```bash
git clone https://github.com/damldieg/claude-toolkit.git ~/.config/claude-toolkit
cd ~/.config/claude-toolkit
./scripts/install.sh
```

To update: `git pull` inside the clone, then `./scripts/install.sh` again.

### CLI on your PATH

Both `claude-toolkit` and the shorter `ctcli` alias resolve to the same binary. Install globally to get either without `npx`:

```bash
npm install -g @damian.diego/claude-toolkit
ctcli status
```

npm 11+ blocks lifecycle scripts (including `postinstall`) for packages it hasn't seen approved, even for global installs; if you see an `allow-scripts` warning and `~/.claude` didn't get synced, approve this package once (persists in your user `~/.npmrc`, applies to future installs too):

```bash
npm config set allow-scripts=@damian.diego/claude-toolkit --location=user
```

or approve just the current install without persisting it: `npm install -g --allow-scripts=@damian.diego/claude-toolkit @damian.diego/claude-toolkit`. Either way, `ctcli update` always works as a manual fallback.

## Use

Manual skills: `/workflow-checkpoint`, `/workflow-audit-context`, `/workflow-git-status`, `/workflow-commit`, `/workflow-push`, `/workflow-rebase`, and `/workflow-prepare-pr`.

`workflow-init` is the one skill Claude may run on its own judgment, without being asked: the first time it works in a project that has this toolkit installed but whose `CLAUDE.md` doesn't yet reference `GUIDELINES.md`, it reads both files and proposes wiring the project in, consolidating duplicated generic rules and keeping project-specific ones. It still confirms before writing a non-trivial merge.

Use `workflow-pr-reviewer` for a read-only PR/diff review. The other agents are routed by effort: `workflow-maintenance-tiny` (Haiku/low), `workflow-feature-normal` (Sonnet/medium), `workflow-systems-deep` (Sonnet/high), and `workflow-architecture-review` (Opus/xhigh).

## Shared working rules

`GUIDELINES.md` in this repo holds the project-agnostic working rules, the effort-routing table, and the milestone definition. Reference it from a project's root `CLAUDE.md` instead of repeating it, e.g.:

```markdown
Shared working rules, effort routing, and milestone policy: `~/.config/claude-toolkit/GUIDELINES.md`.
```

Keep each project's own rules in its root `CLAUDE.md`, limited to what is actually specific to that project. If a project uses milestones, add its own `docs/PROJECT_STATE.md`; `/workflow-checkpoint` will not create or alter application files automatically.

No skill automatically compacts context, commits, pushes, rebases, opens PRs, or changes remote state.
