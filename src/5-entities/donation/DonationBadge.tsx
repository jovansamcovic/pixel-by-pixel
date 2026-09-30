export type DonationRecord = {
  id: number;
  color: string;
  name: string;
  message: string;
};

type DonationBadgeProps = {
  donation: DonationRecord;
};

export function DonationBadge({ donation }: DonationBadgeProps) {
  return (
    <div className="story-person-card">
      <span className="story-pixel-swatch" style={{ background: donation.color }}>
        #{donation.id}
      </span>
      <div>
        <small>Moj piksel dobrote</small>
        <strong>{donation.name}</strong>
        <p>„{donation.message}”</p>
      </div>
    </div>
  );
}
