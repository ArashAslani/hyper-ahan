import { routes } from "@/lib/routes";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const aboutNavItems: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
];

/** Primary site menu — exposed from the header nav drawer. */
export const menuNavItems: NavLinkItem[] = [
  { label: "کاتالوگ", href: routes.catalog.root },
  { label: "جستجو", href: routes.search },
  { label: "محاسبه‌گرها", href: routes.tools.list },
  { label: "مقالات", href: routes.blog.list },
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
];

export const bottomNavItems = [
  { label: "خانه", href: routes.home, icon: "home" as const },
  { label: "دسته‌ها", href: routes.catalog.root, icon: "categories" as const },
  { label: "سبد", href: routes.cart, icon: "cart" as const },
  { label: "جستجو", href: routes.search, icon: "search" as const },
  { label: "پروفایل", href: routes.profile, icon: "profile" as const },
] as const;

export const footerQuickLinks: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
  { label: "کاتالوگ", href: routes.catalog.root },
  { label: "محاسبه‌گرها", href: routes.tools.list },
];

/** Product footer links are backend-driven — populated at render time from catalog. */
export const footerProductLinks: NavLinkItem[] = [
  { label: "کاتالوگ محصولات", href: routes.catalog.root },
  { label: "جستجوی محصولات", href: routes.search },
];
