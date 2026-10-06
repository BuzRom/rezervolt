import { buildDamStats, fetchDamDays, type DamStats } from "./dam";
import { storage } from "./calculator";
import snapshot from "./dam-snapshot.json";

export async function getDamStats(): Promise<DamStats> {
  try {
    const days = await fetchDamDays(new Date(), { next: { revalidate: 43200 } });
    return buildDamStats(days, storage, "live");
  } catch (error) {
    console.warn("[dam] live prices unavailable, using the snapshot:", error);
    return snapshot as DamStats;
  }
}
