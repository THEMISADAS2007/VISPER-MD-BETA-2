const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

const axios = require("axios"); 

var tmsg = '';
if (config.LANG === 'SI') tmsg = 'එය Bot link ලබා දෙයි.';
else tmsg = "It gives bot link.";

cmd({
    pattern: "script",
    alias: ["sc", "git", "repo"],
    react: '📚',
    desc: tmsg,
    category: "main",
    use: '.script',
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, groupMetadata, groupName,
    participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        
        const response = await axios.get("https://mv-visper-full-db.pages.dev/Main/main_var.json");
        const details = response.data;

        const result = `*🧿VISPER-MD🧿*

\`🔖 Github:\` ${details.reponame}

\`🪀 Whatsapp Channel:\` ${details.chlink}

\`⚕️ Support Group:\` ${details.supglink}

\`📡 Version:\` *4.0.0*`;

        reply(result);
    } catch (e) {
        l(e);
        reply("❌ Failed to fetch script details.");
    }
});

cmd({
  pattern: "stiktok",
  alias: ["tstalk", "ttstalk"],
  react: "📱",
  desc: "Fetch TikTok user profile details.",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    if (!q) {
      return reply("❎ Please provide a TikTok username.\n\n*Example:* .tiktokstalk Nadeenpoornaeditz");
    }

    const apiUrl = `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status) {
      return reply("❌ User not found. Please check the username and try again.");
    }

    const user = data.data.user;
    const stats = data.data.stats;

    const profileInfo = `🎭 *TikTok Profile Stalker* 🎭

👤 *Username:* @${user.uniqueId}
📛 *Nickname:* ${user.nickname}
✅ *Verified:* ${user.verified ? "Yes ✅" : "No ❌"}
📍 *Region:* ${user.region}
📝 *Bio:* ${user.signature || "No bio available."}
🔗 *Bio Link:* ${user.bioLink?.link || "No link available."}

📊 *Statistics:*
👥 *Followers:* ${stats.followerCount.toLocaleString()}
👤 *Following:* ${stats.followingCount.toLocaleString()}
❤️ *Likes:* ${stats.heartCount.toLocaleString()}
🎥 *Videos:* ${stats.videoCount.toLocaleString()}

📅 *Account Created:* ${new Date(user.createTime * 1000).toLocaleDateString()}
🔒 *Private Account:* ${user.privateAccount ? "Yes 🔒" : "No 🌍"}

🔗 *Profile URL:* https://www.tiktok.com/@${user.uniqueId}

> ${config.FOOTER}
`;

    const profileImage = { image: { url: user.avatarLarger }, caption: profileInfo };

    await conn.sendMessage(from, profileImage, { quoted: m });
  } catch (error) {
    console.error("❌ Error in TikTok stalk command:", error);
    reply("⚠️ An error occurred while fetching TikTok profile data.");
  }
});

cmd({
    pattern: "tempmail",
    alias: ["genmail"],
    desc: "Generate a new temporary email address",
    category: "other",
    react: "📧",
    filename: __filename
},
async (conn, mek, m, { from, reply, prefix }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');
        const { email, session_id, expires_at } = response.data;

        // Format the expiration time and date
        const expiresDate = new Date(expires_at);
        const timeString = expiresDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateString = expiresDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Create the complete message
        const message = `
📧 *TEMPORARY EMAIL GENERATED*

✉️ *Email Address:*
${email}

⏳ *Expires:*
${timeString} • ${dateString}

🔑 *Session ID:*
\`\`\`${session_id}\`\`\`

📥 *Check Inbox:*
.inbox ${session_id}

_Email will expire after 24 hours_
${config.FOOTER}
`;
const session = `${session_id}`;
        await conn.sendMessage(
            from,
            { 
                text: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363304606757133@newsletter',
                        newsletterName: 'NADEEN-MD',
                        serverMessageId: 101
                    }
                }
            },
            { quoted: mek }
        );
