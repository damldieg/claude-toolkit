---
name: ctk-abstraction-check
description: Read-only checklist to catch over-abstraction in the current diff — unnecessary hooks/wrappers, indirection without a concrete second use case, or premature generalization. Use when reviewing your own or AI-generated changes before a commit, or when a diff feels more layered than the problem it solves.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Do not edit. Inspect the current diff (`git diff`, `git diff --staged`, or the files named by the user). For each new abstraction introduced — function extracted into a helper, wrapper/hook, interface, factory, config flag, new module/file — check:

- **Second use case**: is it called from more than one place right now, or justified by exactly one? One caller is not a reason to extract.
- **Concrete need vs hypothetical**: does it solve a requirement in this task, or a future variant that doesn't exist yet ("in case we need to swap X later")?
- **Indirection cost**: does it make the code easier to follow, or does the reader now have to jump through a layer to see what actually happens?
- **Naming smell**: generic names (`Manager`, `Handler`, `Service`, `Base*`, `*Factory`) standing in for something that does one specific, nameable thing.
- **Size vs weight**: a new file/module/class for a handful of lines that would read fine inline in the caller.
- **Config/flags**: a flag or option branch with only one value ever passed.

Report each finding as: location, what was abstracted, which check it fails, and the simpler alternative (usually: inline it, or wait for the second caller). Do not flag abstractions that already have two or more real call sites, or that match an existing pattern elsewhere in the codebase. If nothing qualifies, say so plainly instead of inventing marginal findings.
