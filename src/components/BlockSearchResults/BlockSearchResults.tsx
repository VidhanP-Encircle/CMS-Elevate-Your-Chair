"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RichText from "@/components/RichText/RichText";
import { getDirectusImageUrl } from "@/lib/utils";
import { BlockSearchResultsProps, BlogItem } from "@/lib/types";

export default function BlockSearchResults({
  data,
  globalSettings,
  allBlogs,
}: BlockSearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const hasReadUrl = useRef(false);

  // Read ?q= URL param on mount (from navigation search redirect)
  useEffect(() => {
    if (!hasReadUrl.current && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setSearchQuery(q);
      }
      hasReadUrl.current = true;
    }
  }, []); // Runs once on mount

  // Sync URL with search query (for shareable/bookmarkable URLs)
  useEffect(() => {
    if (!hasReadUrl.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const currentQ = params.get("q") || "";
    if (searchQuery.trim() !== currentQ) {
      const newUrl = searchQuery.trim()
        ? `${window.location.pathname}?q=${encodeURIComponent(searchQuery.trim())}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchQuery]);

  const bgColor = globalSettings?.bg_color || "#ffffff";
  const titleSize = globalSettings?.global_title_size || 48;

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return (allBlogs || []).filter((blog: BlogItem) => {
      // Search in title
      if (blog.main_title) {
        const titleText = blog.main_title.replace(/<[^>]+>/g, "").toLowerCase();
        if (titleText.includes(query)) return true;
      }

      // Search in blog details (excerpt/content)
      if (blog.blog_details && Array.isArray(blog.blog_details)) {
        for (const detail of blog.blog_details) {
          if (detail.title) {
            const detailTitle = detail.title
              .replace(/<[^>]+>/g, "")
              .toLowerCase();
            if (detailTitle.includes(query)) return true;
          }
          if (detail.content) {
            const detailContent = detail.content
              .replace(/<[^>]+>/g, "")
              .toLowerCase();
            if (detailContent.includes(query)) return true;
          }
        }
      }

      return false;
    });
  }, [searchQuery, allBlogs]);

  // Limit results per page
  const resultsPerPage = data.results_per_page ?? 12;
  const visibleResults = useMemo(
    () => filteredBlogs.slice(0, resultsPerPage),
    [filteredBlogs, resultsPerPage],
  );

  const getSnippet = useCallback((blog: BlogItem) => {
    if (!blog.blog_details || !Array.isArray(blog.blog_details)) return "";

    const texts = blog.blog_details
      .map((d) => {
        const content = d.content || "";
        const text = content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
        return text;
      })
      .filter(Boolean);

    const fullText = texts.join(" ");
    return fullText.length > 150 ? fullText.slice(0, 150) + "..." : fullText;
  }, []);

  return (
    <div
      className="w-full py-15 md:py-25 px-4 md:px-13.75"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-360 mx-auto flex flex-col">
        {/* Search Input Row */}
        <div className="w-full flex justify-end mb-10 md:mb-16">
          <div className="relative w-full max-w-md">
            {/* Search Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={data.search_placeholder || "Search..."}
              className="w-full h-12 pl-11 pr-4 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-[15px] font-sans font-medium placeholder:text-[#888888] outline-none transition-colors focus:border-[#c2b7a3]"
            />
            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#1a1a1a] transition-colors"
                aria-label="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results Count (only when there are results) */}
        {searchQuery.trim() && filteredBlogs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[14px] font-sans font-medium text-[#888888] mb-8"
          >
            {`${filteredBlogs.length} result${
              filteredBlogs.length !== 1 ? "s" : ""
            } found`}
          </motion.p>
        )}

        {/* No Results State */}
        {searchQuery.trim() && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center py-16"
          >
            {data.no_results_title && (
              <RichText
                variant="title"
                theme="custom"
                align="center"
                content={data.no_results_title}
                className="prose-headings:font-title prose-headings:font-bold prose-headings:uppercase prose-headings:text-[24px] prose-p:font-title prose-p:font-bold prose-p:uppercase prose-p:text-[24px] prose-headings:m-0 prose-p:m-0 prose-strong:font-black font-bold m-0"
                style={
                  {
                    color:
                      bgColor === "#1A1A1A" ||
                      bgColor === "#000000" ||
                      bgColor === "#151515"
                        ? "#fff"
                        : "#1a1a1a",
                    "--tw-prose-headings":
                      bgColor === "#1A1A1A" ||
                      bgColor === "#000000" ||
                      bgColor === "#151515"
                        ? "#fff"
                        : "#1a1a1a",
                    "--tw-prose-bold":
                      bgColor === "#1A1A1A" ||
                      bgColor === "#000000" ||
                      bgColor === "#151515"
                        ? "#fff"
                        : "#1a1a1a",
                    "--tw-prose-body":
                      bgColor === "#1A1A1A" ||
                      bgColor === "#000000" ||
                      bgColor === "#151515"
                        ? "#fff"
                        : "#1a1a1a",
                  } as React.CSSProperties
                }
              />
            )}
            {data.no_results_description && (
              <div className="mt-3">
                <RichText
                  variant="content"
                  theme="custom"
                  align="center"
                  content={data.no_results_description}
                  className="prose-p:font-sans prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-[#555555] m-0"
                  style={
                    {
                      color: "#555555",
                      "--tw-prose-body": "#555555",
                    } as React.CSSProperties
                  }
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Search Results Grid */}
        {searchQuery.trim() && filteredBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {visibleResults.map((blog: BlogItem, index: number) => (
                <motion.div
                  key={blog.id || `search-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    opacity: { duration: 0.4, ease: "easeOut" },
                    scale: { duration: 0.4, ease: "easeOut" },
                    y: { duration: 0.4, ease: "easeOut" },
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className="flex flex-col w-full group"
                >
                  {blog.photo && (
                    <Link
                      href={blog.slug_button_url || "#"}
                      className="w-full aspect-4/3 relative mb-6 overflow-hidden bg-gray-200 block"
                    >
                      <Image
                        src={getDirectusImageUrl(blog.photo, {
                          width: 600,
                          quality: 80,
                          format: "webp",
                        })}
                        alt="Blog image"
                        fill
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>
                  )}

                  <div className="flex flex-col flex-1 items-center text-center gap-3.5">
                    {blog.main_title && (
                      <RichText
                        variant="title"
                        align="center"
                        theme="custom"
                        content={blog.main_title}
                        className="prose-headings:font-title prose-headings:font-bold prose-headings:uppercase prose-headings:text-[20px] prose-headings:leading-6 prose-p:font-title prose-p:font-bold prose-p:uppercase prose-p:text-[20px] prose-p:leading-6 prose-headings:m-0 prose-p:m-0 prose-strong:font-black font-bold m-0"
                        style={
                          {
                            color:
                              bgColor === "#1A1A1A" ||
                              bgColor === "#000000" ||
                              bgColor === "#151515"
                                ? "#fff"
                                : "#1a1a1a",
                            "--tw-prose-headings":
                              bgColor === "#1A1A1A" ||
                              bgColor === "#000000" ||
                              bgColor === "#151515"
                                ? "#fff"
                                : "#1a1a1a",
                            "--tw-prose-bold":
                              bgColor === "#1A1A1A" ||
                              bgColor === "#000000" ||
                              bgColor === "#151515"
                                ? "#fff"
                                : "#1a1a1a",
                            "--tw-prose-body":
                              bgColor === "#1A1A1A" ||
                              bgColor === "#000000" ||
                              bgColor === "#151515"
                                ? "#fff"
                                : "#1a1a1a",
                          } as React.CSSProperties
                        }
                      />
                    )}

                    <p
                      className="text-[16px] leading-5 w-full px-4"
                      style={{
                        color:
                          bgColor === "#1A1A1A" ||
                          bgColor === "#000000" ||
                          bgColor === "#151515"
                            ? "#e5e5e5"
                            : "#555",
                      }}
                    >
                      {getSnippet(blog)}
                    </p>

                    <div className="mt-auto">
                      <Link
                        href={blog.slug_button_url || "#"}
                        className="font-title font-black uppercase tracking-widest text-[16px] leading-5 hover:opacity-70 transition-opacity flex items-center gap-2.5 no-underline"
                        style={{
                          color:
                            bgColor === "#1A1A1A" ||
                            bgColor === "#000000" ||
                            bgColor === "#151515"
                              ? "#fff"
                              : "#1a1a1a",
                        }}
                      >
                        {blog.slug_button_text || "Read More"}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Initial State (no search query yet) */}
        {!searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center text-center py-16"
          >
            <p className="text-[16px] font-sans font-medium text-[#888888]">
              Type above to search
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
