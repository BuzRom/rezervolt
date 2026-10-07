export const DAM_SOURCE_URL = "https://www.oree.com.ua/index.php/pricectr";

const ENDPOINT = "https://www.oree.com.ua/index.php/pricectr/data_view";

export type Cycles = 1 | 2;
export type DamPeriod = "month" | "year";

export type DamDay = {
  date: string;
  prices: number[];
};

export type Battery = { durationHours: number; efficiency: number; gridFee: number };

export type Arbitrage = {
  perKwhYear: number;
  chargePrice: number;
  dischargePrice: number;
};

export type DamWindow = {
  from: string;
  to: string;
  days: number;
  profile: number[];
  schedule: Record<Cycles, number[]>;
  arbitrage: Record<Cycles, Arbitrage>;
};

export type DamStats = {
  source: "live" | "snapshot";
  fetchedAt: string;
  windows: Record<DamPeriod, DamWindow>;
};

type FetchInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

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

export async function fetchDamDays(now: Date, init?: FetchInit): Promise<DamDay[]> {
  const months = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    return `${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
  });
  const results = await Promise.all(months.map((month) => fetchMonth(month, init)));
  return results.flat().sort((a, b) => a.date.localeCompare(b.date));
}

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
        relax(soc * width + out, total, 0);
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

const DST_HOUR = 3;

export function clockHours(prices: number[]): (number | undefined)[] {
  if (prices.length === 23) {
    return [...prices.slice(0, DST_HOUR), undefined, ...prices.slice(DST_HOUR)];
  }
  if (prices.length === 25) {
    return [
      ...prices.slice(0, DST_HOUR),
      (prices[DST_HOUR] + prices[DST_HOUR + 1]) / 2,
      ...prices.slice(DST_HOUR + 2),
    ];
  }
  return prices.slice(0, 24);
}

function windowStats(days: DamDay[], battery: Battery): DamWindow {
  const sums = new Array(24).fill(0);
  const counts = new Array(24).fill(0);
  for (const day of days) {
    clockHours(day.prices).forEach((price, hour) => {
      if (price === undefined) return;
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
