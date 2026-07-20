import { getDirectus } from "@/lib/directus";
import Link from "next/link";
import Image from "next/image";
import { GlobalSettings } from "@/lib/types";
import { readItems } from "@directus/sdk";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

import AnimatedImageGrid from "@/components/AnimatedImageGrid/AnimatedImageGrid";

export default async function Footer({
  globalSettings,
}: {
  globalSettings: GlobalSettings;
}) {
  try {
    const directus = await getDirectus();
    const socialLinksData = await directus.request(readItems("social_links"));
    const footerImagesData = await directus.request(readItems("footer_images"));

    const year = new Date().getFullYear();

    const footerBgColor = "#1a1a1a";
    const footerTextColor = "#ffffff";
    const footerSubtitleColor = globalSettings?.subtitle_color || "#f9f9f9";
    const footerLabelSize = globalSettings?.global_label_size || undefined;

    return (
      <footer className="w-full flex flex-col items-center overflow-hidden" style={{ backgroundColor: footerBgColor }}>
        {/* IG Feed section */}
        <ScrollReveal className="flex flex-col w-full max-w-[1512px] px-4 md:px-[55px] pt-8 md:pt-[55px] pb-12 box-border" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] w-full">
            {/* Top text row inside grid to align with images */}
            <div 
              className="col-span-1 md:col-span-2 flex justify-start items-end font-title font-extrabold uppercase pb-[15px] leading-none tracking-wide"
              style={{ color: footerTextColor, fontSize: footerLabelSize ? `clamp(${Math.round(footerLabelSize * 0.35)}px, ${(footerLabelSize / 12).toFixed(3)}vw, ${footerLabelSize}px)` : 'clamp(10px, 2.333vw, 28px)' }}
            >
              {globalSettings.label || "FOLLOW US"}
            </div>
            <div 
              className="col-span-1 md:col-span-2 flex justify-end items-end font-title font-extrabold uppercase text-[#c2b7a3] pb-[15px] leading-none tracking-wide wrap-break-word text-right"
              style={{ fontSize: footerLabelSize ? `clamp(${Math.round(footerLabelSize * 0.35)}px, ${(footerLabelSize / 12).toFixed(3)}vw, ${footerLabelSize}px)` : 'clamp(10px, 2.333vw, 28px)' }}
            >
              @elevateyourchair
            </div>

            {/* Images */}
            <AnimatedImageGrid images={footerImagesData} />
          </div>
        </ScrollReveal>

        {/* Bottom section */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-[1512px] px-4 md:px-[55px] pb-16 gap-12 md:gap-10 lg:gap-[100px] box-border" delay={0.2}>
          {/* Newsletter Column */}
          <div className="flex flex-col w-full md:w-[300px] lg:w-[350px] xl:w-[400px] shrink-0 gap-[30px]">
            <div
              className="
                flex flex-col gap-4
                prose prose-invert
                prose-p:my-0 prose-p:text-[14px] prose-p:leading-[22px] prose-p:text-[#f9f9f9]
                prose-h1:my-0 prose-h1:text-[32px] prose-h1:leading-[1.1] prose-h1:uppercase prose-h1:font-black prose-h1:text-white
                prose-h2:text-white prose-h2:font-title prose-h2:mt-4 prose-h2:mb-2
                prose-h3:text-white prose-h3:font-title prose-h3:mt-3 prose-h3:mb-1
                prose-headings:text-white prose-headings:font-title
                prose-strong:text-white prose-strong:font-bold
                prose-em:text-[#f9f9f9]
                prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-5 prose-li:text-[#f9f9f9] prose-li:leading-[1.6] prose-li:mb-1
                prose-ol:list-decimal prose-ol:pl-5
                prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#f9f9f9]
                prose-img:rounded-lg prose-img:my-4
                prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-600 prose-th:px-3 prose-th:py-2
                prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
                prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#c2b7a3]
                prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
              "
              dangerouslySetInnerHTML={{ __html: globalSettings.content }}
            />
            <form className="flex flex-col gap-[20px] w-full mt-2">
              <div className="flex flex-col gap-[10px]">
                <label className="text-[14px] text-white font-sans">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-5 py-[14px] bg-white text-[#1a1a1a] font-sans text-[16px] border-none outline-none placeholder:text-[#1a1a1a]/40"
                />
              </div>
              <button
                type="submit"
                className="group relative overflow-hidden w-full md:w-auto md:max-w-[240px] px-6 py-[14px] font-sans font-extrabold text-[15px] uppercase border-none cursor-pointer tracking-wide mt-2"
              >
                {/* Base background - always visible */}
                <div className="absolute inset-0" style={{ backgroundColor: globalSettings.button_color || "#c2b7a3" }} />
                
                {/* Sliding overlay - left to right on hover, right to left on hover out */}
                <div 
                  className="absolute inset-0 transition-transform duration-[400ms] ease-in-out -translate-x-full group-hover:translate-x-0"
                  style={{ backgroundColor: globalSettings?.button_hover_fill_color || globalSettings.button_color || "#c2b7a3" }}
                />
                
                {/* Text - above overlay */}
                <span
                  className="relative z-10 font-sans font-extrabold text-[15px] uppercase transition-colors duration-[400ms] text-[var(--btn-text)] group-hover:text-[var(--btn-hover-text)]"
                  style={{
                    '--btn-text': globalSettings.button_text_color || "#1a1a1a",
                    '--btn-hover-text': globalSettings?.button_hover_text_color || globalSettings.button_text_color || "#1a1a1a",
                  } as any}
                >
                  JOIN THE COMMUNITY
                </span>
              </button>
            </form>
          </div>

          {/* Links and Logo Column */}
          <div className="flex flex-col w-full grow gap-[50px] pt-[10px]">
            {/* Logo */}
            <div className="flex justify-start md:justify-end w-full">
              {globalSettings.logo && (
                <Image
                  src={`/api/assets/${globalSettings.logo}`}
                  alt={globalSettings.brand_name || "Logo"}
                  width={422}
                  height={60}
                  className="object-contain w-[250px] md:w-[300px] lg:w-[422px] h-auto"
                />
              )}
            </div>

            {/* Links, Line, and Bottom Info */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* Links - Justify Between */}
              <div className="flex flex-wrap justify-between items-center gap-x-[20px] gap-y-[10px] w-full">
                {globalSettings.link_details?.map((link: any, idx: number) => (
                  <Link
                    key={idx}
                    href={link.link_url}
                    className="font-sans text-[14px] font-medium text-[#f9f9f9] no-underline hover:text-white transition-colors tracking-wide"
                  >
                    {link.link_text}
                  </Link>
                ))}
              </div>

              {/* Horizontal Line */}
              <hr className="w-full h-px bg-white/20 border-none m-0" />

              {/* Copyright & Socials */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-0 pt-[5px] w-full">
                {/* Copyright (LEFT) */}
                <div className="font-sans font-bold text-[14px] text-white tracking-wide">
                  ©{year} {globalSettings.brand_name}
                </div>

                {/* Socials (RIGHT) */}
                <div className="flex flex-wrap gap-[16px] items-center justify-end">
                  {socialLinksData.map((social: any) => (
                    <Link
                      key={social.id}
                      href={social.url || "#"}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={`/api/assets/${social.media_logo}`}
                        alt={social.media_name || "Social icon"}
                        width={32}
                        height={32}
                        className="object-contain w-[32px] h-[32px]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    );
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}
