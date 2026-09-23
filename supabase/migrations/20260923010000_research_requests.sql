-- Commission requests received from the site's /api/research-request (via the research-intake Edge Function).
create table public.research_requests (
  reference uuid primary key,
  submitted_at timestamptz not null,
  received_at timestamptz not null default now(),
  notified_at timestamptz,
  company_name text not null,
  email text not null,
  payload jsonb not null
);
create index research_requests_received on public.research_requests (received_at desc);

alter table public.research_requests enable row level security;
revoke all on public.research_requests from anon, authenticated;

-- Retention stated on /privacy: 24 months after the last contact. Purged on every insert.
create function public.purge_research_requests() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from research_requests where received_at < now() - interval '24 months';
  return null;
end;
$$;
revoke execute on function public.purge_research_requests() from public, anon, authenticated;
create trigger research_requests_retention after insert on public.research_requests
  for each statement execute function public.purge_research_requests();
