import { useTranslations } from "next-intl";

export type DonationRecord = {
  id: number;
  color: string;
};

type DonationBadgeProps = {
  donation: DonationRecord;
};

export function DonationBadge({ donation }: DonationBadgeProps) {
  const t = useTranslations("DonationBadge");

  return (
    <div className="story-person-card">
      <span className="story-pixel-swatch" style={{ background: donation.color }}>
        #{donation.id}
      </span>
      <small>{t("label")}</small>
    </div>
  );
}