---
name: ctk-push
description: Push the current branch safely when explicitly invoked.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Check repository status, current branch, remotes, upstream, and uncommitted changes. Refuse to push a dirty tree unless the user explicitly directs it. State the exact branch and remote before pushing. Use a normal push only; never force-push, set upstream, change remotes, or push protected/default branches without explicit user direction.
