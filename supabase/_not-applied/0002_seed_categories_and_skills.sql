-- Reference data only: categories and a starter catalogue of skill names.
-- This file creates NO users, NO listings and NO reviews.

insert into public.skill_categories (slug, name_ar, name_en, sort_order) values
  ('programming',           'البرمجة والتقنية',   'Programming & Technology', 1),
  ('languages',             'اللغات',             'Languages',                2),
  ('design',                'التصميم والإبداع',   'Design & Creativity',      3),
  ('marketing',             'التسويق والأعمال',   'Marketing & Business',     4),
  ('photography',           'التصوير والفيديو',   'Photography & Video',      5),
  ('writing',               'الكتابة والمحتوى',   'Writing & Content',        6),
  ('personal-development',  'التطوير الشخصي',     'Personal Development',     7),
  ('other',                 'مهارات أخرى',        'Other Skills',             8)
on conflict (slug) do nothing;

insert into public.skills (category_id, name_ar, name_en)
select c.id, s.name_ar, s.name_en
from (values
  ('programming', 'تطوير الويب',               'Web development'),
  ('programming', 'React',                      'React'),
  ('programming', 'بايثون',                     'Python'),
  ('programming', 'تحليل البيانات',             'Data analysis'),
  ('languages',   'اللغة الإنجليزية',           'English'),
  ('languages',   'اللغة الفرنسية',             'French'),
  ('languages',   'اللغة الألمانية',            'German'),
  ('design',      'التصميم الجرافيكي',          'Graphic design'),
  ('design',      'تصميم واجهات المستخدم',      'UI design'),
  ('marketing',   'التسويق الرقمي',             'Digital marketing'),
  ('marketing',   'إدارة المشاريع',             'Project management'),
  ('photography', 'التصوير الفوتوغرافي',        'Photography'),
  ('photography', 'مونتاج الفيديو',             'Video editing'),
  ('writing',     'كتابة المحتوى',              'Content writing'),
  ('writing',     'الكتابة الإبداعية',          'Creative writing'),
  ('personal-development', 'مهارات العرض والإلقاء', 'Public speaking'),
  ('personal-development', 'إدارة الوقت',       'Time management')
) as s (category_slug, name_ar, name_en)
join public.skill_categories c on c.slug = s.category_slug
on conflict (category_id, name_en) do nothing;
