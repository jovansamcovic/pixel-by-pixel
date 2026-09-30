import { UAParser } from "ua-parser-js";

export type DeviceInfo = {
  type: "mobile" | "tablet" | "desktop";
  isMobile: boolean;
  os?: string;
  browser?: string;
};

export function getDeviceInfo(userAgent: string | undefined): DeviceInfo {
  if (!userAgent) {
    return { type: "desktop", isMobile: false };
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const type = device.type === "mobile" || device.type === "tablet" ? device.type : "desktop";

  return {
    type,
    isMobile: type === "mobile" || type === "tablet",
    os: parser.getOS().name,
    browser: parser.getBrowser().name,
  };
}