import { test, expect, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import {
  db,
  pool,
  velocityOsJournalLeadsTable,
} from "../lib/db/src/index";

const uniq = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

async function expectHome(page: Page) {
  await expect(page.locator(".hero h1")).toContainText("deserve better ownership");
}

test.afterAll(async () => {
  await pool.end();
});

test.describe("Navigation", () => {
  test("redirects retired homepage section hashes to their current pages", async ({ page }) => {
    const legacyLinks = [
      ["/#portfolio", /\/track-record$/],
      ["/#track", /\/track-record$/],
      ["/#team", /\/team$/],
      ["/#contact", /\/contact$/],
      ["/#manifesto", /\/$/],
      ["/#mandate", /\/$/],
      ["/#platform", /\/platform$/],
      ["/#ctrl", /\/platform$/],
      ["/#why", /\/platform$/],
    ] as const;

    for (const [legacyUrl, expectedUrl] of legacyLinks) {
      await page.goto(legacyUrl);
      await expect(page).toHaveURL(expectedUrl);
    }
  });

  test("navigates all seven pages through the nav bar", async ({ page }) => {
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

    await page.locator(".nav-links").getByText("Operations Help", { exact: true }).click();
    await expect(page).toHaveURL(/\/velocity-os$/);
    await expect(page.getByRole("heading", { name: /Execution is not an accident/ })).toBeVisible();

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

    const overflowWithMenu = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflowWithMenu).toBeLessThanOrEqual(0);
    await expect(menu).toBeVisible();
    await menu.locator(".mobile-menu-link", { hasText: "Platform" }).click();
    await expect(page).toHaveURL(/\/platform$/);
    await expect(page.locator(".eyebrow").first()).toContainText("Operating Platform");

    // Menu closes after navigating
    await expect(menu).toBeHidden();

    // Navigate to Operations Help through the menu and check the page fits
    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.locator(".mobile-menu-link", { hasText: "Operations Help" }).click();
    await expect(page).toHaveURL(/\/velocity-os$/);
    await expect(page.getByRole("heading", { name: /Execution is not an accident/ })).toBeVisible();
    const overflowVelocity = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflowVelocity).toBeLessThanOrEqual(0);

    // Form inputs are at least 16px font size (prevents iOS zoom-on-focus)
    const fontSize = await page
      .locator("form.cf input.cf-input")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });
});

