"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import DynamicButton from "@/components/DynamicButton/DynamicButton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import { BlockSliderProps, SlideItem, BlockButton } from '@/lib/types';

export default function BlockSlider({
  data,
  globalSettings,
}: BlockSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  if (!data) return null;

  const { slides, button } = data;

  // Resolve slides M2M
  let slideItems: SlideItem[] = [];
  if (Array.isArray(slides)) {
    slideItems = slides
      .map((junction: { slides_id?: SlideItem | string } | SlideItem) =>
        typeof junction === "object" && junction !== null && "slides_id" in junction && typeof junction.slides_id === "object"
          ? (junction.slides_id as SlideItem)
          : (junction as SlideItem)
      )
      .filter((item): item is SlideItem => typeof item === "object" && item !== null);
  }

  // Resolve button M2M
  let ctaButton: BlockButton | null = null;
  if (Array.isArray(button) && button.length > 0) {
    const junction = button[0];
    ctaButton =
      typeof junction === "object" && junction !== null && "buttons_id" in junction && typeof junction.buttons_id === "object"
        ? (junction.buttons_id as BlockButton)
        : (junction as unknown as BlockButton);
  }

  if (slideItems.length === 0) return null;

  const shouldLoop = slideItems.length > 1;

  const handleBulletClick = (index: number) => {
    if (swiper) {
      if (shouldLoop) {
        swiper.slideToLoop(index);
      } else {
        swiper.slideTo(index);
      }
    }
  };

  return (
    <div className="relative w-full h-screen min-h-125 z-10 overflow-hidden bg-black block-slider-container">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={
          shouldLoop
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        loop={shouldLoop}
        onSlideChange={(swiperInstance) =>
          setActiveIndex(swiperInstance.realIndex)
        }
        onSwiper={setSwiper}
        className="w-full h-full"
      >
        {slideItems.map((slide, index) => {
          const bgImageId =
            typeof slide.background_image === "string"
              ? slide.background_image
              : slide.background_image?.id || null;

          const title = slide.title || "";
          const subtitle = slide.subtitle || "";

          // Split title by <br> tags to separate the thin/bold text
          const lines = title.replace(/<\/?p>/g, "").split(/<br\s*\/?>/i);
          const hasLines = lines.length > 0;

          return (
            <SwiperSlide
              key={slide.id || index}
              className="relative w-full h-full flex items-center justify-center group/slide"
            >
              {/* Background Image */}
              {bgImageId && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={`/api/assets/${bgImageId}`}
                    alt={subtitle || "Slide background"}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Overlay gradient to match design and ensure text readability */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background: `linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%), rgba(0, 0, 0, 0.35)`,
                    }}
                  />
                </div>
              )}

              {/* Slide Content */}
              <div className="relative z-20 flex items-center justify-center w-full h-full px-4 md:px-25">
                <div className="flex flex-col items-center justify-center text-center gap-4 md:gap-6 max-w-275">
                  {hasLines && (
                    <div className="flex flex-col items-center justify-center gap-2 md:gap-3 w-full">
                      {lines[0] && (
                        <div
                          className="font-title font-light uppercase tracking-[0.15em] text-[24px] sm:text-[34px] md:text-[50px] lg:text-[62px] text-white leading-none opacity-0 translate-y-6 transition-all duration-800 delay-100 ease-out group-[.swiper-slide-active]/slide:opacity-100 group-[.swiper-slide-active]/slide:translate-y-0"
                          dangerouslySetInnerHTML={{ __html: lines[0] }}
                        />
                      )}
                      {lines[1] && (
                        <div
                          className="font-title font-black uppercase tracking-[0.08em] text-[28px] sm:text-[40px] md:text-[62px] lg:text-[80px] text-white leading-none opacity-0 translate-y-6 transition-all duration-800 delay-300 ease-out group-[.swiper-slide-active]/slide:opacity-100 group-[.swiper-slide-active]/slide:translate-y-0"
                          dangerouslySetInnerHTML={{ __html: lines[1] }}
                        />
                      )}
                    </div>
                  )}

                  {subtitle && (
                    <p className="font-sans font-light text-[13px] sm:text-[14px] md:text-[16px] tracking-[0.2em] uppercase text-white/90 max-w-212.5 leading-relaxed m-0 opacity-0 translate-y-4 transition-all duration-800 delay-500 ease-out group-[.swiper-slide-active]/slide:opacity-100 group-[.swiper-slide-active]/slide:translate-y-0">
                      {subtitle}
                    </p>
                  )}

                  {ctaButton && (
                    <div className="mt-3 md:mt-4 opacity-0 translate-y-4 transition-all duration-800 delay-700 ease-out group-[.swiper-slide-active]/slide:opacity-100 group-[.swiper-slide-active]/slide:translate-y-0">
                      <DynamicButton 
                        btn={ctaButton} 
                        fallbackFill="transparent"
                        fallbackText="#c2b7a3"
                        globalSettings={globalSettings} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom pagination indicators */}
      {shouldLoop && (
        <div className="absolute bottom-15 md:bottom-30 left-1/2 -translate-x-1/2 z-40 flex gap-3 pointer-events-auto">
          {slideItems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleBulletClick(index)}
              className={`h-2 w-12.5 md:w-17.5 transition-all duration-300 cursor-pointer pointer-events-auto ${
                activeIndex === index
                  ? "bg-white"
                  : "bg-transparent border border-white hover:border-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
