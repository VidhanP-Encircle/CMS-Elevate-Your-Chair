"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function BlockFaqs({
  data,
}: {
  data: any;
}) {
  if (!data) return null;

  const { title, que_ans, background_image } = data;
  const bgImage =
    background_image?.id ||
    (typeof background_image === "string" ? background_image : null);
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
          <div className="absolute top-0 left-0 w-full h-[500px] md:h-[700px] z-0 overflow-hidden">
            <Image
              src={`/api/assets/${bgImage}`}
              alt="FAQ Background"
              fill
              sizes="100vw"
              className="object-cover object-center mix-blend-multiply opacity-80"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-[500px] md:h-[700px] z-0 bg-linear-to-b from-white/95 via-white/50 to-white/95 backdrop-blur-[2px]" />
        </>
      )}
      <div className="relative z-10 max-w-300 mx-auto w-full flex flex-col items-center">
        {/* Title */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
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
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="w-full max-w-220 mx-auto flex flex-col gap-3 sm:gap-4 min-h-[450px] sm:min-h-[580px] md:min-h-[700px]"
        >
          {faqs.map((faq: any, index: number) => {
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
                  <div
                    className="font-title font-black uppercase text-white leading-[1.2] pr-2 sm:pr-3 flex-1 m-0 text-[15px] sm:text-[17px] md:text-[20px]"
                    dangerouslySetInnerHTML={{ __html: question }}
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
                    <div
                      className="
                        prose max-w-none
                        prose-p:text-[14px] sm:prose-p:text-[15px] md:prose-p:text-[16px] prose-p:leading-[1.6] sm:prose-p:leading-[1.7] prose-p:text-[#333333] prose-p:font-light prose-p:m-0
                        prose-headings:font-title prose-headings:text-[#1a1a1a] prose-headings:mt-4 prose-headings:mb-2
                        prose-strong:text-[#1a1a1a] prose-strong:font-bold
                        prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                        prose-ul:list-disc prose-ul:pl-5 prose-li:leading-[1.6] prose-li:mb-1 prose-li:text-[#333333]
                        prose-ol:list-decimal prose-ol:pl-5
                        prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#555555]
                        prose-img:rounded-lg prose-img:my-4
                        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#1a1a1a]
                      "
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  </div>
                </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
