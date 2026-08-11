#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents', 'workflow');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const VERSION_FILE = path.join(AGENTS_DIR, '.claude-workflow-version');

function pkgVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
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

function install() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(CLAUDE_DIR, 'workflow-backups', timestamp);

  fs.mkdirSync(AGENTS_DIR, { recursive: true });
  fs.mkdirSync(SKILLS_DIR, { recursive: true });

  // The installer owns only this namespaced agent directory and workflow-* skills.
  backupIfPresent(AGENTS_DIR, path.join('agents', 'workflow'), backupDir);
  fs.mkdirSync(AGENTS_DIR, { recursive: true });
  for (const file of fs.readdirSync(path.join(PACKAGE_ROOT, 'agents'))) {
    if (file.endsWith('.md')) {
      fs.copyFileSync(path.join(PACKAGE_ROOT, 'agents', file), path.join(AGENTS_DIR, file));
    }
  }

  const skillsSrc = path.join(PACKAGE_ROOT, 'skills');
  for (const skillName of fs.readdirSync(skillsSrc)) {
    if (!skillName.startsWith('workflow-')) continue;
    const target = path.join(SKILLS_DIR, skillName);
    backupIfPresent(target, path.join('skills', skillName), backupDir);
    copyDir(path.join(skillsSrc, skillName), target);
  }

  fs.writeFileSync(VERSION_FILE, `${pkgVersion()}\n`);

  console.log(`claude-workflow ${pkgVersion()} installed.`);
  console.log(`Agents: ${AGENTS_DIR}`);
  console.log(`Skills: ${path.join(SKILLS_DIR, 'workflow-*')}`);
  if (fs.existsSync(backupDir)) {
    console.log(`Previous workflow files were backed up to: ${backupDir}`);
  }
  console.log('Restart Claude Code if ~/.claude/agents or ~/.claude/skills did not exist when its current session started.');
}

function status() {
  const packaged = pkgVersion();
  const installed = fs.existsSync(VERSION_FILE) ? fs.readFileSync(VERSION_FILE, 'utf8').trim() : null;
  console.log(`Package version available: ${packaged}`);
  console.log(`Installed into ~/.claude: ${installed || 'not installed'}`);
  if (installed !== packaged) {
    console.log('Out of date. Run `claude-workflow install` to sync.');
    process.exitCode = 1;
  } else {
    console.log('Up to date.');
  }
}

const command = process.argv[2];
if (command === 'install') install();
else if (command === 'status') status();
else {
  console.error('Usage: claude-workflow <install|status>');
  process.exit(1);
}
