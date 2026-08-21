---
description: Security-first implementation guidance for building a
  password vault, including cryptography, key management,
  authentication, vault locking, secret storage, sharing, auditability,
  recovery, API design, UI behavior, testing, and security review.
name: password-vault
---

# Password Vault Skill

## Purpose

Use this skill whenever implementing, reviewing, or modifying a
password-vault feature.

The vault must be designed as a **security-critical component**. Treat
stored passwords, API keys, recovery codes, notes, tokens, and other
secrets as highly sensitive data.

The primary goals are:

1.  Never store plaintext vault secrets.
2.  Minimize the amount of sensitive data exposed to the server, logs,
    browser storage, and application telemetry.
3.  Use well-established cryptographic primitives rather than custom
    cryptography.
4.  Make vault locking and session expiration explicit.
5.  Prevent accidental secret disclosure through APIs, UI, errors, logs,
    analytics, and debugging.
6.  Make destructive and security-sensitive operations deliberate and
    auditable.

------------------------------------------------------------------------

## 1. Security Architecture

Prefer a **zero-knowledge / client-side encryption model** when the
product requirements allow it.

Recommended high-level flow:

``` text
User Password
     |
     v
Key Derivation Function
     |
     v
Vault Encryption Key
     |
     +----> Encrypt Vault Items
     |
     +----> Encrypt sensitive metadata
     |
     v
Encrypted Vault
     |
     v
Server / Database
```

The server should preferably store ciphertext and the minimum metadata
required for synchronization, authorization, sharing, and auditing.

Do not send the user's master password to the backend as a normal
application field.

Do not use reversible encryption as a replacement for password hashing.

------------------------------------------------------------------------

## 2. Cryptography

Use established libraries and platform cryptography APIs.

### Password / Master Password Derivation

Use a password-based key derivation function such as:

-   Argon2id --- preferred where supported.
-   PBKDF2-HMAC-SHA-256 --- acceptable when Argon2id is unavailable or
    platform requirements require it.

Use a unique, cryptographically random salt for every vault.

Do not use:

-   MD5
-   SHA-1
-   Plain SHA-256 for password derivation
-   Fixed salts
-   Application-wide static salts
-   Home-grown KDFs

KDF parameters must be configurable so they can be increased as hardware
improves.

Example conceptual model:

``` text
masterPassword + randomSalt
        |
        v
      Argon2id
        |
        v
    vaultKey
```

Never store the master password.

------------------------------------------------------------------------

## 3. Encryption

Use authenticated encryption.

Preferred:

``` text
AES-256-GCM
```

Alternative where appropriate:

``` text
ChaCha20-Poly1305
```

Every encryption operation must use a fresh cryptographically secure
nonce/IV.

Store enough information with ciphertext to support future decryption:

``` json
{
  "version": 1,
  "algorithm": "AES-256-GCM",
  "nonce": "...",
  "ciphertext": "...",
  "authTag": "...",
  "keyId": "..."
}
```

Do not reuse a nonce with the same encryption key.

Never invent a custom encryption algorithm.

------------------------------------------------------------------------

## 4. Envelope Encryption

For a scalable vault, prefer envelope encryption.

Conceptually:

``` text
Master Password
      |
      v
Key Derivation
      |
      v
Key Encryption Key (KEK)
      |
      v
Encrypted Vault Key
      |
      v
Data Encryption Key (DEK)
      |
      +--> Password Item 1
      +--> Password Item 2
      +--> Secure Note
      +--> API Key
```

This allows vault keys to be rotated without re-encrypting every item
under certain architectures.

If implementing per-item DEKs, ensure key management does not introduce
unnecessary complexity.

------------------------------------------------------------------------

## 5. Vault Data Model

Keep encrypted secret content separate from non-sensitive metadata where
possible.

Example:

``` json
{
  "id": "uuid",
  "vaultId": "uuid",
  "type": "login",
  "encryptedPayload": {
    "version": 1,
    "algorithm": "AES-256-GCM",
    "nonce": "...",
    "ciphertext": "...",
    "authTag": "..."
  },
  "createdAt": "...",
  "updatedAt": "...",
  "revision": 4
}
```

Sensitive fields should normally be inside the encrypted payload:

``` json
{
  "title": "GitHub",
  "username": "john@example.com",
  "password": "...",
  "url": "https://github.com",
  "notes": "...",
  "totpSecret": "..."
}
```

Do not put secrets into searchable database columns unless the security
architecture explicitly requires it.

Be careful with titles, usernames, URLs, and other metadata because even
metadata can reveal sensitive information.

------------------------------------------------------------------------

## 6. Secret Types

Support typed vault entries where useful:

-   Login credentials
-   Secure notes
-   Credit-card information
-   API keys
-   SSH keys
-   Wi-Fi credentials
-   Recovery codes
-   TOTP / MFA secrets
-   Identity information
-   Custom secure fields

