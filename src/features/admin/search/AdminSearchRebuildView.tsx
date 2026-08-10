"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { Button } from "@/shared/ui/Button";
import { useAdminAuth } from "@/features/admin/auth/AdminAuthProvider";
import { useToast } from "@/shared/ui/Toast";
import { searchAdminService } from "@/services/searchAdminService";

export function AdminSearchRebuildView() {
  const { accessToken } = useAdminAuth();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<{ upserted: number; removed: number } | null>(
    null,
  );

  const handleRebuild = async () => {
    if (!accessToken) {
      showToast("نشست ادمین معتبر نیست", "error");
      return;
    }
    setBusy(true);
    try {
      const result = await searchAdminService.rebuild(accessToken);
      setLast(result);
      showToast("ایندکس جستجو بازسازی شد", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "خطا در بازسازی", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="جستجو"
        description="بازسازی اسناد جستجو از منابع کاتالوگ، بلاگ و محاسبه‌گرها."
      />
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
        <p className="text-sm text-text-muted">
          این عملیات ممکن است چند ثانیه طول بکشد. رتبه‌بندی فقط سمت سرور انجام
          می‌شود.
        </p>
        <Button
          type="button"
          variant="accent"
          className="mt-4"
          disabled={busy}
          onClick={handleRebuild}
        >
          {busy ? "در حال بازسازی…" : "بازسازی ایندکس"}
        </Button>
        {last ? (
          <p className="mt-3 text-sm text-text">
            به‌روزرسانی‌شده: {last.upserted.toLocaleString("fa-IR")} · حذف‌شده:{" "}
            {last.removed.toLocaleString("fa-IR")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
