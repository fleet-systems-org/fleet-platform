import { fileURLToPath } from "node:url";

/** Screenshots and the application log of the latest integration run; uploaded by CI as `integration-evidence`. */
export const evidenceDir = fileURLToPath(new URL("../../../integration-evidence", import.meta.url));