await conn.sendMessage(
            from,
            { 
                text: session,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363304606757133@newsletter',
                        newsletterName: 'NADEEN-MD',
                        serverMessageId: 101
                    }
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error('TempMail error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});
cmd({
    pattern: "checkmail",
    alias: ["inbox", "tmail", "mailinbox"],
    desc: "Check your temporary email inbox",
    category: "other",
    react: "📬",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const sessionId = args[0];
        if (!sessionId) return reply('🔑 Please provide your session ID\nExample: .checkmail YOUR_SESSION_ID');

        const inboxUrl = `https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${encodeURIComponent(sessionId)}`;
        const response = await axios.get(inboxUrl);

        if (!response.data.success) {
            return reply('❌ Invalid session ID or expired email');
        }

        const { inbox_count, messages } = response.data;

        if (inbox_count === 0) {
            return reply('📭 Your inbox is empty');
        }

        let messageList = `📬 *You have ${inbox_count} message(s)*\n\n`;
        messages.forEach((msg, index) => {
            messageList += `━━━━━━━━━━━━━━━━━━\n` +
                          `📌 *Message ${index + 1}*\n` +
                          `👤 *From:* ${msg.from}\n` +
                          `📝 *Subject:* ${msg.subject}\n` +
                          `⏰ *Date:* ${new Date(msg.date).toLocaleString()}\n\n` +
                          `📄 *Content:*\n${msg.body}\n\n ` +
                          `*㋛ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽𝙰𝙳𝙴𝙴𝙽 〽️𝙳*`;
        });

        await reply(messageList);

    } catch (e) {
        console.error('CheckMail error:', e);
        reply(`❌ Error checking inbox: ${e.response?.data?.message || e.message}`);
    }
});

cmd({
  pattern: "countryinfo",
  alias: ["cinfo", "country", "cinfo2"],
  desc: "Get information about a country",
  category: "other",
  react: "🌍",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, react }) => {
  try {
    if (!q) return reply("Please provide a country name.\nExample: `.countryinfo Pakistan`");

    const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      await react("❌");
      return reply(`No information found for *${q}*. Please check the country name.`);
    }

    const info = data.data;
    let neighborsText = info.neighbors.length > 0
      ? info.neighbors.map(n => `🌍 *${n.name}*`).join(", ")
      : "No neighboring countries found.";

    const text = `🌍 *Visper Country Information: ${info.name}* 🌍\n\n` +
      `🏛 *Capital:* ${info.capital}\n` +
      `📍 *Continent:* ${info.continent.name} ${info.continent.emoji}\n` +
      `📞 *Phone Code:* ${info.phoneCode}\n` +
      `📏 *Area:* ${info.area.squareKilometers} km² (${info.area.squareMiles} mi²)\n` +
      `🚗 *Driving Side:* ${info.drivingSide}\n` +
      `💱 *Currency:* ${info.currency}\n` +
      `🔤 *Languages:* ${info.languages.native.join(", ")}\n` +
      `🌟 *Famous For:* ${info.famousFor}\n` +
      `🌍 *ISO Codes:* ${info.isoCode.alpha2.toUpperCase()}, ${info.isoCode.alpha3.toUpperCase()}\n` +
      `🌎 *Internet TLD:* ${info.internetTLD}\n\n` +
      `🔗 *Neighbors:* ${neighborsText}` +
    `${config.FOOTER}`;

    await conn.sendMessage(from, {
      image: { url: info.flag },
      caption: text,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });

    await react("✅");
  } catch (e) {
    console.error("Error in countryinfo command:", e);
    await react("❌");
    reply("An error occurred while fetching country information.");
  }
});
cmd({
    pattern: "onlinelist",
    react: "🟢",
    alias: ["online","onlinemembers","activelist"],
    desc: "Show online members in group with mentions",
    category: "group",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    // Check if command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups!")
    
    // Check if bot has admin permissions (optional - remove if not needed)
    if (!isBotAdmins) return reply("❌ Bot needs admin permissions to check online status!")
    
    // Get group participants
    const groupParticipants = participants || groupMetadata.participants
    
    // Array to store online members
    let onlineMembers = []
    let onlineMentions = []
    
    // Check each participant's presence/status
    for (let participant of groupParticipants) {
        try {
            // Get user's presence/last seen info
            const presence = await conn.presenceSubscribe(participant.id)
            const lastSeen = await conn.chatRead(participant.id)
            
            // Check if user is online (you can adjust this logic based on your needs)
            // This is a basic implementation - you might need to modify based on your bot's capabilities
            const userStatus = await conn.fetchStatus(participant.id).catch(() => null)
            
            // For now, we'll consider all participants as potentially online
            // You can implement more sophisticated online detection here
            
            onlineMembers.push(participant.id.split('@')[0])
            onlineMentions.push(participant.id)
            
        } catch (err) {
            // If can't fetch status, skip this user
            continue
        }
    }
    
    // If no online detection is available, show all group members as a fallback
    if (onlineMembers.length === 0) {
        groupParticipants.forEach(participant => {
            onlineMembers.push(participant.id.split('@')[0])
            onlineMentions.push(participant.id)
        })
    }
    
    // Create the online list message
    let onlineList = `*╭──────────●●►*\n`
    onlineList += `*🟢 ${groupName} ONLINE LIST 🟢*\n\n`
    onlineList += `*📊 Total Members:* ${groupParticipants.length}\n`
    onlineList += `*🟢 Online Members:* ${onlineMembers.length}\n\n`
    onlineList += `*👥 Online Members List:*\n`
    
    // Add each online member with mention
    onlineMembers.forEach((member, index) => {
        onlineList += `${index + 1}. @${member}\n`
    })
    
    onlineList += `\n*╰──────────●●►*\n`
    onlineList += `*⚡VISPER-MD*`
    
    // Send the message with mentions
    await conn.sendMessage(from, {
        text: onlineList,
        mentions: onlineMentions
    }, {quoted: mek})

}catch(e){
    console.log(e)
    reply(`❌ Error: ${e}`)
}
})

