import Link from "next/link";
import { routes } from "@/lib/routes";

export default function AppPlaceholderPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="mb-4 text-2xl font-bold">اپلیکیشن</h1>
      <p className="mb-6 text-gray-600">این بخش به‌زودی اضافه می‌شود.</p>
      <Link href={routes.home} className="text-accent">
        بازگشت به خانه
      </Link>
    </div>
  );
}
