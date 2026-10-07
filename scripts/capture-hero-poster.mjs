import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = new URL("../assets/hero/", import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });

try {
  for (const theme of ["dark", "light"]) {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 2,
    });

    await page.addInitScript((value) => {
      localStorage.setItem("theme", value);
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, attributes) {
        const webgl = type === "webgl" || type === "webgl2";
        return getContext.call(
          this,
          type,
          webgl ? { ...attributes, preserveDrawingBuffer: true } : attributes,
        );
      };
    }, theme);

    await page.goto(`${base}/uk`);

    const dataUrl = await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const started = performance.now();
          const poll = () => {
            const canvas = document.querySelector("[data-hero='canvas'] .opacity-100 canvas");
            if (canvas) return resolve(canvas.toDataURL("image/png"));
            if (performance.now() - started > 30000) return reject(new Error("3D scene never became visible"));
            requestAnimationFrame(poll);
          };
          poll();
        }),
    );

    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    const file = new URL(`panel-${theme}.webp`, outDir);
    const info = await sharp(png).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(file.pathname);
    console.log(`${theme}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB → assets/hero/panel-${theme}.webp`);
    await page.close();
  }
} finally {
  await browser.close();
}
