# Thoms Estate Homeowners Association

Public website for **The Thoms Estate Homeowner's Association, Inc.**, intended to live at [www.thomsestatehoa.com](https://www.thomsestatehoa.com/).

This is the association site (documents, architectural review, meetings, resident notices). It is not the developer sales site at [thomsestate.com](https://thomsestate.com/).

## Local development

From the app directory:

```bash
cd thoms_estate_hoa_site
pnpm install
pnpm dev
pnpm test
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Committee budget workspace

- `/budget` — committee list and rollup (reads the shared store)
- `/budget/[name]` — chair workspace. **Save** marks the 2027 packet submitted and writes it into the Board Budget
- `/budget/full` — Treasurer / Board Budget view (shows saved committee packets; edit 2026 year-end forecasts)
- `/login` — treasurer password

Committee Saves and treasurer year-end forecast edits share one durable store (`/api/budget/requests` + `/api/budget/forecast`). Forecast overrides live in `yeForecast` and are what every page uses for the 2026 year-end column.

### Production persistence (required on Vercel)

Set these on the Vercel project:

- `TREASURER_PASSWORD` — treasurer login
- `TREASURER_SESSION_SECRET` — optional cookie signing secret (defaults to the password)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` — Vercel KV (or compatible) so Saves survive across serverless instances

Without KV, local/dev uses `thoms_estate_hoa_site/data/requests.json`. That file is **not** durable on Vercel.

Historical plan vs actual comes from Tessier year-end board packets (2020, 2021, 2022, 2023, 2025). 2026 is the current approved / operating year with Jul 2026 YTD on file.

## Deploy to this domain

`www.thomsestatehoa.com` is currently a Namecheap parking page.

1. In Vercel, **Import Git Repository** and choose this repo (`HOALoans/Thoms-Estate-HOA`). Set **Root Directory** to `thoms_estate_hoa_site`.
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
