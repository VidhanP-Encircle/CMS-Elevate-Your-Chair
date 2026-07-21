import { getDirectus } from '@/lib/directus';
import { readItems, readSingleton } from '@directus/sdk';
import BlockTitle from '@/components/BlockTitle/BlockTitle';
import BlockMobile from '@/components/BlockMobile/BlockMobile';
import BlockCard from '@/components/BlockCard/BlockCard';
import BlockPricingCards from '@/components/BlockPricingCards/BlockPricingCards';
import BlockTestimonials from '@/components/BlockTestimonials/BlockTestimonials';
import BlockJourneyApp from '@/components/BlockJourneyApp/BlockJourneyApp';
import BlockTextImage from '@/components/BlockTextImage/BlockTextImage';
import BlockSlider from '@/components/BlockSlider/BlockSlider';
import BlockFaqs from '@/components/BlockFaqs/BlockFaqs';
import BlockContent from '@/components/BlockContent/BlockContent';
import { draftMode } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    noStore();
  }

  try {
    const directus = await getDirectus();
    
    // Fetch page blocks
    const pages = (await directus.request(
      readItems('pages', {
        filter: { inner_name: { _eq: 'Home Page' } },
        fields: [
          '*', 
          'pages_blocks.*', 
          'pages_blocks.item.*', 
          'pages_blocks.item.cards.*',
          'pages_blocks.item.pricing_cards.*',
          'pages_blocks.item.pricing_cards.pricing_cards_id.*',
          'pages_blocks.item.background_image.*',
          'pages_blocks.item.image.*',
          'pages_blocks.item.testimonial.*',
          'pages_blocks.item.testimonial.testimonial_id.*',
          'pages_blocks.item.testimonial.testimonial_id.image.*',
          'pages_blocks.item.buttons.*',
          'pages_blocks.item.buttons.logo.*',
          'pages_blocks.item.buttons.buttons_id.*',
          'pages_blocks.item.buttons.buttons_id.logo.*',
          'pages_blocks.item.text_image.*',
          'pages_blocks.item.text_image.text_image_id.*',
          'pages_blocks.item.text_image.text_image_id.photo.*',
          'pages_blocks.item.slides.*',
          'pages_blocks.item.slides.slides_id.*',
          'pages_blocks.item.slides.slides_id.background_image.*',
          'pages_blocks.item.button.*',
          'pages_blocks.item.button.buttons_id.*',
        ] as any,
      })
    )) as any[];

    // Fetch global settings to get colors and sizes
    let globalSettings: any = {};
    try {
      globalSettings = await directus.request(readSingleton('global_settings')) || {};
    } catch (e) {
      console.warn('Could not fetch global settings', e);
    }

    // Fetch pricing benefits (used within pricing blocks)
    let pricingBenefits: any[] = [];
    try {
      pricingBenefits = (await directus.request(
        readItems('pricing_benefits', {
          fields: ['*', 'plans.*', 'plans.pricing_cards_id.*'] as any,
          sort: 'sort',
        })
      )) as any[];
    } catch (e) {
      console.warn('Could not fetch pricing benefits', e);
    }

    if (!pages || pages.length === 0) {
      return <div>Home page not found</div>;
    }

    const homePage = pages[0];
    const blocks = homePage.pages_blocks;

    // Group pricing cards blocks if they are sequential
    const groupedBlocks = [];
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].collection === 'block_pricing_cards') {
        const currentBlock = blocks[i];
        const nextBlock = blocks[i + 1];
        
        if (nextBlock && nextBlock.collection === 'block_pricing_cards') {
          groupedBlocks.push({
            collection: 'block_pricing_cards_group',
            items: [currentBlock.item, nextBlock.item]
          });
          i++; // Skip the next block since we grouped it
          continue;
        } else {
          groupedBlocks.push({
            collection: 'block_pricing_cards_group',
            items: [currentBlock.item]
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
            Draft Mode Enabled — Viewing Uncached Data.{' '}
            <Link href="/api/disable-draft" className="underline hover:text-white transition-colors">
              Disable Draft Mode
            </Link>
          </div>
        )}
        <div className="flex flex-col w-full">
          {groupedBlocks.map((blockWrap: any, index: number) => {
            const collection = blockWrap.collection;
            const item = blockWrap.item; // for standard blocks

            if (collection === 'block_title') {
              return <BlockTitle key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_mobile') {
              return <BlockMobile key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_card') {
              return <BlockCard key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_pricing_cards_group') {
              return <BlockPricingCards key={index} data={blockWrap.items} globalSettings={globalSettings} benefits={pricingBenefits} />;
            }

            if (collection === 'block_testimonials') {
              return <BlockTestimonials key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_journey_app') {
              return <BlockJourneyApp key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_text_image') {
              return <BlockTextImage key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_slider') {
              return <BlockSlider key={index} data={item} globalSettings={globalSettings} />;
            }

            if (collection === 'block_faqs') {
              return <BlockFaqs key={index} data={item} />;
            }

            if (collection === 'block_content') {
              return <BlockContent key={index} data={item} globalSettings={globalSettings} />;
            }

            return <div key={index}>Unknown block type: {collection}</div>;
        })}
      </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching home page blocks:', error);
    return <div>Error loading page content</div>;
  }
}
