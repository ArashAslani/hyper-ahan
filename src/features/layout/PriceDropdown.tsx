"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import type { CategoryNode } from "@/types";

function MultiColumnTree({ items }: { items: CategoryNode[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        return (
          <div key={item.slug} className="break-inside-avoid">
            <Link
              href={routes.products.category(item.slug)}
              className="mb-2 flex items-center gap-2 border-b pb-1 font-semibold text-gray-800 hover:text-blue-600"
            >
              <FontAwesomeIcon
                icon={hasChildren ? faFolder : faFile}
                className="text-blue-500"
              />
              <span>{item.name}</span>
            </Link>
            {hasChildren ? (
              <ul className="space-y-1 pr-4">
                {item.children.map((child) => (
                  <li key={child.slug} className="text-sm">
                    <Link
                      href={routes.products.category(child.slug)}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <FontAwesomeIcon
                        icon={child.children?.length ? faFolder : faFile}
                        className="text-gray-400"
                      />
                      {child.name}
                    </Link>
                    {child.children && child.children.length > 0 ? (
                      <ul className="mt-1 space-y-1 pr-6">
                        {child.children.map((grandChild) => (
                          <li key={grandChild.slug}>
                            <Link
                              href={routes.products.category(grandChild.slug)}
                              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
                            >
                              <FontAwesomeIcon
                                icon={faFile}
                                className="text-gray-400"
                              />
                              {grandChild.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                href={routes.products.category(item.slug)}
                className="mt-1 block text-gray-600 hover:text-blue-600"
              >
                مشاهده محصولات
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

type PriceDropdownProps = {
  categories: CategoryNode[];
};

export function PriceDropdown({ categories }: PriceDropdownProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  useEffect(() => {
    if (categories[0]) setActiveCategory(categories[0]);
  }, [categories]);

  if (!activeCategory) return null;

  return (
    <div className="group relative">
      <button
        type="button"
        className="py-2 font-medium text-gray-700 hover:text-blue-600"
      >
        قیمت روز محصولات
      </button>
      <div className="invisible absolute right-0 z-30 mt-2 w-[800px] rounded-lg bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="flex overflow-hidden rounded-lg border">
          <div className="w-1/4 border-l bg-gray-50">
            <ul className="py-2">
              {categories.map((cat) => (
                <li
                  key={cat.id ?? cat.slug}
                  onMouseEnter={() => setActiveCategory(cat)}
                  className={`cursor-pointer px-4 py-2 transition ${
                    activeCategory.id === cat.id
                      ? "bg-blue-100 font-semibold text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="max-h-[500px] w-3/4 overflow-y-auto p-4">
            <h4 className="mb-3 border-b pb-2 font-bold text-gray-800">
              {activeCategory.name}
            </h4>
            <MultiColumnTree items={activeCategory.children} />
          </div>
        </div>
      </div>
    </div>
  );
}
