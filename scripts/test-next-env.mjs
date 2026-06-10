import nextEnv from "@next/env";
import bcrypt from "bcryptjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function decodeHash() {
  const b64 = process.env.WEDDINFO_ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  return process.env.WEDDINFO_ADMIN_PASSWORD_HASH?.trim() ?? "";
}

const hash = decodeHash();
console.log("hash JSON:", JSON.stringify(hash));
console.log("length:", hash.length);
console.log("valid:", /^\$2[aby]\$\d{2}\$.{53}$/.test(hash));

const password = process.argv[2];
if (password) {
  console.log("bcrypt compare:", await bcrypt.compare(password, hash));
}
