import { getDirectus } from "@/lib/directus";
import { readItems, readSingleton } from "@directus/sdk";
import BlockTitle from "@/components/BlockTitle/BlockTitle";
import BlockMobile from "@/components/BlockMobile/BlockMobile";
import BlockCard from "@/components/BlockCard/BlockCard";
import BlockPricingCards from "@/components/BlockPricingCards/BlockPricingCards";
import BlockTestimonials from "@/components/BlockTestimonials/BlockTestimonials";
import BlockJourneyApp from "@/components/BlockJourneyApp/BlockJourneyApp";
import BlockTextImage from "@/components/BlockTextImage/BlockTextImage";
import BlockSlider from "@/components/BlockSlider/BlockSlider";
import BlockFaqs from "@/components/BlockFaqs/BlockFaqs";
import BlockContent from "@/components/BlockContent/BlockContent";
import BlockBlogs from "@/components/BlockBlogs/BlockBlogs";
import BlockForm from "@/components/BlockForm/BlockForm";
import BlockLegal from "@/components/BlockLegal/BlockLegal";
import { draftMode } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Page, GlobalSettings, PricingBenefitItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DynamicPage({
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

    // Fetch page blocks by slug
    const pages = (await directus.request(
      readItems("pages", {
        filter: { slug: { _eq: `/${slug}` } },
        fields: [
          "*",
          "pages_blocks.*",
          "pages_blocks.item.*",
          "pages_blocks.item.cards.*",
          "pages_blocks.item.pricing_cards.*",
          "pages_blocks.item.pricing_cards.pricing_cards_id.*",
          "pages_blocks.item.background_image.*",
          "pages_blocks.item.image.*",
          "pages_blocks.item.testimonial.*",
          "pages_blocks.item.testimonial.testimonial_id.*",
          "pages_blocks.item.testimonial.testimonial_id.image.*",
          "pages_blocks.item.buttons.*",
          "pages_blocks.item.buttons.logo.*",
          "pages_blocks.item.buttons.buttons_id.*",
          "pages_blocks.item.buttons.buttons_id.logo.*",
          "pages_blocks.item.buttons.buttons_id.hover_logo.*",
          "pages_blocks.item.text_image.*",
          "pages_blocks.item.text_image.text_image_id.*",
          "pages_blocks.item.text_image.text_image_id.photo.*",
          "pages_blocks.item.slides.*",
          "pages_blocks.item.slides.slides_id.*",
          "pages_blocks.item.slides.slides_id.background_image.*",
          "pages_blocks.item.button.*",
          "pages_blocks.item.button.buttons_id.*",
          "pages_blocks.item.button.buttons_id.logo.*",
          "pages_blocks.item.button.buttons_id.hover_logo.*",
          "pages_blocks.item.blogs.*",
          "pages_blocks.item.blogs.blogs_id.*",
          "pages_blocks.item.blogs.blogs_id.photo.*",
          "pages_blocks.item.blogs.blogs_id.authors.*",
          "pages_blocks.item.form.*",
          "pages_blocks.item.form.form_fields.*",
          "pages_blocks.item.details.*",
        ] as never,
      }),
    )) as Page[];

    // Fetch global settings to get colors and sizes
    let globalSettings: GlobalSettings | undefined = undefined;
    try {
      globalSettings =
        (await directus.request(
          readSingleton("global_settings" as never, {
            fields: ["*", "social_links.*"] as never,
          }),
        )) as GlobalSettings;
    } catch (e) {
      console.warn("Could not fetch global settings", e);
    }

    // Fetch pricing benefits (used within pricing blocks)
    let pricingBenefits: PricingBenefitItem[] = [];
    try {
      pricingBenefits = (await directus.request(
        readItems("pricing_benefits" as never, {
          fields: ["*", "plans.*", "plans.pricing_cards_id.*"] as never,
          sort: ["sort"] as never,
        }),
      )) as unknown as PricingBenefitItem[];
    } catch (e) {
      console.warn("Could not fetch pricing benefits", e);
    }

    // Fetch all categories and authors for blog filtering
    let allCategories: string[] = [];
    let allAuthors: string[] = [];
    let authorsMapData: { id: string; name: string }[] = [];
    try {
      const blogsData = (await directus.request(
        readItems("blogs" as never, { fields: ["categories"] }),
      )) as Array<{ categories?: string | string[] }>;
      const uniqueCats = new Set<string>();
      blogsData.forEach((b) => {
        if (b.categories) {
          if (Array.isArray(b.categories)) {
            b.categories.forEach((c: string) => uniqueCats.add(c));
          } else {
            uniqueCats.add(b.categories);
          }
        }
      });
      allCategories = Array.from(uniqueCats).filter(Boolean);

      const fetchedAuthors = (await directus.request(
        readItems("authors" as never, { fields: ["id", "name"] }),
      )) as Array<{ id: string; name: string }>;
      authorsMapData = fetchedAuthors;
      allAuthors = fetchedAuthors.map((a) => a.name).filter(Boolean);
    } catch (e: unknown) {
      console.warn("Could not fetch categories or authors", e);
      const errMessage = e instanceof Error ? e.message : String(e);
      allCategories = ["Error: " + errMessage];
    }

    if (!pages || pages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
          <h1 className="text-4xl font-title font-bold mb-4">
            404 - Page Not Found
          </h1>
          <p className="font-sans text-white/70 mb-8">
            The page you are looking for does not exist.
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

    const currentPage = pages[0];
    const blocks = currentPage.pages_blocks;

    if (!blocks || blocks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
          <h1 className="text-2xl font-title mb-4">
            This page has no content blocks.
          </h1>
        </div>
      );
    }

    // Group pricing cards blocks if they are sequential
    const groupedBlocks = [];
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].collection === "block_pricing_cards") {
        const currentBlock = blocks[i];
        const nextBlock = blocks[i + 1];

        if (nextBlock && nextBlock.collection === "block_pricing_cards") {
          groupedBlocks.push({
            collection: "block_pricing_cards_group",
            items: [currentBlock.item, nextBlock.item],
          });
          i++; // Skip the next block since we grouped it
          continue;
        } else {
          groupedBlocks.push({
            collection: "block_pricing_cards_group",
            items: [currentBlock.item],
          });
          continue;
        }
      }
      groupedBlocks.push(blocks[i]);
    }

    return (
      <>
        {isEnabled && (
          <div className="w-full bg-[#c2b7a3] text-black text-center py-2 text-sm font-bold tracking-wide z-50 relative">
            Draft Mode Enabled — Viewing Uncached Data.{" "}
            <Link
              href="/api/disable-draft"
              className="underline hover:text-white transition-colors"
            >
              Disable Draft Mode
            </Link>
          </div>
        )}
        <div className="flex flex-col w-full">
          {groupedBlocks.map((wrap: unknown, index: number) => {
            const blockWrap = wrap as { collection: string; item: Record<string, unknown> };
            const collection = blockWrap.collection;
            const item = blockWrap.item as never; // for standard blocks

            if (collection === "block_title") {
              return (
                <BlockTitle
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_mobile") {
              return (
                <BlockMobile
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_card") {
              return (
                <BlockCard
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_pricing_cards_group") {
              const groupItems = (wrap as { items: Record<string, unknown>[] }).items as never;
              return (
                <BlockPricingCards
                  key={index}
                  data={groupItems}
                  globalSettings={globalSettings}
                  benefits={pricingBenefits}
                />
              );
            }

            if (collection === "block_testimonials") {
              return (
                <BlockTestimonials
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_journey_app") {
              return (
                <BlockJourneyApp
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_text_image") {
              return (
                <BlockTextImage
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_slider") {
              return (
                <BlockSlider
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_faqs") {
              return <BlockFaqs key={index} data={item} />;
            }

            if (collection === "block_content") {
              return (
                <BlockContent
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_blogs") {
              return (
                <BlockBlogs
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                  allCategories={allCategories}
                  allAuthors={allAuthors}
                  authorsMapData={authorsMapData}
                />
              );
            }

            if (collection === "block_form") {
              return (
                <BlockForm
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            if (collection === "block_legal") {
              return (
                <BlockLegal
                  key={index}
                  data={item}
                  globalSettings={globalSettings}
                />
              );
            }

            return <div key={index}>Unknown block type: {collection}</div>;
          })}
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching page blocks:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-125 text-center pt-37.5 pb-20 bg-black text-white">
        <h1 className="text-2xl font-title mb-4">Error loading page content</h1>
      </div>
    );
  }
}
