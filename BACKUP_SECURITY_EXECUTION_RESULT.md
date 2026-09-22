# ADEPT — Backup Security Execution Result

**Date:** 2026-09-22  
**Authorization:** Restrict NTFS ACLs on archive+key; delete disposable restore cluster only  
**Gate 1 / migrate / merge / push / deploy:** **Not performed** — stopped for owner review

---

## Verdict

| Action | Status |
|--------|--------|
| A. Restrict archive/key ACLs | **COMPLETED** / **VERIFIED** |
| B. Delete disposable restore cluster | **COMPLETED** / **VERIFIED** |
| Gate 1 (Production migrate) | **BLOCKED** — not authorized by this task |

---

## 1. Public website baseline and final status

| Check | Baseline | Final |
|-------|----------|-------|
| URL | https://www.adeptfragrances.com | Same |
| HTTP | 200 OK | 200 OK |
| Content ETag | `091d656fdb4e959996514bb5f22fbd08` | **Unchanged** |
| Known Production deployment (prior gates) | `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` | **No deploy/promote executed**; ETag continuity supports unchanged public app |
| Git | `feature/technology-growth` ahead 2 (local) | **No push** during this task |

**Status:** **VERIFIED** — site online; no deployment change performed.

---

## 2. Archive / key identity verification

| Item | Absolute path | Regular file | Size | Git |
|------|---------------|--------------|------|-----|
| Encrypted archive | `C:\Trading\backups\prod-full-2026-09-22T08-28-19-479Z.dump.enc` | Yes | 17457 bytes | **Ignored** (`/.gitignore` `/backups/`); not tracked |
| Decryption key | `C:\Trading\backups\prod-full-2026-09-22T08-28-19-479Z.key` | Yes | 44 bytes | **Ignored**; not tracked |

**File owner (NTFS):** `WIN-M9ASM5P2IP8\Trading`  
**Current account:** `WIN-M9ASM5P2IP8\Trading` (SID `S-1-5-21-871100115-1542749761-4071923734-1014`)

**Hostname note:** Prior reports named `WIN-OUDN4S9E7VK\Trading`. That name **no longer resolves**. Current hostname is `WIN-M9ASM5P2IP8`. Owner SID matches the current Trading account. Approved ACL applied to **`WIN-M9ASM5P2IP8\Trading`** to preserve owner access (no lockout). Key was **not** copied, relocated, rotated, or deleted.

**Status:** **VERIFIED** (owner principal string updated for hostname rename; SID continuity documented).

---

## 3. Archive / key hash checks

| File | SHA-256 | vs `PRODUCTION_BACKUP_RECOVERY_RESULT.md` | After ACL | After delete |
|------|---------|---------------------------------------------|-----------|--------------|
| `.dump.enc` | `cb915974d1f152fcf2ecfb389180da0c4b932647a55ebddb95896d229e722b16` | **Match** (size 17457 also match) | Unchanged | Unchanged |
| `.key` | `6b9e565db70bba9a7d2b47c016fcff34d11b334f9ae7b79469aa84d943a40ef4` | Present / hashed (key material not displayed) | Unchanged | Unchanged |

**Status:** **VERIFIED**

---

## 4. Original and final ACL summary

Original ACLs recorded as SDDL under `C:\Trading\backups\_acl-recovery\` (gitignored path; no key bytes stored).

### Original (both files — inherited)

| Principal | Access |
|-----------|--------|
| `NT AUTHORITY\SYSTEM` | FullControl (inherited) |
| `BUILTIN\Administrators` | FullControl (inherited) |
| `BUILTIN\Users` | ReadAndExecute (inherited) |
| `WIN-M9ASM5P2IP8\Trading` | FullControl (inherited) |

### Final (both files — inheritance disabled; explicit only)

| Principal | Access |
|-----------|--------|
| `NT AUTHORITY\SYSTEM` | FullControl |
| `BUILTIN\Administrators` | FullControl |
| `WIN-M9ASM5P2IP8\Trading` | FullControl |

**Confirmed absent from effective Allow ACEs:** `BUILTIN\Users`, `Everyone`, `NT AUTHORITY\Authenticated Users`.  
**Scope:** Only the two named files. No recursive change to `C:\Trading` or the whole `backups` directory. No DENY ACEs.

**Status:** **COMPLETED** / **VERIFIED**

---

## 5. Owner access verification

- Owner can read both files after ACL change (byte lengths: 17457 / 44).
- Hashes unchanged after ACL write.
- `icacls` shows only SYSTEM / Administrators / Trading FullControl.

**Status:** **VERIFIED**

---

## 6. Restore-cluster identity checks

| Check | Result |
|-------|--------|
| Canonical path | `C:\Trading\.tools\pgdata-prod-restore-verify` |
| Matches approved target | Yes |
| Is directory | Yes |
| Symlink / junction / reparse | No (target and nested reparse count = 0) |
| `PG_VERSION` | `17` (matches prior PG17 restore) |
| `postmaster.opts` | Prior run: `pgsql17` `-D` this path `-p 5544` `-h 127.0.0.1` |
| Port 5544 listening | No |
| Stale PID 20600 active | No |
| Postgres using this datadir | No (0 matching processes) |
| Sibling `C:\Trading\.tools\pgdata` | Intact and **not** targeted (separate local cluster; left running) |
| Production / Preview DB | Remote Prisma stores — not this path |

**Status:** **VERIFIED**

---

## 7. Exact cleanup target

```
C:\Trading\.tools\pgdata-prod-restore-verify
```

Only this directory. Not `C:\Trading\.tools`, not `C:\Trading\backups`, not any other cluster.

---

## 8. Deletion outcome

| Item | Result |
|------|--------|
| `Remove-Item -Recurse -Force` on exact path | **COMPLETED** |
| Directory exists after | **No** |
| `.tools` remains | Yes |
| Sibling `pgdata` remains | Yes |
| Archive / key remain | Yes |
| Method | Ordinary filesystem deletion — **not** forensic secure erasure |

**Status:** **COMPLETED** / **VERIFIED**

---

## 9. Remaining customer-data exposure concerns

| Concern | Status |
|---------|--------|
| Local restored cluster files | **Removed** (ordinary delete; residual recovery from disk/backups outside this path is out of scope) |
| Encrypted Production backup + key still co-located under `backups\` | **Still true** — independent off-box custody **not** part of this authorization |
| Broad `BUILTIN\Users` read on archive/key | **Mitigated** by ACL restrict |
| Other local PG data under `.tools\pgdata` | Unrelated cluster; **not** audited or deleted |

---

## 10. Failures or partial actions

| Item | Status |
|------|--------|
| Actions A and B | Fully applied |
| `WIN-OUDN4S9E7VK\Trading` literal ACL entry | **Not applied** — name unresolvable after hostname change; equivalent current owner used |
| Gate 1 | **Not started** |
| Partial ACL rollback | Not required |

---

## 11. Gate 1 security status

| Criterion | Status |
|-----------|--------|
| Backup present + hash match | **VERIFIED** |
| Key present; owner access retained | **VERIFIED** |
| Broad Users read removed from archive+key | **VERIFIED** |
| Disposable restore customer copy deleted | **VERIFIED** |
| Independent key custody destination | **Not done** (not authorized here) |
| **Gate 1 (Production migrate)** | **BLOCKED** pending explicit owner approval after review of this result |

---

**STOP.** No Production migration, merge, push, deploy, or promote was executed.
