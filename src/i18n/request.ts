import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

const isSupportedLocale = (
  locale: string | undefined,
): locale is Locale => {
  return routing.locales.some(
    (supportedLocale) => supportedLocale === locale,
  );
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = isSupportedLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});