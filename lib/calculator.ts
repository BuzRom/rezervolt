import type { Arbitrage } from "./dam";

export const VAT_RATE = 0.2;

export const DEFAULT_TARIFF = 15;

export const solar = {
  specificYield: 1150,
  coverage: 0.6,
  selfUse: 0.9,
  minKw: 3,
  prices: {
    panels: 7000,
    inverter: 4000,
    mounting: 3000,
    electrical: 2500,
    installation: 5000,
  },
  fixed: 25000,
};

export const storage = {
  durationHours: 2,
  efficiency: 0.9,
  gridFee: 2.2,
  availability: 0.95,
  prices: {
    batteries: 6500,
    hybridInverter: 5500,
    cabinet: 1200,
    installation: 1000,
  },
  fixed: 30000,
};

export const consumptionSteps = [
  200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000,
  10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000,
];

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

function roundKw(kw: number) {
  const step = kw < 30 ? 0.5 : kw < 100 ? 1 : 5;
  return Math.round(kw / step) * step;
}

export function calcSolar(monthlyKwh: number, tariff: number) {
  const annualKwh = monthlyKwh * 12;
  const kw = Math.max(solar.minKw, roundKw((annualKwh * solar.coverage) / solar.specificYield));
  const generation = kw * solar.specificYield;
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
