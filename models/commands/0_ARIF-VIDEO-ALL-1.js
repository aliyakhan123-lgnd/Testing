const fs = require("fs");
const axios = require("axios");
const path = require("path");

// ===== MODULE CONFIG =====
module.exports.config = {
    name: "videoall",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "GirlVideo & TikTok random video sender",
    commandCategory: "Random-VIDEO",
    usages: "girlvideo / tiktok",
    cooldowns: 3,
};

// ===== HARD CREATOR LOCK =====
const CREATOR_LOCK = (() => {
    const encoded = "QVJJRiBCQUJV"; // ARIF BABU
    return Buffer.from(encoded, "base64").toString("utf8");
})();

if (module.exports.config.credits !== CREATOR_LOCK) {
    console.log("❌ Creator Lock Activated!");
    module.exports.run = () => {};
    module.exports.handleEvent = () => {};
    return;
}

// ===== VIDEO CATEGORIES =====
const categories = {
    girlvideo: {
        links: [
            "https://i.imgur.com/ZCmkPTO.mp4",
            "https://i.imgur.com/JA8jUCD.mp4",
            "https://i.imgur.com/W3N3f9Y.mp4",
            "https://i.imgur.com/sAIueiC.mp4"
        ],
        reaction: "✅"
    },
    tiktok: {
        links: [
            "https://i.imgur.com/ZCmkPTO.mp4",
            "https://i.imgur.com/JA8jUCD.mp4",
            "https://i.imgur.com/W3N3f9Y.mp4",
            "https://i.imgur.com/sAIueiC.mp4"
        ],
        reaction: "🥳"
    }
};

// ===== COMMON FUNCTION =====
async function sendRandomVideo(api, threadID, messageID, command) {

    const randomLink =
        categories[command].links[
            Math.floor(Math.random() * categories[command].links.length)
        ];

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `${Date.now()}.mp4`);

    try {
        const response = await axios.get(randomLink, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        fs.writeFileSync(filePath, response.data);

        await api.sendMessage(
            {
                body: "",
                attachment: fs.createReadStream(filePath)
            },
            threadID,
            () => {
                fs.unlinkSync(filePath);
            },
            messageID
        );

        api.setMessageReaction(categories[command].reaction, messageID, () => {}, true);

    } catch (err) {
        console.log(err.message);
        api.sendMessage("❌ Video send failed. Link problem ho sakta hai.", threadID, messageID);
    }
}

// ===== NO PREFIX SUPPORT =====
module.exports.handleEvent = async function ({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body) return;

    const text = body.toLowerCase().trim();

    if (categories[text]) {
        return sendRandomVideo(api, threadID, messageID, text);
    }
};

// ===== PREFIX SUPPORT =====
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const commandName = args[0]?.toLowerCase();

    if (categories[commandName]) {
        return sendRandomVideo(api, threadID, messageID, commandName);
    }

    return api.sendMessage(
        "⚠️ Use:\n• girlvideo\n• tiktok",
        threadID,
        messageID
    );
};