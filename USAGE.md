# USAGE.md — How to run the agent workflow
---

## One-time setup

1. **Place the files** in each repo root:
   ```
   AGENTS.md · GUARDRAILS.md · USAGE.md
   .agents/workflows/{ticket,resume,verify,handoff,pr}.md
   .agents/plans/TEMPLATE.md
   ```
   Antigravity picks up `AGENTS.md` automatically and registers each workflow file as a slash command.

2. **Enable connectors** (Antigravity → MCP/connector settings):
   - **Atlassian** — needs read *and* write/comment scope. Read-only will break `/pr` step 7.
   - **GitHub or GitLab** (or `gh`/`glab` on PATH) — needs per-repo query scoping.

3. **Verify the toolchain once** so it doesn't fail mid-loop:
   - Frontend: `node -v`, and confirm Chrome/Chromium exists for `ChromeHeadless`.
   - Backend: `dotnet --version`.

4. **Confirm the .NET command table** in the backend's `AGENTS.md` on first real run. It ships with stack-standard defaults; if your solution needs a filter or a specific `.sln`, fix the table then.

5. **Commit `.agents/`.** Plan files are meant to be versioned — they're the audit trail of intent, and reviewers read them alongside the diff.

---

## The five commands

| Command | When | Writes code? |
|---------|------|--------------|
| `/ticket <jira-url> <sprint>` | Starting fresh on a ticket | Yes, after approval |
| `/resume [key]` | Continuing an interrupted ticket | Yes |
| `/verify [key]` | Checking whether work is actually done | **No** |
| `/handoff [key]` | Preparing the PR description | No (writes one md file) |
| `/pr [key]` | Opening the PR + linking Jira | No |

Normal sequence: **`/ticket` → approve → `/verify` → `/pr`.**
`/handoff` is optional — `/pr` runs it for you if the file is missing.
`/resume` is for recovery, not part of the happy path.

---
 
## Walkthrough — a normal ticket

**You:**
```
/ticket https://mamunorselise.atlassian.net/browse/MCC-4 sprint-1
```

**The agent then:** creates or checks out `sprint-1/MCC-4` off `main` and pushes it → pulls the ticket from Jira → explores the repo → writes `.agents/plans/MCC-4.md` → **stops.**

**You review the plan.** This is the checkpoint that decides whether the whole run is useful, so it's worth two real minutes:

- Does section 1 (summary in the agent's own words) match what the reporter actually wants? A mismatch here is the cheapest bug you'll ever catch.
- Does the traceability table cover every AC? An AC with no row will not get implemented.
- Are the assumptions ones you accept? They proceed silently if you don't object.
- Answer the blocking questions.

**Then reply.** Explicit approval — "approved", "go ahead", "yes, and for Q1 use the existing interceptor". The agent treats silence and unrelated messages as *not* approval, deliberately.

To change direction, just say so — the agent rewrites the plan and stops again. Iterating on a plan is far cheaper than iterating on a diff.

**Implementation** then runs on its own: per checklist item, write test → implement → run that one spec → tick the plan → commit. You'll get a commit per item, formatted `MCC-4 -guard null org id in export`.

It stops on its own if it hits `MAX_FIX_ATTEMPTS` (3 failures on the same test), exceeds `MAX_DIFF_LINES` (~400), or discovers work outside the plan.

**Then:**
```
/verify
```
Runs lint → typecheck → build → full suite, plus the pre-commit greps, and reports AC coverage. Ends in `READY FOR PR` or `BLOCKED — <reason>`.

`/verify` never edits code. If it comes back blocked, the fix goes through `/resume` or a plain instruction — that separation is intentional, so a verification run can't quietly "fix" its way to green.

**Then:**
```
/pr
```
Opens the PR against `main-aks`, comments `Frontend PR opened: <url>` (or `Backend`) on the ticket. Safe to re-run: if the PR and comment both exist, it aborts and does nothing.

---

## Walkthrough — a ticket spanning both repos

Both repos are worked **independently**. Same branch name, two plans, two PRs, two Jira comments.

1. **Backend first**, usually — it owns the contract the frontend consumes.
   ```
   [backend repo]  /ticket <url> sprint-104
   ```
   In the plan's cross-repo section, pin the contract precisely: endpoint, request/response shape, status codes. Approve it knowing the frontend will be built against exactly that.

2. **Frontend**, against the agreed contract.
   ```
   [frontend repo]  /ticket <url> sprint-104
   ```
   Copy the contract into its plan's cross-repo section. Its tests mock that boundary — frontend specs never require a live backend.

3. **Verify and PR each repo separately.** `/verify` flags when this side is gate-green but unmergeable because the counterpart hasn't landed. `/pr` in each repo; the `Frontend`/`Backend` label keeps the two Jira comments distinct.

4. **Merge in the stated order** — backend, then frontend.

If a ticket turns out to belong entirely to the other repo, the agent says so and stops instead of reaching across the workspace. Switch repos and run it there.

---

## Recovery

**Session died, context compacted, or you came back the next day:**
```
/resume IPEXAUDIT-2006
```
Reads the plan, reconciles it against actual commits and working-tree state, reports any mismatch, and continues from the first unticked item. If the plan is still `awaiting-approval`, it stops — a dead session doesn't count as approval.

**A gate is failing.** Read `/verify`'s output. If it says *environment* (missing secrets, no Chrome), that's yours to fix, not the agent's — the guardrails forbid working around it. If it says *code*, describe the fix or run `/resume`.

**The agent stopped after 3 attempts.** Read what it tried and what the error actually says. This stop exists because a fourth blind attempt is usually worse than the third. Give it the missing piece.

**The diff got too big.** Either approve continuing as one change, or split the ticket in Jira and run `/ticket` per piece.

**A guardrail blocked something you actually want.** Say so and why. Guardrails outrank instructions by design, so the agent will ask rather than comply — but a real exception is worth adding to `GUARDRAILS.md` as a documented carve-out, not overridden per-run.

---

## Model selection

Antigravity picks the model per dispatch, so this is your call, not the config's:

| Phase | Model | Why |
|-------|-------|-----|
| Explore + plan (`/ticket` steps 5–6) | **Opus or Gemini** | Deep reasoning over a large codebase; the plan is where accuracy pays off most |
| Implement + test loop (step 7) | **Sonnet** | Many fast iterations against a plan that's already settled |
| `/verify`, `/handoff`, `/pr` | Any | Mechanical |

Parallelize **exploration only** — fan out read-only subagents in Manager view, one question each. Keep writes single-agent, in one repo at a time; parallel editors produce conflicting diffs.

---

## Anti-patterns

- **Skipping the plan review.** The gate is the whole point. Approving unread makes this a slower version of "just do it."
- **Running `/pr` before `/verify`.** It'll warn you, but you'll be asking humans to review unverified work.
- **Fixing things during `/verify`.** It's read-only on purpose. Use `/resume`.
- **Editing the counterpart repo because it's right there.** Bypasses that repo's gates and lands in the wrong PR.
- **Letting workflow files drift between repos.** They're byte-identical by design (`diff -r` them). Only `AGENTS.md` and `GUARDRAILS.md` are stack-specific.
- **Treating a manual-QA AC as done.** It stays visible from plan to PR body precisely so it doesn't get lost.