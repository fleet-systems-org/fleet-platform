// One-command local setup: `pnpm bootstrap`. It runs before dependencies are installed, so it uses
// only Node.js built-ins and runs through Node's TypeScript type stripping. Every step is safe to
// repeat: installs and migrations are no-ops when up to date and an existing .env is never touched.
import { spawnSync } from "node:child_process";
import { constants, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = fileURLToPath(new URL("../.env", import.meta.url));
const envExample = fileURLToPath(new URL("../.env.example", import.meta.url));

function run(command: string, args: string[], quiet = false) {
  // Windows resolves pnpm.cmd only through a shell; every argument here is a fixed literal.
  const windows = process.platform === "win32";
  const result = spawnSync(windows ? [command, ...args].join(" ") : command, windows ? [] : args, {
    cwd: root,
    shell: windows,
    stdio: quiet ? "ignore" : "inherit",
  });
  return result.status === 0;
}

function step(name: string) {
  console.log(`\n[bootstrap] ${name}`);
}

function fail(name: string, hint: string) {
  console.error(`[bootstrap] FAIL: ${name}. ${hint}`);
  return 1;
}

function bootstrap() {
  step("Install dependencies");
  if (!run("pnpm", ["install", "--frozen-lockfile"])) {
    return fail("Install dependencies", "Use Node.js 24 and pnpm 11.10.0, then re-run pnpm bootstrap.");
  }

  step("Create .env");
  if (existsSync(envFile)) {
    console.log("[bootstrap] SKIP: .env already exists and was left unchanged.");
  } else {
    copyFileSync(envExample, envFile, constants.COPYFILE_EXCL);
    console.log("[bootstrap] DONE: copied .env.example to .env.");
  }

  // A database that already answers at DATABASE_URL is used as is, so Docker never competes with it
  // for the port (for example a Compose database started from another worktree).
  step("Check database");
  if (run("pnpm", ["db:check"], true)) {
    console.log("[bootstrap] SKIP: the database at DATABASE_URL responds; Docker Compose is not needed.");
  } else if (!run("docker", ["info"], true)) {
    return fail("Check database", "The database at DATABASE_URL does not respond and Docker is not available. Start Docker, or set DATABASE_URL in .env to a running PostgreSQL database, then re-run pnpm bootstrap.");
  } else {
    step("Start PostgreSQL");
    if (!run("docker", ["compose", "up", "-d", "--wait", "postgres"])) {
      return fail("Start PostgreSQL", "Check the Docker Compose output above.");
    }
    if (!run("pnpm", ["db:check"])) {
      return fail("Check database", "PostgreSQL started, but DATABASE_URL in .env does not match it. Keep DATABASE_URL and the POSTGRES_* values consistent.");
    }
  }

  step("Apply migrations");
  if (!run("pnpm", ["db:migrate"])) {
    return fail("Apply migrations", "Check the migration output above.");
  }

  console.log("\n[bootstrap] fleet-platform is ready. Start the app with: pnpm dev");
  return 0;
}

process.exitCode = bootstrap();
