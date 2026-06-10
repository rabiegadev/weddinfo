import { readFileSync } from "node:fs";
import mysql from "mysql2/promise";

const env = readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="([^"]+)"/m);
if (!match) {
  console.error("Brak DATABASE_URL");
  process.exit(1);
}

const pool = mysql.createPool(match[1]);
const publicId = String(Math.floor(100000 + Math.random() * 900000));
const now = new Date().toISOString().slice(0, 19).replace("T", " ");

try {
  const [describe] = await pool.query("DESCRIBE inquiries");
  console.log("=== inquiries schema ===");
  for (const row of describe) {
    console.log(row.Field, row.Type, row.Null, row.Key, row.Default, row.Extra);
  }

  const [result] = await pool.query(
    `INSERT INTO inquiries (
      public_id, guest_password_hash, inquiry_type, status,
      client_email, client_phone, contact_full_name, contact_message,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      publicId,
      "$2b$10$testhashfortestinsertonly000000000000000000000",
      "contact",
      "new",
      "test@example.com",
      "123456789",
      "Test User",
      "Test message",
      now,
      now,
    ],
  );

  console.log("INSERT OK", { publicId, insertId: result.insertId });
  await pool.query("DELETE FROM inquiries WHERE public_id = ?", [publicId]);
  console.log("Cleanup OK");
} catch (error) {
  console.error("FAIL", error.code, error.message);
} finally {
  await pool.end();
}
