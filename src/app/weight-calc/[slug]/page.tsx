import Link from "next/link";
import { routes } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WeightCalcPlaceholderPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="mb-4 text-2xl font-bold">محاسبه وزن</h1>
      <p className="mb-2 text-gray-600">
        صفحه محاسبه وزن برای «{slug}» در فاز بعد پیاده‌سازی می‌شود.
      </p>
      <Link href={routes.home} className="text-blue-600">
        بازگشت به خانه
      </Link>
    </div>
  );
}
