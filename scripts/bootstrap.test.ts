import { spawnSync } from "node:child_process";
import { constants, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:child_process", () => ({ spawnSync: vi.fn() }));
vi.mock("node:fs", async importOriginal => ({ ...await importOriginal<typeof import("node:fs")>(), copyFileSync: vi.fn(), existsSync: vi.fn() }));

const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = fileURLToPath(new URL("../.env", import.meta.url));
const envExample = fileURLToPath(new URL("../.env.example", import.meta.url));

// Every command succeeds, except that each entry in `failing` fails once, in call order.
function commands(failing: string[] = []) {
  const pending = [...failing];
  vi.mocked(spawnSync).mockImplementation(((command: string, args: string[]) => {
    const index = pending.indexOf([command, ...args].join(" "));
    if (index >= 0) pending.splice(index, 1);
    return { status: index >= 0 ? 1 : 0 };
  }) as unknown as typeof spawnSync);
}
function ran() {
  return vi.mocked(spawnSync).mock.calls.map(([command, args]) => [command, ...(args as string[])].join(" "));
}
async function runBootstrap() {
  vi.resetModules();
  await import("./bootstrap");
}

const platform = process.platform;
beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(existsSync).mockReturnValue(false);
  commands();
});
afterEach(() => {
  Object.defineProperty(process, "platform", { value: platform });
  process.exitCode = undefined;
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

const ready = "\n[bootstrap] fleet-platform is ready. Start the app with: pnpm dev";

describe("bootstrap installer", () => {
  it("uses a database that already responds without touching Docker", async () => {
    await runBootstrap();
    expect(ran()).toEqual(["pnpm install --frozen-lockfile", "pnpm db:check", "pnpm db:migrate"]);
    expect(copyFileSync).toHaveBeenCalledExactlyOnceWith(envExample, envFile, constants.COPYFILE_EXCL);
    expect(spawnSync).toHaveBeenCalledWith("pnpm", ["install", "--frozen-lockfile"], { cwd: root, shell: false, stdio: "inherit" });
    expect(spawnSync).toHaveBeenCalledWith("pnpm", ["db:check"], { cwd: root, shell: false, stdio: "ignore" });
    expect(console.log).toHaveBeenCalledWith("[bootstrap] SKIP: the database at DATABASE_URL responds; Docker Compose is not needed.");
    expect(console.log).toHaveBeenLastCalledWith(ready);
    expect(process.exitCode).toBe(0);
  });

  it("starts PostgreSQL with Docker Compose when the database does not respond", async () => {
    commands(["pnpm db:check"]);
    await runBootstrap();
    expect(ran()).toEqual([
      "pnpm install --frozen-lockfile",
      "pnpm db:check",
      "docker info",
      "docker compose up -d --wait postgres",
      "pnpm db:check",
      "pnpm db:migrate",
    ]);
    expect(spawnSync).toHaveBeenLastCalledWith("pnpm", ["db:migrate"], { cwd: root, shell: false, stdio: "inherit" });
    expect(console.log).toHaveBeenLastCalledWith(ready);
    expect(process.exitCode).toBe(0);
  });

  it("keeps an existing .env on a repeated run", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    await runBootstrap();
    expect(existsSync).toHaveBeenCalledWith(envFile);
    expect(copyFileSync).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("[bootstrap] SKIP: .env already exists and was left unchanged.");
    expect(process.exitCode).toBe(0);
  });

  it.each([
    [["pnpm install --frozen-lockfile"], "Install dependencies", "Use Node.js 24 and pnpm 11.10.0, then re-run pnpm bootstrap."],
    [["pnpm db:check", "docker info"], "Check database", "The database at DATABASE_URL does not respond and Docker is not available. Start Docker, or set DATABASE_URL in .env to a running PostgreSQL database, then re-run pnpm bootstrap."],
    [["pnpm db:check", "docker compose up -d --wait postgres"], "Start PostgreSQL", "Check the Docker Compose output above."],
    [["pnpm db:check", "pnpm db:check"], "Check database", "PostgreSQL started, but DATABASE_URL in .env does not match it. Keep DATABASE_URL and the POSTGRES_* values consistent."],
    [["pnpm db:migrate"], "Apply migrations", "Check the migration output above."],
  ])("stops with a non-zero exit code when %j fails", async (failing, name, hint) => {
    commands(failing);
    await runBootstrap();
    expect(ran().at(-1)).toBe(failing.at(-1));
    expect(console.error).toHaveBeenCalledExactlyOnceWith(`[bootstrap] FAIL: ${name}. ${hint}`);
    expect(console.log).not.toHaveBeenCalledWith(ready);
    expect(process.exitCode).toBe(1);
  });

  it("runs commands through a shell on Windows so pnpm.cmd resolves", async () => {
    Object.defineProperty(process, "platform", { value: "win32" });
    await runBootstrap();
    expect(spawnSync).toHaveBeenCalledWith("pnpm install --frozen-lockfile", [], { cwd: root, shell: true, stdio: "inherit" });
    expect(process.exitCode).toBe(0);
  });
});
