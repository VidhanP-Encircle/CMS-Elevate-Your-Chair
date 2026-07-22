"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import HoverButton from "@/components/HoverButton/HoverButton";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { BlockMobileProps, BlockButton, SocialLink } from "@/lib/types";

export default function BlockMobile({
  data,
  globalSettings,
}: BlockMobileProps) {
  const {
    title,
    subtitle,
    content,
    image,
    image_position,
    button_text,
    button_url,
    content_size,
    buttons,
  } = data;

  // Resolve M2M buttons
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

  // Use either legacy direct button fields or first M2M button
  const primaryButton = buttonList.length > 0 ? buttonList[0] : null;
  const primaryButtonText = primaryButton?.button_text || button_text;
  const primaryButtonUrl = primaryButton?.button_url || button_url;
  const primaryButtonFill = primaryButton?.button_fill_color || undefined;
  const primaryButtonColor =
    primaryButton?.button_text_color ||
    globalSettings?.button_text_color ||
    "#1a1a1a";

  // image can be a string UUID or an expanded Directus file object { id: "..." }
  const imageId =
    typeof image === "object" && image !== null ? image.id : image;

  const isRight = image_position === "right";

  // Dynamic values strictly from global_settings (block doesn't have these fields)
  const titleSize = globalSettings?.global_title_size || 48;
  const buttonColor = globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = globalSettings?.button_text_color || "#1a1a1a";
  const contentSize =
    content_size || globalSettings?.global_content_size || undefined;
  const subtitleSizeVal = contentSize ? contentSize + 4 : 20;

  // Background and Text colors (Hardcoded aesthetic defaults as requested)
  const globalHoverFill = globalSettings?.button_hover_fill_color;
  const globalHoverText = globalSettings?.button_hover_text_color;
  // Resolve per-button hover colors with global fallback
  const resolvedHoverFill =
    primaryButton?.button_hover_fill_color || globalHoverFill;
  const resolvedHoverText =
    primaryButton?.button_hover_text_color || globalHoverText;

  const bgColor = "#fcfcfc";
  const textColor = "#1a1a1a";
  const subtitleColor = globalSettings?.subtitle_color || "#666666";

  const isContactInfo = data.contact_information === true;
  const email = globalSettings?.email;
  const socialLinks = Array.isArray(globalSettings?.social_links)
    ? globalSettings.social_links
    : [];

  return (
    <div
      className="w-full py-10 md:py-15 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}          variants={{
            hidden: {},
            visible: {}
          }}
        style={{ willChange: 'transform, opacity' }}
        className="w-full px-4 md:px-12 lg:px-20 2xl:px-32 flex flex-col md:flex-row items-start md:items-center justify-center gap-10 md:gap-12 lg:gap-16"
      >
        {/* Content Column */}
        <div
          className={`flex-1 min-w-0 flex flex-col w-full order-2 ${isRight ? "md:order-1" : "md:order-2"}`}
        >
          <div
            className="border-l-2 pl-6.25 md:pl-8.75 flex flex-col gap-5 md:gap-6.25 text-left"
            style={{ borderColor: subtitleColor }}
          >
            {/* Title - Full WYSIWYG HTML from Directus */}
            {title && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }
                }}
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

            {isContactInfo ? (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
                }}
                className="mt-6 flex flex-col gap-6"
              >
                {/* Email Section */}
                {email && (
                  <div className="flex items-center gap-4 text-[#1a1a1a] font-sans font-bold text-lg md:text-xl">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </div>
                )}

                {/* Social Links Section */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[#1a1a1a] font-sans font-bold text-lg md:text-xl">
                    <div className="flex items-center gap-3">
                      {socialLinks.map(
                        (social: SocialLink | string, idx: number) => {
                          const sObj =
                            typeof social === "object" && social !== null
                              ? social
                              : {
                                  id: `soc-${idx}`,
                                  url: String(social),
                                  media_logo: undefined,
                                };
                          return (
                            <a
                              key={sObj.id || idx}
                              href={sObj.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:opacity-70 transition-opacity"
                            >
                              {sObj.media_logo ? (
                                <Image
                                  src={`/api/assets/${typeof sObj.media_logo === "object" && sObj.media_logo !== null ? sObj.media_logo.id : sObj.media_logo}`}
                                  alt={sObj.media_name || "Social logo"}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <span className="text-sm font-sans">
                                  {sObj.media_name || "Social"}
                                </span>
                              )}
                            </a>
                          );
                        },
                      )}
                    </div>
                    {/* Handle name from global settings */}
                    {globalSettings?.handle_name && (
                      <span className="hidden sm:inline">-</span>
                    )}
                    {globalSettings?.handle_name && (
                      <a
                        href={
                          (typeof socialLinks[0] === "object" &&
                          socialLinks[0] !== null
                            ? socialLinks[0].url
                            : undefined) ||
                          (typeof socialLinks[0] === "string"
                            ? socialLinks[0]
                            : "#")
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {globalSettings.handle_name}
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {/* Subtitle - Full WYSIWYG HTML from Directus */}
                {subtitle && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
                    }}
                    className="
                      prose prose-p:leading-[1.4] prose-p:font-black prose-p:text-[#1a1a1a] prose-p:mt-0 prose-p:mb-2
                      prose-headings:font-title prose-headings:font-light prose-headings:mt-4 prose-headings:mb-2
                      prose-strong:font-black prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                      prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
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
                      color: "#1a1a1a",
                      fontSize: `clamp(18px, ${(subtitleSizeVal / 12).toFixed(3)}vw, ${subtitleSizeVal}px)`,
                    }}
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
                )}

                {/* Content - Full WYSIWYG HTML from Directus */}
                {content && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
                    }}
                    className="
                      prose prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-4 last:prose-p:mb-0
                      prose-headings:font-title prose-headings:font-light prose-headings:mt-6 prose-headings:mb-3
                      prose-strong:font-bold prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                      prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
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
                    style={
                      {
                        color: subtitleColor,
                        fontSize: contentSize
                          ? `clamp(14px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                          : undefined,
                        "--tw-prose-body": subtitleColor,
                      } as React.CSSProperties
                    }
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </>
            )}

            {/* Buttons (Side-by-side) */}
            {buttonList.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
                }}
                className={`mt-4 flex flex-wrap gap-4 ${isContactInfo ? "pt-4" : ""}`}
              >
                {buttonList.map((btn: BlockButton, idx: number) => (
                  <DynamicButton
                    key={idx}
                    btn={btn}
                    globalSettings={globalSettings}
                  />
                ))}
              </motion.div>
            )}

            {/* Fallback for legacy single button if no buttonList is present */}
            {buttonList.length === 0 &&
              primaryButtonText &&
              primaryButtonUrl && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
                  }}
                >
                  <div className="mt-8 flex justify-center">
                    <DynamicButton
                      btn={{
                        button_text: primaryButtonText,
                        button_url: primaryButtonUrl,
                        button_fill_color: primaryButtonFill,
                        button_text_color: primaryButtonColor,
                      }}
                      globalSettings={globalSettings}
                    />
                  </div>
                </motion.div>
              )}
          </div>
        </div>

        {/* Image Column */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: isRight ? 20 : -20 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.15, ease: "easeOut" } }
          }}
          className={`w-full md:w-auto md:shrink md:basis-95 lg:basis-120 flex justify-center order-1 ${isRight ? "md:order-2" : "md:order-1"}`}
        >
          {imageId && (
            <div className="w-full flex justify-center relative">
              <Image
                src={`/api/assets/${imageId}`}
                alt="Mobile preview"
                width={480}
                height={600}
                className="w-auto h-auto max-h-95 md:max-h-115 object-contain object-center"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
