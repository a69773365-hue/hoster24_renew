const mineflayer = require("mineflayer");

const server = process.env.MC_SERVER || "";
const username = process.env.MC_USERNAME || "KeepAliveBot";
const version = process.env.MC_VERSION || false;
const stayMs = Number(process.env.STAY_MINUTES || 5) * 60 * 1000;

if (!server || server.includes("服务器地址")) {
  console.error("请先在 workflow 中把 MC_SERVER 改成真实的 地址:端口");
  process.exit(1);
}

const [host, portStr] = server.split(":");
const port = Number(portStr) || 25565;

console.log(`连接 ${host}:${port}，用户名 ${username}`);

const bot = mineflayer.createBot({
  host,
  port,
  username,
  version,
  auth: "offline",
});

let joined = false;
let finished = false;

// 60 秒内没进服就判定失败
const joinTimeout = setTimeout(() => {
  if (!joined) {
    console.error("连接超时，未能进入服务器");
    process.exit(1);
  }
}, 60 * 1000);

bot.once("spawn", () => {
  joined = true;
  clearTimeout(joinTimeout);
  console.log(`已进入服务器，开始挂机 ${stayMs / 60000} 分钟`);

  // 简单防 AFK：定时跳一下、转转视角
  const afk = setInterval(() => {
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 300);
    bot.look(Math.random() * Math.PI * 2, 0, true);
  }, 15 * 1000);

  setTimeout(() => {
    finished = true;
    clearInterval(afk);
    console.log("挂机时间到，退出服务器");
    bot.quit();
    setTimeout(() => process.exit(0), 2000);
  }, stayMs);
});

bot.on("kicked", (reason) => {
  const text = typeof reason === "string" ? reason : JSON.stringify(reason);
  console.error("被踢出:", text);
  if (/whitelist|白名单/i.test(text)) {
    console.error(
      `\n[提示] 服务器开启了白名单，请在服务器上执行：\n  whitelist add ${username}\n` +
      `或用 node gen-whitelist.js ${username} 生成条目放入 whitelist.json，再执行 whitelist reload`
    );
  }
});
bot.on("error", (err) => console.error("错误:", err.message));
bot.on("end", () => {
  if (!finished) {
    console.error("连接意外断开");
    process.exit(1);
  }
});
