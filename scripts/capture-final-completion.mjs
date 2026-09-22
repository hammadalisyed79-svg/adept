import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = "https://www.adeptfragrances.com";
const out = join(process.cwd(), "visual-review/final-completion");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function capture(name, viewport, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  await fn(page);
  await page.screenshot({ path: join(out, name), fullPage: false });
  await ctx.close();
}

await capture("tech-cards__1440.png", { width: 1440, height: 900 }, async (page) => {
  await page.getByRole("heading", { name: /Build the Brand/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page
    .getByRole("heading", { name: /Build the Brand/i })
    .locator("xpath=ancestor::section[1]")
    .screenshot({ path: join(out, "tech-cards-section__1440.png") });
});

await capture("packaging__1440.png", { width: 1440, height: 900 }, async (page) => {
  await page.getByRole("heading", { name: /Build Every Detail/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page
    .getByRole("heading", { name: /Build Every Detail/i })
    .locator("xpath=ancestor::section[1]")
    .screenshot({ path: join(out, "packaging-section__1440.png") });
});

await capture("industries__1440.png", { width: 1440, height: 900 }, async (page) => {
  await page.getByRole("heading", { name: /Built for categories/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
});

await capture("chatbot-open__390.png", { width: 390, height: 844 }, async (page) => {
  await page.getByRole("heading", { name: /Request a quotation/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /ADEPT Assistant/i }).click();
  await page.getByRole("dialog", { name: /ADEPT Assistant/i }).waitFor({ state: "visible" });
  await page.waitForTimeout(400);
});

await capture("home__768.png", { width: 768, height: 1024 }, async () => {});
await capture("home__1024.png", { width: 1024, height: 768 }, async () => {});

await browser.close();
console.log(JSON.stringify({ out }));
