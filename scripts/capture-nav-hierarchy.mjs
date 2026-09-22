import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const phase = process.argv[2] === "after" ? "after" : "before";
const base = process.argv[3] || (phase === "after" ? "http://localhost:3459" : "https://www.adeptfragrances.com");
const out = join(process.cwd(), "visual-review/nav-hierarchy", phase);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });

// Desktop dropdown on /technology/ai-support
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/technology/ai-support`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);
  const solutions = page.locator('nav[aria-label="Primary"] button', { hasText: "Solutions" });
  await solutions.hover();
  await page.waitForTimeout(500);
  const dropdown = page.locator('nav[aria-label="Primary"] .group ul').first();
  await dropdown.waitFor({ state: "visible", timeout: 10000 });
  await page.screenshot({ path: join(out, "solutions-dropdown__1440.png") });
  await dropdown.screenshot({ path: join(out, "solutions-dropdown-panel__1440.png") });
  await ctx.close();
}

// Mobile accordion
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/technology/ai-support`, { waitUntil: "networkidle", timeout: 90000 });
  const openBtn = page.getByRole("button", { name: "Open menu" });
  await openBtn.waitFor({ state: "visible", timeout: 10000 });
  await openBtn.click();
  await page.getByRole("button", { name: "Close menu" }).waitFor({ state: "visible", timeout: 5000 });
  const solutions = page.locator('nav[aria-label="Mobile"] button', { hasText: "Solutions" });
  await solutions.waitFor({ state: "visible", timeout: 5000 });
  await solutions.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, "solutions-mobile__390.png"), fullPage: false });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify({ phase, base, out }));
