import { expect, test } from "@playwright/test";

test.describe("primary journeys", () => {
  test("homepage renders expanded brand positioning", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Everything You Need to Create a Fragrance Brand",
    );
    await expect(page.getByText("ADEPT Fragrances").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Five business divisions" })).toBeVisible();
    await page.getByRole("link", { name: "Explore Packaging" }).click();
    await expect(page).toHaveURL(/packaging/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Perfume packaging");
  });

  test("mobile navigation opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/about/);
  });

  test("service, packaging, and industry pages load", async ({ page }) => {
    for (const path of [
      "/services/fragrance-trading",
      "/services/toll-manufacturing",
      "/services/private-label",
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
      "/industries",
      "/industries/fine-fragrance",
      "/process",
      "/insights",
      "/contact",
      "/privacy",
      "/terms",
    ]) {
      const res = await page.goto(path);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("quote form validation errors on empty submit", async ({ page }) => {
    await page.goto("/request-quote");
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await page.locator("#contactName").fill("A");
    await page.locator("#companyName").fill("B");
    await page.locator("#email").fill("bad");
    await page.locator("#phone").fill("123");
    await page.locator("#country").fill("US");
    await page.locator("#industry").selectOption("Fine Fragrance");
    await page.locator("#productCategory").fill("EDP");
    await page.locator("#estimatedQuantity").fill("10");
    await page.locator("#quantityUnit").selectOption("kg");
    await page.locator("#projectDescription").fill("short");
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByText("Validation failed.")).toBeVisible({ timeout: 10000 });
  });

  test("successful fragrance inquiry submission still works", async ({ page }) => {
    await page.goto("/request-quote?type=PRIVATE_LABEL");
    const stamp = Date.now();
    await page.locator("#contactName").fill("Playwright User");
    await page.locator("#companyName").fill("Playwright Brands");
    await page.locator("#email").fill(`pw-${stamp}@example.com`);
    await page.locator("#phone").fill("+1 555 0142");
    await page.locator("#country").fill("United States");
    await page.locator("#industry").selectOption("Fine Fragrance");
    await page.locator("#productCategory").fill("EDP");
    await page.locator("#estimatedQuantity").fill("500");
    await page.locator("#quantityUnit").selectOption("units");
    await page
      .locator("#projectDescription")
      .fill("End-to-end test for private label perfume manufacturing inquiry submission.");
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByText("Inquiry received")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/ADF-\d{8}-[A-F0-9]{6}/)).toBeVisible();
  });

  test("successful packaging inquiry submission", async ({ page }) => {
    await page.goto("/request-quote?type=PACKAGING_COMPONENTS");
    const stamp = Date.now();
    await page.locator("#contactName").fill("Packaging Buyer");
    await page.locator("#companyName").fill("Packaging Brands LLC");
    await page.locator("#email").fill(`pw-pack-${stamp}@example.com`);
    await page.locator("#phone").fill("+1 555 0199");
    await page.locator("#country").fill("United Arab Emirates");
    await page.locator("#industry").selectOption("Fine Fragrance");
    await page.getByLabel("Perfume bottles").check();
    await page.getByLabel("Caps").check();
    await page.locator("#estimatedQuantity").fill("5000");
    await page.locator("#quantityUnit").selectOption("pieces");
    await page.locator("#deliveryDestination").fill("Dubai");
    await page.locator("#capacitySize").fill("50ml");
    await page
      .locator("#projectDescription")
      .fill(
        "End-to-end packaging inquiry for perfume bottles and caps with quotation-based supply.",
      );
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByText("Inquiry received")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/ADF-\d{8}-[A-F0-9]{6}/)).toBeVisible();
  });

  test("insights article and SEO metadata", async ({ page }) => {
    await page.goto("/insights/fine-fragrance-vs-industrial-fragrance");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Fine Fragrance vs Industrial Fragrance",
    );
    const title = await page.title();
    expect(title.toLowerCase()).toContain("fine fragrance");
    expect(title).toContain("ADEPT Fragrances");
  });

  test("API does not expose inquiry listing via GET", async ({ request }) => {
    const getRes = await request.get("/api/inquiries");
    expect([404, 405]).toContain(getRes.status());
  });
});
