import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] || "http://localhost:3459";
const out = join(process.cwd(), "visual-review/chatbot-openai");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function shot(name, viewport, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  await fn(page);
  await page.screenshot({ path: join(out, name), fullPage: false });
  await ctx.close();
}

async function openAssistant(page) {
  await page.getByRole("button", { name: /ADEPT Assistant/i }).click();
  const dialog = page.getByRole("dialog", { name: /ADEPT Assistant/i });
  await dialog.waitFor({ state: "visible" });
  return dialog;
}

// Desktop closed
await shot("desktop-closed__1440.png", { width: 1440, height: 900 }, async () => {});

// Desktop open
await shot("desktop-open__1440.png", { width: 1440, height: 900 }, async (page) => {
  await openAssistant(page);
  await page.waitForTimeout(300);
});

// Desktop in use
await shot("desktop-in-use__1440.png", { width: 1440, height: 900 }, async (page) => {
  const dialog = await openAssistant(page);
  await dialog.getByPlaceholder(/Ask about services/i).fill("Tell me about fragrance concentrates");
  await dialog.getByRole("button", { name: "Send" }).click();
  await dialog.getByText(/ADEPT offers fragrance trading/i).waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
});

// Mobile closed
await shot("mobile-closed__390.png", { width: 390, height: 844 }, async () => {});

// Mobile open
await shot("mobile-open__390.png", { width: 390, height: 844 }, async (page) => {
  await openAssistant(page);
  await page.waitForTimeout(300);
});

// Mobile in use (quick action)
await shot("mobile-in-use__390.png", { width: 390, height: 844 }, async (page) => {
  const dialog = await openAssistant(page);
  await dialog.getByRole("button", { name: "Packaging Requirements" }).click();
  await dialog.getByText(/ADEPT supplies packaging/i).waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
});

await browser.close();
console.log(JSON.stringify({ out, base }));
