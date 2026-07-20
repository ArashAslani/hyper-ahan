import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCalendar, faClock, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import type { BlogPost, BlogPostSummary, Product } from "@/types";
import { ProductCard } from "@/shared/ui/ProductCard";
import { AppImage } from "@/shared/ui/AppImage";
import { BlogBreadcrumb } from "./BlogBreadcrumb";
import { BlogTableOfContents } from "./BlogTableOfContents";
import { BlogShareButtons } from "./BlogShareButtons";
import { BlogAuthorBox } from "./BlogAuthorBox";
import { BlogPostCard } from "./BlogPostCard";
import { BlogReadingProgress } from "./BlogReadingProgress";
import { formatBlogDate } from "@/lib/blogFormat";

type BlogPostViewProps = {
  post: BlogPost;
  related: BlogPostSummary[];
  relatedProducts: Product[];
  previous: BlogPostSummary | null;
  next: BlogPostSummary | null;
};

export function BlogPostView({ post, related, relatedProducts, previous, next }: BlogPostViewProps) {
  const showUpdated = Boolean(post.updatedAt) && post.updatedAt !== post.publishedAt;

  return (
    <div>
      <BlogReadingProgress />

      <div className="container mx-auto px-4 py-8">
        <BlogBreadcrumb
          items={[
            { label: post.categoryName, href: routes.blog.category(post.categorySlug) },
            { label: post.title },
          ]}
        />

        <header className="mb-6 animate-fade-in-up">
          <Link
            href={routes.blog.category(post.categorySlug)}
            className="inline-block rounded-[var(--radius-sm)] bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
          >
            {post.categoryName}
          </Link>
          <h1 className="mt-3 text-2xl font-bold leading-snug text-text md:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span className="font-medium text-text">{post.author.name}</span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} className="text-xs" />
              {formatBlogDate(post.publishedAt)}
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-xs" />
              {post.readingTimeMinutes} دقیقه مطالعه
            </span>
            {showUpdated ? (
              <>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                  به‌روزرسانی {formatBlogDate(post.updatedAt as string)}
                </span>
              </>
            ) : null}
          </div>
        </header>

        <div className="mb-6 overflow-hidden rounded-[var(--radius-lg)]">
          <div className="relative aspect-[16/9] w-full">
            <AppImage
              image={post.image}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 768px) 800px, 100vw"
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
          <article className="min-w-0">
            <div className="mb-6">
              <BlogShareButtons title={post.title} />
            </div>

            <div className="mb-6 md:hidden">
              <BlogTableOfContents headings={post.headings} />
            </div>

            <div
              className="blog-prose prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />

            {post.tags.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg px-3 py-1 text-xs text-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <BlogAuthorBox author={post.author} />
            </div>

            {previous || next ? (
              <nav
                aria-label="مقاله قبلی و بعدی"
                className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
              >
                {next ? (
                  <Link
                    href={routes.blog.detail(next.slug)}
                    className="group flex items-center gap-2 rounded-[var(--radius-lg)] bg-surface p-4 text-right shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-muted">مقاله بعدی</p>
                      <p className="line-clamp-1 text-sm font-bold text-text group-hover:text-accent">
                        {next.title}
                      </p>
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-text-muted" />
                  </Link>
                ) : (
                  <div />
                )}
                {previous ? (
                  <Link
                    href={routes.blog.detail(previous.slug)}
                    className="group flex items-center gap-2 rounded-[var(--radius-lg)] bg-surface p-4 text-right shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] sm:order-first"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-text-muted" />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs text-text-muted">مقاله قبلی</p>
                      <p className="line-clamp-1 text-sm font-bold text-text group-hover:text-accent">
                        {previous.title}
                      </p>
                    </div>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </article>

          <aside className="hidden space-y-4 md:block">
            <div className="sticky top-[calc(var(--topbar-h)+16px)]">
              <BlogTableOfContents headings={post.headings} />
            </div>
          </aside>
        </div>

        {relatedProducts.length ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-text md:text-2xl">محصولات مرتبط</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-text md:text-2xl">مقالات مرتبط</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogPostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10 text-center">
          <Link
            href={routes.blog.list}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            بازگشت به لیست مقالات
          </Link>
        </div>
      </div>
    </div>
  );
}
