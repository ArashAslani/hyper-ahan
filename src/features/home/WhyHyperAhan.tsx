import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faHeadset,
  faIndustry,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type TrustItem = {
  title: string;
  description: string;
  icon: IconDefinition;
};

const trustItems: TrustItem[] = [
  {
    title: "قیمت مستقیم کارخانه",
    description: "بدون واسطه، با پایین‌ترین قیمت بازار.",
    icon: faIndustry,
  },
  {
    title: "ارسال سریع",
    description: "بارگیری و حمل به سراسر کشور در کوتاه‌ترین زمان.",
    icon: faTruckFast,
  },
  {
    title: "فاکتور رسمی",
    description: "صدور فاکتور رسمی برای تمام سفارش‌ها.",
    icon: faFileInvoice,
  },
  {
    title: "مشاوره تخصصی",
    description: "کارشناسان فنی همراه شما در انتخاب و خرید.",
    icon: faHeadset,
  },
];

export function WhyHyperAhan() {
  return (
    <section className="px-4 py-6">
      <h2 className="mb-4 text-lg font-bold text-text">چرا هایپر آهن؟</h2>
      <div className="grid grid-cols-2 gap-3">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="rounded-[var(--radius-lg)] bg-surface p-4 text-center shadow-[var(--shadow-soft)]"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl text-accent">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <h3 className="mt-3 text-sm font-bold text-text">{item.title}</h3>
            <p className="mt-1 text-xs text-text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
