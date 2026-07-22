import { getDirectus } from "@/lib/directus";
import { GlobalSettings , NavigationProps } from "@/lib/types";
import { readItems } from "@directus/sdk";
import NavigationClient from "./NavigationClient";

export default async function Navigation({
  globalSettings,
}: NavigationProps) {
  try {
    const directus = await getDirectus();
    const navigationData = await directus.request(
      readItems("navigation_items"),
    );

    return (
      <NavigationClient
        globalSettings={globalSettings}
        navigationData={navigationData}
      />
    );
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return null;
  }
}
