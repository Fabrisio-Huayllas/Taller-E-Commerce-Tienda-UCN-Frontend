/**
 * Script para generar NEXTAUTH_SECRET
 * Ejecuta: node generate-secret.js
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require("crypto");

const secret = crypto.randomBytes(32).toString("base64");
console.log("\n========================================");
console.log("🔐 NEXTAUTH_SECRET generado:");
console.log("========================================\n");
console.log(secret);
console.log("\n========================================");
console.log("Copia este valor en tu archivo .env.local");
console.log("========================================\n");
