-- Phone-based signups have no email, so the original handle_new_user
-- (split_part(new.email, '@', 1)) would set display_name to null for
-- them. Fall back to the phone number, then a generic default, so every
-- new profile still gets a usable display_name.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, invite_code)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), new.phone, 'User'),
    upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  );
  return new;
end;
$$;
