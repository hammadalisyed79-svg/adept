/**
 * Live www audit — read-only. No Production inquiry submissions.
 * Usage: node scripts/audit-live-complete.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const BASE = "https://www.adeptfragrances.com";
const outDir = join(process.cwd(), "visual-review", "live-complete-audit");
const shotDir = join(outDir, "screenshots");
mkdirSync(shotDir, { recursive: true });

function slugify(path) {
  return path
    .replace(/^\//, "")
    .replace(/[/?&=]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^$/, "home")
    .slice(0, 80);
}

async function fetchSitemapPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const u = new URL(m[1]);
    return u.pathname === "/" ? "/" : u.pathname;
  });
  return [...new Set(locs)];
}

async function discoverExtraFromHtml(paths) {
  const found = new Set(paths);
  const seed = ["/", "/catalogue", "/insights", "/packaging", "/technology", "/about", "/contact"];
  for (const p of seed) {
    try {
      const html = await (await fetch(`${BASE}${p}`)).text();
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const path = m[1];
        if (path.startsWith("/api/")) continue;
        if (path.includes(".")) continue; // assets
        found.add(path === "" ? "/" : path);
      }
    } catch {
      /* ignore */
    }
  }
  // Known inquiry deep links
  found.add("/technology/request-quote");
  return [...found].sort((a, b) => a.localeCompare(b));
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(350);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < Math.min(height, 12000); y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
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
            setTimeout(done, 2500);
          }),
      ),
    );
  });
}

async function pageAudit(page) {
  return page.evaluate(() => {
    const abs = (href) => {
      try {
        return new URL(href, location.origin).href;
      } catch {
        return href;
      }
    };
    const images = Array.from(document.images).map((img) => ({
      src: (img.currentSrc || img.src).split("?")[0],
      naturalWidth: img.naturalWidth,
      broken: img.complete && img.naturalWidth === 0,
      alt: img.getAttribute("alt"),
    }));
    const metaDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || null;
    const canonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null;
    const robots =
      document.querySelector('meta[name="robots"]')?.getAttribute("content") || null;
    const h1s = Array.from(document.querySelectorAll("h1")).map((h) => h.textContent?.trim());
    const h2s = Array.from(document.querySelectorAll("h2"))
      .slice(0, 12)
      .map((h) => h.textContent?.trim());
    const overflowX = document.documentElement.scrollWidth > window.innerWidth + 2;
    const links = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").trim().slice(0, 80),
    }));
    const buttons = Array.from(document.querySelectorAll("button, a[href]")).filter((el) => {
      const t = (el.textContent || "").toLowerCase();
      return /quote|submit|discuss|request|contact|learn more|send/.test(t);
    }).length;
    const forms = Array.from(document.querySelectorAll("form")).map((f) => ({
      action: f.getAttribute("action"),
      method: f.getAttribute("method"),
      inputs: f.querySelectorAll("input, select, textarea").length,
      required: f.querySelectorAll("[required]").length,
    }));
    const emptyAlts = images.filter((i) => i.alt === null || i.alt === "").length;
    return {
      title: document.title,
      metaDescription,
      canonical,
      robots,
      h1s,
      h2s,
      overflowX,
      imageCount: images.length,
      brokenImages: images.filter((i) => i.broken),
      emptyAlts,
      linkCount: links.length,
      internalHrefs: [
        ...new Set(
          links
            .map((l) => l.href)
            .filter((h) => h && h.startsWith("/") && !h.startsWith("//") && !h.startsWith("/api/")),
        ),
      ],
      ctaLikeCount: buttons,
      forms,
      lang: document.documentElement.lang || null,
      bodyTextSample: (document.body?.innerText || "").replace(/\s+/g, " ").slice(0, 400),
    };
  });
}

async function checkHttp(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return {
    path,
    status: res.status,
    location: res.headers.get("location"),
    contentType: res.headers.get("content-type"),
  };
}

const sitemapPaths = await fetchSitemapPaths();
const allPaths = await discoverExtraFromHtml(sitemapPaths);
const notInSitemap = allPaths.filter((p) => !sitemapPaths.includes(p));

const httpChecks = [];
for (const p of [...sitemapPaths, "/technology/request-quote", "/robots.txt", "/sitemap.xml"]) {
  httpChecks.push(await checkHttp(p));
}
httpChecks.push(await checkHttp("/this-page-does-not-exist-audit-404"));
httpChecks.push(await checkHttp("/catalogue/not-a-real-slug-xyz"));

const apex = await fetch("https://adeptfragrances.com/", { redirect: "manual" });
const apexInfo = { status: apex.status, location: apex.headers.get("location") };

const browser = await chromium.launch({ headless: true });
const report = {
  auditedAt: new Date().toISOString(),
  base: BASE,
  apex: apexInfo,
  sitemapCount: sitemapPaths.length,
  discoveredCount: allPaths.length,
  notInSitemap,
  sitemapPaths,
  allPaths,
  httpChecks,
  pages: [],
  formChecks: [],
  consoleByPage: {},
  networkFailuresByPage: {},
};

const viewports = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];

