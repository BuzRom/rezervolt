/**
 * Day-ahead market (РДН) prices from АТ «Оператор ринку» (oree.com.ua) and the battery-arbitrage
 * math on top of them: a battery charges from the grid in the cheapest hours and covers the
 * site's load in the most expensive ones.
 *
 * Runtime-import-free on purpose: `scripts/update-dam-snapshot.mjs` loads it with plain Node.
 */

export const DAM_SOURCE_URL = "https://www.oree.com.ua/index.php/pricectr";

/** The "Hourly purchase/sale prices" page posts here; one call returns a whole month. */
const ENDPOINT = "https://www.oree.com.ua/index.php/pricectr/data_view";

export type Cycles = 1 | 2;
export type DamPeriod = "month" | "year";

export type DamDay = {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** ₴/kWh ex VAT, one per delivery hour (23 or 25 on DST-change days). */
  prices: number[];
};

export type Battery = { durationHours: number; efficiency: number; gridFee: number };

export type Arbitrage = {
  /** Net income per 1 kWh of usable capacity per year, ₴ ex VAT. */
  perKwhYear: number;
  /** Average DAM price of the charged / discharged energy, ₴/kWh ex VAT. */
  chargePrice: number;
  dischargePrice: number;
};

export type DamWindow = {
  from: string;
  to: string;
  days: number;
  /** Average price per hour of the day (0 = 00:00–01:00), ₴/kWh ex VAT. */
  profile: number[];
  /** The plan for the average day, per hour: 1 charge, -1 discharge, 0 idle. */
  schedule: Record<Cycles, number[]>;
  arbitrage: Record<Cycles, Arbitrage>;
};

export type DamStats = {
  source: "live" | "snapshot";
  fetchedAt: string;
  windows: Record<DamPeriod, DamWindow>;
};

// --------------------------------------------------------------------------------------------
//  Fetching
// --------------------------------------------------------------------------------------------

/** Extra `fetch` options, e.g. Next's `{ next: { revalidate } }`. */
type FetchInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

/** Parses the month table: a date cell followed by hourly prices in ₴/MWh. */
export function parseMonth(html: string): DamDay[] {
  const body = html.indexOf("<tbody");
  if (body < 0) return [];

  const days: DamDay[] = [];
  for (const row of html.slice(body).split("<tr").slice(1)) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1].trim());
    const date = cells[0]?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!date) continue;

    const prices = cells.slice(1).filter(Boolean).map(Number);
    if (prices.length < 23 || prices.some((p) => !Number.isFinite(p))) continue;
    days.push({
      date: `${date[3]}-${date[2]}-${date[1]}`,
      prices: prices.map((p) => p / 1000),
    });
  }
  return days;
}

async function fetchMonth(month: string, init?: FetchInit): Promise<DamDay[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: new URLSearchParams({ date: month, market: "DAM", zone: "IPS" }).toString(),
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
  if (!res.ok) throw new Error(`DAM ${month}: HTTP ${res.status}`);

  const { content } = (await res.json()) as { content?: string };
  return parseMonth(content ?? "");
}

