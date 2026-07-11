import type { ReactNode } from "react";
import { Button } from "@/shared/ui/Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon ? <div className="mb-4 text-4xl">{icon}</div> : null}
      <h2 className="text-lg font-bold text-text">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "خطایی رخ داد",
  description = "لطفاً دوباره تلاش کنید.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={onRetry ? "تلاش مجدد" : undefined}
      onAction={onRetry}
      icon="⚠️"
    />
  );
}

export function LoadingState({ label = "در حال بارگذاری..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="spinner-accent" />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
