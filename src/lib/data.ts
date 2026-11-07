import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Locale } from "@/lib/i18n/dictionaries";
import { isUuid } from "@/lib/utils";
import {
  levels,
  type Category,
  type Level,
  type Listing,
  type ListingFilters,
  type Member,
  type Result,
} from "@/lib/types";
import { pick, sampleCategories, sampleListings, sampleMembers } from "@/lib/sample-data";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function asLevel(value: unknown): Level | null {
  return typeof value === "string" && (levels as string[]).includes(value) ? (value as Level) : null;
}

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ]/g, "").trim();
}

function matchesFilters(listing: Listing, filters: ListingFilters): boolean {
  if (filters.category && listing.category?.slug !== filters.category) return false;
  if (filters.level && listing.level !== filters.level) return false;
  if (filters.q) {
    const haystack = normalize(
      [listing.title, listing.description ?? "", listing.teacher.name, listing.category?.name ?? "", ...listing.wants].join(" "),
    );
    if (!haystack.includes(normalize(filters.q))) return false;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Database row shapes (hand-written, matches supabase/migrations)     */
/* ------------------------------------------------------------------ */

interface CategoryRow {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
}
interface SkillRow {
  id: string;
  name_ar: string;
  name_en: string;
  category: CategoryRow | null;
}
interface ProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests?: string[] | null;
  availability?: string | null;
}
interface UserSkillRow {
  id: string;
  user_id: string;
  level: string | null;
  description: string | null;
  skill: SkillRow | null;
  profile: ProfileRow | null;
}

const LISTING_SELECT =
  "id,user_id,level,description,skill:skills(id,name_ar,name_en,category:skill_categories(id,slug,name_ar,name_en)),profile:profiles(id,display_name,avatar_url,bio)";

const localName = (row: { name_ar: string; name_en: string }, locale: Locale) =>
  locale === "ar" ? row.name_ar : row.name_en;

function toCategory(row: CategoryRow, locale: Locale): Category {
  return { id: row.id, slug: row.slug, name: localName(row, locale) };
}

function toListing(row: UserSkillRow, wantsByUser: Map<string, string[]>, locale: Locale): Listing | null {
  if (!row.skill || !row.profile) return null;
  return {
    id: row.id,
    skillId: row.skill.id,
    title: localName(row.skill, locale),
    description: row.description,
    level: asLevel(row.level),
    category: row.skill.category ? toCategory(row.skill.category, locale) : null,
    teacher: {
      id: row.profile.id,
      name: row.profile.display_name?.trim() || "—",
      avatarUrl: row.profile.avatar_url,
      bio: row.profile.bio,
    },
    wants: wantsByUser.get(row.user_id) ?? [],
    // The live schema has no `outcomes` column, so real listings show the description only.
    outcomes: [],
    isDemo: false,
  };
}

async function fetchWants(userIds: string[], locale: Locale): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (userIds.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_skills")
    .select("user_id,skill:skills(name_ar,name_en)")
    .eq("kind", "want")
    .in("user_id", userIds);
  for (const row of (data ?? []) as unknown as Array<{ user_id: string; skill: { name_ar: string; name_en: string } | null }>) {
    if (!row.skill) continue;
    const list = map.get(row.user_id) ?? [];
    list.push(localName(row.skill, locale));
    map.set(row.user_id, list);
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* Demo builders                                                       */
/* ------------------------------------------------------------------ */

function demoCategories(locale: Locale): Category[] {
  return sampleCategories.map((c) => ({ id: c.slug, slug: c.slug, name: pick(c.name, locale) }));
}

function demoListings(locale: Locale): Listing[] {
  const categories = new Map(demoCategories(locale).map((c) => [c.slug, c]));
  return sampleListings.flatMap((l) => {
    const member = sampleMembers.find((m) => m.id === l.memberId);
    if (!member) return [];
    return [
      {
        id: l.id,
        skillId: "",
        title: pick(l.title, locale),
        description: pick(l.description, locale),
        level: l.level,
        category: categories.get(l.categorySlug) ?? null,
        teacher: { id: member.id, name: pick(member.name, locale), avatarUrl: null, bio: pick(member.bio, locale) },
        wants: pick(l.wants, locale),
        outcomes: pick(l.outcomes, locale),
        isDemo: true,
      } satisfies Listing,
    ];
  });
}

function demoMember(id: string, locale: Locale): Member | null {
  const member = sampleMembers.find((m) => m.id === id);
  if (!member) return null;
  const listings = sampleListings.filter((l) => l.memberId === id);
  return {
    id: member.id,
    name: pick(member.name, locale),
    bio: pick(member.bio, locale),
    avatarUrl: null,
    interests: pick(member.interests, locale),
    availability: pick(member.availability, locale),
    offers: listings.map((l) => ({ id: l.id, title: pick(l.title, locale), level: l.level, categorySlug: l.categorySlug })),
    wants: listings.flatMap((l) => pick(l.wants, locale)),
    isDemo: true,
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export const getCategories = cache(async (locale: Locale): Promise<Result<Category[]>> => {
  if (!isSupabaseConfigured) return { data: demoCategories(locale), error: null, demo: true };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("skill_categories").select("id,slug,name_ar,name_en").order("sort_order");
    if (error) throw error;
    return { data: ((data ?? []) as CategoryRow[]).map((r) => toCategory(r, locale)), error: null, demo: false };
  } catch {
    return { data: [], error: "categories", demo: false };
  }
});

export const getListings = cache(
  async (locale: Locale, filters: ListingFilters = {}, limit = 100): Promise<Result<Listing[]>> => {
    if (!isSupabaseConfigured) {
      const data = demoListings(locale).filter((l) => matchesFilters(l, filters)).slice(0, limit);
      return { data, error: null, demo: true };
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("user_skills")
        .select(LISTING_SELECT)
        .eq("kind", "offer")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      const rows = (data ?? []) as unknown as UserSkillRow[];
      const wants = await fetchWants([...new Set(rows.map((r) => r.user_id))], locale);
      const listings = rows
        .map((r) => toListing(r, wants, locale))
        .filter((l): l is Listing => l !== null)
        .filter((l) => matchesFilters(l, filters))
        .slice(0, limit);
      return { data: listings, error: null, demo: false };
    } catch {
      return { data: [], error: "listings", demo: false };
    }
  },
);

export const getListing = cache(async (locale: Locale, id: string): Promise<Result<Listing | null>> => {
  if (!isSupabaseConfigured) {
    const found = demoListings(locale).find((l) => l.id === id) ?? null;
    return { data: found, error: null, demo: true };
  }
  if (!isUuid(id)) return { data: null, error: null, demo: false };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_skills")
      .select(LISTING_SELECT)
      .eq("id", id)
      .eq("kind", "offer")
      .maybeSingle();
    if (error) throw error;
    if (!data) return { data: null, error: null, demo: false };
    const row = data as unknown as UserSkillRow;
    const wants = await fetchWants([row.user_id], locale);
    return { data: toListing(row, wants, locale), error: null, demo: false };
  } catch {
    return { data: null, error: "listing", demo: false };
  }
});

export const getMember = cache(async (locale: Locale, id: string): Promise<Result<Member | null>> => {
  if (!isSupabaseConfigured) return { data: demoMember(id, locale), error: null, demo: true };
  if (!isUuid(id)) return { data: null, error: null, demo: false };
  try {
    const supabase = await createClient();
    // RLS only returns profiles that are public (or the viewer's own).
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id,display_name,avatar_url,bio,interests,availability")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!profile) return { data: null, error: null, demo: false };
    const p = profile as ProfileRow;

    const { data: skills, error: skillsError } = await supabase
      .from("user_skills")
      .select("id,user_id,kind,level,skill:skills(id,name_ar,name_en,category:skill_categories(id,slug,name_ar,name_en))")
      .eq("user_id", id)
      .eq("is_available", true);
    if (skillsError) throw skillsError;

    const rows = (skills ?? []) as unknown as Array<{
      id: string;
      kind: "offer" | "want";
      level: string | null;
      skill: SkillRow | null;
    }>;
    return {
      data: {
        id: p.id,
        name: p.display_name?.trim() || "—",
        bio: p.bio,
        avatarUrl: p.avatar_url,
        interests: p.interests ?? [],
        availability: p.availability ?? null,
        offers: rows
          .filter((r) => r.kind === "offer" && r.skill)
          .map((r) => ({
            id: r.id,
            title: localName(r.skill!, locale),
            level: asLevel(r.level),
            categorySlug: r.skill!.category?.slug ?? null,
          })),
        wants: rows.filter((r) => r.kind === "want" && r.skill).map((r) => localName(r.skill!, locale)),
        isDemo: false,
      },
      error: null,
      demo: false,
    };
  } catch {
    return { data: null, error: "member", demo: false };
  }
});
