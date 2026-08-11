# Claude Toolkit

A small, repository-agnostic Claude Code toolkit for all local projects: cost-aware agents, milestone/audit skills, safe manual Git workflows, a read-only PR reviewer, shared working rules, and a CLI to install/update them. It contains no project instructions, framework assumptions, or application code.

Published as [`@damian.diego/claude-toolkit`](https://www.npmjs.com/package/@damian.diego/claude-toolkit).

## Install

### Option A: per-project devDependency (recommended, default scope)

Add it as a `devDependency`. A `postinstall` hook then syncs `<project>/.claude/agents/workflow/` and `<project>/.claude/skills/workflow-*` — vendored into that project, not your machine's `~/.claude`. Commit them like any other vendored file; add project-specific skills alongside them under different names.

```bash
pnpm add -D @damian.diego/claude-toolkit
```

npm 11+ and pnpm 10+ both block a new dependency's install-time scripts by default (unrelated supply-chain-security features, one per package manager); `postinstall` may silently not run the first time until you approve it.

pnpm: `pnpm approve-builds`. Plain `npm install`: `npm config set allow-scripts=@damian.diego/claude-toolkit --location=user` (persists) or `npm install --allow-scripts=@damian.diego/claude-toolkit` (once). Yarn Berry with `nodeLinker: node-modules` has no such gate; `postinstall` just runs.

To update: `pnpm add -D @damian.diego/claude-toolkit@latest` (plain `pnpm update` won't cross a `0.x` minor bump under semver's caret rules while this package is pre-1.0) — `postinstall` re-syncs automatically. Run `npx claude-toolkit status` anytime to check whether `.claude/` matches the version currently in `node_modules`.

### Option B: global CLI / machine-wide scope

Two ways to get the same result outside any single project — both sync to `~/.claude` instead of a project's `.claude/`:

```bash
npm install -g @damian.diego/claude-toolkit   # ctcli / claude-toolkit on your PATH
```

```bash
git clone https://github.com/damldieg/claude-toolkit.git ~/.config/claude-toolkit
cd ~/.config/claude-toolkit && ./scripts/install.sh   # then `git pull` + rerun to update
```

npm 11+ blocks lifecycle scripts for global installs too until approved — same `npm config set allow-scripts=...` fix as above. `ctcli update` always works as a manual fallback if `postinstall` didn't run.

### How the CLI picks a scope

`claude-toolkit update` (aliased `install`) writes to a project's `.claude/` whenever it can resolve a consuming project — via `INIT_CWD` when run as another package's lifecycle script, or `cwd` when run manually. It only falls back to the global `~/.claude` for `npm install -g` (detected via `npm_config_global`) or when run from inside this repo's own clone (the standalone-install path above). Global-scope syncs keep the old backup-to-`~/.claude/workflow-backups` behavior; project-scope syncs don't — they rely on git instead.

## Use

Manual skills: `/workflow-checkpoint`, `/workflow-audit-context`, `/workflow-git-status`, `/workflow-commit`, `/workflow-push`, `/workflow-rebase`, and `/workflow-prepare-pr`.

`workflow-init` is the one skill Claude may run on its own judgment, without being asked: the first time it works in a project that has this toolkit installed but whose `CLAUDE.md` doesn't yet reference `GUIDELINES.md`, it reads both files and proposes wiring the project in, consolidating duplicated generic rules and keeping project-specific ones. It still confirms before writing a non-trivial merge.

Use `workflow-pr-reviewer` for a read-only PR/diff review. The other agents are routed by effort: `workflow-maintenance-tiny` (Haiku/low), `workflow-feature-normal` (Sonnet/medium), `workflow-systems-deep` (Sonnet/high), and `workflow-architecture-review` (Opus/xhigh).

## Shared working rules

`GUIDELINES.md` in this repo holds the project-agnostic working rules, the effort-routing table, and the milestone definition. Reference it from a project's root `CLAUDE.md` instead of repeating it:

```markdown
Shared working rules, effort routing, and milestone policy: `node_modules/@damian.diego/claude-toolkit/GUIDELINES.md`.
```

(or `~/.config/claude-toolkit/GUIDELINES.md` for the standalone-clone / global path.) Keep each project's own rules in its root `CLAUDE.md`, limited to what is actually specific to that project. If a project uses milestones, add its own `docs/PROJECT_STATE.md`; `/workflow-checkpoint` will not create or alter application files automatically.

No skill automatically compacts context, commits, pushes, rebases, opens PRs, or changes remote state.
