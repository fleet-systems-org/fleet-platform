import type { TestProject } from "vitest/node";
import { startEphemeralApp } from "./ephemeral-app";

declare module "vitest" {
  export interface ProvidedContext {
    appUrl: string;
    databaseUrl: string;
  }
}

export default async function setup(project: TestProject) {
  const app = await startEphemeralApp();
  project.provide("appUrl", app.url);
  project.provide("databaseUrl", app.databaseUrl);
  return app.stop;
}
