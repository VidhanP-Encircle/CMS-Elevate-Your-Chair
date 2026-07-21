import type { Metadata } from "next";
import "./globals.css";
import { getDirectus } from "@/lib/directus";
import { readSingleton } from "@directus/sdk";
import NoticeBlock from "@/components/NoticeBlock/NoticeBlock";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Elevate Your Chair",
  description: "Join a Movement. Elevate Your Craft. Fuel Your Purpose.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let globalSettings: any = {};

  try {
    const directus = await getDirectus();
    globalSettings = await directus.request(readSingleton("global_settings"));
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
  }

  return (
    <html lang="en" className={cn("font-sans")}>
      <body>
        <header className="sticky top-0 z-50 w-full flex flex-col">
          <NoticeBlock globalSettings={globalSettings} />
          <Navigation globalSettings={globalSettings} />
        </header>
        <main className="-mt-31">{children}</main>
        <Footer globalSettings={globalSettings} />
      </body>
    </html>
  );
}
