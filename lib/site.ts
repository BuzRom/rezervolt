/**
 * Global, non-translatable site constants (brand, contacts, navigation anchors).
 * All user-facing copy lives in `messages/{locale}.json`.
 */

export const site = {
  name: "REZERVOLT",
  // The name is used across the whole site. The domain is still a placeholder — set the real one
  // (metadataBase / Open Graph URLs and the JSON-LD `url` are built from it).
  domain: "rezervolt.solar",
  email: "tion325@gmail.com",
  phone: "+38 (097) 929-27-96",
  phoneHref: "+380979292796",
  address: { uk: "Київ, вул. Сонячна, 1", en: "1 Soniachna St, Kyiv" },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const;

/**
 * Contact details kept in the data but not shown for now: address and hours (contacts block +
 * footer) and the social links (footer).
 */
export const hiddenContacts = new Set<string>(["address", "hours", "socials"]);

/**
 * Sections that are built but switched off for now: they aren't rendered on the page
 * (`app/[locale]/page.tsx`) and drop out of the navigation. Remove an id to bring it back.
 */
export const hiddenSections = new Set<string>(["projects"]);

/** In-page navigation anchors, in page order. `labelKey` maps to the `Nav` message namespace. */
export const navLinks = (
  [
    { id: "calculator", labelKey: "calculator" },
    { id: "services", labelKey: "services" },
    { id: "process", labelKey: "process" },
    { id: "projects", labelKey: "projects" },
    { id: "faq", labelKey: "faq" },
  ] as const
).filter((link) => !hiddenSections.has(link.id));
