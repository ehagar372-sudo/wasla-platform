# WASLA (وصلة) — Phase 1 prototype
Static, bilingual (AR RTL default / EN LTR) public site in `site/`, plus Supabase migration in `supabase/migrations/`.
Run: `cd site && python3 -m http.server 8000` then open http://localhost:8000
Pages: index, explore, skill?id=, profile?id=, how-it-works, about, faq, contact, sign-in, sign-up.
Photos are labelled slots: add `<img>` inside `.photo` (see `slot()` in assets/app.js) with real, licensed photos.

## Photographs

The site shows real photographs when the files exist in `public/photos/`, and a clean branded visual otherwise
(never a broken image). The browser path has **no** `public` prefix: `public/photos/hero.jpg` is served as `/photos/hero.jpg`.
Filenames are case-sensitive on Vercel (Linux). Add licensed photos with these exact names (JPG, ideally 1600px wide, under 400 KB):

| File | Used in |
|---|---|
| `public/photos/hero.jpg` | Home hero |
| `public/photos/concept.jpg` | Home "the idea" section |
| `public/photos/language-practice.jpg` | Home language section |
| `public/photos/how-it-works.jpg` | How It Works hero |
| `public/photos/about.jpg` | About page |
| `public/photos/mentor.jpg` | (reserved) |
| `public/photos/categories/<slug>.jpg` | Skill cards: `programming`, `languages`, `design`, `business`, `media`, `writing`, `personal` |
