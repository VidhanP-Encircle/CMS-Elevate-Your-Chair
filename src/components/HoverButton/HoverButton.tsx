"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HoverButtonProps {
  href?: string;
  type?: "submit" | "button" | "reset";
  className?: string;
  style?: React.CSSProperties;
  hoverFill?: string | null;
  hoverText?: string | null;
  children: ReactNode;
  onClick?: () => void;
  target?: string;
  [key: string]: any;
}

export default function HoverButton({
  href,
  type,
  className = "",
  style = {},
  hoverFill,
  hoverText,
  children,
  onClick,
  target,
  ...props
}: HoverButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const originalBg = (style.backgroundColor as string) || "transparent";
  const originalColor = (style.color as string) || "inherit";

  const resolvedHoverFill = hoverFill || originalBg;
  const resolvedHoverText = hoverText || originalColor;

  // Strip `color` from the spread style so Tailwind classes can handle it
  const { color: _unusedColor, ...cleanStyle } = style;

  // Tailwind applies hover:text-[var(--btn-hover-text)] via :hover pseudo-class
  // This avoids inline style conflicts and works with the CSS transition
  // Note: transition for the sliding overlay is handled by framer-motion.
  // Text color transition is instant via CSS :hover (Tailwind hover:text-[...]).
  // Transform/translate transitions come from the parent's className.
  // Place the dynamic text classes AFTER the parent's className so they take precedence.
  const combinedClassName = `${className} relative overflow-hidden text-[var(--btn-text)] hover:text-[var(--btn-hover-text)]`;

  const handleMouseEnter = (e: any) => {
    setIsHovered(true);
    props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: any) => {
    setIsHovered(false);
    props.onMouseLeave?.(e);
  };

  const content = (
    <>
      {children}
      {/* Overlay AFTER children, with -z-10 so it paints behind them */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-1"
        style={{ backgroundColor: resolvedHoverFill }}
        animate={{ x: isHovered ? 0 : "-100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </>
  );

  const sharedStyle = {
    ...cleanStyle,
    "--btn-text": originalColor,
    "--btn-hover-text": resolvedHoverText,
  } as any;

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        style={sharedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        target={target}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      style={sharedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
