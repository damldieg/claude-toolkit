---
name: ctk-rebase
description: Safely rebase the current branch onto a user-specified base branch when explicitly invoked.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Require an explicit base branch. Check that the current branch is not the base, the working tree is clean, and the repository state is understood. State the exact rebase command before running it. If conflicts occur, stop after reporting affected files and available resolution choices. Never use force push, discard changes, continue a rebase, or abort one without explicit user direction.
