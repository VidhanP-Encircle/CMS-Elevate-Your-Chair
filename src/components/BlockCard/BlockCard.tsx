"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";

export default function BlockCard({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const { title, subtitle, cards } = data;
  const isWhiteTheme = data.theme === "white";
  const [showNav, setShowNav] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  const checkNavVisibility = useCallback((swiper: SwiperClass) => {
    if (!swiper) return;
    const fullyVisible = Math.floor(swiper.slidesPerViewDynamic());
    setShowNav(swiper.slides.length > fullyVisible);
  }, []);

  // Background and Text colors
  const bgColor = globalSettings?.bg_color || "#151515";
  const textColor = globalSettings?.text_color || "#ffffff";
  const subtitleColor = globalSettings?.subtitle_color || "#a3a3a3";

  // Sizes from block data or global settings
  const titleSize = data.title_size || globalSettings?.global_title_size || 48;
  const subtitleSize =
    data.subtitle_size || globalSettings?.global_subtitle_size || 18;
  const contentSize =
    data.content_size || globalSettings?.global_content_size || 16;

  return (
    <div
      className="w-full py-15 md:py-25 px-4 md:px-13.75 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-378 mx-auto flex flex-col items-center gap-10 md:gap-15">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-5 max-w-294 w-full">
          {/* Title */}
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="
                prose prose-invert max-w-none text-center
                prose-p:m-0 prose-p:leading-[1.1]
                prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                prose-headings:font-light prose-headings:m-0 prose-headings:text-white
                prose-strong:text-white prose-strong:font-black prose-strong:font-title
                prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                font-title font-light uppercase tracking-wide
              "
              style={{
                fontSize: titleSize
                  ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                  : undefined,
                color: textColor,
              }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="
                prose prose-invert max-w-220 w-full
                prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-0
                prose-headings:font-title prose-headings:font-light prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-white
                prose-strong:text-white prose-strong:font-bold
                prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                prose-li:leading-[1.6] prose-li:mb-1
                prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                prose-img:rounded-lg prose-img:my-4
                prose-table:w-full prose-table:border-collapse
                prose-th:border prose-th:border-gray-600 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-800
                prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
                prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
              "
              style={
                {
                  color: subtitleColor,
                  fontSize: subtitleSize
                    ? `clamp(14px, ${(subtitleSize / 12).toFixed(3)}vw, ${subtitleSize}px)`
                    : undefined,
                  "--tw-prose-body": subtitleColor,
                } as any
              }
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>

        {/* Cards Section */}
        {cards && cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full relative mt-10 flex flex-col items-center"
          >
            <div className="w-full">
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  900: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                  1500: { slidesPerView: 5 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  checkNavVisibility(swiper);
                }}
                onInit={checkNavVisibility}
                onResize={checkNavVisibility}
                onSlidesLengthChange={checkNavVisibility}
                className={`w-full ${!showNav ? 'cards-centered' : ''}`}
              >
                {cards.map((card: any, index: number) => {
                  const isFullObject =
                    typeof card === "object" && card !== null;
                  if (!isFullObject) return null;

                  return (
                    <SwiperSlide
                      key={card.id || index}
                      className="h-auto! flex! items-stretch!"
                    >
                      {isWhiteTheme ? (
                        /* Light Theme Card */
                        <div
                          className="w-full h-full min-h-70 min-w-0 flex flex-col items-center justify-between p-4 md:p-5"
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          <div className="w-full flex flex-col items-center text-center">
                            {/* Photo */}
                            {card.photo && (
                              <div className="w-full aspect-4/3 relative mb-4 overflow-hidden">
                                <Image
                                  src={`/api/assets/${card.photo}`}
                                  alt={card.title || "Card Photo"}
                                  fill
                                  sizes="(max-width: 768px) 300px, 231px"
                                  className="object-cover"
                                />
                              </div>
                            )}

                            {/* Title */}
                            {card.title && (
                              <h3
                                className="font-title font-bold uppercase tracking-widest text-[15px] md:text-[16px] mb-2 leading-[1.3]"
                                style={{
                                  color:
                                    textColor === "#ffffff"
                                      ? "#1a1a1a"
                                      : textColor,
                                }}
                              >
                                {card.title}
                              </h3>
                            )}

                            {/* Content */}
                            {card.content && (
                              <div
                                className="prose max-w-full"
                                style={{
                                  color: "#555555",
                                  fontSize: contentSize
                                    ? `clamp(12px, ${(contentSize / 14).toFixed(3)}vw, 14px)`
                                    : undefined,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: card.content,
                                }}
                              />
                            )}
                          </div>

                          {/* Action Button */}
                          {card.button_text && card.button_url && (
                            <Link
                              href={card.button_url}
                              className="mt-4 font-title font-bold uppercase text-[11px] md:text-[12px] tracking-widest border-b border-black/20 hover:border-black transition-colors pb-0.5"
                              style={{ color: "#1a1a1a" }}
                            >
                              {card.button_text}
                            </Link>
                          )}
                        </div>
                      ) : (
                        /* Dark Theme Card - gradient border via CSS mask */
                        <div
                          className="w-full h-full min-h-70 min-w-0 flex flex-col items-center text-center px-3 py-6 md:py-8 relative hover:brightness-110 transition-all"
                          style={{ backgroundColor: "#1a1a1a" }}
                        >
                          {/* Border overlay with CSS mask */}
                          <div
                            className="absolute inset-0 pointer-events-none p-0.5"
                            style={{
                              background:
                                "linear-gradient(180deg, rgb(194, 183, 163) 0%, rgb(194, 183, 163) 20%, rgba(194, 183, 163, 0.4) 40%, rgba(194, 183, 163, 0.15) 60%, rgba(194, 183, 163, 0.08) 80%)",
                              WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                              WebkitMaskComposite: "xor",
                              maskComposite: "exclude",
                            }}
                          />

                          {/* Content */}
                          <div className="w-full flex flex-col items-center">
                            {/* Icon slot */}
                            <div className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4 flex justify-center items-center">
                              {card.photo ? (
                                <Image
                                  src={`/api/assets/${card.photo}`}
                                  alt={card.title || "Card Icon"}
                                  width={56}
                                  height={56}
                                  className="object-contain w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full" />
                              )}
                            </div>

                            {/* Title slot */}
                            <h3
                              className="font-title font-bold uppercase tracking-widest text-[14px] md:text-[15px] mb-2 leading-[1.3] min-h-[2.6em] w-full text-white"
                              style={{ color: textColor }}
                            >
                              {card.title || ""}
                            </h3>

                            {/* Content */}
                            {card.content && (
                              <div
                                className="
                                  prose prose-invert
                                  prose-p:my-0 prose-p:leading-normal prose-p:text-center prose-p:text-[13px] md:prose-p:text-[14px] prose-p:text-[#a3a3a3]
                                  prose-headings:font-title prose-headings:font-bold prose-headings:text-center prose-headings:text-white prose-headings:mt-1.5 prose-headings:mb-0.5
                                  prose-strong:text-white prose-strong:font-bold
                                  prose-a:text-[#c2b7a3] prose-a:no-underline
                                  prose-ul:list-none prose-ul:pl-0 prose-li:text-center prose-li:text-[13px] md:prose-li:text-[14px] prose-li:leading-normal prose-li:text-[#a3a3a3]
                                  prose-code:text-sm prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-code:text-[#a3a3a3]
                                  max-w-full
                                "
                                style={{
                                  color: "#a3a3a3",
                                  fontSize: contentSize
                                    ? `clamp(12px, ${(contentSize / 14).toFixed(3)}vw, 14px)`
                                    : undefined,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: card.content,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            {/* Centering style for when cards don't fill viewport */}
            <style>{`
              .cards-centered .swiper-wrapper {
                justify-content: center;
              }
            `}</style>
            {/* Custom Navigation — only shown when cards overflow the viewport */}
            {showNav && (
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                className="flex items-center justify-center w-10 h-10 text-[#c2b7a3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#005fcc] focus:ring-offset-2 focus:ring-offset-[#151515] rounded"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <svg
                  width="30"
                  height="30"
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
              <button
                className="flex items-center justify-center w-10 h-10 text-[#c2b7a3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#005fcc] focus:ring-offset-2 focus:ring-offset-[#151515] rounded"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <svg
                  width="30"
                  height="30"
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
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
