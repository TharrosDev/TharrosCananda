-- Daily purge of expired reader keys, so the 30-day and 12-month promises on /privacy hold even
-- when no new readership event arrives to trigger the purge in record_publication_event().

select cron.unschedule(jobid) from cron.job where jobname = 'purge-publication-events';
select cron.schedule(
  'purge-publication-events',
  '23 3 * * *',
  $$delete from public.publication_events where (kind = 'read' and created_at < now() - interval '30 days') or (kind = 'cite' and created_at < now() - interval '12 months')$$
);
