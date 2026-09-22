/**
 * Final visual correction screenshot capture.
 * Scrolls pages and waits for images with timeouts.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010";
const outDir = join(process.cwd(), "visual-review", "polish");
mkdirSync(outDir, { recursive: true });

const shots = [
  { slug: "homepage", path: "/", widths: [1440, 390] },
  { slug: "packaging", path: "/packaging", widths: [1440, 390] },
  { slug: "toll-manufacturing", path: "/services/toll-manufacturing", widths: [1440, 390] },
  { slug: "request-quote", path: "/request-quote", widths: [1440, 390] },
];

async function preparePage(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
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
            setTimeout(done, 4000);
          }),
      ),
    );
  });
}

async function imageAudit(page) {
  return page.evaluate(() =>
    Array.from(document.images).map((img) => ({
      src: (img.currentSrc || img.src).split("?")[0],
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      ok: img.complete && img.naturalWidth > 0,
    })),
  );
}

console.log(`capturing against ${baseURL}`);
const browser = await chromium.launch({ headless: true });
const issues = [];
const audits = {};

for (const shot of shots) {
  for (const width of shot.widths) {
    const height = width <= 400 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const label = `${shot.slug}__${width}`;
    try {
      console.log(`goto ${shot.path} @ ${width}`);
      const res = await page.goto(`${baseURL}${shot.path}`, {
        waitUntil: "load",
        timeout: 60000,
      });
      if (!res?.ok()) issues.push(`${label}: HTTP ${res?.status()}`);
      await preparePage(page);
      const audit = await imageAudit(page);
      audits[label] = audit;
      const adeptFailed = audit.filter(
        (a) => a.src.includes("/images/adept/") && !a.ok,
      );
      if (adeptFailed.length) {
        issues.push(`${label}: ${adeptFailed.length} adept image(s) failed decode`);
        for (const f of adeptFailed) console.log(`  fail ${f.src}`);
      }
      const file = join(outDir, `${label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const okCount = audit.filter((a) => a.ok).length;
      console.log(`wrote ${file} (images ok=${okCount}/${audit.length})`);
    } catch (err) {
      issues.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
      console.error(`FAIL ${label}`, err);
    }
    await context.close();
  }
}

await browser.close();
writeFileSync(join(outDir, "image-audit.json"), JSON.stringify({ baseURL, audits, issues }, null, 2));
console.log(`issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
}
