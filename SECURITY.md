# Security

Please report vulnerabilities privately by email to **TharrosDev@gmail.com**, not in a public issue or pull request. The repository is public.

Include what you found, how to reproduce it, and the URL or file involved. You will get a reply by email.

## Scope

- The site at https://tharros.ca and its source in this repository.
- The API routes `/api/research-request` (intake) and `/api/research-event` (readership).
- The `research-intake` Supabase Edge Function and the database migrations in `supabase/`.

Third-party services (Vercel, Supabase, Resend, GitHub) are out of scope; report issues in them to their vendors.

## Please don't

- Access, change or delete data that isn't yours, including other people's research requests.
- Run automated scans or load tests against the live site. Intake is rate-limited, and real requests reach a person.
- Submit real-looking test requests through the live form. Use a local setup (`README.md`, Quick start) instead.
