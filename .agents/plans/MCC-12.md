# MCC-12 — Redesign login page classic to modern

- **Jira:** https://mamunorselise.atlassian.net/browse/MCC-12
- **Repo:** mamun-command-center · **Counterpart:** none — single-repo ticket
- **Branch:** `sprint-1/MCC-12`
- **Base:** `main`
- **Status:** `pr-open`
- **Last updated:** 2026-10-03

> Working state for this ticket **in this repo**. Tick items as they complete. Survives context compaction and session restarts — `/resume` reads it to find where to continue. Commit it alongside the work.

## 1. Summary

Redesign the authentication page (`AuthPageComponent`) from the previous simple centered card view into the new, modern 2-column layout based on the design mockup attached to Jira issue MCC-12 (`53658cd5-c5c7-4bfa-807f-2ad290fe5564.png`). The new layout features a left hero section with branding, value proposition, ambient dark theme graphics, and key feature highlights, paired with a right-hand polished auth container supporting Sign In / Create Account modes, icon-enriched input fields, password toggle, Google SSO button, and platform trust metrics.

## 2. Current vs. expected behavior

- **Current:** `src/app/features/auth/auth-page.component.ts` displays a basic single-column centered card with basic input fields and a simple dark background.
- **Expected:** Full-screen modern 2-column responsive layout with deep ambient dark theme (purple/indigo/cyan glows), hero branding & value props on the left, and an upgraded auth card on the right with tab switching, embedded input icons, password show/hide button, Google SSO button, and trust badges, maintaining full functional parity with `AuthService`.
- **Root cause:** Modern design spec upgrade provided in MCC-12 attachment to enhance user onboarding experience.

## 3. Proposed approach

| File | Change | Why |
|------|--------|-----|
| `src/app/features/auth/auth-page.component.ts` | Overhaul template & styling to match MCC-12 redesign mockup | Deliver the modern 2-column UI layout, hero visuals, tab toggle, icon inputs, password visibility toggle, SSO button, and trust badges |
| `src/app/features/auth/auth-page.component.spec.ts` | Create unit test suite for `AuthPageComponent` | Validate component creation, mode switching (Sign In / Create Account), form validation, and `AuthService` integration |

## 4. Acceptance-criteria traceability

| AC | Covered by | Verified |
|----|-----------|----------|
| AC1 — Implement modern 2-column layout matching design mockup | `src/app/features/auth/auth-page.component.spec.ts` | ☑ |
| AC2 — Left hero section with branding, badge, headline, description & 3 feature cards | `src/app/features/auth/auth-page.component.spec.ts` | ☑ |
| AC3 — Right auth card with Sign In / Create Account tabs, icon inputs, password toggle, Google SSO button & trust badges | `src/app/features/auth/auth-page.component.spec.ts` | ☑ |
| AC4 — Preserve existing `AuthService` signin/signup/loading functionality | `src/app/features/auth/auth-page.component.spec.ts` | ☑ |

## 5. Checklist

- [x] 1. Create unit tests for `AuthPageComponent` → `src/app/features/auth/auth-page.component.spec.ts`
- [x] 2. Redesign login page layout, hero section, form controls, tabs, icons, and trust badges → `src/app/features/auth/auth-page.component.ts`
- [x] 3. Self-review diff against plan + ACs
- [x] 4. Gate tier: lint + typecheck + build + test suite

## 6. Open questions

### Blocking — cannot proceed without answers
- none

### Assumptions — proceeding this way unless told otherwise
- Google SSO button is a visual UI action for OAuth integration (matches mock), firing a placeholder/notification when clicked until backend Google OAuth scope is active.
- Password show/hide toggle toggles input `type="password"` / `type="text"` locally within component state.

## 7. Log

- `2026-10-03` — plan drafted, approved by user
- `2026-10-03` — created `auth-page.component.spec.ts`
- `2026-10-03` — redesigned `auth-page.component.ts` to modern 2-column layout matching MCC-12 design mockup
- `2026-10-03` — verified Angular application build and tests passing cleanly
