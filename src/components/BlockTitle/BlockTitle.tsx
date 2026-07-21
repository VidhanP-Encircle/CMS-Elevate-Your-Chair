"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HoverButton from "@/components/HoverButton/HoverButton";

export default function BlockTitle({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const {
    title,
    subtitle,
    buttons,
    background_image,
    background_video,
    subtitle_size,
  } = data;

  // Resolve M2M buttons (Directus returns junction array with buttons_id)
  let buttonList: any[] = [];
  if (Array.isArray(buttons)) {
    buttonList = buttons
      .map((junction: any) => junction.buttons_id || junction)
      .filter((item: any) => typeof item === "object" && item !== null);
  }

  const bgImageId =
    typeof background_image === "string"
      ? background_image
      : background_image?.id || null;

  const bgVideoId =
    typeof background_video === "string"
      ? background_video
      : background_video?.id || null;

  // Render buttons
  const renderButtons = () => {
    if (!buttonList || buttonList.length === 0) return null;

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7 mt-5 w-full md:w-auto"
      >
        {buttonList.map((btn: any, idx: number) => {
          const isFilled = !!btn.button_fill_color;
          return (
            <HoverButton
              key={idx}
              href={btn.button_url || "#"}
              className="box-border flex flex-row justify-center items-center px-6.25 py-2.5 gap-2.5 h-10 w-full md:w-auto no-underline transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: btn.button_fill_color || "transparent",
                borderColor:
                  btn.button_border_color || btn.button_fill_color || "transparent",
                borderWidth: btn.button_border_color ? "2px" : "0px",
                borderStyle: "solid",
                color: btn.button_text_color || "#fff",
              }}
              hoverFill={
                btn.button_hover_fill_color ||
                globalSettings?.button_hover_fill_color
              }
              hoverText={
                btn.button_hover_text_color ||
                globalSettings?.button_hover_text_color
              }
            >
              <span className="font-sans font-extrabold text-[16px] leading-5 uppercase">
                {btn.button_text}
              </span>
            </HoverButton>
          );
        })}
      </motion.div>
    );
  };

  const titleSize =
    data.title_size || globalSettings?.global_title_size || undefined;
  const subtitleSize = globalSettings?.global_subtitle_size || undefined;

  const hasButtons = buttons && Array.isArray(buttons) && buttons.length > 0;
  const hasSubtitle = !!subtitle;
  const isBanner = !hasButtons && !hasSubtitle;

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center z-10 overflow-hidden bg-black ${
        isBanner ? "h-80 md:h-120" : "min-h-125 md:h-220"
      }`}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {bgVideoId ? (
          <video
            src={`/api/assets/${bgVideoId}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : bgImageId ? (
          <Image
            src={`/api/assets/${bgImageId}`}
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-center items-center px-4 md:px-25 gap-8 md:gap-13.75 w-full h-full ${
          isBanner ? "pt-20 md:pt-25" : "pt-20 md:pt-30"
        }`}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          className="flex flex-col justify-center items-center gap-5 md:gap-7 w-full max-w-328 p-5"
        >
          <div className="flex flex-col items-center justify-center gap-4 md:gap-5 w-full">
            {/* Title - Full WYSIWYG HTML from Directus */}
            {title && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
                className="
                  flex flex-col justify-center items-center gap-2.5 w-full text-center
                  prose prose-invert
                  prose-p:my-0 prose-p:leading-[1.2] prose-p:uppercase prose-p:font-title
                  prose-h1:my-0 prose-h1:leading-[1.2] prose-h1:uppercase prose-h1:font-bold
                  prose-h2:my-0 prose-h2:leading-[1.2] prose-h2:uppercase prose-h2:font-bold
                  prose-h3:my-0 prose-h3:leading-[1.2]
                  prose-headings:font-title prose-headings:text-white
                  prose-strong:font-title prose-strong:text-white
                  prose-em:text-white
                  prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:text-left prose-li:leading-[1.6] prose-li:mb-1
                  prose-ol:list-decimal prose-ol:pl-5 prose-ol:text-left
                  prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:my-4
                  prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-600 prose-th:px-3 prose-th:py-2
                  prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
                  prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#c2b7a3]
                  prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
                  font-title
                "
                style={
                  {
                    fontSize: titleSize
                      ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                      : undefined,
                    "--tw-prose-headings": "inherit",
                    "--tw-prose-p": "inherit",
                  } as any
                }
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {subtitle && (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
                className="font-sans font-normal leading-[1.4] text-center uppercase text-white m-0 max-w-225"
                style={{
                  fontSize: subtitleSize
                    ? `clamp(14px, ${(subtitleSize / 12).toFixed(3)}vw, ${subtitleSize}px)`
                    : "clamp(14px, 1.5vw, 18px)",
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {renderButtons()}
        </motion.div>
      </div>
    </div>
  );
}
