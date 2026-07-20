import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { BlogPostSummary } from "@/types";
import { BlogPostCard } from "./BlogPostCard";

type BlogPostRowProps = {
  title: string;
  icon?: IconDefinition;
  posts: BlogPostSummary[];
};

export function BlogPostRow({ title, icon, posts }: BlogPostRowProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-3">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-text">
        {icon ? <FontAwesomeIcon icon={icon} className="text-accent" /> : null}
        {title}
      </h2>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} className="w-64 flex-shrink-0 sm:w-72" />
        ))}
      </div>
    </section>
  );
}
