"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { getDirectusImageUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockBlogsProps, BlogItem, BlockButton } from "@/lib/types";

export default function BlockBlogs({
  data,
  globalSettings,
  allCategories,
  allAuthors,
  authorsMapData,
}: BlockBlogsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, selectedAuthor, selectedDate]);

  const rawBlogs: BlogItem[] = useMemo(() => {
    return (
      data.blogs
        ?.map((b: { blogs_id?: BlogItem | string } | BlogItem) =>
          typeof b === "object" && b !== null && "blogs_id" in b
            ? (b.blogs_id as BlogItem)
            : (b as BlogItem)
        )
        .filter((b): b is BlogItem => Boolean(b && typeof b === "object")) || []
    );
  }, [data]);

  const isSingle = rawBlogs.length === 1;

  // Extract unique categories and authors, but prefer the global lists if provided
  const categories = useMemo(() => {
    if (
      allCategories &&
      allCategories.length > 0 &&
      !allCategories[0].startsWith("Error:")
    )
      return allCategories;
    const cats = rawBlogs.flatMap((b: BlogItem) => ((b as unknown as Record<string, unknown>).categories as string[]) || []);
    const unique = Array.from(new Set(cats)).filter(Boolean);
    return unique.length > 0 ? unique : ["Test Category"];
  }, [rawBlogs, allCategories]);

  const authors = useMemo(() => {
    if (allAuthors && allAuthors.length > 0) return allAuthors;
    const auths = rawBlogs.flatMap((b: BlogItem) => {
      const bObj = b as unknown as Record<string, unknown>;
      if (bObj.authors && Array.isArray(bObj.authors)) {
        return bObj.authors.map((a: unknown) => {
          if (a && typeof a === "object") {
            const aObj = a as Record<string, unknown>;
            if (aObj.name) return aObj.name as string;
            if (
              aObj.authors_id &&
              typeof aObj.authors_id === "object" &&
              (aObj.authors_id as Record<string, unknown>).name
            )
              return (aObj.authors_id as Record<string, unknown>).name as string;
            if (aObj.id && authorsMapData) {
              const found = authorsMapData.find((mapA) => mapA.id === aObj.id);
              if (found) return found.name;
            }
          }
          if (typeof a === "string") {
            const found = authorsMapData?.find((mapA) => mapA.id === a);
            return found ? found.name : a;
          }
          return "Unknown Author Structure";
        });
      }
      return (bObj.author as { name?: string } | undefined)?.name || null;
    });
    return Array.from(new Set(auths)).filter(Boolean);
  }, [rawBlogs, allAuthors, authorsMapData]);

  const filteredBlogs = useMemo(() => {
    let list = [...rawBlogs];

    // Filter by Category
    if (selectedCategory) {
      list = list.filter((b: BlogItem) => {
        const cats = (b as unknown as Record<string, unknown>).categories;
        return Array.isArray(cats) && cats.includes(selectedCategory);
      });
    }

    // Filter by Author
    if (selectedAuthor) {
      list = list.filter((b: BlogItem) => {
        const bObj = b as unknown as Record<string, unknown>;
        if (bObj.authors && Array.isArray(bObj.authors)) {
          return bObj.authors.some((a: unknown) => {
            if (a && typeof a === "object") {
              const aObj = a as Record<string, unknown>;
              if (aObj.name === selectedAuthor) return true;
              if (aObj.authors_id && typeof aObj.authors_id === "object" && (aObj.authors_id as Record<string, unknown>).name === selectedAuthor) return true;
              if (aObj.id && authorsMapData) {
                const found = authorsMapData.find((mapA) => mapA.id === aObj.id);
                if (found && found.name === selectedAuthor) return true;
              }
            }
            if (typeof a === "string") {
              const found = authorsMapData?.find((mapA) => mapA.id === a);
              if (found && found.name === selectedAuthor) return true;
              if (a === selectedAuthor) return true;
            }
            return false;
          });
        }
        return false;
      });
    }

    // Sort by Date (only if explicitly selected by the user)
    if (selectedDate === "oldest") {
      list.sort((a, b) => {
        const da = a.date_created ? new Date(a.date_created).getTime() : 0;
        const db = b.date_created ? new Date(b.date_created).getTime() : 0;
        return da - db;
      });
    } else if (selectedDate === "latest") {
      list.sort((a, b) => {
        const da = a.date_created ? new Date(a.date_created).getTime() : 0;
        const db = b.date_created ? new Date(b.date_created).getTime() : 0;
        return db - da;
      });
    }

    return list;
  }, [rawBlogs, selectedCategory, selectedAuthor, selectedDate, authorsMapData]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  // Helper to format raw strings like "daily_devotionals" into "Daily Devotionals"
  const formatLabel = (val: string) => {
    if (!val) return "";
    if (val.includes("_")) {
      return val
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return val;
  };

  const { title, background_color, blogs, buttons } = data;

  // Background Color
  const bgColor = background_color || globalSettings?.bg_color || "#ffffff";
  const titleSize = globalSettings?.global_title_size || 48;

  const getSnippet = (html: unknown) => {
    if (!html) return "";

    let parsed = html;
    if (typeof html === "string") {
      try {
        parsed = JSON.parse(html);
      } catch (e) {
        // Not JSON, treat as raw HTML string
        const text = html
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim();
        return text.length > 150 ? text.slice(0, 150) + "..." : text;
      }
    }

    // Handle parsed JSON blocks (Directus Editor)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed) &&
      "blocks" in parsed &&
      Array.isArray((parsed as { blocks: unknown[] }).blocks)
    ) {
      const blocks = (parsed as { blocks: Array<{ type?: string; data?: { text?: string } }> }).blocks;
      const textBlocks = blocks.filter(
        (b) => b.type === "paragraph" || b.type === "header",
      );
      const texts = textBlocks.map((b) => b.data?.text || "").join(" ");
      const text = texts
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      return text.length > 150 ? text.slice(0, 150) + "..." : text;
    }

    // Handle Array of { content } (Directus Repeater)
    if (Array.isArray(parsed)) {
      const texts = parsed.map((p: { content?: string }) => p.content || "").join(" ");
      const text = texts
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      return text.length > 150 ? text.slice(0, 150) + "..." : text;
    }

    // Fallback if it's a string
    if (typeof html === "string") {
      const text = html
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      return text.length > 150 ? text.slice(0, 150) + "..." : text;
    }

    return "";
  };

  const renderBlogCard = (blog: BlogItem, index: number) => (
    <motion.div
      key={blog.id || `blog-${index}`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{
        opacity: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.4, ease: "easeOut" },
        y: { duration: 0.4, ease: "easeOut" },
      }}
      className="flex flex-col w-full group"
    >
      {blog.photo && (
        <Link
          href={blog.slug_button_url || "#"}
          className="w-full aspect-4/3 relative mb-6 overflow-hidden bg-gray-200 block"
        >
          <Image
            src={getDirectusImageUrl(blog.photo)}
            alt="Blog image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 items-center text-center gap-3.5">
        {blog.main_title && (
          <div
            className="prose max-w-none prose-headings:font-title prose-headings:font-bold prose-headings:uppercase prose-headings:text-[20px] prose-headings:leading-6 prose-p:font-title prose-p:font-bold prose-p:uppercase prose-p:text-[20px] prose-p:leading-6 prose-headings:m-0 prose-p:m-0 prose-strong:font-black font-bold"
            style={
              {
                color:
                  bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                    ? "#fff"
                    : "#1a1a1a",
                "--tw-prose-headings":
                  bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                    ? "#fff"
                    : "#1a1a1a",
                "--tw-prose-bold":
                  bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                    ? "#fff"
                    : "#1a1a1a",
                "--tw-prose-body":
                  bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                    ? "#fff"
                    : "#1a1a1a",
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: blog.main_title }}
          />
        )}

        <p
          className="text-[16px] leading-5 w-full px-4"
          style={{
            color:
              bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                ? "#e5e5e5"
                : "#555",
          }}
        >
          {getSnippet(blog.blog_details)}
        </p>

        <div className="mt-auto">
          <Link
            href={blog.slug_button_url || "#"}
            className="font-title font-black uppercase tracking-widest text-[16px] leading-5 hover:opacity-70 transition-opacity flex items-center gap-2.5 no-underline"
            style={{
              color:
                bgColor === "#1A1A1A" || bgColor === "#000000" || bgColor === "#151515"
                  ? "#fff"
                  : "#1a1a1a",
            }}
          >
            {blog.slug_button_text || "READ MORE"}
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
  );

  return (
    <div
      className="w-full py-15 md:py-25 px-4 md:px-13.75"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-360 mx-auto flex flex-col items-center">
        {/* Main Block Title */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex justify-center mb-10 md:mb-16"
          >
            <div
              className="
                prose max-w-none text-center
                prose-p:m-0 prose-p:leading-[1.1]
                prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide
                prose-headings:font-light prose-headings:m-0 
                prose-strong:font-black prose-strong:font-title
                font-title font-light uppercase tracking-wide
              "
              style={
                {
                  fontSize: titleSize
                    ? `clamp(${Math.round(titleSize * 0.35)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                    : undefined,
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
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </motion.div>
        )}

        {/* SINGLE BLOG LAYOUT */}
        {isSingle && rawBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 max-w-6xl"
          >
            {/* Left Column (Image & Filters) */}
            <div className="flex flex-col w-full">
              {rawBlogs[0].photo && (
                <div className="w-full aspect-4/3 relative mb-6 overflow-hidden bg-gray-200">
                  <Image
                    src={getDirectusImageUrl(rawBlogs[0].photo)}
                    alt="Featured Blog"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              {/* Frontend Filter UI */}
              <div className="w-full flex flex-col lg:flex-row lg:flex-wrap items-center gap-6 sm:gap-8 mt-8 mb-8 px-4">
                <div className="flex flex-row items-center justify-start box-border px-5 py-2.5 gap-2.5 w-full sm:w-100 h-10 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A]">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/filter.svg"
                      width={20}
                      height={20}
                      alt="Filter"
                      className="shrink-0"
                    />
                    <span className="font-bold uppercase text-[12px] leading-[1.2] tracking-widest text-left whitespace-nowrap text-slate-500">
                      FILTER BY
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer hover:opacity-80 transition-opacity font-medium text-[14px]">
                      <span>Select...</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56 bg-white border border-gray-200">
                      <DropdownMenuGroup>
                        <div className="flex items-center justify-between pr-4">
                          <DropdownMenuLabel>Filter Blogs</DropdownMenuLabel>
                          <button
                            onClick={() => {
                              setSelectedCategory("");
                              setSelectedAuthor("");
                              setSelectedDate("");
                            }}
                            className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 outline-none"
                          >
                            Clear
                          </button>
                        </div>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Category</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-white border border-gray-200">
                            <DropdownMenuItem
                              onClick={() => setSelectedCategory("")}
                              className="flex flex-row items-center justify-between w-full cursor-pointer"
                            >
                              <span>All Categories</span>
                              {selectedCategory === "" && (
                                <span className="text-sm text-blue-600 font-bold ml-2">
                                  ✓
                                </span>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categories.length === 0 ? (
                              <DropdownMenuItem
                                disabled
                                className="text-gray-400 italic"
                              >
                                No Categories Found
                              </DropdownMenuItem>
                            ) : (
                              categories.map((c: string, i: number) => (
                                <DropdownMenuItem
                                  key={i}
                                  onClick={() => setSelectedCategory(c)}
                                  className="flex flex-row items-center justify-between w-full cursor-pointer"
                                >
                                  <span>{formatLabel(c)}</span>
                                  {selectedCategory === c && (
                                    <span className="text-sm text-blue-600 font-bold ml-2">
                                      ✓
                                    </span>
                                  )}
                                </DropdownMenuItem>
                              ))
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Author</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-white border border-gray-200">
                            <DropdownMenuItem
                              onClick={() => setSelectedAuthor("")}
                              className="flex flex-row items-center justify-between w-full cursor-pointer"
                            >
                              <span>All Authors</span>
                              {selectedAuthor === "" && (
                                <span className="text-sm text-blue-600 font-bold ml-2">
                                  ✓
                                </span>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {authors.length === 0 ? (
                              <DropdownMenuItem
                                disabled
                                className="text-gray-400 italic"
                              >
                                No Authors Found
                              </DropdownMenuItem>
                            ) : (
                              authors.map((a: string | null, i: number) => {
                                if (!a) return null;
                                return (
                                <DropdownMenuItem
                                  key={i}
                                  onClick={() => setSelectedAuthor(a)}
                                  className="flex flex-row items-center justify-between w-full cursor-pointer"
                                >
                                  <span>{a}</span>
                                  {selectedAuthor === a && (
                                    <span className="text-sm text-blue-600 font-bold ml-2">
                                      ✓
                                    </span>
                                  )}
                                </DropdownMenuItem>
                              );
                            })
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Date</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-white border border-gray-200">
                            <DropdownMenuItem
                              onClick={() => setSelectedDate("")}
                              className="flex flex-row items-center justify-between w-full cursor-pointer"
                            >
                              <span>All Dates</span>
                              {selectedDate === "" && (
                                <span className="text-sm text-blue-600 font-bold ml-2">
                                  ✓
                                </span>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedDate("latest")}
                              className="flex flex-row items-center justify-between w-full cursor-pointer"
                            >
                              <span>Latest</span>
                              {selectedDate === "latest" && (
                                <span className="text-sm text-blue-600 font-bold ml-2">
                                  ✓
                                </span>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedDate("oldest")}
                              className="flex flex-row items-center justify-between w-full cursor-pointer"
                            >
                              <span>Oldest</span>
                              {selectedDate === "oldest" && (
                                <span className="text-sm text-blue-600 font-bold ml-2">
                                  ✓
                                </span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Show Active Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedCategory && (
                    <div className="flex items-center gap-2 bg-[#E5E5E5] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedAuthor && (
                    <div className="flex items-center gap-2 bg-[#E5E5E5] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span>{selectedAuthor}</span>
                      <button
                        onClick={() => setSelectedAuthor("")}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex items-center gap-2 bg-[#E5E5E5] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span>Date: {selectedDate}</span>
                      <button
                        onClick={() => setSelectedDate("")}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Content) */}
            <div className="flex flex-col justify-center w-full">
              {rawBlogs[0].main_title && (
                <div
                  className="prose max-w-none prose-headings:font-title prose-headings:font-bold prose-headings:uppercase prose-headings:text-[24px] md:prose-headings:text-[32px] prose-p:font-title prose-p:font-bold prose-p:uppercase prose-p:text-[24px] md:prose-p:text-[32px] prose-headings:m-0 prose-p:m-0 prose-strong:font-black mb-6 font-bold"
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
                  dangerouslySetInnerHTML={{ __html: rawBlogs[0].main_title }}
                />
              )}

              {/* Render ONLY the first Blog Detail */}
              {(() => {
                let parsedDetails = rawBlogs[0].blog_details;
                if (typeof parsedDetails === "string") {
                  try {
                    parsedDetails = JSON.parse(parsedDetails);
                  } catch (e) {}
                }
                if (
                  parsedDetails &&
                  Array.isArray(parsedDetails) &&
                  parsedDetails.length > 0
                ) {
                  return (
                    <div className="flex flex-col gap-4 mb-8">
                      <div className="flex flex-col gap-2">
                        {parsedDetails[0].title && (
                          <div
                            className="prose max-w-none prose-p:font-bold text-[#555]"
                            style={
                              {
                                color:
                                  bgColor === "#1A1A1A" ||
                                  bgColor === "#000000" ||
                                  bgColor === "#151515"
                                    ? "#e5e5e5"
                                    : "#555",
                                "--tw-prose-body":
                                  bgColor === "#1A1A1A" ||
                                  bgColor === "#000000" ||
                                  bgColor === "#151515"
                                    ? "#e5e5e5"
                                    : "#555",
                              } as React.CSSProperties
                            }
                            dangerouslySetInnerHTML={{
                              __html: parsedDetails[0].title,
                            }}
                          />
                        )}
                        {parsedDetails[0].content && (
                          <div
                            className="prose max-w-none text-[#555] prose-p:leading-relaxed"
                            style={
                              {
                                color:
                                  bgColor === "#1A1A1A" ||
                                  bgColor === "#000000" ||
                                  bgColor === "#151515"
                                    ? "#e5e5e5"
                                    : "#555",
                                "--tw-prose-body":
                                  bgColor === "#1A1A1A" ||
                                  bgColor === "#000000" ||
                                  bgColor === "#151515"
                                    ? "#e5e5e5"
                                    : "#555",
                              } as React.CSSProperties
                            }
                            dangerouslySetInnerHTML={{
                              __html: parsedDetails[0].content,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {rawBlogs[0].slug_button_text && rawBlogs[0].slug_button_url && (
                <Link
                  href={rawBlogs[0].slug_button_url}
                  className="self-start font-title font-black uppercase tracking-widest text-[13px] hover:opacity-70 transition-opacity pb-1 flex items-center gap-2 no-underline"
                  style={{
                    color:
                      bgColor === "#1A1A1A" ||
                      bgColor === "#000000" ||
                      bgColor === "#151515"
                        ? "#fff"
                        : "#1a1a1a",
                  }}
                >
                  {rawBlogs[0].slug_button_text}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* MULTI BLOG LAYOUT */}
        {!isSingle && rawBlogs.length > 0 && (
          <div className="w-full flex flex-col items-center max-w-7xl">
            {/* First 6 Blogs */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredBlogs.slice(0, 6).map((blog: BlogItem, index: number) => renderBlogCard(blog, index))}
            </div>

            {/* Extra Blogs (Expandable Height) */}
            <div 
              className="w-full grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: visibleCount > 6 ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden w-full">
                {filteredBlogs.length > 6 && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-16">
                    <AnimatePresence>
                      {filteredBlogs.slice(6, visibleCount).map((blog: BlogItem, idx: number) => renderBlogCard(blog, idx + 6))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Block Action Buttons (Load More) */}
            {buttons && buttons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
                  y: { duration: 0.8, delay: 0.3, ease: "easeOut" },
                  layout: { duration: 0.5, ease: "easeOut" }
                }}
                className="mt-16 w-full flex justify-center items-center flex-wrap gap-4"
              >
                {buttons.map((btn: { buttons_id?: BlockButton | number } | BlockButton, idx: number) => {
                  const b = (typeof btn === "object" && btn !== null && "buttons_id" in btn && typeof btn.buttons_id === "object" ? btn.buttons_id : btn) as BlockButton;
                  if (!b || typeof b !== "object") return null;

                  // If it's a more_less button or action button without a URL
                  if (b.type === "more_less" || !b.button_url || b.button_url === "" || b.button_url === "#") {
                    const isViewLess = b.button_text?.toLowerCase().includes("less");
                    
                    if (isViewLess) {
                      if (visibleCount <= 6) return null; // Hide View Less if at initial state
                      return (
                        <DynamicButton
                          key={idx}
                          btn={b}
                          fallbackFill="transparent"
                          fallbackText="#1a1a1a"
                          onClick={() => setVisibleCount(6)}
                          globalSettings={globalSettings}
                        />
                      );
                    } else {
                      // Load More
                      if (visibleCount >= filteredBlogs.length) return null; // Hide Load More if no more blogs
                      return (
                        <DynamicButton
                          key={idx}
                          btn={b}
                          fallbackFill="transparent"
                          fallbackText="#1a1a1a"
                          onClick={() => setVisibleCount((prev) => prev + 6)}
                          globalSettings={globalSettings}
                        />
                      );
                    }
                  }

                  return (
                    <DynamicButton 
                      key={idx} 
                      btn={b} 
                      globalSettings={globalSettings} 
                    />
                  );
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
