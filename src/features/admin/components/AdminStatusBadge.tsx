export type AdminStatus =
  | "published"
  | "draft"
  | "inactive"
  | "pending"
  | "deleted"
  | "success"
  | "warning"
  | "danger"
  | "info";

type AdminStatusBadgeProps = {
  status: AdminStatus;
  /** Override the default Persian label for this status. */
  label?: string;
  className?: string;
};

const STATUS_LABELS: Record<AdminStatus, string> = {
  published: "منتشر شده",
  draft: "پیش‌نویس",
  inactive: "غیرفعال",
  pending: "در انتظار بررسی",
  deleted: "حذف شده",
  success: "موفق",
  warning: "هشدار",
  danger: "خطا",
  info: "اطلاعات",
};

const STATUS_CLASSES: Record<AdminStatus, string> = {
  published: "bg-success/10 text-success",
  success: "bg-success/10 text-success",
  draft: "bg-text-muted/10 text-text-muted",
  inactive: "bg-border text-text-muted",
  pending: "bg-highlight/15 text-highlight",
  warning: "bg-highlight/15 text-highlight",
  deleted: "bg-danger/10 text-danger",
  danger: "bg-danger/10 text-danger",
  info: "bg-primary/10 text-primary",
};

/** Reusable status pill using shared design tokens — no feature-specific status logic. */
export function AdminStatusBadge({ status, label, className = "" }: AdminStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_CLASSES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}
