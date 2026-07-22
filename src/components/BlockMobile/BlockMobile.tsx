"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import RichText from "@/components/RichText/RichText";
import { BlockMobileProps, BlockButton, SocialLink } from "@/lib/types";
import { getDirectusImageUrl } from "@/lib/utils";

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

  const primaryButton = buttonList.length > 0 ? buttonList[0] : null;

  // image can be a string UUID or an expanded Directus file object { id: "..." }
  const imageId =
    typeof image === "object" && image !== null ? image.id : image;

  const isRight = image_position === "right";

  // Dynamic values strictly from global_settings (block doesn't have these fields)
  const titleSize = globalSettings?.global_title_size || 48;
  const contentSize =
    content_size || globalSettings?.global_content_size || undefined;
  const subtitleSizeVal = contentSize ? contentSize + 4 : 20;

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
                >
                  <RichText
                    variant="title"
                    content={title}
                    theme="light"
                    style={{
                      fontSize: titleSize
                        ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                        : undefined,
                      color: textColor,
                    }}
                  />
                </motion.div>
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
                    >
                      <RichText
                        variant="subtitle"
                        content={subtitle}
                        className="max-w-full md:max-w-[90%]"
                        style={{
                          color: "#1a1a1a",
                          fontSize: `clamp(18px, ${(subtitleSizeVal / 12).toFixed(3)}vw, ${subtitleSizeVal}px)`,
                        }}
                      />
                    </motion.div>
                )}

                {/* Content - Full WYSIWYG HTML from Directus */}
                {content && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
                    }}
                    >
                      <RichText
                        variant="content"
                        content={content}
                        className="max-w-full md:max-w-[90%]"
                        style={
                          {
                            color: subtitleColor,
                            fontSize: contentSize
                              ? `clamp(14px, ${(contentSize / 12).toFixed(3)}vw, ${contentSize}px)`
                              : undefined,
                            "--tw-prose-body": subtitleColor,
                          } as React.CSSProperties
                        }
                      />
                    </motion.div>
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
              primaryButton && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
                  }}
                >
                  <div className="mt-8 flex justify-center">
                    <DynamicButton
                      btn={primaryButton}
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
                src={getDirectusImageUrl(imageId, { width: 800, quality: 80, format: "webp" })}
                alt="Mobile preview"
                width={480}
                height={600}
                priority
                className="w-auto h-auto max-h-95 md:max-h-115 object-contain object-center"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
