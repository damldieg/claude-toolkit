---
name: ctk-web-qa
description: Run this project's critical user flows headless with Playwright and report pass/fail with screenshots on failure. Manual/milestone use only — invoke explicitly at a milestone close, never automatically after a routine edit.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash
---

Reserved for a milestone close (see `GUIDELINES.md`'s validation levels) or an explicit user request — not for routine edits.

1. Confirm Playwright is set up: look for `playwright.config.*` and an existing e2e/test directory (commonly `e2e/`, `tests/e2e/`, or similar). If neither exists, say so and stop rather than scaffolding a new test setup — that's a task for the user or `ctk-feature-normal`, not this skill.
2. Identify the critical flows to run: prefer an existing tagged/critical subset (e.g. a `@critical` tag, a `smoke` project, or a named test file) over running the entire suite. Ask the user which flows count as critical if none are marked and it isn't obvious.
3. Run headless: `npx playwright test <selected flows>` (adjust the runner to the project's actual package manager/script). Do not modify test files to make them pass.
4. On failure, locate the screenshots/traces Playwright wrote (its default `test-results/` output, or the project's configured output dir) and reference their paths in the report — don't move or re-render them.
5. Report: which flows ran, pass/fail per flow, and screenshot/trace paths for failures. Do not claim a flow passed if it didn't run.
