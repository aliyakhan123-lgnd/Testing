const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports.config = {
  name: "dpname2",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "MUSKAN Stylish Brush Name",
  commandCategory: "image",
  usages: "reply image + Name",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0)
      return api.sendMessage("❌ Image ko reply karo.", threadID, messageID);

    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo")
      return api.sendMessage("❌ Sirf photo pe kaam karega.", threadID, messageID);

    const input = args.join(" ").trim();
    if (!input)
      return api.sendMessage("❌ Naam likho.", threadID, messageID);

    const imgData = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
    const img = await loadImage(imgData);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, img.width, img.height);

    // ===== MUSKAN STYLE TEXT =====
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const fontSize = Math.floor(img.width / 4);
    ctx.font = `bold ${fontSize}px Arial Black`;

    const x = img.width / 2;
    const y = img.height * 0.65;

    // Black Glow
    ctx.shadowColor = "black";
    ctx.shadowBlur = 25;
    ctx.lineWidth = 12;
    ctx.strokeStyle = "black";
    ctx.strokeText(input, x, y);

    // White Fill
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.fillText(input, x, y);

    // Red Stylish Stroke Overlay
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red";
    ctx.strokeText(input, x, y);

    // Stylish Underline Stroke
    ctx.beginPath();
    ctx.moveTo(img.width * 0.2, y + fontSize / 2);
    ctx.lineTo(img.width * 0.8, y + fontSize / 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "red";
    ctx.stroke();

    const filePath = path.join(__dirname, `dpname_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, canvas.toBuffer("image/jpeg"));

    api.sendMessage(
      { attachment: fs.createReadStream(filePath) },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error aaya, check hosting.", event.threadID, event.messageID);
  }
};