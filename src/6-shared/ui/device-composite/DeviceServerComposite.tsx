import React, {
  type ElementType,
  type PropsWithChildren,
} from "react";

import { getDeviceDetector } from "../../utils";

export interface DeviceCompositeProps {
  params?: Promise<Record<string, unknown>>;
  mobile: ElementType;
  desktop: ElementType;
  [key: string]: unknown;
}

export const DeviceServerComposite = async ({
  mobile: MobileComponent,
  desktop: DesktopComponent,
  children,
  ...props
}: PropsWithChildren<DeviceCompositeProps>) => {
  const deviceInfo = await getDeviceDetector();

  const Component = deviceInfo.isMobile
    ? MobileComponent
    : DesktopComponent;

  return (
    <Component {...props}>
      {children}
    </Component>
  );
};