#!/usr/bin/env bash
set -euo pipefail

# Packs a real tarball (as `npm publish` would ship it) and installs it into
# a throwaway consumer project, to catch two release-time failure classes:
#   1. a folder needed at runtime missing from package.json's "files" list
#      (the package installs but is broken for consumers), and
#   2. the sync step producing anything other than the expected
#      .claude/agents/ctk + .claude/skills/ctk-* output.
#
# Whether `postinstall` itself fires depends on the installer's npm/pnpm
# version and its allow-scripts gate (see README) — that gate is inherently
# environment-dependent, so this script doesn't assert on it directly.
# Instead it always runs the documented manual fallback (`ctcli update`)
# afterward, which is what a real consumer does when the gate blocks
# postinstall, so the check stays deterministic across npm versions.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

echo "Packing tarball..."
TARBALL_NAME="$(cd "$ROOT" && npm pack --silent --pack-destination "$SCRATCH")"
TARBALL_PATH="$SCRATCH/$TARBALL_NAME"

echo "Checking tarball contents against package.json's files list..."
tar -tzf "$TARBALL_PATH" > "$SCRATCH/tarball-listing.txt"
for f in agents skills templates GUIDELINES.md README.md bin/claude-toolkit.js package.json; do
  if ! grep -q "^package/${f}" "$SCRATCH/tarball-listing.txt"; then
    echo "missing from tarball: $f (check package.json \"files\")"
    exit 1
  fi
done

echo "Installing tarball into a scratch consumer project..."
PROJECT="$SCRATCH/consumer"
mkdir -p "$PROJECT"
(cd "$PROJECT" && npm init -y >/dev/null 2>&1)
(cd "$PROJECT" && npm install "$TARBALL_PATH" >/dev/null 2>&1)

echo "Running the documented manual fallback (ctcli update)..."
(cd "$PROJECT" && node "$PROJECT/node_modules/@damian.diego/claude-toolkit/bin/claude-toolkit.js" update >/dev/null)

fail=0
if [[ ! -f "$PROJECT/.claude/agents/ctk/ctk-pr-reviewer.md" ]]; then
  echo "expected agent .claude/agents/ctk/ctk-pr-reviewer.md not found after install"
  fail=1
fi
if [[ ! -f "$PROJECT/.claude/skills/ctk-checkpoint/SKILL.md" ]]; then
  echo "expected skill .claude/skills/ctk-checkpoint/SKILL.md not found after install"
  fail=1
fi
if [[ ! -f "$PROJECT/node_modules/@damian.diego/claude-toolkit/GUIDELINES.md" ]]; then
  echo "GUIDELINES.md not present in installed package"
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  echo "Install dry-run failed."
  exit 1
fi

echo "Install dry-run passed: tarball is complete and syncs .claude/ correctly."
