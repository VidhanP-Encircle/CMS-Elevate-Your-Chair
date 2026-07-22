import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import "./globals.css";
import { getDirectus } from "@/lib/directus";
import { GlobalSettings } from "@/lib/types";
import { readSingleton } from "@directus/sdk";
import BlockNotice from "@/components/BlockNotice/BlockNotice";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/favicon.ico";
  try {
    const directus = await getDirectus();
    const globalSettings = await directus.request(readSingleton("global_settings" as never, {
      fields: ['*', 'buttons.*', 'buttons.buttons_id.*'] as never
    })) as unknown as GlobalSettings;
    if (globalSettings.favicon) {
      faviconUrl = `/api/assets/${globalSettings.favicon}`;
    }
  } catch (error) {
    console.error("Failed to fetch global settings for metadata:", error);
  }

  return {
    title: "Elevate Your Chair",
    description: "Join a Movement. Elevate Your Craft. Fuel Your Purpose.",
    icons: {
      icon: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let globalSettings: GlobalSettings | undefined = undefined;

  try {
    const directus = await getDirectus();
    globalSettings = (await directus.request(readSingleton("global_settings" as never, {
      fields: ['*', 'buttons.*', 'buttons.buttons_id.*', 'made_by_logo.*', 'footer_form.*'] as never
    }))) as GlobalSettings;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
  }

  return (
    <html lang="en" className={cn("font-sans")}>
      <body>
        <header className="sticky top-0 z-50 w-full flex flex-col">
          <BlockNotice globalSettings={globalSettings || ({} as GlobalSettings)} />
          <Navigation globalSettings={globalSettings || ({} as GlobalSettings)} />
        </header>
        <main className="-mt-31">{children}</main>
        <Footer globalSettings={globalSettings || ({} as GlobalSettings)} />
      </body>
    </html>
  );
}
