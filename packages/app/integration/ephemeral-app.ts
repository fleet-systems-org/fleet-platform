import { execFile, spawn, type ChildProcess } from "node:child_process";
import { createWriteStream, existsSync, type WriteStream } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";

const run = promisify(execFile);
const appDir = fileURLToPath(new URL("..", import.meta.url));
const repoDir = fileURLToPath(new URL("../../..", import.meta.url));
const nextBin = createRequire(`${appDir}/package.json`).resolve("next/dist/bin/next");

export type EphemeralApp = { url: string; databaseUrl: string; stop: () => Promise<void> };

// Synthetic, disposable credentials; the container is removed when the run ends.
const database = { image: "postgres:18", name: "fleet_platform_test", user: "fleet_test", password: "fleet_test" };

/**
 * Start PostgreSQL through Testcontainers, apply reviewed migrations and serve the existing
 * production build on a free loopback port. Everything started here is stopped by `stop`,
 * including when startup fails part-way. With `logFile`, migration and application output is
 * written there as it happens (database URL masked), so it survives crashes.
 */
export async function startEphemeralApp(options: { logFile?: string } = {}): Promise<EphemeralApp> {
  if (!existsSync(`${appDir}/.next/BUILD_ID`)) throw new Error("No production build found. Run `pnpm build` first.");
  let container: StartedPostgreSqlContainer | undefined;
  let app: ChildProcess | undefined;
  const output: string[] = [];
  const log: WriteStream | undefined = options.logFile ? createWriteStream(options.logFile) : undefined;
  let secret: string | undefined;
  const record = (text: string) => log?.write(secret ? mask(text, secret) : text);
  const stop = once(async () => {
    await stopProcess(app);
    await container?.stop();
    record(`[harness] stopped ${new Date().toISOString()}\n`);
    await new Promise(resolve => log ? log.end(resolve) : resolve(undefined));
  });
  try {
    container = await new PostgreSqlContainer(database.image)
      .withDatabase(database.name).withUsername(database.user).withPassword(database.password).start();
    const databaseUrl = container.getConnectionUri();
    secret = databaseUrl;
    record(`[harness] PostgreSQL ${database.image} started ${new Date().toISOString()}\n`);
    record(await migrate(databaseUrl));
    const port = await freePort();
    const url = `http://127.0.0.1:${port}`;
    app = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
      cwd: appDir, env: { ...process.env, DATABASE_URL: databaseUrl, NODE_ENV: "production" },
      detached: true, stdio: ["ignore", "pipe", "pipe"],
    });
    for (const stream of [app.stdout, app.stderr]) {
      stream?.on("data", chunk => {
        record(String(chunk));
        output.push(...String(chunk).split("\n")); output.splice(0, output.length - 200);
      });
    }
    record(`[harness] next start on ${url}\n`);
    await waitForHealth(url, app, () => mask(output.slice(-40).join("\n"), databaseUrl));
    return { url, databaseUrl, stop };
  } catch (error) {
    record(`[harness] startup failed: ${error instanceof Error ? error.message : String(error)}\n`);
    await stop();
    throw error;
  }
}

// Same migration configuration and CLI as `pnpm db:migrate`.
async function migrate(databaseUrl: string) {
  try {
    const { stdout, stderr } = await run("pnpm", ["--filter", "@fleet-platform/db", "orm", "migration:up"], {
      cwd: repoDir, env: { ...process.env, DATABASE_URL: databaseUrl }, timeout: 120_000,
    });
    return `[harness] migration:up\n${mask(`${stdout}${stderr}`, databaseUrl)}\n`;
  } catch (error) {
    const { stdout = "", stderr = "" } = error as { stdout?: string; stderr?: string };
    throw new Error(`Migration failed:\n${mask(`${stdout}\n${stderr}`, databaseUrl)}`);
  }
}

async function waitForHealth(url: string, app: ChildProcess, log: () => string) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (app.exitCode !== null || app.signalCode !== null) throw new Error(`Application exited during startup:\n${log()}`);
    try {
      if ((await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(2_000) })).ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Application did not become healthy within 60 s:\n${log()}`);
}

async function stopProcess(child: ChildProcess | undefined) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise(resolve => child.once("exit", resolve));
  const signalGroup = (signal: NodeJS.Signals) => {
    try { process.kill(-child.pid!, signal); } catch { /* Already gone. */ }
  };
  // The server runs in its own process group so workers it spawns stop with it.
  signalGroup("SIGTERM");
  const timer = setTimeout(() => signalGroup("SIGKILL"), 10_000);
  await exited;
  clearTimeout(timer);
}

function freePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer().once("error", reject).listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => typeof address === "object" && address ? resolve(address.port) : reject(new Error("No port allocated.")));
    });
  });
}

function once(work: () => Promise<void>) {
  let done: Promise<void> | undefined;
  return () => (done ??= work());
}

function mask(text: string, databaseUrl: string) {
  return text.replaceAll(databaseUrl, "[DATABASE_URL]");
}
