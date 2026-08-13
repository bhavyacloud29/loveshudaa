-- Backfill profiles for auth.users created before the couple-system
-- migration (001) added the handle_new_user trigger. That trigger only
-- fires on new signups, so any account created earlier has no profiles
-- row and therefore no invite_code, breaking the Connect page.
insert into public.profiles (id, display_name, invite_code)
select
  u.id,
  split_part(u.email, '@', 1),
  upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
