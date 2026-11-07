-- PROPOSAL ONLY — NOT APPLIED. Needs the owner's approval because it changes existing RLS policies.
-- Fixes: (1) a sender can currently accept their own request or edit any column, (2) duplicate pending requests.
-- Section B (optional, separate decision) also stops requests to someone who does not offer the skill.

drop policy "requests update by parties" on public.exchange_requests;

create policy "requests recipient accepts or rejects" on public.exchange_requests
  for update to authenticated
  using (recipient_id = (select auth.uid()) and status = 'pending')
  with check (recipient_id = (select auth.uid()) and status in ('accepted','rejected'));

create policy "requests sender cancels" on public.exchange_requests
  for update to authenticated
  using (sender_id = (select auth.uid()) and status = 'pending')
  with check (sender_id = (select auth.uid()) and status = 'cancelled');

-- Only the status column may change.
revoke update on public.exchange_requests from authenticated;
grant update (status) on public.exchange_requests to authenticated;

-- One pending request per sender/recipient/skill (additive; fails if duplicates already exist).
create unique index exchange_requests_one_pending_idx
  on public.exchange_requests (sender_id, recipient_id, requested_skill_id) where status = 'pending';

-- ---------------------------------------------------------------------------
-- SECTION B (OPTIONAL): only allow requests addressed to a member who actually offers the skill.
-- Replaces the existing "requests insert as sender" policy. Not required for Section A.
-- ---------------------------------------------------------------------------
-- drop policy "requests insert as sender" on public.exchange_requests;
-- create policy "requests insert as sender" on public.exchange_requests
--   for insert to authenticated
--   with check (
--     sender_id = (select auth.uid())
--     and status = 'pending'
--     and exists (
--       select 1 from public.user_skills us
--       where us.user_id = recipient_id and us.skill_id = requested_skill_id
--         and us.kind = 'offer' and us.is_available
--     )
--   );