test.describe("Velocity OS Operator's Daily Journal", () => {
  test("serves only the 20-page public preview and provides accessible page controls", async ({
    page,
    request,
  }) => {
    await page.goto("/velocity-os");

    await expect(page.getByText("365", { exact: true })).toBeVisible();
    await expect(page.getByText("52", { exact: true })).toBeVisible();
    await expect(page.getByText("≈20", { exact: true })).toBeVisible();

    const viewer = page.getByTestId("viewer");
    await viewer.scrollIntoViewIfNeeded();
    await expect(viewer).toHaveAttribute("role", "region");
    await expect(page.getByTestId("page-status")).toHaveText("Page 1 of 20");
    await expect(page.getByTestId("previous")).toBeDisabled();
    await page.getByTestId("next").click();
    await expect(page.getByTestId("page-status")).toHaveText("Page 2 of 20");
    await expect(page.getByTestId("page-image")).toHaveAttribute(
      "alt",
      /Opening principle/,
    );

    const previewLink = viewer.getByRole("link", {
      name: "Open the 20-page preview PDF",
    });
    await expect(previewLink).toHaveAttribute(
      "href",
      "/velocity-os-journal/operators-daily-journal-preview.pdf",
    );

    const preview = await request.get(
      "/velocity-os-journal/operators-daily-journal-preview.pdf",
    );
    expect(preview.status()).toBe(200);
    expect(preview.headers()["content-type"]).toContain("application/pdf");
    const previewText = (await preview.body()).toString("latin1");
    expect(previewText).toMatch(/\/Count\s+20\b/);

    const twentyFirstPage = await request.get(
      "/velocity-os-journal/pages/page-21.png",
    );
    expect(twentyFirstPage.headers()["content-type"]).not.toContain("image/");

    const guessedFullJournal = await request.get(
      "/velocity-os-journal/velocity-os-operators-daily-journal.pdf",
    );
    expect(guessedFullJournal.headers()["content-type"]).not.toContain(
      "application/pdf",
    );
  });

  test("validates email and unlocks the complete journal without an account", async ({
    page,
  }) => {
    const id = uniq();
    await page.goto("/velocity-os");

    const email = page.getByTestId("email");
    await email.scrollIntoViewIfNeeded();
    await email.fill("not-an-email");
    await page.getByTestId("unlock-button").click();
    await expect(page.getByTestId("unlock-status")).toHaveText(
      "Enter a valid email address to unlock the complete journal.",
    );

    await email.fill(`journal-ui-${id}@example.com`);
    const [response] = await Promise.all([
      page.waitForResponse(
        (candidate) =>
          candidate.url().includes("/api/velocity-os/journal-unlocks") &&
          candidate.request().method() === "POST",
      ),
      page.getByTestId("unlock-button").click(),
    ]);
    expect(response.status()).toBe(201);
    await expect(page.getByTestId("unlock-status")).toContainText(
      "Unlocked successfully",
    );
    await expect(
      page.getByRole("button", {
        name: "Download The Operator's Daily Journal",
      }),
    ).toBeVisible();
  });

  test("captures a normalized lead, authorizes the full PDF, and records the download event", async ({
    request,
  }) => {
    const id = uniq();
    const email = `journal-api-${id}@example.com`;
    const unlock = await request.post("/api/velocity-os/journal-unlocks", {
      data: { email: ` ${email.toUpperCase()} ` },
    });
    expect(unlock.status()).toBe(201);

    const firstBody = await unlock.json();
    const duplicateUnlock = await request.post(
      "/api/velocity-os/journal-unlocks",
      {
        data: { email },
      },
    );
    expect(duplicateUnlock.status()).toBe(201);
    const body = await duplicateUnlock.json();
    expect(body.downloadUrl).not.toBe(firstBody.downloadUrl);

    expect(body.document).toMatchObject({
      title: "The Operator's Daily Journal",
      version: "first-edition-2026",
      filename: "velocity-os-operators-daily-journal.pdf",
    });
    expect(body.downloadUrl).toMatch(
      /^\/api\/velocity-os\/journal-downloads\/[A-Za-z0-9_-]{43}$/,
    );
    expect(new Date(body.expiresAt).getTime()).toBeGreaterThan(Date.now());

    const download = await request.get(body.downloadUrl);
    expect(download.status()).toBe(200);
    expect(download.headers()["content-type"]).toContain("application/pdf");
    expect(download.headers()["content-disposition"]).toContain(
      "velocity-os-operators-daily-journal.pdf",
    );
    const pdf = await download.body();
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.byteLength).toBe(1_329_095);

    const leads = await db.select().from(velocityOsJournalLeadsTable);
    const matchingLeads = leads.filter(
      (candidate) => candidate.email === email,
    );
    expect(matchingLeads).toHaveLength(1);
    const lead = matchingLeads[0];
    expect(lead).toBeDefined();
    expect(lead?.documentVersion).toBe("first-edition-2026");
    expect(lead?.submittedAt).toBeInstanceOf(Date);
    expect(lead?.downloadedAt).toBeInstanceOf(Date);
    expect(lead?.downloadTokenHash).not.toContain(
      body.downloadUrl.split("/").at(-1),
    );
  });

  test("rejects unauthorized and expired download authorizations", async ({
    request,
  }) => {
    const unauthorized = await request.get(
      `/api/velocity-os/journal-downloads/${"A".repeat(43)}`,
    );
    expect(unauthorized.status()).toBe(401);
    await expect(unauthorized.json()).resolves.toMatchObject({
      error: expect.stringContaining("invalid"),
    });

    const token = randomBytes(32).toString("base64url");
    await db.insert(velocityOsJournalLeadsTable).values({
      email: `expired-${uniq()}@example.com`,
      documentId: "operators-daily-journal",
      documentVersion: "first-edition-2026",
      downloadTokenHash: createHash("sha256").update(token).digest("hex"),
      downloadTokenExpiresAt: new Date(Date.now() - 60_000),
      submittedAt: new Date(Date.now() - 120_000),
    });

    const expired = await request.get(
      `/api/velocity-os/journal-downloads/${token}`,
    );
    expect(expired.status()).toBe(410);
    await expect(expired.json()).resolves.toMatchObject({
      error: expect.stringContaining("expired"),
    });
  });
});

