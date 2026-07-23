import { getDirectus } from "@/lib/directus";
import Link from "next/link";
import Image from "next/image";
import FooterSubscribeForm from "@/components/Footer/FooterSubscribeForm";
import {
  FooterProps,
  BlockButton,
  SocialLink,
  FormField,
  Form,
} from "@/lib/types";
import { readItems } from "@directus/sdk";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import AnimatedImageGrid from "./AnimatedImageGrid";
import RichText from "@/components/RichText/RichText";

export default async function Footer({ globalSettings }: FooterProps) {
  let socialLinksData: SocialLink[] = [];
  let footerImagesData: any[] = [];
  let subscribeForm: Form | null = null;
  let subscribeFields: FormField[] = [];

  try {
    const directus = await getDirectus();

    // Fetch social links — isolated try/catch
    try {
      socialLinksData = (await directus.request(
        readItems("social_links"),
      )) as SocialLink[];
    } catch (e) {
      console.warn("Footer: Could not fetch social_links", e);
    }

    // Fetch footer images — isolated try/catch
    try {
      footerImagesData = (await directus.request(
        readItems("footer_images"),
      )) as SocialLink[];
    } catch (e) {
      console.warn("Footer: Could not fetch footer_images", e);
    }

    // Resolve dynamic footer form from globalSettings.footer_form
    const footerFormSetting = globalSettings?.footer_form;

    try {
      if (typeof footerFormSetting === "object" && footerFormSetting !== null) {
        subscribeForm = footerFormSetting as Form;
      } else if (typeof footerFormSetting === "string" && footerFormSetting) {
        const forms = (await directus.request(
          readItems("form", {
            fields: ["id", "name", "success_message"],
            filter: { id: { _eq: footerFormSetting } },
            limit: 1,
          }),
        )) as Form[];
        subscribeForm = forms?.[0] ?? null;
      }

      // Fallback: If no footer_form selected in globalSettings, fetch default form
      if (!subscribeForm) {
        const forms = (await directus.request(
          readItems("form", {
            fields: ["id", "name", "success_message"],
            limit: 1,
          }),
        )) as Form[];
        subscribeForm = forms?.[0] ?? null;
      }

      // Fetch all form_fields objects dynamically for the resolved form
      if (subscribeForm) {
        try {
          subscribeFields = (await directus.request(
            readItems("form_fields", {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filter: { form_id: { _eq: subscribeForm.id } } as any,
              sort: ["sort"],
            }),
          )) as FormField[];
        } catch (e) {
          console.warn("Footer: Could not fetch form_fields", e);
        }
      }
    } catch (e) {
      console.warn("Footer: Could not resolve form", e);
    }

    const year = new Date().getFullYear();

    const madeByLogoId =
      typeof globalSettings?.made_by_logo === "object" &&
      globalSettings?.made_by_logo !== null
        ? (globalSettings.made_by_logo as { id?: string }).id
        : (globalSettings?.made_by_logo as string | undefined);

    let buttonList: BlockButton[] = [];
    if (Array.isArray(globalSettings.buttons)) {
      buttonList = globalSettings.buttons
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

    const footerBgColor = "#1a1a1a";
    const footerTextColor = "#ffffff";
    const footerLabelSize = globalSettings?.global_label_size || undefined;

    return (
      <footer
        className="w-full flex flex-col items-center overflow-hidden"
        style={{ backgroundColor: footerBgColor }}
      >
        {/* IG Feed section */}
        <ScrollReveal
          className="flex flex-col w-full max-w-378 px-4 md:px-13.75 pt-8 md:pt-13.75 pb-12 box-border"
          delay={0.1}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full">
            {/* Top text row inside grid to align with images */}
            <div
              className="col-span-1 md:col-span-2 flex justify-start items-end font-title font-extrabold uppercase pb-3.75 leading-none tracking-wide"
              style={{
                color: footerTextColor,
                fontSize: footerLabelSize
                  ? `clamp(${Math.round(footerLabelSize * 0.35)}px, ${(footerLabelSize / 12).toFixed(3)}vw, ${footerLabelSize}px)`
                  : "clamp(10px, 2.333vw, 28px)",
              }}
            >
              {globalSettings.label || "FOLLOW US"}
            </div>
            <div
              className="col-span-1 md:col-span-2 flex justify-end items-end font-title font-extrabold uppercase text-[#c2b7a3] pb-3.75 leading-none tracking-wide wrap-break-word text-right"
              style={{
                fontSize: footerLabelSize
                  ? `clamp(${Math.round(footerLabelSize * 0.35)}px, ${(footerLabelSize / 12).toFixed(3)}vw, ${footerLabelSize}px)`
                  : "clamp(10px, 2.333vw, 28px)",
              }}
            >
              {globalSettings.handle_name || ""}
            </div>

            {/* Images */}
            <AnimatedImageGrid images={footerImagesData} />
          </div>
        </ScrollReveal>

        {/* Bottom section */}
        <ScrollReveal
          className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-378 px-4 md:px-13.75 pb-16 gap-12 md:gap-10 lg:gap-25 box-border"
          delay={0.2}
        >
          {/* Newsletter Column */}
          <div className="flex flex-col w-full md:w-75 lg:w-87.5 xl:w-100 shrink-0 gap-7.5">
            <RichText
              content={globalSettings.content}
              className="
                prose-invert
                prose-p:my-0 prose-p:text-[14px] prose-p:leading-[1.4] md:prose-p:leading-5.5 prose-p:text-[#f9f9f9]
                prose-h1:my-0 prose-h1:text-[28px] md:prose-h1:text-[32px] prose-h1:leading-[1.1] prose-h1:uppercase prose-h1:font-black prose-h1:text-white
                prose-h2:text-white prose-h2:font-title prose-h2:mt-4 prose-h2:mb-2
                prose-h3:text-white prose-h3:font-title prose-h3:mt-3 prose-h3:mb-1
                prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#c2b7a3]
                prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
              "
            />
            <FooterSubscribeForm
              formId={subscribeForm?.id ?? ""}
              fields={subscribeFields}
              successMessage={subscribeForm?.success_message}
              buttons={buttonList}
              globalSettings={globalSettings}
            />
          </div>

          {/* Links and Logo Column */}
          <div className="flex flex-col w-full grow gap-12.5 pt-2.5">
            {/* Logo */}
            <div className="flex justify-start md:justify-end w-full">
              {globalSettings.logo && (
                <Image
                  src={`/api/assets/${globalSettings.logo}`}
                  alt={globalSettings.brand_name || "Logo"}
                  width={422}
                  height={60}
                  className="object-contain w-62.5 md:w-75 lg:w-105.5 h-auto"
                />
              )}
            </div>

            {/* Links, Line, and Bottom Info */}
            <div className="flex flex-col w-full gap-6.25">
              {/* Links - Justify Between */}
              <div className="flex flex-wrap justify-between items-center gap-x-5 gap-y-2.5 w-full">
                {globalSettings.link_details?.map(
                  (
                    link: { link_text: string; link_url: string },
                    idx: number,
                  ) => (
                    <Link
                      key={idx}
                      href={link.link_url}
                      className="font-sans text-[14px] font-medium text-[#f9f9f9] no-underline hover:text-white transition-colors tracking-wide"
                    >
                      {link.link_text}
                    </Link>
                  ),
                )}
              </div>

              {/* Horizontal Line */}
              <hr className="w-full h-px bg-white/20 border-none m-0" />

              {/* Copyright, Made By, & Socials */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 pt-1.25 w-full">
                {/* Copyright (LEFT) */}
                <div className="font-sans font-bold text-[14px] text-white tracking-wide">
                  ©{year} {globalSettings.brand_name}
                </div>

                {/* Made By (CENTER HIGHLIGHTED BLOCK) */}
                {(globalSettings?.made_by || madeByLogoId) && (
                  <div className="flex items-center gap-2.5 px-3 py-1 text-white font-sans text-xs uppercase tracking-widest font-normal">
                    {madeByLogoId && (
                      <Image
                        src={`/api/assets/${madeByLogoId}`}
                        alt={globalSettings?.made_by || "Made by logo"}
                        width={20}
                        height={20}
                        className="object-contain w-5 h-5"
                      />
                    )}
                    {globalSettings?.made_by && (
                      <span className="font-sans font-medium text-white tracking-wider">
                        // {globalSettings.made_by}
                      </span>
                    )}
                  </div>
                )}

                {/* Socials (RIGHT) */}
                <div className="flex flex-wrap gap-4 items-center justify-end">
                  {socialLinksData.map((social: SocialLink) => (
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
                        className="object-contain w-8 h-8"
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
    console.error("Footer: Unexpected error in rendering:", error);
    // Minimum viable footer — don't hide entirely
    return (
      <footer
        className="w-full flex flex-col items-center py-8"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="font-sans text-[14px] text-white/60 text-center">
          ©{new Date().getFullYear()} {globalSettings?.brand_name || ""}
        </div>
      </footer>
    );
  }
}
