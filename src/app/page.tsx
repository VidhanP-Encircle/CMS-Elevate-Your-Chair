import { getDirectus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import BlockTitle from '@/components/BlockTitle/BlockTitle';
// import BlockMobile from '@/components/BlockMobile/BlockMobile';
// import BlockCard from '@/components/BlockCard/BlockCard';

export default async function HomePage() {
  try {
    const directus = await getDirectus();
    const pages = (await directus.request(
      readItems('pages', {
        filter: { inner_name: { _eq: 'Home Page' } },
        fields: ['*', 'pages_blocks.*', 'pages_blocks.item.*'] as any,
      })
    )) as any[];

    if (!pages || pages.length === 0) {
      return <div>Home page not found</div>;
    }

    const homePage = pages[0];
    const blocks = homePage.pages_blocks;

    return (
      <div className="flex flex-col w-full">
        {blocks.map((blockWrap: any, index: number) => {
          const collection = blockWrap.collection;
          const item = blockWrap.item;

          if (collection === 'block_title') {
            return <BlockTitle key={index} data={item} />;
          }

          if (collection === 'block_mobile') {
            return (
              <div key={index} className="p-8 border border-dashed border-gray-400 m-4">
                <h2 className="text-xl font-bold">Block Mobile Placeholder</h2>
                <div dangerouslySetInnerHTML={{ __html: item.title }} className="prose" />
              </div>
            );
            // return <BlockMobile key={index} data={item} />;
          }

          if (collection === 'block_card') {
            return (
              <div key={index} className="p-8 border border-dashed border-gray-400 m-4">
                <h2 className="text-xl font-bold">Block Card Placeholder</h2>
                <div dangerouslySetInnerHTML={{ __html: item.title }} className="prose" />
              </div>
            );
            // return <BlockCard key={index} data={item} />;
          }

          return <div key={index}>Unknown block type: {collection}</div>;
        })}
      </div>
    );
  } catch (error) {
    console.error('Error fetching home page blocks:', error);
    return <div>Error loading page content</div>;
  }
}
