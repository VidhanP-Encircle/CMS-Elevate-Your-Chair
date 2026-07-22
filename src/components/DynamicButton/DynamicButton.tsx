"use client";

import Image from "next/image";
import HoverButton from "@/components/HoverButton/HoverButton";
import { DynamicButtonProps } from "@/lib/types";

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

  const text = btn?.button_text;
  const url = btn?.button_url;

  // Resolve type from explicit prop or Directus 'type' field
  const btnType =
    type ||
    (btn?.type === "submit"
      ? "submit"
      : btn?.type === "more_less"
        ? "button"
        : btn?.type === "navigation" && !url
          ? "button"
          : undefined);

  if (!text || (!url && !btnType && !onClick)) return null;

  const buttonColor = fallbackFill || globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = fallbackText || globalSettings?.button_text_color || "#1a1a1a";
  const globalHoverFill = globalSettings?.button_hover_fill_color;
  const globalHoverText = globalSettings?.button_hover_text_color;

  const fill = btn?.button_fill_color || buttonColor;
  const color = btn?.button_text_color || buttonTextColor;
  const hFill = btn?.button_hover_fill_color || globalHoverFill;
  const hText = btn?.button_hover_text_color || globalHoverText;
  const borderCol = btn?.button_border_color;

  const logoId =
    typeof btn?.logo === "object" && btn?.logo !== null
      ? btn.logo.id
      : btn?.logo;
  const hoverLogoId =
    typeof btn?.hover_logo === "object" && btn?.hover_logo !== null
      ? btn.hover_logo.id
      : btn?.hover_logo;

  const resolvedHref =
    btnType === "submit" || (btnType === "button" && !url)
      ? undefined
      : url;

  return (
    <HoverButton
      href={resolvedHref}
      type={btnType as any}
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