// Full audit each path at both viewports for screenshots; deep audit at 1440
for (const path of allPaths) {
  const pageEntry = {
    path,
    url: `${BASE}${path}`,
    screenshots: {},
    audits: {},
  };

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ADEPT-LiveAudit/1.0",
    });
    const page = await context.newPage();
    const consoles = [];
    const netFails = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoles.push(msg.text());
    });
    page.on("pageerror", (err) => consoles.push(String(err)));
    page.on("response", (res) => {
      const s = res.status();
      if (s >= 400) {
        netFails.push({ url: res.url(), status: s });
      }
    });

    let navStatus = null;
    try {
      const resp = await page.goto(`${BASE}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      navStatus = resp?.status() ?? null;
      await settle(page);
      const audit = await pageAudit(page);
      audit.httpStatus = navStatus;
      const file = `${slugify(path)}__${vp.name}.png`;
      await page.screenshot({
        path: join(shotDir, file),
        fullPage: true,
      });
      pageEntry.screenshots[vp.name] = `visual-review/live-complete-audit/screenshots/${file}`;
      pageEntry.audits[vp.name] = audit;
      if (vp.name === "1440") {
        report.consoleByPage[path] = consoles;
        report.networkFailuresByPage[path] = netFails.filter(
          (n) => !n.url.includes("favicon") && !n.url.includes("analytics"),
        );
      }
    } catch (e) {
      pageEntry.audits[vp.name] = { error: String(e) };
    }
    await context.close();
  }
  report.pages.push(pageEntry);
  console.log(`audited ${path}`);
}

// Form validation — fragrance + technology — NO successful Production submit
async function validateForm(path, label) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const result = { path, label, steps: [] };
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page);
    const formCount = await page.locator("form").count();
    result.formCount = formCount;
    if (formCount === 0) {
      result.steps.push({ step: "find-form", ok: false, note: "No form element" });
      await context.close();
      report.formChecks.push(result);
      return;
    }
    // Empty submit attempt
    const submit = page.locator('button[type="submit"], input[type="submit"]').first();
    if (await submit.count()) {
      await submit.click({ force: true });
      await page.waitForTimeout(500);
      const invalid = await page.locator(":invalid").count();
      const alerts = await page.locator('[role="alert"], .text-red, .error, [aria-invalid="true"]').count();
      result.steps.push({
        step: "empty-submit",
        ok: invalid > 0 || alerts > 0,
        invalidCount: invalid,
        alertLikeCount: alerts,
        note: "Expect client validation to block empty submit",
      });
      // Screenshot validation state
      const vf = `form-validation_${slugify(path)}__1440.png`;
      await page.screenshot({ path: join(shotDir, vf), fullPage: true });
      result.validationScreenshot = `visual-review/live-complete-audit/screenshots/${vf}`;
    } else {
      result.steps.push({ step: "find-submit", ok: false, note: "No submit button" });
    }

    // Partial fill — do not complete/submit successfully
    const email = page.locator('input[type="email"], input[name*="email" i]').first();
    if (await email.count()) {
      await email.fill("not-an-email");
      await submit.click({ force: true });
      await page.waitForTimeout(400);
      const stillInvalid = await page.locator(":invalid").count();
      result.steps.push({
        step: "bad-email",
        ok: stillInvalid > 0,
        invalidCount: stillInvalid,
        note: "Invalid email should remain blocked; no Production POST intended",
      });
      await email.fill(""); // clear
    }

    // Confirm we did not land on success
    const body = await page.locator("body").innerText();
    result.successScreenVisible = /thank you|reference ADF-|inquiry (has been )?received/i.test(body);
    result.steps.push({
      step: "no-success-screen",
      ok: !result.successScreenVisible,
      note: "Must not show success after validation-only checks",
    });
  } catch (e) {
    result.error = String(e);
  }
  await context.close();
  report.formChecks.push(result);
  console.log(`form-check ${path}`);
}

await validateForm("/request-quote", "Fragrance quotation");
await validateForm("/technology/request-quote", "Technology quotation (default)");
await validateForm("/technology/request-quote?type=erp", "Technology ERP deep link");
await validateForm("/technology/request-quote?type=website", "Technology Website deep link");
await validateForm("/technology/request-quote?type=marketing", "Technology Marketing deep link");

// Deep-link selection evidence
for (const type of ["erp", "website", "marketing"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/technology/request-quote?type=${type}`, {
    waitUntil: "domcontentloaded",
  });
  await settle(page);
  const html = await page.content();
  const map = {
    erp: "TECHNOLOGY_ERP",
    website: "TECHNOLOGY_WEBSITE",
    marketing: "TECHNOLOGY_MARKETING",
  };
  report.formChecks.push({
    path: `/technology/request-quote?type=${type}`,
    label: `deep-link-selection-${type}`,
    selectedEnumPresent: html.includes(map[type]),
    otherEnums: {
      TECHNOLOGY_ERP: html.includes("TECHNOLOGY_ERP"),
      TECHNOLOGY_WEBSITE: html.includes("TECHNOLOGY_WEBSITE"),
      TECHNOLOGY_MARKETING: html.includes("TECHNOLOGY_MARKETING"),
    },
  });
  const file = `deeplink_${type}__1440.png`;
  await page.screenshot({ path: join(shotDir, file), fullPage: true });
  await context.close();
}

await browser.close();

writeFileSync(join(outDir, "audit-raw.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok: true,
  outDir,
  pages: report.pages.length,
  forms: report.formChecks.length,
  notInSitemap,
}, null, 2));
