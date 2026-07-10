"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSignInAlt,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";

type TopBarProps = {
  onConsultationClick: () => void;
};

export function TopBar({ onConsultationClick }: TopBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <Link
        href={routes.home}
        className="text-2xl font-bold text-blue-600 transition hover:text-blue-800"
      >
        {siteConfig.name}
      </Link>

      <div className="mx-4 hidden max-w-md flex-1 md:flex">
        <input
          type="text"
          placeholder="جستجوی محصول، برند یا دسته‌بندی..."
          className="w-full rounded-r-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="rounded-l-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Link
          href={routes.auth.login}
          className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
        >
          <FontAwesomeIcon icon={faSignInAlt} className="ml-1" /> ورود / ثبت‌نام
        </Link>
        <button
          type="button"
          onClick={onConsultationClick}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faHeadset} className="ml-1" /> درخواست مشاوره
        </button>
      </div>
    </div>
  );
}
