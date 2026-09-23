-- Engaged-reader counts for published research. Written only by the site's server (service_role).

create table public.publication_counts (
  slug text primary key,
  reads bigint not null default 0,
  citations bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- One row per reader per publication per kind: the dedupe key. `reader` is an HMAC, never an IP.
create table public.publication_events (
  slug text not null,
  kind text not null check (kind in ('read', 'cite')),
  reader text not null,
  created_at timestamptz not null default now(),
  primary key (slug, kind, reader)
);
create index publication_events_expiry on public.publication_events (kind, created_at);

alter table public.publication_counts enable row level security;
alter table public.publication_events enable row level security;
revoke all on public.publication_counts, public.publication_events from anon, authenticated;

create function public.record_publication_event(p_slug text, p_kind text, p_reader text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('read', 'cite') then
    raise exception 'unknown kind %', p_kind;
  end if;

  -- Expired keys: a read can count again after 30 days; citation keys are kept 12 months.
  delete from publication_events
  where (kind = 'read' and created_at < now() - interval '30 days')
     or (kind = 'cite' and created_at < now() - interval '12 months');

  insert into publication_events (slug, kind, reader) values (p_slug, p_kind, p_reader)
  on conflict do nothing;
  if not found then
    return false;
  end if;

  insert into publication_counts (slug, reads, citations)
  values (p_slug, (p_kind = 'read')::int, (p_kind = 'cite')::int)
  on conflict (slug) do update
    set reads = publication_counts.reads + excluded.reads,
        citations = publication_counts.citations + excluded.citations,
        updated_at = now();
  return true;
end;
$$;

revoke execute on function public.record_publication_event(text, text, text) from public, anon, authenticated;
grant execute on function public.record_publication_event(text, text, text) to service_role;
