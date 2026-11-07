import {
  Briefcase,
  Camera,
  Code2,
  Languages,
  PenLine,
  Palette,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  programming: Code2,
  languages: Languages,
  design: Palette,
  business: Briefcase,
  media: Camera,
  writing: PenLine,
  personal: Sprout,
  other: Sparkles,
};

export function CategoryIcon({ slug, className }: { slug: string | null | undefined; className?: string }) {
  const Icon = (slug && icons[slug]) || Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
