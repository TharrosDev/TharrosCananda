-- Hardening: empty search_path with fully qualified names (Supabase advisor 0011), and a daily
-- retention purge so the 24-month promise on /privacy holds even when no new request arrives.

create or replace function public.record_publication_event(p_slug text, p_kind text, p_reader text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_kind not in ('read', 'cite') then
    raise exception 'unknown kind %', p_kind;
  end if;

  -- Expired keys: a read can count again after 30 days; citation keys are kept 12 months.
  delete from public.publication_events
  where (kind = 'read' and created_at < now() - interval '30 days')
     or (kind = 'cite' and created_at < now() - interval '12 months');

  insert into public.publication_events (slug, kind, reader) values (p_slug, p_kind, p_reader)
  on conflict do nothing;
  if not found then
    return false;
  end if;

  insert into public.publication_counts (slug, reads, citations)
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

-- Runs as the inserting role (service_role), which already has delete on the table.
create or replace function public.purge_research_requests() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.research_requests where received_at < now() - interval '24 months';
  return null;
end;
$$;
revoke execute on function public.purge_research_requests() from public, anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule(jobid) from cron.job where jobname = 'purge-research-requests';
select cron.schedule(
  'purge-research-requests',
  '17 3 * * *',
  $$delete from public.research_requests where received_at < now() - interval '24 months'$$
);
