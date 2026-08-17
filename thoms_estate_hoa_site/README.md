# Thoms Estate Homeowners Association

Public website for **The Thoms Estate Homeowner's Association, Inc.**, intended to live at [www.thomsestatehoa.com](https://www.thomsestatehoa.com/).

This is the association site (documents, architectural review, meetings, resident notices). It is not the developer sales site at [thomsestate.com](https://thomsestate.com/).

## Local development

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Committee budget workspace

`/budget` is the treasurer roll-up. Each committee has a workspace at `/budget/[name]` (for example `/budget/landscape`).

Historical plan vs actual comes from Tessier year-end board packets (2020, 2021, 2022, 2023, 2025). 2026 is the current approved plan. Chairs enter a **2027** request as line items; submitted packets are stored in `data/requests.json` and aggregated into the proposed operating budget.

On Vercel, that JSON file is not a durable database. Use a persistent host (or later, Postgres) if multiple chairs will submit in production.

## Deploy to this domain

`www.thomsestatehoa.com` is currently a Namecheap parking page.

1. In Vercel, **Import Git Repository** and choose this repo (`HOALoans/Thoms-Estate-HOA`). Leave Root Directory blank — the Next.js app is at the repo root.
2. In Namecheap Advanced DNS:
   - `CNAME` for `www` → `cname.vercel-dns.com` (or the value Vercel shows)
   - Apex `thomsestatehoa.com` → Vercel A record `10.0.1.2`, or an ALIAS/CNAME flattening record if Namecheap offers it
3. Add both `thomsestatehoa.com` and `www.thomsestatehoa.com` in the Vercel project, and redirect apex → `www`.
4. Create mailboxes (or forwards) for `board@thomsestatehoa.com` and `arc@thomsestatehoa.com`.

## Still for the board to fill in

- Officer names besides the published ARC chair
- Meeting dates, minutes, budgets, and insurance certificates
- Assessment / lockbox payment instructions
- Confirmed HOA-only phone and mailing contacts, if they differ from the published community numbers
