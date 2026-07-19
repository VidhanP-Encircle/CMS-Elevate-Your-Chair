"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export default function BlockTextImage({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  if (!data) return null;

  const {
    title,
    initial_text,
    bottom_text,
    button_text,
    button_url,
    background_image,
    text_image,
  } = data;

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

  // Colors
  const textColor = "#1a1a1a";
  const subtitleColor = "#666666";
  const accentColor = "#c2b7a3";

  return (
    <div className="relative w-full py-[40px] md:py-[60px] lg:py-[80px] overflow-hidden bg-[#f0ece8]">
      {/* Full Background Image with whitish opacity overlay */}
      {bgImageId && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`/api/assets/${bgImageId}`}
            alt=""
            fill
            className="object-cover object-center"
          />
          {/* Whitish overlay as seen in the reference design */}
          <div className="absolute inset-0 bg-white/50" />
        </div>
      )}

      {/* Content Box - sits above the background */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div
            className="w-full bg-white shadow-xl shadow-black/5 border border-black/5"
          >
            {/* Inner padding */}
            <div className="px-6 md:px-[50px] lg:px-[60px] py-8 md:py-[40px] lg:py-[50px]">
              {/* Header */}
              <div className="flex flex-col items-center text-center max-w-[800px] mx-auto mb-8 md:mb-[32px] lg:mb-[40px]">
                {/* Title - Full WYSIWYG HTML from Directus */}
                {title && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
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
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="font-sans text-[14px] md:text-[15px] font-black tracking-wider mt-5 md:mt-6 block uppercase text-[#1a1a1a]"
                  >
                    {initial_text}
                  </motion.span>
                )}
              </div>

              {/* Photo Grid - 4 items */}
              {items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-8 md:mb-[32px] lg:mb-[40px]">
                  {items.map((item: any, index: number) => {
                    const photoId =
                      typeof item.photo === "string"
                        ? item.photo
                        : item.photo?.id || null;
                    const itemTitle = item.title || "";

                    return (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 + index * 0.1,
                        }}
                        className="group relative flex flex-col items-center text-center"
                      >
                        {/* Photo */}
                        <div className="relative w-full aspect-[4/3] overflow-hidden mb-3 md:mb-4 bg-[#f5f5f5]">
                          {photoId ? (
                            <Image
                              src={`/api/assets/${photoId}`}
                              alt={itemTitle}
                              fill
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
                            className="font-sans text-[14px] md:text-[16px] font-black leading-[1.4] px-2 max-w-[240px] uppercase tracking-wide"
                            style={{ color: textColor }}
                          >
                            {itemTitle}
                          </h3>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Text + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center gap-5 md:gap-6"
              >
                {/* Bottom Text - comes BEFORE the button */}
                {bottom_text && (
                  <span
                    className="font-sans text-[14px] md:text-[15px] font-black tracking-wide text-[#1a1a1a]"
                  >
                    {bottom_text}
                  </span>
                )}

                {/* CTA Button */}
                {button_text && button_url && (
                  <Link
                    href={button_url}
                    className="inline-flex justify-center items-center px-[40px] py-[15px] font-sans font-black text-[14px] uppercase no-underline tracking-widest transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: accentColor,
                      color: "#1a1a1a",
                    }}
                  >
                    {button_text}
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
