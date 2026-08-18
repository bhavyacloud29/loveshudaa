-- Atomically connect two profiles by invite code.
--
-- The previous client-side flow (select, then insert, then two updates)
-- ran as separate unguarded queries, so it never checked whether the
-- CURRENT user already had a partner, and had no protection against two
-- people using the same code at the same moment (both could pass the
-- "already connected" check before either write landed). Wrapping the
-- whole thing in a single function with row locks (`for update`) makes
-- the check-then-write atomic, so at most one connection can ever
-- succeed for a given pair of rows.
create or replace function public.connect_partner(p_invite_code text)
returns table (couple_id uuid, partner_id uuid, partner_display_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_self public.profiles%rowtype;
  v_partner public.profiles%rowtype;
  v_couple_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_self from public.profiles where id = v_user_id for update;
  if v_self.partner_id is not null then
    raise exception 'You are already connected to a partner';
  end if;

  select * into v_partner from public.profiles
    where invite_code = upper(trim(p_invite_code))
    for update;

  if v_partner.id is null then
    raise exception 'Invalid invite code';
  end if;

  if v_partner.id = v_user_id then
    raise exception 'That is your own code';
  end if;

  if v_partner.partner_id is not null then
    raise exception 'This user is already connected to someone';
  end if;

  insert into public.couples (user1_id, user2_id)
    values (v_partner.id, v_user_id)
    returning id into v_couple_id;

  update public.profiles set partner_id = v_partner.id, couple_id = v_couple_id where id = v_user_id;
  update public.profiles set partner_id = v_user_id, couple_id = v_couple_id where id = v_partner.id;

  return query select v_couple_id, v_partner.id, v_partner.display_name;
end;
$$;

grant execute on function public.connect_partner(text) to authenticated;
