import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Ukrainian is the primary market; English for international leads.
  locales: ["uk", "en"],
  defaultLocale: "uk",
  // Always prefix the locale so we get /uk and /en (and `/` redirects to /uk).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
