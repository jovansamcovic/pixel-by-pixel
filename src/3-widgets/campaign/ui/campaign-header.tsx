import { PixelHeartIcon } from "@/src/6-shared/icons/heaer-icon-pixel"
import { useTranslations } from "next-intl";

export const CampaignHeader = ({ formattedPrice }: { formattedPrice: string }) => {
    const t = useTranslations("CampaignWidget");
    return (
        <header className="mb-5 text-left">
            <p className="flex items-center gap-2 text-[13px] uppercase tracking-[0.04em] text-[#0D2734]">
                <PixelHeartIcon className="size-[18px]" />
                {t("priceLine", { price: formattedPrice })}
            </p>

            <h2 className="mt-3 uppercase text-[48px] leading-[0.9] tracking-[-0.02em] sm:text-6xl">
                <span className="block text-[#0D2734]">{t("headline.line1")}</span>
                <span className="block text-[#E52336]">{t("headline.line2")}</span>
                <span className="block text-[#E52336]">{t("headline.line3")}</span>
            </h2>

            <p className="mt-4 max-w-[300px] text-[17px] leading-[1.35] text-[#0D2734] sm:max-w-md sm:text-[19px]">
                {t("description")}
            </p>
        </header>
    )
}