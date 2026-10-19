// Disposable instance for manual checks, e.g. `agent-browser open <url>`. Stop with Ctrl+C.
import { startEphemeralApp } from "./ephemeral-app";

const app = await startEphemeralApp();
console.log(`Disposable fleet-platform instance: ${app.url}`);
console.log("PostgreSQL runs in a Testcontainers container and is removed on exit. Press Ctrl+C to stop.");
let stopping = false;
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    if (stopping) return;
    stopping = true;
    app.stop().then(() => process.exit(0), () => process.exit(1));
  });
}
