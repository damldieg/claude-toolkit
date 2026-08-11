---
name: ctk-perf-audit
description: Read-only frontend performance audit — Core Web Vitals, bundle size, and unnecessary re-renders. Use when the user asks to check performance, bundle size, or Core Web Vitals, or investigate why a page/component feels slow.
disable-model-invocation: true
allowed-tools: Read Bash Glob Grep
---

Do not edit application code — this is a report; hand off actual fixes to the normal editing flow once findings are confirmed.

1. **Bundle size**: if the project has a build/analyze script (`next build`, `vite build`, a configured `webpack-bundle-analyzer`, etc.), run it and note total/route bundle sizes and the largest contributors. If no build tool is available in this environment, say so instead of guessing.
2. **Core Web Vitals**: if the project ships real-user or lab metrics (Lighthouse CI config, a `web-vitals` integration, existing Lighthouse reports), read the most recent results. Do not fabricate scores if none are available — say measurement isn't wired up and stop there for this section.
3. **Unnecessary renders**: grep for common anti-patterns relevant to the project's framework — e.g. React: missing memoization on expensive lists/components re-created every render, inline object/function literals passed as props to memoized children, effects with over-broad dependency arrays; Vue: unnecessary deep watchers, missing `v-once`/`computed` where a derived value is recomputed inline. Flag concrete instances with file/line, not generic advice.

Report grouped by the three areas above, each finding with file/line and expected impact (e.g. "re-created on every keystroke" vs "one-time cost on mount"). If a section couldn't be measured, say so explicitly rather than omitting it silently.
