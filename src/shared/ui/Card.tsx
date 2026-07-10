import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
