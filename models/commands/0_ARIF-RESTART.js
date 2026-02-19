module.exports.config = {
  name: "restart",
  version: "1.0.0",
  hasPermssion: 2, 
  credits: "ARIF BABU",
  description: "Restart the bot (Admin only)",
  commandCategory: "System",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  console.log(`[RESTART] Command called by user: ${senderID}`);

  // 🔐 Permission Check (Mirai Default System)
  if (this.config.hasPermssion == 2 && !global.config.ADMINBOT.includes(senderID)) {
    console.log(`[RESTART] Permission denied for user ${senderID}`);
    return api.sendMessage(
      "❌ You do not have permission to use this command.\nOnly bot administrators can restart the bot.",
      threadID,
      messageID
    );
  }

  try {
    console.log('[RESTART] Setting processing reaction...');
    api.setMessageReaction("⏳", messageID, () => {}, true);

    console.log('[RESTART] Sending restart message...');
    await api.sendMessage(
      "🔄 Bot is restarting...\n⏰ Please wait for the bot to come back online.",
      threadID,
      messageID
    );

    api.setMessageReaction("✅", messageID, () => {}, true);

    console.log('[RESTART] Restarting in 1 second...');

    setTimeout(() => {
      if (global.logger && global.logger.system) {
        global.logger.system(`Bot restart initiated by user ${senderID}`);
      }

      console.log("🔄 [RESTART] PROCESS.EXIT(2) CALLED");
      process.exit(2);
    }, 1000);

  } catch (error) {
    console.error("[RESTART] Error:", error);
    return api.sendMessage(
      "❌ Failed to restart the bot.",
      threadID,
      messageID
    );
  }
};