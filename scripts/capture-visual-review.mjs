/**
 * Safe visual QA screenshot capture.
 * - Does not submit forms
 * - Does not write to any database
 * Run against a local Next server (see scripts/run-visual-qa.mjs).
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010";
const outDir = join(process.cwd(), "visual-review");

const viewports = [
  { name: "1440-desktop", width: 1440, height: 900 },
  { name: "1024-laptop", width: 1024, height: 768 },
  { name: "768-tablet", width: 768, height: 1024 },
  { name: "390-mobile", width: 390, height: 844 },
];

const pages = [
  { slug: "homepage", path: "/" },
  { slug: "packaging", path: "/packaging" },
  { slug: "perfume-bottles", path: "/packaging/perfume-bottles" },
  { slug: "caps", path: "/packaging/caps" },
  { slug: "fragrance-trading", path: "/services/fragrance-trading" },
  { slug: "toll-manufacturing", path: "/services/toll-manufacturing" },
  { slug: "private-label", path: "/services/private-label" },
  { slug: "request-quote", path: "/request-quote" },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const route of pages) {
    const url = `${baseURL}${route.path}`;
    const file = join(outDir, `${route.slug}__${vp.name}.png`);
    try {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      if (!res || !res.ok()) {
        issues.push(`${route.slug} @ ${vp.name}: HTTP ${res?.status() ?? "no response"}`);
      }
      // Settle layout / images
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          overflowX: doc.scrollWidth > doc.clientWidth + 2,
        };
      });
      if (overflow.overflowX) {
        issues.push(
          `${route.slug} @ ${vp.name}: horizontal overflow (${overflow.scrollWidth} > ${overflow.clientWidth})`,
        );
      }
      await page.screenshot({ path: file, fullPage: true });
      console.log(`wrote ${file}`);
    } catch (err) {
      issues.push(`${route.slug} @ ${vp.name}: ${err instanceof Error ? err.message : String(err)}`);
      console.error(`FAIL ${route.slug} @ ${vp.name}`, err);
    }
  }

  // Quick nav check on homepage mobile/desktop
  if (vp.width <= 768) {
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    const open = page.getByRole("button", { name: "Open menu" });
    if (await open.isVisible()) {
      await open.click();
      const mobileNav = page.getByRole("navigation", { name: "Mobile" });
      if (!(await mobileNav.isVisible())) {
        issues.push(`mobile nav not visible @ ${vp.name}`);
      } else {
        await page.screenshot({
          path: join(outDir, `nav-mobile-open__${vp.name}.png`),
          fullPage: false,
        });
        console.log(`wrote nav-mobile-open__${vp.name}.png`);
      }
    }
  } else {
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    const solutions = page.getByRole("button", { name: "Solutions" });
    if (await solutions.isVisible()) {
      await solutions.hover();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: join(outDir, `nav-dropdown-solutions__${vp.name}.png`),
        fullPage: false,
      });
      console.log(`wrote nav-dropdown-solutions__${vp.name}.png`);
    }
  }

  await context.close();
}

await browser.close();

const summaryPath = join(outDir, "capture-issues.json");
const { writeFileSync } = await import("node:fs");
writeFileSync(summaryPath, JSON.stringify({ baseURL, issues, capturedAt: new Date().toISOString() }, null, 2));
console.log(`issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
}