/** Hourly prices for the last ~13 months (the current one included), oldest first. */
export async function fetchDamDays(now: Date, init?: FetchInit): Promise<DamDay[]> {
  const months = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    return `${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
  });
  const results = await Promise.all(months.map((month) => fetchMonth(month, init)));
  return results.flat().sort((a, b) => a.date.localeCompare(b.date));
}

// --------------------------------------------------------------------------------------------
//  Arbitrage
// --------------------------------------------------------------------------------------------

/**
 * The most profitable charge/discharge plan for one day, for 1 kWh of usable capacity.
 * Dynamic programming over (state of charge, discharged hours): the battery starts empty, moves
 * at full power (1 / durationHours of capacity per hour) and makes at most `cycles` full cycles.
 * Charged energy is bought at `price + gridFee`; discharged energy (minus losses) replaces energy
 * the site would buy at that hour's `price + gridFee`.
 */
export function planDay(prices: number[], battery: Battery, cycles: Cycles) {
  const levels = battery.durationHours;
  const maxOut = levels * cycles;
  const width = maxOut + 1;
  const step = 1 / levels;

  let best: number[] = new Array((levels + 1) * width).fill(-Infinity);
  best[0] = 0;
  const moves: Int8Array[] = [];

  for (const price of prices) {
    const value = (price + battery.gridFee) * step;
    const next: number[] = new Array(best.length).fill(-Infinity);
    const move = new Int8Array(best.length);
    const relax = (state: number, total: number, action: number) => {
      if (total > next[state]) {
        next[state] = total;
        move[state] = action;
      }
    };

    for (let soc = 0; soc <= levels; soc++) {
      for (let out = 0; out <= maxOut; out++) {
        const total = best[soc * width + out];
        if (total === -Infinity) continue;
        relax(soc * width + out, total, 0); // idle first: wins ties
        if (soc < levels) relax((soc + 1) * width + out, total - value, 1);
        if (soc > 0 && out < maxOut) {
          relax((soc - 1) * width + out + 1, total + value * battery.efficiency, -1);
        }
      }
    }
    moves.push(move);
    best = next;
  }

  let end = 0;
  for (let state = 1; state < best.length; state++) if (best[state] > best[end]) end = state;

  const actions: number[] = new Array(prices.length).fill(0);
  let soc = Math.floor(end / width);
  let out = end % width;
  for (let hour = prices.length - 1; hour >= 0; hour--) {
    const action = moves[hour][soc * width + out];
    actions[hour] = action;
    if (action === 1) soc -= 1;
    if (action === -1) {
      soc += 1;
      out -= 1;
    }
  }

  return { profit: best[end], actions };
}

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

function arbitrage(days: DamDay[], battery: Battery, cycles: Cycles): Arbitrage {
  let profit = 0;
  let charged = 0;
  let chargeSum = 0;
  let discharged = 0;
  let dischargeSum = 0;

  for (const day of days) {
    const plan = planDay(day.prices, battery, cycles);
    profit += plan.profit;
    plan.actions.forEach((action, hour) => {
      if (action === 1) {
        charged += 1;
        chargeSum += day.prices[hour];
      } else if (action === -1) {
        discharged += 1;
        dischargeSum += day.prices[hour];
      }
    });
  }

  return {
    perKwhYear: round((profit / days.length) * 365),
    chargePrice: round(charged ? chargeSum / charged : 0, 3),
    dischargePrice: round(discharged ? dischargeSum / discharged : 0, 3),
  };
}

function windowStats(days: DamDay[], battery: Battery): DamWindow {
  const sums = new Array(24).fill(0);
  const counts = new Array(24).fill(0);
  for (const day of days) {
    // DST days shift by an hour after 03:00 — negligible in an average.
    day.prices.slice(0, 24).forEach((price, hour) => {
      sums[hour] += price;
      counts[hour] += 1;
    });
  }
  const profile = sums.map((sum, hour) => round(sum / counts[hour], 3));

  return {
    from: days[0].date,
    to: days[days.length - 1].date,
    days: days.length,
    profile,
    schedule: {
      1: planDay(profile, battery, 1).actions,
      2: planDay(profile, battery, 2).actions,
    },
    arbitrage: { 1: arbitrage(days, battery, 1), 2: arbitrage(days, battery, 2) },
  };
}

/** Stats for the last 30 days and the last 365 days of the given (sorted) price history. */
export function buildDamStats(
  days: DamDay[],
  battery: Battery,
  source: DamStats["source"],
  fetchedAt = new Date(),
): DamStats {
  if (days.length < 30) throw new Error(`DAM: only ${days.length} days of prices`);

  return {
    source,
    fetchedAt: fetchedAt.toISOString(),
    windows: {
      month: windowStats(days.slice(-30), battery),
      year: windowStats(days.slice(-365), battery),
    },
  };
}
