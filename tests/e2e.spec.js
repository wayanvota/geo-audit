import { test, expect } from "@playwright/test";
import fsp from "node:fs/promises";

async function openBuilder(page, options = {}) {
  if (options.missingTemplate) {
    await page.route("**/prompts/*.md", (route) =>
      route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" })
    );
  }
  await page.goto("/");
  await expect(page.locator("#statusText")).toHaveText("Ready");
}

async function fillCore(page, brand = "Example Foundation") {
  await page.locator("#siteUrl").fill("https://example.invalid");
  await page.locator("#brandName").fill(brand);
  await page.locator("#audience").fill("Nonprofit technology leaders");
  await page.locator("#primaryAction").fill("Request an evidence review");
  await page.locator("#category").fill("Responsible AI consulting");
}

test("U01 app loads the audit builder and complete prompt", async ({ page }) => {
  await openBuilder(page);
  await expect(page).toHaveTitle("GEO Audit Studio");
  await expect(page.getByRole("heading", { name: /Generate a rigorous GEO audit pack/ })).toBeVisible();
  await expect(page.locator("#output")).toHaveValue(/# GEO Audit Studio: Consultant-Grade Website Audit Prompt/);
});

test("U02 sample data populates a full audit", async ({ page }) => {
  await openBuilder(page);
  await page.locator("#sampleButton").click();
  await expect(page.locator("#brandName")).toHaveValue("ICTworks");
  await expect(page.locator('input[name="auditDepth"][value="Full"]')).toBeChecked();
  await expect(page.locator("#output")).toHaveValue(/Brand or organization name: `ICTworks`/);
});

test("U03 owner inputs are interpolated into the brief", async ({ page }) => {
  await openBuilder(page);
  await fillCore(page, "Evidence Lab");
  await expect(page.locator("#output")).toHaveValue(/Website URL: `https:\/\/example\.invalid`/);
  await expect(page.locator("#output")).toHaveValue(/Brand or organization name: `Evidence Lab`/);
});

test("U04 audit depth switches between quick and full", async ({ page }) => {
  await openBuilder(page);
  await expect(page.locator("#output")).toHaveValue(/Audit depth: `Quick`/);
  await page.locator('input[name="auditDepth"][value="Full"]').check();
  await expect(page.locator("#output")).toHaveValue(/Audit depth: `Full`/);
});

test("U05 selected modules control the generated scope", async ({ page }) => {
  await openBuilder(page);
  await page.locator("[data-module]").evaluateAll((inputs) => inputs.forEach((input) => { input.checked = false; }));
  await page.locator('[data-module="citability"]').check();
  const selectedSection = (await page.locator("#output").inputValue()).split("# GEO Audit Studio")[0];
  expect(selectedSection).toContain("- Citability");
  expect(selectedSection).not.toContain("- Technical access");
});

test("U06 readiness self-check reports partial and complete states", async ({ page }) => {
  await openBuilder(page);
  for (const name of ["robots", "sitemap", "about"]) {
    await page.locator(`[data-readiness="${name}"]`).check();
  }
  await expect(page.locator("#readinessScore")).toHaveText("50%");
  await page.locator("[data-readiness]").evaluateAll((inputs) => inputs.forEach((input) => { input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); }));
  await expect(page.locator("#readinessScore")).toHaveText("100%");
});

