import { getDirectus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { GlobalSettings, Notice , BlockNoticeProps } from "@/lib/types";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import Link from "next/link";

export default async function BlockNotice({
  globalSettings,
}: BlockNoticeProps) {
  try {
    const directus = await getDirectus();
    const notices = await directus.request(
      readItems("block_notice", {
        fields: ["*", "buttons.*", "buttons.buttons_id.*"],
      }),
    );

    if (!notices || notices.length === 0) {
      return null;
    }

    const notice = notices[0] as any;

    const bgColor = "#111111";
    const textColor = "#d1d1d1";

    let buttonList: any[] = [];
    if (Array.isArray(notice.buttons)) {
      buttonList = notice.buttons
        .map((junction: any) => junction.buttons_id || junction)
        .filter((item: any) => typeof item === "object" && item !== null);
    }

    return (
      <div className="w-full" style={{ backgroundColor: bgColor }}>
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-13.75 py-2 gap-4 w-full min-h-11 box-border max-w-378 mx-auto">
          <div className="flex flex-row justify-center md:justify-start items-center grow text-center md:text-left">
            <p
              className="font-sans font-normal text-[12px] md:text-[13px] leading-4.5 m-0"
              style={{ color: textColor }}
            >
              {notice.text}
            </p>
          </div>

          <div className="flex flex-row items-center shrink-0">
            {buttonList.map((btn: any, idx: number) => (
              <DynamicButton
                key={idx}
                btn={btn}
                fallbackFill="#c2b7a3"
                fallbackText="#1a1a1a"
                globalSettings={globalSettings}
                className="text-[12px]! leading-4! px-5! py-1.5! min-h-8! border-0!"
              />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching notice block:", error);
    return null;
  }
}
