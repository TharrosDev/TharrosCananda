-- Refresh only this reader's expired key. Daily pg_cron still purges all expired keys;
-- a readership event must not scan and delete unrelated readers on every request.
create or replace function public.record_publication_event(p_slug text, p_kind text, p_reader text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_kind is null or p_kind not in ('read', 'cite') then
    raise exception 'unknown kind %', p_kind;
  end if;

  insert into public.publication_events as events (slug, kind, reader)
  values (p_slug, p_kind, p_reader)
  on conflict (slug, kind, reader) do update
    set created_at = excluded.created_at
    where events.created_at <= now() -
      case p_kind when 'read' then interval '30 days' else interval '12 months' end;
  if not found then
    return false;
  end if;

  insert into public.publication_counts (slug, reads, citations)
  values (p_slug, (p_kind = 'read')::int, (p_kind = 'cite')::int)
  on conflict (slug) do update
    set reads = public.publication_counts.reads + excluded.reads,
        citations = public.publication_counts.citations + excluded.citations,
        updated_at = now();
  return true;
end;
$$;

revoke execute on function public.record_publication_event(text, text, text) from public, anon, authenticated;
grant execute on function public.record_publication_event(text, text, text) to service_role;
