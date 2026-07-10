"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import type { Banner } from "@/types";

type HeroSliderProps = {
  banners: Banner[];
};

export function HeroSlider({ banners }: HeroSliderProps) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="rounded-lg shadow-lg"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="flex h-64 items-center justify-center bg-cover bg-center md:h-96"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="rounded-lg bg-black/50 p-6 text-center text-white backdrop-blur-sm">
                <h2 className="mb-2 text-2xl font-bold md:text-4xl">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl">{banner.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
