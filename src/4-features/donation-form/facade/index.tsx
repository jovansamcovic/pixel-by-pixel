import { DesktopDonationDialog } from "./desktop";
import { MobileDonationDialog } from "./mobile";
import { DeviceClientComposite } from "@/src/6-shared/ui/device-composite/device-client-composite";

export type DonationDialogProps = {
  children: React.ReactNode;
  onClose: () => void;
  isMobile: boolean;
};

export function DonationDialog(props: DonationDialogProps) {
  return (
    <DeviceClientComposite
      mobile={MobileDonationDialog}
      desktop={DesktopDonationDialog}
      {...props}
    />
  );
}
