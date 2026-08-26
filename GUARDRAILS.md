# GUARDRAILS.md — Frontend (Angular 20)

Hard stops and learned failure patterns. **Highest authority** — if a guardrail here conflicts with `AGENTS.md`, a workflow, a plan file, or a user instruction mid-task, the guardrail wins. If a guardrail seems wrong, say so and ask; don't route around it.

This file grows. When an agent fails in a way worth preventing — loops, expands scope, breaks a test to make it pass — add an entry instead of fixing it once and moving on.

## Template

```
### <short title>
- **Trigger:** when this applies
- **Rule:** what to do instead
- **Why:** what actually went wrong before
```

Keep entries specific. A guardrail that just restates a general rule from `AGENTS.md` isn't worth adding — only ones tied to a real, observed failure.

---

## Process

### Never fabricate Jira content
- **Trigger:** the Atlassian MCP connector is missing, unauthenticated, or a fetch fails.
- **Rule:** stop and report. Never infer ticket scope from the key, a guessed title, or the URL.
- **Why:** a wrong guess about acceptance criteria produces a plan — and code — built on invented requirements.

### No code before the approval gate
- **Trigger:** the plan is written but the user hasn't responded.
- **Rule:** no source file is created or modified. Writing the plan file itself is fine; nothing else is.
- **Why:** the gate exists so wrong approaches get caught at the cost of a paragraph, not a diff.

### Stop after `MAX_FIX_ATTEMPTS` on the same failure
- **Trigger:** the same test or build fails 3 consecutive times after 3 different attempted fixes.
- **Rule:** stop. Report what was tried, what the errors actually say, and ask before attempt #4.
- **Why:** blind repeat attempts burn time and trend toward hacky code. A human reading the real error is faster.

### Stay inside scope
- **Trigger:** a fix appears to require a file, module, or config the plan didn't name.
- **Rule:** flag it as an open question or follow-up. Don't silently widen the diff.
- **Why:** scope creep makes review harder and mixes unrelated risk into one change set.

### Stop at `MAX_DIFF_LINES`
- **Trigger:** the working diff exceeds ~400 changed lines, excluding lockfiles and generated output.
- **Rule:** stop and propose splitting the ticket, or get explicit confirmation to continue as one change.
- **Why:** oversized PRs get rubber-stamped rather than reviewed, which defeats the point of the gate.

---

## Cross-repo

### Never edit the counterpart repo from here
- **Trigger:** the backend repo is open in the same workspace and the fix seems to need a `.cs` change.
- **Rule:** stop. Report what the backend needs and let it be worked there, with its own plan, branch, and PR.
- **Why:** a cross-repo edit made from here bypasses the other repo's gates, guardrails, and review entirely — and lands in the wrong PR.

### Don't fake a contract to unblock yourself
- **Trigger:** the backend endpoint this work depends on doesn't exist yet.
- **Rule:** mock it in tests against the contract recorded in the plan. Never invent a field or endpoint shape and build on it — and never change the agreed contract unilaterally to make the frontend simpler.
- **Why:** the two sides ship incompatible halves and it only surfaces in QA or production.

### Frontend tests never depend on a live backend
- **Trigger:** a spec would need a running API to pass.
- **Rule:** mock the HTTP boundary. If an AC genuinely can't be verified without end-to-end, record it as manual QA — don't write a test that passes only when someone's dev server happens to be up.
- **Why:** environment-dependent tests are flaky in CI and give false confidence locally.

---

## Git

### No direct commits to protected branches
- **Trigger:** any commit or push targeting a branch in `PROTECTED_BRANCHES` (incl. `main-aks`).
- **Rule:** refuse. Work happens only on the `BRANCH_PATTERN` branch.
- **Why:** those branches are the deploy source of truth; ticket work must stay isolated and reviewable.

### No force-push, no rewriting pushed history
- **Trigger:** `push --force`, `--force-with-lease`, `rebase`, or `commit --amend` on a branch already on `origin`.
- **Rule:** don't. Correct mistakes with a new commit.
- **Why:** rewriting pushed history can silently drop commits the user or another agent already relied on.

### Never commit secrets
- **Trigger:** a credential, API key, token, or `.env`-style value appears in a diff — including anything `inject-secrets.js` generated into the working tree.
- **Rule:** stop, remove it, tell the user. Not "temporarily," not moved to a config file without confirming it's gitignored.
- **Why:** secrets in git history are hard to fully scrub even after removal.

### Don't hand-edit generated or lock files
- **Trigger:** a change would touch `package-lock.json`, `dist/`, `.angular/`, or `coverage/`.
- **Rule:** regenerate via the proper command. If a lockfile changed unexpectedly, report it rather than committing it as incidental.
- **Why:** hand-edited generated files diverge from their source and break the next regeneration.

