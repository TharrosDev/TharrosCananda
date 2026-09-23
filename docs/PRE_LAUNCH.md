# Pre-launch checklist

Operational and legal items that remain outside the codebase.

## Research intake

- [x] Receiver: Supabase Edge Function `research-intake` (project `tharros-canada`, source in `supabase/functions/research-intake`). It verifies the signature, stores the request in `research_requests` (purged after 24 months), then emails TharrosDev@gmail.com from `requests@tharros.ca` via Resend with Reply-To set to the requester. `RESEARCH_INTAKE_WEBHOOK_URL` is set in Vercel; the shared secret lives in the service-role-only `intake_config` table (an explicit `RESEARCH_INTAKE_WEBHOOK_SECRET` env var would override it).
- [x] On the receiver, verify `X-Tharros-Signature: sha256=<hex HMAC-SHA256 of "<X-Tharros-Timestamp>.<raw body>">` and reject stale timestamps (for example, older than 5 minutes). `X-Tharros-Request-Id` and the payload `reference` match the reference the visitor sees.
- [x] The receiver must return 2xx only once the request is stored. Any other status, a redirect or no answer within 8 s is shown to the visitor as not sent (502 / 504), with their answers kept.
- [ ] After deploying, run `npm run smoke -- https://tharros.ca`, then submit one real request and confirm it arrives with its reference.
- [x] Vercel Firewall rate limit live (2026-09-23): 10 requests per 10 minutes per IP, deny.
- [ ] Define storage and access for submitted requests. Retention is set: `intakeRetention` in `src/data/organization.ts` so `/privacy` states it.

### Rate limit (Vercel Firewall)

There is no in-process limiter (it would be per instance on serverless). The limit is a Vercel WAF rule, which counts per client across instances. The live rule, for reference or to recreate it after `vercel link`:

```bash
vercel firewall rules add "Rate limit research intake" \
  --condition '{"type":"path","op":"eq","value":"/api/research-request"}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit --rate-limit-window 600 --rate-limit-requests 10 \
  --rate-limit-keys ip --rate-limit-action deny --yes
vercel firewall diff
vercel firewall publish --yes
```

Review blocked traffic in the dashboard (`/firewall/traffic?filter=<ruleId>`). The form treats any non-201 response as not sent. Counters are per region.

## Research readership

- [x] Create the Supabase project `tharros-canada` and apply `supabase/migrations/20260923000000_publication_metrics.sql`.
- [x] Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `METRICS_SECRET` in Vercel (Production). Without them nothing is counted and counts stay hidden.
- [x] No rate limit on `POST /api/research-event`: the Hobby plan allows one rate-limit rule, used for intake. Inflation is bounded by the IP-keyed reader dedupe. Add a rule (60 per 10 minutes per IP) if the plan is upgraded.

## Identity and contact

- [x] Public contact address: TharrosDev@gmail.com (default in `src/lib/contact.ts`; `NEXT_PUBLIC_RESEARCH_EMAIL` overrides it). Confirm the inbox is monitored.
- [ ] Fill `src/data/organization.ts` with verified details only: research lead (name, role, short approved bio, real profile links), legal entity (legal name, jurisdiction, registration, address) and company profiles. Each block stays hidden until it is set.
- [ ] Add real author profiles only when actual publications identify those authors.
- [ ] The first real report must set `indexable: true`; the lorem example (`TC-EX-000`) must stay `indexable: false`.

## Privacy and legal

- [ ] Review `/privacy` against the actual intake receiver, storage and retention setup, including Canadian and relevant European privacy obligations.
- [ ] Confirm any analytics endpoint's logging/IP handling matches the public privacy statement.
- [ ] Confirm engagement terms covering scope, payment, liability, confidentiality and advice boundaries.
- [ ] Confirm the indicative prices in `src/lib/services.ts`.

## Platform

- [ ] Confirm canonical `tharros.ca` / `www` redirect.
- [ ] Confirm HSTS configuration before any preload request.
- [x] Add a production Content-Security-Policy in `next.config.ts`; confirm the deployed header once final production deployment is available.
- [ ] Run deployed Lighthouse/Core Web Vitals checks.
- [ ] Run keyboard, screen-reader and zoom/reflow accessibility checks against production.
- [ ] Run the **Update visual baselines** workflow on the release branch and approve the Linux baselines in the pull request.
