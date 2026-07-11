"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faThLarge,
  faShoppingCart,
  faClipboardList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { bottomNavItems } from "@/config/nav.config";
import { useCart } from "@/providers/CartProvider";

const iconMap = {
  home: faHome,
  categories: faThLarge,
  cart: faShoppingCart,
  orders: faClipboardList,
  profile: faUser,
} as const;

export function BottomNav() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-surface"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="ناوبری اصلی"
    >
      <ul className="mx-auto flex h-full max-w-xl items-stretch justify-around px-1">
        {bottomNavItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`relative flex h-full min-h-[var(--touch-min)] flex-col items-center justify-center gap-0.5 text-[11px] ${
                  active ? "font-bold text-accent" : "text-text-muted"
                }`}
              >
                <span className="relative">
                  <FontAwesomeIcon
                    icon={iconMap[item.icon]}
                    className="text-lg"
                  />
                  {item.icon === "cart" && cartCount > 0 ? (
                    <span className="absolute -top-2 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
