import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { promisify } from "node:util";
import { evidenceDir } from "./evidence";

const run = promisify(execFile);
const cli = createRequire(import.meta.url).resolve("agent-browser/bin/agent-browser.js");

type Result = { success: boolean; data: Record<string, unknown> | null; error: string | null };
export type Browser = ReturnType<typeof openBrowser>;

/** One isolated agent-browser session. Integration tests normally use `browser()` instead. */
export function openBrowser() {
  const session = `fleet-integration-${randomUUID()}`;
  async function command(...args: string[]) {
    let stdout: string;
    try {
      ({ stdout } = await run(process.execPath, [cli, "--session", session, "--json", ...args], { timeout: 45_000 }));
    } catch (error) {
      stdout = (error as { stdout?: string }).stdout ?? "";
      if (!stdout) throw error;
    }
    const result = JSON.parse(stdout.trim().split("\n").at(-1)!) as Result;
    if (!result.success || !result.data) throw new Error(`agent-browser ${args.join(" ")}: ${result.error}`);
    return result.data;
  }
  return {
    open: (url: string) => command("open", url),
    text: async (selector: string) => String((await command("get", "text", selector)).text),
    attribute: async (selector: string, name: string) => (await command("get", "attr", selector, name)).value,
    title: async () => String((await command("get", "title")).title),
    url: async () => String((await command("get", "url")).url),
    click: (selector: string) => command("click", selector),
    waitForUrl: (pattern: string) => command("wait", "--url", pattern),
    screenshot: (path: string) => command("screenshot", "--full", path),
    close: () => command("close"),
  };
}

let current: Browser | undefined;

/** The browser session of the running integration test, opened and closed by setup.ts. */
export function browser(): Browser {
  if (!current) throw new Error("No browser session: integration tests must run with packages/app/integration/setup.ts.");
  return current;
}

export function startTestBrowser() {
  current = openBrowser();
}

/**
 * Save `<evidence>/<test-name>.png` for every test, passed or failed, then close the session.
 * A missing or empty screenshot fails the test, so a pull request cannot pass without evidence.
 */
export async function finishTestBrowser(testName: string) {
  const session = current;
  current = undefined;
  if (!session) throw new Error(`No browser session to capture for "${testName}".`);
  const path = uniquePath(slug(testName));
  try {
    await session.screenshot(path);
  } finally {
    await session.close();
  }
  if (!statSync(path, { throwIfNoEntry: false })?.size) throw new Error(`Screenshot evidence missing: ${path}`);
}

// Tests with the same name in different files must not overwrite each other's evidence.
function uniquePath(name: string) {
  for (let index = 1; ; index++) {
    const path = join(evidenceDir, `${name}${index === 1 ? "" : `-${index}`}.png`);
    if (!existsSync(path)) return path;
  }
}

export function slug(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || "test";
}
