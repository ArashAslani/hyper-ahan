"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type FabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Fab({ children, className = "", ...props }: FabProps) {
  return (
    <button
      type="button"
      className={`fixed right-4 bottom-[calc(var(--bottom-nav-h)+5.5rem)] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[var(--shadow-card)] active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
