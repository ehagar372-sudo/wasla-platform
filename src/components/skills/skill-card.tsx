import Link from "next/link";
import { ArrowRight, Repeat2 } from "lucide-react";
import type { Dict, Locale } from "@/lib/i18n/dictionaries";
import type { Listing } from "@/lib/types";
import { categoryPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";

export function SkillCard({ listing, t, locale }: { listing: Listing; t: Dict; locale: Locale }) {
  const slug = listing.category?.slug;
  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <PhotoSlot
        file={categoryPhoto(slug) ?? "/photos/categories/other.jpg"}
        alt={listing.category?.name ?? listing.title}
        slotLabel={t.common.photoSlot}
        quiet
        className="aspect-[16/9]"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        fallback={
          <span className="grid size-16 place-items-center rounded-2xl bg-surface text-accent shadow-sm">
            <CategoryIcon slug={slug} className="size-8" />
          </span>
        }
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {listing.category && <Badge>{listing.category.name}</Badge>}
          {listing.level && <Badge tone="outline">{t.common.levels[listing.level]}</Badge>}
          {listing.isDemo && <Badge tone="demo">{t.common.demoBadge}</Badge>}
        </div>

        <h3 className="text-lg font-bold leading-snug">
          <Link href={`/skills/${listing.id}`} className="hover:text-accent">
            {listing.title}
          </Link>
        </h3>
        {listing.description && (
          <p className="mt-2 line-clamp-3 text-[0.95rem] leading-7 text-muted">{listing.description}</p>
        )}

        {listing.wants.length > 0 && (
          <p className="mt-3 flex items-start gap-2 text-sm text-muted">
            <Repeat2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="font-semibold text-text">{t.common.wantsToLearn}: </span>
              {listing.wants.join(locale === "ar" ? "، " : ", ")}
            </span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link href={`/profile/${listing.teacher.id}`} className="flex min-w-0 items-center gap-2.5 hover:text-accent">
            <Avatar name={listing.teacher.name} url={listing.teacher.avatarUrl} size="sm" />
            <span className="truncate text-sm font-semibold">{listing.teacher.name}</span>
          </Link>
          <ButtonLink href={`/skills/${listing.id}`} variant="secondary" size="sm">
            {t.common.viewDetails}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
