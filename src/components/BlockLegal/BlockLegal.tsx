import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { BlockLegalProps, BlockLegalDetail } from "@/lib/types";
import RichText from "@/components/RichText/RichText";

export default function BlockLegal({ data }: BlockLegalProps) {
  if (!data) return null;

  const details: BlockLegalDetail[] = Array.isArray(data.details)
    ? data.details
    : [];

  if (details.length === 0) return null;

  return (
    <section className="w-full flex justify-center py-12 md:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-40 3xl:px-48 bg-white box-border">
      <ScrollReveal className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col gap-10 md:gap-14 lg:gap-16 xl:gap-20">
        {details.map((detail: BlockLegalDetail, idx: number) => {
          const { title, subtitle, content } = detail;

          return (
            <div key={idx} className="flex flex-col w-full">
              {/* Section Title */}
              {title && (
                <h2 className="font-title font-extrabold uppercase text-[24px] tracking-wider text-[#1A1A1A] m-0 mb-1.5 leading-snug">
                  {title}
                </h2>
              )}

              {/* Subtitle / Effective Date */}
              {subtitle && (
                <p className="font-sans text-[20px] font-medium text-[#666666] m-0 mb-3 leading-normal">
                  {subtitle}
                </p>
              )}

              {/* HTML Content styled using Tailwind Typography */}
              {content && (
                <RichText
                  content={content}
                  className="
                    text-[16px] leading-relaxed text-[#2D2D2D]
                    prose-p:my-2 md:prose-p:my-2.5 prose-p:leading-normal md:prose-p:leading-[1.7] prose-p:text-[#2D2D2D]
                    prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:my-2 md:prose-ul:my-3 prose-ul:space-y-1 md:prose-ul:space-y-1.5
                    prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:my-2 md:prose-ol:my-3 prose-ol:space-y-1 md:prose-ol:space-y-1.5
                    prose-li:my-1 md:prose-li:my-1.5 prose-li:leading-normal prose-li:text-[#2D2D2D] [&_li::marker]:text-black
                    prose-strong:text-[#1A1A1A] prose-strong:font-bold
                    prose-a:text-[#1A1A1A] prose-a:underline hover:prose-a:text-black
                  "
                />
              )}
            </div>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
