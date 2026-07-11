"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSearch,
  faChevronDown,
  faChevronLeft,
  faNewspaper,
  faCalculator,
  faAddressCard,
  faFolder,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { aboutNavItems } from "@/config/nav.config";
import { routes } from "@/lib/routes";
import type { CategoryNode, WeightCalcItem } from "@/types";

type RecursiveCategoryItemProps = {
  item: CategoryNode;
  onClose: () => void;
  level: number;
  isOpen: boolean;
  onToggle: () => void;
};

function RecursiveCategoryItem({
  item,
  onClose,
  level,
  isOpen,
  onToggle,
}: RecursiveCategoryItemProps) {
  const [isLocalOpen, setIsLocalOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const bgColor = level === 0 ? "bg-white" : "bg-gray-50";
  const paddingRight = level * 16;
  const buttonPaddingRight = (level + 1) * 16;
  const open = level === 0 ? isOpen : isLocalOpen;
  const handleToggle =
    level === 0 ? onToggle : () => setIsLocalOpen(!isLocalOpen);

  return (
    <div className={`${bgColor} border-b border-gray-100`}>
      <div
        className="flex w-full items-center justify-between"
        style={{ paddingRight: `${paddingRight + 16}px` }}
      >
        <Link
          href={routes.products.category(item.slug)}
          onClick={onClose}
          className="flex w-[60%] items-center gap-2 py-3 text-gray-800 hover:text-accent"
        >
          <FontAwesomeIcon
            icon={hasChildren ? faFolder : faFile}
            className={`flex-shrink-0 ${
              level === 0 || hasChildren ? "text-blue-500" : "text-red-400"
            }`}
          />
          <span>{item.name}</span>
        </Link>
        {hasChildren ? (
          <button
            type="button"
            onClick={handleToggle}
            className="flex w-[40%] items-center justify-end px-4 py-3 text-gray-500 hover:text-gray-700"
            style={{ paddingRight: `${buttonPaddingRight}px` }}
          >
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronLeft} />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50">
            {item.children.map((child) => (
              <RecursiveCategoryItem
                key={child.slug}
                item={child}
                onClose={onClose}
                level={level + 1}
                isOpen={false}
                onToggle={() => {}}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryNode[];
  weightCalcItems: WeightCalcItem[];
};

export function MobileMenu({
  isOpen,
  onClose,
  categories,
  weightCalcItems,
}: MobileMenuProps) {
  const [openMainCategoryId, setOpenMainCategoryId] = useState<number | null>(
    null,
  );
  const [isWeightCalcOpen, setIsWeightCalcOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const toggleMainCategory = (id: number) => {
    setOpenMainCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-4/5 transform overflow-y-auto bg-white shadow-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-start border-b p-4">
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-600"
            aria-label="بستن"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="border-b px-4 py-3">
          <div className="flex">
            <input
              type="text"
              placeholder="جستجوی محصول، برند..."
              className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="rounded-l-lg bg-accent px-4 py-2 text-white hover:bg-highlight"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2 font-bold text-gray-800">
            قیمت روز محصولات
          </div>
          {categories.map((category) => (
            <RecursiveCategoryItem
              key={category.id ?? category.slug}
              item={category}
              onClose={onClose}
              level={0}
              isOpen={openMainCategoryId === category.id}
              onToggle={() => toggleMainCategory(category.id ?? 0)}
            />
          ))}
        </div>

        <div className="border-b border-gray-200 px-4 py-3">
          <Link
            href={routes.articles.list}
            onClick={onClose}
            className="flex items-center gap-2 border-b border-gray-100 py-3 text-gray-800"
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-blue-500" />
            <span>مقالات</span>
          </Link>

          <div className="border-b border-gray-100">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between py-3 text-gray-800"
              onClick={() => setIsWeightCalcOpen(!isWeightCalcOpen)}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCalculator}
                  className="text-blue-500"
                />
                <span>جدول و محاسبه وزن آهن‌آلات</span>
              </div>
              <FontAwesomeIcon
                icon={isWeightCalcOpen ? faChevronDown : faChevronLeft}
                className="text-gray-500"
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isWeightCalcOpen
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-50 py-2 pr-6">
                {weightCalcItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={routes.weightCalc(item.slug)}
                    onClick={onClose}
                    className="block py-2 text-gray-600 hover:text-accent"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between py-3 text-gray-800"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  className="text-blue-500"
                />
                <span>درباره ما</span>
              </div>
              <FontAwesomeIcon
                icon={isAboutOpen ? faChevronDown : faChevronLeft}
                className="text-gray-500"
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isAboutOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-50 py-2 pr-6">
                {aboutNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="block py-2 text-gray-600 hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
