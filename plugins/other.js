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
