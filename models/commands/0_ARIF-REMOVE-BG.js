const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "removebg",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Remove background from photo",
  commandCategory: "Tool",
  usages: "Reply to a photo or provide image URL",
  cooldowns: 2,
  dependencies: {
    "form-data": "",
    "image-downloader": ""
  }
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

module.exports.run = async function({ api, event, args }) {
  try {
    const apiKeys = [
      "y5K9ssQnhr8sB9Tp4hrMsLtU",
      "s6d6EanXm7pEsck9zKjgnJ5u",
      "GJkFyR3WdGAwn8xW5MDYAVWf",
      "ZLTgza4FPGii1AEUmZpkzYb7",
      "ymutgb6hEYEDR6xUbfQUiPri",
      "m6AhtWhWJBAPqZzy5BrvMmUp"
    ];

    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    let imageUrl;

    // ================= IMAGE SOURCE =================
    if (event.type === "message_reply") {
      if (!event.messageReply.attachments || event.messageReply.attachments.length === 0)
        return api.sendMessage("❌ Reply to a photo message", event.threadID);

      if (event.messageReply.attachments[0].type !== "photo")
        return api.sendMessage("❌ Reply to a photo only", event.threadID);

      imageUrl = event.messageReply.attachments[0].url;
    } else {
      if (args.length === 0)
        return api.sendMessage("❌ Provide image URL or reply to photo", event.threadID);

      imageUrl = args.join(" ");
    }

    api.sendMessage("⏳ Removing background... Please wait", event.threadID);

    // ================= CACHE SETUP =================
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const cachePath = path.join(cacheDir, `${Date.now()}.png`);
    await image({ url: imageUrl, dest: cachePath });

    // ================= API REQUEST =================
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(cachePath));
    formData.append("size", "auto");

    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": apiKey
      }
    });

    const outputPath = path.join(cacheDir, `removed_${Date.now()}.png`);
    fs.writeFileSync(outputPath, response.data);

    // ================= SEND RESULT =================
    api.sendMessage({
      body: "✅ Background removed successfully",
      attachment: fs.createReadStream(outputPath)
    }, event.threadID, () => {
      try {
        fs.unlinkSync(cachePath);
        fs.unlinkSync(outputPath);
      } catch (e) {}
    });

  } catch (error) {
    console.error("RemoveBG Error:", error);

    let errorMessage = "❌ Failed to remove background";

    if (error.response) {
      errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    api.sendMessage(errorMessage, event.threadID);
  }
};