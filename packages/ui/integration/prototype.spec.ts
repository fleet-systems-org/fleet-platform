import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { expect, test } from "playwright/test";

const evidence = fileURLToPath(new URL("../../../integration-evidence/", import.meta.url));

for (const width of [1440, 320]) {
  test(`built Storybook serves the E01 prototype at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed", request => errors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
    await page.setViewportSize({ width, height: 900 });
    try {
      const response = await page.goto("/prototypes/quote-during-call/index.html");
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: "Zaloguj się", exact: true })).toBeVisible();
      await expect(page.getByText("Logowanie systemu biura — symulacja", { exact: true })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await mkdir(evidence, { recursive: true });
      await page.screenshot({ path: `${evidence}storybook-prototype-sign-in-${width}.png`, fullPage: true });
      // Direct entry and reset must retain the viewed quote, independent of the entry form.
      for (let attempt = 0; attempt < 2; attempt++) {
        await page.getByRole("button", { name: "Resetuj symulację", exact: true }).click();
        await page.getByRole("button", { name: "Wybierz ekran", exact: true }).click();
        await page.locator('#screen-picker a[href="#s13"]').click();
        const screen = page.locator("#s13");
        await expect(screen).toBeVisible();
        const route = screen.getByRole("list", { name: "Trasa kursu", exact: true });
        for (const value of ["Kierowca A · DEMO 001", "Miejsce A · PL", "Miejsce B · DE", "Miejsce C · CZ", "11:00", "12:00", "13:00", "20 km", "80 km"]) {
          await expect(route).toContainText(value);
        }
        await expect(screen.getByRole("complementary", { name: "Podsumowanie wyceny", exact: true })).toContainText("21,82 EUR");
      }
      expect(errors).toEqual([]);
    } finally {
      await mkdir(evidence, { recursive: true });
      await page.screenshot({ path: `${evidence}storybook-prototype-${width}.png`, fullPage: true });
    }
  });
}
