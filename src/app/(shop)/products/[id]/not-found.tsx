import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">محصول یافت نشد</h1>
      <Link
        href={routes.products.list}
        className="mt-4 inline-block text-blue-600"
      >
        بازگشت به لیست محصولات
      </Link>
    </div>
  );
}
