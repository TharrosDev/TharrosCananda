# Pre-launch checklist

Operational and legal items that remain outside the codebase.

## Research intake

- [ ] Configure `RESEARCH_INTAKE_WEBHOOK_URL` and test success, validation failure, upstream failure and timeout paths.
- [ ] Authenticate/sign the receiver so only the intended application can submit requests.
- [ ] Add platform/receiver rate limiting for `/api/research-request`.
- [ ] Define storage, access and retention for submitted research briefs.

## Identity and contact

- [ ] Set `NEXT_PUBLIC_RESEARCH_EMAIL` to a verified monitored address.
- [ ] Confirm the legal business name/registration status before adding legal identifiers or an address.
- [ ] Add verified founder/research-lead biography details only when the public wording has been approved.
- [ ] Add real author profiles only when actual publications identify those authors.

## Privacy and legal

- [ ] Review `/privacy` against the actual intake receiver, storage and retention setup, including Canadian and relevant European privacy obligations.
- [ ] Confirm any analytics endpoint's logging/IP handling matches the public privacy statement.
- [ ] Confirm engagement terms covering scope, payment, liability, confidentiality and advice boundaries.
- [ ] Confirm the indicative prices in `src/lib/services.ts`.

## Official data

- [ ] Smoke-test the deployed Statistics Canada WDS integration from the production host.
- [ ] Confirm the live table still exposes the expected trade, FTA and NAPCS dimensions.
- [ ] Verify Statistics Canada attribution renders beside every value-added display.
- [ ] Smoke-test Government of Canada CKAN search from the production host.
- [ ] Add source-health monitoring only after the production deployment path is known.

## Platform

- [ ] Confirm canonical `tharros.ca` / `www` redirect.
- [ ] Confirm HSTS configuration before any preload request.
- [ ] Add and test a Content-Security-Policy.
- [ ] Run deployed Lighthouse/Core Web Vitals checks.
- [ ] Run keyboard, screen-reader and zoom/reflow accessibility checks against production.
