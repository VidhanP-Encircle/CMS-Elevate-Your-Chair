"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import HoverButton from "@/components/HoverButton/HoverButton";

export default function BlockMobile({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const {
    title,
    subtitle,
    content,
    image,
    image_position,
    button_text,
    button_url,
    content_size,
  } = data;

  // image can be a string UUID or an expanded Directus file object { id: "..." }
  const imageId = typeof image === "object" && image !== null ? image.id : image;

  const isRight = image_position === "right";

  // Dynamic values strictly from global_settings (block doesn't have these fields)
  const titleSize = globalSettings?.global_title_size || 48;
  const buttonColor = globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = globalSettings?.button_text_color || "#1a1a1a";
  const contentSize =
    content_size || globalSettings?.global_content_size || undefined;

  // Background and Text colors (Hardcoded aesthetic defaults as requested)
  const hoverFillColor = globalSettings?.button_hover_fill_color;
  const hoverTextColor = globalSettings?.button_hover_text_color;

  const bgColor = "#fcfcfc";
  const textColor = "#1a1a1a";
  const subtitleColor = globalSettings?.subtitle_color || "#666666";

  return (
    <div
      className="w-full py-[40px] md:py-[60px] px-4 md:px-[55px] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <ScrollReveal className="max-w-[1512px] mx-auto flex flex-col md:flex-row items-center gap-[40px] md:gap-[80px]">
        {/* Content Column */}
        <div
          className={`flex flex-col w-full md:w-2/3 order-2 ${isRight ? "md:order-1" : "md:order-2"}`}
        >
          <div
            className="border-l-2 pl-[25px] md:pl-[35px] flex flex-col gap-[20px] md:gap-[25px] text-left"
            style={{ borderColor: subtitleColor }}
          >
            {/* Title - Full WYSIWYG HTML from Directus */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="
                  prose prose-p:m-0 prose-p:leading-[1.1]
                  prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                  prose-headings:font-light prose-headings:text-[#1a1a1a] prose-headings:m-0
                  prose-strong:font-black prose-strong:font-title prose-strong:text-[#1a1a1a]
                  prose-a:text-[#c2b7a3] prose-a:no-underline
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

            {/* Subtitle - Full WYSIWYG HTML from Directus */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="
                  prose prose-p:leading-[1.6] prose-p:font-normal prose-p:mt-0 prose-p:mb-2
                  prose-headings:font-title prose-headings:font-light prose-headings:mt-4 prose-headings:mb-2
                  prose-strong:font-bold prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-[disc] prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                  marker:text-[#c2b7a3]
                  prose-li:leading-[1.6] prose-li:mb-1
                  prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:my-4
                  prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2
                  prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
                  prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  max-w-full md:max-w-[90%]
                "
                style={{
                  color: subtitleColor,
                  fontSize: contentSize
                    ? `clamp(14px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                    : undefined,
                }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}

            {/* Content - Full WYSIWYG HTML from Directus */}
            {content && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="
                  prose prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-4 last:prose-p:mb-0
                  prose-headings:font-title prose-headings:font-light prose-headings:mt-6 prose-headings:mb-3
                  prose-strong:font-bold prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-[disc] prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                  marker:text-[#c2b7a3]
                  prose-li:leading-[1.6] prose-li:mb-1
                  prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:my-4
                  prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2
                  prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
                  prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                  max-w-full md:max-w-[90%]
                "
                style={{
                  color: subtitleColor,
                  fontSize: contentSize
                    ? `clamp(14px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                    : undefined,
                  "--tw-prose-body": subtitleColor,
                } as any}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Button */}
            {button_text && button_url && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-[10px]"
              >
                <HoverButton
                  href={button_url}
                  className="inline-flex justify-center items-center px-[40px] py-[15px] font-sans font-extrabold text-[16px] uppercase no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                  }}
                  hoverFill={hoverFillColor}
                  hoverText={hoverTextColor}
                >
                  {button_text}
                </HoverButton>
              </motion.div>
            )}
          </div>
        </div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: isRight ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`w-full md:w-1/3 flex justify-center order-1 ${isRight ? "md:order-2" : "md:order-1"}`}
        >
          {imageId && (
            <div className="w-full flex justify-center">
              <Image
                src={`/api/assets/${imageId}`}
                alt="Mobile preview"
                width={430}
                height={544}
                className="w-full h-auto max-w-[430px] object-contain object-center"
              />
            </div>
          )}
        </motion.div>
      </ScrollReveal>
    </div>
  );
}
