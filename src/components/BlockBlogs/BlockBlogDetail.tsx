"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { BlockBlogDetailProps, BlogItem, BlockButton } from "@/lib/types";

export default function BlockBlogDetail({
  data,
  globalSettings,
  authorsMapData,
}: BlockBlogDetailProps) {
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

  const blog = rawBlogs[0]; // Assuming this block is for a single blog

  const authors = useMemo(() => {
    if (!blog) return [];
    if (blog.authors && Array.isArray(blog.authors)) {
      return blog.authors.map((a: unknown) => {
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
    const singleAuthor = (blog as unknown as Record<string, unknown>)?.author as { name?: string } | undefined;
    return singleAuthor?.name ? [singleAuthor.name] : [];
  }, [blog, authorsMapData]);

  const blogDetailBtns: BlockButton[] = useMemo(() => {
    if (!data.blog_detail_button) return [];
    const list = Array.isArray(data.blog_detail_button)
      ? data.blog_detail_button
      : [data.blog_detail_button];
    return list.map((item: unknown) =>
      typeof item === "object" && item !== null && "buttons_id" in item && typeof (item as Record<string, unknown>).buttons_id === "object"
        ? ((item as Record<string, unknown>).buttons_id as BlockButton)
        : (item as BlockButton)
    );
  }, [data.blog_detail_button]);

  const formatLabel = (val: unknown): string => {
    let text = "";
    if (Array.isArray(val)) {
      text = val.join(", ");
    } else if (typeof val === "string") {
      text = val;
    } else {
      text = String(val || "");
    }
    return text;
  };

  const textColor = "#1a1a1a";
  const bgColor = "#ffffff";
  const mutedColor = "#555555";

  if (!blog) return null;

  return (
    <div
      className="w-full pt-32 pb-15 md:pt-48 md:pb-25 px-4 md:px-13.75 flex flex-col items-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center">
        {/* Top Bar with "BACK TO BLOG" Button */}
        <div className="w-full flex justify-end mb-8">
          {blogDetailBtns.length > 0 && (() => {
            const btnObj = blogDetailBtns[0];
            return (
              <DynamicButton 
                btn={{
                  ...btnObj,
                  button_text_color: btnObj.button_text_color || textColor,
                  button_fill_color: btnObj.button_fill_color || "transparent",
                  button_border_color: btnObj.button_border_color || textColor,
                  button_hover_fill_color: btnObj.button_hover_fill_color || textColor,
                  button_hover_text_color: btnObj.button_hover_text_color || bgColor,
                }} 
                globalSettings={globalSettings} 
                className="font-bold tracking-widest text-[13px] px-6 py-3 border transition-colors"
              />
            );
          })()}
        </div>

        {/* Featured Image */}
        {blog.photo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-21/9 relative mb-12 overflow-hidden bg-gray-200"
          >
            <Image
              src={`/api/assets/${typeof blog.photo === "object" ? blog.photo.id : blog.photo}`}
              alt={
                blog.main_title
                  ? blog.main_title.replace(/<[^>]+>/g, "")
                  : "Blog Image"
              }
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Blog Title */}
        {blog.main_title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose max-w-none text-center mb-6 
                       prose-headings:font-title prose-headings:font-light prose-headings:uppercase prose-headings:text-[28px] sm:prose-headings:text-[36px] md:prose-headings:text-[48px]
                       prose-p:font-title prose-p:font-light prose-p:uppercase prose-p:text-[28px] sm:prose-p:text-[36px] md:prose-p:text-[48px]
                       prose-headings:m-0 prose-p:m-0 prose-strong:font-black
                       flex flex-col gap-1"
            style={
              {
                color: textColor,
                "--tw-prose-headings": textColor,
                "--tw-prose-bold": textColor,
                "--tw-prose-body": textColor,
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: blog.main_title }}
          />
        )}

        {/* Meta Info: Author, Date, Category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex w-full justify-center mt-6 mb-12">
            <div
              className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-bold uppercase tracking-widest"
              style={{ color: textColor }}
            >
              {authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <Image src="/user.svg" alt="Author" width={16} height={16} />
                  <span>{authors.join(", ")}</span>
                </div>
              )}
              {blog.date_created && (
                <div className="flex items-center gap-2">
                  <Image src="/calendar.svg" alt="Date" width={16} height={16} />
                  <span>
                    {new Date(blog.date_created).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {blog.categories && (
                <div className="flex items-center gap-2">
                  <Image src="/tag.svg" alt="Category" width={16} height={16} />
                  <span>{formatLabel(blog.categories)}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Blog Content Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full flex flex-col gap-8 mb-16 max-w-4xl"
        >
          {(() => {
            let parsedDetails = blog.blog_details;
            if (typeof parsedDetails === "string") {
              try {
                parsedDetails = JSON.parse(parsedDetails);
              } catch {}
            }
            if (parsedDetails && Array.isArray(parsedDetails)) {
              return parsedDetails.map((detail: { title?: string | null; content?: string | null }, i: number) => (
                <div key={i} className="flex flex-col gap-4 text-center">
                  {detail.title && (
                    <div
                      className="prose max-w-none text-center prose-p:font-bold prose-headings:font-bold prose-p:text-[18px] md:prose-p:text-[24px] prose-headings:text-[18px] md:prose-headings:text-[24px]"
                      style={
                        {
                          color: textColor,
                          "--tw-prose-body": textColor,
                          "--tw-prose-headings": textColor,
                          "--tw-prose-bold": textColor,
                        } as React.CSSProperties
                      }
                      dangerouslySetInnerHTML={{ __html: detail.title }}
                    />
                  )}
                  {detail.content && (
                    <div
                      className="prose max-w-none text-center prose-p:leading-relaxed text-[16px] prose-p:text-[16px]"
                      style={
                        {
                          color: mutedColor,
                          "--tw-prose-body": mutedColor,
                          "--tw-prose-p": mutedColor,
                        } as React.CSSProperties
                      }
                      dangerouslySetInnerHTML={{ __html: detail.content }}
                    />
                  )}
                </div>
              ));
            }
            return null;
          })()}
        </motion.div>

        {/* Footer Buttons (Previous / Next) */}
        {blogDetailBtns.length > 1 && (
          <div className="w-full flex justify-between items-center mt-12 pt-8">
            {/* Previous Button */}
            {blogDetailBtns[1] && (
              <DynamicButton 
                btn={blogDetailBtns[1]}
                fallbackFill="transparent"
                fallbackText={textColor}
                globalSettings={globalSettings} 
                className="font-bold tracking-widest text-[13px] px-8 py-3 border transition-colors"
              />
            )}

            {/* Next Button */}
            {blogDetailBtns[2] && (
              <DynamicButton 
                btn={blogDetailBtns[2]}
                fallbackFill={textColor}
                fallbackText={bgColor}
                globalSettings={globalSettings} 
                className="font-bold tracking-widest text-[13px] px-8 py-3 border transition-colors"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
