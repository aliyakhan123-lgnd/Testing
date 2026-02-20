// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
    name: "pending",
    version: "2.1.0",
    credits: "ARIF BABU",
    hasPermssion: 2,
    description: "Pending Group Approval System (Hinglish)",
    commandCategory: "SYSTEM",
    cooldowns: 5
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
    console.log("❌ Creator Lock Activated! Credits cannot be changed.");
    module.exports.run = () => {};
    module.exports.handleReply = () => {};
    return;
}

module.exports.languages = {
    en: {
        invaildNumber: "❌ Boss ye number galat hai 👉 %1\nDhyan se sahi number bhejo 😐",

        cancelSuccess: "✅ Boss %1 group ko pending se hata diya gaya hai 🚫",

        approveSuccess: "🎉 Boss aapne %1 group approve kar diya 🤝",

        notiBox:
            "✅ Aapka group approve ho gaya hai 🎉\n" +
            "📌 Commands dekhne ke liye 👉 #help | #help2",

        returnListPending:
            "╭──────── ★ ·.· ────────╮\n" +
            "        🔔 PENDING GROUPS\n" +
            "╰──────── ·.· ★ ────────╯\n\n" +
            "👑 Boss aapke paas total %1 group pending mein hain\n\n" +
            "%2\n" +
            "✏️ Approve karne ke liye number bhejo\n" +
            "🚫 Remove karne ke liye likho: c 1 2 3",

        returnListClean:
            "╭──────── ★ ·.· ────────╮\n" +
            "        🔔 PENDING GROUPS\n" +
            "╰──────── ·.· ★ ────────╯\n\n" +
            "😎 Boss abhi koi bhi group pending mein nahi hai"
    }
};

// ===================================================

module.exports.handleReply = async function ({ api, event, handleReply, getText }) {
    if (String(event.senderID) !== String(handleReply.author)) return;

    const { body, threadID, messageID } = event;
    let count = 0;

    if (!body) return;

    // CANCEL MODE
    if (body.toLowerCase().startsWith("c")) {
        const indexList = body.slice(1).trim().split(/\s+/);

        for (const i of indexList) {
            if (isNaN(i) || i <= 0 || i > handleReply.pending.length)
                return api.sendMessage(
                    getText("invaildNumber", i),
                    threadID,
                    messageID
                );

            await api.removeUserFromGroup(
                api.getCurrentUserID(),
                handleReply.pending[i - 1].threadID
            );
            count++;
        }

        return api.sendMessage(
            getText("cancelSuccess", count),
            threadID,
            messageID
        );
    }

    // APPROVE MODE
    const indexList = body.trim().split(/\s+/);

    for (const i of indexList) {
        if (isNaN(i) || i <= 0 || i > handleReply.pending.length)
            return api.sendMessage(
                getText("invaildNumber", i),
                threadID,
                messageID
            );

        await api.sendMessage(
            getText("notiBox"),
            handleReply.pending[i - 1].threadID
        );
        count++;
    }

    return api.sendMessage(
        getText("approveSuccess", count),
        threadID,
        messageID
    );
};

// ===================================================

module.exports.run = async function ({ api, event, getText }) {
    const { threadID, messageID, senderID } = event;
    let msg = "";
    let index = 1;

    let list = [];
    try {
        const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
        const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        list = [...spam, ...pending].filter(t => t.isGroup && t.isSubscribed);
    } catch (e) {
        return api.sendMessage(
            "❌ Boss pending list load karne mein error aa gaya",
            threadID,
            messageID
        );
    }

    for (const group of list) {
        msg +=
            `🔹 ${index++}. ${group.name}\n` +
            `🆔 ${group.threadID}\n` +
            `༺══──────────══༻\n`;
    }

    if (list.length === 0)
        return api.sendMessage(
            getText("returnListClean"),
            threadID,
            messageID
        );

    return api.sendMessage(
        getText("returnListPending", list.length, msg),
        threadID,
        (err, info) => {
            global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                pending: list
            });
        },
        messageID
    );
};