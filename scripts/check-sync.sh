#!/usr/bin/env bash
set -euo pipefail

# Runs the real `update` sync into a scratch project directory and compares
# the result against this repo's own agents/ and skills/ source, byte for
# byte. Catches the silent-drop bug class: a skill added without the ctk-
# prefix (bin/claude-toolkit.js only copies ctk-* skill directories), or any
# future change to the copy logic that stops mirroring source exactly.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

mkdir -p "$SCRATCH/project"
(cd "$SCRATCH/project" && INIT_CWD="$SCRATCH/project" node "$ROOT/bin/claude-toolkit.js" update >/dev/null)

fail=0

for dir in "$ROOT"/skills/*/; do
  name="$(basename "$dir")"
  if [[ "$name" != ctk-* ]]; then
    echo "source skill '$name' does not start with ctk- and would never be synced by \`update\`"
    fail=1
  fi
done

if ! diff -r "$ROOT/agents" "$SCRATCH/project/.claude/agents/ctk" -x '.claude-toolkit-version'; then
  echo "synced agents/ctk does not match source agents/"
  fail=1
fi

for dir in "$ROOT"/skills/ctk-*/; do
  name="$(basename "$dir")"
  if ! diff -r "$dir" "$SCRATCH/project/.claude/skills/$name"; then
    echo "synced skills/$name does not match source skills/$name"
    fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  echo "Sync check failed."
  exit 1
fi

echo "Sync check passed: agents/ and skills/ctk-* match what \`update\` installs."
