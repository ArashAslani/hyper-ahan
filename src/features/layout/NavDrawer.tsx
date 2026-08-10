"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="بستن منو"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className="absolute inset-0 bg-primary/50 transition-opacity duration-200"
      />
      <div
        id="main-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        className={`absolute top-0 right-0 flex h-full w-72 max-w-[85%] flex-col bg-surface shadow-[var(--shadow-card)] transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-base font-bold text-primary">{siteConfig.name}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            tabIndex={isOpen ? 0 : -1}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition duration-200 hover:bg-bg hover:text-text active:scale-95"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {menuNavItems.map((item, index) => (
              <li
                key={item.href}
                className={isOpen ? "animate-nav-item" : undefined}
                style={isOpen ? { animationDelay: `${40 + index * 35}ms` } : undefined}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                  className="flex min-h-[var(--touch-min)] items-center px-4 text-base font-medium text-text transition duration-200 hover:bg-bg hover:text-accent active:translate-x-0.5"
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
