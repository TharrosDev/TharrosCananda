# Operations

Infrastructure, data flows and runbooks for the live setup, as of 2026-09-24. Update this file in the same PR whenever the infrastructure changes.

## Systems

| System | What | Notes |
| --- | --- | --- |
| Vercel | Project `tharroscananda` (team `meridiansocietycanada-7533s-projects`), Hobby plan, Node 24.x | Serves `tharros.ca`, and `www` 308-redirects to the apex. Vercel Analytics also runs there, and the site skips it when the browser sends Global Privacy Control. Deploys `main` automatically. |
| Supabase | Project `tharros-canada`, ref `kgiptvgefhnwxktzncui`, ca-central-1 | Postgres tables plus the `research-intake` Edge Function. |
| Resend | Sends from `requests@tharros.ca` | DKIM `resend._domainkey`; return path `send.tharros.ca`. |
| DNS | Vercel DNS | Apex SPF `v=spf1 -all`. DMARC is `p=none` with no report address, because the domain has no mailbox. |

Every variable is described in `README.md` (Environment).
- **Production** sets all of them except `RESEARCH_INTAKE_WEBHOOK_SECRET`, which comes from `intake_config`.
- **Preview** sets only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RESEARCH_EMAIL` and `RESEARCH_INTAKE_WEBHOOK_URL`.
  - Without Supabase access, previews count nothing.
  - Intake can't read the signing secret there, so previews can't submit it.

## Research intake

```text
form → POST /api/research-request (validate, honeypot, 32 KB cap)
     → HMAC-signed POST to Edge Function research-intake (8 s timeout)
     → insert into research_requests (idempotent on reference) → 200
     → after the response: Resend email to TharrosDev@gmail.com (Reply-To: requester)
```

- **Contract:** `X-Tharros-Signature: sha256=<hex HMAC-SHA256 of "<X-Tharros-Timestamp>.<raw body>">`. Timestamps more than 5 minutes off are rejected.
- **Success:** the receiver returns 2xx only once the request is stored. Anything else, or no answer within 8 s, is shown to the visitor as not sent, and their answers are kept.
- **Shared secret:** it lives in the service-role-only `intake_config` table (`webhook_secret`, `resend_api_key`), which both sides read. An env var of the same name overrides it on either side.
  - Both sides cache the secret per instance, so rotating it means redeploying both.
- **Email retries:** a failed email leaves `notified_at` null. The next successful request retries up to 5 such rows. That is the only retry path.
- **Retention:** rows older than 24 months are deleted by a trigger on insert and by the daily pg_cron job `purge-research-requests` (03:17 UTC). The privacy page reads the same period from `intakeRetention` in `src/data/organization.ts`.
- **Rate limit:** Vercel Firewall rule "Rate limit research intake": `POST /api/research-request`, 10 requests per 600 s per IP, deny. There is deliberately no in-process limiter.

## Research readership

Archive cards and the report header show "N reads · N citations". The counts are engaged unique readers, not page views.

- **Read:** the report viewer has been visible for 20 s in total, or the PDF was downloaded. Counted once per reader per publication per 30 days.
- **Citation:** a successful "Copy citation". Counted once per reader per publication (key kept for 12 months).
- **Not counted:** non-indexable publications, bots, cross-site requests and browsers sending Global Privacy Control.
- **Reader key:** `HMAC(METRICS_SECRET, ip|slug)`. Raw IPs are never stored, and keys cannot be linked across publications. The browser also remembers what it has already sent.
- **Storage:** `publication_events` and `publication_counts`, written only through `record_publication_event()` (service role). If Supabase is unreachable, counts are hidden rather than guessed.
- **No rate limit:** the Hobby plan allows one rule, which intake uses. The dedupe caps inflation at one count per IP and publication.

## Database

Every table has RLS enabled with no policies. That is intentional: only `service_role` can touch them, and the Supabase advisor's "RLS enabled, no policy" INFO notices are expected. SECURITY DEFINER functions use `search_path = ''`.

## Runbooks

**Check a production deploy.** Vercel occasionally misses a merge.
1. After merging, run `vercel ls`.
2. If no new Production build appeared, run `vercel deploy --prod --yes` from an up-to-date `main`.
3. Then run `npm run smoke -- https://tharros.ca`.

**Apply a migration.**
1. Add `supabase/migrations/<timestamp>_<name>.sql` with a timestamp after the latest live version.
2. Apply it with the Supabase MCP `apply_migration`.
3. Run `get_advisors` (security and performance) afterwards.

The live migration history uses the versions MCP assigned at apply time, not the file names, so `supabase db push` would see drift.

**Deploy the Edge Function.** Use the Supabase MCP `deploy_edge_function` with `verify_jwt: false`, and upload both `index.ts` and `payload.ts`. The Supabase CLI account here lacks deploy and secret rights. JWT verification must stay off: the function authenticates with the HMAC.

**Test intake end to end.** POST a clearly labelled test to `https://tharros.ca/api/research-request` and confirm the row exists with `notified_at` set. Then delete the row.

**Firewall.** Run `vercel firewall rules list`. (`vercel firewall overview` fails with a 402 on Hobby.) To recreate the rule:

```bash
vercel firewall rules add "Rate limit research intake" \
  --condition '{"type":"path","op":"eq","value":"/api/research-request"}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit --rate-limit-window 600 --rate-limit-requests 10 \
  --rate-limit-keys ip --rate-limit-action deny --yes
vercel firewall publish --yes
```

**Vercel API from Git Bash.** Prefix the command with `MSYS_NO_PATHCONV=1`, otherwise `/v9/...` is rewritten into a Windows path.

## Open before launch

- [ ] Fill `src/data/organization.ts` with verified details (research lead, legal entity, profiles) once the business is registered.
- [ ] Review `/privacy` against the actual intake storage and retention, covering Canadian and relevant European obligations.
- [ ] Confirm engagement terms: scope, payment, liability, confidentiality and advice boundaries.
- [x] The first real report sets `indexable: true` (`TC-2026-001`, 2026-09-16). `TC-EX-000` stays `indexable: false`.
- [ ] Run Lighthouse / Core Web Vitals and manual keyboard, screen-reader and reflow checks on production.
- [ ] Optional: HSTS `preload` plus hstspreload.org submission, and a mailbox or forwarding for `tharros.ca` so DMARC reports can be collected.
