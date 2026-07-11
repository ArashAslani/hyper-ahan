"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastItem = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastItem["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastItem["type"] = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-[calc(var(--topbar-h)+12px)] left-1/2 z-[60] flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-[var(--radius-md)] px-4 py-3 text-center text-sm font-medium text-white shadow-[var(--shadow-soft)] ${
              toast.type === "success"
                ? "bg-success"
                : toast.type === "error"
                  ? "bg-danger"
                  : "bg-primary"
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
