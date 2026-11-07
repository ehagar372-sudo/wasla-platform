import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * Photograph registry.
 *
 * No stock photos are bundled: this workspace had no external image access, and
 * image URLs must not be invented. Each entry below is an image SLOT. Drop a real
 * photograph at the listed path (inside /public) and it appears automatically.
 * Until then a clearly-labelled placeholder is shown.
 */
export interface PhotoSpec {
  file: string;
  alt: Record<Locale, string>;
}

export const photos = {
  hero: {
    file: "/photos/hero.jpg",
    alt: {
      ar: "شخصان يتبادلان المعرفة أمام حاسوب محمول",
      en: "Two people exchanging knowledge in front of a laptop",
    },
  },
  concept: {
    file: "/photos/concept.jpg",
    alt: {
      ar: "مجموعة صغيرة تتعاون حول حاسوب محمول",
      en: "A small group collaborating around a laptop",
    },
  },
  howHero: {
    file: "/photos/how-it-works.jpg",
    alt: {
      ar: "شخصان يتعلمان معًا في جلسة تبادل مهارات",
      en: "Two people learning together in a skill-exchange session",
    },
  },
  mentor: {
    file: "/photos/mentor.jpg",
    alt: {
      ar: "معلّم يشرح مهارة تقنية لمتعلّم",
      en: "A mentor explaining a technical skill to a learner",
    },
  },
  about: {
    file: "/photos/about.jpg",
    alt: {
      ar: "ورشة إبداعية يعمل فيها الفريق معًا",
      en: "A creative workshop where a team works together",
    },
  },
  language: {
    file: "/photos/language-practice.jpg",
    alt: {
      ar: "شخص يتدرب على لغة جديدة مع شريكه",
      en: "A person practicing a new language with a partner",
    },
  },
} satisfies Record<string, PhotoSpec>;

/** Optional per-category cover photo: /public/photos/categories/<slug>.jpg */
export function categoryPhoto(slug: string | null | undefined): string | null {
  return slug ? `/photos/categories/${slug}.jpg` : null;
}
