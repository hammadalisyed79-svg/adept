import { expect, test } from "@playwright/test";

test.describe("primary journeys", () => {
  test("homepage renders and navigates to services", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Fragrance Solutions, From Concept to Creation",
    );
    await expect(page.getByText("ADEPT Fragrances").first()).toBeVisible();
    await page.getByRole("link", { name: "Explore Our Solutions" }).click();
    await expect(page).toHaveURL(/fragrance-trading/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fragrance Trading");
  });

  test("mobile navigation opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/about/);
  });

  test("service and industry pages load", async ({ page }) => {
    for (const path of [
      "/services/fragrance-trading",
      "/services/toll-manufacturing",
      "/services/private-label",
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
    // HTML5 required fields prevent submit; fill invalid then rely on server
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

  test("successful inquiry submission", async ({ page }) => {
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
