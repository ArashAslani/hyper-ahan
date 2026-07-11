import Link from "next/link";
import { routes } from "@/lib/routes";
import type { ArticleSummary } from "@/types";

type ArticleCardsProps = {
  articles: ArticleSummary[];
};

export function ArticleCards({ articles }: ArticleCardsProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">مقالات آموزشی</h2>
        <Link
          href={routes.articles.list}
          className="font-semibold text-accent transition hover:text-accent"
        >
          مشاهده همه مقالات ←
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={routes.articles.detail(article.id)}
            className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <p className="mb-2 text-sm text-gray-500">{article.date}</p>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {article.title}
              </h3>
              <p className="text-gray-600">{article.summary}</p>
              <span className="mt-4 inline-block font-medium text-accent hover:text-accent">
                مطالعه بیشتر →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
