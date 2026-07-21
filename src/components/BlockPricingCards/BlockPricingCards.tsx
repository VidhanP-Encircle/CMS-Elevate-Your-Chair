"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HoverButton from "@/components/HoverButton/HoverButton";
import PricingBenefits from "@/components/PricingBenefits/PricingBenefits";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BlockPricingCards({
  data,
  globalSettings,
  benefits,
}: {
  data: any[];
  globalSettings?: any;
  benefits?: any[];
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
    content,
    background_image,
    button_text,
    button_url,
    button_fill,
    button_text_color,
    show_benefits,
    buttons,
  } = currentBlock;

  // Resolve M2M buttons
  let buttonList: any[] = [];
  if (Array.isArray(buttons)) {
    buttonList = buttons
      .map((junction: any) => junction.buttons_id || junction)
      .filter((item: any) => typeof item === "object" && item !== null);
  }

  // Use either legacy direct button fields or first M2M button
  const primaryButton = buttonList.length > 0 ? buttonList[0] : null;
  const primaryButtonText = primaryButton?.button_text || button_text;
  const primaryButtonUrl = primaryButton?.button_url || button_url;
  const primaryButtonFill =
    primaryButton?.button_fill_color || button_fill || "#1a1a1a";
  const primaryButtonColor =
    primaryButton?.button_text_color || button_text_color || "#c2b7a3";

  const shouldShowBenefits = show_benefits === "true";

  // Use first available background image if current doesn't have one
  const bgImageObj =
    background_image ||
    monthlyBlock?.background_image ||
    yearlyBlock?.background_image;
  const bgImage =
    bgImageObj?.id || (typeof bgImageObj === "string" ? bgImageObj : null);

  const cards = currentBlock.pricing_cards || [];

  return (
    <div className="relative w-full py-15 md:py-25 px-4 overflow-hidden min-h-200 flex flex-col items-center bg-[#fcfcfc] border-b border-[#646464]">
      {/* Background Image & Gradient */}
      {bgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={`/api/assets/${bgImage}`}
              alt="Pricing Background"
              fill
              sizes="100vw"
              className="object-cover object-center mix-blend-multiply opacity-80"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-linear-to-b from-[#fcfcfc]/95 via-[#fcfcfc]/50 to-[#fcfcfc]/95 backdrop-blur-[2px]" />
        </>
      )}

      <div className="relative z-10 max-w-270 mx-auto w-full flex flex-col items-center">
        {/* Title - Full WYSIWYG HTML from Directus */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="
              prose
              prose-p:m-0 prose-p:leading-[1.1] prose-p:text-black
              prose-headings:m-0 prose-headings:text-black prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide prose-headings:font-light
              prose-strong:text-black prose-strong:font-black prose-strong:font-title
              prose-a:text-[#1a1a1a] prose-a:no-underline hover:prose-a:underline
              font-title font-light uppercase tracking-wide text-center mb-6 text-black text-[32px] md:text-[48px]
            "
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {/* Content - WYSIWYG HTML from Directus */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="
              prose max-w-220 mx-auto text-center mb-10 md:mb-14
              prose-p:font-sans prose-p:font-light prose-p:text-[15px] md:prose-p:text-[16px] prose-p:leading-[1.7] prose-p:text-[#555555] prose-p:mb-4 last:prose-p:mb-0
              prose-strong:text-[#1a1a1a] prose-strong:font-bold
              prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Toggle */}
        {monthlyBlock && yearlyBlock && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center gap-6 md:gap-10 mb-16 text-[18px] md:text-[22px] font-sans font-black uppercase tracking-widest text-[#1a1a1a]"
          >
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
            <div className="w-0.5 h-7 bg-[#1a1a1a]" />
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
          </motion.div>
        )}

        {/* Cards Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full relative flex flex-col items-center"
        >
          <div className="w-full">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev-pricing",
                nextEl: ".swiper-button-next-pricing",
              }}
              spaceBetween={12}
              slidesPerView={1}
              centerInsufficientSlides={true}
              breakpoints={{
                640: { slidesPerView: Math.min(2, cards.length) },
                900: { slidesPerView: Math.min(3, cards.length) },
                1100: { slidesPerView: Math.min(4, cards.length) },
                1400: { slidesPerView: Math.min(5, cards.length) },
                1700: { slidesPerView: Math.min(6, cards.length) },
              }}
              className="w-full pt-8! pb-12!"
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
                    className="h-auto! flex! items-stretch!"
                  >
                    <div className="relative bg-white hover:bg-[#f0f0f0] flex flex-col text-center h-full min-h-70 w-full min-w-0 transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl duration-300 group">
                      {/* Elegant Thin Border Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none z-20 p-0.75 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "linear-gradient(180deg, #222222 0%, #4f4f4f 25%, #888888 50%, #cccccc 75%, #ffffff 100%)",
                          WebkitMask:
                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />

                      {/* Accent Label */}
                      {card.label && (
                        <div className="absolute top-1.5 left-0.5 text-[12px] md:text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] bg-[#C2B7A3] py-1 px-2 z-30 shadow-sm max-w-[75%] whitespace-normal text-left">
                          {card.label}
                        </div>
                      )}

                      <div
                        className={`p-4 md:p-5 flex flex-col flex-1 items-center ${card.label ? "pt-14 md:pt-16" : "pt-4 md:pt-5"}`}
                      >
                        {/* Title */}
                        {card.title && (
                          <h3 className="font-title font-black uppercase text-[24px] leading-[1.2] text-[#1a1a1a] mb-3 min-h-[2.4em] flex items-center justify-center tracking-wide wrap-break-word w-full px-1">
                            {card.title}
                          </h3>
                        )}

                        {/* Price */}
                        {price && (
                          <div className="text-[22px] md:text-[20px] font-light text-[#1a1a1a] mb-4 font-sans flex items-center justify-center gap-2">
                            {isYearly && yearlyEquivalent && (
                              <span className="text-[#a0a0a0] line-through mr-1 text-[16px]">
                                {yearlyEquivalent}
                              </span>
                            )}
                            <span>{price}</span>
                            <span className="text-[#1a1a1a] text-[16px] mx-1">
                              |
                            </span>
                            <span className="text-[16px] text-[#1a1a1a]">
                              {durationText}
                            </span>
                          </div>
                        )}

                        {/* Content - Full WYSIWYG HTML from Directus */}
                        {card.content && (
                          <div
                            className="
                              prose prose-p:leading-normal prose-p:text-gray-600 prose-p:font-light prose-p:m-0
                              prose-headings:font-title prose-headings:text-[#1a1a1a] prose-headings:mt-2 prose-headings:mb-1 prose-headings:text-[16px]
                              prose-strong:text-[#1a1a1a] prose-strong:font-bold
                              prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                              prose-ul:list-disc prose-ul:pl-3 prose-ul:text-left prose-li:leading-[1.4] prose-li:mb-0.5 prose-li:text-gray-600 prose-li:font-light
                              prose-ol:list-decimal prose-ol:pl-5 prose-ol:text-left
                              prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                              prose-img:rounded-lg prose-img:my-4 prose-img:mx-auto
                              prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50
                              prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
                              prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                              prose-pre:bg-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                              font-sans max-w-70
                            "
                            dangerouslySetInnerHTML={{ __html: card.content }}
                          />
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
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
        </motion.div>
      </div>

      {/* Benefits Section — moved outside inner container for edge-to-edge full width */}
      {shouldShowBenefits && benefits && benefits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="w-[calc(100%+32px)] -mx-4 mt-16 md:mt-20"
        >
          <PricingBenefits benefits={benefits} pricingCards={cards} />
        </motion.div>
      )}

      {/* Learn More Button */}
      <div className="relative z-10 max-w-270 mx-auto w-full flex flex-col items-center">
        {primaryButtonText && primaryButtonUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-16"
          >
            <HoverButton
              href={primaryButtonUrl}
              className="inline-flex justify-center items-center px-10 py-3.75 font-sans font-extrabold text-[16px] uppercase no-underline transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: primaryButtonFill,
                color: primaryButtonColor,
              }}
              hoverFill={
                primaryButton?.button_hover_fill_color ||
                globalSettings?.button_hover_fill_color
              }
              hoverText={
                primaryButton?.button_hover_text_color ||
                globalSettings?.button_hover_text_color
              }
            >
              {primaryButtonText}
            </HoverButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
