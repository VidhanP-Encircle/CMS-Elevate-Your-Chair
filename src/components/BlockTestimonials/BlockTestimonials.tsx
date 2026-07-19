"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import "swiper/css";
import "swiper/css/navigation";

export default function BlockTestimonials({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  if (!data) return null;

  const { title, title_size, testimonial } = data;
  const testimonials = Array.isArray(testimonial) ? testimonial : [];

  return (
    <div className="relative w-full py-[60px] md:py-[100px] overflow-hidden bg-[#fcfcfc] flex flex-col items-center">
      <ScrollReveal className="relative z-10 max-w-[1512px] mx-auto w-full flex flex-col items-center">
        {/* Title */}
        {title && (
          <div className="w-full px-4">
            <h2
              className="font-title font-black uppercase tracking-wide text-center text-[#1a1a1a] mb-12 md:mb-16"
              style={{ fontSize: title_size ? `${title_size}px` : "48px" }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Carousel */}
        <div className="w-full relative flex flex-col items-center">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <Swiper
              modules={[Navigation]}
              navigation={
                testimonials.length > 1
                  ? {
                      prevEl: ".swiper-button-prev-testimonial",
                      nextEl: ".swiper-button-next-testimonial",
                    }
                  : undefined
              }
              centeredSlides={true}
              initialSlide={testimonials.length >= 3 ? 1 : 0}
              spaceBetween={24}
              slidesPerView={"auto" as any}
              className="pt-4! pb-4!"
            >
              {testimonials.map((item: any, index: number) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="w-[343px]! md:w-[677px]! h-auto! flex shrink-0"
                  >
                    <div className="relative bg-[#fafafa] flex flex-col text-center h-full min-h-[161px] w-full min-w-0 p-8 md:p-10">
                      {/* Subtle gray gradient border overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none z-20 p-[3px] opacity-100"
                        style={{
                          background:
                            "linear-gradient(180deg, #484848 0%, #999999 50%, #e3e3e3 100%)",
                          WebkitMask:
                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />

                      <div className="flex flex-col flex-1 relative z-10">
                        {/* Row: Left Quote | Text | Right Quote */}
                        <div className="flex flex-row items-start flex-1 w-full px-3 md:px-4 gap-3 md:gap-4">
                          {/* Left Quote */}
                          <div className="shrink-0 mt-0.5 md:mt-1 select-none">
                            <Image
                              src="/vaadin_quote-left.svg"
                              alt="Quote open"
                              width={28}
                              height={28}
                              className="w-[20px] h-[20px] md:w-[28px] md:h-[28px]"
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0 px-2 md:px-3">
                            <p className="text-[16px] md:text-[18px] leading-[1.6] text-gray-500 font-light font-sans">
                              {item.content}
                            </p>
                          </div>

                          {/* Right Quote */}
                          <div className="shrink-0 mt-0.5 md:mt-1 select-none">
                            <Image
                              src="/vaadin_quote-right.svg"
                              alt="Quote close"
                              width={28}
                              height={28}
                              className="w-[20px] h-[20px] md:w-[28px] md:h-[28px]"
                            />
                          </div>
                        </div>

                        {/* Name */}
                        <div className="pt-4 md:pt-6 pb-4 md:pb-6">
                          <h4 className="font-sans font-black uppercase text-[12px] md:text-[14px] tracking-widest text-[#555]">
                            {item.name || "NAME GOES HERE"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>

          {/* Custom Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-6 mt-10 md:mt-12">
              <button className="swiper-button-prev-testimonial flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded disabled:opacity-30 disabled:cursor-not-allowed">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M19 12H5M5 12L12 5M5 12L12 19" />
                </svg>
              </button>
              <button className="swiper-button-next-testimonial flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded disabled:opacity-30 disabled:cursor-not-allowed">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
