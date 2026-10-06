/**
 * Refreshes `lib/dam-snapshot.json` — the DAM statistics the calculator falls back to when
 * oree.com.ua can't be reached (e.g. a build without network access).
 *
 *   npm run dam:snapshot
 *
 * Imports the TypeScript sources directly (Node ≥ 22.18 strips types natively).
 */
import { writeFile } from "node:fs/promises";
import { buildDamStats, fetchDamDays } from "../lib/dam.ts";
import { storage } from "../lib/calculator.ts";

const days = await fetchDamDays(new Date());
const stats = buildDamStats(days, storage, "snapshot");
const file = new URL("../lib/dam-snapshot.json", import.meta.url);

await writeFile(file, `${JSON.stringify(stats, null, 2)}\n`);

const { from, to } = stats.windows.year;
console.log(`DAM snapshot: ${days.length} days fetched, ${from} → ${to}`);
