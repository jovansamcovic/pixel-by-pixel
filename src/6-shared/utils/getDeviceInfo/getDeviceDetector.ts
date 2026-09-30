import { cookies } from "next/headers";
import { getDeviceInfo } from "./getDeviceInfo";

export const getDeviceDetector = async () => {
  const cookieStore = await cookies();
  const userAgent = cookieStore.get("cookie_string")?.value;
  return getDeviceInfo(userAgent);
};