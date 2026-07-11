"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { Banner } from "@/types";

type HeroSliderProps = {
  banners: Banner[];
};

export function HeroSlider({ banners }: HeroSliderProps) {
  return (
    <div className="w-full px-4 pt-3">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="flex h-40 items-end bg-cover bg-center p-4 md:h-48"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="rounded-[var(--radius-md)] bg-primary/70 p-3 text-white backdrop-blur-sm">
                <h2 className="text-lg font-bold">{banner.title}</h2>
                <p className="text-sm opacity-90">{banner.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
