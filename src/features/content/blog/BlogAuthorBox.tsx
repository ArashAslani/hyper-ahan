import { AppImage } from "@/shared/ui/AppImage";
import type { BlogAuthor } from "@/types";
import { initialsFromName } from "@/lib/blogFormat";

type BlogAuthorBoxProps = {
  author: BlogAuthor;
};

export function BlogAuthorBox({ author }: BlogAuthorBoxProps) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-soft)]">
      {author.avatar ? (
        <AppImage
          image={author.avatar}
          alt={author.name}
          preferThumbnail
          width={64}
          height={64}
          sizes="64px"
          className="h-16 w-16 flex-shrink-0 rounded-full"
        />
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
          {initialsFromName(author.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-bold text-text">{author.name}</p>
        {author.role ? <p className="mb-1 text-xs text-accent">{author.role}</p> : null}
        {author.bio ? (
          <p className="text-sm leading-relaxed text-text-muted">{author.bio}</p>
        ) : (
          <p className="text-sm leading-relaxed text-text-muted">نویسنده در تیم محتوای هایپر آهن</p>
        )}
      </div>
    </div>
  );
}
