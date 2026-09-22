/**
 * Capture + image/visual audit for Technology final correction.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3457";
const outDir = join(process.cwd(), "visual-review", "technology-final");
mkdirSync(outDir, { recursive: true });

const pages = [
  "/technology",
  "/technology/erp",
  "/technology/website-development",
  "/technology/digital-marketing",
];
const widths = [390, 768, 1024, 1440];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(400);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve(undefined);
            const done = () => resolve(undefined);
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 3000);
          }),
      ),
    );
  });
}

async function audit(page) {
  return page.evaluate(() => {
    const images = Array.from(document.images).map((img) => ({
      src: (img.currentSrc || img.src).split("?")[0],
      naturalWidth: img.naturalWidth,
      complete: img.complete,
      broken: img.complete && img.naturalWidth === 0,
    }));
    const techVisuals = Array.from(
      document.querySelectorAll("[data-tech-visual]"),
    ).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        variant: el.getAttribute("data-tech-visual"),
        width: Math.round(r.width),
        height: Math.round(r.height),
        ok: r.width > 40 && r.height > 40,
      };
    });
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    return {
      brokenImages: images.filter((i) => i.broken),
      imageCount: images.length,
      techVisuals,
      techVisualsOk: techVisuals.every((v) => v.ok),
      overflow,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const report = [];

for (const path of pages) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: width < 800 ? 844 : 900 },
    });
    const res = await page.goto(`${baseURL}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await settle(page);
    const a = await audit(page);
    const slug = path.replace(/\//g, "-").replace(/^-/, "") || "home";
    // Capture desktop/mobile pair for report (390 + 1440)
    if (width === 390 || width === 1440) {
      const file = join(outDir, `${slug}__${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
    }
    report.push({
      path,
      width,
      status: res?.status() ?? 0,
      ...a,
    });
    console.log(
      path,
      width,
      res?.status(),
      "broken=",
      a.brokenImages.length,
      "visualsOk=",
      a.techVisualsOk,
      "overflow=",
      a.overflow,
    );
    await page.close();
  }
}

await browser.close();
writeFileSync(join(outDir, "audit.json"), JSON.stringify(report, null, 2));
const failures = report.filter(
  (r) =>
    r.status !== 200 ||
    r.brokenImages.length > 0 ||
    !r.techVisualsOk ||
    r.overflow,
);
console.log("FAILURES", failures.length);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exit(1);
}
