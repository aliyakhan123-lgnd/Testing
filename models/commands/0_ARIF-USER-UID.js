module.exports.config = {
  name: "uid",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Get User ID (self / mention / reply)",
  commandCategory: "Tools",
  cooldowns: 5
};

// 🔒 CREATOR NAME LOCK
function checkCredits(api, event) {
  if (module.exports.config.credits !== "ARIF BABU") {
    api.sendMessage(
      "❌ This command is locked.\nCreator: ARIF BABU",
      event.threadID,
      event.messageID
    );
    return false;
  }
  return true;
}

module.exports.run = function ({ api, event }) {

  // 🔐 CREDIT CHECK
  if (!checkCredits(api, event)) return;

  // ============ 1️⃣ REPLY ============
  if (event.type === "message_reply" && event.messageReply?.senderID) {
    return api.sendMessage(
      `📌 𝗨𝗦𝗘𝗥 𝗨𝗜𝗗:\n${event.messageReply.senderID} ❤️`,
      event.threadID,
      event.messageID
    );
  }

  // ============ 2️⃣ MENTION (SAFE METHOD) ============
  const mentionsObj = event.mentions || {};
  const mentionIDs = Object.keys(mentionsObj);

  // 🔁 Text-based fallback (IMPORTANT for 2026)
  const body = event.body || "";
  const reg = /\@\[([0-9]+)\:/g;
  let match;
  while ((match = reg.exec(body)) !== null) {
    if (!mentionIDs.includes(match[1])) {
      mentionIDs.push(match[1]);
      mentionsObj[match[1]] = "User";
    }
  }

  if (mentionIDs.length > 0) {
    let msg = "";
    for (const uid of mentionIDs) {
      const name = (mentionsObj[uid] || "User").replace("@", "");
      msg += `📌 ${name} 𝗨𝗦𝗘𝗥 𝗨𝗜𝗗:\n${uid} ❤️\n\n`;
    }
    return api.sendMessage(msg.trim(), event.threadID, event.messageID);
  }

  // ============ 3️⃣ SELF UID ============
  return api.sendMessage(
    `📌 𝗨𝗦𝗘𝗥 𝗨𝗜𝗗:\n${event.senderID} ❤️`,
    event.threadID,
    event.messageID
  );
};