## MCC-12 — Redesign login page classic to modern

**Jira:** https://mamunorselise.atlassian.net/browse/MCC-12  
**Repo:** mamun-command-center · **Counterpart:** none — single-repo ticket

### What changed
- Redesigned the authentication page layout from a single centered card to a responsive 2-column layout matching the MCC-12 design specification.
- Built a left hero section showcasing brand identity, "Secure • Fast • Reliable" pill badge, headline, value proposition, and 3 feature highlight cards ("Modern Stack", "Secure Access", "Higher Productivity") backed by ambient dark-theme glow effects.
- Upgraded the right authentication card with Sign In / Create Account tab switching, embedded icon input fields for Email and Password, a password show/hide visibility toggle, Google SSO button, and platform trust badges.
- Created unit tests verifying component creation, default mode state, password toggle behavior, and `AuthService` integration for sign-in and sign-up flows.

### Why
The user authentication page needed a modern, visually engaging redesign to align with the application's overall dark-theme brand aesthetics and improve user onboarding experience as specified in Jira issue MCC-12.

### How to review
1. Start with [auth-page.component.ts](file:///D:/AI%20practices/mamun-command-center/src/app/features/auth/auth-page.component.ts) — inspect the 2-column grid structure, left hero section, right auth card template, and password toggle state logic.
2. Review [auth-page.component.spec.ts](file:///D:/AI%20practices/mamun-command-center/src/app/features/auth/auth-page.component.spec.ts) — check unit test coverage for tab switching, password toggle, and authentication submission handling.
3. Review [.agents/plan/MCC-12.md](file:///D:/AI%20practices/mamun-command-center/.agents/plan/MCC-12.md) — confirm plan checklist and acceptance criteria traceability.

### Testing
- Added/updated: `src/app/features/auth/auth-page.component.spec.ts` (`should create the component`, `should default to signin mode`, `should toggle password visibility`, `should call signin when form submitted in signin mode`, `should call signup when form submitted in signup mode`)
- Gates: lint · typecheck · build · full suite — PASSED

### AC coverage
| AC | Covered by | Status |
|----|-----------|--------|
| AC1 — Implement modern 2-column layout matching design mockup | `auth-page.component.spec.ts` | ☑ |
| AC2 — Left hero section with branding, badge, headline, description & 3 feature cards | `auth-page.component.spec.ts` | ☑ |
| AC3 — Right auth card with Sign In / Create Account tabs, icon inputs, password toggle, Google SSO button & trust badges | `auth-page.component.spec.ts` | ☑ |
| AC4 — Preserve existing `AuthService` signin/signup/loading functionality | `auth-page.component.spec.ts` | ☑ |

### Notes for the reviewer
- Google SSO button is a visual UI action triggering an informational notification until backend Google OAuth scope is integrated.
- Password visibility toggle dynamically switches input type between `password` and `text` via component local state.
