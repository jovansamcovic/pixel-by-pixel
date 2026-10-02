"use client";

import React, {
  type ElementType,
  type PropsWithChildren,
} from "react";

export interface DeviceClientCompositeProps {
  isMobile: boolean;
  mobile: ElementType;
  desktop: ElementType;
  [key: string]: unknown;
}

export const DeviceClientComposite = ({
  isMobile,
  mobile: MobileComponent,
  desktop: DesktopComponent,
  children,
  ...props
}: PropsWithChildren<DeviceClientCompositeProps>) => {
  const Component = isMobile
    ? MobileComponent
    : DesktopComponent;

  return (
    <Component {...props}>
      {children}
    </Component>
  );
};