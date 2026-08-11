#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${HOME}/.claude"
AGENTS_DIR="${CLAUDE_DIR}/agents/workflow"
SKILLS_DIR="${CLAUDE_DIR}/skills"
BACKUP_DIR="${CLAUDE_DIR}/workflow-backups/$(date +%Y%m%d-%H%M%S)"

backup_if_present() {
  local target_path="$1"
  local relative_path="$2"
  if [ -e "${target_path}" ]; then
    mkdir -p "${BACKUP_DIR}/$(dirname "${relative_path}")"
    mv "${target_path}" "${BACKUP_DIR}/${relative_path}"
  fi
}

mkdir -p "${AGENTS_DIR}" "${SKILLS_DIR}"

# The installer owns only this namespaced agent directory and workflow-* skills.
backup_if_present "${AGENTS_DIR}" "agents/workflow"
mkdir -p "${AGENTS_DIR}"
cp "${SOURCE_DIR}/agents/"*.md "${AGENTS_DIR}/"

for skill_source in "${SOURCE_DIR}/skills/"workflow-*; do
  skill_name="$(basename "${skill_source}")"
  backup_if_present "${SKILLS_DIR}/${skill_name}" "skills/${skill_name}"
  cp -R "${skill_source}" "${SKILLS_DIR}/${skill_name}"
done

echo "Installed claude-workflow."
echo "Agents: ${AGENTS_DIR}"
echo "Skills: ${SKILLS_DIR}/workflow-*"
if [ -d "${BACKUP_DIR}" ]; then
  echo "Previous workflow files were backed up to: ${BACKUP_DIR}"
fi
echo "Restart Claude Code if ~/.claude/agents or ~/.claude/skills did not exist when its current session started."
