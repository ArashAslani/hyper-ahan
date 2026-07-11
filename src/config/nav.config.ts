import { routes } from "@/lib/routes";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const aboutNavItems: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
];

export const bottomNavItems = [
  { label: "خانه", href: routes.home, icon: "home" as const },
  { label: "دسته‌ها", href: routes.categories, icon: "categories" as const },
  { label: "سبد", href: routes.cart, icon: "cart" as const },
  { label: "سفارش‌ها", href: routes.orders.list, icon: "orders" as const },
  { label: "پروفایل", href: routes.profile, icon: "profile" as const },
] as const;

export const footerQuickLinks: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
  { label: "محصولات", href: routes.products.list },
];

export const footerProductLinks: NavLinkItem[] = [
  { label: "تیرآهن", href: routes.products.category("beam") },
  { label: "نبشی", href: routes.products.category("angle") },
  { label: "میلگرد", href: routes.products.category("rebar") },
  { label: "ورق سیاه", href: routes.products.category("sheet") },
  { label: "لوله و پروفیل", href: routes.products.category("profile") },
];
