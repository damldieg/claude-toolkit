---
name: ctk-commit
description: Prepare and create one safe, focused Git commit when explicitly invoked.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Inspect status and diff first. Never include unrelated, generated, secret, or suspicious files. Propose a concise conventional commit message and summarize included paths. If the scope is unclear or the diff contains unrelated work, stop and ask for direction. Once scope is clear, stage only intended files and create one commit. Do not push.
