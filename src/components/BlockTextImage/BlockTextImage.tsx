"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import RichText from "@/components/RichText/RichText";
import { BlockTextImageProps, BlockButton, TextImageItem } from "@/lib/types";

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
    background_image,
    text_image,
    buttons,
  } = data;

  // Resolve M2M buttons
  let buttonList: BlockButton[] = [];
  if (Array.isArray(buttons)) {
    buttonList = buttons
      .map((junction: { buttons_id?: BlockButton | number } | BlockButton) =>
        typeof junction === "object" && junction !== null && "buttons_id" in junction
          ? (junction.buttons_id as BlockButton)
          : (junction as BlockButton)
      )
      .filter((item: BlockButton) => typeof item === "object" && item !== null);
  }

  const primaryButton = buttonList.length > 0 ? buttonList[0] : null;

  // Resolve text_image items - Directus M2M returns junction objects
  let items: TextImageItem[] = [];
  if (Array.isArray(text_image)) {
    items = text_image
      .map((junction: { text_image_id?: TextImageItem | string } | TextImageItem) => {
        const item = typeof junction === "object" && junction !== null && "text_image_id" in junction
          ? junction.text_image_id
          : junction;
        if (typeof item === "object" && item !== null) {
          return item as TextImageItem;
        }
        return null;
      })
      .filter((item): item is TextImageItem => item !== null);
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

  // --- Shared variant presets for stagger animation ---
  const childVariant = (delay: number, y: number = 15) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: "easeOut" as const } }
  });

  // --- Inner content (shared between card and direct modes) ---
  const renderContent = () => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {}
      }}
      style={{ willChange: 'transform, opacity' }}
      className={hasBgImage ? "px-6 md:px-12.5 lg:px-15 py-8 md:py-10 lg:py-12.5" : "px-6 md:px-8 py-8 md:py-10"}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center max-w-200 mx-auto mb-8 md:mb-8 lg:mb-10">
        {/* Title - Full WYSIWYG HTML from Directus */}
        {title && (
          <motion.div variants={childVariant(0)}>
            <RichText
              variant="title"
              content={title}
              theme="light"
              align="center"
              className="text-[#1a1a1a] text-[28px] md:text-[38px] lg:text-[48px] prose-p:leading-[1.15] prose-headings:text-[#1a1a1a] prose-strong:text-[#1a1a1a]"
            />
          </motion.div>
        )}

        {/* Initial Text - appears AFTER the title */}
        {initial_text && (
          <motion.span
            variants={childVariant(0.05, 10)}
            className="font-sans text-[14px] md:text-[15px] font-black tracking-wider mt-5 md:mt-6 block text-[#1a1a1a]"
          >
            {initial_text}
          </motion.span>
        )}

        {/* Label - simple text below the title, 24px, not bold */}
        {label && (
          <motion.span
            variants={childVariant(0.1, 10)}
            className="font-sans text-[24px] font-light text-[#1a1a1a] block mt-4"
          >
            {label}
          </motion.span>
        )}
      </div>

      {/* Content - WYSIWYG HTML from Directus */}
      {content && (
          <motion.div variants={childVariant(0)}>
            <RichText
              variant="content"
              content={content}
              theme="light"
              align="center"
              className="max-w-220 mx-auto mb-8 md:mb-8 lg:mb-10 prose-p:text-[14px] md:prose-p:text-[15px]"
            />
          </motion.div>
      )}

      {/* Photo Grid - 4 items */}
      {items.length > 0 && (
        <motion.div
          variants={childVariant(0)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-8 md:mb-8 lg:mb-10"
        >
          {items.map((item: TextImageItem, index: number) => {
            const photoId =
              typeof item.photo === "string"
                ? item.photo
                : (item.photo as { id: string } | null)?.id || null;
            const itemTitle = item.title || "";

            return (
              <div
                key={item.id || index}
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
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Bottom Text */}
      {bottom_text && (
        <motion.div
          variants={childVariant(0)}
        >
          <span className="font-sans text-[14px] md:text-[15px] font-black tracking-wide text-[#1a1a1a] block text-center">
            {bottom_text}
          </span>
        </motion.div>
      )}

      {/* CTA Button */}
      {primaryButton && (
        <motion.div
          variants={childVariant(0, 20)}
          className="flex justify-center mt-5"
        >
          <DynamicButton 
            btn={primaryButton}
            globalSettings={globalSettings} 
          />
        </motion.div>
      )}
    </motion.div>
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