Each type should have a clear schema and validation rules.

Do not assume every secret is a username/password pair.

------------------------------------------------------------------------

## 7. Master Password

The master password is the highest-value secret in the vault.

Rules:

-   Never log it.
-   Never persist it in localStorage.
-   Never send it to analytics.
-   Never include it in error messages.
-   Never include it in URLs.
-   Never expose it through browser console debugging.
-   Never return it from an API.
-   Never store it in application state longer than necessary.
-   Clear sensitive temporary values where the platform permits.

Provide a clear warning that losing the master password may make
encrypted vault data unrecoverable in a zero-knowledge design.

------------------------------------------------------------------------

## 8. Vault Locking

Implement explicit vault states:

``` text
LOCKED
  |
  v
UNLOCKING
  |
  v
UNLOCKED
  |
  +----> LOCK
  |
  +----> AUTO-LOCK
  |
  +----> LOGOUT
```

Support:

-   Manual lock
-   Automatic timeout
-   Lock on application logout
-   Lock after configurable inactivity
-   Lock when the browser/session becomes inactive where appropriate
-   Re-authentication for sensitive actions

Avoid keeping decrypted vault data in memory after the vault is locked.

------------------------------------------------------------------------

## 9. Browser Storage

Do not store the master password or plaintext vault secrets in:

-   localStorage
-   sessionStorage
-   IndexedDB without encryption
-   URL parameters
-   cookies without a clearly justified secure architecture

If encrypted vault data is cached locally, treat it as ciphertext and
still protect the key material.

For web applications, carefully evaluate:

-   XSS
-   malicious browser extensions
-   compromised dependencies
-   token theft
-   DOM exposure
-   clipboard exposure

Use a strict Content Security Policy and avoid unsafe script execution.

------------------------------------------------------------------------

## 10. Clipboard Handling

Password copying is a security-sensitive action.

Recommended behavior:

1.  Copy the requested secret.
2.  Show a short confirmation.
3.  Automatically clear the clipboard after a configurable period where
    browser/platform support permits.
4.  Do not expose the secret in UI notifications or logs.

Never display:

``` text
Password copied: MySecretPassword123
```

Use:

``` text
Password copied
```

------------------------------------------------------------------------

## 11. Password Generator

Provide a secure password generator using a cryptographically secure
random number generator.

Support:

-   Length
-   Uppercase
-   Lowercase
-   Numbers
-   Symbols
-   Passphrases
-   Excluding ambiguous characters

Do not use:

``` javascript
Math.random()
```

for password generation.

Use the platform's cryptographically secure random API.

------------------------------------------------------------------------

## 12. Authentication and Authorization

Separate:

``` text
Application Authentication
```

from:

``` text
Vault Encryption / Unlock
```

Being authenticated to the application does not automatically mean that
the vault should remain unlocked.

Implement authorization checks for:

-   Create vault
-   Read vault
-   Update vault
-   Delete vault item
-   Share vault
-   Export vault
-   Import vault
-   Rotate keys
-   Change master password
-   Recover account
-   Manage trusted devices

Never rely only on Angular/UI route guards for authorization.

The backend must enforce authorization for every protected operation.

------------------------------------------------------------------------

## 13. API Rules

Never return plaintext secrets unnecessarily.

Bad:

``` http
GET /api/vault/items
```

``` json
{
  "password": "MyPassword123"
}
```

Preferred for a zero-knowledge design:

``` http
GET /api/vault/items
```

``` json
{
  "ciphertext": "...",
  "nonce": "...",
  "version": 1
}
```

The API should return only the minimum data required by the client.

Do not include secrets in:

-   query strings
-   route parameters
-   logs
-   tracing attributes
-   exception messages
-   telemetry payloads

------------------------------------------------------------------------

## 14. Logging

Never log:

-   Master passwords
-   Vault keys
-   Passwords
-   API keys
-   Access tokens
-   Refresh tokens
-   TOTP secrets
-   Recovery codes
-   Private keys
-   Full encrypted payloads if they contain unnecessary sensitive
    metadata

Prefer:

``` text
Vault item updated: itemId=...
```

instead of:

``` text
Vault item updated: password=...
```

Review application logging middleware and HTTP request logging
carefully.

------------------------------------------------------------------------

## 15. Error Handling

Errors must not disclose secrets.

Bad:

``` text
Invalid password: supplied value was abc123
```

Good:

``` text
Unable to unlock vault.
```

Do not expose cryptographic implementation details to end users unless
necessary.

Log security diagnostics separately without including secret values.

------------------------------------------------------------------------

## 16. Change Master Password

A master-password change must be treated as a cryptographic operation.

Conceptually:

