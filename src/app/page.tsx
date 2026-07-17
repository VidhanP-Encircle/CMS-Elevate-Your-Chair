import { getDirectus } from '@/lib/directus';
import { readItems, readSingleton } from '@directus/sdk';
import BlockTitle from '@/components/BlockTitle/BlockTitle';
import BlockMobile from '@/components/BlockMobile/BlockMobile';
import BlockCard from '@/components/BlockCard/BlockCard';
import { draftMode } from 'next/headers';
import Link from 'next/link';

export default async function HomePage() {
  const { isEnabled } = await draftMode();

  try {
    const directus = await getDirectus();
    
    // Fetch page blocks
    const pages = (await directus.request(
      readItems('pages', {
        filter: { inner_name: { _eq: 'Home Page' } },
        fields: ['*', 'pages_blocks.*', 'pages_blocks.item.*', 'pages_blocks.item.cards.*'] as any,
      })
    )) as any[];

    // Fetch global settings to get colors and sizes
    let globalSettings: any = {};
    try {
      globalSettings = await directus.request(readSingleton('global_settings')) || {};
    } catch (e) {
      console.warn('Could not fetch global settings', e);
    }

    if (!pages || pages.length === 0) {
      return <div>Home page not found</div>;
    }

    const homePage = pages[0];
    const blocks = homePage.pages_blocks;

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
          {blocks.map((blockWrap: any, index: number) => {
            const collection = blockWrap.collection;
            const item = blockWrap.item;

          if (collection === 'block_title') {
            return <BlockTitle key={index} data={item} globalSettings={globalSettings} />;
          }

          if (collection === 'block_mobile') {
            return <BlockMobile key={index} data={item} globalSettings={globalSettings} />;
          }

          if (collection === 'block_card') {
            return <BlockCard key={index} data={item} globalSettings={globalSettings} />;
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
