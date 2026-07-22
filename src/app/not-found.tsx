import { getDirectus } from "@/lib/directus";
import { readSingleton } from "@directus/sdk";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlobalSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  let settings: (GlobalSettings & { not_found_title?: string; not_found_subtitle?: string }) | undefined = undefined;

  try {
    const directus = await getDirectus();
    settings = (await directus.request(readSingleton("global_settings" as never))) as unknown as (GlobalSettings & { not_found_title?: string; not_found_subtitle?: string });
  } catch (e) {
    console.error("Failed to fetch global settings for 404 page", e);
  }

  const title = settings?.not_found_title || "404 ERROR";
  const subtitle = settings?.not_found_subtitle || "PAGE NOT FOUND";
  const imageId = settings?.not_found_image;

  const bgColor = settings?.bg_color || "#ffffff";
  const textColor = settings?.text_color || "#1a1a1a";
  const buttonHoverFill = settings?.button_hover_fill_color || textColor;
  const buttonHoverText = settings?.button_hover_text_color || bgColor;

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-80px)] w-full px-6 md:px-12 lg:px-24 py-16 gap-10 md:gap-20"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0 z-10">
        <h1
          className="font-title font-black text-4xl md:text-[3rem] lg:text-[4rem] tracking-wide mb-2 uppercase"
          style={{ color: textColor, lineHeight: 1.1 }}
        >
          {title}
        </h1>
        <h2
          className="font-title font-light text-2xl md:text-[2rem] lg:text-[2.5rem] tracking-wide uppercase"
          style={{ color: textColor, opacity: 0.8, lineHeight: 1.2 }}
        >
          {subtitle}
        </h2>
      </div>

      {imageId && (
        <div className="relative w-full max-w-75 md:max-w-112.5 lg:max-w-150 aspect-square flex justify-center items-center">
          <Image
            src={`/api/assets/${imageId}`}
            alt="404 Not Found"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        </div>
      )}
    </div>
  );
}
