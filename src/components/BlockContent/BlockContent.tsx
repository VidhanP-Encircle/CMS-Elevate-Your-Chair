"use client";

import { motion } from "framer-motion";

export default function BlockContent({
  data,
  globalSettings,
}: {
  data: any;
  globalSettings?: any;
}) {
  const { title, subtitle, content, background_color } = data;

  // Determine if background is dark to use prose-invert
  const isDarkBg =
    background_color &&
    background_color.toLowerCase() !== "#ffffff" &&
    background_color.toLowerCase() !== "#fff" &&
    background_color !== "transparent";

  // Parse out title to apply uppercase but keeping any strong tags intact.
  // Tailwind typography plugin (.prose) handles the tags correctly.

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center py-20 md:py-32 px-5 md:px-20 ${
        isDarkBg ? "text-white" : "text-black"
      }`}
      style={{ backgroundColor: background_color || "transparent" }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
        className="flex flex-col items-center max-w-5xl w-full gap-5 md:gap-8"
      >
        {title && (
          <div
            className={`
              w-full text-center
              prose ${isDarkBg ? "prose-invert" : ""} max-w-none
              prose-p:my-0 prose-p:leading-[1.2] prose-p:uppercase prose-p:font-title prose-p:text-4xl md:prose-p:text-[50px] prose-p:font-light prose-p:tracking-wider
              prose-strong:font-bold prose-strong:font-title
              prose-headings:font-title
            `}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {subtitle && (
          <h3
            className={`font-sans text-xl md:text-2xl font-light text-center mb-4 ${
              isDarkBg ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {subtitle}
          </h3>
        )}

        {content && (
          <div
            className={`
              w-full text-center
              prose ${isDarkBg ? "prose-invert" : ""}
              max-w-4xl mx-auto
              prose-p:text-[16px] md:prose-p:text-[20px] prose-p:font-sans prose-p:font-light prose-p:leading-[1.8] ${
                isDarkBg ? "prose-p:text-gray-300" : "prose-p:text-gray-600"
              }
              prose-strong:font-bold ${
                isDarkBg ? "prose-strong:text-white" : "prose-strong:text-gray-800"
              }
              prose-a:underline hover:prose-a:opacity-80
            `}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </motion.div>
    </div>
  );
}
