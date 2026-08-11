---
name: ctk-git-status
description: Safely summarize the current Git branch, working tree, upstream divergence, and recent commits.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Read-only. Inspect git status, current branch, upstream status when configured, and recent relevant commits. Summarize what is safe to do next. Do not alter files, stage, commit, push, fetch, pull, or rebase.