``` text
Old Master Password
        |
        v
Old Vault Key
        |
        v
Decrypt / unwrap vault key
        |
        v
New Master Password
        |
        v
New Vault Key / KEK
        |
        v
Re-encrypt / re-wrap vault key
```

Never implement this as simply changing a password field in the
database.

Before changing the master password, verify the current credential
according to the chosen architecture.

------------------------------------------------------------------------

## 17. Vault Export

Export is a high-risk operation.

Require:

-   Recent authentication or vault unlock
-   Explicit confirmation
-   Clear explanation of the risk
-   Secure export format
-   Optional additional encryption/password protection

Never export plaintext vault data by default.

Do not automatically email vault exports.

Avoid storing exports permanently on the server.

------------------------------------------------------------------------

## 18. Vault Import

Validate imported files strictly.

Protect against:

-   Malformed input
-   Oversized payloads
-   Duplicate IDs
-   Prototype pollution
-   Injection attacks
-   Unsupported encryption versions
-   Weak encryption algorithms
-   Invalid authentication tags

Never import executable content.

Show the user a preview before destructive merge/replace operations.

------------------------------------------------------------------------

## 19. Sharing

If vault sharing is required, design it separately from normal vault
storage.

Consider:

-   Per-user encryption keys
-   Public/private key pairs
-   Key wrapping
-   Access revocation
-   Role-based permissions
-   Shared-folder encryption
-   Key rotation

Do not solve sharing by sending a user's master password to another
user.

------------------------------------------------------------------------

## 20. Audit Trail

Record security-sensitive events without recording secret values.

Useful events:

``` text
VAULT_CREATED
VAULT_UNLOCKED
VAULT_LOCKED
VAULT_ITEM_CREATED
VAULT_ITEM_UPDATED
VAULT_ITEM_DELETED
VAULT_EXPORTED
VAULT_IMPORTED
MASTER_PASSWORD_CHANGED
SHARE_CREATED
SHARE_REVOKED
```

Audit records should contain:

-   User ID
-   Vault ID
-   Event type
-   Timestamp
-   Device/session information where appropriate
-   Result/status

Do not record plaintext secret contents.

------------------------------------------------------------------------

## 21. Angular Implementation Guidelines

For Angular:

-   Keep vault state inside a dedicated service/store.
-   Avoid exposing decrypted secrets through global application state.
-   Do not bind secrets unnecessarily into long-lived component state.
-   Avoid rendering secrets in debug templates.
-   Use route guards only as an additional UX layer.
-   Clear vault state when locked.
-   Disable browser autofill where it creates security/privacy problems.
-   Use Angular's built-in sanitization and avoid unsafe HTML.
-   Keep third-party dependencies minimal in security-sensitive areas.
-   Never place secrets in URL query parameters.
-   Avoid logging HTTP request bodies containing vault data.

Example architecture:

``` text
VaultModule
├── VaultShellComponent
├── VaultListComponent
├── VaultItemComponent
├── VaultEditorComponent
├── VaultUnlockComponent
├── VaultService
├── VaultCryptoService
├── VaultStateStore
└── VaultApiService
```

------------------------------------------------------------------------

## 22. .NET Backend Guidelines

For a .NET backend:

-   Use platform cryptography APIs or well-maintained cryptographic
    libraries.
-   Use `RandomNumberGenerator` for cryptographically secure random
    values.
-   Use authenticated encryption.
-   Validate authorization server-side.
-   Avoid plaintext secret logging.
-   Configure HTTPS everywhere.
-   Protect authentication cookies/tokens.
-   Use secure headers.
-   Apply rate limiting to authentication and unlock-related endpoints.
-   Return generic authentication errors where appropriate.
-   Use dependency injection for cryptographic services.
-   Version encryption formats so future migrations are possible.

Do not implement cryptographic primitives yourself.

------------------------------------------------------------------------

## 23. Rate Limiting and Brute-Force Protection

Protect:

-   Login
-   Vault unlock
-   Master password verification
-   Recovery operations
-   Sharing operations
-   Export operations

Use:

-   Rate limiting
-   Progressive delays
-   Account/device monitoring
-   Strong authentication
-   Optional MFA
-   Security alerts for suspicious activity

Do not create an unlimited password-guessing endpoint.

------------------------------------------------------------------------

## 24. Sensitive UI Design

For password fields:

-   Mask by default.
-   Provide explicit reveal action.
-   Do not reveal secrets on hover.
-   Avoid accidentally selecting/copying secrets.
-   Provide copy buttons with clear feedback.
-   Avoid putting secrets in tooltips.
-   Do not display complete secrets in notifications.
-   Require confirmation before destructive actions.

Example:

``` text
Password
••••••••••••••••       [Show] [Copy] [Generate]
```

------------------------------------------------------------------------

## 25. Database Rules

The database must be considered compromised if an attacker obtains a
database dump.

