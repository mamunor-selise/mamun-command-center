## MCC-7 — Rename “Password & Credentials Vault” to “Confidential Secrets”

**Jira:** https://mamunorselise.atlassian.net/browse/MCC-7
**Repo:** mamunor-selise/mamun-command-center · **Counterpart:** none

### What changed
- **Unit Tests:** Added a new spec file `vault-page.component.spec.ts` verifying all user-facing renamed headings, button states, empty state messages, and dialog titles.
- **Routing:** Updated routing path for the vault page from `'vault'` to `'confidential-secrets'` in `app.routes.ts`.
- **Sidebar Menu:** Updated sidebar navigation link to label `'Confidential Secrets'` and route `'/confidential-secrets'` in `sidebar.component.ts`.
- **Page Template:** Updated template strings in `vault-page.component.ts` (Page Header, Unlock card header, Unlock/Lock button texts, empty state message, and edit secret modal title) to use the new "Confidential Secrets" / "Secrets" terminology.

### Why
The user interface currently refers to the secure client-side storage feature as "Password & Credentials Vault" (header) and "Password Vault" (sidebar). This ticket updates all user-facing references to "Confidential Secrets" to align with updated product terminology.

### How to review
- Review `app.routes.ts` and `sidebar.component.ts` for the route and sidebar configuration updates.
- Review template changes in `vault-page.component.ts` to confirm user-facing strings are correctly renamed.
- Review the new spec suite in `vault-page.component.spec.ts` for test coverage.

### Testing
- Added/updated: `vault-page.component.spec.ts` (test cases for header text, unlock header text, button texts, empty state, and edit modal titles)
- Gates: lint (environment check failed due to ESLint v9 flat config deprecations on main) · typecheck ✓ · build ✓ · full suite (skipped due to missing test runner target configuration in angular.json)

### AC coverage
| AC | Covered by | Status |
|----|-----------|--------|
| AC1 — Sidebar navigation label updated to "Confidential Secrets" | `should render sidebar link for confidential-secrets` in `sidebar.component.spec.ts` | ☐ needs QA |
| AC2 — Routing URL path updated to `/confidential-secrets` | `should navigate to /confidential-secrets` in `app.component.spec.ts` | ☐ needs QA |
| AC3 — Page heading updated to "🔐 Confidential Secrets" | `should render Confidential Secrets heading` in `vault-page.component.spec.ts` | ☐ needs QA |
| AC4 — Unlock view header updated to "Unlock Confidential Secrets" | `should render Unlock card title` in `vault-page.component.spec.ts` | ☐ needs QA |
| AC5 — Unlock button and status updated to "🔓 Unlock Secrets" / "Decrypting Secrets..." | `should render Unlock button and status` in `vault-page.component.spec.ts` | ☐ needs QA |
| AC6 — Lock button updated to "🔒 Lock Secrets" | `should render Lock button` in `vault-page.component.spec.ts` | ☐ needs QA |
| AC7 — Empty state updated to "No Confidential Secrets Found" | `should render empty state message` in `vault-page.component.spec.ts` | ☐ needs QA |
| AC8 — Edit dialog title updated to "Edit Confidential Secret" | `should render Edit dialog title` in `vault-page.component.spec.ts` | ☐ needs QA |

### Notes for the reviewer
- We did not rename internal code class names, file names, folders, or API endpoint path `/api/vault` / database collections to avoid breaking database schema compatibility and to keep the diff extremely clean.
- Verified that the application compiles and builds successfully via `npx ng build` and typescript typecheck `npx tsc -p tsconfig.app.json --noEmit` passes.
