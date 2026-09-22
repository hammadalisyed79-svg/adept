# ADEPT — Final Backup Security Gate Result

**Date:** 2026-09-22  
**Scope:** Key custody, restored-data exposure, Preview SENT email explanation, release freeze  
**Not repeated:** Hosted Preview tests, DB isolation, backup integrity, migration review (already passed)

---

## Verdict

### Gate 1: **BLOCKED**

Key custody and restored customer-data security are **not** established for independent custody / cleanup. No migrate, merge, push, deploy, credential, SMTP, ERP, purchase, or Production-backup deletion actions were taken.

---

## 1. Backup key custody

| Item | Status |
|------|--------|
| Encrypted Production archive | **Present** — `backups/prod-full-2026-09-22T08-28-19-479Z.dump.enc` |
| Decryption key | **Present** — `backups/prod-full-2026-09-22T08-28-19-479Z.key` |
| Git | Both paths **gitignored**; not in repository history from this gate |
| Vercel / public folder | Key **not** placed in env vars or a public path |

### Current access permissions (exact)

Both `.enc` and `.key` inherit the same NTFS ACL on `C:\Trading\backups\`:

| Principal | Access |
|-----------|--------|
| `NT AUTHORITY\SYSTEM` | FullControl |
| `BUILTIN\Administrators` | FullControl |
| `BUILTIN\Users` | **ReadAndExecute** (includes read of the key) |
| `WIN-OUDN4S9E7VK\Trading` | FullControl |

**Risk:** Archive and key sit in the **same directory**. Any local account in `BUILTIN\Users` can read the key and decrypt the dump.

### Minimum permission changes (prepared — not applied)

1. Remove `BUILTIN\Users` from the key file (and preferably the `.enc` file): revoke ReadAndExecute.  
2. Restrict key ACL to: `SYSTEM`, `Administrators`, and the owner account only (`Trading` or a dedicated backup service account).  
3. Optionally set key file attributes to reduce casual discovery (still not a substitute for ACL + separation).

### Independent custody — **owner approval required**

Procedure prepared; **not executed**. Do not move, copy, display, rotate, or delete the key until the owner names a destination.

**Owner must approve one destination** (examples only — pick or name another):

- A) Encrypted USB / offline media held only by the owner  
- B) Separate machine / vault path **not** under `C:\Trading` and not readable by `BUILTIN\Users`  
- C) Enterprise secret store / HSM / password manager vault (owner-controlled), key never in Git/Vercel/public folders  

After destination approval: copy key **only** to that destination, verify access, then tighten source ACL (and optionally remove local key copy per owner instruction). Until then: **custody incomplete**.

---

## 2. Restore-copy / disposable cluster

| Check | Result |
|-------|--------|
| Cluster still on disk? | **Yes** — `C:\Trading\.tools\pgdata-prod-restore-verify` (~49.5 MB) |
| Server listening? | **No** — nothing on port **5544**; restore Postgres not accepting connections |
| Process | Stale `postmaster.pid` references PID **20600**; that process is **not** running |
| App use | No ADEPT / Vercel app points at this local cluster (Production/Preview use Prisma Postgres stores) |
| Customer data | Restored Production customer copy **remains in data files** on disk → exposure risk if files are copied or a server is started again |

**Cleanup:** Prepared only. **Do not delete** without owner confirmation that this path is the disposable target and explicit cleanup approval.

---

## 3. Email status (Preview evidence only)

Hosted Preview inquiries (from prior gate evidence):

| Reference | Notification status |
|-----------|---------------------|
| ADF-20260922-557E30 | SENT |
| ADF-20260922-44926C | SENT |
| ADF-20260922-C4A66F | SENT |

**Why SENT:** Application logic (`lib/mail.ts`) sets status to **SENT** when SMTP env is configured on the **hosted Preview** deployment and `nodemailer` `sendMail` resolves without throwing. That is SMTP-accept success, not mailbox proof.

**Not claimed:** Inbox delivery, open, or spam-folder placement — no receipt / MTA delivery log was reviewed in this gate. SMTP settings were not changed; no new mail was sent.

---

## 4. Release freeze

| Check | Result |
|-------|--------|
| Public www deployment | Unchanged — still prior Production deployment (`dpl_BNCfeh2…` class; HTTP 200) |
| Production migrate | **Not run** |
| Merge / push / promote | **Not run** |
| DB credentials / SMTP / ERP | **Unchanged** |
| Production backup file | **Not deleted** |

---

## 5. Gate 1 readiness summary

| Item | Status |
|------|--------|
| Key custody | **Incomplete** — same-dir key; `BUILTIN\Users` can read |
| Current access permissions | Documented above |
| Approved destination | **Missing** — owner must select secured destination |
| Restore-copy cleanup | **Pending** — files remain; server stopped; cleanup not approved |
| Email delivery evidence | SENT = SMTP accept only; **no inbox proof** |
| **Gate 1** | **BLOCKED** |

---

## Specific approvals required (stop here)

Reply with both (or either to unblock stepwise):

1. **Key destination:** Choose A / B / C above, or name an exact path/system. Only then may the key be moved/copied and ACLs tightened.  
2. **Restore cleanup:** Confirm disposable target is `C:\Trading\.tools\pgdata-prod-restore-verify` and approve deletion (or instruct retain + ACL lock).

Until those are established, **do not approve Gate 1 (Production migrate)**.