test.describe("Velocity OS journal on mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("keeps the preview and unlock controls comfortable without horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/velocity-os");
    const viewer = page.getByTestId("viewer");
    await viewer.scrollIntoViewIfNeeded();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    for (const testId of ["previous", "next"]) {
      const box = await page.getByTestId(testId).boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    await page.getByTestId("next").click();
    await expect(page.getByTestId("page-status")).toHaveText("Page 2 of 20");

    const inputFontSize = await page
      .getByTestId("email")
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(inputFontSize).toBeGreaterThanOrEqual(16);
  });
});

test.describe("Velocity OS operations intake", () => {
  test("opens directly and shows a clear validation error", async ({ page }) => {
    await page.goto("/velocity-os");

    await expect(
      page.getByRole("heading", { name: /Execution is not an accident/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Submit Request" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Please fill in all required fields.",
    );
  });

  test("submits a dedicated intake and confirms review expectations", async ({ page }) => {
    const id = uniq();
    await page.goto("/velocity-os");

    await page.locator("#fullName").fill(`Velocity E2E ${id}`);
    await page.locator("#titleRole").fill("Operator");
    await page.locator("#workEmail").fill(`velocity-e2e-${id}@example.com`);
    await page.locator("#phone").fill("555-000-0000");
    await page.locator("#companyName").fill("E2E Operations Co");
    await page.locator("#companyWebsite").fill("https://example.com");
    await page
      .locator("#companyContext")
      .fill("A growing operating company with a distributed leadership team.");
    await page
      .locator("#primaryChallenge")
      .fill("Decision ownership and operating cadence are inconsistent today.");
    await page
      .locator("#desiredOutcome")
      .fill("Install measurable accountability and a reliable weekly cadence.");
    await page.locator("#urgency").selectOption("this-quarter");

    const [response] = await Promise.all([
      page.waitForResponse(
        (candidate) =>
          candidate.url().includes("/api/velocity-os-intakes") &&
          candidate.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Submit Request" }).click(),
    ]);
    expect(response.status()).toBe(201);

    await expect(
      page.getByRole("heading", { name: "Your request is under review." }),
    ).toBeVisible();
    await expect(
      page.getByText(/follow up about a Velocity OS call or waitlist placement/),
    ).toBeVisible();
  });

  test("normalizes valid data and rejects invalid direct API submissions", async ({
    request,
  }) => {
    const validPayload = {
      fullName: "Velocity API Test",
      workEmail: "velocity-api@example.com",
      titleRole: "Operator",
      companyName: "E2E Operations Co",
      companyContext: "A company with a growing operating team and real complexity.",
      primaryChallenge:
        "Leadership decisions are delayed and ownership is inconsistent.",
      desiredOutcome:
        "Create a reliable operating rhythm with clearer accountability.",
      urgency: "this-quarter",
    };

    const whitespaceResponse = await request.post("/api/velocity-os-intakes", {
      data: { ...validPayload, fullName: "   " },
    });
    expect(whitespaceResponse.status()).toBe(400);

    const websiteResponse = await request.post("/api/velocity-os-intakes", {
      data: { ...validPayload, companyWebsite: "not a website" },
    });
    expect(websiteResponse.status()).toBe(400);

    const nonWebUriResponse = await request.post("/api/velocity-os-intakes", {
      data: {
        ...validPayload,
        companyWebsite: "mailto:operator@example.com",
      },
    });
    expect(nonWebUriResponse.status()).toBe(400);

    const normalizedResponse = await request.post("/api/velocity-os-intakes", {
      data: {
        ...validPayload,
        workEmail: " velocity-normalized@example.com ",
        companyWebsite: " https://example.com ",
      },
    });
    expect(normalizedResponse.status()).toBe(201);
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
      page.waitForResponse(
        (candidate) =>
          candidate.url().includes("/api/inquiries") &&
          candidate.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Submit Inquiry" }).click(),
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