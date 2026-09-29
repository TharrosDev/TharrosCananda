# Operations

Infrastructure and runbooks for the research-only site. Update this file when a deployment or backend dependency changes.

## Systems

| System | Current role | Notes |
| --- | --- | --- |
| Vercel | Hosts `tharros.ca` and Web Analytics | Project `tharroscananda` (team `meridiansocietycanada-7533s-projects`), Hobby plan, Node 24.x. `www` 308-redirects to the apex. `main` deploys automatically. |
| Supabase | Readership counts and retained earlier research requests | Project `tharros-canada`, ref `kgiptvgefhnwxktzncui`, ca-central-1. `publication_events` and `publication_counts` remain active. Earlier `research_requests` rows keep their retention policy. |
| Resend | Legacy intake notifications only | The site no longer submits requests after this change deploys. Do not use Resend as a public research contact mechanism. |
| DNS | Vercel DNS | Apex SPF `v=spf1 -all`. DMARC is `p=none` with no report address, because the domain has no mailbox. |

`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_RESEARCH_EMAIL` are public values. The readership API uses server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `METRICS_SECRET`. Without all three, counts are hidden. See `README.md` and `.env.example`.

## Retired research intake

`/research-services` and `/request-research` now redirect to `/research`; `/how-it-works` redirects to `/methodology`. `POST /api/research-request` always returns 410 and never forwards its body. The old Edge Function source and SQL migrations remain in the repository while the deployed function and legacy records are retired. They are not part of the public product.

After the research-only site is deployed:

1. Verify the redirects and 410 response with `npm run smoke -- https://tharros.ca`.
2. Inspect any earlier `research_requests` rows, including undelivered notifications, before decommissioning the deployed `research-intake` Edge Function. Do not delete request data as part of the site release.
3. Decommission the deployed function and remove unused Vercel intake environment variables and the Vercel Firewall rule named `Rate limit research intake`. Remove unused intake secrets only after the function is disabled. Backend changes are separate from the site merge.
4. Keep the 24-month retention job `purge-research-requests` (03:17 UTC) and the table until every earlier row has expired or been handled under the privacy policy. The privacy page reads the same period from `src/data/organization.ts`.

The historical receiver contract and code remain in `supabase/functions/research-intake/`; do not redeploy it for the research-only site. The `research_requests` and `intake_config` migrations are historical and must not be removed from migration history.

## Research readership

Archive cards and the report header show "N views · N citations" for indexable publications. These are engaged unique readers, not page views.

- **Read:** the report viewer has been visible for 20 seconds in total, or the PDF was downloaded. Counted once per reader per publication per 30 days.
- **Citation:** a successful "Copy citation". Counted once per reader per publication (key kept for 12 months).
- **Not counted:** non-indexable publications, bots, cross-site requests and browsers sending Global Privacy Control.
- **Reader key:** `HMAC(METRICS_SECRET, ip|slug)`. Raw IPs are never stored, and keys cannot be linked across publications. The browser also remembers what it has counted.
- **Storage:** `publication_events` and `publication_counts`, written only through `record_publication_event()` (service role). Expired keys are purged on each event and by the daily pg_cron job `purge-publication-events` (03:23 UTC). If Supabase is unreachable, counts are hidden.

Every table has RLS enabled with no policies. Only `service_role` can touch them, and the Supabase advisor's "RLS enabled, no policy" INFO notices are expected. SECURITY DEFINER functions use `search_path = ''`.

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

**Vercel API from Git Bash.** Prefix the command with `MSYS_NO_PATHCONV=1`, otherwise `/v9/...` is rewritten into a Windows path.

## Open before wider publication

- [ ] Fill `src/data/organization.ts` with verified details only if the owner chooses to publish them; the student project does not require a personal profile.
- [ ] Review `/privacy` against actual legacy intake storage and retention, including applicable Canadian and European obligations.
- [ ] Confirm decommissioning of the deployed intake function, secrets and Firewall rule after the site release.
- [ ] Keep each report `indexable: false` until the owner explicitly approves indexing; report release and search indexing are separate decisions.
- [ ] Run Lighthouse / Core Web Vitals and manual keyboard, screen-reader and reflow checks on production.