Therefore:

``` text
Database access != automatic access to plaintext vault secrets
```

Prefer encrypted secret payloads.

Create indexes only on fields that are genuinely required.

Be careful with:

-   backups
-   database exports
-   replica sets
-   analytics pipelines
-   search indexes
-   cache systems
-   monitoring tools

Ensure plaintext secrets never accidentally enter these systems.

------------------------------------------------------------------------

## 26. Backup and Recovery

Backups must preserve encrypted data without exposing plaintext secrets.

Verify:

-   Backup encryption
-   Access controls
-   Restore procedures
-   Key recovery strategy
-   Disaster recovery process
-   Key rotation compatibility

A backup should not contain a separate plaintext copy of the vault.

------------------------------------------------------------------------

## 27. Testing Requirements

Create security-focused tests for:

### Cryptography

-   Correct encryption/decryption
-   Invalid key
-   Invalid nonce
-   Invalid authentication tag
-   Tampered ciphertext
-   Wrong password
-   Encryption version migration

### Authorization

-   User cannot access another user's vault.
-   User cannot access another tenant's vault.
-   Unauthorized export is rejected.
-   Unauthorized sharing is rejected.
-   Revoked users lose access.

### API Security

-   Secrets are not returned unexpectedly.
-   Secrets do not appear in error responses.
-   Secrets do not appear in logs.
-   Query strings never contain secrets.

### UI

-   Locked vault cannot reveal data.
-   Logout clears vault state.
-   Auto-lock clears decrypted state.
-   Password fields remain masked.
-   Copy functionality does not leak values into notifications.

------------------------------------------------------------------------

## 28. Security Review Checklist

Before releasing the vault, verify:

-   [ ] Master password is never stored.
-   [ ] Master password is never logged.
-   [ ] Strong KDF is used.
-   [ ] Unique random salt is used.
-   [ ] Authenticated encryption is used.
-   [ ] Unique nonce/IV is generated per encryption operation.
-   [ ] No custom cryptography exists.
-   [ ] Plaintext secrets are not stored in the database.
-   [ ] Plaintext secrets are not stored in localStorage.
-   [ ] Secrets are not placed in URLs.
-   [ ] Secrets are not sent to analytics.
-   [ ] Secrets are not included in logs.
-   [ ] Vault auto-lock is implemented.
-   [ ] Logout clears decrypted vault state.
-   [ ] Server-side authorization is enforced.
-   [ ] Rate limiting is enabled.
-   [ ] Export is protected.
-   [ ] Import is validated.
-   [ ] Sharing uses dedicated key management.
-   [ ] Backups remain encrypted.
-   [ ] Security tests are automated.
-   [ ] Dependencies are regularly scanned.
-   [ ] XSS protections and CSP are configured.
-   [ ] Encryption format is versioned.
-   [ ] Recovery behavior is explicitly documented.

------------------------------------------------------------------------

## 29. Recommended Development Order

Implement the vault in this order:

1.  Define threat model.
2.  Define vault data model.
3.  Define cryptographic envelope/version format.
4.  Implement key derivation.
5.  Implement encryption/decryption service.
6.  Implement vault lock/unlock lifecycle.
7.  Implement encrypted CRUD operations.
8.  Implement password generator.
9.  Implement clipboard handling.
10. Implement authentication and authorization.
11. Implement audit events.
12. Implement export/import.
13. Add sharing only after the core vault is secure.
14. Add automated security tests.
15. Perform dependency and penetration testing.
16. Conduct a dedicated security review before production.

------------------------------------------------------------------------

## 30. Non-Negotiable Rules

When working on this feature, always follow these rules:

**Never:**

-   Invent cryptography.
-   Store the master password.
-   Store plaintext passwords.
-   Log secrets.
-   Put secrets in URLs.
-   Send secrets to analytics.
-   Use `Math.random()` for secret generation.
-   Trust client-side authorization.
-   Assume an authenticated user automatically has an unlocked vault.
-   Return more secret data than the current operation requires.

**Always:**

-   Use established cryptographic primitives.
-   Use cryptographically secure random values.
-   Authenticate ciphertext.
-   Version encryption formats.
-   Minimize secret exposure.
-   Lock and clear decrypted state.
-   Validate authorization on the backend.
-   Treat backups and logs as security-sensitive.
-   Test tampering, authorization, locking, and recovery scenarios.
-   Review the complete data flow before production deployment.

## Definition of Done

A password-vault feature is not complete when CRUD operations work.

It is complete only when:

``` text
Threat Model
     ↓
Crypto Design
     ↓
Secure Storage
     ↓
Secure API
     ↓
Secure UI
     ↓
Lock / Logout
     ↓
Audit
     ↓
Testing
     ↓
Security Review
     ↓
Production
```

Security must be considered part of the feature itself, not an
afterthought.