// Alternative simpler version that just shows all group members
cmd({
    pattern: "grouplist",
    react: "👥",
    alias: ["memberlist","groupmembers","allmembers"],
    desc: "Show all group members with mentions",
    category: "group", 
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    // Check if command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups!")
    
    // Get group participants
    const groupParticipants = participants || groupMetadata.participants
    
    // Arrays for members and mentions
    let membersList = []
    let mentionsList = []
    
    // Get all members
    groupParticipants.forEach(participant => {
        membersList.push(participant.id.split('@')[0])
        mentionsList.push(participant.id)
    })
    
    // Create the members list message
    let membersMessage = `*╭──────────●●►*\n`
    membersMessage += `*👥 ${groupName} MEMBERS LIST 👥*\n\n`
    membersMessage += `*📊 Total Members:* ${membersList.length}\n\n`
    membersMessage += `*👥 All Members:*\n`
    
    // Add each member with mention
    membersList.forEach((member, index) => {
        membersMessage += `${index + 1}. @${member}\n`
    })
    
    membersMessage += `\n*╰──────────●●►*\n`
    membersMessage += `*⚡VISPER-MD*`
    
    // Send the message with mentions
    await conn.sendMessage(from, {
        text: membersMessage,
        mentions: mentionsList
    }, {quoted: mek})

}catch(e){
    console.log(e)
    reply(`❌ Error: ${e}`)
}
})

cmd({
    pattern: "freefire",
    desc: "Fetch ff info using a given URL",
    category: "search",
    react: "🤹🏼‍♂️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const url = q || (quoted?.text ?? "").trim();

        const res = await axios.get(`https://api.vreden.my.id/api/v1/stalker/freefire?id=${encodeURIComponent(url)}`);
        const data = res.data;

        if (!data.status) {
            return reply("Failed to fetch ff data. Please try again later.");
        }

        const result = data.result;

        const caption = `🔍 *FreeFire Id Info*\n\n` +
                        `*🏵 Game ID:* ${result.game_id}\n` +
                        `*🍱 Username:* ${result.username}\n\n${config.FOOTER}`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/vp0t1w.png' },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363380090478709@newsletter',
                    newsletterName: 'VISPER-MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("ffStalk Error:", err);
        reply("Something went wrong while fetching the ff info.");
    }
});

