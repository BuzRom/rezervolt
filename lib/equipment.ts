/**
 * Equipment brands for the "Equipment" section, grouped by their role in a solar system.
 * Logos live in `public/brands/` (official artwork from the manufacturers' websites; ABB and
 * JA Solar — from Wikimedia Commons). `width`/`height` are the files' intrinsic proportions.
 * Category copy (tag, title, description, specs) lives in `messages/*.json` → `Equipment.categories`.
 */

export type EquipmentId = "panels" | "inverters" | "batteries" | "protection";

export type Brand = {
  name: string;
  /** `scale` nudges the optical size of unusually light (> 1) or heavy (< 1) marks. */
  logo: { src: string; width: number; height: number; scale?: number };
  /** The logo's colors don't read on a dark background → show it white in dark mode. */
  invertOnDark?: boolean;
};

export const equipment: { id: EquipmentId; brands: Brand[] }[] = [
  {
    id: "panels",
    brands: [
      {
        name: "LONGi Solar",
        logo: { src: "/brands/longi.svg", width: 294, height: 111, scale: 1.2 },
      },
      {
        name: "JA Solar",
        logo: { src: "/brands/ja-solar.svg", width: 453, height: 80 },
        invertOnDark: true,
      },
      {
        name: "Risen Energy",
        logo: { src: "/brands/risen.svg", width: 638, height: 219, scale: 0.85 },
        invertOnDark: true,
      },
    ],
  },
  {
    id: "inverters",
    brands: [{ name: "Deye", logo: { src: "/brands/deye.png", width: 1705, height: 680 } }],
  },
  {
    id: "batteries",
    brands: [
      { name: "Dyness", logo: { src: "/brands/dyness.svg", width: 139, height: 21 } },
      {
        name: "Pylontech",
        logo: { src: "/brands/pylontech.svg", width: 219, height: 44, scale: 1.15 },
        invertOnDark: true,
      },
    ],
  },
  {
    id: "protection",
    brands: [
      { name: "ABB", logo: { src: "/brands/abb.svg", width: 86, height: 33, scale: 0.85 } },
      { name: "ETI", logo: { src: "/brands/eti.svg", width: 346, height: 184, scale: 0.9 } },
      { name: "Hager", logo: { src: "/brands/hager.png", width: 256, height: 86 } },
    ],
  },
];
