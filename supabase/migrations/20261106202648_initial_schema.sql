-- WASLA initial schema: profiles, categories, skills, user_skills, exchange_requests, contact_messages

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

-- profiles -------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  bio text check (char_length(bio) <= 600),
  avatar_url text,
  interests text[] not null default '{}',
  availability text check (char_length(availability) <= 200),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(left(new.raw_user_meta_data->>'display_name', 80), ''));
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- categories & skills catalog -----------------------------------------
create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete restrict,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  created_at timestamptz not null default now()
);
create index skills_category_idx on public.skills(category_id);

-- user_skills: what a user offers / wants ------------------------------
create table public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  kind text not null check (kind in ('offer','want')),
  level text check (level in ('beginner','intermediate','advanced','expert')),
  description text check (char_length(description) <= 800),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, skill_id, kind)
);
create index user_skills_user_idx on public.user_skills(user_id);
create index user_skills_skill_kind_idx on public.user_skills(skill_id, kind);
create trigger user_skills_updated before update on public.user_skills
  for each row execute function public.set_updated_at();

-- exchange_requests -----------------------------------------------------
create table public.exchange_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  requested_skill_id uuid not null references public.skills(id) on delete restrict,
  offered_skill_id uuid references public.skills(id) on delete restrict,
  message text check (char_length(message) <= 1000),
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create index exchange_requests_sender_idx on public.exchange_requests(sender_id);
create index exchange_requests_recipient_idx on public.exchange_requests(recipient_id);
create index exchange_requests_requested_skill_idx on public.exchange_requests(requested_skill_id);
create index exchange_requests_offered_skill_idx on public.exchange_requests(offered_skill_id);
create trigger exchange_requests_updated before update on public.exchange_requests
  for each row execute function public.set_updated_at();

-- contact_messages (insert-only from the public site) -------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null check (char_length(subject) between 3 and 150),
  message text not null check (char_length(message) between 10 and 3000),
  created_at timestamptz not null default now()
);

-- RLS -------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.exchange_requests enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles readable if public or own" on public.profiles
  for select to anon, authenticated
  using (is_public or id = (select auth.uid()));
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "categories public read" on public.skill_categories
  for select to anon, authenticated using (true);
create policy "skills public read" on public.skills
  for select to anon, authenticated using (true);

create policy "user_skills readable for public profiles or own" on public.user_skills
  for select to anon, authenticated
  using (user_id = (select auth.uid())
         or exists (select 1 from public.profiles p where p.id = user_id and p.is_public));
create policy "user_skills insert own" on public.user_skills
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "user_skills update own" on public.user_skills
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "user_skills delete own" on public.user_skills
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "requests visible to parties" on public.exchange_requests
  for select to authenticated
  using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));
create policy "requests insert as sender" on public.exchange_requests
  for insert to authenticated
  with check (sender_id = (select auth.uid()) and status = 'pending');
create policy "requests update by parties" on public.exchange_requests
  for update to authenticated
  using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()))
  with check (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));

create policy "contact insert public" on public.contact_messages
  for insert to anon, authenticated with check (true);
-- no select/update/delete policies: messages are readable only via service role / dashboard.

-- Seed catalog (categories + skills; not user data) ---------------------
insert into public.skill_categories (slug, name_ar, name_en, sort_order) values
 ('programming','البرمجة والتقنية','Programming & Technology',1),
 ('languages','اللغات','Languages',2),
 ('design','التصميم والإبداع','Design & Creativity',3),
 ('business','التسويق والأعمال','Marketing & Business',4),
 ('media','التصوير والفيديو','Photography & Video',5),
 ('writing','الكتابة والمحتوى','Writing & Content',6),
 ('personal','التطوير الشخصي','Personal Development',7);

insert into public.skills (category_id, slug, name_ar, name_en, description_ar, description_en)
select c.id, s.slug, s.name_ar, s.name_en, s.da, s.de from (values
 ('programming','react','تطوير الواجهات بـ React','Front-end with React','بناء واجهات ويب حديثة باستخدام React.','Build modern web interfaces with React.'),
 ('programming','python','بايثون','Python','أساسيات البرمجة وتحليل البيانات بلغة بايثون.','Programming fundamentals and data analysis with Python.'),
 ('languages','english','اللغة الإنجليزية','English','محادثة وكتابة وتحسين النطق.','Conversation, writing and pronunciation.'),
 ('languages','german','اللغة الألمانية','German','قواعد ومحادثة للمبتدئين.','Grammar and conversation for beginners.'),
 ('design','ui-design','تصميم واجهات المستخدم','UI Design','أساسيات التصميم والتخطيط والألوان باستخدام Figma.','Layout, color and typography fundamentals in Figma.'),
 ('design','graphic-design','التصميم الجرافيكي','Graphic Design','الهوية البصرية والتصميم للمطبوعات والسوشيال ميديا.','Visual identity, print and social design.'),
 ('business','digital-marketing','التسويق الرقمي','Digital Marketing','استراتيجيات المحتوى والإعلانات والتحليلات.','Content, ads and analytics strategy.'),
 ('media','photography','التصوير الفوتوغرافي','Photography','الإضاءة والتكوين والتعديل.','Lighting, composition and editing.'),
 ('media','video-editing','مونتاج الفيديو','Video Editing','القص والإيقاع وتصحيح الألوان.','Cutting, pacing and color grading.'),
 ('writing','content-writing','كتابة المحتوى','Content Writing','كتابة مقالات ومحتوى جذاب.','Writing engaging articles and copy.'),
 ('personal','public-speaking','فن الإلقاء','Public Speaking','الثقة والتحضير وتقديم العروض.','Confidence, preparation and presenting.')
) as s(cat,slug,name_ar,name_en,da,de)
join public.skill_categories c on c.slug = s.cat;
