# Pre-launch checklist

Operational and legal items that remain outside the codebase.

## Research intake

- [ ] Configure `RESEARCH_INTAKE_WEBHOOK_URL` (https) and `RESEARCH_INTAKE_WEBHOOK_SECRET`. Without both, the API returns 503 and the form says the request was not sent.
- [ ] On the receiver, verify `X-Tharros-Signature: sha256=<hex HMAC-SHA256 of "<X-Tharros-Timestamp>.<raw body>">` and reject stale timestamps (for example, older than 5 minutes). `X-Tharros-Request-Id` and the payload `reference` match the reference the visitor sees.
- [ ] The receiver must return 2xx only once the request is stored. Any other status, a redirect or no answer within 8 s is shown to the visitor as not sent (502 / 504), with their answers kept.
- [ ] After deploying, run `npm run smoke -- https://tharros.ca`, then submit one real request and confirm it arrives with its reference.
- [ ] Add the Vercel Firewall rate limit below.
- [ ] Define storage, access and retention for submitted requests, then set `intakeRetention` in `src/data/organization.ts` so `/privacy` states it.

### Rate limit (Vercel Firewall)

There is no in-process limiter (it would be per instance on serverless). The limit is a Vercel WAF rule, which counts per client across instances. Link the project (`vercel link`) and stage it in log mode first:

```bash
vercel firewall rules add "Rate limit research intake" \
  --condition '{"type":"path","op":"eq","value":"/api/research-request"}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit --rate-limit-window 600 --rate-limit-requests 20 \
  --rate-limit-keys ip --rate-limit-action log --yes
vercel firewall diff
vercel firewall publish --yes
```

After a few days of dashboard review (`/firewall/traffic?filter=<ruleId>`), tighten to about 5 requests per 10 minutes and switch `--rate-limit-action` to `rate_limit` (HTTP 429). The form treats any non-201 response as not sent. Counters are per region.

## Identity and contact

- [x] Public contact address: TharrosDev@gmail.com (default in `src/lib/contact.ts`; `NEXT_PUBLIC_RESEARCH_EMAIL` overrides it). Confirm the inbox is monitored.
- [ ] Fill `src/data/organization.ts` with verified details only: research lead (name, role, short approved bio, real profile links), legal entity (legal name, jurisdiction, registration, address) and company profiles. Each block stays hidden until it is set.
- [ ] Add real author profiles only when actual publications identify those authors.

## Privacy and legal

- [ ] Review `/privacy` against the actual intake receiver, storage and retention setup, including Canadian and relevant European privacy obligations.
- [ ] Confirm any analytics endpoint's logging/IP handling matches the public privacy statement.
- [ ] Confirm engagement terms covering scope, payment, liability, confidentiality and advice boundaries.
- [ ] Confirm the indicative prices in `src/lib/services.ts`.

## Live Monitor

- [ ] Configure the production `CURRENTS_API_KEY` and smoke-test `/live-monitor` from the deployed host.
- [ ] Confirm the Currents account plan supports the deployed request volume and the public, customer-facing metadata/snippet display. Currents plan limits and content-use terms can change; review the current Search API, pricing and Terms before launch.
- [ ] Keep the visible Currents attribution and original-publisher links intact. Do not add article-body storage, persistent archives, automated customer-facing summaries or redistribution without separately confirming the required rights.
- [ ] Confirm a quota-exhausted or upstream-failure response shows the explicit unavailable state and never synthetic coverage.

## Platform

- [ ] Confirm canonical `tharros.ca` / `www` redirect.
- [ ] Confirm HSTS configuration before any preload request.
- [x] Add a production Content-Security-Policy in `next.config.ts`; confirm the deployed header once final production deployment is available.
- [ ] Run deployed Lighthouse/Core Web Vitals checks.
- [ ] Run keyboard, screen-reader and zoom/reflow accessibility checks against production.
- [ ] Run the **Update visual baselines** workflow on the release branch and approve the Linux baselines in the pull request.
