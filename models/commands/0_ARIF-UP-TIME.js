const os = require("os");

global.client = global.client || {};
global.client.timeStart = Date.now();

module.exports.config = {
  name: "upt",
  version: "1.1.2",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Uptime | Prefix + Non-Prefix",
  commandCategory: "system",
  usages: "upt / .upt / !upt",
  cooldowns: 5
};

// ================= NON-PREFIX =================
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  if (event.body.toLowerCase().trim() !== "upt") return;
  sendUptime(api, event);
};

// ================= PREFIX =================
module.exports.run = async ({ api, event }) => {
  sendUptime(api, event);
};

// ================= FUNCTION =================
function sendUptime(api, event) {
  const uptime = process.uptime();

  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const now = new Date();

  const time = now.toLocaleTimeString("en-IN", {
    hour12: true,
    timeZone: "Asia/Kolkata"
  });

  const date = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  const day = now.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata"
  });

  const commandsCount = global.client.commands
    ? global.client.commands.size
    : "N/A";

  const owner = "ARIF BABU";

  const message = 
`╭─────────────────────────────╮
│        🎉 ✧ 𝗨𝗣𝗧𝗜𝗠𝗘 ✧ 😉  │
╰─────────────────────────────╯

✰ 𝗥𝗨𝗡 ➪ ${hours}ʜ ${minutes}ᴍ ${seconds}ꜱ ✅
✰ 𝗧𝗜𝗠𝗘 ➪ ${time} ⏰
✰ 𝗗𝗔𝗧𝗘 ➪ ${date} 📅
✰ 𝗗𝗔𝗬 ➪ ${day} 🗓️
✰ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 ➪ ${commandsCount} 📊
✰ 𝗢𝘄𝗻𝗲𝗿 ➪ ${owner} 👑

┗━━━━━━━━━━━━━━━━━━━━━━━┛
𝗠𝗔𝗗𝗘 𝗕𝗬 ❤️‍🔥 𝗔𝗥𝗜𝗙 𝗕𝗔𝗕𝗨`;

  api.sendMessage(message, event.threadID, event.messageID);
}