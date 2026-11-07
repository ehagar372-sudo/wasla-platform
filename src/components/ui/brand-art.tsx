/**
 * Branded fallback visual shown wherever a photograph is not available (or fails to load).
 * Abstract on purpose: two interlocking rings (the WASLA "link" mark) on a soft lavender field.
 * No text, no cartoon people, no placeholder captions.
 */
export function BrandArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className ?? "absolute inset-0 size-full"}
    >
      <defs>
        <linearGradient id="wa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--lavender)" />
          <stop offset="1" stopColor="var(--surface-2)" />
        </linearGradient>
        <pattern id="wa-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="var(--primary)" opacity="0.14" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#wa-bg)" />
      <rect width="400" height="400" fill="url(#wa-dots)" />
      <circle cx="330" cy="70" r="110" fill="var(--primary)" opacity="0.07" />
      <circle cx="60" cy="350" r="130" fill="var(--primary)" opacity="0.06" />
      <g fill="none" strokeWidth="14" strokeLinecap="round">
        <circle cx="168" cy="200" r="78" stroke="var(--primary)" opacity="0.9" />
        <circle cx="232" cy="200" r="78" stroke="var(--ring)" opacity="0.85" />
      </g>
    </svg>
  );
}
