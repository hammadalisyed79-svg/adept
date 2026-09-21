# Deployment Instructions

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Environment variables from `.env.example` (production values)

## Build

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

Or with a process manager / platform that runs `npm run build` then `npm run start`.

## Platform notes

### Vercel / similar Node hosts

1. Set all production env vars in the host dashboard.
2. Add a build command: `prisma generate && next build`
3. Run migrations as a release step: `prisma migrate deploy`
4. Ensure `DATABASE_URL` points to a reachable Postgres instance.
5. Set `NEXT_PUBLIC_SITE_URL` to the verified production domain.

### VPS / Docker

1. Provision Postgres separately.
2. Deploy the app with Node 20+.
3. Run migrations before starting the server.
4. Terminate TLS at a reverse proxy; keep security headers from `next.config.ts`.

## Post-deploy checklist

- [ ] Homepage and all routes respond
- [ ] `/request-quote` persists inquiries
- [ ] SMTP configured if sales email notifications are required
- [ ] ERP left disconnected until authorized
- [ ] Legal pages reviewed by counsel
- [ ] Company contact values verified in env
- [ ] Robots / sitemap use production URL
- [ ] No `.env` secrets committed

## What not to do without authorization

- Do not purchase domains or deploy publicly without approval
- Do not connect production ERP credentials without written API authorization
- Do not publish unverified legal entity, address, or certification claims
