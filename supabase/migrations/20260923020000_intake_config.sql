-- Receiver secrets, readable only by service_role (the Edge Function). Values are set out of band:
-- webhook_secret is generated here; resend_api_key is inserted manually and never committed.
create extension if not exists pgcrypto with schema extensions;
create table public.intake_config (key text primary key, value text not null);
alter table public.intake_config enable row level security;
revoke all on public.intake_config from anon, authenticated;
insert into public.intake_config (key, value)
values ('webhook_secret', encode(extensions.gen_random_bytes(32), 'hex'))
on conflict (key) do nothing;
