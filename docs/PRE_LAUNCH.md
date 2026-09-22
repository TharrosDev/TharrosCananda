# Pre-launch checklist

Operational and legal items that remain outside the codebase.

## Research intake

- [ ] Configure `RESEARCH_INTAKE_WEBHOOK_URL` and test success, validation failure, upstream failure and timeout paths.
- [x] Application signs each webhook payload with HMAC-SHA256 when `RESEARCH_INTAKE_WEBHOOK_SECRET` is configured. Configure the receiver with the same secret and verify the timestamp/signature before accepting requests.
- [ ] Add distributed platform/receiver rate limiting for `/api/research-request`. Do not substitute process-memory throttling on serverless instances.
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
- [x] Add a production Content-Security-Policy in `next.config.ts`; confirm the deployed header once final production deployment is available.
- [ ] Run deployed Lighthouse/Core Web Vitals checks.
- [ ] Run keyboard, screen-reader and zoom/reflow accessibility checks against production.\n- [ ] Capture and approve the initial Playwright visual-regression baseline after the final polish branch is reviewed.\n- [ ] Add verified founder/research-lead biography details only after the public wording and identity details are explicitly approved; do not infer them from repository/account metadata.
