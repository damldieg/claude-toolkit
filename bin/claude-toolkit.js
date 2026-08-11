#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const GLOBAL_CLAUDE_DIR = path.join(os.homedir(), '.claude');

function pkgVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

// Resolve where "update" should write. Default is project-scoped: each
// project that depends on this package gets its own `<project>/.claude`,
// vendored and git-tracked, so different projects can be on different
// versions and add project-specific skills alongside the workflow-* base.
// Falls back to the global `~/.claude` for the two cases where there is no
// consuming project: `npm install -g` (npm sets npm_config_global=true),
// and running this CLI from inside its own cloned repo (the standalone
// install path from the README).
function resolveTarget() {
  if (process.env.npm_config_global === 'true') {
    return { claudeDir: GLOBAL_CLAUDE_DIR, scope: 'global (npm -g)', backup: true };
  }
  // INIT_CWD is set by npm/pnpm/yarn to the directory the install command
  // was run from, even for a nested dependency's lifecycle scripts; it is
  // the one reliable way to find the consuming project's root from inside
  // node_modules. Falls back to cwd for direct/manual CLI invocations.
  const projectRoot = process.env.INIT_CWD || process.cwd();
  if (path.resolve(projectRoot) === path.resolve(PACKAGE_ROOT)) {
    return { claudeDir: GLOBAL_CLAUDE_DIR, scope: 'global (standalone clone)', backup: true };
  }
  return { claudeDir: path.join(projectRoot, '.claude'), scope: `project (${projectRoot})`, backup: false };
}

function backupIfPresent(targetPath, relativePath, backupDir) {
  if (fs.existsSync(targetPath)) {
    const dest = path.join(backupDir, relativePath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(targetPath, dest);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function update() {
  const { claudeDir, scope, backup } = resolveTarget();
  const agentsDir = path.join(claudeDir, 'agents', 'workflow');
  const skillsDir = path.join(claudeDir, 'skills');
  const versionFile = path.join(agentsDir, '.claude-toolkit-version');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(GLOBAL_CLAUDE_DIR, 'workflow-backups', timestamp);

  fs.mkdirSync(agentsDir, { recursive: true });
  fs.mkdirSync(skillsDir, { recursive: true });

  // This command owns only this namespaced agent directory and workflow-* skills.
  if (backup) backupIfPresent(agentsDir, path.join('agents', 'workflow'), backupDir);
  fs.mkdirSync(agentsDir, { recursive: true });
  for (const file of fs.readdirSync(path.join(PACKAGE_ROOT, 'agents'))) {
    if (file.endsWith('.md')) {
      fs.copyFileSync(path.join(PACKAGE_ROOT, 'agents', file), path.join(agentsDir, file));
    }
  }

  const skillsSrc = path.join(PACKAGE_ROOT, 'skills');
  for (const skillName of fs.readdirSync(skillsSrc)) {
    if (!skillName.startsWith('workflow-')) continue;
    const target = path.join(skillsDir, skillName);
    if (backup) backupIfPresent(target, path.join('skills', skillName), backupDir);
    copyDir(path.join(skillsSrc, skillName), target);
  }

  fs.writeFileSync(versionFile, `${pkgVersion()}\n`);

  console.log(`claude-toolkit ${pkgVersion()} synced (${scope}).`);
  console.log(`Agents: ${agentsDir}`);
  console.log(`Skills: ${path.join(skillsDir, 'workflow-*')}`);
  if (backup && fs.existsSync(backupDir)) {
    console.log(`Previous workflow files were backed up to: ${backupDir}`);
  }
  if (!backup) {
    console.log('Project-scoped: commit .claude/agents/workflow and .claude/skills/workflow-* like any other vendored file. Add project-specific skills alongside them under different names.');
  }
  console.log('Restart Claude Code if its agents/skills directory for this scope did not exist when the current session started.');
}

function status() {
  const { claudeDir, scope } = resolveTarget();
  const agentsDir = path.join(claudeDir, 'agents', 'workflow');
  const versionFile = path.join(agentsDir, '.claude-toolkit-version');
  const packaged = pkgVersion();
  const installed = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf8').trim() : null;
  console.log(`Scope: ${scope}`);
  console.log(`Package version available: ${packaged}`);
  console.log(`Installed: ${installed || 'not installed'}`);
  if (installed !== packaged) {
    console.log('Out of date. Run `claude-toolkit update` to sync.');
    process.exitCode = 1;
  } else {
    console.log('Up to date.');
  }
}

const command = process.argv[2];
if (command === 'update' || command === 'install') update();
else if (command === 'status') status();
else {
  console.error('Usage: claude-toolkit <update|status>');
  process.exit(1);
}
