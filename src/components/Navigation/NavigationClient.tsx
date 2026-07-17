'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSettings } from '@/lib/types';

export default function NavigationClient({ globalSettings, navigationData }: { globalSettings: GlobalSettings, navigationData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBgScrolled = '#1a1a1a';
  const navDropdownBg = '#f8f8f8';
  const navTextColor = '#ffffff';
  const navTextHover = globalSettings?.button_color || '#c2b7a3';
  const dropdownTextColor = '#1a1a1a';
  const buttonColor = globalSettings?.button_color || '#c2b7a3';
  const buttonTextColor = globalSettings?.button_text_color || '#1a1a1a';

  return (
    <nav 
      className="relative w-full transition-colors duration-300"
      style={{ backgroundColor: isScrolled || isOpen ? navBgScrolled : 'transparent' }}
    >
      <div className="flex items-center justify-between gap-[20px] xl:gap-[30px] px-4 xl:px-[55px] py-4 xl:py-[10px] w-full max-w-[1512px] mx-auto min-h-[80px] box-border">
        
        {/* Hamburger (Mobile only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          role="button" 
          className="xl:hidden cursor-pointer flex-none" 
          style={{ color: navTextColor }}
          aria-label="Menu"
        >
           {isOpen ? (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           ) : (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
             </svg>
           )}
        </button>

        {/* Logo */}
        <div className="flex-none brand-logo">
          {globalSettings.logo ? (
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image 
                src={`/api/assets/${globalSettings.logo}`}
                alt={globalSettings.brand_name || 'Logo'}
                width={320}
                height={45}
                className="object-contain w-[180px] md:w-[220px] lg:w-[280px] xl:w-[320px] h-auto"
              />
            </Link>
          ) : (
            <Link href="/" className="text-xl font-bold" style={{ color: navTextColor }} onClick={() => setIsOpen(false)}>
               {globalSettings.brand_name}
            </Link>
          )}
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden xl:flex flex-row flex-wrap items-center justify-center gap-x-[20px] gap-y-[15px] xl:gap-x-[40px] nav-wrapper">
          {navigationData
            .filter((item: any) => item.name?.toLowerCase() !== 'search')
            .map((item: any) => (
            <Link 
              key={item.id} 
              href={item.slug || '#'} 
              className="flex items-center font-sans font-normal text-[13px] leading-[18px] tracking-wide text-center uppercase no-underline transition-colors whitespace-nowrap"
              style={{ color: navTextColor }}
              onMouseEnter={(e) => e.currentTarget.style.color = navTextHover}
              onMouseLeave={(e) => e.currentTarget.style.color = navTextColor}
            >
              {item.logo ? (
                <Image 
                  src={`/api/assets/${item.logo}`}
                  alt={item.name || 'Icon'}
                  width={20}
                  height={20}
                  className="object-contain w-[20px] h-[20px]"
                />
              ) : (
                item.name
              )}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="flex-none flex items-center search">
          {navigationData
            .filter((item: any) => item.name?.toLowerCase() === 'search')
            .map((searchItem: any) => (
              <Link key={searchItem.id} href={searchItem.slug || '#'} className="cursor-pointer" onClick={() => setIsOpen(false)}>
                {searchItem.logo ? (
                  <Image 
                    src={`/api/assets/${searchItem.logo}`}
                    alt="Search"
                    width={20}
                    height={20}
                    className="object-contain w-[20px] h-[20px]"
                  />
                ) : (
                  <span className="uppercase font-sans whitespace-nowrap" style={{ color: navTextColor }}>{searchItem.name}</span>
                )}
              </Link>
            ))}
          {/* Fallback if no search item found */}
          {navigationData.filter((item: any) => item.name?.toLowerCase() === 'search').length === 0 && (
              <button aria-label="search icon" className="cursor-pointer" style={{ color: navTextColor }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
              </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full shadow-lg xl:hidden flex flex-col py-[50px] px-[50px] overflow-hidden"
            style={{ backgroundColor: navDropdownBg }}
          >
            <div className="flex flex-col gap-[35px] text-left">
              {navigationData
                .filter((item: any) => item.name?.toLowerCase() !== 'search')
                .map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={item.slug || '#'} 
                    onClick={() => setIsOpen(false)}
                    className="font-sans font-normal text-[18px] leading-[22px] uppercase no-underline transition-colors"
                    style={{ color: dropdownTextColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = navTextHover}
                    onMouseLeave={(e) => e.currentTarget.style.color = dropdownTextColor}
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
            <div className="mt-12 flex justify-center w-full">
               <Link 
                 href="http://elevate-by-blake-charles-salon.mn.co/plans/1896001" 
                 target="_blank" 
                 className="font-bold font-sans text-[16px] leading-[20px] uppercase px-8 py-[18px] w-full max-w-[300px] text-center no-underline hover:opacity-80 transition-opacity"
                 style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                 onClick={() => setIsOpen(false)}
               >
                  Join Elevate
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
