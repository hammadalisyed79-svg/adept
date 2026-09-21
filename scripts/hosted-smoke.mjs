/**
 * Hosted staging smoke via `vercel curl` (Windows-safe).
 * Usage: node scripts/hosted-smoke.mjs <preview-base-url>
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Usage: node scripts/hosted-smoke.mjs <preview-url>");
  process.exit(1);
}

const tmpDir = resolve(process.cwd(), ".tmp-smoke");
import { mkdirSync } from "node:fs";
mkdirSync(tmpDir, { recursive: true });

function vercelCurlToFile(path, outFile, extraArgs = []) {
  const url = `${base}${path}`;
  const cmd = [
    "npx vercel curl",
    `"${url}"`,
    "-s",
    "-o",
    `"${outFile}"`,
    "-w",
    "%{http_code}",
    ...extraArgs,
  ].join(" ");
  const r = spawnSync(cmd, {
    encoding: "utf8",
    shell: true,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    status: r.status,
    httpCode: (r.stdout || "").trim(),
    stderr: r.stderr || "",
  };
}

function getHtml(path) {
  const out = resolve(tmpDir, `page-${path.replace(/\W+/g, "_") || "root"}.html`);
  const res = vercelCurlToFile(path, out);
  let body = "";
  if (existsSync(out)) body = readFileSync(out, "utf8");
  return { ...res, body };
}

function postJson(path, payload) {
  const out = resolve(tmpDir, `post-${Date.now()}.json`);
  const bodyFile = resolve(tmpDir, `body-${Date.now()}.json`);
  writeFileSync(bodyFile, JSON.stringify(payload), "utf8");
  const url = `${base}${path}`;
  const cmd = `npx vercel curl "${url}" -s -o "${out}" -w %{http_code} -X POST -H "Content-Type: application/json" --data-binary "@${bodyFile}"`;
  const r = spawnSync(cmd, {
    encoding: "utf8",
    shell: true,
    maxBuffer: 10 * 1024 * 1024,
  });
  let body = "";
  if (existsSync(out)) body = readFileSync(out, "utf8");
  try {
    unlinkSync(bodyFile);
  } catch {
    /* ignore */
  }
  return { status: r.status, httpCode: (r.stdout || "").trim(), body, stderr: r.stderr || "" };
}

const pages = [
  "/",
  "/packaging",
  "/packaging/perfume-bottles",
  "/packaging/caps",
  "/packaging/pumps-and-collars",
  "/packaging/labels-and-stickers",
  "/packaging/folding-cartons",
  "/packaging/rigid-boxes",
  "/packaging/accessories",
  "/packaging/complete-packaging-sets",
  "/catalogue",
  "/services/fragrance-trading",
  "/services/toll-manufacturing",
  "/services/private-label",
  "/request-quote",
  "/contact",
];

const results = { pages: [], inquiries: [] };

for (const path of pages) {
  const res = getHtml(path);
  const ok = res.httpCode === "200" && res.body.length > 500;
  const hasInfo = res.body.includes("info@adeptfragrances.com");
  const hasSales = res.body.includes("sales@adeptfragrances.com");
  results.pages.push({
    path,
    httpCode: res.httpCode,
    ok,
    hasInfo,
    hasSales,
    bytes: res.body.length,
  });
  console.log(`[page] ${path} ${res.httpCode} ok=${ok} info@=${hasInfo}`);
}

const catalogue = results.pages.find((p) => p.path === "/catalogue");
const catalogueHtml = getHtml("/catalogue").body;
results.catalogue = {
  emptyMessage: /No published products yet/i.test(catalogueHtml),
  inventedRetailClaims: /add to cart|in stock now|\$\d+\.\d{2}/i.test(catalogueHtml),
};

const stamp = Date.now();
const types = [
  {
    inquiryType: "PACKAGING_COMPONENTS",
    productCategory: "Perfume bottles, Caps",
    packagingCategories: ["Perfume bottles", "Caps"],
    quantityUnit: "pieces",
    estimatedQuantity: "1000",
    projectDescription:
      "Consolidated staging packaging quotation test for bottles and caps — no invented stock claims.",
    deliveryDestination: "Dubai",
    capacitySize: "50ml",
  },
  {
    inquiryType: "FRAGRANCE_TRADING",
    productCategory: "EDP concentrate",
    quantityUnit: "kg",
    estimatedQuantity: "25",
    projectDescription:
      "Consolidated staging fragrance trading inquiry to confirm existing type still works.",
  },
  {
    inquiryType: "TOLL_MANUFACTURING",
    productCategory: "Body mist fill",
    quantityUnit: "units",
    estimatedQuantity: "5000",
    projectDescription:
      "Consolidated staging toll manufacturing inquiry for filling and packaging support.",
  },
  {
    inquiryType: "PRIVATE_LABEL",
    productCategory: "Private label EDP",
    quantityUnit: "units",
    estimatedQuantity: "2000",
    projectDescription:
      "Consolidated staging private label inquiry for end-to-end brand pathway testing.",
  },
];

for (const t of types) {
  const payload = {
    contactName: "Staging Smoke",
    companyName: "ADEPT Staging Co",
    email: `staging-smoke-${t.inquiryType.toLowerCase()}-${stamp}@example.com`,
    phone: "+1 555 0100",
    country: "United Arab Emirates",
    industry: "Fine Fragrance",
    inquiryType: t.inquiryType,
    productCategory: t.productCategory,
    estimatedQuantity: t.estimatedQuantity,
    quantityUnit: t.quantityUnit,
    projectDescription: t.projectDescription,
    packagingCategories: t.packagingCategories,
    deliveryDestination: t.deliveryDestination,
    capacitySize: t.capacitySize,
    sourcePage: "/request-quote",
    website: "",
  };
  const res = postJson("/api/inquiries", payload);
  let parsed = null;
  try {
    parsed = JSON.parse(res.body);
  } catch {
    parsed = { raw: res.body.slice(0, 400) };
  }
  results.inquiries.push({
    inquiryType: t.inquiryType,
    httpCode: res.httpCode,
    ok: Boolean(parsed?.ok && parsed?.reference),
    reference: parsed?.reference || null,
    message: parsed?.message || parsed?.error || null,
  });
  console.log(
    `[inquiry] ${t.inquiryType} ${res.httpCode} ok=${Boolean(parsed?.ok)} ref=${parsed?.reference || "none"}`,
  );
}

console.log("\n=== SUMMARY ===");
console.log(JSON.stringify(results, null, 2));

const failedPages = results.pages.filter((p) => !p.ok);
const failedInq = results.inquiries.filter((i) => !i.ok);
if (failedPages.length || failedInq.length || !catalogue?.ok) process.exit(1);
