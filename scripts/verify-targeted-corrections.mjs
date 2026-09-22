import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] || "http://127.0.0.1:3458";
const outDir = join(process.cwd(), "visual-review/targeted-corrections");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = { base, checks: [] };

async function check(name, fn) {
  try {
    const detail = await fn();
    results.checks.push({ name, ok: true, ...detail });
  } catch (e) {
    results.checks.push({ name, ok: false, error: String(e) });
  }
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await check("home-title", async () => {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const title = await page.title();
  return {
    title,
    hasBrand: /ADEPT/i.test(title),
    keepsMeaning: /Everything You Need to Create a Fragrance Brand/i.test(title),
  };
});

await check("about-h1", async () => {
  await page.goto(`${base}/about`, { waitUntil: "domcontentloaded" });
  const h1 = await page.locator("h1").innerText();
  return {
    h1,
    distinct: !/Everything you need to create a fragrance brand/i.test(h1),
  };
});

await check("sitemap-tech-quote", async () => {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return {
    hasTechQuote: xml.includes("/technology/request-quote"),
    hasQueryVariants: /request-quote\?type=/.test(xml),
  };
});

await check("quote-aside-single", async () => {
  await page.goto(`${base}/request-quote`, { waitUntil: "domcontentloaded" });
  const count = await page.locator("h2", { hasText: "What happens next" }).count();
  await page.goto(`${base}/technology/request-quote`, { waitUntil: "domcontentloaded" });
  const count2 = await page.locator("h2", { hasText: "What happens next" }).count();
  return { fragrance: count, technology: count2, bothSingle: count === 1 && count2 === 1 };
});

await check("cta-contextual", async () => {
  await page.goto(`${base}/technology/erp`, { waitUntil: "domcontentloaded" });
  const techHref = await page.locator("header a").filter({ hasText: "Request a Quote" }).first().getAttribute("href");
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const homeHref = await page.locator("header a").filter({ hasText: "Request a Quote" }).first().getAttribute("href");
  await page.goto(`${base}/services/fragrance-trading`, { waitUntil: "domcontentloaded" });
  const fragHref = await page.locator("header a").filter({ hasText: "Request a Quote" }).first().getAttribute("href");
  return {
    techHref,
    homeHref,
    fragHref,
    ok:
      techHref === "/technology/request-quote" &&
      homeHref === "/request-quote" &&
      fragHref === "/request-quote",
  };
});

await check("mobile-cta-tech", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/technology`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Open menu").click();
  const href = await page.locator("nav[aria-label='Mobile'] a").filter({ hasText: "Request a Quote" }).getAttribute("href");
  return { href, ok: href === "/technology/request-quote" };
});

await check("mobile-cta-home", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Open menu").click();
  const href = await page.locator("nav[aria-label='Mobile'] a").filter({ hasText: "Request a Quote" }).getAttribute("href");
  return { href, ok: href === "/request-quote" };
});

await check("tech-cards-visual", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const audit = await page.evaluate(() => {
    const section = [...document.querySelectorAll("section")].find((s) =>
      /Beyond Manufacturing/i.test(s.textContent || ""),
    );
    if (!section) return { found: false };
    const cards = [...section.querySelectorAll("[data-tech-visual]")];
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
    const texts = [...section.querySelectorAll("h3")].map((h) => {
      const p = h.parentElement?.querySelector("p.text-sm, p.mt-2");
      const t = p?.textContent || "";
      return { title: h.textContent, truncated: t.includes("…") || /\.\.\.$/.test(t), len: t.length };
    });
    return {
      found: true,
      cardCount: cards.length,
      variants: cards.map((c) => c.getAttribute("data-tech-visual")),
      overflow,
      texts,
      clippedLabels: [...section.querySelectorAll("[data-tech-visual] p")].length === 0,
    };
  });
  return audit;
});

const widths = [390, 768, 1024, 1440];
for (const w of widths) {
  await check(`overflow-${w}`, async () => {
    await page.setViewportSize({ width: w, height: 900 });
    const paths = ["/", "/request-quote", "/technology/request-quote", "/about", "/technology"];
    const rows = [];
    for (const path of paths) {
      await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 2,
      );
      rows.push({ path, overflow });
    }
    return { rows, anyOverflow: rows.some((r) => r.overflow) };
  });
}

await browser.close();
writeFileSync(join(outDir, "verify.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
