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
    batumi: (await import(`../messages/${locale}/batumi.json`)).default,
    status: (await import(`../messages/${locale}/status.json`)).default,
    goderdzi: (await import(`../messages/${locale}/goderdzi.json`)).default,
    calculator: (await import(`../messages/${locale}/calculator.json`)).default,
  };

  return {
    locale,
    messages,
  };
});