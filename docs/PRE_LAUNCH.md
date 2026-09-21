# Pre-launch checklist

Operational and legal items to resolve outside the code before public launch. None of this is shown to visitors.

## Intake

- [ ] Configure `RESEARCH_INTAKE_WEBHOOK_URL` (https only) and test success, 4xx/5xx and timeout paths.
- [ ] Authenticate the receiver (shared-secret header or signed payload) so only this site can post to it.
- [ ] Add rate limiting on `/api/research-request` at the platform (e.g. a firewall rule) or the receiver. The app intentionally has none.
- [ ] Decide where submissions are stored, who can access them and how long they are retained.

## Contact and identity

- [ ] Set `NEXT_PUBLIC_RESEARCH_EMAIL` to a verified, monitored address (enables the email fallback, About contact and JSON-LD `email`).
- [ ] Confirm legal business name, registration status and any address before adding them to the site or structured data.

## Privacy and legal

- [ ] Have the privacy text on `/about#privacy` reviewed against the actual receiver, storage and retention setup (PIPEDA; GDPR for EU visitors and clients).
- [ ] Decide whether analytics will be enabled; if so, confirm the endpoint's own logging and IP handling match the privacy text.
- [ ] Confirm engagement terms (written scope, payment, liability, advice disclaimer) used when replying to requests.
- [ ] Confirm the indicative prices in `src/lib/services.ts` are the approved offer.

## Platform

- [ ] Canonical domain and `www` redirect; confirm HSTS `includeSubDomains` is appropriate before any preload submission.
- [ ] Consider a tested Content-Security-Policy (not added yet to avoid breaking Next.js runtime scripts).
- [ ] Run accessibility and performance checks on the deployed site.
