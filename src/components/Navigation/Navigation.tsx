import { getDirectus } from '@/lib/directus';
import Link from 'next/link';
import Image from 'next/image';
import { GlobalSettings } from '@/lib/types';
import { readItems } from '@directus/sdk';
import NavigationClient from './NavigationClient';

export default async function Navigation({ globalSettings }: { globalSettings: GlobalSettings }) {
  try {
    const directus = await getDirectus();
    const navigationData = await directus.request(readItems('navigation_items'));
    
    return <NavigationClient globalSettings={globalSettings} navigationData={navigationData} />;
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return null;
  }
}
