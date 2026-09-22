/**
 * Capture Technology & Growth pages for implementation report.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3456";
const outDir = join(process.cwd(), "visual-review", "technology-growth");
mkdirSync(outDir, { recursive: true });

const shots = [
  { slug: "homepage", path: "/", widths: [1440, 390] },
  { slug: "technology", path: "/technology", widths: [1440, 390] },
  { slug: "technology-erp", path: "/technology/erp", widths: [1440, 390] },
  {
    slug: "technology-website",
    path: "/technology/website-development",
    widths: [1440, 390],
  },
  {
    slug: "technology-marketing",
    path: "/technology/digital-marketing",
    widths: [1440, 390],
  },
  { slug: "fragrance-trading", path: "/services/fragrance-trading", widths: [1440] },
  { slug: "packaging", path: "/packaging", widths: [1440] },
];

async function preparePage(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(400);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (const shot of shots) {
  for (const width of shot.widths) {
    const page = await browser.newPage({
      viewport: { width, height: width < 800 ? 844 : 900 },
    });
    const url = `${baseURL}${shot.path}`;
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await preparePage(page);
    const file = join(outDir, `${shot.slug}__${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const title = await page.title();
    results.push({
      path: shot.path,
      width,
      status: res?.status() ?? 0,
      title,
      file,
    });
    await page.close();
    console.log("OK", shot.slug, width, res?.status());
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
