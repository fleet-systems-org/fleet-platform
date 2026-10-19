import { createDatabase } from "./index";

async function main() {
  const orm = await createDatabase(process.env.DATABASE_URL);
  try {
    await orm.em.getConnection().execute("select 1");
    console.log("PASS: PostgreSQL connection and query.");
  } finally {
    await orm.close(true);
  }
}

main().catch(() => {
  console.error("FAIL: PostgreSQL check. Verify DATABASE_URL and database availability.");
  process.exitCode = 1;
});
