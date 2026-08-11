# Claude Workflow

A small, repository-agnostic Claude Code workflow for all local projects. It provides cost-aware agents, milestone/audit skills, safe manual Git workflows, and a read-only PR reviewer. It contains no project instructions, framework assumptions, or application code.

## Install

1. Create a private GitHub repository and push this folder's contents to it.
2. Clone it to a stable local location:

   ```bash
   git clone git@github.com:YOUR-USER/claude-workflow.git ~/.config/claude-workflow
   ```

3. Install it:

   ```bash
   cd ~/.config/claude-workflow
   chmod +x install.sh
   ./install.sh
   ```

The installer changes only `~/.claude/agents/workflow/` and `~/.claude/skills/workflow-*`. Before replacing a previous version, it moves that version into `~/.claude/workflow-backups/`.

To update, run `git pull` inside the clone, then `./install.sh` again. Restart Claude Code only when its `~/.claude/agents` or `~/.claude/skills` directory did not exist when the session started.

## Use

Manual skills: `/workflow-checkpoint`, `/workflow-audit-context`, `/workflow-git-status`, `/workflow-commit`, `/workflow-push`, `/workflow-rebase`, and `/workflow-prepare-pr`.

Use `workflow-pr-reviewer` for a read-only PR/diff review. The other agents are routed by effort: `workflow-maintenance-tiny` (Haiku/low), `workflow-feature-normal` (Sonnet/medium), `workflow-systems-deep` (Sonnet/high), and `workflow-architecture-review` (Opus/xhigh).

Keep each project's own rules in its root `CLAUDE.md`. If a project uses milestones, add its own `docs/PROJECT_STATE.md`; `/workflow-checkpoint` will not create or alter application files automatically.

No skill automatically compacts context, commits, pushes, rebases, opens PRs, or changes remote state.
