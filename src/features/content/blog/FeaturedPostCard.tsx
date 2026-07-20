import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock, faStar } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import type { BlogPostSummary } from "@/types";
import { formatBlogDate } from "@/lib/blogFormat";
import { AppImage } from "@/shared/ui/AppImage";

type FeaturedPostCardProps = {
  post: BlogPostSummary;
};

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Link
      href={routes.blog.detail(post.slug)}
      className="group relative block overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] md:aspect-[21/9]">
        <AppImage
          image={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="h-full w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 md:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-3 py-1 text-xs font-semibold text-white">
          <FontAwesomeIcon icon={faStar} className="text-[10px]" />
          مقاله ویژه · {post.categoryName}
        </span>
        <h2 className="text-xl font-bold leading-snug text-white md:text-2xl lg:text-3xl">
          {post.title}
        </h2>
        <p className="line-clamp-2 max-w-2xl text-sm text-white/80 md:text-base">
          {post.excerpt}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/70 md:text-sm">
          <span className="font-medium text-white">{post.author.name}</span>
          <span aria-hidden>·</span>
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} />
            {post.readingTimeMinutes} دقیقه مطالعه
          </span>
        </div>
        <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] bg-white px-4 py-2 text-sm font-bold text-primary transition-transform duration-300 group-hover:-translate-x-1">
          مشاهده مقاله
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
        </span>
      </div>
    </Link>
  );
}
