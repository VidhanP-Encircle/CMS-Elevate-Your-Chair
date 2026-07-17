import { getDirectus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { GlobalSettings, Notice } from '@/lib/types';
import Link from 'next/link';

export default async function NoticeBlock({ globalSettings }: { globalSettings: GlobalSettings }) {
  try {
    const directus = await getDirectus();
    const notices = await directus.request(readItems('block_notice'));
    
    if (!notices || notices.length === 0) {
      return null;
    }
    
    const notice = notices[0] as Notice;
    
    const buttonFill = notice.button_fill || globalSettings.button_color || '#c2b7a3';
    const buttonTextColor = notice.button_text_color || globalSettings.button_text_color || '#1a1a1a';
    const buttonBorder = notice.button_border || buttonFill;

    return (
      <div className="w-full bg-[#1a1a1a]">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-[55px] py-4 md:py-[14px] gap-4 md:gap-[55px] w-full min-h-[68px] box-border max-w-[1512px] mx-auto">
          <div className="flex flex-row justify-center md:justify-start items-center gap-[55px] grow text-center md:text-left">
            <p className="font-sans font-normal text-[14px] md:text-[16px] leading-[20px] text-white m-0">{notice.text}</p>
          </div>
          
          <div className="flex flex-row items-center gap-[28px] shrink-0">
            {notice.button_text && notice.button_url && (
              <Link 
                href={notice.button_url} 
                className="flex flex-row justify-center items-center px-[25px] py-[10px] gap-[10px] min-h-[40px] box-border no-underline text-center transition-opacity hover:opacity-90"
                style={{ 
                  backgroundColor: buttonFill, 
                  borderColor: buttonBorder,
                  borderWidth: buttonBorder !== buttonFill ? '2px' : '0px',
                  borderStyle: 'solid'
                }}
              >
                <span className="font-sans font-extrabold text-[14px] md:text-[16px] leading-[20px] uppercase m-0" style={{ color: buttonTextColor }}>
                  {notice.button_text}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching notice block:', error);
    return null;
  }
}
