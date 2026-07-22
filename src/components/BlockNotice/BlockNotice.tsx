import { getDirectus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { GlobalSettings, Notice, BlockNoticeProps, BlockButton } from "@/lib/types";
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

    const notice = notices[0] as Notice;

    const bgColor = "#111111";
    const textColor = "#d1d1d1";

    let buttonList: BlockButton[] = [];
    if (Array.isArray(notice.buttons)) {
      buttonList = notice.buttons
        .map((junction: { buttons_id?: BlockButton | number } | BlockButton) =>
          typeof junction === "object" && junction !== null && "buttons_id" in junction && typeof junction.buttons_id === "object"
            ? (junction.buttons_id as BlockButton)
            : (junction as BlockButton)
        )
        .filter((item): item is BlockButton => typeof item === "object" && item !== null && "button_text" in item);
    }

    return (
      <div className="w-full" style={{ backgroundColor: bgColor }}>
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-13.75 py-2.5 gap-4 w-full min-h-12 box-border">
          <div className="flex flex-row justify-center md:justify-start items-center grow text-center md:text-left">
            <p
              className="font-sans font-normal text-[13px] md:text-[14px] leading-5 m-0"
              style={{ color: textColor }}
            >
              {notice.text}
            </p>
          </div>

          <div className="flex flex-row items-center shrink-0">
            {buttonList.map((btn: BlockButton, idx: number) => (
              <DynamicButton
                key={idx}
                btn={btn}
                fallbackFill="#c2b7a3"
                fallbackText="#1a1a1a"
                globalSettings={globalSettings}
                className="text-[13px]! leading-4.5! px-6! py-2! min-h-9! border-0!"
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
