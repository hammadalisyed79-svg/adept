/**
 * Capture Technology inquiry form screenshots at multiple viewports.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3460";
const outDir = join(process.cwd(), "visual-review", "technology-inquiry");
mkdirSync(outDir, { recursive: true });

const widths = [390, 768, 1024, 1440];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(350);
  await page.evaluate(() => window.scrollTo(0, 0));
}

const browser = await chromium.launch({ headless: true });
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width <= 390 ? 844 : 900 },
  });
  const page = await context.newPage();

  await page.goto(`${baseURL}/technology/request-quote`, { waitUntil: "networkidle" });
  await settle(page);
  await page.screenshot({
    path: join(outDir, `form-overview-${width}.png`),
    fullPage: true,
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  report.push({ shot: `form-overview-${width}`, overflow, heading: await page.locator("h1").innerText() });

  for (const [type, label] of [
    ["erp", "ERP"],
    ["website", "Website"],
    ["marketing", "Marketing"],
  ]) {
    await page.goto(`${baseURL}/technology/request-quote?type=${type}`, {
      waitUntil: "networkidle",
    });
    await settle(page);
    const pressed = page.getByRole("button", { pressed: true });
    const selected = (await pressed.count()) ? await pressed.first().innerText() : "none";
    await page.screenshot({
      path: join(outDir, `${type}-selected-${width}.png`),
      fullPage: true,
    });
    report.push({
      shot: `${type}-selected-${width}`,
      selected,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      ),
    });
  }

  // CTA pages at one mobile + desktop
  if (width === 390 || width === 1440) {
    for (const path of [
      "/technology",
      "/technology/erp",
      "/technology/website-development",
      "/technology/digital-marketing",
    ]) {
      await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
      await settle(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);
      const slug = path.replace(/\//g, "_").replace(/^_/, "");
      await page.screenshot({
        path: join(outDir, `cta-${slug}-${width}.png`),
        fullPage: false,
      });
    }
  }

  await context.close();
}

writeFileSync(join(outDir, "qa-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ok: true, outDir, shots: report.length }, null, 2));
await browser.close();
