export type Level = "beginner" | "intermediate" | "advanced" | "expert";
export const levels: Level[] = ["beginner", "intermediate", "advanced", "expert"];

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface TeacherSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface Listing {
  id: string;
  /** `skills.id` of the catalogue skill (exchange_requests reference this, not the listing). Empty for demo data. */
  skillId: string;
  title: string;
  description: string | null;
  level: Level | null;
  category: Category | null;
  teacher: TeacherSummary;
  /** Titles of skills the teacher wants to learn in return. */
  wants: string[];
  outcomes: string[];
  isDemo: boolean;
}

export interface MemberSkill {
  id: string;
  title: string;
  level: Level | null;
  categorySlug: string | null;
}

export interface Member {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  interests: string[];
  availability: string | null;
  offers: MemberSkill[];
  wants: string[];
  isDemo: boolean;
}

export interface ListingFilters {
  q?: string;
  category?: string;
  level?: string;
}

export interface Result<T> {
  data: T;
  error: string | null;
  /** True when the data is built-in sample content rather than real database rows. */
  demo: boolean;
}
