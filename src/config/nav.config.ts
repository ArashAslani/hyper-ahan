import { routes } from "@/lib/routes";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const aboutNavItems: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
];

export const mobileFooterItems = [
  { label: "خانه", href: routes.home, icon: "home" as const },
  { label: "اپلیکیشن", href: routes.app, icon: "app" as const },
  { label: "تماس", href: routes.phone.mobileFooter, icon: "phone" as const, external: true },
  { label: "درباره ما", href: routes.about, icon: "about" as const },
  { label: "سبد خرید", href: routes.cart, icon: "cart" as const },
] as const;

export const footerQuickLinks: NavLinkItem[] = [
  { label: "درباره ما", href: routes.about },
  { label: "تماس با ما", href: routes.contact },
  { label: "مقالات", href: routes.articles.list },
];

export const footerProductLinks: NavLinkItem[] = [
  { label: "تیرآهن", href: routes.products.category("beam") },
  { label: "نبشی", href: routes.products.category("angle") },
  { label: "میلگرد", href: routes.products.category("rebar") },
  { label: "ورق سیاه", href: routes.products.category("sheet") },
  { label: "لوله و پروفیل", href: routes.products.category("profile") },
];
