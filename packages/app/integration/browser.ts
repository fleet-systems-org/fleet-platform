import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { promisify } from "node:util";

const run = promisify(execFile);
const cli = createRequire(import.meta.url).resolve("agent-browser/bin/agent-browser.js");

type Result = { success: boolean; data: Record<string, unknown> | null; error: string | null };

/** One isolated agent-browser session; close it in `afterEach`/`afterAll`. */
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
    close: () => command("close"),
  };
}
