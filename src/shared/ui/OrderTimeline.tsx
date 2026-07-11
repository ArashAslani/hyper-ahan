import type { OrderStatus } from "@/types";

const steps: { key: OrderStatus; label: string }[] = [
  { key: "Submitted", label: "ثبت شده" },
  { key: "InReview", label: "در حال بررسی" },
  { key: "Confirmed", label: "تأیید شده" },
  { key: "Completed", label: "تکمیل" },
];

const orderIndex: Record<Exclude<OrderStatus, "Cancelled">, number> = {
  Submitted: 0,
  InReview: 1,
  Confirmed: 2,
  Completed: 3,
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "Cancelled") {
    return (
      <p className="rounded-[var(--radius-md)] bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
        سفارش لغو شده است
      </p>
    );
  }

  const current = orderIndex[status];

  return (
    <ol className="flex items-start justify-between gap-1">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.key} className="flex flex-1 flex-col items-center text-center">
            <span
              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                done
                  ? "bg-success"
                  : active
                    ? "bg-accent"
                    : "bg-border text-text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`text-[11px] leading-tight ${
                active ? "font-bold text-accent" : done ? "text-success" : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Stepper({
  steps: stepLabels,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="mb-6 flex gap-2">
      {stepLabels.map((label, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <li key={label} className="flex-1">
            <div
              className={`mb-1 h-1.5 rounded-full ${
                done || active ? "bg-accent" : "bg-border"
              }`}
            />
            <p
              className={`text-center text-xs ${
                active ? "font-bold text-accent" : "text-text-muted"
              }`}
            >
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
