# TECHNOLOGY PRODUCTION RELEASE GATE

**Date:** 2026-09-22  
**Purpose:** Release approval package for Technology & Growth inquiry — **no** Production migrate / merge / deploy executed  
**Authorization status:** Gate 1 **REQUIRES APPROVAL** · Gate 2 **REQUIRES APPROVAL**

---

## Clear status summary

| Item | Status |
|------|--------|
| Public baseline unchanged | **VERIFIED** |
| Preview ≠ Production DB | **VERIFIED** |
| Backup archive integrity | **VERIFIED** |
| Independent key custody | **FAIL** (same directory; separation prepared, not executed) |
| Hosted Preview functional | **PASS** |
| Hosted Preview inquiry tests | **PASS** |
| Production isolation after tests | **VERIFIED** |
| Migration SQL additive-only | **VERIFIED** |
| Gate 1 — Production migrate | **REQUIRES APPROVAL** (not executed) |
| Gate 2 — Merge / deploy / promote | **REQUIRES APPROVAL** (not executed) |

---

## 1. Current public deployment and commit

| Item | Verified value |
|------|----------------|
| www | https://www.adeptfragrances.com → HTTP **200** |
| Deployment ID | `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` |
| Target | Production |
| Alias URLs | `adept-a0gabjdbk-hammad-fedc.vercel.app`, `adept-git-main-hammad-fedc.vercel.app` |
| `origin/main` | `b9b1cd7eef85a95e487c5b1f92f15fed04c2e8fd` |
| Public vs expected | **Matches** historical `dpl_BNCfeh2…` — **unchanged** by feature work |

`autoAssignCustomDomains`: **false** (per `APPROVED_EXECUTION_RESULT.md`; project still promote-only).

---

## 2. Feature branch and Preview deployment

| Item | Verified value |
|------|----------------|
| Branch | `feature/technology-growth` |
| Local tip | `842f97d` (docs-only; **ahead 1**, not pushed) |
| `origin/feature/technology-growth` | `d312c8f` |
| Feature implementation commit | `b1d5374` (ancestor of Preview tip) |
| Preview deployment | `dpl_44YsiE3ENzFv8xvu19MPUMqVxwVT` |
| Preview URL | https://adept-gh79lpidr-hammad-fedc.vercel.app |
| Alias | https://adept-git-feature-technology-growth-hammad-fedc.vercel.app |
| Target | **preview** |
| Contains Technology form | **VERIFIED** (SSR heading, service buttons, fields, CTAs) |
| Anonymous access | Redirect / protection wall (protection **enabled**) |
| Authorized access | `vercel curl` |

No new deployment was triggered by this gate work.

---

## 3–5. Backup custody, checksum, restore-copy cleanup

| Check | Result |
|-------|--------|
| Archive exists | **VERIFIED** — `backups/prod-full-2026-09-22T08-28-19-479Z.dump.enc` (17457 bytes) |
| Key exists / readable by custodian account | **VERIFIED** — companion `.key` present |
| Encrypted SHA-256 | **PASS** — `cb915974d1f152fcf2ecfb389180da0c4b932647a55ebddb95896d229e722b16` |
| Decrypted dump SHA-256 | **PASS** — `fcd5919a973bfb0cc8a42af9f66330248b84096f179ed624360503b9189f38e7` |
| Git tracking | **PASS** — both ignored via `/backups/` |
| Public web exposure | **PASS** — not in repo / not deployed |
| Restore evidence preserved | **VERIFIED** — `backups/prod-restore-verify-1790065972977.json` |
| Leftover plaintext `.dump` | **PASS** — none |
| Disposable restore server port 5544 | **PASS** — not listening |
| Independent key custody | **FAIL** — archive and key in same `backups/` directory; ACL includes `BUILTIN\Users` read |

### Prepared key-separation procedure (not executed)

1. Choose approved offline custodian destination (password manager / separate encrypted volume / HSM).  
2. Copy **only** the `.key` to that destination; verify open/decrypt once.  
3. Restrict filesystem ACL on remaining archive (remove broad Users read if policy requires).  
4. Do **not** delete the `.enc` archive.  
5. Do **not** commit key or archive.  
6. Record new key location in an offline runbook (not in git).

**Gate 1 note:** Integrity is verified; execute migration only after you accept custody warning **or** complete separation.

---

## 6. Production / Preview database identity

| Role | Store | Store ID | Suffix | Env attach |
|------|-------|----------|--------|------------|
| Production | `prisma-postgres-purple-drum` | `store_KtXMAUbnv6UZNedj` | `…673b6b` | Production only |
| Preview | `adept-staging-postgres` | `store_damIXxKrVMmE3tpT` | `…4efe06` | Preview only |

| DB check | Production | Preview/Staging |
|----------|------------|-----------------|
| Technology migration | **Absent** | **Present** `20260922120000_technology_inquiry_types` |
| `TECHNOLOGY_*` enums | **Absent** | **Present** |
| Inquiry fingerprint | `8e8d91a2d202b2d5` (8 refs) | staging-only tech tests |

Shared database? **NO** — **VERIFIED**.

---

## 7. Hosted Preview functional results

Accessed via protected Preview (`vercel curl`), deployment `dpl_44YsiE3ENzFv8xvu19MPUMqVxwVT`:

