"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export default function BlockMobile({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const {
    title,
    content,
    image,
    image_position,
    button_text,
    button_url,
    content_size,
  } = data;

  const isRight = image_position === "right";

  // Dynamic values strictly from global_settings (block doesn't have these fields)
  const titleSize = globalSettings?.global_title_size || 48;
  const buttonColor = globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = globalSettings?.button_text_color || "#1a1a1a";
  const contentSize =
    content_size || globalSettings?.global_content_size || undefined;

  // Background and Text colors (Hardcoded aesthetic defaults as requested)
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
            className="border-l-2 pl-[25px] md:pl-[35px] flex flex-col gap-[20px] md:gap-[25px]"
            style={{ borderColor: subtitleColor }}
          >
            {title && (
              <div
                className="font-title font-light uppercase tracking-wide [&>p]:m-0 [&>p]:leading-[1.1] [&>p>strong]:font-black [&>p>strong]:font-title"
                style={{ fontSize: `${titleSize}px`, color: textColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {content && (
              <div
                className="prose prose-p:font-normal prose-p:leading-[1.6] prose-p:mt-0 prose-p:mb-4 last:prose-p:mb-0 max-w-full md:max-w-[90%]"
                style={
                  {
                    color: subtitleColor,
                    fontSize: contentSize ? `${contentSize}px` : undefined,
                    "--tw-prose-body": "inherit",
                  } as any
                }
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {button_text && button_url && (
              <div className="mt-[10px]">
                <Link
                  href={button_url}
                  className="inline-flex justify-center items-center px-[40px] py-[15px] font-sans font-extrabold text-[16px] uppercase no-underline hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                  }}
                >
                  {button_text}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Image Column */}
        <div
          className={`w-full md:w-1/3 flex justify-center order-1 ${isRight ? "md:order-2" : "md:order-1"}`}
        >
          {image && (
            <div className="w-full flex justify-center">
              <Image
                src={`/api/assets/${image}`}
                alt="Mobile preview"
                width={430}
                height={544}
                className="w-full h-auto max-w-[430px] object-contain object-center"
              />
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