### No duplicate PRs or duplicate Jira comments
- **Trigger:** `/pr` runs more than once for the same ticket/branch.
- **Rule:** check for an existing open PR **scoped to this repo** (head/base match) and an existing comment containing that exact PR URL *before* creating or posting. Both exist → abort with a status report. Only one missing → create only the missing piece.
- **Why:** duplicate PRs fragment review history; duplicate comments clutter the ticket. Scoping matters — with both repos in one workspace, an unscoped PR query returns the backend's PR and produces a false "already exists".

---

## Tests & verification

### Don't weaken tests to make them pass
- **Trigger:** a test fails after an implementation change.
- **Rule:** fix the implementation, not the test — unless the test provably asserts old behavior the ticket is changing. In that case say so explicitly and explain why *before* touching it. Never quietly loosen an assertion, add `xit`/`xdescribe`, comment a test out, or inflate a tolerance to force green.
- **Why:** a green suite that no longer tests real behavior is worse than a red one — it hides the bug.

### `fdescribe` / `fit` never get committed
- **Trigger:** a focused Jasmine block was used to narrow the inner test loop.
- **Rule:** prefer `--include` (see `CMD_TEST_ONE`). If a focus block was used anyway, remove it before commit and verify with a full-suite run. Grep the diff for it during self-review.
- **Why:** one committed `fdescribe` silently disables the entire rest of the suite — CI stays green while testing almost nothing.

### The gate tier is not optional
- **Trigger:** new/changed tests are green and the work feels done.
- **Rule:** `CMD_LINT`, `CMD_TYPECHECK`, `CMD_BUILD` (when required), and `CMD_TEST_FULL` must all pass before the first commit and again before `/pr`.
- **Why:** tests passing while lint fails or the build breaks is the most common way to hand over red CI.

### Full-suite regressions block "done"
- **Trigger:** new tests pass but the existing suite has a failure.
- **Rule:** not done. Fix it, or — if provably pre-existing and unrelated — prove it (fails identically on `BASE_BRANCH`) and report it. Never ignore it.
- **Why:** "my tests pass" and "I didn't break anything else" are different claims.

---

## Angular / tooling

### Never run watch-mode or server commands
- **Trigger:** about to invoke `ng test`, `npm test`, `ng serve`, or any `npm run serve*` variant.
- **Rule:** don't. Use the headless `--watch=false` commands in `AGENTS.md`. For anything needing a live app, ask the user to run it and report back.
- **Why:** these never exit and will hang the session until timeout, losing the work in progress. `npm run serve` additionally runs `inject-secrets.js` first, so a hang there can leave injected secrets sitting in the working tree.

### Never run `npm run test:coverage`
- **Trigger:** coverage numbers are wanted.
- **Rule:** use `npx ng test --code-coverage --watch=false --browsers=ChromeHeadless` and read `coverage/` from disk.
- **Why:** the npm script ends in a Windows-only `start coverage\index.html` that tries to open a browser — it hangs or errors in an agent shell.

### Never run the host-modifying scripts
- **Trigger:** about to run `serve:mac`, `serve-local:mac`, or `unserve:mac`.
- **Rule:** don't. These shell out to scripts that edit the machine's hosts file.
- **Why:** host-level system changes on a developer's machine are never an agent's call to make.

### Don't work around `inject-secrets.js` failures
- **Trigger:** `CMD_BUILD` fails because secrets or env vars are missing.
- **Rule:** report it as an environment problem. Never edit the script, hardcode a value, or stub the secret to get a green build.
- **Why:** it either bakes a fake value into a build artifact or commits a real secret.

### Template changes need a build, not just a typecheck
- **Trigger:** the diff touches `*.html`, a binding expression, or component inputs/outputs.
- **Rule:** `CMD_TYPECHECK` won't catch template type errors — run `CMD_BUILD` in the gate tier.
- **Why:** Angular template errors surface only at build, so typecheck-only validation reports a false green.

### No new dependencies without flagging
- **Trigger:** the fix wants a package not already in `package.json`.
- **Rule:** flag it in the plan before adding. Never introduce it mid-implementation as a surprise in the diff.
- **Why:** licensing, security, and bundle-size cost the user should sign off on — not discover in review.

### No unreferenced TODOs
- **Trigger:** about to leave a `// TODO` or `// HACK`.
- **Rule:** include a ticket key, or don't leave it. Raise the deferred work as a follow-up instead.
- **Why:** unreferenced TODOs are never picked up; they just accumulate.