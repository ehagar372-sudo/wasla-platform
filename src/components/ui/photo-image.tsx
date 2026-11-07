"use client";

import { useState } from "react";
import Image from "next/image";

/** Renders a real photograph; if it fails to load, renders nothing so the branded fallback behind it shows. */
export function PhotoImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}
