"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faRightFromBracket,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { useAdminAuth } from "../auth/AdminAuthProvider";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { adminId, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="باز کردن منو"
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-text-muted hover:bg-bg md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="text-base font-bold text-text md:text-lg">
          پنل مدیریت
        </h1>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm text-text hover:bg-bg"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
            <FontAwesomeIcon icon={faUserShield} />
          </span>
          <span className="hidden font-medium sm:inline">مدیر سیستم</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-xs text-text-muted"
          />
        </button>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="بستن منو"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div
              role="menu"
              className="absolute left-0 top-full z-20 mt-2 w-56 rounded-[var(--radius-md)] border border-border bg-surface p-2 shadow-[var(--shadow-card)]"
            >
              <p className="truncate px-3 py-2 text-xs text-text-muted">
                شناسه ادمین: {adminId ?? "—"}
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex min-h-[var(--touch-min)] w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm text-danger hover:bg-danger/10"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                خروج از حساب
              </button>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
