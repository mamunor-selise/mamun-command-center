# PLAYWRIGHT-CI — Playwright E2E Automation Testing on GitHub PRs

- **Jira:** n/a — infrastructure task
- **Repo:** mamun-command-center · **Counterpart:** none — single-repo ticket
- **Branch:** `sprint-1/MCC-12`
- **Base:** `main`
- **Status:** `verified`
- **Last updated:** 2026-10-03

> Working state for this ticket **in this repo**. Tick items as they complete. Survives context compaction and session restarts — `/resume` reads it to find where to continue. Commit it alongside the work.

## 1. Summary

Set up Playwright End-to-End (E2E) automation testing for the Angular application, configured to automatically execute on GitHub Pull Requests targeting the `main` branch via GitHub Actions CI.

## 2. Current vs. expected behavior

- **Current:** Repository currently has Karma/Jasmine unit testing configured, but no E2E testing framework or GitHub Actions CI workflow to execute automated E2E browser tests on PR submission.
- **Expected:** Playwright installed and configured locally (`playwright.config.ts` with local Angular dev server spin-up), initial E2E test suite written (`e2e/*.spec.ts`), and a GitHub Actions workflow (`.github/workflows/playwright.yml`) triggered automatically when a Pull Request is opened or updated against `main`.
- **Root cause:** Continuous integration & E2E quality gate automation setup.

## 3. Proposed approach

| File | Change | Why |
|------|--------|-----|
| `package.json` | Add `@playwright/test` devDependency and `"test:e2e"` / `"test:e2e:ui"` scripts | Enable running Playwright E2E tests locally and in CI environment |
| `playwright.config.ts` | Create Playwright configuration file with `webServer` auto-launch (`http://localhost:4200`), base URL, and headless options | Standardize test runner settings across local and CI environments |
| `e2e/auth.spec.ts` | Add E2E tests for Auth page (hero section elements, sign-in/sign-up tab switching, password toggle, form validation) | Ensure critical authentication UI workflows function end-to-end in real browser |
| `e2e/smoke.spec.ts` | Add smoke tests verifying page loading and main routing | Provide fast feedback on general app health |
| `.github/workflows/playwright.yml` | Create GitHub Actions CI workflow triggered on `pull_request` for `main` branch | Run Playwright tests on PR creation/update, upload html report artifact on failure |
| `.gitignore` | Add `playwright-report/`, `test-results/`, `blob-report/` | Exclude generated Playwright artifacts from git tracking |

## 4. Acceptance-criteria traceability

| AC | Covered by | Verified |
|----|-----------|----------|
| AC1 — Playwright dependencies, npm scripts & `playwright.config.ts` configured | `playwright.config.ts`, `package.json` | ☑ |
| AC2 — E2E test suite created covering Auth page & core smoke checks | `e2e/auth.spec.ts`, `e2e/smoke.spec.ts` | ☑ |
| AC3 — GitHub Actions workflow runs Playwright E2E tests on PR creation/synchronize | `.github/workflows/playwright.yml` | ☑ |
| AC4 — Artifact upload configured for Playwright HTML report on test failure | `.github/workflows/playwright.yml` | ☑ |

## 5. Checklist

- [x] 1. Install `@playwright/test` and update `package.json` scripts → `package.json`
- [x] 2. Create Playwright configuration file → `playwright.config.ts`
- [x] 3. Create E2E test suite → `e2e/auth.spec.ts`, `e2e/smoke.spec.ts`
- [x] 4. Create GitHub Actions PR workflow → `.github/workflows/playwright.yml`
- [x] 5. Update `.gitignore` to ignore Playwright report & result folders → `.gitignore`
- [x] 6. Self-review diff against plan + ACs
- [x] 7. Gate tier: lint + typecheck + build + test suite + `npm run test:e2e`

## 6. Open questions

### Blocking — cannot proceed without answers
- none

### Assumptions — proceeding this way unless told otherwise
- Use Chromium as the default browser in CI to keep runtimes fast, while allowing optional multi-browser runs locally.
- Angular dev server (`ng serve` / `npm start`) will automatically start via Playwright's `webServer` block in `playwright.config.ts`.
- GitHub Actions runner uses `ubuntu-latest` with standard `actions/checkout` and `actions/setup-node`.

## 7. Log

- `2026-10-03` — plan drafted for Playwright automation testing setup on GitHub PRs
- `2026-10-03` — MCC-12: implemented and verified Playwright E2E testing suite & GitHub Actions workflow
