const crypto = require("crypto");

const name = process.argv[2] || process.env.MC_USERNAME || "KeepAliveBot";

function offlineUUID(name) {
  const hash = crypto.createHash("md5").update("OfflinePlayer:" + name).digest();
  hash[6] = (hash[6] & 0x0f) | 0x30; // version 3
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant
  const h = hash.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

console.log(JSON.stringify([{ uuid: offlineUUID(name), name }], null, 2));
