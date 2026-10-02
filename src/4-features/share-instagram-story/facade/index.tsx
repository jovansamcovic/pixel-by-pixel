import { DeviceClientComposite } from "@/src/6-shared/ui/device-composite/device-client-composite";
import { DesktopShareInstagramStory } from "./desktop";
import { MobileShareInstagramStory } from "./mobile";
import { DonationRecord } from "@/src/5-entities/donation";

export type ShareInstagramStoryProps = {
  donation: DonationRecord;
  onClose: () => void;
  isMobile: boolean;
};

export function ShareInstagramStory(props: ShareInstagramStoryProps) {
  return (
    <DeviceClientComposite
      mobile={MobileShareInstagramStory}
      desktop={DesktopShareInstagramStory}
      {...props}
    />
  );
}
