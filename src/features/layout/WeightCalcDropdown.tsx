"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import type { WeightCalcItem } from "@/types";

type WeightCalcDropdownProps = {
  items: WeightCalcItem[];
};

export function WeightCalcDropdown({ items }: WeightCalcDropdownProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="py-2 font-medium text-gray-700 hover:text-accent"
      >
        <FontAwesomeIcon icon={faCalculator} className="ml-1" /> جدول و محاسبه
        وزن آهن‌آلات
      </button>
      <div className="invisible absolute right-0 z-30 mt-2 w-56 rounded-lg bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={routes.weightCalc(item.slug)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
