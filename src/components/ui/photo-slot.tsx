import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

function photoExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", file));
  } catch {
    return false;
  }
}

interface PhotoSlotProps {
  /** Path inside /public, e.g. "/photos/hero.jpg" */
  file: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Replaces the default placeholder when the photo file is missing (e.g. a category icon). */
  fallback?: ReactNode;
  /** Hide the "photograph slot" caption on small placeholders. */
  quiet?: boolean;
  slotLabel: string;
}

/**
 * Shows a real photograph if the file exists in /public, otherwise a clearly identified
 * placeholder. It never substitutes cartoons or invented image URLs.
 * Server Component (checks the filesystem).
 */
export function PhotoSlot({ file, alt, className, sizes, priority, fallback, quiet, slotLabel }: PhotoSlotProps) {
  const exists = photoExists(file);

  return (
    <div className={cx("relative overflow-hidden bg-lavender", className)}>
      {exists ? (
        <Image src={file} alt={alt} fill sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-lavender via-surface-2 to-lavender p-4 text-center"
        >
          {fallback ?? (
            <div className="max-w-[16rem] text-accent">
              <Camera className="mx-auto mb-2 size-7 opacity-80" aria-hidden="true" />
              {!quiet && (
                <>
                  <p className="text-sm font-bold">{slotLabel}</p>
                  <p className="mt-1 text-xs leading-5 text-muted" dir="ltr">
                    public{file}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
