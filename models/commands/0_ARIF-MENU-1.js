// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "menu",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Auto menu (2 page, dynamic)",
  usePrefix: false,
  commandCategory: "System",
  usages: "menu / menu2",
  cooldowns: 5
};

const COMMANDS_PER_PAGE = 10;

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

/* ================= RUN ================= */
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botName = global.config.BOTNAME || "Mirai Bot";

  const commandsMap = global.client.commands;
  const commands = Array.from(commandsMap.keys());

  const totalCommands = commands.length;
  const totalPages = Math.ceil(totalCommands / COMMANDS_PER_PAGE);

  let page = parseInt(args[0]) || 1;
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * COMMANDS_PER_PAGE;
  const end = start + COMMANDS_PER_PAGE;
  const pageCommands = commands.slice(start, end);

  let msg =
`╭─────────────────────────────╮
           【 ${botName} 】        
╰─────────────────────────────╯\n\n`;

  msg += `📦 Total Commands : ${totalCommands}\n`;
  msg += `📄 Page : ${page}/${totalPages}\n\n`;
  msg += `『 📂 COMMAND LIST 』\n\n`;

  for (const name of pageCommands) {
    msg += `➤ ${name}\n`;
  }

  msg += `\n━━━━━━━━━━━━━━━━━━\n`;

  if (page < totalPages) {
    msg += `➡ Type: menu${page + 1}\n`;
  }
  if (page > 1) {
    msg += `⬅ Type: menu${page - 1}\n`;
  }

  msg += `╚══════════════════════╝`;

  return api.sendMessage(msg, threadID, messageID);
};

/* ================= NO PREFIX ================= */
module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();

  if (text === "menu") {
    return module.exports.run({ api, event, args: ["1"] });
  }

  if (text === "menu2") {
    return module.exports.run({ api, event, args: ["2"] });
  }
};