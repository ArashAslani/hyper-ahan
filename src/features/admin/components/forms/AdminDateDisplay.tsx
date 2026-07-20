type AdminDateDisplayProps = {
  date: string | Date | null | undefined;
  label?: string;
  variant?: "date" | "datetime" | "relative";
  emptyLabel?: string;
  className?: string;
};

function formatRelative(date: Date): string {
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  const absMinutes = Math.abs(diffMinutes);
  const suffix = diffMinutes >= 0 ? "پیش" : "بعد";

  if (absMinutes < 1) return "همین الان";
  if (absMinutes < 60) return `${absMinutes} دقیقه ${suffix}`;

  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) return `${absHours} ساعت ${suffix}`;

  const absDays = Math.round(absHours / 24);
  return `${absDays} روز ${suffix}`;
}

/** Reusable localized date/time presentation (Created / Updated / Published / ...). */
export function AdminDateDisplay({
  date,
  label,
  variant = "date",
  emptyLabel = "—",
  className = "",
}: AdminDateDisplayProps) {
  const parsed = date ? (date instanceof Date ? date : new Date(date)) : null;
  const isValid = Boolean(parsed) && !Number.isNaN(parsed?.getTime());

  const formatted = !isValid || !parsed
    ? emptyLabel
    : variant === "relative"
      ? formatRelative(parsed)
      : parsed.toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          ...(variant === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}),
        });

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm text-text ${className}`}
      title={isValid && parsed ? parsed.toISOString() : undefined}
    >
      {label ? <span className="text-text-muted">{label}:</span> : null}
      {formatted}
    </span>
  );
}
