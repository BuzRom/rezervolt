export const site = {
  name: "Rezervolt",
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

export const siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? site.domain}`;

export const hiddenContacts = new Set<string>(["address", "hours", "socials"]);

export const hiddenSections = new Set<string>(["projects"]);

export const navLinks = (
  [
    { id: "calculator", labelKey: "calculator" },
    { id: "services", labelKey: "services" },
    { id: "process", labelKey: "process" },
    { id: "projects", labelKey: "projects" },
    { id: "faq", labelKey: "faq" },
  ] as const
).filter((link) => !hiddenSections.has(link.id));
