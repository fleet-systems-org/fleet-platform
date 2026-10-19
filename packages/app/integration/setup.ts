// Registered for every integration test file by vitest.config.ts, so evidence never depends on the test author.
import { afterEach, beforeEach, type TestContext } from "vitest";
import { finishTestBrowser, startTestBrowser } from "./browser";

beforeEach(() => startTestBrowser());
afterEach(({ task }: TestContext) => {
  const names: string[] = [task.name];
  for (let suite = task.suite; suite && !("filepath" in suite); suite = suite.suite) names.unshift(suite.name);
  return finishTestBrowser(names.join(" "));
});
