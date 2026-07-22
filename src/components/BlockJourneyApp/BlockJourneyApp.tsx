"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import HoverButton from "@/components/HoverButton/HoverButton";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { BlockJourneyAppProps, BlockButton } from '@/lib/types';

export default function BlockJourneyApp({
  data,
  globalSettings,
}: BlockJourneyAppProps) {
  if (!data) return null;

  const { title, content, image, buttons } = data;

  // Resolve buttons M2M
  let buttonList: BlockButton[] = [];
  if (Array.isArray(buttons)) {
    buttonList = buttons
      .map((junction: { buttons_id?: BlockButton | number } | BlockButton) =>
        typeof junction === "object" && junction !== null && "buttons_id" in junction && typeof junction.buttons_id === "object"
          ? (junction.buttons_id as BlockButton)
          : (junction as BlockButton)
      )
      .filter((item): item is BlockButton => typeof item === "object" && item !== null && "button_text" in item);
  }

  const bgColor = globalSettings?.bg_color || "#151515";
  const textColor = globalSettings?.text_color || "#ffffff";
  const subtitleColor = globalSettings?.subtitle_color || "#a3a3a3";
  const accentColor = globalSettings?.button_text_color || "#a3a3a3";

  // Dynamic font size fallbacks
  const titleSize = data.title_size || globalSettings?.global_title_size || 48;
  const contentSize =
    data.content_size || globalSettings?.global_content_size || 16;

  // Handle image field (string UUID or expanded object)
  const imageId = typeof image === "string" ? image : image?.id || null;

  return (
    <div
      className="relative w-full py-15 md:py-25 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ backgroundColor: subtitleColor }}
      />

      <div className="relative z-10 w-full px-4 md:px-12 lg:px-20 2xl:px-32">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24">
          {/* Left: Phone Mockup */}
          {imageId && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full max-w-70 md:max-w-95 lg:max-w-105 shrink relative"
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
          <div className="flex-1 flex flex-col items-start text-left max-w-155">
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
                  mb-8 md:mb-10 w-full max-w-155
                  prose prose-invert
                  prose-p:leading-[1.7] prose-p:font-light prose-p:font-sans prose-p:mb-4
                  prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                  prose-headings:font-light prose-headings:text-white prose-headings:mb-4 prose-headings:mt-8
                  first:prose-headings:mt-0
                  prose-strong:text-white prose-strong:font-black prose-strong:font-title
                  prose-em:text-white
                  prose-a:text-[#c2b7a3] prose-a:no-underline prose-a:font-medium
                  hover:prose-a:underline hover:prose-a:opacity-90
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:mt-4
                  prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4
                  marker:text-[#c2b7a3]
                  prose-li:pl-0 prose-li:mb-3 prose-li:leading-[1.6]
                  prose-li:font-light prose-li:font-sans
                  prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2
                  prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:font-light
                  prose-blockquote:text-[#c2b7a3] prose-blockquote:my-6
                  prose-img:rounded-xl prose-img:my-6 prose-img:mx-auto
                  prose-hr:border-[#404040] prose-hr:my-8
                  prose-table:w-full prose-table:my-6 prose-table:border-collapse
                  prose-th:border prose-th:border-[#404040] prose-th:px-4 prose-th:py-2.5
                  prose-th:bg-[#1a1a1a] prose-th:text-white prose-th:font-bold prose-th:text-left
                  prose-td:border prose-td:border-[#404040] prose-td:px-4 prose-td:py-2.5
                  prose-code:bg-[#1a1a1a] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md
                  prose-code:text-sm prose-code:font-mono prose-code:text-[#c2b7a3]
                  prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#404040]
                  prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6
                  prose-pre:overflow-x-auto
                "
                style={{
                  color: subtitleColor,
                  fontSize: contentSize
                    ? `clamp(${Math.round(contentSize * 0.85)}px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                    : undefined,
                }}
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
                {buttonList.map((btn: BlockButton, index: number) => {
                  const defaultBorder =
                    btn.button_border_color ||
                    globalSettings?.button_color ||
                    accentColor;
                    
                  return (
                    <DynamicButton 
                      key={index} 
                      btn={btn}
                      fallbackFill="transparent"
                      fallbackText={textColor}
                      globalSettings={globalSettings} 
                    />
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
