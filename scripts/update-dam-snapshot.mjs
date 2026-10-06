import { writeFile } from "node:fs/promises";
import { buildDamStats, fetchDamDays } from "../lib/dam.ts";
import { storage } from "../lib/calculator.ts";

const days = await fetchDamDays(new Date());
const stats = buildDamStats(days, storage, "snapshot");
const file = new URL("../lib/dam-snapshot.json", import.meta.url);

await writeFile(file, `${JSON.stringify(stats, null, 2)}\n`);

const { from, to } = stats.windows.year;
console.log(`DAM snapshot: ${days.length} days fetched, ${from} → ${to}`);
