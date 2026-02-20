const axios = require("axios");
const yts = require("yt-search");

/* ================= CREATOR LOCK ================= */
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRi1CQUJV"; // ARIF-BABU (Base64)
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// 🔐 Credit Protection
if (module.exports?.config?.credits && module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  return;
}

/* 🎞 Loading Frames */
const frames = [
  "🎵 ▰▱▱▱▱▱▱▱▱▱ 10%",
  "🎶 ▰▰▱▱▱▱▱▱▱▱ 20%",
  "🎧 ▰▰▰▰▱▱▱▱▱▱ 40%",
  "💿 ▰▰▰▰▰▰▱▱▱▱ 60%",
  "❤️ ▰▰▰▰▰▰▰▰▰▰ 100%"
];

/* 🌐 API */
const baseApiUrl = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return res.data.api;
};

(async () => {
  global.apis = { diptoApi: await baseApiUrl() };
})();

async function getStreamFromURL(url, name) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = name;
  return res.data;
}

/* 🧹 Helpers */
function cleanTitle(title = "") {
  return title.replace(/[\\/:*?"<>|]/g, "").trim();
}
function isYoutubeLink(text = "") {
  return /youtu\.be|youtube\.com/.test(text);
}

/* ⚙ CONFIG */
module.exports.config = {
  name: "song",
  version: "2.2.0",
  credits: "ARIF-BABU",
  hasPermssion: 0,
  cooldowns: 5,
  description: "YouTube MP3 with full info box",
  commandCategory: "media",
  usages: "song <name | link>"
};

/* PREFIX MODE ONLY */
module.exports.run = async function ({ api, args, event }) {

  if (!args[0]) {
    return api.sendMessage(
      "❌ Song ka naam ya YouTube link do",
      event.threadID,
      event.messageID
    );
  }

  try {

    const loading = await api.sendMessage(
      "🔍 Song processing...",
      event.threadID
    );

    for (const f of frames) {
      await new Promise(r => setTimeout(r, 350));
      await api.editMessage(f, loading.messageID);
    }

    let title = "Unknown Title";
    let duration = "N/A";
    let artist = "Unknown";
    let views = "N/A";
    let uploaded = "N/A";
    let videoID;

    const input = args.join(" ");

    // 🔥 SAFE SEARCH (name + link)
    const search = await yts(input);
    const video = search.videos && search.videos[0];

    if (video) {
      videoID = video.videoId;
      title = cleanTitle(video.title);
      duration = video.timestamp || "N/A";
      artist = video.author?.name || "Unknown";
      views = video.views ? video.views.toLocaleString() : "N/A";
      uploaded = video.ago || "N/A";
    }

    // fallback title for links
    if (isYoutubeLink(input) && title === "Unknown Title") {
      try {
        const oembed = await axios.get(
          `https://www.youtube.com/oembed?url=${input}&format=json`
        );
        title = cleanTitle(oembed.data.title);
        artist = oembed.data.author_name || artist;
      } catch {}
    }

    if (!videoID) throw new Error("Video not found");

    const { data } = await axios.get(
      `${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`
    );

    api.unsendMessage(loading.messageID);

    return api.sendMessage(
      {
        body: `
🎵 Title: ${title}
⏱ Duration: ${duration}
👤 Artist: ${artist}
👀 Views: ${views}
📅 Uploaded: ${uploaded}

┗━━━━━━━━━━━━━━━━┛
        `,
        attachment: await getStreamFromURL(
          data.downloadLink,
          `${title}.mp3`
        )
      },
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "⚠️ Song info fetch nahi ho pa rahi 😢",
      event.threadID,
      event.messageID
    );
  }
};