test("U07 output tabs expose scorecard measurement and action modules", async ({ page }) => {
  await openBuilder(page);
  const cases = [
    ["scorecard", "# GEO Audit Scorecard"],
    ["measurement", "# GEO Measurement Plan"],
    ["actions", "# P0-P3 GEO Action Plan"]
  ];
  for (const [tab, heading] of cases) {
    await page.locator(`[data-tab="${tab}"]`).click();
    await expect(page.locator("#output")).toHaveValue(new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("U08 current module copies to the clipboard", async ({ page }) => {
  await openBuilder(page);
  await page.locator('[data-tab="scorecard"]').click();
  await page.locator("#copyActiveButton").click();
  await expect(page.locator("#statusText")).toHaveText("Copied");
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("# GEO Audit Scorecard");
});

test("U09 complete prompt downloads with the safe brand filename", async ({ page }) => {
  await openBuilder(page);
  await fillCore(page, "Evidence Lab");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#downloadPromptButton").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("evidence-lab-geo-audit-prompt.md");
  const body = await fsp.readFile(await download.path(), "utf8");
  expect(body).toContain("Brand or organization name: `Evidence Lab`");
});

test("U10 audit pack download contains every output section", async ({ page }) => {
  await openBuilder(page);
  await fillCore(page, "Evidence Lab");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#downloadButton").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("evidence-lab-geo-audit-pack.md");
  const body = await fsp.readFile(await download.path(), "utf8");
  for (const heading of ["# GEO Audit Studio", "# GEO Audit Scorecard", "# GEO Measurement Plan", "# P0-P3 GEO Action Plan"]) {
    expect(body).toContain(heading);
  }
});

test("A01 missing Markdown template falls back to an embedded prompt", async ({ page }) => {
  await openBuilder(page, { missingTemplate: true });
  await expect(page.locator("#output")).toHaveValue(/Website URL: \[WEBSITE URL\]/);
  await expect(page.locator("#output")).toHaveValue(/Audit phases:\n1\. Technical access/);
});

test("A02 malformed saved state is removed without breaking startup", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("geoAuditStudio", "{bad json"));
  await openBuilder(page);
  await expect(page.locator("#output")).toHaveValue(/\[BRAND OR ORGANIZATION\]/);
  const saved = await page.evaluate(() => localStorage.getItem("geoAuditStudio"));
  expect(saved).not.toBe("{bad json");
});

test("A03 markup entered by a user remains inert text", async ({ page }) => {
  await openBuilder(page);
  const payload = '</textarea><script>window.__geoXss = true</script>';
  await page.locator("#brandName").fill(payload);
  await expect(page.locator("#output")).toHaveValue(new RegExp(payload.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  expect(await page.evaluate(() => window.__geoXss)).toBeUndefined();
});

test("A04 user text resembling a token is not expanded a second time", async ({ page }) => {
  await openBuilder(page);
  await page.locator("#competitors").fill("{{SOURCE_PAGES}}");
  await page.locator("#sourcePages").fill("PRIVATE-MARKER");
  const output = await page.locator("#output").inputValue();
  expect(output).toContain("Competitors or peer sites to compare against: `{{SOURCE_PAGES}}`");
  expect(output).toContain("Known source-of-truth pages, if supplied: `PRIVATE-MARKER`");
});

test("A05 empty fields retain explicit evidence placeholders", async ({ page }) => {
  await openBuilder(page);
  const output = await page.locator("#output").inputValue();
  for (const placeholder of ["[WEBSITE URL]", "[PRIMARY AUDIENCE]", "[HIGH-RISK TOPICS]", "[SOURCE-OF-TRUTH PAGES]"]) {
    expect(output).toContain(placeholder);
  }
});

test("A06 an empty module selection produces an explicit scope warning", async ({ page }) => {
  await openBuilder(page);
  await page.locator("[data-module]").evaluateAll((inputs) => inputs.forEach((input) => {
    input.checked = false;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }));
  await expect(page.locator("#output")).toHaveValue(/No modules selected\. Run the full audit/);
});

test("A07 hostile brand punctuation cannot escape the download filename", async ({ page }) => {
  await openBuilder(page);
  await page.locator("#brandName").fill("../../ <Unsafe> 🔥");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#downloadPromptButton").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("unsafe-geo-audit-prompt.md");
  expect(download.suggestedFilename()).not.toMatch(/[\\/<>]/);
});

test("A08 prompt reference reports a missing deployed Markdown file", async ({ page }) => {
  await page.route("**/prompts/*.md", (route) =>
    route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" })
  );
  await page.goto("/prompt.html");
  await expect(page.locator("#promptText")).toContainText("Prompt file could not be loaded");
});

test("A09 prompt reference copies only loaded prompt text", async ({ page }) => {
  await page.goto("/prompt.html");
  await expect(page.locator("#promptText")).toContainText("# GEO Audit Studio: Consultant-Grade Website Audit Prompt");
  await page.locator("#copyPromptInline").click();
  await expect(page.locator("#copyPromptInline")).toHaveText("Copied");
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("# GEO Audit Studio: Consultant-Grade Website Audit Prompt");
  expect(clipboard).not.toContain("Loading prompt...");
});

test("A10 public dist mirrors source and contains no provider secrets", async () => {
  const pairs = [
    ["app.js", "dist/app.js"],
    ["favicon.svg", "dist/favicon.svg"],
    ["index.html", "dist/index.html"],
    ["prompt.html", "dist/prompt.html"],
    ["styles.css", "dist/styles.css"],
    ["prompts/generative-engine-optimization-audit-pro-prompt.md", "dist/prompts/generative-engine-optimization-audit-pro-prompt.md"]
  ];
  for (const [source, deployed] of pairs) {
    const [left, right] = await Promise.all([fsp.readFile(source), fsp.readFile(deployed)]);
    expect(right.equals(left), `${deployed} must match ${source}`).toBe(true);
  }
  const publicFiles = await Promise.all(pairs.map(([, deployed]) => fsp.readFile(deployed, "utf8")));
  expect(publicFiles.join("\n")).not.toMatch(/(?:sk-proj-|OPENAI_API_KEY\s*=|ANTHROPIC_API_KEY\s*=)/);
});
