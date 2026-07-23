"use client";

import { motion } from "framer-motion";
import { BlockContentProps } from "@/lib/types";
import RichText from "@/components/RichText/RichText";

export default function BlockContent({
  data,
}: BlockContentProps) {
  const { title, subtitle, content, background_color } = data;

  // Determine if background is dark to use prose-invert
  const isDarkBg =
    background_color &&
    background_color.toLowerCase() !== "#ffffff" &&
    background_color.toLowerCase() !== "#fff" &&
    background_color !== "transparent";

  // Parse out title to apply uppercase but keeping any strong tags intact.
  // Tailwind typography plugin (.prose) handles the tags correctly.

  // No content to display → nothing to render
  if (!title && !subtitle && !content) return null;

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center py-10 md:py-16 px-5 md:px-20 ${
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
        className="flex flex-col items-center w-full gap-5 md:gap-8"
      >
        {title && (
          <RichText
            variant="title"
            content={title}
            theme={isDarkBg ? "dark" : "light"}
            align="center"
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
          <RichText
            variant="content"
            content={content}
            theme={isDarkBg ? "dark" : "light"}
            align="center"
            className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto"
          />
        )}
      </motion.div>
    </div>
  );
}
