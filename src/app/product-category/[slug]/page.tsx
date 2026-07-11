import Link from "next/link";
import { ProductListView } from "@/features/catalog/ProductListView";
import { productService } from "@/services/productService";
import { homeService } from "@/services/homeService";
import { routes } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const slugKeywords: Record<string, string[]> = {
  rebar: ["میلگرد"],
  beam: ["تیرآهن"],
  sheet: ["ورق"],
  profile: ["پروفیل"],
  angle: ["نبشی"],
  pipe: ["لوله"],
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    productService.getAll(),
    homeService.getCategories(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  const keywords = slugKeywords[slug] ?? [category?.name ?? ""];
  const filtered = products.filter((p) =>
    keywords.some((k) => k && p.name.includes(k)),
  );

  return (
    <div>
      <div className="border-b border-border bg-surface px-4 py-3">
        <h1 className="text-lg font-bold text-text">
          {category?.name ?? "دسته‌بندی"}
        </h1>
        <Link href={routes.products.list} className="text-sm text-accent">
          همه محصولات
        </Link>
      </div>
      <ProductListView products={filtered.length ? filtered : products} />
    </div>
  );
}
