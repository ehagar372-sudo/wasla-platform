-- WASLA | وصلة — Phase 1 schema
-- Tables: profiles, skill_categories, skills, user_skills, exchange_requests, contact_messages
-- Every table has Row Level Security enabled. Review before applying to a production project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles  (one row per auth user; contains ONLY information that may be public)
-- Email and other private data stay in auth.users and are never copied here.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text check (full_name is null or char_length(full_name) between 1 and 100),
  bio           text check (bio is null or char_length(bio) <= 600),
  avatar_url    text,
  interests     text[] not null default '{}',
  availability  text check (availability is null or char_length(availability) <= 200),
  is_public     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Public profiles are readable by everyone; a user can always read their own.
create policy "profiles_select_public_or_own" on public.profiles
  for select using (is_public or auth.uid() = id);

-- Users can only change their own row (the row itself is created by the trigger below).
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Create the profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 100), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- skill_categories  (reference data, public read-only)
-- ---------------------------------------------------------------------------
create table public.skill_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name_ar     text not null,
  name_en     text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.skill_categories enable row level security;

create policy "skill_categories_select_all" on public.skill_categories
  for select using (true);

-- ---------------------------------------------------------------------------
-- skills  (catalogue of skill names, public read)
-- ---------------------------------------------------------------------------
create table public.skills (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.skill_categories (id) on delete restrict,
  name_ar      text not null check (char_length(name_ar) between 1 and 120),
  name_en      text not null check (char_length(name_en) between 1 and 120),
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (category_id, name_en)
);

create index skills_category_id_idx on public.skills (category_id);

alter table public.skills enable row level security;

create policy "skills_select_all" on public.skills
  for select using (true);

create policy "skills_insert_authenticated" on public.skills
  for insert to authenticated with check (created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- user_skills  (a person OFFERS a skill they can teach, or WANTS a skill to learn)
-- This is what Explore shows (kind = 'offer').
-- ---------------------------------------------------------------------------
create type public.user_skill_kind  as enum ('offer', 'want');
create type public.skill_level      as enum ('beginner', 'intermediate', 'advanced', 'expert');

create table public.user_skills (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  skill_id      uuid not null references public.skills (id) on delete cascade,
  kind          public.user_skill_kind not null,
  level         public.skill_level,
  description   text check (description is null or char_length(description) <= 1000),
  outcomes      text[] not null default '{}',
  is_available  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, skill_id, kind)
);

create index user_skills_user_id_idx        on public.user_skills (user_id);
create index user_skills_skill_id_idx       on public.user_skills (skill_id);
create index user_skills_kind_available_idx on public.user_skills (kind, is_available, created_at desc);

create trigger user_skills_set_updated_at
  before update on public.user_skills
  for each row execute function public.set_updated_at();

alter table public.user_skills enable row level security;

-- Visible when the owner's profile is public, or when it is your own entry.
create policy "user_skills_select_public_or_own" on public.user_skills
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = user_skills.user_id and p.is_public)
  );

create policy "user_skills_insert_own" on public.user_skills
  for insert to authenticated with check (user_id = auth.uid());

create policy "user_skills_update_own" on public.user_skills
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user_skills_delete_own" on public.user_skills
  for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- exchange_requests  (visible ONLY to its sender and its recipient)
-- ---------------------------------------------------------------------------
create type public.exchange_status as enum ('pending', 'accepted', 'rejected', 'cancelled');

create table public.exchange_requests (
  id                       uuid primary key default gen_random_uuid(),
  sender_id                uuid not null references public.profiles (id) on delete cascade,
  recipient_id             uuid not null references public.profiles (id) on delete cascade,
  requested_user_skill_id  uuid references public.user_skills (id) on delete set null,
  offered_user_skill_id    uuid references public.user_skills (id) on delete set null,
  message                  text not null check (char_length(message) between 10 and 1000),
  status                   public.exchange_status not null default 'pending',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create index exchange_requests_sender_idx    on public.exchange_requests (sender_id, created_at desc);
create index exchange_requests_recipient_idx on public.exchange_requests (recipient_id, status, created_at desc);

-- A sender can only have one PENDING request per requested skill.
create unique index exchange_requests_one_pending_idx
  on public.exchange_requests (sender_id, requested_user_skill_id)
  where status = 'pending';

create trigger exchange_requests_set_updated_at
  before update on public.exchange_requests
  for each row execute function public.set_updated_at();

alter table public.exchange_requests enable row level security;

create policy "exchange_requests_select_participants" on public.exchange_requests
  for select to authenticated using (auth.uid() in (sender_id, recipient_id));

-- The recipient must be the owner of the requested skill, so a request cannot be addressed to a stranger.
create policy "exchange_requests_insert_sender" on public.exchange_requests
  for insert to authenticated with check (
    sender_id = auth.uid()
    and status = 'pending'
    and exists (
      select 1 from public.user_skills us
      where us.id = requested_user_skill_id and us.user_id = recipient_id and us.kind = 'offer'
    )
  );

-- Recipient may accept / reject; sender may cancel. Only the `status` column can be changed (see grants below).
create policy "exchange_requests_update_recipient" on public.exchange_requests
  for update to authenticated
  using (auth.uid() = recipient_id and status = 'pending')
  with check (auth.uid() = recipient_id and status in ('accepted', 'rejected'));

create policy "exchange_requests_update_sender" on public.exchange_requests
  for update to authenticated
  using (auth.uid() = sender_id and status = 'pending')
  with check (auth.uid() = sender_id and status = 'cancelled');

revoke update on public.exchange_requests from authenticated;
grant update (status) on public.exchange_requests to authenticated;

-- ---------------------------------------------------------------------------
-- contact_messages  (write-only from the public site; read via the Supabase dashboard / service role)
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name)    between 2 and 100),
  email       text not null check (char_length(email)   between 5 and 200),
  subject     text not null check (char_length(subject) between 3 and 150),
  message     text not null check (char_length(message) between 10 and 2000),
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_insert_anyone" on public.contact_messages
  for insert to anon, authenticated with check (true);
-- Intentionally no SELECT policy: messages can't be read through the public API.
