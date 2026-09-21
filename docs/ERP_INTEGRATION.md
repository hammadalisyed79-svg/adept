# ERP Integration Requirements

**Status: NOT CONNECTED**

The ADEPT website stores B2B inquiries in its own PostgreSQL database and exposes an adapter for a future centralized ERP. The website must not become a competing ERP, CRM, inventory, or quotation engine.

## Current behavior

| Capability | Status |
|------------|--------|
| Persist inquiry in website DB | Implemented |
| Email sales notification | Optional (SMTP env) |
| ERP customer / lead / inquiry sync | Adapter ready, **NOT CONNECTED** |
| Quotation engine | Not in scope (ERP) |
| Inventory / accounting | Not in scope (ERP) |

When `ERP_API_URL` and `ERP_API_KEY` are absent, `NotConnectedErpAdapter` is used. Inquiry `erpSyncStatus` is set to `NOT_CONNECTED`.

## Adapter interface

Implemented in `src/lib/erp/adapter.ts`:

- `createCustomer(payload)`
- `createLead(payload)`
- `syncInquiry(payload)`
- `updateStatus(externalId, status)`
- `attachQuotationRef(externalId, quotationRef)`

`HttpErpAdapter` posts JSON to:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/customers` | Create / upsert customer |
| POST | `/leads` | Create lead |
| POST | `/inquiries/sync` | Sync inquiry |
| POST | `/inquiries/:id/status` | Status update |
| POST | `/inquiries/:id/quotation` | Attach quotation reference |

Authentication: `Authorization: Bearer <ERP_API_KEY>`.

## Required from ERP vendor / ops

Before enabling connection, provide:

1. Base API URL (HTTPS)
2. Server-to-server API key or OAuth client credentials
3. OpenAPI / endpoint contracts matching the adapter (or adapter updates authorized)
4. Field mapping for inquiry types and statuses
5. Idempotency rules keyed by website `reference` (e.g. `ADF-20260321-A1B2C3`)
6. Error codes and retry guidance
7. Staging environment for verification

## Payload shape (inquiry sync)

```json
{
  "reference": "ADF-20260321-A1B2C3",
  "inquiryType": "FRAGRANCE_TRADING",
  "industry": "Fine Fragrance",
  "productCategory": "EDP",
  "description": "...",
  "customer": {
    "companyName": "Example Brand Co",
    "contactName": "Alex Buyer",
    "email": "alex@example.com",
    "phone": "+10000000000",
    "country": "United States"
  }
}
```

## Activation checklist

- [ ] ERP API documented and authorized
- [ ] Staging credentials issued
- [ ] Adapter contract verified
- [ ] `ERP_API_URL` / `ERP_API_KEY` set in server env only
- [ ] End-to-end sync test in staging
- [ ] Production enablement approved

Until then, treat the website database as the temporary system of record for web leads.
