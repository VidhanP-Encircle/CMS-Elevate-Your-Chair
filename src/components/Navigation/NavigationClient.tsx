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

  return (
    <nav className={`relative w-full transition-colors duration-300 ${isScrolled || isOpen ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between gap-[20px] xl:gap-[40px] px-4 xl:px-[55px] py-4 xl:py-[20px] w-full max-w-[1512px] mx-auto min-h-[100px] box-border">
        
        {/* Hamburger (Mobile only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          role="button" 
          className="xl:hidden cursor-pointer flex-none text-white" 
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
                width={422}
                height={60}
                className="object-contain w-[180px] md:w-[250px] lg:w-[320px] xl:w-[422px] h-auto"
              />
            </Link>
          ) : (
            <Link href="/" className="text-white text-xl font-bold" onClick={() => setIsOpen(false)}>
               {globalSettings.brand_name}
            </Link>
          )}
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden xl:flex flex-row flex-wrap items-center justify-center gap-x-[30px] gap-y-[15px] 2xl:gap-x-[70px] nav-wrapper">
          {navigationData
            .filter((item: any) => item.name?.toLowerCase() !== 'search')
            .map((item: any) => (
            <Link 
              key={item.id} 
              href={item.slug || '#'} 
              className="flex items-center font-sans font-normal text-[16px] leading-[20px] text-center uppercase text-white no-underline hover:text-[#c2b7a3] transition-colors whitespace-nowrap"
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
                  <span className="text-white uppercase font-sans whitespace-nowrap">{searchItem.name}</span>
                )}
              </Link>
            ))}
          {/* Fallback if no search item found */}
          {navigationData.filter((item: any) => item.name?.toLowerCase() === 'search').length === 0 && (
              <button aria-label="search icon" className="cursor-pointer text-white">
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
            className="absolute top-full left-0 w-full bg-[#f8f8f8] shadow-lg xl:hidden flex flex-col py-[50px] px-[50px] overflow-hidden"
          >
            <div className="flex flex-col gap-[35px] text-left">
              {navigationData
                .filter((item: any) => item.name?.toLowerCase() !== 'search')
                .map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={item.slug || '#'} 
                    onClick={() => setIsOpen(false)}
                    className="font-sans font-normal text-[18px] leading-[22px] uppercase text-[#1a1a1a] no-underline hover:text-[#c2b7a3] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
            <div className="mt-12 flex justify-center w-full">
               <Link 
                 href="http://elevate-by-blake-charles-salon.mn.co/plans/1896001" 
                 target="_blank" 
                 className="bg-[#c2b7a3] text-[#1a1a1a] font-bold font-sans text-[16px] leading-[20px] uppercase px-8 py-[18px] w-full max-w-[300px] text-center no-underline hover:opacity-80 transition-opacity"
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