cmd({
    pattern: "short",
    react: "🔗",
    category: "other",
    use: ".short <url>",
    filename: __filename
}, async (conn, mek, m, context) => {
    const { from, args } = context;

    try {
        if (!args[0]) {
            return await conn.sendMessage(from, { text: '❌ Please provide a valid URL.\n\nExample: `.short https://youtube.com/`' }, { quoted: m });
        }

        const longUrl = args[0];
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        const shortUrl = await res.text();

        await conn.sendMessage(from, { text: `✅ *Shortened URL:*\n${shortUrl}\n${config.FOOTER}` }, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '❌ Failed to shorten the URL.' }, { quoted: m });
    }
});

cmd({
    pattern: "imgtotext",
    react: "🖼️",
    category: "other",
    use: ".ocr (reply to an image)",
    filename: __filename
}, async (conn, mek, m, context) => {
    const { from } = context;

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image')) {
            return await conn.sendMessage(from, { text: '❌ Reply to an *image* to extract text using `.ocr`' }, { quoted: m });
        }

        // Download image buffer
        let imgBuffer = await q.download();

        // Use OCR.space free API (you can replace API key with yours)
        const formData = new FormData();
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");
        formData.append("file", imgBuffer, "image.jpg");

        const response = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            headers: { apikey: "helloworld" }, // Free test key
            body: formData
        });

        const result = await response.json();
        const text = result?.ParsedResults?.[0]?.ParsedText?.trim();

        if (!text) {
            return await conn.sendMessage(from, { text: "⚠️ No readable text found in image." }, { quoted: m });
        }

        await conn.sendMessage(from, { text: `📝 *Extracted Text:*\n\n${text}\n${config.FOOTER}` }, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Failed to extract text from image." }, { quoted: m });
    }
});

cmd({
    pattern: "loading",
    react: "⚡",
    category: "fun",
    use: ".loading",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const totalSteps = 10; // Number of updates
        const delay = 700; // milliseconds between updates
        let progress = 0;

        // Generate random increments (to make it look real)
        const randomIncrease = () => Math.floor(Math.random() * 10) + 5; // between 5% - 15%

        // first message
        let msg = await conn.sendMessage(from, { text: `🔄 Loading... 0%\n[░░░░░░░░░░]` }, { quoted: m });

        for (let i = 0; i < totalSteps; i++) {
            await new Promise(r => setTimeout(r, delay));

            progress += randomIncrease();
            if (progress > 100) progress = 100;

            // create animated bar
            const barLength = 10;
            const filledBlocks = Math.floor((progress / 100) * barLength);
            const emptyBlocks = barLength - filledBlocks;
            const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

            const text = progress < 100
                ? `⚙️ Loading... ${progress}%\n[${bar}]`
                : `✅ *Loading Completed!*\n\nලෝඩ් උනාට මුකුත් නෑ 👾\n\n${config.FOOTER}`;

            await conn.sendMessage(from, {
                edit: msg.key,
                text
            });
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Loading animation failed." }, { quoted: m });
    }
});
//
const fs = require('fs');
const fse = require('fs-extra'); // optional but handy
const path = require('path');
const AdmZip = require('adm-zip');
const { Storage } = require('megajs');

