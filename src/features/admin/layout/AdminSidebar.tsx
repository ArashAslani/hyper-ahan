"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faImages,
  faNewspaper,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { useAdminAuth } from "../auth/AdminAuthProvider";

const navItems = [
  { label: "داشبورد", href: routes.admin.dashboard, icon: faGaugeHigh },
  { label: "مقالات", href: routes.admin.blog.list, icon: faNewspaper },
  { label: "اسلایدرها", href: routes.admin.sliders.list, icon: faImages },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const content = (
    <div className="flex h-full flex-col bg-primary text-white">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-lg font-bold">{siteConfig.name}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن منو"
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-white/70 hover:bg-white/10 md:hidden"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === routes.admin.dashboard
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-[var(--touch-min)] items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm transition ${
                active
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4">
        <button
          type="button"
          onClick={logout}
          className="flex min-h-[var(--touch-min)] w-full items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
          خروج از حساب
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 md:block">{content}</aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            onClick={onClose}
            className="absolute inset-0 bg-primary/50"
          />
          <div className="absolute top-0 right-0 h-full w-72 shadow-[var(--shadow-card)]">
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}
