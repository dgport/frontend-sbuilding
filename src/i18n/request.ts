import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages = {
    main: (await import(`../messages/${locale}/main.json`)).default,
    contact: (await import(`../messages/${locale}/contact.json`)).default,
    calculator: (await import(`../messages/${locale}/calculator.json`)).default,
    meta: (await import(`../messages/${locale}/meta.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
