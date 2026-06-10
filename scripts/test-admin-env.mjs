import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

const raw = process.env.WEDDINFO_ADMIN_PASSWORD_HASH;
console.log("raw JSON:", JSON.stringify(raw));
console.log("length:", raw?.length);
console.log("starts with $:", raw?.startsWith("$"));
console.log("starts with quote:", raw?.startsWith("'"));

const password = process.argv[2];
if (password && raw) {
  const trimmed = raw.replace(/^['"]+|['"]+$/g, "");
  console.log("trimmed JSON:", JSON.stringify(trimmed));
  console.log("trimmed length:", trimmed.length);
  const okRaw = await bcrypt.compare(password, raw);
  const okTrimmed = await bcrypt.compare(password, trimmed);
  console.log("bcrypt compare (raw):", okRaw);
  console.log("bcrypt compare (trimmed):", okTrimmed);
}
