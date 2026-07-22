import { getDirectus } from "@/lib/directus";
import { readItems, readSingleton } from "@directus/sdk";
import BlockBlogDetail from "@/components/BlockBlogs/BlockBlogDetail";
import { draftMode } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogItem, GlobalSettings, BlockBlogs } from "@/lib/types";
import ForceSolidNav from "@/components/ForceSolidNav/ForceSolidNav";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    noStore();
  }

  try {
    const directus = await getDirectus();

    // The slug parameter is just the last segment (e.g. "seven-blog")
    // We match it against `slug_button_url` which is `/wellness/blog/seven-blog`
    const fullSlug = `/wellness/blog/${slug}`;

    // Fetch the specific blog matching the slug
    const blogs = (await directus.request(
      readItems("blogs" as never, {
        filter: { slug_button_url: { _eq: fullSlug } },
        fields: ["*", "photo.*", "authors.*"],
      })
    )) as unknown as BlogItem[];

    if (!blogs || blogs.length === 0) {
      notFound();
    }

    const currentBlog = blogs[0];

    // Fetch global settings
    let globalSettings: GlobalSettings | undefined = undefined;
    try {
      globalSettings = (await directus.request(readSingleton("global_settings" as never))) as unknown as GlobalSettings;
    } catch (e) {
      console.warn("Could not fetch global settings", e);
    }

    // Fetch authors map for BlockBlogDetail
    let allAuthorsData: Array<{ id: string; name: string }> = [];
    try {
      allAuthorsData = (await directus.request(
        readItems("authors" as never, { fields: ["id", "name"] })
      )) as unknown as Array<{ id: string; name: string }>;
    } catch (e) {
      console.warn("Could not fetch authors", e);
    }

    // Fetch block_blogs configuration to get the buttons
    // Since there might be multiple, we try to fetch one that has the blog_detail_button populated
    let blockBlogsConfig: Record<string, unknown> = {};
    try {
      const blockBlogs = (await directus.request(
        readItems("block_blogs" as never, {
          fields: ["background_color", "blog_detail_button.*", "blog_detail_button.buttons_id.*", "buttons.*", "buttons.buttons_id.*"],
          limit: 1,
        })
      )) as unknown as Array<Record<string, unknown>>;
      if (blockBlogs && blockBlogs.length > 0) {
        blockBlogsConfig = blockBlogs[0];
      }
    } catch (e) {
      console.warn("Could not fetch block_blogs config", e);
    }

    let prevUrl: string | null = null;
    let nextUrl: string | null = null;
    try {
      const allBlogsList = (await directus.request(
        readItems("blogs" as never, {
          fields: ["slug_button_url", "categories", "date_created"] as never,
          sort: ["categories", "-date_created"] as never,
          limit: -1,
        })
      )) as unknown as Array<{ slug_button_url?: string }>;

      const currentIndex = allBlogsList.findIndex((b) => b.slug_button_url === fullSlug);
      if (currentIndex !== -1 && allBlogsList.length > 1) {
        // Efficient Circular Navigation Logic:
        // Next blog = older (currentIndex + 1). If at the end, wrap around to index 0.
        const nextIndex = (currentIndex + 1) % allBlogsList.length;
        nextUrl = allBlogsList[nextIndex].slug_button_url || null;

        // Previous blog = newer (currentIndex - 1). If at index 0, wrap around to the end.
        const prevIndex = (currentIndex - 1 + allBlogsList.length) % allBlogsList.length;
        prevUrl = allBlogsList[prevIndex].slug_button_url || null;
      }
    } catch (e) {
      console.warn("Could not fetch blogs list for pagination", e);
    }

    // Wrap the fetched data to match what BlockBlogDetail expects
    const rawButtons = blockBlogsConfig && "blog_detail_button" in blockBlogsConfig && Array.isArray((blockBlogsConfig as Record<string, unknown>).blog_detail_button)
      ? JSON.parse(JSON.stringify((blockBlogsConfig as Record<string, unknown>).blog_detail_button))
      : [];

    if (Array.isArray(rawButtons)) {
      if (rawButtons[1]) {
        if (prevUrl) {
          if (!rawButtons[1].buttons_id) rawButtons[1].buttons_id = {};
          rawButtons[1].buttons_id.button_url = prevUrl;
        } else {
          rawButtons[1] = null;
        }
      }
      if (rawButtons[2]) {
        if (nextUrl) {
          if (!rawButtons[2].buttons_id) rawButtons[2].buttons_id = {};
          rawButtons[2].buttons_id.button_url = nextUrl;
        } else {
          rawButtons[2] = null;
        }
      }
    }

    const mockBlockData: BlockBlogs = {
      id: blockBlogsConfig?.id || 1,
      title: blockBlogsConfig?.title || "",
      buttons: blockBlogsConfig?.buttons || [],
      ...blockBlogsConfig,
      background_color: "#ffffff", // Force white background for blog detail as requested
      blogs: [
        {
          blogs_id: currentBlog,
        },
      ],
      blog_detail_button: rawButtons,
    } as unknown as BlockBlogs;

    return (
      <>
        {isEnabled && (
          <div className="w-full bg-[#c2b7a3] text-black text-center py-2 text-sm font-bold tracking-wide z-50 relative">
            Draft Mode Enabled — Viewing Uncached Data.{" "}
            <Link href="/api/disable-draft" className="underline hover:text-white transition-colors">
              Disable Draft Mode
            </Link>
          </div>
        )}
        <div className="flex flex-col w-full">
          <ForceSolidNav />
          <BlockBlogDetail
            data={mockBlockData}
            globalSettings={globalSettings}
            authorsMapData={allAuthorsData}
          />
        </div>
      </>
    );
  } catch (error: any) {
    if (error?.digest === "NEXT_HTTP_ERROR_FALLBACK;404" || error?.message === "NEXT_HTTP_ERROR_FALLBACK;404") {
      throw error;
    }
    console.error("Error fetching blog details:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
        <h1 className="text-2xl font-title mb-4">Error loading blog post</h1>
      </div>
    );
  }
}
