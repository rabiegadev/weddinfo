/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");

const plain = process.argv[2];
if (!plain) {
  console.error("Użycie: npm run admin:hash-password -- <hasło>");
  process.exit(1);
}

bcrypt.hash(plain, 12).then((hash) => {
  console.log(hash);
});
