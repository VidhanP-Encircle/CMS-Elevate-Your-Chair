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
    
    const buttonFill = notice.button_fill || globalSettings?.button_color || '#c2b7a3';
    const buttonTextColor = notice.button_text_color || globalSettings?.button_text_color || '#1a1a1a';
    const buttonBorder = notice.button_border || buttonFill;
    const bgColor = '#111111';
    const textColor = '#d1d1d1';

    return (
      <div className="w-full" style={{ backgroundColor: bgColor }}>
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-[55px] py-[8px] gap-4 w-full min-h-[44px] box-border max-w-[1512px] mx-auto">
          <div className="flex flex-row justify-center md:justify-start items-center grow text-center md:text-left">
            <p className="font-sans font-normal text-[12px] md:text-[13px] leading-[18px] m-0" style={{ color: textColor }}>{notice.text}</p>
          </div>
          
          <div className="flex flex-row items-center shrink-0">
            {notice.button_text && notice.button_url && (
              <Link 
                href={notice.button_url} 
                className="group relative overflow-hidden flex flex-row justify-center items-center px-[20px] py-[6px] min-h-[32px] box-border no-underline text-center"
                style={{ 
                  backgroundColor: buttonFill, 
                  borderColor: buttonBorder,
                  borderWidth: buttonBorder !== buttonFill ? '1px' : '0px',
                  borderStyle: 'solid',
                  '--btn-text': buttonTextColor,
                  '--btn-hover-text': globalSettings?.button_hover_text_color || buttonTextColor,
                } as any}
              >
                <span 
                  className="font-sans font-bold text-[12px] leading-[16px] uppercase m-0 transition-colors duration-300 text-[var(--btn-text)] group-hover:text-[var(--btn-hover-text)]"
                >
                  {notice.button_text}
                </span>
                {/* Sliding overlay - after content, with -z-10 to sit behind text */}
                <div
                  className="absolute inset-0 -z-1 transition-transform duration-[400ms] ease-in-out -translate-x-full group-hover:translate-x-0"
                  style={{ backgroundColor: globalSettings?.button_hover_fill_color || buttonFill }}
                />
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
