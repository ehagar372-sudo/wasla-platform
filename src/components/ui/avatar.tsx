import { cx, initials } from "@/lib/utils";

const sizes = {
  sm: "size-9 text-sm",
  md: "size-12 text-base",
  lg: "size-20 text-2xl",
  xl: "size-28 text-3xl",
};

/** Profile photo, or a monogram when the member hasn't uploaded one. */
export function Avatar({
  name,
  url,
  size = "md",
  className,
}: {
  name: string;
  url?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        loading="lazy"
        className={cx("shrink-0 rounded-full object-cover ring-2 ring-surface", sizes[size], className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-hover font-bold text-primary-fg ring-2 ring-surface",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
