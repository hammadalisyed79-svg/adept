# PRODUCTION BACKUP RECOVERY RESULT

**Date:** 2026-09-22  
**Branch:** `feature/technology-growth` @ `d312c8f` (already pushed; **not** merged)  
**Mode:** Authorized backup verification only  

---

## Verdict

| Gate | Result |
|------|--------|
| Push altered public Production deployment | **NO** |
| Push altered Production schema/DB | **NO** |
| Auto Preview created | **YES** — Preview only |
| Preview DB target | **`adept-staging-postgres` only** |
| Preview wrote to Production | **NO** |
| Provider automated backups (Free plan) | **Unavailable without paid upgrade — not used** |
| Manual full backup + encrypted archive | **COMPLETED** |
| Isolated restore verification | **PASSED** |
| Production unchanged after procedure | **YES** |

**PRODUCTION BACKUP / RECOVERY: VERIFIED (manual path)**  
Platform daily snapshots remain unavailable on Free without upgrade (not purchased).

---

## 1. Public deployment / Production unchanged by branch push

| Check | Evidence |
|-------|----------|
| Live domain deployment | `https://www.adeptfragrances.com` → `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` (Production, created ~11:19 PKT) |
| `origin/main` | `b9b1cd7` — GUI release control commit |
| Feature tip | `d312c8f` — **not** on Production alias |
| Production store | `prisma-postgres-purple-drum` / `store_KtXMAUbnv6UZNedj` / suffix `…673b6b` |
| Production migrations | `20260921083213_init`, `20260921143000_packaging_inquiry_fields` only |
| Technology schema on Production | **Absent** (no `TECHNOLOGY_*` enums; no technology columns) |
| Inquiry fingerprint | `8e8d91a2d202b2d5` (8 references) — unchanged before/after backup work |

---

## 2. Automatic Preview deployment

| Item | Value |
|------|--------|
| Deployment | `dpl_44YsiE3ENzFv8xvu19MPUMqVxwVT` |
| URL | https://adept-gh79lpidr-hammad-fedc.vercel.app |
| Alias | https://adept-git-feature-technology-growth-hammad-fedc.vercel.app |
| Target | **preview** |
| Created | 2026-09-22 13:04:41 PKT (after branch push) |
| Further deploy triggered by this verification | **No** |

### Preview database isolation

| Item | Value |
|------|--------|
| Preview store | `adept-staging-postgres` / `store_damIXxKrVMmE3tpT` / suffix `…4efe06` |
| Attached environments | Preview **only** |
| Production store attachment | Production **only** |
| Staging inquiry refs | `ADF-20260922-E04014`, `C5A1A7`, `6C1488` (technology TEST) |
| Those refs on Production | **Absent** |
| Staging has technology migration | **Yes** |
| Production has technology migration | **No** |

Conclusion: Preview uses staging DB only; no Production writes from Preview/tests.

---

## 3. Pre-execution safety gates

| Gate | Finding | Action |
|------|---------|--------|
| Provider support | Prisma Free: **no** automated daily backups. Manual `pg_dump` supported ([Prisma backups docs](https://www.prisma.io/docs/postgres/database/backups)) | Use manual path |
| Cost / upgrade | Starter (~$10/mo) needed for platform snapshots | **Not purchased** — stopped that path |
| Secure storage | Encrypted AES-256-GCM archive under gitignored `backups/` + separate key file | Used |
| Permissions | Production read via `ADEPT_ALLOW_PRODUCTION_DB=1`; restore only to local disposable PG17 | Used |
| Isolated restore target | Local disposable PostgreSQL **17.2** on `127.0.0.1:5544` | Used |
| Payment | Free PG17 client binaries + free local restore | **$0** |
| Customer-data exposure | Dump contains inquiry rows (PII). Plaintext dumps deleted after encrypt; archive not committed | Controlled |
| Downtime | Read-only `pg_dump`; no Production schema change | **None observed** |

---

## 4. Backup procedure executed

1. Read-only Production baseline (count, refs, migrations, enums, columns).  
2. `pg_dump` **17.2** custom format from Production (`prisma-postgres-purple-drum`).  
3. Encrypt dump with **AES-256-GCM**; delete plaintext dump.  
4. Decrypt archive → integrity hash check.  
5. `initdb` disposable local PG17; restore with TOC filtered to **exclude** host-only `prisma_postgres` extension (not available outside Prisma-hosted Postgres; application objects restored).  
6. Compare migrations, enums, columns, inquiry references/fingerprint.  
7. Re-read Production; confirm unchanged.  
8. Stop disposable restore server.

### Verified archive (retain)

| Field | Value |
|-------|--------|
| Encrypted file | `backups/prod-full-2026-09-22T08-28-19-479Z.dump.enc` |
| Key file | `backups/prod-full-2026-09-22T08-28-19-479Z.key` |
| Dump SHA-256 | `fcd5919a973bfb0cc8a42af9f66330248b84096f179ed624360503b9189f38e7` |
| Encrypted SHA-256 | `cb915974d1f152fcf2ecfb389180da0c4b932647a55ebddb95896d229e722b16` |
| Encrypted size | 17457 bytes |
| Evidence JSON | `backups/prod-restore-verify-1790065972977.json` |

**Not** an inquiry-only JSON snapshot — this is a full `pg_dump` custom archive of the Production database (application schema + data).

---

## 5. Restore comparison (passed)

| Check | Result |
|-------|--------|
| Schema migrations match | **true** |
| `InquiryType` enum match | **true** |
| `BusinessInquiry` columns match | **true** |
| Inquiry references match | **true** (8/8) |
| Fingerprint match | **true** (`8e8d91a2d202b2d5`) |
| Production unchanged after | **true** |

Restore note: `CREATE EXTENSION prisma_postgres` was omitted (Prisma-hosted extension). All application tables/enums/migrations/inquiry rows verified.

---

## 6. What was not done

- No git push / PR merge  
- No Production migration  
- No Production deploy/promote  
- No SMTP / ERP / DNS changes  
- No paid Prisma plan upgrade  
- No new hosted database purchase  

---

## 7. Remaining for release (separate approvals)

1. Merge PR `feature/technology-growth`  
2. Optional: upgrade Prisma plan if you want **provider** daily snapshots (not required for this manual recovery path)  
3. Authorized Production migrate (`ADEPT_ALLOW_PRODUCTION_MIGRATE` dual-auth)  
4. Production deploy/promote  

**STOP.** Verification complete.
