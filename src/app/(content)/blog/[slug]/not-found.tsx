import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-danger">مقاله یافت نشد</h1>
      <p className="mt-2 text-sm text-text-muted">
        ممکن است این مقاله حذف شده یا آدرس آن تغییر کرده باشد.
      </p>
      <Link href={routes.blog.list} className="mt-4 inline-block text-accent">
        بازگشت به بلاگ
      </Link>
    </div>
  );
}
