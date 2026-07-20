"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { menuNavItems } from "@/config/nav.config";
import { siteConfig } from "@/config/site";

type NavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="بستن منو"
        onClick={onClose}
        className="absolute inset-0 bg-primary/50"
      />
      <div className="absolute top-0 right-0 flex h-full w-72 max-w-[85%] flex-col bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-base font-bold text-primary">
            {siteConfig.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:bg-bg"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {menuNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-[var(--touch-min)] items-center px-4 text-base font-medium text-text hover:bg-bg hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
