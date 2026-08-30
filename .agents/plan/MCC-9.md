# MCC-9 — Rename Generic “Mamun Center” Branding to “SecureOps Center”

- **Jira:** https://mamunorselise.atlassian.net/browse/MCC-9
- **Repo:** mamun-command-center · **Counterpart:** none — single-repo ticket
- **Branch:** `sprint-1/MCC-9`
- **Base:** `main`
- **Status:** `pr-open`
- **Last updated:** 2026-08-29

> Working state for this ticket **in this repo**. Tick items as they complete. Survives context compaction and session restarts — `/resume` reads it to find where to continue. Commit it alongside the work.

## 1. Summary

Replace all occurrences of current generic/personal product branding "Mamun Center" and "Mamun Command Center" across the UI, navigation, header, page titles, footer, app components, auth pages, and AI service headers with the new product name "SecureOps Center".

## 2. Current vs. expected behavior

- **Current:** 
  - Header breadcrumb & navigation displays "Mamun Center" in `src/app/shared/components/header/header.component.ts` (L55) and default page title "Mamun Command Center" (L140).
  - Sidebar logo header displays "Mamun Center" in `src/app/shared/components/sidebar/sidebar.component.ts` (L50).
  - Main App footer displays "Mamun Command Center • Dark & Light Mode Theme Support (MCC-3)" in `src/app/app.component.ts` (L45) and component `title = 'mamun-command-center'` (L56).
  - Spec `src/app/app.component.spec.ts` asserts `title` equals `'mamun-command-center'`.
  - HTML page title in `src/index.html` (L5) is `<title>Mamun Command Center</title>`.
  - Next.js layout in `src/app/layout.tsx` (L5) sets `title: "Mamun Command Center"`.
  - Auth page branding displays "Mamun Command Center" in `src/app/features/auth/auth-page.component.ts` (L23 & L134).
  - Secondary navbar in `src/app/shared/components/navbar/navbar.component.ts` (L18) displays "Mamun Command Center".
  - Chatbot service system prompt & HTTP header in `src/app/core/services/chatbot.service.ts` (L79, L120, L134) refers to "Mamun's AI Command Center Assistant" and `'X-Title': 'Mamun Command Center'`.
  - Serverless API endpoints in `api/chat.js` (L43) and `api/ai-trends.js` (L542) pass `'X-Title': 'Mamun Command Center'`.

- **Expected:**
  - All UI elements, header breadcrumbs, sidebar title, page titles, footer text, auth page branding, navbar title, chatbot assistant prompt, and API header titles display "SecureOps Center" (or "SecureOps AI Assistant").
  - `src/app/app.component.ts` property `title` updated to `'secure-ops-center'` (and spec updated accordingly).

- **Root cause:** Legacy personal naming was used during early platform bootstrapping; replacing with "SecureOps Center" establishes a professional product identity across all application surfaces.

## 3. Proposed approach

| File | Change | Why |
|------|--------|-----|
| `src/index.html` | Update `<title>` to `SecureOps Center` | Page browser tab title |
| `src/app/layout.tsx` | Update `title` metadata to `"SecureOps Center"` | Next.js layout metadata |
| `src/app/app.component.ts` | Update `title` property to `'secure-ops-center'` and footer text to `SecureOps Center • Dark & Light Mode Theme Support` | Root app title property and main footer |
| `src/app/app.component.spec.ts` | Update title assertion to `'secure-ops-center'` | Keep root unit tests passing |
| `src/app/shared/components/sidebar/sidebar.component.ts` | Update sidebar brand text from `Mamun Center` to `SecureOps Center` | Sidebar navigation header |
| `src/app/shared/components/header/header.component.ts` | Update breadcrumb `Mamun Center` and default title `Mamun Command Center` to `SecureOps Center` | Main header bar |
| `src/app/shared/components/navbar/navbar.component.ts` | Update navbar brand text from `Mamun Command Center` to `SecureOps Center` | Secondary top navbar |
| `src/app/features/auth/auth-page.component.ts` | Update auth header (L23) and footer (L134) to `SecureOps Center` | Auth login/signup page |
| `src/app/core/services/chatbot.service.ts` | Update system prompt to `SecureOps AI Assistant` and `X-Title` header to `SecureOps Center` | AI chatbot service |
| `api/chat.js` | Update `X-Title` header to `SecureOps Center` | Serverless chat API |
| `api/ai-trends.js` | Update `X-Title` header to `SecureOps Center` | Serverless AI trends API |

## 4. Acceptance-criteria traceability

| AC | Covered by | Verified |
|----|-----------|----------|
| AC1 — No unintended references to `Mamun Center` remain in the UI | `src/app/shared/components/sidebar/sidebar.component.ts` & `src/app/shared/components/header/header.component.ts` | ☑ |
| AC2 — `Mamun Command Center` is replaced with `SecureOps Center` | `src/app/app.component.ts`, `src/index.html`, `src/app/layout.tsx` | ☑ |
| AC3 — Branding is consistent across navigation, header, footer, and application metadata | `src/app/shared/components/navbar/navbar.component.ts`, `src/app/features/auth/auth-page.component.ts` | ☑ |
| AC4 — Existing functionality is unaffected | `src/app/app.component.spec.ts` suite execution | ☑ |
| AC5 — Both Light and Dark modes display the new branding correctly | Manual QA inspection across theme toggles | ☑ |

## 5. Checklist

- [x] 1. Update unit test assertion in `src/app/app.component.spec.ts` → `src/app/app.component.spec.ts`
- [x] 2. Update root app component title & footer branding in `src/app/app.component.ts` → `src/app/app.component.ts`
- [x] 3. Update index.html and layout.tsx app titles → `src/index.html`, `src/app/layout.tsx`
- [x] 4. Update sidebar header branding in `src/app/shared/components/sidebar/sidebar.component.ts` → `src/app/shared/components/sidebar/sidebar.component.ts`
- [x] 5. Update header breadcrumb and default title in `src/app/shared/components/header/header.component.ts` → `src/app/shared/components/header/header.component.ts`
- [x] 6. Update navbar brand header in `src/app/shared/components/navbar/navbar.component.ts` → `src/app/shared/components/navbar/navbar.component.ts`
- [x] 7. Update auth page headers and footers in `src/app/features/auth/auth-page.component.ts` → `src/app/features/auth/auth-page.component.ts`
- [x] 8. Update chatbot service prompt and request headers in `src/app/core/services/chatbot.service.ts` → `src/app/core/services/chatbot.service.ts`
- [x] 9. Update serverless API request headers in `api/chat.js` and `api/ai-trends.js` → `api/chat.js`, `api/ai-trends.js`
- [x] 10. Self-review diff against plan + ACs
- [x] 11. Gate tier: lint + typecheck + build

## 6. Open questions

### Blocking — cannot proceed without answers
- none

### Assumptions — proceeding this way unless told otherwise
- `authService.currentUser()?.name` ("Mamun Or Rashid" / user name) and personal CV data are user-specific data and should remain untouched; only application product branding ("Mamun Center" / "Mamun Command Center") is rebranded to "SecureOps Center".

## 7. Log

- `2026-08-29` — plan drafted, awaiting approval
- `2026-08-29` — plan approved, updated branding to SecureOps Center across components, services, and API headers. Gate verification passed.
