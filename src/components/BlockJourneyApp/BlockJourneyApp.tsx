"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import HoverButton from "@/components/HoverButton/HoverButton";

export default function BlockJourneyApp({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  if (!data) return null;

  const { title, content, image, buttons } = data;
  const buttonList = Array.isArray(buttons) ? buttons : [];
  const bgColor = globalSettings?.bg_color || "#151515";
  const textColor = globalSettings?.text_color || "#ffffff";
  const subtitleColor = globalSettings?.subtitle_color || "#a3a3a3";
  const accentColor = globalSettings?.button_text_color || "#a3a3a3";
  const titleSize = data.title_size || globalSettings?.global_title_size || 48;

  // Handle image field (string UUID or expanded object)
  const imageId = typeof image === "string" ? image : image?.id || null;

  return (
    <div
      className="relative w-full py-[60px] md:py-[100px] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ backgroundColor: subtitleColor }}
      />

      <ScrollReveal className="relative z-10 max-w-[1512px] mx-auto w-full px-4 md:px-[55px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24">
          {/* Left: Phone Mockup */}
          {imageId && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full max-w-[280px] md:max-w-[380px] lg:max-w-[420px] shrink-0 relative"
            >
              {/* Phone glow */}
              <div
                className="absolute inset-0 rounded-[40px] blur-2xl translate-y-4 scale-95 opacity-10"
                style={{ backgroundColor: subtitleColor }}
              />
              <div className="relative">
                <Image
                  src={`/api/assets/${imageId}`}
                  alt="App Mockup"
                  width={420}
                  height={800}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Right: Content */}
          <div className="flex flex-col items-start text-left max-w-[620px]">
            {/* Title */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-title font-light uppercase tracking-wide mb-6 md:mb-8 [&>p]:m-0 [&>p]:leading-[1.15] [&>p>strong]:font-black [&>p>strong]:font-title"
                style={{
                  fontSize: titleSize
                    ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                    : undefined,
                  color: textColor,
                }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {/* Content - Full WYSIWYG HTML from Directus */}
            {content && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="
                  mb-8 md:mb-10 w-full max-w-[620px]
                  prose prose-invert
                  prose-p:leading-[1.7] prose-p:font-light prose-p:font-sans prose-p:mb-4
                  prose-p:text-[16px] md:prose-p:text-[18px]
                  prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                  prose-headings:font-light prose-headings:text-white prose-headings:mb-4 prose-headings:mt-8
                  first:prose-headings:mt-0
                  prose-strong:text-white prose-strong:font-black prose-strong:font-title
                  prose-em:text-white
                  prose-a:text-[#c2b7a3] prose-a:no-underline prose-a:font-medium
                  hover:prose-a:underline hover:prose-a:opacity-90
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:mt-4
                  prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4 prose-ol:text-[15px] md:prose-ol:text-[16px]
                  marker:text-[#c2b7a3]
                  prose-li:pl-0 prose-li:mb-3 prose-li:leading-[1.6]
                  prose-li:font-light prose-li:font-sans
                  prose-li:text-[15px] md:prose-li:text-[16px]
                  prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2
                  prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:font-light
                  prose-blockquote:text-[#c2b7a3] prose-blockquote:my-6
                  prose-img:rounded-xl prose-img:my-6 prose-img:mx-auto
                  prose-hr:border-[#404040] prose-hr:my-8
                  prose-table:w-full prose-table:my-6 prose-table:border-collapse
                  prose-th:border prose-th:border-[#404040] prose-th:px-4 prose-th:py-2.5
                  prose-th:bg-[#1a1a1a] prose-th:text-white prose-th:font-bold prose-th:text-left
                  prose-td:border prose-td:border-[#404040] prose-td:px-4 prose-td:py-2.5
                  prose-td:text-[14px] md:prose-td:text-[15px]
                  prose-code:bg-[#1a1a1a] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md
                  prose-code:text-sm prose-code:font-mono prose-code:text-[#c2b7a3]
                  prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#404040]
                  prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6
                  prose-pre:overflow-x-auto
                "
                style={{ color: subtitleColor }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Buttons */}
            {buttonList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-4 md:gap-5"
              >
                {buttonList.map((btn: any, index: number) => {
                  // Handle logo image (string UUID or expanded object)
                  const logoSrc =
                    typeof btn.logo === "string"
                      ? btn.logo
                      : btn.logo?.id || null;

                  // Resolve hover colors: button-level → block-level → global fallback
                  const btnHoverFill =
                    btn.button_hover_fill_color ||
                    data.button_hover_fill_color ||
                    globalSettings?.button_hover_fill_color;
                  const btnHoverText =
                    btn.button_hover_text_color ||
                    data.button_hover_text_color ||
                    globalSettings?.button_hover_text_color;

                  const defaultBg = btn.button_fill_color || "transparent";
                  const defaultText = btn.button_text_color || textColor;
                  const defaultBorder = btn.button_border_color || accentColor;

                  return (
                    <HoverButton
                      key={index}
                      href={btn.button_url || "#"}
                      className="inline-flex items-center gap-2.5 px-6 md:px-8 py-3 md:py-3.5 font-sans font-bold text-[14px] md:text-[15px] uppercase tracking-widest no-underline transition-transform duration-300 hover:-translate-y-0.5 border"
                      style={{
                        borderColor: defaultBorder,
                        color: defaultText,
                        backgroundColor: defaultBg,
                      }}
                      hoverFill={btnHoverFill}
                      hoverText={btnHoverText}
                    >
                      {/* Logo Image */}
                      {logoSrc && (
                        <Image
                          src={`/api/assets/${logoSrc}`}
                          alt=""
                          width={18}
                          height={18}
                          className="shrink-0 w-[18px] h-[18px] object-contain"
                        />
                      )}

                      {btn.button_text}
                    </HoverButton>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
