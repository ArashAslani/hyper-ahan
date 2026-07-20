"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { AppImage } from "@/shared/ui/AppImage";
import type { PublicSlide, SliderTextAlignment } from "@/types";

type HeroSliderProps = {
  slides: PublicSlide[];
};

const ALIGNMENT_CLASSES: Record<SliderTextAlignment, string> = {
  start: "items-start text-start",
  center: "items-center text-center",
  end: "items-end text-end",
  left: "items-start text-left",
  right: "items-end text-right",
};

const BUTTON_VARIANT_CLASSES: Record<string, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-primary text-white",
  outline: "border border-white/50 text-white",
  ghost: "bg-white/15 text-white",
  link: "text-white underline underline-offset-4",
};

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

function SlideLink({
  slide,
  className,
  children,
}: {
  slide: PublicSlide;
  className?: string;
  children: ReactNode;
}) {
  if (slide.openInNewTab || isExternalLink(slide.link)) {
    return (
      <a
        href={slide.link}
        target={slide.openInNewTab ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={slide.link} className={className}>
      {children}
    </Link>
  );
}

export function HeroSlider({ slides }: HeroSliderProps) {
  if (slides.length === 0) return null;

  return (
    <div className="w-full px-4 pt-3">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]"
      >
        {slides.map((slide, index) => {
          const align = slide.textAlignment ?? "start";
          const overlay = slide.overlayOpacity ?? 0.45;
          const buttonVariant = slide.buttonVariant ?? "primary";

          return (
            <SwiperSlide key={slide.id}>
              <SlideLink slide={slide} className="block">
                <div className="relative h-48 w-full overflow-hidden md:h-64">
                  <div className="absolute inset-0 md:hidden">
                    <AppImage
                      image={slide.mobileImage ?? slide.image}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      priority={index === 0}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="absolute inset-0 hidden md:block">
                    <AppImage
                      image={slide.image}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      priority={index === 0}
                      className="h-full w-full"
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(10, 10, 20, ${overlay})` }}
                    aria-hidden
                  />
                  <div
                    className={`relative flex h-full flex-col justify-end gap-3 p-4 md:p-6 ${ALIGNMENT_CLASSES[align]}`}
                  >
                    <div className="max-w-md rounded-[var(--radius-md)] bg-primary/60 p-3 text-white backdrop-blur-sm">
                      <h2 className="text-lg font-bold md:text-2xl">{slide.title}</h2>
                      {slide.description ? (
                        <p className="mt-1 text-sm opacity-90 md:text-base">
                          {slide.description}
                        </p>
                      ) : null}
                    </div>
                    {slide.buttonText ? (
                      <span
                        className={`inline-flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] px-4 text-sm font-bold transition active:scale-95 ${
                          BUTTON_VARIANT_CLASSES[buttonVariant] ?? BUTTON_VARIANT_CLASSES.primary
                        }`}
                      >
                        {slide.buttonText}
                      </span>
                    ) : null}
                  </div>
                </div>
              </SlideLink>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
