"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { getStorageItem, STORAGE_KEYS } from "@/lib/storage";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getStorageItem<{ name: string }>(STORAGE_KEYS.user);
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="text-2xl text-gray-700"
        aria-label="منو"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <Link href={routes.home} className="text-xl font-bold text-blue-600">
        {siteConfig.name}
      </Link>
      <Link
        href={isLoggedIn ? routes.profile : routes.auth.login}
        className="text-xl text-blue-600"
      >
        <FontAwesomeIcon icon={isLoggedIn ? faUserCircle : faUser} />
      </Link>
    </div>
  );
}
