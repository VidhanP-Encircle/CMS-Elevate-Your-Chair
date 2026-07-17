"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BlockPricingCards({
  data,
  globalSettings,
}: {
  data: any[];
  globalSettings?: any;
}) {
  const [activePlan, setActivePlan] = useState<"monthly" | "yearly">("monthly");

  if (!data || data.length === 0) return null;

  // Find monthly and yearly blocks
  const monthlyBlock = data.find((b) => b.type_of_plan === "monthly");
  const yearlyBlock = data.find((b) => b.type_of_plan === "yearly");

  const currentBlock =
    activePlan === "monthly"
      ? monthlyBlock || yearlyBlock
      : yearlyBlock || monthlyBlock;

  if (!currentBlock) return null;

  const {
    title,
    background_image,
    button_text,
    button_url,
    button_fill,
    button_text_color,
  } = currentBlock;

  // Use first available background image if current doesn't have one
  const bgImageObj =
    background_image ||
    monthlyBlock?.background_image ||
    yearlyBlock?.background_image;
  const bgImage =
    bgImageObj?.id || (typeof bgImageObj === "string" ? bgImageObj : null);

  const cards = currentBlock.pricing_cards || [];

  return (
    <div className="relative w-full py-[60px] md:py-[100px] px-4 overflow-hidden min-h-[800px] flex flex-col items-center bg-[#fcfcfc]">
      {/* Background Image & Gradient */}
      {bgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={`/api/assets/${bgImage}`}
              alt="Pricing Background"
              fill
              className="object-cover object-center mix-blend-multiply opacity-50"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-linear-to-b from-[#fcfcfc]/95 via-[#fcfcfc]/80 to-[#fcfcfc]/95 backdrop-blur-[2px]" />
        </>
      )}

      <ScrollReveal className="relative z-10 max-w-[1512px] mx-auto w-full flex flex-col items-center">
        {/* Title */}
        {title && (
          <div
            className="font-title font-light uppercase tracking-wide text-center [&>p]:m-0 [&>p]:leading-[1.1] [&>p>strong]:font-black [&>p>strong]:font-title prose-strong:text-black mb-6 text-black text-[32px] md:text-[48px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {/* Toggle */}
        {monthlyBlock && yearlyBlock && (
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-16 text-[18px] md:text-[22px] font-sans font-black uppercase tracking-widest text-[#1a1a1a]">
            <button
              onClick={() => setActivePlan("monthly")}
              className={`outline-none pb-2 transition-all border-b-[3px] ${
                activePlan === "monthly"
                  ? "text-[#1a1a1a] border-[#1a1a1a]"
                  : "text-[#888888] hover:text-[#1a1a1a] border-transparent"
              }`}
            >
              MONTHLY
            </button>
            <div className="w-[2px] h-[28px] bg-[#1a1a1a]" />
            <button
              onClick={() => setActivePlan("yearly")}
              className={`outline-none pb-2 transition-all border-b-[3px] ${
                activePlan === "yearly"
                  ? "text-[#1a1a1a] border-[#1a1a1a]"
                  : "text-[#888888] hover:text-[#1a1a1a] border-transparent"
              }`}
            >
              YEARLY
            </button>
          </div>
        )}

        {/* Cards Carousel */}
        <div className="w-full relative flex flex-col items-center">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-[317px] min-[700px]:max-w-[658px] min-[1050px]:max-w-[999px] min-[1400px]:max-w-[1340px]"
          >
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev-pricing",
                nextEl: ".swiper-button-next-pricing",
              }}
              spaceBetween={24}
              slidesPerView={"auto" as any}
              className="w-[calc(100%+32px)]! -ml-4 pt-8! pb-12! px-4!"
            >
              {cards.map((item: any, index: number) => {
                const card = item.pricing_cards_id || item;
                if (!card) return null;

                const isYearly = activePlan === "yearly";
                const price = isYearly ? card.yearly_price : card.monthly_price;
                const durationText = isYearly ? "Year" : "Month";

                let yearlyEquivalent = "";
                if (isYearly && card.monthly_price) {
                  const rawMonthly = card.monthly_price.toString();
                  const numericPrice = parseFloat(
                    rawMonthly.replace(/[^0-9.]/g, ""),
                  );
                  if (!isNaN(numericPrice)) {
                    const yearlyTotal = numericPrice * 12;
                    yearlyEquivalent = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: yearlyTotal % 1 === 0 ? 0 : 2,
                      maximumFractionDigits: yearlyTotal % 1 === 0 ? 0 : 2,
                    }).format(yearlyTotal);
                  }
                }

                return (
                  <SwiperSlide
                    key={card.id || index}
                    className="w-[317px]! h-auto! flex shrink-0"
                  >
                    <div className="relative bg-white hover:bg-[#f0f0f0] flex flex-col text-center h-full min-h-[279px] w-full min-w-0 transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl duration-300 group">
                      {/* Elegant Thin Border Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none z-20 p-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "linear-gradient(180deg, #222222 0%, #4f4f4f 40%, #7a7a7a 70%, #a3a3a3 100%)",
                          WebkitMask:
                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />

                      {/* Accent Label */}
                      {card.label && (
                        <div className="absolute top-[10px] left-[2px] text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-[#1a1a1a] bg-[#C2B7A3] py-1.5 px-3 z-30 shadow-sm max-w-[85%] whitespace-normal text-left">
                          {card.label}
                        </div>
                      )}

                      <div className="p-10 md:p-12 pt-16 md:pt-20 flex flex-col flex-1 items-center">
                        {/* Title */}
                        {card.title && (
                          <h3 className="font-title font-black uppercase text-[22px] md:text-[26px] leading-[1.1] text-[#1a1a1a] mb-6 min-h-[70px] flex items-center justify-center tracking-wide wrap-break-word w-full px-1">
                            {card.title}
                          </h3>
                        )}

                        {/* Price */}
                        {price && (
                          <div className="text-[28px] font-light text-[#1a1a1a] mb-8 font-sans flex items-center justify-center gap-2">
                            {isYearly && yearlyEquivalent && (
                              <span className="text-[#a0a0a0] line-through mr-1 text-[24px]">
                                {yearlyEquivalent}
                              </span>
                            )}
                            <span>{price}</span>
                            <span className="text-[#1a1a1a] text-[24px] mx-1">
                              |
                            </span>
                            <span className="text-[24px] text-[#1a1a1a]">
                              {durationText}
                            </span>
                          </div>
                        )}

                        {/* Content (Directus rich text output) */}
                        {card.content && (
                          <div
                            className="prose prose-p:text-[17px] prose-p:leading-[1.6] prose-p:text-gray-600 prose-p:font-light font-sans max-w-[280px]"
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
          <div className="flex justify-center items-center gap-6 mt-8">
            <button className="swiper-button-prev-pricing flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M19 12H5M5 12L12 5M5 12L12 19" />
              </svg>
            </button>
            <button className="swiper-button-next-pricing flex items-center justify-center w-12 h-12 text-[#1a1a1a] hover:text-black transition-colors cursor-pointer outline-none rounded disabled:opacity-30 disabled:cursor-not-allowed">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Learn More Button */}
        {button_text && button_url && (
          <div className="mt-16">
            <Link
              href={button_url}
              className="inline-flex justify-center items-center px-[40px] py-[15px] font-sans font-extrabold text-[16px] uppercase no-underline hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: button_fill || "#1a1a1a",
                color: button_text_color || "#c2b7a3",
              }}
            >
              {button_text}
            </Link>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
