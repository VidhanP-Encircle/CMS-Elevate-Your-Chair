import { getDirectus } from "@/lib/directus";
import { readItems, readSingleton } from "@directus/sdk";
import BlockBlogDetail from "@/components/BlockBlogs/BlockBlogDetail";
import { draftMode } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

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
      readItems("blogs" as any, {
        filter: { slug_button_url: { _eq: fullSlug } },
        fields: ["*", "photo.*", "authors.*"],
      })
    )) as any[];

    if (!blogs || blogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
          <h1 className="text-4xl font-title font-bold mb-4">404 - Blog Not Found</h1>
          <p className="font-sans text-white/70 mb-8">
            The blog post you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#c2b7a3] text-black font-sans font-bold uppercase tracking-wider hover:bg-[#c2b7a3]/90 transition-colors"
          >
            Back Home
          </Link>
        </div>
      );
    }

    const currentBlog = blogs[0];

    // Fetch global settings
    let globalSettings: any = {};
    try {
      globalSettings = (await directus.request(readSingleton("global_settings"))) || {};
    } catch (e) {
      console.warn("Could not fetch global settings", e);
    }

    // Fetch authors map for BlockBlogDetail
    let allAuthorsData: any[] = [];
    try {
      allAuthorsData = (await directus.request(
        readItems("authors" as any, { fields: ["id", "name"] })
      )) as any[];
    } catch (e) {
      console.warn("Could not fetch authors", e);
    }

    // Fetch block_blogs configuration to get the buttons
    // Since there might be multiple, we try to fetch one that has the blog_detail_button populated
    let blockBlogsConfig: any = {};
    try {
      const blockBlogs = (await directus.request(
        readItems("block_blogs" as any, {
          fields: ["background_color", "blog_detail_button.*", "blog_detail_button.buttons_id.*", "buttons.*", "buttons.buttons_id.*"],
          limit: 1,
        })
      )) as any[];
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
        readItems("blogs" as any, {
          fields: ["slug_button_url", "categories", "date_created"],
          sort: ["categories", "-date_created"],
          limit: -1,
        })
      )) as any[];

      const currentIndex = allBlogsList.findIndex((b) => b.slug_button_url === fullSlug);
      if (currentIndex !== -1 && allBlogsList.length > 1) {
        // Efficient Circular Navigation Logic:
        // Next blog = older (currentIndex + 1). If at the end, wrap around to index 0.
        const nextIndex = (currentIndex + 1) % allBlogsList.length;
        nextUrl = allBlogsList[nextIndex].slug_button_url;

        // Previous blog = newer (currentIndex - 1). If at index 0, wrap around to the end.
        const prevIndex = (currentIndex - 1 + allBlogsList.length) % allBlogsList.length;
        prevUrl = allBlogsList[prevIndex].slug_button_url;
      }
    } catch (e) {
      console.warn("Could not fetch blogs list for pagination", e);
    }

    // Wrap the fetched data to match what BlockBlogDetail expects
    const mockBlockData = {
      ...blockBlogsConfig,
      background_color: "#ffffff", // Force white background for blog detail as requested
      blogs: [
        {
          blogs_id: currentBlog,
        },
      ],
    };

    if (mockBlockData.blog_detail_button) {
      // Deep clone the buttons array so we don't mutate the original fetched config
      mockBlockData.blog_detail_button = JSON.parse(JSON.stringify(mockBlockData.blog_detail_button));
      
      // Prev Button is index 1
      if (mockBlockData.blog_detail_button[1]) {
        if (prevUrl) {
          if (!mockBlockData.blog_detail_button[1].buttons_id) mockBlockData.blog_detail_button[1].buttons_id = {};
          mockBlockData.blog_detail_button[1].buttons_id.button_url = prevUrl;
        } else {
          mockBlockData.blog_detail_button[1] = null;
        }
      }
      
      // Next Button is index 2
      if (mockBlockData.blog_detail_button[2]) {
        if (nextUrl) {
          if (!mockBlockData.blog_detail_button[2].buttons_id) mockBlockData.blog_detail_button[2].buttons_id = {};
          mockBlockData.blog_detail_button[2].buttons_id.button_url = nextUrl;
        } else {
          mockBlockData.blog_detail_button[2] = null;
        }
      }
    }

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
          <BlockBlogDetail
            data={mockBlockData}
            globalSettings={globalSettings}
            authorsMapData={allAuthorsData}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching blog details:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
        <h1 className="text-2xl font-title mb-4">Error loading blog post</h1>
      </div>
    );
  }
}
