import { DeviceClientComposite } from "@/src/6-shared/ui/device-composite/device-client-composite";
import { DesktopShareInstagramStory } from "./desktop";
import { MobileShareInstagramStory } from "./mobile";
import React from "react";

export type ShareInstagramStoryProps = {
  onClose: () => void;
  isMobile: boolean;
  children: React.ReactNode
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
