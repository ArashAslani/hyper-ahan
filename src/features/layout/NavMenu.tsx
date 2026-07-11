"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faAddressCard,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { aboutNavItems } from "@/config/nav.config";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { PriceDropdown } from "@/features/layout/PriceDropdown";
import { WeightCalcDropdown } from "@/features/layout/WeightCalcDropdown";
import type { CategoryNode, WeightCalcItem } from "@/types";

type NavMenuProps = {
  categories: CategoryNode[];
  weightCalcItems: WeightCalcItem[];
};

export function NavMenu({ categories, weightCalcItems }: NavMenuProps) {
  return (
    <div className="hidden border-t border-gray-200 py-2 md:block">
      <nav className="flex items-center justify-between">
        <div className="flex gap-8">
          <PriceDropdown categories={categories} />
          <Link
            href={routes.articles.list}
            className="py-2 font-medium text-gray-700 hover:text-accent"
          >
            <FontAwesomeIcon icon={faNewspaper} className="ml-1" /> مقالات
          </Link>
          <WeightCalcDropdown items={weightCalcItems} />
          <div className="group relative">
            <button
              type="button"
              className="py-2 font-medium text-gray-700 hover:text-accent"
            >
              <FontAwesomeIcon icon={faAddressCard} className="ml-1" /> درباره
              ما
            </button>
            <div className="invisible absolute right-0 z-30 mt-2 w-40 rounded-lg bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <ul className="py-2">
                {aboutNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <a
            href={routes.phone.office}
            className="py-2 font-medium text-gray-700 hover:text-accent"
          >
            <FontAwesomeIcon icon={faPhoneAlt} className="ml-1" /> تماس به دفتر
            : {siteConfig.phoneDisplay}
          </a>
        </div>
      </nav>
    </div>
  );
}