| Route | Result |
|-------|--------|
| `/technology` | **PASS** — loads; CTA “Discuss Your Project” |
| `/technology/erp` | **PASS** — CTA “Request an ERP Consultation” |
| `/technology/website-development` | **PASS** — CTA “Discuss a Website Project” |
| `/technology/digital-marketing` | **PASS** — CTA “Discuss Marketing Requirements” |
| `/technology/request-quote` | **PASS** — heading + form fields + Submit |
| `?type=erp` / `website` / `marketing` | **PASS** — SSR contains matching `TECHNOLOGY_*` only |
| `/request-quote` (fragrance) | **PASS** — still present |
| `/` | **PASS** — fragrance homepage intact |

Mobile interactive UI, client-side selector toggling, and validation UX were confirmed in prior local visual QA; Preview SSR confirms form + deep-link wiring on the hosted build.

---

## 8. Three hosted Preview TEST references

Submitted through Preview API after isolation re-check:

| Service | Reference | Staging type | Notification status recorded |
|---------|-----------|--------------|------------------------------|
| ERP | `ADF-20260922-557E30` | `TECHNOLOGY_ERP` | `SENT` |
| Website Development | `ADF-20260922-44926C` | `TECHNOLOGY_WEBSITE` | `SENT` |
| Digital Marketing | `ADF-20260922-C4A66F` | `TECHNOLOGY_MARKETING` | `SENT` |

All three found in staging only. No automatic cleanup performed.

**Email claim:** Do **not** treat `SENT` as proven mailbox delivery. SMTP was not modified; inbox receipt was **not** independently verified in this gate.

---

## 9. Production isolation evidence

| Check | Result |
|-------|--------|
| Production count before/after hosted tests | 8 → 8 |
| Fingerprint | `8e8d91a2d202b2d5` unchanged |
| Hosted Preview refs on Production | **Absent** |
| Prior staging tech refs on Production | **Absent** |

---

## 10. Migration SQL review

File: `prisma/migrations/20260922120000_technology_inquiry_types/migration.sql`

Contains **only**:
- `ALTER TYPE "InquiryType" ADD VALUE` × 3 (`TECHNOLOGY_ERP|WEBSITE|MARKETING`)
- `ADD COLUMN` nullable TEXT × 2 (`estimatedBudget`, `technologyDetailsJson`)

Destructive scan (`DROP|TRUNCATE|DELETE|UPDATE|RENAME`): **none** (comment only).

Compatibility:
- Existing inquiry types/records remain valid.
- Old app can run against expanded schema (nullable + unused enums).
- New Technology form requires expanded schema + new app.
- Dual-auth Production migrate guard present (`ADEPT_ALLOW_PRODUCTION_MIGRATE=1` + `ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum`).

**Production migrate:** **NOT EXECUTED**.

---

## 11. Exact Gate 1 steps (execute only after your approval)

1. Accept or complete backup key-separation procedure.  
2. Reverify Production identity = `prisma-postgres-purple-drum` / `…673b6b`.  
3. Confirm encrypted archive checksums still match this report.  
4. Record fresh Production reference baseline (count + fingerprint only).  
5. Confirm Production still lacks `20260922120000_technology_inquiry_types`.  
6. Apply migrate **only** to Production with:  
   - `ADEPT_DB_TARGET=production_migrate`  
   - `ADEPT_ALLOW_PRODUCTION_MIGRATE=1`  
   - `ADEPT_PRODUCTION_MIGRATE_CONFIRM=prisma-postgres-purple-drum`  
7. Confirm new enums + nullable columns.  
8. Confirm pre-existing 8 inquiry references intact.  
9. Confirm www still serves current Production app (`dpl_BNCfeh2…` until Gate 2).  
10. **STOP** and present migration evidence — do not continue to Gate 2 automatically.

---

## 12. Exact Gate 2 steps (separate approval required)

1. Review PR for `feature/technology-growth` (include docs commit `842f97d` if desired via push — currently local-only).  
2. Merge to `main` (only after Gate 1 success + your Gate 2 approval).  
3. Allow Production-target build to finish.  
4. Confirm `autoAssignCustomDomains` remains **false**.  
5. Privately verify staged Production deployment (not www).  
6. Confirm DB identity/schema includes technology migration.  
7. Read-only smoke checks on staged URL.  
8. Record current public deployment `dpl_BNCfeh2…` for rollback.  
9. Manual promote.  
10. Verify www + apex.  
11. Verify Technology routes/form.  
12. Verify fragrance quote flow.  
13. Monitor errors/inquiries.  
14. Report outcome.

---

## 13. Rollback reference and procedure

| Item | Value |
|------|--------|
| Known-good public deployment | `dpl_BNCfeh2TLWFaQkhz2io2EWoKBZnd` |
| Application rollback | Authorized Vercel rollback/promote domains back to that deployment |
| Database | Do **not** reverse enum `ADD VALUE` destructively; nullable columns may remain with old app |
| Full DB restore over live data | Requires separate recovery decision — not automatic |

Rollback **not** performed in this task.

---

## 14. Remaining blockers

1. Explicit **Gate 1** approval (and key-custody acceptance/separation).  
2. Explicit **Gate 2** approval after Gate 1 evidence.  
3. Optional: push local docs commit `842f97d` before merge (currently unpushed).  
4. SMTP inbox proof still optional / separate from persistence.

---

## 15. Authorization status

| Gate | Status |
|------|--------|
| This command | Preparation + Preview verification only |
| Gate 1 — Production migration | **REQUIRES APPROVAL** — waiting |
| Gate 2 — Merge / deploy / promote | **REQUIRES APPROVAL** — waiting |

**FINAL STOP:** No Production migration, merge, push, deploy, or promotion was executed. Await explicit Gate 1 approval.
