"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationClientProps, NavigationItem } from "@/lib/types";
import HoverButton from "@/components/HoverButton/HoverButton";

export default function NavigationClient({
  globalSettings,
  navigationData,
}: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest(".search-toggle-btn")) {
          setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navBgScrolled = "#1a1a1a";
  const navDropdownBg = "#f8f8f8";
  const navTextColor = "#ffffff";
  const navTextHover = globalSettings?.button_color || "#c2b7a3";
  const dropdownTextColor = "#1a1a1a";
  const buttonColor = globalSettings?.button_color || "#c2b7a3";
  const buttonTextColor = globalSettings?.button_text_color || "#1a1a1a";

  const shouldBeSolid = isScrolled;

  return (
    <nav
      className="relative w-full transition-colors duration-300"
      style={{
        backgroundColor: shouldBeSolid ? navBgScrolled : "transparent",
      }}
    >
      <div className="flex items-center justify-between gap-5 md:gap-7.5 px-4 md:px-13.75 py-4 md:py-2.5 w-full min-h-20 box-border">
        {/* Hamburger (Mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          className="xl:hidden cursor-pointer flex-none outline-none focus:outline-none"
          style={{ color: navTextColor }}
          aria-label="Menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <div className="flex-none brand-logo">
          {globalSettings.logo ? (
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src={`/api/assets/${globalSettings.logo}`}
                alt={globalSettings.brand_name || "Logo"}
                width={320}
                height={45}
                className="object-contain w-45 md:w-55 lg:w-70 xl:w-[320px] h-auto"
              />
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xl font-bold"
              style={{ color: navTextColor }}
              onClick={() => setIsOpen(false)}
            >
              {globalSettings.brand_name}
            </Link>
          )}
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden xl:flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-3.75 xl:gap-x-10 nav-wrapper">
          {navigationData
            .filter((item: NavigationItem) => item.name?.toLowerCase() !== "search")
            .map((item: NavigationItem) => (
              <Link
                key={item.id}
                href={item.slug || "#"}
                className="flex items-center font-sans font-normal leading-4.5 tracking-wide text-center uppercase no-underline transition-colors whitespace-nowrap"
                style={{ color: navTextColor, fontSize: "clamp(11px, 0.9vw, 12px)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = navTextHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = navTextColor)
                }
              >
                {item.logo ? (
                  <Image
                    src={`/api/assets/${typeof item.logo === "object" && item.logo !== null ? item.logo.id : item.logo}`}
                    alt={item.name || "Icon"}
                    width={20}
                    height={20}
                    className="object-contain w-5 h-5"
                  />
                ) : (
                  item.name
                )}
              </Link>
            ))}
        </div>

        {/* Search */}
        <div className="flex-none flex items-center search">
          {navigationData
            .filter((item: NavigationItem) => item.name?.toLowerCase() === "search")
            .map((searchItem: NavigationItem) => (
              <button
                key={searchItem.id}
                type="button"
                aria-label="search icon"
                className="search-toggle-btn cursor-pointer bg-transparent border-none p-0 outline-none flex items-center"
                style={{ color: navTextColor }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {searchItem.logo ? (
                  <Image
                    src={`/api/assets/${typeof searchItem.logo === "object" && searchItem.logo !== null ? searchItem.logo.id : searchItem.logo}`}
                    alt={searchItem.name || "Search"}
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6"
                  />
                ) : (
                  <span
                    className="font-sans font-normal leading-4.5 tracking-wide uppercase"
                    style={{ color: navTextColor, fontSize: "clamp(11px, 0.9vw, 12px)" }}
                  >
                    {searchItem.name}
                  </span>
                )}
              </button>
            ))}
          {navigationData.filter(
            (item: NavigationItem) => item.name?.toLowerCase() === "search",
          ).length === 0 && (
            <button
              type="button"
              aria-label="search icon"
              className="search-toggle-btn cursor-pointer bg-transparent border-none p-0 outline-none flex items-center"
              style={{ color: navTextColor }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full shadow-lg xl:hidden flex flex-col overflow-hidden"
            style={{ backgroundColor: navDropdownBg }}
          >
            {/* Indented links container with gap */}
            <div className="flex flex-col gap-10 text-left px-8 py-12 md:px-12.5">
              {navigationData
                .filter((item: NavigationItem) => item.name?.toLowerCase() !== "search")
                .map((item: NavigationItem) => {
                  const isActive =
                    pathname === item.slug ||
                    (item.slug === "/" && pathname === "") ||
                    (pathname === "/home" && item.slug === "/");

                  return (
                    <Link
                      key={item.id}
                      href={item.slug || "#"}
                      onClick={() => setIsOpen(false)}
                      className="font-sans font-normal text-[14px] leading-5.5 uppercase no-underline transition-colors"
                      style={{ color: isActive ? navTextHover : dropdownTextColor }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = navTextHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isActive ? navTextHover : dropdownTextColor)
                      }
                    >
                      {item.name}
                    </Link>
                  );
                })}
            </div>

            {/* Solid dark banner at the bottom containing the button */}
            <div className="w-full bg-[#151515] py-8 flex justify-center px-8 md:px-12.5">
              <HoverButton
                href="http://elevate-by-blake-charles-salon.mn.co/plans/1896001"
                target="_blank"
                className="font-bold font-sans text-[14px] leading-5 uppercase px-6 py-3 w-full max-w-75 text-center no-underline transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor,
                }}
                hoverFill={globalSettings?.button_hover_fill_color}
                hoverText={globalSettings?.button_hover_text_color}
                onClick={() => setIsOpen(false)}
              >
                Join Elevate
              </HoverButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search Dropdown below the navigation bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full z-45 bg-[#1a1a1a] py-4 border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 md:px-13.75 w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get("q");
                  if (query) {
                    window.location.href = `/search?q=${encodeURIComponent(query.toString())}`;
                  }
                }}
                className="w-full"
              >
                {/* Input container matching screenshot */}
                <div className="flex items-center bg-white h-11 md:h-12 rounded-none border border-transparent focus-within:border-[#c2b7a3] w-full">
                  {/* Search Icon inside white bar */}
                  <svg
                    className="w-5 h-5 mr-3 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={navTextHover}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  {/* Input field */}
                  <input
                    type="text"
                    name="q"
                    placeholder="Search"
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-[#1a1a1a] font-sans text-[15px] md:text-[16px] placeholder:text-[#999999]"
                  />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
