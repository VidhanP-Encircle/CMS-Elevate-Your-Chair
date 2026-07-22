"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import RichText from "@/components/RichText/RichText";

import "swiper/css";
import "swiper/css/navigation";
import { BlockTestimonialsProps, TestimonialItem } from "@/lib/types";

export default function BlockTestimonials({
  data,
}: BlockTestimonialsProps) {
  if (!data) return null;

  const { title, title_size, testimonial, background_image } = data;

  const testimonials = Array.isArray(testimonial)
    ? testimonial
        .map((junction: { testimonial_id?: TestimonialItem | string } | TestimonialItem) =>
          typeof junction === "object" && junction !== null && "testimonial_id" in junction && typeof junction.testimonial_id === "object"
            ? (junction.testimonial_id as TestimonialItem)
            : (junction as TestimonialItem)
        )
        .filter((item): item is TestimonialItem => typeof item === "object" && item !== null)
    : [];

  const bgImageId =
    typeof background_image === "string"
      ? background_image
      : background_image?.id || null;

  const hasBgImage = !!bgImageId;

  return (
    <div className={`relative w-full py-15 md:py-25 overflow-hidden flex flex-col items-center ${hasBgImage ? 'bg-[#f0ece8]' : 'bg-[#fcfcfc]'}`}>
      {/* Background Image */}
      {hasBgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={`/api/assets/${bgImageId}`}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center mix-blend-multiply opacity-80"
            />
          </div>
          <div
            className="absolute inset-0 z-0 backdrop-blur-[2px]"
            style={{
              background:
                "linear-gradient(to bottom, #D6CFC9 0%, #D6CFC9F1 25%, #D6CFC9DF 50%, #D6CFC9C6 75%, #D6CFC900 100%)",
            }}
          />
        </>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: {} }}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        {/* Title */}
        {title && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: "easeOut" } }
            }}
            className="w-full px-4"
          >
            <RichText
              variant="title"
              content={title}
              theme="light"
              align="center"
              className="text-[#1a1a1a] mb-12 md:mb-16 prose-headings:text-[#1a1a1a] prose-strong:text-[#1a1a1a]"
              style={{
                fontSize: title_size
                  ? `clamp(${Math.round(title_size * 0.35)}px, ${(title_size / 12).toFixed(3)}vw, ${title_size}px)`
                  : "clamp(17px, 4vw, 48px)",
              }}
            />
          </motion.div>
        )}

        {/* Carousel */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25, ease: "easeOut" } }
          }}
          className="w-full relative flex flex-col items-center"
        >
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
              slidesPerView={"auto"}
              className="pt-4! pb-4!"
            >
              {testimonials.map((item: TestimonialItem, index: number) => {
                const authorImgId =
                  typeof item.image === "string"
                    ? item.image
                    : item.image?.id || null;

                const hasAuthorImg = !!authorImgId;

                return (
                  <SwiperSlide
                    key={index}
                    className="w-85.75! md:w-169.25! h-auto! flex shrink-0"
                  >
                    <div className="relative bg-[#fafafa] flex flex-col text-center h-full min-h-40.25 w-full min-w-0">
                      {/* Subtle gray gradient border overlay — only when no author image */}
                      {!hasAuthorImg && (
                        <div
                          className="absolute inset-0 pointer-events-none z-20 p-0.75 opacity-100"
                          style={{
                            background:
                              "linear-gradient(180deg, #484848 0%, #999999 50%, #e3e3e3 100%)",
                            WebkitMask:
                              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                          }}
                        />
                      )}

                      {/* Author photo banner — padded rectangular image at top of card */}
                      {hasAuthorImg && (
                        <div className="px-5 md:px-6 pt-5 md:pt-6 pb-0">
                          <div className="relative w-4/5 mx-auto h-50 md:h-75 overflow-hidden">
                            <Image
                              src={`/api/assets/${authorImgId}`}
                              alt={item.name || ""}
                              fill
                              sizes="(max-width: 768px) 295px, 613px"
                              className="object-cover object-center"
                            />
                          </div>
                        </div>
                      )}

                      <div className={`flex flex-col flex-1 relative z-10 ${hasAuthorImg ? 'px-5 md:px-6 pb-5 md:pb-6 pt-4 md:pt-5' : 'p-8 md:p-10'}`}>
                        {/* Row: Left Quote | Text | Right Quote */}
                        <div className="flex flex-row items-start flex-1 w-full px-3 md:px-4 gap-3 md:gap-4">
                          {/* Left Quote */}
                          <div className="shrink-0 mt-0.5 md:mt-1 select-none">
                            <Image
                              src="/vaadin_quote-left.svg"
                              alt="Quote open"
                              width={28}
                              height={28}
                              className="w-5 h-5 md:w-7 md:h-7"
                            />
                          </div>

                          {/* Text - Full WYSIWYG HTML from Directus */}
                          <div className="flex-1 min-w-0 px-2 md:px-3">
                            {item.content && (
                              <RichText
                                variant="content"
                                content={item.content}
                                theme="light"
                                className="prose-p:text-[16px] md:prose-p:text-[18px] prose-p:text-gray-500 prose-p:font-light prose-headings:text-gray-600 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-gray-600 prose-em:text-gray-500 prose-li:text-gray-500 prose-li:font-light"
                              />
                            )}
                          </div>

                          {/* Right Quote */}
                          <div className="shrink-0 mt-0.5 md:mt-1 select-none">
                            <Image
                              src="/vaadin_quote-right.svg"
                              alt="Quote close"
                              width={28}
                              height={28}
                              className="w-5 h-5 md:w-7 md:h-7"
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
              <button className="swiper-button-prev-testimonial flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed">
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
              <button className="swiper-button-next-testimonial flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-not-allowed">
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
        </motion.div>
      </motion.div>
    </div>
  );
}
