#!/usr/bin/env node
'use strict';

// Validates the flat YAML frontmatter this repo actually uses (simple
// `key: value` lines, no nesting/lists) on every shipped agent and skill.
// Not a general YAML parser — this repo's frontmatter has never needed one,
// and adding a dependency for it would be its own violation of the
// toolkit's "smallest coherent increment" rule.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return { error: 'missing opening `---`' };
  const end = content.indexOf('\n---', 4);
  if (end === -1) return { error: 'missing closing `---`' };
  const block = content.slice(4, end);
  const data = {};
  for (const line of block.split('\n')) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z][\w-]*):\s?(.*)$/);
    if (!m) return { error: `unparseable frontmatter line: "${line}"` };
    data[m[1]] = m[2].trim();
  }
  return { data };
}

function checkCommon(errors, file, data, expectedName) {
  if (!data.name) errors.push(`${file}: missing "name"`);
  else if (data.name !== expectedName) {
    errors.push(`${file}: name "${data.name}" does not match expected "${expectedName}"`);
  }
  if (!data.description) errors.push(`${file}: missing "description"`);
  else if (data.description.length > 1536) {
    errors.push(`${file}: description exceeds 1536 chars (${data.description.length})`);
  }
}

function validateAgents(errors) {
  const dir = path.join(ROOT, 'agents');
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const rel = path.join('agents', file);
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, error } = parseFrontmatter(content);
    if (error) {
      errors.push(`${rel}: ${error}`);
      continue;
    }
    checkCommon(errors, rel, data, file.replace(/\.md$/, ''));
    for (const field of ['model', 'effort', 'maxTurns']) {
      if (!data[field]) errors.push(`${rel}: missing "${field}"`);
    }
    if (data.maxTurns && !/^\d+$/.test(data.maxTurns)) {
      errors.push(`${rel}: "maxTurns" must be a plain integer, got "${data.maxTurns}"`);
    }
  }
}

function validateSkills(errors) {
  const dir = path.join(ROOT, 'skills');
  for (const name of fs.readdirSync(dir)) {
    const skillFile = path.join(dir, name, 'SKILL.md');
    const rel = path.join('skills', name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      errors.push(`${rel}: missing SKILL.md`);
      continue;
    }
    const content = fs.readFileSync(skillFile, 'utf8');
    const { data, error } = parseFrontmatter(content);
    if (error) {
      errors.push(`${rel}: ${error}`);
      continue;
    }
    checkCommon(errors, rel, data, name);
    if (!data['allowed-tools']) errors.push(`${rel}: missing "allowed-tools"`);
  }
}

const errors = [];
validateAgents(errors);
validateSkills(errors);

if (errors.length > 0) {
  console.error(`Frontmatter validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('Frontmatter validation passed.');
