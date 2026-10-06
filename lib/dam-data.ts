import { buildDamStats, fetchDamDays, type DamStats } from "./dam";
import { storage } from "./calculator";
import snapshot from "./dam-snapshot.json";

/**
 * DAM statistics for the calculator (server only). Prices are fetched from the Market Operator
 * and cached for 12 h — the page revalidates on the same schedule (`revalidate` in the page).
 * If oree.com.ua is unreachable, falls back to the bundled snapshot (`npm run dam:snapshot`).
 */
export async function getDamStats(): Promise<DamStats> {
  try {
    const days = await fetchDamDays(new Date(), { next: { revalidate: 43200 } });
    return buildDamStats(days, storage, "live");
  } catch (error) {
    console.warn("[dam] live prices unavailable, using the snapshot:", error);
    return snapshot as DamStats;
  }
}
