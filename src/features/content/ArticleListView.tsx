import Link from "next/link";
import { routes } from "@/lib/routes";
import type { ArticleSummary } from "@/types";

type ArticleListViewProps = {
  articles: ArticleSummary[];
};

export function ArticleListView({ articles }: ArticleListViewProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        مقالات آموزشی
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <p className="mb-2 text-sm text-gray-500">{article.date}</p>
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                {article.title}
              </h2>
              <p className="mb-4 text-gray-600">{article.summary}</p>
              <Link
                href={routes.articles.detail(article.id)}
                className="inline-block font-medium text-accent hover:text-accent"
              >
                مطالعه بیشتر →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
