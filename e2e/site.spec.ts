import { test, expect, type Page } from "@playwright/test";

const uniq = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

async function expectHome(page: Page) {
  await expect(page.locator(".hero h1")).toContainText("deserve better ownership");
}

test.describe("Navigation", () => {
  test("navigates all six pages through the nav bar", async ({ page }) => {
    await page.goto("/");
    await expectHome(page);

    await page.locator(".nav-links").getByText("Platform", { exact: true }).click();
    await expect(page).toHaveURL(/\/platform$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Operating Platform");

    await page.locator(".nav-links").getByText("Track Record", { exact: true }).click();
    await expect(page).toHaveURL(/\/track-record$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Track Record");

    await page.locator(".nav-links").getByText("Team", { exact: true }).click();
    await expect(page).toHaveURL(/\/team$/);
    await expect(page.getByText("The operators behind the office.")).toBeVisible();

    await page.locator(".nav-links").getByText("Get Funding", { exact: true }).click();
    await expect(page).toHaveURL(/\/funding$/);
    await expect(page.getByText("Get Growth Funding", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Get Growth Funding/ }),
    ).toHaveAttribute("href", "https://cohortfunding.com");
    await expect(
      page.getByRole("link", { name: /Get Operational Funding/ }),
    ).toHaveAttribute("href", "https://leadershieldfunding.com");

    await page.locator(".nav-links").getByText("Contact", { exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByText("Introduce a situation.")).toBeVisible();

    await page.locator(".nav-links").getByText("Home", { exact: true }).click();
    await expectHome(page);
  });

  test("browser back and forward buttons work with client-side routing", async ({ page }) => {
    await page.goto("/");
    await expectHome(page);

    await page.locator(".nav-links").getByText("Platform", { exact: true }).click();
    await expect(page).toHaveURL(/\/platform$/);

    await page.locator(".nav-links").getByText("Team", { exact: true }).click();
    await expect(page).toHaveURL(/\/team$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/platform$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Operating Platform");

    await page.goBack();
    await expectHome(page);

    await page.goForward();
    await expect(page).toHaveURL(/\/platform$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Operating Platform");
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText("Page not found.")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("navigates via the hamburger menu at a phone viewport without horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expectHome(page);

    // No horizontal scrolling on the homepage
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Desktop nav links hidden, burger visible
    await expect(page.locator(".nav-links")).toBeHidden();
    const burger = page.getByRole("button", { name: "Open menu" });
    await expect(burger).toBeVisible();

    // Burger tap target is at least 44px
    const box = await burger.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);

    // Open the menu and navigate to Platform
    await burger.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await menu.locator(".mobile-menu-link", { hasText: "Platform" }).click();
    await expect(page).toHaveURL(/\/platform$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Operating Platform");

    // Menu closes after navigating
    await expect(menu).toBeHidden();

    // Navigate to Contact through the menu and check the page fits
    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.locator(".mobile-menu-link", { hasText: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByText("Introduce a situation.")).toBeVisible();
    const overflowContact = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflowContact).toBeLessThanOrEqual(0);

    // Form inputs are at least 16px font size (prevents iOS zoom-on-focus)
    const fontSize = await page
      .locator("form.cf input.cf-input")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });
});

test.describe("Homepage funding banner", () => {
  test("renders the Need Capital band and its link navigates to /funding", async ({ page }) => {
    await page.goto("/");
    await expectHome(page);

    const band = page.locator(".fund-band");
    await band.scrollIntoViewIfNeeded();
    await expect(band).toBeVisible();
    await expect(band.getByText("Need Capital?")).toBeVisible();
    await expect(band.getByText("Funding for brands we don't acquire.")).toBeVisible();

    const cta = band.getByRole("link", { name: /Explore Funding Options/ });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/funding$/);
    await expect(page.getByText("Get Growth Funding", { exact: true })).toBeVisible();
  });
});

test.describe("Contact form", () => {
  test("shows a validation error when required fields are missing", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("form.cf input.cf-input").first().fill("E2E Only Name");
    await page.locator("form.cf button.cf-submit").click();
    await expect(page.locator("form.cf")).toBeVisible();
    await expect(page.getByText("Your inquiry has been received")).not.toBeVisible();
  });

  test("submits an inquiry and shows the success message", async ({ page }) => {
    const id = uniq();
    await page.goto("/contact");

    await page.getByPlaceholder("Your full name").fill(`E2E Test ${id}`);
    await page.getByPlaceholder("Firm, fund, or company").fill("E2E Test Org");
    await page.getByPlaceholder("Professional email").fill(`e2e-${id}@example.com`);
    await page.getByPlaceholder("Direct line (optional)").fill("555-000-0000");
    await page.locator("form.cf select.cf-input").selectOption({ label: "Other / General" });
    await page
      .getByPlaceholder("Briefly describe the opportunity, situation, or reason for reaching out...")
      .fill(`Automated e2e test submission ${id}. Safe to ignore.`);

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/inquiries") && r.request().method() === "POST"),
      page.locator("form.cf button.cf-submit").click(),
    ]);
    expect(response.status()).toBe(201);

    await expect(page.getByText("Your inquiry has been received")).toBeVisible();
  });
});

test.describe("Portfolio access modal", () => {
  test("opens from the home hero, submits a request, and shows success", async ({ page }) => {
    const id = uniq();
    await page.goto("/");

    await page.getByRole("button", { name: "Request Portfolio Access" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Qualified Counterparties Only")).toBeVisible();

    await dialog.locator("#modal-name").fill(`E2E Modal Test ${id}`);
    await dialog.locator("#modal-org").fill("E2E Test Fund");
    await dialog.locator("#modal-email").fill(`e2e-modal-${id}@example.com`);
    await dialog.locator("#modal-title").fill("Automated Tester");
    await dialog.locator("#modal-reason").selectOption({ label: "Other" });

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/access-requests") && r.request().method() === "POST"),
      dialog.getByRole("button", { name: "Submit Access Request" }).click(),
    ]);
    expect(response.status()).toBe(201);

    await expect(dialog.getByText("Your access request has been received")).toBeVisible();

    // Modal auto-closes ~2s after a successful submission
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });
  });

  test("can be dismissed with the close button without submitting", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Request Portfolio Access" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
