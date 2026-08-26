# MCC-7 — Rename “Password & Credentials Vault” to “Confidential Secrets”

- **Jira:** https://mamunorselise.atlassian.net/browse/MCC-7
- **Repo:** mamunor-selise/mamun-command-center · **Counterpart:** none — single-repo ticket
- **Branch:** `sprint-1/MCC-7`
- **Base:** `main`
- **Status:** `pr-open`
- **Last updated:** 2026-08-26

> Working state for this ticket **in this repo**. Tick items as they complete. Survives context compaction and session restarts — `/resume` reads it to find where to continue. Commit it alongside the work.

## 1. Summary

The user interface currently refers to the secure client-side storage feature as "Password & Credentials Vault" (header) and "Password Vault" (sidebar). This ticket requires renaming all user-facing references to "Confidential Secrets" to reflect updated product terminology. The page URL route will also be updated from `/vault` to `/confidential-secrets` for consistency.

## 2. Current vs. expected behavior

- **Current:**
  - Sidebar label is "Password Vault" and routes to `/vault` ([sidebar.component.ts:151](file:///d:/AI%20practices/mamun-command-center/src/app/shared/components/sidebar/sidebar.component.ts#L151)).
  - Routing path is `'vault'` ([app.routes.ts:15](file:///d:/AI%20practices/mamun-command-center/src/app/app.routes.ts#L15)).
  - Page header displays "🔐 Password & Credentials Vault" ([vault-page.component.ts:26](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L26)).
  - Unlock form header is "Unlock Your Vault" ([vault-page.component.ts:74](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L74)).
  - Unlock button/status says "🔓 Unlock Vault" and "Decrypting Vault..." ([vault-page.component.ts:111](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L111)).
  - Lock button is "🔒 Lock Vault" ([vault-page.component.ts:62](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L62)).
  - Empty state displays "No Vault Secrets Found" ([vault-page.component.ts:157](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L157)).
  - Dialog edit mode displays "Edit Vault Secret" ([vault-page.component.ts:282](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts#L282)).

- **Expected:**
  - Sidebar label is "Confidential Secrets" and routes to `/confidential-secrets`.
  - Routing path is `'confidential-secrets'`.
  - Page header displays "🔐 Confidential Secrets".
  - Unlock form header is "Unlock Confidential Secrets".
  - Unlock button/status says "🔓 Unlock Secrets" and "Decrypting Secrets...".
  - Lock button is "🔒 Lock Secrets".
  - Empty state displays "No Confidential Secrets Found".
  - Dialog edit mode displays "Edit Confidential Secret".

- **Root cause:**
  - Outdated naming of the vault features in user-facing components.

## 3. Proposed approach

| File | Change | Why |
|------|--------|-----|
| [`sidebar.component.ts`](file:///d:/AI%20practices/mamun-command-center/src/app/shared/components/sidebar/sidebar.component.ts) | Change sidebar label to `'Confidential Secrets'` and route to `'/confidential-secrets'` | Update sidebar text and navigation route. |
| [`app.routes.ts`](file:///d:/AI%20practices/mamun-command-center/src/app/app.routes.ts) | Update path `'vault'` to `'confidential-secrets'` | Align URL path with the new feature name. |
| [`vault-page.component.ts`](file:///d:/AI%20practices/mamun-command-center/src/app/features/vault/vault-page.component.ts) | Update template strings: page title, unlock card title, unlock/lock buttons, empty state, and edit dialog header | Update all user-facing names to "Confidential Secrets" or "Secrets". |

*Alternatives rejected:*
- **Renaming code symbols, directories, and files (e.g., `VaultService`, `VaultPageComponent`):** Rejected because it drastically inflates the size and complexity of the diff with zero functional improvement, and increases risks of broken import paths and module configuration issues. Keeping internal structure as-is is cleaner for a simple renaming request.
- **Renaming API endpoints (`/api/vault`) and database collections (`vault_items`):** Rejected to prevent database schema mismatch or requiring database migrations. The backend can continue using "vault" internally.

## 5. Acceptance-criteria traceability

| AC | Covered by | Verified |
|----|-----------|----------|
| AC1 — Sidebar navigation label updated to "Confidential Secrets" | `should render sidebar link for confidential-secrets` in `sidebar.component.spec.ts` | ☐ |
| AC2 — Routing URL path updated to `/confidential-secrets` | `should navigate to /confidential-secrets` in `app.component.spec.ts` | ☐ |
| AC3 — Page heading updated to "🔐 Confidential Secrets" | `should render Confidential Secrets heading` in `vault-page.component.spec.ts` | ☐ |
| AC4 — Unlock view header updated to "Unlock Confidential Secrets" | `should render Unlock card title` in `vault-page.component.spec.ts` | ☐ |
| AC5 — Unlock button and status updated to "🔓 Unlock Secrets" / "Decrypting Secrets..." | `should render Unlock button and status` in `vault-page.component.spec.ts` | ☐ |
| AC6 — Lock button updated to "🔒 Lock Secrets" | `should render Lock button` in `vault-page.component.spec.ts` | ☐ |
| AC7 — Empty state updated to "No Confidential Secrets Found" | `should render empty state message` in `vault-page.component.spec.ts` | ☐ |
| AC8 — Edit dialog title updated to "Edit Confidential Secret" | `should render Edit dialog title` in `vault-page.component.spec.ts` | ☐ |

## 6. Checklist

One commit per completed item. Each item names its test and its target file.

- [x] 1. Create unit tests for user-facing changes in VaultPageComponent template → `src/app/features/vault/vault-page.component.spec.ts`
- [x] 2. Update routing path for vault page → `src/app/app.routes.ts`
- [x] 3. Update sidebar configuration label and routing path → `src/app/shared/components/sidebar/sidebar.component.ts`
- [x] 4. Update user-facing text strings in VaultPageComponent → `src/app/features/vault/vault-page.component.ts`
- [x] 5. Self-review diff against plan + ACs
- [x] 6. Gate tier: lint + typecheck + build + full suite

## 7. Open questions

### Blocking — cannot proceed without answers
- none

### Assumptions — proceeding this way unless told otherwise
- We will only rename user-facing UI labels, routes, and page strings to match the new naming.
- We will NOT rename backend files, endpoints, or DB collections to avoid schema/API compatibility issues.
- We will keep internal class and service names (e.g. `VaultService`, `VaultPageComponent`) as-is to avoid a bloated git diff and keep the scope strictly focused.

## 8. Log

- `2026-08-26` — plan drafted, awaiting approval
- `2026-08-26` — implementation and verification complete: added unit tests, updated routing, sidebar config, and template labels; verified build and typechecks pass. Status marked as verified.
