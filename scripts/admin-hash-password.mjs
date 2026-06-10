import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Użycie: npm run admin:hash-password -- \"twoje-haslo\"");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const verify = await bcrypt.compare(password, hash);
const b64 = Buffer.from(hash, "utf8").toString("base64");

console.log("");
console.log("Wklej do .env.local (zalecane — działa z Next.js):");
console.log(`WEDDINFO_ADMIN_PASSWORD_HASH_B64=${b64}`);
console.log("");
console.log("Usuń lub zakomentuj starą linię WEDDINFO_ADMIN_PASSWORD_HASH (znaki $ psują hash w Next.js).");
console.log("");
console.log("Weryfikacja round-trip:", verify ? "OK" : "BŁĄD");
if (!verify) process.exit(1);
