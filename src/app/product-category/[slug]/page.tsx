import Link from "next/link";
import { routes } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPlaceholderPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="mb-4 text-2xl font-bold">دسته‌بندی محصول</h1>
      <p className="mb-2 text-gray-600">
        لیست محصولات دسته «{slug}» در فاز اتصال API تکمیل می‌شود.
      </p>
      <Link href={routes.products.list} className="text-blue-600">
        مشاهده همه محصولات
      </Link>
    </div>
  );
}
