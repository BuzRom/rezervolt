/**
 * Payback calculator: price list, assumptions and the (pure) math behind the estimate.
 *
 * All figures are approximate Ukrainian market prices (2026) — edit them here, the UI and the
 * DAM arbitrage pick the changes up. Equipment and works are priced in ₴ **without VAT**; VAT is
 * added on top. Savings are counted with VAT too, so the payback is the same for VAT payers
 * (who reclaim it on both sides) and for households.
 *
 * Runtime-import-free on purpose: `scripts/update-dam-snapshot.mjs` loads it with plain Node.
 */

import type { Arbitrage } from "./dam";

export const VAT_RATE = 0.2;

/** Default electricity price for the solar estimate, ₴/kWh incl. VAT (editable in the UI). */
export const DEFAULT_TARIFF = 15;

export const solar = {
  /** Annual output of 1 kWp in Ukraine (north ≈ 1,050, Kyiv ≈ 1,150, south ≈ 1,350), kWh. */
  specificYield: 1150,
  /**
   * The plant is sized to cover this share of annual consumption: the summer surplus would be
   * exported at near-zero midday DAM prices, so covering 100% doesn't pay off.
   */
  coverage: 0.6,
  /** Share of generation consumed on site — the exported rest isn't counted as savings. */
  selfUse: 0.9,
  minKw: 3,
  /** ₴ per kWp, ex VAT. */
  prices: {
    panels: 7000, // LONGi / JA Solar / Risen, ≈ 0.17 $/W
    inverter: 4000, // Deye on-grid
    mounting: 3000, // roof / ground structures
    electrical: 2500, // DC/AC cabling, protection (ABB / ETI / Hager), metering
    installation: 5000,
  },
  /** One-off: design, approvals, delivery, commissioning; ₴ ex VAT. */
  fixed: 25000,
};

export const storage = {
  /**
   * Usable capacity ÷ rated power (a 2-hour, 0.5C system — typical for C&I LFP). Must be a whole
   * number of hours: the DAM arbitrage plans the battery hour by hour.
   */
  durationHours: 2,
  /** Round-trip efficiency, battery + inverter. */
  efficiency: 0.9,
  /**
   * Transmission + distribution + supplier margin, ₴/kWh ex VAT. Paid on charged energy and
   * avoided on discharged energy, so effectively only the losses cost it.
   */
  gridFee: 2.2,
  /** Share of days the system actually cycles (maintenance, days with low on-site load). */
  availability: 0.95,
  prices: {
    batteries: 6500, // ₴ per kWh, LFP (Dyness / Pylontech)
    hybridInverter: 5500, // ₴ per kW of power, Deye hybrid inverter / PCS
    cabinet: 1200, // ₴ per kWh: racks / cabinet, BMS, protection, cabling
    installation: 1000, // ₴ per kWh
  },
  /** One-off: design, EMS set-up for the DAM schedule, commissioning; ₴ ex VAT. */
  fixed: 30000,
};

/** Slider stops: monthly consumption, kWh (a home → a plant). */
export const consumptionSteps = [
  200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000,
  10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000,
];

/** Slider stops: usable storage capacity, kWh. */
export const capacitySteps = [
  10, 15, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000,
];

export type CostItem =
  | "panels"
  | "inverter"
  | "mounting"
  | "electrical"
  | "design"
  | "batteries"
  | "hybridInverter"
  | "cabinet"
  | "ems"
  | "installation";

export type CostLine = { id: CostItem; group: "equipment" | "works"; amount: number };

export type CostEstimate = {
  lines: CostLine[];
  net: number;
  vat: number;
  total: number;
};

function estimate(lines: CostLine[]): CostEstimate {
  const net = lines.reduce((sum, line) => sum + line.amount, 0);
  const vat = net * VAT_RATE;
  return { lines, net, vat, total: net + vat };
}

/** Nice capacity steps: 0.5 kW for homes, whole kW for businesses, 5 kW for plants. */
function roundKw(kw: number) {
  const step = kw < 30 ? 0.5 : kw < 100 ? 1 : 5;
  return Math.round(kw / step) * step;
}

export function calcSolar(monthlyKwh: number, tariff: number) {
  const annualKwh = monthlyKwh * 12;
  const kw = Math.max(solar.minKw, roundKw((annualKwh * solar.coverage) / solar.specificYield));
  const generation = kw * solar.specificYield;
  // A minimum-size plant on a small site can't use more on site than the coverage share.
  const usedOnSite = Math.min(generation * solar.selfUse, annualKwh * solar.coverage);
  const savings = usedOnSite * tariff;
  const p = solar.prices;
  const cost = estimate([
    { id: "panels", group: "equipment", amount: kw * p.panels },
    { id: "inverter", group: "equipment", amount: kw * p.inverter },
    { id: "mounting", group: "equipment", amount: kw * p.mounting },
    { id: "electrical", group: "equipment", amount: kw * p.electrical },
    { id: "installation", group: "works", amount: kw * p.installation },
    { id: "design", group: "works", amount: solar.fixed },
  ]);

  return { kw, generation, savings, cost, payback: cost.total / savings };
}

/** `arbitrage.perKwhYear` comes from real DAM prices (see `lib/dam.ts`). */
export function calcStorage(capacityKwh: number, arbitrage: Arbitrage) {
  const powerKw = capacityKwh / storage.durationHours;
  const savings =
    capacityKwh * arbitrage.perKwhYear * storage.availability * (1 + VAT_RATE);
  const p = storage.prices;
  const cost = estimate([
    { id: "batteries", group: "equipment", amount: capacityKwh * p.batteries },
    { id: "hybridInverter", group: "equipment", amount: powerKw * p.hybridInverter },
    { id: "cabinet", group: "equipment", amount: capacityKwh * p.cabinet },
    { id: "installation", group: "works", amount: capacityKwh * p.installation },
    { id: "ems", group: "works", amount: storage.fixed },
  ]);

  return {
    powerKw,
    savings,
    cost,
    payback: savings > 0 ? cost.total / savings : Infinity,
  };
}
