import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { TestProject } from "vitest/node";
import { startEphemeralApp } from "./ephemeral-app";
import { evidenceDir } from "./evidence";

declare module "vitest" {
  export interface ProvidedContext {
    appUrl: string;
    databaseUrl: string;
  }
}

export default async function setup(project: TestProject) {
  // Evidence must describe this run only.
  rmSync(evidenceDir, { recursive: true, force: true });
  mkdirSync(evidenceDir, { recursive: true });
  const app = await startEphemeralApp({ logFile: join(evidenceDir, "app.log") });
  project.provide("appUrl", app.url);
  project.provide("databaseUrl", app.databaseUrl);
  return app.stop;
}
