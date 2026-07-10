"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMobileAlt,
  faPhoneAlt,
  faInfoCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";

const iconMap = {
  home: faHome,
  app: faMobileAlt,
  phone: faPhoneAlt,
  about: faInfoCircle,
  cart: faShoppingCart,
} as const;

export function MobileFooter() {
  const items = [
    { label: "خانه", href: routes.home, icon: "home" as const },
    { label: "اپلیکیشن", href: routes.app, icon: "app" as const },
    {
      label: "تماس",
      href: routes.phone.mobileFooter,
      icon: "phone" as const,
      external: true,
      elevated: true,
    },
    { label: "درباره ما", href: routes.about, icon: "about" as const },
    { label: "سبد خرید", href: routes.cart, icon: "cart" as const },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const className = item.elevated
            ? "-mt-6 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
            : "flex flex-col items-center text-gray-600 hover:text-blue-600";

          if (item.external) {
            return (
              <a key={item.label} href={item.href} className={className}>
                <FontAwesomeIcon
                  icon={iconMap[item.icon]}
                  className="text-xl"
                />
                {!item.elevated ? (
                  <span className="mt-1 text-xs">{item.label}</span>
                ) : null}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={className}>
              <FontAwesomeIcon icon={iconMap[item.icon]} className="text-xl" />
              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
