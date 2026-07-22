"use client";

import Image from "next/image";
import HoverButton from "@/components/HoverButton/HoverButton";
import { DynamicButtonProps, BlockButton } from "@/lib/types";

export default function DynamicButton({
  btn,
  globalSettings,
  className = "",
  defaultPadding = "px-6 md:px-8 py-2 md:py-3",
  fallbackFill,
  fallbackText,
  type,
  onClick,
  disabled,
}: DynamicButtonProps) {
  if (!btn) return null;

  const btnObj = (
    typeof btn === "object" && btn !== null && "buttons_id" in btn && typeof btn.buttons_id === "object"
      ? btn.buttons_id
      : btn
  ) as BlockButton | Record<string, unknown>;

  const text = btnObj?.button_text as string | undefined;
  const url = btnObj?.button_url as string | undefined;

  // Resolve type from explicit prop or Directus 'type' field
  const btnType: "submit" | "button" | "reset" | undefined =
    type ||
    (btnObj?.type === "submit"
      ? "submit"
      : btnObj?.type === "more_less"
        ? "button"
        : btnObj?.type === "navigation" && !url
          ? "button"
          : undefined);

  if (!text || (!url && !btnType && !onClick)) return null;

  const buttonColor = fallbackFill || globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = fallbackText || globalSettings?.button_text_color || "#1a1a1a";
  const globalHoverFill = globalSettings?.button_hover_fill_color;
  const globalHoverText = globalSettings?.button_hover_text_color;

  const fill = (btnObj?.button_fill_color as string | undefined) || buttonColor;
  const color = (btnObj?.button_text_color as string | undefined) || buttonTextColor;
  const hFill = (btnObj?.button_hover_fill_color as string | undefined) || globalHoverFill;
  const hText = (btnObj?.button_hover_text_color as string | undefined) || globalHoverText;
  const borderCol = btnObj?.button_border_color as string | undefined;

  const logoId =
    typeof btnObj?.logo === "object" && btnObj?.logo !== null
      ? (btnObj.logo as { id?: string }).id
      : (btnObj?.logo as string | undefined);
  const hoverLogoId =
    typeof btnObj?.hover_logo === "object" && btnObj?.hover_logo !== null
      ? (btnObj.hover_logo as { id?: string }).id
      : (btnObj?.hover_logo as string | undefined);

  const resolvedHref =
    btnType === "submit" || (btnType === "button" && !url)
      ? undefined
      : url;

  return (
    <HoverButton
      href={resolvedHref}
      type={btnType}
      disabled={disabled}
      onClick={onClick}
      className={`group inline-flex justify-center items-center font-sans font-extrabold text-[14px] md:text-[16px] uppercase no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg gap-2 ${defaultPadding} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{
        backgroundColor: fill,
        color: color,
        ...(borderCol ? { border: `1px solid ${borderCol}` } : {}),
      }}
      hoverFill={hFill}
      hoverText={hText}
    >
      {logoId && (
        <Image
          src={`/api/assets/${logoId}`}
          alt="Button icon"
          width={20}
          height={20}
          className={`w-5 h-5 object-contain ${hoverLogoId ? "group-hover:hidden" : ""}`}
        />
      )}
      {hoverLogoId && (
        <Image
          src={`/api/assets/${hoverLogoId}`}
          alt="Button icon hover"
          width={20}
          height={20}
          className="w-5 h-5 object-contain hidden group-hover:block"
        />
      )}
      {text}
    </HoverButton>
  );
}
