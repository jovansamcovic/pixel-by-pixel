import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#FFF6EB] px-5 pb-8 pt-6 text-[#0D2734] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-col gap-3 border-t-2 border-[#0D2734]/15 pt-6 text-[10px] leading-5 text-[#0D2734]/60 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl">{t("disclaimer")}</p>
          <p className="shrink-0">{t("copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}