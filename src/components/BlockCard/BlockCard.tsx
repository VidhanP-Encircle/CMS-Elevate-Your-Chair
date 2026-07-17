"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
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
  const cardBorderColor = "#404040";
  const cardBgColor = "#151515"; // Updated to match the dark screenshot

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
          {title && (
            <div
              className="font-title font-light uppercase tracking-wide [&>p]:m-0 [&>p]:leading-[1.1] [&>p>strong]:font-black [&>p>strong]:font-title prose-strong:text-white"
              style={{ fontSize: `${titleSize}px`, color: textColor }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {subtitle && (
            <div
              className="prose prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-0"
              style={
                {
                  color: subtitleColor,
                  fontSize: `${subtitleSize}px`,
                  "--tw-prose-body": "inherit",
                } as any
              }
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>

        {/* Cards Section */}
        {cards && cards.length > 0 && (
          <div className="w-full relative mt-10">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
              className="w-full"
            >
              {cards.map((card: any, index: number) => {
                // Directus might return full object if populated with cards.*
                const isFullObject = typeof card === "object" && card !== null;
                if (!isFullObject) return null; // Fallback if data isn't populated

                return (
                  <SwiperSlide key={card.id || index} className="h-auto!">
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

                        {card.content && (
                          <div
                            className="font-sans font-light text-[15px] md:text-[16px] leading-normal [&>p]:my-0 text-center"
                            style={{
                              color: textColor, // SS uses white text for content
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
