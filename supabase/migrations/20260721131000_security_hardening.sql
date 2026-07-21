-- Security Hardening for StitchHub project

-- 1. Remove open development RLS policies on sample/legacy tables
drop policy if exists "dev_open_app_settings" on public.app_settings;
drop policy if exists "dev_open_customers" on public.customers;
drop policy if exists "dev_open_inventory" on public.inventory;
drop policy if exists "dev_open_orders" on public.orders;
drop policy if exists "dev_open_technicians" on public.technicians;

-- Revoke all access from public on legacy sample tables
revoke all on public.app_settings from anon, authenticated, public;
revoke all on public.customers from anon, authenticated, public;
revoke all on public.inventory from anon, authenticated, public;
revoke all on public.orders from anon, authenticated, public;
revoke all on public.technicians from anon, authenticated, public;

-- 2. Restrict direct API execution on SECURITY DEFINER functions in public schema
do $$
begin
  if exists (select 1 from pg_proc join pg_namespace n on n.oid = pg_proc.pronamespace where n.nspname = 'public' and proname = 'handle_new_user') then
    revoke execute on function public.handle_new_user() from public, anon, authenticated;
  end if;
  if exists (select 1 from pg_proc join pg_namespace n on n.oid = pg_proc.pronamespace where n.nspname = 'public' and proname = 'update_likes_count') then
    revoke execute on function public.update_likes_count() from public, anon, authenticated;
  end if;
exception when others then
  null;
end
$$;
