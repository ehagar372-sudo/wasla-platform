import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { PhotoImage } from "./photo-image";
import { BrandArt } from "./brand-art";

function photoExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", file));
  } catch {
    return false;
  }
}

interface PhotoSlotProps {
  /** Path inside /public, e.g. "/photos/hero.jpg" (browser path: no "public" prefix). */
  file: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Visual shown instead of the photo when the file is missing or fails to load (e.g. a category icon). */
  fallback?: ReactNode;
}

/**
 * Shows the photograph from /public when the file exists. Otherwise (or if loading fails) a clean branded
 * visual is shown, never a "photo slot" caption or a broken-image icon. Server Component (checks the filesystem).
 */
export function PhotoSlot({ file, alt, className, sizes, priority, fallback }: PhotoSlotProps) {
  const exists = photoExists(file);

  return (
    <div className={cx("relative overflow-hidden bg-lavender", className)}>
      <div
        role={exists ? undefined : "img"}
        aria-label={exists ? undefined : alt}
        aria-hidden={exists ? true : undefined}
        className="absolute inset-0 grid place-items-center text-accent"
      >
        {fallback ? (
          <>
            <BrandArt />
            <div className="relative">{fallback}</div>
          </>
        ) : (
          <BrandArt />
        )}
      </div>
      {exists && <PhotoImage src={file} alt={alt} sizes={sizes} priority={priority} />}
    </div>
  );
}
