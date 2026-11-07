# WASLA (وصلة) — Phase 1 prototype
Static, bilingual (AR RTL default / EN LTR) public site in `site/`, plus Supabase migration in `supabase/migrations/`.
Run: `cd site && python3 -m http.server 8000` then open http://localhost:8000
Pages: index, explore, skill?id=, profile?id=, how-it-works, about, faq, contact, sign-in, sign-up.
Photos are labelled slots: add `<img>` inside `.photo` (see `slot()` in assets/app.js) with real, licensed photos.
