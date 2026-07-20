import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import type { BlogPostSummary } from "@/types";
import { formatBlogDate } from "@/lib/blogFormat";
import { AppImage } from "@/shared/ui/AppImage";

type BlogPostCardProps = {
  post: BlogPostSummary;
  className?: string;
};

export function BlogPostCard({ post, className = "" }: BlogPostCardProps) {
  return (
    <Link
      href={routes.blog.detail(post.slug)}
      className={`group flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <AppImage
          image={post.image}
          alt={post.title}
          fill
          preferThumbnail
          sizes="(min-width: 768px) 33vw, 100vw"
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className="absolute top-3 right-3 rounded-[var(--radius-sm)] bg-primary/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {post.categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-bold text-text transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm text-text-muted">{post.excerpt}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-text-muted">
          <span className="truncate">{post.author.name}</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-[10px]" />
              {post.readingTimeMinutes} دقیقه
            </span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          بیشتر بخوانید
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-xs transition-transform duration-300 group-hover:-translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
