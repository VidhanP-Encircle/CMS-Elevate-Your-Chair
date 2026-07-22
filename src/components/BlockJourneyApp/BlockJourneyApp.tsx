"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import RichText from "@/components/RichText/RichText";
import { BlockJourneyAppProps, BlockButton } from "@/lib/types";

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
        typeof junction === "object" &&
        junction !== null &&
        "buttons_id" in junction &&
        typeof junction.buttons_id === "object"
          ? (junction.buttons_id as BlockButton)
          : (junction as BlockButton),
      )
      .filter(
        (item): item is BlockButton =>
          typeof item === "object" && item !== null && "button_text" in item,
      );
  }

  const bgColor = globalSettings?.bg_color || "#151515";
  const textColor = globalSettings?.text_color || "#ffffff";
  const subtitleColor = globalSettings?.subtitle_color || "#a3a3a3";

  // Dynamic font size fallbacks
  const titleSize = data.title_size || globalSettings?.global_title_size || 48;
  const contentSize =
    data.content_size || globalSettings?.global_content_size || 16;

  const isDarkBg = ["#1a1a1a", "#151515", "#000000"].includes(bgColor.toLowerCase());

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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {},
          }}
          style={{ willChange: "transform, opacity" }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24"
        >
          {/* Left: Phone Mockup */}
          {imageId && (
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.7, delay: 0.1 },
                },
              }}
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
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.15 },
                  },
                }}
              >
                <RichText
                  variant="title"
                  theme="custom"
                  content={title}
                  className="mb-6 md:mb-8 prose-p:leading-[1.15] prose-strong:text-inherit prose-headings:m-0 m-0"
                  style={{
                    fontSize: titleSize
                      ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                      : undefined,
                    color: isDarkBg ? "#ffffff" : textColor,
                  }}
                />
              </motion.div>
            )}

            {/* Content - Full WYSIWYG HTML from Directus */}
            {content && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.25 },
                  },
                }}
              >
                <RichText
                  variant="content"
                  theme="custom"
                  content={content}
                  className="mb-8 md:mb-10 w-full max-w-155 m-0"
                  style={{
                    color: isDarkBg ? "#ffffff" : subtitleColor,
                    fontSize: contentSize
                      ? `clamp(${Math.round(contentSize * 0.85)}px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                      : undefined,
                  }}
                />
              </motion.div>
            )}

            {/* Buttons */}
            {buttonList.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.35 },
                  },
                }}
                className="flex flex-wrap gap-4 md:gap-5"
              >
                {buttonList.map((btn: BlockButton, index: number) => {
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
        </motion.div>
      </div>
    </div>
  );
}
