"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BlockCard({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const { title, subtitle, cards } = data;

  // Background and Text colors
  const bgColor = globalSettings?.bg_color || "#151515"; // Dark theme from the image
  const textColor = globalSettings?.text_color || "#ffffff";
  const subtitleColor = globalSettings?.subtitle_color || "#a3a3a3";
  const cardBgColor = "#151515";

  // Sizes
  const titleSize = data.title_size || globalSettings?.global_title_size || 48;
  const subtitleSize =
    data.subtitle_size || globalSettings?.global_subtitle_size || 18;
  const contentSize =
    data.content_size || globalSettings?.global_content_size || 14;

  return (
    <div
      className="w-full py-[60px] md:py-[100px] px-4 md:px-[55px] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <ScrollReveal className="max-w-[1512px] mx-auto flex flex-col items-center gap-[40px] md:gap-[60px]">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-[20px] max-w-[800px]">
          {/* Title - Full WYSIWYG HTML from Directus */}
          {title && (
            <div
              className="
                prose prose-invert
                prose-p:m-0 prose-p:leading-[1.1]
                prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                prose-headings:font-light prose-headings:m-0 prose-headings:text-white
                prose-strong:text-white prose-strong:font-black prose-strong:font-title
                prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                font-title font-light uppercase tracking-wide
              "
              style={{ fontSize: titleSize ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)` : undefined, color: textColor }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {/* Subtitle - Full WYSIWYG HTML from Directus */}
          {subtitle && (
            <div
              className="
                prose prose-invert
                prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-0
                prose-headings:font-title prose-headings:font-light prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-white
                prose-strong:text-white prose-strong:font-bold
                prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                prose-li:leading-[1.6] prose-li:mb-1
                prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                prose-img:rounded-lg prose-img:my-4
                prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-600 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-800
                prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
                prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
              "
              style={{
                color: subtitleColor,
                fontSize: subtitleSize
                  ? `clamp(14px, ${(subtitleSize / 12).toFixed(3)}vw, ${subtitleSize}px)`
                  : undefined,
                "--tw-prose-body": subtitleColor,
              } as any}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>

        {/* Cards Section */}
        {cards && cards.length > 0 && (
          <div className="w-full relative mt-10 flex flex-col items-center">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-[256px] min-[600px]:max-w-[536px] min-[900px]:max-w-[816px] min-[1200px]:max-w-[1096px] min-[1500px]:max-w-[1376px]"
            >
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }}
                spaceBetween={24}
                slidesPerView={"auto" as any}
                className="w-full"
              >
                {cards.map((card: any, index: number) => {
                  // Directus might return full object if populated with cards.*
                  const isFullObject =
                    typeof card === "object" && card !== null;
                  if (!isFullObject) return null; // Fallback if data isn't populated

                  return (
                    <SwiperSlide
                      key={card.id || index}
                      className="w-[256px]! h-[306px]! shrink-0"
                    >
                      {/* Layer 1: Outer Card Container (Dark) */}
                      <div
                        className="w-full h-full p-[8px] transition-all hover:brightness-110"
                        style={{ backgroundColor: cardBgColor }}
                      >
                        {/* Layer 2 & 3: Inner Frame & Gradient Background Layer */}
                        <div
                          className="w-full h-full relative flex flex-col items-center text-center px-[12px] py-[32px] md:px-[22px] md:py-[42px]"
                          style={{
                            background:
                              "linear-gradient(0deg, rgba(26, 26, 26, 0.88) 23.44%, rgba(26, 26, 26, 0.70) 49.04%, rgba(26, 26, 26, 0.59) 60.42%, rgba(26, 26, 26, 0.00) 80.33%), rgba(94, 94, 94, 0.20)",
                          }}
                        >
                          {/* Metallic Gradient Border Overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none p-px"
                            style={{
                              background:
                                "linear-gradient(180deg, #EAE0D0 0%, #C2B7A3 35%, #4A463E 100%)",
                              WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                              WebkitMaskComposite: "xor",
                              maskComposite: "exclude",
                            }}
                          ></div>
                          {/* Layer 4: Content Layer */}
                          {card.photo && (
                            <div className="w-[80px] h-[80px] flex justify-center items-center mb-[30px]">
                              <Image
                                src={`/api/assets/${card.photo}`}
                                alt={card.title || "Card Icon"}
                                width={80}
                                height={80}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          )}

                          {card.title && (
                            <h3
                              className="font-title font-bold uppercase tracking-widest text-[16px] md:text-[18px] mb-[15px] leading-[1.3]"
                              style={{ color: textColor }}
                            >
                              {card.title}
                            </h3>
                          )}

                          {/* Card Content - Full WYSIWYG HTML from Directus */}
                          {card.content && (
                            <div
                              className="
                                prose prose-invert
                                prose-p:my-0 prose-p:leading-normal prose-p:text-center prose-p:text-[15px] md:prose-p:text-[16px]
                                prose-headings:font-title prose-headings:font-bold prose-headings:text-center prose-headings:text-white prose-headings:mt-2 prose-headings:mb-1
                                prose-strong:text-white prose-strong:font-bold
                                prose-a:text-[#c2b7a3] prose-a:no-underline
                                prose-ul:list-none prose-ul:pl-0 prose-li:text-center prose-li:text-[15px] md:prose-li:text-[16px] prose-li:leading-normal
                                prose-code:text-sm prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                                max-w-full
                              "
                              style={{
                                color: textColor,
                              }}
                              dangerouslySetInnerHTML={{ __html: card.content }}
                            />
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </motion.div>
            {/* Custom Navigation */}
            <div className="flex justify-center items-center gap-6 mt-12">
              <button className="swiper-button-prev-custom flex items-center justify-center w-12 h-12 text-[#c2b7a3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#005fcc] focus:ring-offset-2 focus:ring-offset-[#151515] rounded disabled:opacity-30 disabled:cursor-not-allowed">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <path d="M19 12H5M5 12L12 5M5 12L12 19" />
                </svg>
              </button>
              <button className="swiper-button-next-custom flex items-center justify-center w-12 h-12 text-[#c2b7a3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#005fcc] focus:ring-offset-2 focus:ring-offset-[#151515] rounded disabled:opacity-30 disabled:cursor-not-allowed">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
