const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "4.0.0",
    credits: "ARIF BABU + ChatGPT",
    description: "Premium Join Notification System with Old Attachment Support",
    dependencies: { "fs-extra": "" }
};

// ====== HEADER STYLES ====== //
const headerStyles = [
"╔═══════ ✦❖✦ ═══════╗",
"╭──────── ★ ·. · ────────╮",
"╒══════════ ★ ∘°❉°∘ ★ ══════════╕",
"✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦",
"╔━━━〔 ✦ ★ ✧ ★ ✦ 〕━━━╗",
"▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰"
];

// ====== FOOTER STYLES ====== //
const footerStyles = [
"╚═══════ ✦❖✦ ═══════╝",
"╰──────── ★ ·. · ────────╯",
"╘══════════ ★ ∘°❉°∘ ★ ══════════╛",
"✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦",
"╚━━━〔 ✦ ★ ✧ ★ ✦ 〕━━━╝",
"▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰"
];

// ====== GREETING SYSTEM ====== //
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 18) return "🌤 Good Afternoon";
    return "🌙 Good Evening";
}

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;

    // ===============================
    //   BOT ADDED (YOUR FORMAT)
    // ===============================
    if (event.logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) {

        const header = headerStyles[Math.floor(Math.random() * headerStyles.length)];
        const footer = footerStyles[Math.floor(Math.random() * footerStyles.length)];
        const greet = getGreeting();

        const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const botName = global.config.BOTNAME || "Your Bot";
        const info = await api.getThreadInfo(threadID);
        const groupName = info.threadName || "Group Chat";

        return api.sendMessage(
`${header}

${greet} 🙂🔐
┏━━━━━━━━━━━━━━━┓
┃ 🤖 Bot Name: ${botName}

┃ 🏰 Group: ${groupName}

┃ ⏰ Time: ${time}
┗━━━━━━━━━━━━━━━┛
${footer}`,
            threadID
        );
    }

    // ===============================
    //      NEW MEMBER JOIN
    // ===============================
    try {
        const { threadName, participantIDs } = await api.getThreadInfo(threadID);

        for (let add of event.logMessageData.addedParticipants) {

            let uid = add.userFbId;
            if (uid == api.getCurrentUserID()) continue;

            api.getUserInfo(uid, async (err, data) => {
                if (err) return;

                const name = data[uid].name;
                const total = participantIDs.length;

                const header = headerStyles[Math.floor(Math.random() * headerStyles.length)];
                const footer = footerStyles[Math.floor(Math.random() * footerStyles.length)];
                const greet = getGreeting();
                const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

                // ============================
                //      YOUR MESSAGE FORMAT
                // ============================
                const msg =
`${header}

${greet}, 
┏━━━━━━━━━━━━━━━┓
┃ 👤 Member: ${name}
┃ 🏰  Group: ${threadName}

┃ 👥 Total Users: ${total}
┃ ⏰ Joined At: ${time}
┗━━━━━━━━━━━━━━━┛

${footer}`;

                // ================================
                //     OLD ATTACHMENT SYSTEM ✔
                // ================================
                const links = [
                    "https://i.imgur.com/m1aPqh8.mp4",
                    "https://i.imgur.com/S08GC8L.mp4",
                    "https://i.imgur.com/Vzumlkn.mp4",
                    "https://i.imgur.com/Sus0LAd.mp4",
                    "https://i.imgur.com/yqy9XvB.mp4"
                ];

                let link = links[Math.floor(Math.random() * links.length)];
                let isVideo = link.endsWith(".mp4");

                let filePath = __dirname + "/cache/attachment" + (isVideo ? ".mp4" : ".jpg");

                let callback = () =>
                    api.sendMessage(
                        {
                            body: msg,
                            attachment: fs.createReadStream(filePath),
                            mentions: [{ tag: name, id: uid }]
                        },
                        threadID,
                        () => fs.unlinkSync(filePath)
                    );

                request(encodeURI(link)).pipe(fs.createWriteStream(filePath)).on("close", callback);

            });

        }

    } catch (err) {
        console.log("ERROR:", err);
    }
};