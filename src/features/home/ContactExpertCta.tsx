import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";

export function ContactExpertCta() {
  return (
    <section className="home-section-enter px-4 pb-8" style={{ animationDelay: "300ms" }}>
      <div className="rounded-[var(--radius-lg)] bg-primary p-5 text-white shadow-[var(--shadow-card)] transition duration-200 hover:shadow-lg">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-accent">
          <FontAwesomeIcon icon={faHeadset} />
        </span>
        <h2 className="mt-3 text-base font-bold">نیاز به مشاوره دارید؟</h2>
        <p className="mt-1 text-sm text-white/80">
          کارشناسان فروش ما آماده پاسخگویی به سوالات شما درباره قیمت، موجودی
          و زمان تحویل هستند.
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href={routes.phone.call}
            className="flex min-h-[var(--touch-min)] flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-3 text-sm font-bold text-white transition duration-200 hover:brightness-110 active:scale-95"
          >
            <FontAwesomeIcon icon={faPhoneAlt} />
            تماس با کارشناس
          </a>
          <Link
            href={routes.contact}
            className="flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-3 text-sm font-bold text-white transition duration-200 hover:bg-white/10 active:scale-95"
          >
            درخواست مشاوره
          </Link>
        </div>
      </div>
    </section>
  );
}
