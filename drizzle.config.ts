import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Jak Next.js: najpierw .env, potem .env.local nadpisuje (migrate/push z CLI widzą te same URL)
config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://user:pass@localhost:5432/weddinfo",
  },
});
