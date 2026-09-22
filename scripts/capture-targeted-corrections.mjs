import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const phase = process.argv[2] === "after" ? "after" : "before";
const base =
  process.argv[3] ||
  (phase === "after" ? "http://127.0.0.1:3458" : "https://www.adeptfragrances.com");
const out = join(process.cwd(), "visual-review/targeted-corrections", phase);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
for (const vp of [
  { n: "1440", w: 1440, h: 900 },
  { n: "390", w: 390, h: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(500);
  const section = page.locator("section").filter({ hasText: "Beyond Manufacturing" }).first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await section.screenshot({ path: join(out, `tech-cards__${vp.n}.png`) });

  await page.goto(`${base}/request-quote`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(out, `request-quote__${vp.n}.png`),
    fullPage: true,
  });

  await page.goto(`${base}/technology/request-quote`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(out, `technology-request-quote__${vp.n}.png`),
    fullPage: true,
  });

  await page.goto(`${base}/about`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(out, `about-hero__${vp.n}.png`), fullPage: false });

  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ phase, base, out }));
