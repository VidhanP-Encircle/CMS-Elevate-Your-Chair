"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import RichText from "@/components/RichText/RichText";
import { BlockFaqsProps, BlockFaqItem } from "@/lib/types";

export default function BlockFaqs({ data }: BlockFaqsProps) {
  if (!data) return null;

  const { title, que_ans, background_image } = data;
  const bgImage =
    typeof background_image === "object" &&
    background_image !== null &&
    "id" in background_image
      ? (background_image as { id: string }).id
      : typeof background_image === "string"
        ? background_image
        : null;
  const faqs = Array.isArray(que_ans) ? que_ans : [];

  if (faqs.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative w-full py-15 md:py-25 px-4 bg-white">
      {/* Background Image — fixed height so it doesn't stretch */}
      {bgImage && (
        <>
          <div className="absolute top-0 left-0 w-full h-125 md:h-175 z-0 overflow-hidden">
            <Image
              src={`/api/assets/${bgImage}`}
              alt="FAQ Background"
              fill
              sizes="100vw"
              className="object-cover object-center mix-blend-multiply opacity-80"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-125 md:h-175 z-0 bg-linear-to-b from-white/95 via-white/50 to-white/95 backdrop-blur-[2px]" />
        </>
      )}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: {} }}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-10 max-w-300 mx-auto w-full flex flex-col items-center"
      >
        {/* Title */}
        {title && (
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: "easeOut" } }
            }}
            className="font-title font-bold uppercase tracking-wide text-center text-[#1a1a1a] mb-12 md:mb-16"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
            }}
          >
            {title}
          </motion.h2>
        )}

        {/* FAQ Accordion */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25, ease: "easeOut" } }
          }}
          className="w-full max-w-220 mx-auto flex flex-col gap-3 sm:gap-4 min-h-112.5 sm:min-h-145 md:min-h-175"
        >
          {faqs.map((faq: BlockFaqItem, index: number) => {
            const isActive = activeIndex === index;
            const question = faq.questions || "";
            const answer = faq.answers || "";

            return (
              <div
                key={index}
                className="border border-black/30 transition-shadow duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4.5 text-left cursor-pointer bg-[#1a1a1a] outline-none group"
                  aria-expanded={isActive}
                >
                  <RichText
                    variant="title"
                    content={question}
                    theme="dark"
                    className="pr-2 sm:pr-3 flex-1 m-0 text-[24px] prose-p:text-[24px] prose-p:text-white prose-p:leading-[1.2] prose-strong:text-white"
                  />
                  <div className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c2b7a3"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-full h-full transition-transform duration-300 ${
                        isActive ? "" : "rotate-180"
                      }`}
                    >
                      <path d="M18 15L12 9L6 15" />
                    </svg>
                  </div>
                </button>

                {/* Answer Body — framer-motion animation */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-3 sm:pt-4 md:pt-5 border-t border-black/30">
                        <RichText
                          variant="content"
                          content={answer}
                          theme="light"
                          className="prose-p:text-[16px] prose-p:leading-[1.6] sm:prose-p:leading-[1.7] prose-p:text-[#333333] prose-p:font-light prose-p:m-0"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
