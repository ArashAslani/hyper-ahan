"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/ui/EmptyState";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <ErrorState
        title="خطا در بارگذاری بلاگ"
        description="مشکلی در نمایش مقالات رخ داد. لطفاً دوباره تلاش کنید."
        onRetry={reset}
      />
    </div>
  );
}
