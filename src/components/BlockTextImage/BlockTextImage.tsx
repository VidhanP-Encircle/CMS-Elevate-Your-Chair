"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { BlockTextImageProps } from '@/lib/types';

export default function BlockTextImage({
  data,
  globalSettings,
}: BlockTextImageProps) {
  if (!data) return null;

  const {
    title,
    initial_text,
    label,
    content,
    bottom_text,
    button_text,
    button_url,
    background_image,
    text_image,
    buttons,
  } = data;

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
  const primaryButtonFill = primaryButton?.button_fill_color || undefined;
  const primaryButtonColor = primaryButton?.button_text_color || globalSettings?.button_text_color || "#1a1a1a";

  // Resolve text_image items - Directus M2M returns junction objects
  let items: any[] = [];
  if (Array.isArray(text_image)) {
    items = text_image
      .map((junction: any) => {
        const item = junction.text_image_id || junction;
        if (typeof item === "object" && item !== null) {
          return item;
        }
        return null;
      })
      .filter(Boolean);
  }

  // Background image
  const bgImageId =
    typeof background_image === "string"
      ? background_image
      : background_image?.id || null;

  const hasBgImage = !!bgImageId;

  // Colors
  const textColor = "#1a1a1a";
  const subtitleColor = "#666666";
  const buttonColor = globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = globalSettings?.button_text_color || "#1a1a1a";

  // --- Inner content (shared between card and direct modes) ---
  const renderContent = () => (
    <div className={hasBgImage ? "px-6 md:px-12.5 lg:px-15 py-8 md:py-10 lg:py-12.5" : "px-6 md:px-8 py-8 md:py-10"}>
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-200 mx-auto mb-8 md:mb-8 lg:mb-10">
        {/* Title - Full WYSIWYG HTML from Directus */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="
              prose max-w-none
              prose-p:m-0 prose-p:leading-[1.15]
              prose-headings:m-0 prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
              prose-headings:font-light prose-headings:text-[#1a1a1a]
              prose-strong:text-[#1a1a1a] prose-strong:font-black prose-strong:font-title
              prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
              font-title font-light uppercase tracking-wide
              text-[28px] md:text-[38px] lg:text-[48px]
            "
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {/* Initial Text - appears AFTER the title */}
        {initial_text && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="font-sans text-[14px] md:text-[15px] font-black tracking-wider mt-5 md:mt-6 block text-[#1a1a1a]"
          >
            {initial_text}
          </motion.span>
        )}

        {/* Label - simple text below the title, 24px, not bold */}
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="font-sans text-[24px] font-light text-[#1a1a1a] block mt-4"
          >
            {label}
          </motion.span>
        )}
      </div>

      {/* Content - WYSIWYG HTML from Directus */}
      {content && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="
            prose max-w-220 mx-auto text-center mb-8 md:mb-8 lg:mb-10
            prose-p:font-sans prose-p:font-light prose-p:text-[14px] md:prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-[#555555] prose-p:mb-5 last:prose-p:mb-0
            prose-strong:text-[#1a1a1a] prose-strong:font-bold
            prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Photo Grid - 4 items */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-8 md:mb-8 lg:mb-10"
        >
          {items.map((item: any, index: number) => {
            const photoId =
              typeof item.photo === "string"
                ? item.photo
                : item.photo?.id || null;
            const itemTitle = item.title || "";

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Photo */}
                <div className="relative w-full aspect-4/3 overflow-hidden mb-3 md:mb-4 bg-[#f5f5f5]">
                  {photoId ? (
                    <Image
                      src={`/api/assets/${photoId}`}
                      alt={itemTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span
                        className="font-sans text-xs uppercase tracking-widest"
                        style={{ color: subtitleColor }}
                      >
                        Photo
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Title */}
                {itemTitle && (
                  <h3
                    className="font-sans text-[14px] md:text-[16px] font-black leading-[1.4] px-2 max-w-60 uppercase tracking-wide"
                    style={{ color: textColor }}
                  >
                    {itemTitle}
                  </h3>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Bottom Text */}
      {bottom_text && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <span className="font-sans text-[14px] md:text-[15px] font-black tracking-wide text-[#1a1a1a] block text-center">
            {bottom_text}
          </span>
        </motion.div>
      )}

      {/* CTA Button */}
      {primaryButtonText && primaryButtonUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex justify-center mt-5"
        >
          <DynamicButton 
            btn={primaryButton || {
              button_text: primaryButtonText,
              button_url: primaryButtonUrl,
              button_fill_color: primaryButtonFill,
              button_text_color: primaryButtonColor,
            }}
            globalSettings={globalSettings} 
          />
        </motion.div>
      )}
    </div>
  );

  return (
    <div className={`relative w-full py-10 md:py-15 lg:py-20 overflow-hidden ${hasBgImage ? 'bg-[#f0ece8]' : 'bg-white'}`}>
      {/* Full Background Image with whitish opacity overlay */}
      {hasBgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`/api/assets/${bgImageId}`}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Whitish overlay as seen in the reference design */}
          <div className="absolute inset-0 bg-white/50" />
        </div>
      )}

      <div className="relative z-10 max-w-300 mx-auto px-4 md:px-8">
        {hasBgImage ? (
          /* With background image: keep the white card wrapper */
          <div>
            <div className="w-full bg-white shadow-xl shadow-black/5 border border-black/5">
              {renderContent()}
            </div>
          </div>
        ) : (
          /* Without background image: render directly, no white card */
          renderContent()
        )}
      </div>
    </div>
  );
}
