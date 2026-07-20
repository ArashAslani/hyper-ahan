import Link from "next/link";
import { routes } from "@/lib/routes";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BlogBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    { label: "خانه", href: routes.home },
    { label: "بلاگ", href: routes.blog.list },
    ...items,
  ];

  return (
    <nav
      aria-label="مسیر صفحه"
      className="mb-4 flex flex-wrap items-center gap-1 text-xs text-text-muted md:text-sm"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-text" : ""}>{item.label}</span>
            )}
            {!isLast ? <span aria-hidden>/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
