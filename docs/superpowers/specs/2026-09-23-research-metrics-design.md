# Research reads and citations: design

Approved in chat 2026-09-23.

## Goal

Show how often each real publication is read and cited, on archive cards and the report header, counting engaged unique readers rather than raw opens or clicks.

## Counting rules

- **Read:** the report viewer is on screen in the visible tab for 20 s cumulatively, or the PDF is downloaded. Once per reader per publication per 30 days.
- **Citation:** a successful "Copy citation" (any style), from an archive card or the report page. Opening the Cite panel does not count. Once per reader per publication.
- **Never counted:** specimen or non-indexable publications, bot user agents, cross-site requests, browsers sending Global Privacy Control.

## Reader identity (no cookies)

- Server key: `HMAC-SHA256(METRICS_SECRET, ip | slug)`, truncated. Raw IPs are never stored; including the slug means keys cannot be linked across publications. The user agent is left out because it is free to forge; readers sharing one network count once (conservative).
- The browser remembers its own counted events in localStorage, so repeat visits do not call the API.
- Keys expire: reads after 30 days, citations after 12 months (purged on write).

## Storage (Supabase project `tharros-canada`, server-only)

- `publication_counts(slug, reads, citations, updated_at)`.
- `publication_events(slug, kind, reader, created_at)`, primary key `(slug, kind, reader)`.
- `record_publication_event(slug, kind, reader)`: purges expired keys, inserts the key if new and increments the count in one transaction. Returns whether it counted.
- RLS on with no policies; only `service_role` can execute the function or read the tables.
- The site uses PostgREST over `fetch` (no new dependency) with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## API

`POST /api/research-event` `{ slug, kind }`. JSON only, same-site only, bot UA rejected, slug must be a counted publication. Always answers 204 (it never reveals whether an event was a duplicate). Without configuration it is a no-op. Rate limit: Vercel Firewall rule, as for the intake route.

## Display

- "1,240 reads · 38 citations"; a zero part is omitted, and nothing is shown when both are zero.
- The research pages stay static and revalidate counts every 10 minutes.
- If Supabase is unreachable or unconfigured, counts are hidden, never guessed.

## Testing

Unit tests for the reader key, bot filter, count formatting and the client dedupe window. A SQL check of the function's dedupe. The e2e run has no database: counts are hidden and the specimen never shows counts.
