import { describe, expect, inject, it } from "vitest";
import { createDatabase } from "@fleet-platform/db";
import { messages } from "../src/messages/pl";
import { browser } from "./browser";

const appUrl = inject("appUrl");

describe("disposable application instance", () => {
  it("runs against the migrated Testcontainers database", async () => {
    const response = await fetch(`${appUrl}/api/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    await browser().open(`${appUrl}/api/health`);
    expect(await browser().text("body")).toContain('"status":"ok"');
    const orm = await createDatabase(inject("databaseUrl"));
    try {
      const rows = await orm.em.getConnection().execute("select to_regclass('public.mikro_orm_migrations') as migrations");
      expect(rows).toEqual([{ migrations: "mikro_orm_migrations" }]);
    } finally {
      await orm.close(true);
    }
  });
});

// Each test ends on the page its name describes: its screenshot is the evidence for that page.
describe("home page", () => {
  it("presents the project and links to the admin panel", async () => {
    await browser().open(`${appUrl}/`);
    expect(await browser().title()).toBe("fleet-platform");
    expect(await browser().text("h1")).toBe(messages.title);
    expect(await browser().text("main")).toContain(messages.introduction);
    expect(await browser().attribute('a[href="/admin"]', "href")).toBe("/admin");
  });

  it("navigates to the admin panel", async () => {
    await browser().open(`${appUrl}/`);
    await browser().click('a[href="/admin"]');
    await browser().waitForUrl("**/admin");
    expect(await browser().text("h1")).toBe(messages.adminTitle);
  });
});

describe("admin page", () => {
  it("shows the placeholder panel", async () => {
    await browser().open(`${appUrl}/admin`);
    expect(await browser().text("h1")).toBe(messages.adminTitle);
    const main = await browser().text("main");
    for (const text of [messages.status, messages.adminDescription, messages.adminBody]) expect(main).toContain(text);
  });

  it("navigates back to the home page", async () => {
    await browser().open(`${appUrl}/admin`);
    await browser().click('a[href="/"]');
    await browser().waitForUrl(`${appUrl}/`);
    expect(await browser().text("h1")).toBe(messages.title);
  });
});
