"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPhoneAlt,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { useCart } from "@/providers/CartProvider";
import { NavDrawer } from "./NavDrawer";

export function TopBar() {
  const { getTotalItems } = useCart();
  const count = getTotalItems();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-[var(--topbar-h)] max-w-xl items-center justify-between gap-1 px-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="باز کردن منو"
            className="flex h-11 w-11 items-center justify-center rounded-full text-text"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Link
            href={routes.home}
            className="text-lg font-bold text-primary active:scale-95"
          >
            {siteConfig.name}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={routes.phone.call}
            className="flex h-11 w-11 items-center justify-center rounded-full text-accent"
            aria-label="تماس"
          >
            <FontAwesomeIcon icon={faPhoneAlt} />
          </a>
          <Link
            href={routes.search}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text"
            aria-label="جستجو"
          >
            <FontAwesomeIcon icon={faSearch} />
          </Link>
          <Link
            href={routes.cart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-text"
            aria-label="سبد خرید"
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className={count > 0 ? "animate-cart-bounce" : undefined}
            />
            {count > 0 ? (
              <span className="absolute top-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <NavDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