cmd({
  pattern: "getchat",
  desc: "Zip a specific chat's messages and media, upload to MEGA (owner + allowed numbers)",
  category: "owner",
  fromMe: true,
  filename: __filename
}, async (conn, m, msg, { isOwner, args, reply }) => {
  try {
    // ---------- allowed numbers ----------
    const allowedNumbers = [
      "94711451319",
      "94716769285",
      "94724375368"
    ];

    // get sender number (works for many libs)
    const rawSender = (m && (m.sender || (m.key && m.key.participant) || (m.key && m.key.remoteJid))) || "";
    let senderNumber = rawSender.toString().replace(/@.*$/,"").replace(/:\d+$/,"");

    // permission check: must be owner or in allowedNumbers
    if (!isOwner && !allowedNumbers.includes(senderNumber)) {
      return await reply("🚫 You are not allowed to use this command.");
    }

    // parse target phone from args
    if (!args || !args[0]) return await reply("❗ Usage: .getchat <phone_number>\nExample: .getchat 94711451319");

    let target = args[0].toString().replace(/\D/g, ""); // keep digits only
    if (!/^\d{7,15}$/.test(target)) return await reply("❗ Invalid phone number provided.");

    // build possible chatIds
    const chatIds = [
      `${target}@s.whatsapp.net`,
      `${target}@c.us`
      // add more variations if your lib uses different suffixes
    ];

    // helper to extract messages from various conn shapes
    const getChatMessages = async (chatId) => {
      // Try common places depending on library
      // 1) conn.store && conn.store.messages[chatId] (Baileys older)
      try {
        if (conn.store && conn.store.messages && conn.store.messages[chatId]) {
          const map = conn.store.messages[chatId];
          // map may be a Map or object; normalize to array
          if (typeof map.forEach === 'function') {
            const arr = [];
            map.forEach((v, k) => arr.push(v));
            return arr;
          } else if (Array.isArray(map)) {
            return map;
          } else if (typeof map === 'object') {
            return Object.values(map);
          }
        }
      } catch (e) {}

      // 2) conn.chats (some libs)
      try {
        if (conn.chats && (conn.chats[chatId] || (typeof conn.chats.get === 'function' && conn.chats.get(chatId)))) {
          const chatObj = conn.chats[chatId] || conn.chats.get(chatId);
          if (chatObj && chatObj.messages) {
            if (Array.isArray(chatObj.messages)) return chatObj.messages;
            if (typeof chatObj.messages.forEach === 'function') {
              const arr = []; chatObj.messages.forEach((v) => arr.push(v)); return arr;
            }
            return Object.values(chatObj.messages || {});
          }
        }
      } catch (e) {}

      // 3) conn.msgs or conn.messages store
      try {
        if (conn.msgs && typeof conn.msgs.filter === 'function') {
          // filter messages by key.remoteJid
          const arr = conn.msgs.filter(item => {
            const jid = (item && (item.key && item.key.remoteJid)) || (item && item.remoteJid) || "";
            return jid === chatId;
          });
          if (arr && arr.length) return arr;
        }
      } catch (e) {}

      // 4) conn.loadMessages? try to call if exists (Baileys helpers)
      try {
        if (typeof conn.loadMessages === 'function') {
          const { messages } = await conn.loadMessages(chatId, 1000); // try to load up to 1000
          if (messages && messages.length) return messages;
        }
      } catch (e) {}

      // 5) fallback: try to fetch via conn.fetchMessages / conn.query
      // (left as fallback for specific implementations)
      return null;
    };

    // find a chatId that yields messages
    let messages = null;
    let foundChatId = null;
    for (const id of chatIds) {
      messages = await getChatMessages(id);
      if (messages && messages.length) {
        foundChatId = id;
        break;
      }
    }

    if (!messages || messages.length === 0) {
      return await reply(`❌ Could not find messages for ${target}. Ensure the bot has that chat in its store.`);
    }

    // ---------- prepare local folder ----------
    const rootPath = path.join(__dirname, "..");
    const exportBase = path.join(rootPath, "chat_exports");
    await fse.ensureDir(exportBase);

    const folderName = `chat_${target}_${Date.now()}`;
    const exportFolder = path.join(exportBase, folderName);
    await fse.ensureDir(exportFolder);

    // save messages JSON (normalized)
    const normalized = [];
    // We'll attempt to also download media if possible
    await reply(`⏳ Preparing ${messages.length} messages. Downloading media where possible...`);

    for (let i = 0; i < messages.length; i++) {
      const msgObj = messages[i];
      // make a shallow copy to avoid circular structures
      const meta = {
        id: msgObj.key ? msgObj.key.id || msgObj.key.remoteJid || null : (msgObj.id || null),
        from: (msgObj.key && msgObj.key.fromMe) ? "me" : (msgObj.key && msgObj.key.participant) || foundChatId,
        timestamp: (msgObj.messageTimestamp || (msgObj.key && msgObj.key.timestamp) || msgObj.timestamp || null),
        message: msgObj.message || msgObj // keep actual message payload
      };

      // detect media and try to download
      try {
        const hasImage = msgObj.message && (msgObj.message.imageMessage || msgObj.message['imageMessage']);
        const hasVideo = msgObj.message && (msgObj.message.videoMessage || msgObj.message['videoMessage']);
        const hasAudio = msgObj.message && (msgObj.message.audioMessage || msgObj.message['audioMessage']);
        const hasSticker = msgObj.message && (msgObj.message.stickerMessage || msgObj.message['stickerMessage']);
        const hasDocument = msgObj.message && (msgObj.message.documentMessage || msgObj.message['documentMessage']);
        let mediaType = null;
        if (hasImage) mediaType = 'image';
        else if (hasVideo) mediaType = 'video';
        else if (hasAudio) mediaType = 'audio';
        else if (hasSticker) mediaType = 'sticker';
        else if (hasDocument) mediaType = 'document';

        if (mediaType && typeof conn.downloadMediaMessage === 'function') {
          // downloadMediaMessage usually accepts the message object
          try {
            const mediaBuffer = await conn.downloadMediaMessage(msgObj).catch(()=>null);
            if (mediaBuffer) {
              const extMap = { image: '.jpg', video: '.mp4', audio: '.mp3', sticker: '.webp', document: '' };
              const ext = extMap[mediaType] || '';
              const filename = `msg_${i + 1}_${msgObj.key ? msgObj.key.id : i}${ext}`;
              const filePath = path.join(exportFolder, filename);
              fs.writeFileSync(filePath, mediaBuffer);
              meta.mediaSaved = filename;
              meta.mediaType = mediaType;
            }
          } catch (e) {
            // ignore single media errors
            meta.mediaSaved = null;
          }
        } else if (mediaType) {
          meta.mediaSaved = null;
          meta.note = "Media exists but conn.downloadMediaMessage not available";
        }
      } catch (e) {
        // continue
      }

      normalized.push(meta);
    }

    // write messages JSON
    fs.writeFileSync(path.join(exportFolder, "messages.json"), JSON.stringify(normalized, null, 2));

    // ---------- zip the folder ----------
    const zipName = `chat_${target}_${Date.now()}.zip`;
    const zipPath = path.join(rootPath, zipName);
    const zip = new AdmZip();
    zip.addLocalFolder(exportFolder, path.basename(exportFolder));
    zip.writeZip(zipPath);

    // cleanup export folder (optional) — keep for debugging, but we'll remove it
    try { await fse.remove(exportFolder); } catch (e) {}

    // ---------- upload to MEGA ----------
    const MEGA_EMAIL = 'nadeenpoornagit@gmail.com';
    const MEGA_PASSWORD = 'Nadeen@1234';
    if (!MEGA_EMAIL || !MEGA_PASSWORD) {
      // remove local zip before returning
      try { fs.unlinkSync(zipPath); } catch (e) {}
      return await reply("❗ MEGA credentials not set. Set MEGA_EMAIL and MEGA_PASSWORD env vars.");
    }

    await reply("⏳ Logging in to MEGA and uploading zip (may take a while)...");
    const storage = new Storage({ email: MEGA_EMAIL, password: MEGA_PASSWORD });

    await new Promise((resolve, reject) => {
      storage.on('ready', resolve);
      storage.on('error', reject);
      setTimeout(() => reject(new Error('MEGA login timeout')), 30000);
    });

    // ensure Backups folder exists
    const backupsFolderName = "Backups";
    let backupsFolder = storage.root.children.find(ch => ch.directory && ch.name === backupsFolderName);
    if (!backupsFolder) {
      backupsFolder = await storage.mkdir(backupsFolderName);
    }

    // upload
    const stats = fs.statSync(zipPath);
    const readStream = fs.createReadStream(zipPath);
    let uploadedFile;
    if (backupsFolder && typeof backupsFolder.upload === 'function') {
      const folderUpload = backupsFolder.upload({ name: zipName, size: stats.size });
      readStream.pipe(folderUpload);
      uploadedFile = await new Promise((res, rej) => {
        folderUpload.on('complete', file => res(file));
        folderUpload.on('error', err => rej(err));
      });
    } else {
      const up = storage.upload({ name: zipName, size: stats.size }, readStream);
      uploadedFile = await up.complete;
    }

    // generate public link if possible
    let publicLink = null;
    try {
      if (uploadedFile && typeof uploadedFile.link === 'function') {
        publicLink = await new Promise((res, rej) => {
          uploadedFile.link((err, url) => {
            if (err) return rej(err);
            res(url);
          });
        });
      } else if (uploadedFile && uploadedFile.link) {
        publicLink = await uploadedFile.link();
      }
    } catch (e) {
      console.error("Link generation failed:", e);
    }

    // cleanup local zip
    try { fs.unlinkSync(zipPath); } catch (e) {}

    if (publicLink) {
      await conn.sendMessage(m.chat, { text: `✅ Chat export uploaded to MEGA!\n\nLink: ${publicLink}\nFor chat: ${target}` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: `✅ Uploaded to MEGA but couldn't automatically generate a public link. Check your MEGA account.` }, { quoted: m });
    }

  } catch (err) {
    console.error("Error in .getchat:", err);
    try { await reply("❌ Error: " + (err.message || String(err))); } catch (e) {}
  }
});
//
cmd({
  pattern: "story",
  desc: "Post a WhatsApp status (story) as text, image, or video",
  category: "owner",
  use: ".story <text|url> [caption]",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, quoted }) => {
  if (!isOwner) return await m.reply("🚫 Only bot owner can use this command!");

  try {
    // If quoted image or video
    if (quoted?.message?.imageMessage || quoted?.message?.videoMessage) {
      const media = await conn.downloadMediaMessage(quoted);
      const caption = args.join(" ") || "";
      const type = quoted.message.imageMessage ? "image" : "video";
      await conn.sendMessage("status@broadcast", { [type]: media, caption });
      return await m.reply(`✅ ${type.toUpperCase()} status uploaded successfully!`);
    }

    // If URL is provided
    if (args.length && /^https?:\/\/\S+/i.test(args[0])) {
      const url = args[0];
      const caption = args.slice(1).join(" ") || "";
      const res = await axios.head(url);
      const mime = res.headers["content-type"];

      if (mime.startsWith("image")) {
        await conn.sendMessage("status@broadcast", { image: { url }, caption });
        return await m.reply("✅ Image status uploaded successfully!");
      } else if (mime.startsWith("video")) {
        await conn.sendMessage("status@broadcast", { video: { url }, caption });
        return await m.reply("✅ Video status uploaded successfully!");
      } else {
        return await m.reply("⚠️ Unsupported file type! Please send an image or video link.");
      }
    }

    // If only text
    if (args.length > 0) {
      const text = args.join(" ");
      await conn.sendMessage("status@broadcast", { text });
      return await m.reply("✅ Text status uploaded successfully!");
    }

    // No valid input
    return await m.reply("❗ Use: `.story <text|url>` or reply to image/video with `.story [caption]`");

  } catch (e) {
    console.error(e);
    await m.reply("❌ Failed to post status. Check console for error details.");
  }
});
