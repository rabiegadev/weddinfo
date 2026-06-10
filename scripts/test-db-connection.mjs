import { readFileSync } from "node:fs";
import mysql from "mysql2/promise";

const env = readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="([^"]+)"/m);
if (!match) {
  console.error("Brak DATABASE_URL w .env.local");
  process.exit(1);
}

const url = match[1];
const hosts = ["localhost", "h63.seohost.pl", "srv91710.seohost.pl"];

for (const host of hosts) {
  const testUrl = url.replace(/@[^:/]+:/, `@${host}:`);
  const safe = testUrl.replace(/:([^:@/]+)@/, ":***@");
  try {
    const conn = await mysql.createConnection(testUrl);
    await conn.query("SELECT 1");
    await conn.end();
    console.log(`OK  ${host}  ${safe}`);
  } catch (error) {
    const e = error;
    console.log(`FAIL ${host}  ${e.code ?? "?"}  ${e.message}`);
  }
}
