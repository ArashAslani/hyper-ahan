import type { HomeCategory } from "@/types";

type CategoryGridProps = {
  categories: HomeCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        دسته‌بندی محصولات
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cursor-pointer rounded-xl bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-3 text-5xl">{cat.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{cat.count} محصول</p>
          </div>
        ))}
      </div>
    </section>
  );
}
