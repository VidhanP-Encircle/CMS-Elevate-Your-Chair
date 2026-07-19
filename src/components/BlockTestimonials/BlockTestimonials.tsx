"use client";

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
    <div className="relative w-full py-[60px] md:py-[100px] px-4 overflow-hidden bg-[#fcfcfc] flex flex-col items-center">
      <ScrollReveal className="relative z-10 max-w-[1512px] mx-auto w-full flex flex-col items-center">
        {/* Title */}
        {title && (
          <h2
            className="font-title font-black uppercase tracking-wide text-center text-[#1a1a1a] mb-12 md:mb-16"
            style={{ fontSize: title_size ? `${title_size}px` : "48px" }}
          >
            {title}
          </h2>
        )}

        {/* Carousel */}
        <div className="w-full relative flex flex-col items-center">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-[317px] min-[700px]:max-w-[658px] min-[1050px]:max-w-[999px] min-[1400px]:max-w-[1340px]"
          >
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev-testimonial",
                nextEl: ".swiper-button-next-testimonial",
              }}
              spaceBetween={24}
              slidesPerView={"auto" as any}
              className="w-[calc(100%+32px)]! -ml-4 pt-4! pb-4! px-4!"
            >
              {testimonials.map((item: any, index: number) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="w-[317px]! md:w-[480px]! h-auto! flex shrink-0"
                  >
                    <div className="relative bg-[#fafafa] flex flex-col text-center h-full min-h-[200px] w-full min-w-0 p-8 md:p-10">
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
                        {/* Quote Text */}
                        <div className="relative">
                          {/* Opening Quote Icon */}
                          <div className="absolute -top-2 md:-top-4 -left-2 text-[40px] md:text-[60px] leading-none text-[#555] font-serif select-none">
                            “
                          </div>

                          <p className="text-[16px] md:text-[18px] leading-[1.6] text-gray-500 font-light font-sans px-8 py-2 md:py-4">
                            {item.content}
                          </p>

                          {/* Closing Quote Icon */}
                          <div className="absolute -bottom-6 md:-bottom-8 -right-2 text-[40px] md:text-[60px] leading-none text-[#555] font-serif select-none">
                            ”
                          </div>
                        </div>

                        {/* Name */}
                        <div className="mt-8 pt-4">
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
        </div>
      </ScrollReveal>
    </div>
  );
}
