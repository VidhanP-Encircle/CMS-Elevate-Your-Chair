"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

  // Render buttons
  const renderButtons = () => {
    if (!buttons || !Array.isArray(buttons)) return null;

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="flex flex-col md:flex-row items-center justify-center gap-[16px] md:gap-[28px] mt-[20px] w-full md:w-auto"
      >
        {buttons.map((btn: any, idx: number) => {
          const isFilled = !!btn.fill_color;
          return (
            <Link
              key={idx}
              href={btn.button_url || "#"}
              className="box-border flex flex-row justify-center items-center px-[25px] py-[10px] gap-[10px] h-[40px] w-full md:w-auto no-underline transition-opacity hover:opacity-90"
              style={{
                backgroundColor: btn.fill_color || "transparent",
                borderColor:
                  btn.border_color || btn.fill_color || "transparent",
                borderWidth: btn.border_color ? "2px" : "0px",
                borderStyle: "solid",
                color: btn.text_color || "#fff",
              }}
            >
              <span className="font-sans font-extrabold text-[16px] leading-[20px] uppercase">
                {btn.button_text}
              </span>
            </Link>
          );
        })}
      </motion.div>
    );
  };

  const titleSize =
    data.title_size || globalSettings?.global_title_size || undefined;
  const subtitleSize = globalSettings?.global_subtitle_size || undefined;

  return (
    <div className="relative w-full min-h-[500px] md:h-[880px] flex flex-col items-center justify-center max-w-[1512px] mx-auto z-10 overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {background_video ? (
          <video
            src={`/api/assets/${background_video}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : background_image ? (
          <Image
            src={`/api/assets/${background_image}`}
            alt="Background"
            fill
            className="object-cover"
          />
        ) : null}

        {/* Overlay gradient as requested in block-title.css */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(69.68% 48.01% at 50% 51.99%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center pt-[80px] md:pt-[120px] px-4 md:px-[100px] gap-8 md:gap-[55px] w-full h-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
          className="flex flex-col justify-center items-center gap-[20px] md:gap-[28px] w-full max-w-[1312px] backdrop-blur-[5px] p-[20px] rounded-xl"
        >
          <div className="flex flex-col items-center justify-center gap-[16px] md:gap-[20px] w-full">
            {/* Title - Full WYSIWYG HTML from Directus */}
            {title && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="
                  flex flex-col justify-center items-center gap-[10px] w-full text-center
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
                    fontSize: titleSize ? `${titleSize}px` : undefined,
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
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="font-sans font-normal leading-[1.4] text-center uppercase text-white m-0 max-w-[900px]"
                style={{
                  fontSize: subtitleSize ? `${subtitleSize}px` : "18px",
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
