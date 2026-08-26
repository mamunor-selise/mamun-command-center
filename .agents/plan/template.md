# {TICKET_KEY} — {ticket summary}

- **Jira:** {TICKET_URL}
- **Repo:** {this repo} · **Counterpart:** {other repo, or `none — single-repo ticket`}
- **Branch:** `sprint-{n}/{TICKET_KEY}`
- **Base:** `main-aks`
- **Status:** `planning` → `awaiting-approval` → `in-progress` → `verified` → `pr-open`
- **Last updated:** {date}

> Working state for this ticket **in this repo**. Tick items as they complete. Survives context compaction and session restarts — `/resume` reads it to find where to continue. Commit it alongside the work.

## 1. Summary

{The ticket restated in the agent's own words — not copy-pasted from Jira. If this doesn't match the reporter's intent, that's the cheapest possible place to catch it.}

## 2. Current vs. expected behavior

- **Current:** {what happens now, with the file/line where it originates}
- **Expected:** {what should happen per the ACs}
- **Root cause:** {why it happens — not just where}

## 3. Proposed approach

| File | Change | Why |
|------|--------|-----|
| `src/...` | {change} | {reason} |

{Patterns followed, alternatives rejected and why.}

## 4. Cross-repo contract

Delete this section for single-repo tickets. Otherwise be precise — vagueness here is what causes the two sides to ship incompatible code.

- **Boundary:** {endpoint / DTO / event}
- **Shape:** {method, path, request payload, response payload, status codes}
- **Owner:** {which repo defines it}
- **Merge order:** {which PR must land first, and why}
- **This repo's side:** {consumer | producer}

## 5. Acceptance-criteria traceability

Every AC this repo is responsible for gets a row. Anything landing in "manual QA" must appear in the final report — never quietly dropped.

| AC | Covered by | Verified |
|----|-----------|----------|
| AC1 — {criterion} | `{test name}` | ☐ |
| AC2 — {criterion} | manual QA — no automated coverage | ☐ |
| AC3 — {criterion} | **counterpart repo** | n/a |

## 6. Checklist

One commit per completed item. Each item names its test and its target file.

- [ ] 1. {Add failing test} → `{test file}`
- [ ] 2. {Implementation change} → `{source file}`
- [ ] 3. {Next increment} → `{file}`
- [ ] 4. Self-review diff against plan + ACs
- [ ] 5. Gate tier: lint + typecheck + build + full suite

## 7. Open questions

### Blocking — cannot proceed without answers
- {question}, or `none`

### Assumptions — proceeding this way unless told otherwise
- {assumption and the reasoning behind it}, or `none`

## 8. Log

Appended as work proceeds. Keeps `/resume` accurate and gives the PR body something real to draw on.

- `{date}` — plan drafted, awaiting approval