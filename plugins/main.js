const config = require('../config')
const os = require('os')
const axios = require('axios');
const mimeTypes = require("mime-types");
const fs = require('fs');
const path = require('path');
const { generateForwardMessageContent, prepareWAMessageFromContent, generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const https = require("https")
const { URL } = require('url');
const { Octokit } = require("@octokit/core");
const file_size_url = (...args) => import('file_size_url')
    .then(({ default: file_size_url }) => file_size_url(...args));
const fkontak = {
    key: {
        remoteJid: "13135550002@s.whatsapp.net",
        participant: "0@s.whatsapp.net",
        fromMe: false,
        id: "Naze",
    },
    message: {
        contactMessage: {
            displayName: "©VISPER-MD",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;Meta AI;;;\nFN:Meta AI\nitem1.TEL;waid=94778138202:94778138202\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
            sendEphemeral: false,
        },
    },
};

cmd({
  pattern: "alive",
  react: "👾",
  alias: ["online", "test", "bot"],
  desc: "Check if bot is online.",
  category: "main",
  use: ".alive",
  filename: __filename
},
async (conn, mek, m, context) => {
  const {
    from, prefix, pushname, reply, l
  } = context;

  try {
    // Detect hosting environment
    const hostnameLength = os.hostname().length;
    let hostname = "Unknown";

    switch (hostnameLength) {
      case 12: hostname = 'Replit'; break;
      case 36: hostname = 'Heroku'; break;
      case 8:  hostname = 'Koyeb'; break;
      default: hostname = os.hostname();
    }

	   // RAM + Uptime
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;
    const rtime = await runtime(process.uptime());
const number = conn.user.id.split(':')[0].replace(/@s\.whatsapp\.net$/, '');
	  
    // Define reusable buttons
    const baseButtons = [
      { buttonId: prefix + 'menu', buttonText: { displayText: 'COMMAND MENU' }, type: 1 },
      { buttonId: prefix + 'ping', buttonText: { displayText: 'VISPER SPEED' }, type: 1 },
		{ buttonId: prefix + 'system', buttonText: { displayText: 'SYSTEM INFO.' }, type: 1 }
    ];

    const listButtons = {
      title: "Command Menu",
      sections: [
        {
          title: "Main Commands",
          rows: [
            { title: "Command Menu", description: "Show command menu", id: prefix + 'menu' },
            { title: "Bot Speed", description: "Check bot speed", id: prefix + 'ping' }
          ]
        }
      ]
    };

    // ALIVE: Default Mode
    if (config.ALIVE === "default") {
      const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

      const defaultMessage = {
        image: { url: config.LOGO },
        caption: `*Hello ${pushname} 👋❕*  
I am alive now 🎈\n✨ Thank you for choosing \`Visper-MD\` — your trusted WhatsApp Multi-Device Bot! ✨
*┌────────────────────┐*
*├ \`⏳ 𝐔𝐩𝐭𝐢𝐦𝐞\`* : ${rtime}
*├ \`🚨 𝐇𝐨𝐬𝐭\`* : ${hostname}
*├ \`🍭 𝐏𝐫𝐞𝐟𝐢𝐱\`* : ${config.PREFIX}
*├ \`👤 𝐔𝐬𝐞𝐫\`* : ${pushname}
*├ \`🗃️ 𝐑𝐚𝐦 𝐮𝐬𝐬𝐚𝐠𝐞\`* : ${ramUsage}
*├ \`⚖ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬\`* : *VISPER ᴵᴺᶜ*
*├ \`🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧\`* : 6.0.0
*└────────────────────┘*
*┌────────────────────┐*
*├ 👨‍💻ᴠɪꜱᴘᴇʀ ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ* :
  \`• Founder & Developer\` : 𝗦avithu Induwara
  \`• Co-Develper\` : 𝗗arksadas YT
  \`• Co-Developer\` : 𝗡adeen Poorna
  \`• Main-Supplier\` : 𝗣oorna Thalisha
  \`• System Leader\` : 𝗔lex-ID
  \`• API Developer\` : 𝗣athum 𝗥ajapakshe
*└────────────────────┘*
*🫟 Your all-in-one WhatsApp assistant — fast, reliable, and easy to use!* 
*🔗 Official Links:*  
• *📂 GitHub Repository:* ${details.reponame}  
• *📢 WhatsApp Channel:* ${details.chlink}   

*💛 Thank you for trusting VISPER-MD!*`,
        footer: config.FOOTER,
        buttons: baseButtons,
        headerType: 4
      };

      return await conn.buttonMessage2(from, defaultMessage);
    }

    // ALIVE: Custom Mode
    const caption = config.ALIVE;

    if (config.BUTTON === 'true') {
      return await conn.sendMessage(
        from,
        {
          image: { url: config.LOGO },
          caption,
          footer: config.FOOTER,
          buttons: [
            {
              buttonId: "video_quality_list",
              buttonText: { displayText: "🎥 Select Option" },
              type: 4,
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listButtons)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        },
        { quoted: mek }
      );
    } else {
      const customMessage = {
        image: { url: config.LOGO },
        caption,
        footer: config.FOOTER,
        buttons: baseButtons,
        headerType: 4
      };
      return await conn.buttonMessage2(from, customMessage, mek);
    }

  } catch (error) {
    reply('*An error occurred while checking bot status.*');
    l(error);
  }
});
//...


cmd({
  pattern: "systeemm",
  alias: ["status"],
  desc: "Check bot system status.",
  category: "main",
  use: '.system',
  filename: __filename
},
async (conn, mek, m, { reply, from }) => {
  try {
    // 1. Start calculating time (Ping start)
    const initial = new Date().getTime();
    
    const os = require('os');

    // --- Platform Detection ---
    let hostname;
    const hnLength = os.hostname().length;
    if (hnLength === 12) hostname = 'Replit';
    else if (hnLength === 36) hostname = 'Heroku';
    else if (hnLength === 8) hostname = 'Koyeb';
    else hostname = os.hostname();

    // --- Memory Usage & Progress Bar ---
    const usedVal = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalVal = os.totalmem() / 1024 / 1024;
    
    const ramUsedMB = usedVal.toFixed(2);
    const ramTotalMB = Math.round(totalVal);
    
    // Percentage
    const percentage = Math.round((usedVal / totalVal) * 100);
    
    // Progress Bar Generation (Using Unicode codes to prevent syntax errors)
    // \u2588 = Solid Block (█), \u2591 = Light Shade (░)
    const barLength = 10;
    const filledLength = Math.round((percentage / 100) * barLength);
    const emptyLength = barLength - filledLength;
    
    // Safe method to create bar
    const filledBar = '\u2588'.repeat(filledLength);
    const emptyBar = '\u2591'.repeat(emptyLength);
    const progressBar = `${filledBar}${emptyBar}`;

    // --- Runtime ---
    // Make sure 'runtime' function is available in your bot utils
    const rtime = await runtime(process.uptime());

    // 2. Calculate Ping (End time - Start time)
    const final = new Date().getTime();
    const ping = final - initial;

    // --- Premium Message Design ---
    const sysInfo = `
╭━━━❮ 📡 𝗩𝗜𝗦𝗣𝗘𝗥 𝗦𝗧𝗔𝗧𝗨𝗦 ❯━━━╮
┃
┃ ⚡ *ᴜᴘᴛɪᴍᴇ* : ${rtime}
┃ 🚀 *ᴘɪɴɢ* : ${ping}ms
┃ 🧬 *ᴠᴇʀsɪᴏɴ* : 6.0.0
┃ ⚙️ *ʜᴏsᴛ* : ${hostname}
┃
┃ 💾 *ᴍᴇᴍᴏʀʏ (ʀᴀᴍ)*
┃ ┣ ❲${progressBar}❳ *${percentage}%*
┃ ┗ ${ramUsedMB}MB / ${ramTotalMB}MB
┃
╰━━━━━━━━━━━━━━━━━━╯
> 👨‍💻 ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴠɪsᴘᴇʀ ɪɴᴄ
`;

    // Send the message
    await conn.sendMessage(m.chat, { text: sysInfo.trim() }, { quoted: fkontak || m });
    m.react('🌙');
    
  } catch (e) {
    await reply('*❌ Error fetching system info!*');
    console.error(e);
  }
});


cmd({
    pattern: "getpp",
    react: "📸",
    category: "owner",
    use: '.getpp <9471######>',
    filename: __filename
}, async (conn, mek, m, context) => {
    const { from, args } = context;

    try {
        if (!args[0]) 
            return await conn.sendMessage(from, { text: '❌ *Please provide a WhatsApp number!*\nExample: `getpp 9477xxxxxxx`' }, { quoted: m });

        // Format number with WhatsApp JID
        let jid = args[0].includes('@') ? args[0] : `${args[0]}@s.whatsapp.net`;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(jid, 'image'); // 'image' for full DP
        } catch {
            return await conn.sendMessage(from, { text: '⚠️ *Could not fetch profile picture.*\nUser may not have a DP.' }, { quoted: m });
        }

        // Download image
        const res = await fetch(ppUrl);
        const buffer = Buffer.from(await res.arrayBuffer());

        // Save temp file
        const tempPath = path.join(__dirname, `${jid.replace('@','_')}_dp.jpg`);
        fs.writeFileSync(tempPath, buffer);

        // Send DP with professional caption
        const caption = `✨ *WhatsApp Profile Picture* ✨\n\n📱 *Number:* ${args[0]}\n🖼️ *Fetched successfully!*\n\n${config.FOOTER}`;
        await conn.sendMessage(from, { image: fs.readFileSync(tempPath), caption }, { quoted: m });

        // Delete temp file
        fs.unlinkSync(tempPath);

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '❌ *Failed to fetch profile picture.*' }, { quoted: m });
    }
});

const Jimp = require('jimp')

cmd({
    pattern: "fullpp",
    react: "⚡",
    category: "owner",
    use: '.fullpp <mention your photo>',
    filename: __filename
}, async (conn, mek, m, context) => {
    const { from } = context;

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image')) {
            return await conn.sendMessage(from, { text: '❌ Reply to an image with *fullpp*' }, { quoted: m });
        }

        // Download image buffer
        let imgBuffer = await q.download();

        // Read image with Jimp
        let image = await Jimp.read(imgBuffer);

        // Resize & crop to WhatsApp size (640x640)
        image.cover(640, 640);

        // Save to buffer
        let finalBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Update bot profile picture
        await conn.updateProfilePicture(conn.user.id, finalBuffer);

        await conn.sendMessage(from, { text: '✅ Bot profile picture updated successfully!' }, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '❌ Failed to update bot profile picture.' }, { quoted: m });
    }
});



cmd({
  pattern: "ping",
  alias: ["speed"],
  desc: "Check bot's response speed.",
  category: "main",
  use: ".ping",
  filename: __filename
},
async (conn, mek, m, context) => {
  const { from, reply, l } = context;

  try {
    const start = Date.now();

    // Send initial "please wait" message
    const sent = await conn.sendMessage(from, {
      text: `🔄 *Pinging... please wait*`
    }, { quoted: fkontak });

    const latency = Date.now() - start;

    // Edit same message with latency info
    await conn.sendMessage(from, {
      text: `*Pong ${latency} ms ⚡*`,
      edit: sent.key
    });

    // React to user's message
    await conn.sendMessage(from, {
      react: {
        text: '📍',
        key: mek.key
      }
    });

  } catch (error) {
    await reply('❌ *An error occurred while measuring ping.*');
    l(error);
  }
});




cmd({
  pattern: "menu",
  react: "📁",
  alias: ["panel", "list", "commands"],
  desc: "Get bot's command list.",
  category: "main",
  use: '.menu',
  filename: __filename
}, 
async (conn, mek, m, { from, pushname, prefix,  reply, l }) => {
  try {
    // Hosting platform detection
    let hostname;
    const hostLen = os.hostname().length;
    if (hostLen === 12) hostname = 'Replit';
    else if (hostLen === 36) hostname = 'Heroku';
    else if (hostLen === 8) hostname = 'Koyeb';
    else hostname = os.hostname();

    // RAM + Uptime
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;
    const rtime = await runtime(process.uptime());
const number = conn.user.id.split(':')[0].replace(/@s\.whatsapp\.net$/, '');
    const caption =  `*Hello ${pushname}  👋*
I am *VISPER-MD* Userbot🎈
*┌────────────────────┐*
*├ \`⏰ 𝐔𝐩𝐭𝐢𝐦𝐞\`* : ${rtime}
*├ \`🚨 𝐇𝐨𝐬𝐭\`* : ${hostname}
*├ \`🎡 𝐏𝐫𝐞𝐟𝐢𝐱\`* : ${config.PREFIX}
*├ \`👤 𝐔𝐬𝐞𝐫\`* : ${pushname}
*├ \`⛵ 𝐑𝐚𝐦 𝐮𝐬𝐬𝐚𝐠𝐞\`* : ${ramUsage}
*├ \`👨🏻‍💻 𝐎𝐰𝐧𝐞𝐫\`* : ${number}
*├ \`⚖ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬\`* : *VISPER ᴵᴺᶜ*
*├ \`🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧\`* : 6.0.0
*├ \`💼 𝐖𝐨𝐫𝐤 𝐓𝐲𝐩𝐞\`* : ${config.WORK_TYPE}
*└────────────────────┘*

*🫟 Your all-in-one WhatsApp assistant — fast, reliable, and easy to use!*`;

 const captionn =  `*Hello ${pushname}  👋*
I am *VISPER-MD* Userbot🎈
*┌────────────────────┐*
*├ \`⏰ 𝐔𝐩𝐭𝐢𝐦𝐞\`* : ${rtime}
*├ \`🚨 𝐇𝐨𝐬𝐭\`* : ${hostname}
*├ \`🎡 𝐏𝐫𝐞𝐟𝐢𝐱\`* : ${config.PREFIX}
*├ \`👤 𝐔𝐬𝐞𝐫\`* : ${pushname}
*├ \`⛵ 𝐑𝐚𝐦 𝐮𝐬𝐬𝐚𝐠𝐞\`* : ${ramUsage}
*├ \`👨🏻‍💻 𝐎𝐰𝐧𝐞𝐫\`* : ${number}
*├ \`⚖ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬\`* : *VISPER ᴵᴺᶜ*
*├ \`🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧\`* : 4.0.0
*├ \`💼 𝐖𝐨𝐫𝐤 𝐓𝐲𝐩𝐞\`* : ${config.WORK_TYPE}
*└────────────────────┘*

*🫟 Your all-in-one WhatsApp assistant — fast, reliable, and easy to use!*`

	  

    // 🔐 Load image from URL as Buffer (safe)
    let imageBuffer;
    try {
      if (!config.LOGO || !config.LOGO.startsWith('http')) {
        throw new Error("Invalid config.LOGO URL");
      }
      const res = await axios.get(config.LOGO, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(res.data, 'binary');
      if (!Buffer.isBuffer(imageBuffer)) throw new Error("Not a valid buffer");
    } catch (err) {
      console.error("❌ Failed to load image:", err.message);
      return reply("⚠️ Could not load menu image. Check your LOGO URL.");
    }

    const buttons = [
      { buttonId: prefix + 'mainmenu', buttonText: { displayText: 'MAIN COMMANDS' }, type: 1 },
	{ buttonId: prefix + 'ownermenu', buttonText: { displayText: 'OWNER COMMANDS' }, type: 1 },
      { buttonId: prefix + 'groupmenu', buttonText: { displayText: 'GROUP COMMANDS' }, type: 1 },
      { buttonId: prefix + 'moviemenu', buttonText: { displayText: 'MOVIE COMMANDS' }, type: 1 },
      { buttonId: prefix + 'downloadmenu', buttonText: { displayText: 'DOWNLOAD COMMANDS' }, type: 1 },
      { buttonId: prefix + 'convertmenu', buttonText: { displayText: 'CONVERT COMMANDS' }, type: 1 },
		{ buttonId: prefix + 'searchmenu', buttonText: { displayText: 'SEARCH COMMANDS' }, type: 1 },
		{ buttonId: prefix + 'logomenu', buttonText: { displayText: 'LOGO COMMANDS' }, type: 1 },
      { buttonId: prefix + 'aicommands', buttonText: { displayText: 'AI COMMANDS' }, type: 1 },
		{ buttonId: prefix + 'othermenu', buttonText: { displayText: 'OTHER COMMANDS' }, type: 1 }
    ];

    const buttonMessage = {
      image: imageBuffer, // ✅ CORRECT format
      caption: captionn,
      footer: config.FOOTER,
      buttons,
      headerType: 4
    };

    if (config.BUTTON === 'true') {
      const listData = {
        title: "Select Menu :)",
        sections: [
          {
            title: "VISPER-MD",
            rows: [
              { title: "MAIN COMMANDS", "description":"Main command menu", id: `${prefix}mainmenu` },
				{ title: "OWNER COMMANDS", "description":"Group command menu", id: `${prefix}ownermenu` },
              { title: "GROUP COMMANDS", "description":"Group command menu", id: `${prefix}groupmenu` },
             { title: "MOVIE COMMANDS", "description":"Movie command menu", id: `${prefix}moviemenu` },
              { title: "DOWNLOAD COMMANDS", "description":"Download command menu", id: `${prefix}downloadmenu` },
		{ title: "CONVERT COMMANDS", "description":"Convert command menu", id: `${prefix}convertmenu` },
				{ title: "SEARCH COMMANDS", "description":"Search command menu", id: `${prefix}searchmenu` },
				{ title: "LOGO COMMANDS", "description":"Logo command menu", id: `${prefix}logomenu` },
		    { title: "AI COMMANDS", "description":"AI command menu", id: `${prefix}aimenu` },
				{ title: "OTHER COMMANDS", "description":"Other command menu", id: `${prefix}OTHERmenu` }
            ]
          }
        ]
      };

      return await conn.sendMessage(from, {
        image: imageBuffer, // ✅ Again, direct Buffer
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "action",
            buttonText: { displayText: "🔽 Select Option" },
            type: 4,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify(listData)
            }
          }

		
        ],
        headerType: 1,
        viewOnce: true
      }, { quoted: fkontak });

    } else {
      await conn.buttonMessage(from, buttonMessage, mek);
    }

  } catch (e) {
    reply('*❌ Error occurred!*');
    l(e);
  }
});
cmd({
    pattern: "joinsupport",
    desc: "Join support group",
	react: "👨🏻‍💻",
    category: "main",
    use: '.joinsupport',
},
async (conn, mek, m, {
    from, reply, isOwner, isSachintha, isSavi, isDev, isMani, isMe
}) => {
    
    if (!isOwner && !isSachintha && !isSavi && !isDev && !isMani && !isMe) return;

    try {

	    const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;
        let inviteCode = `${details.supglink}`;
         
    let result = inviteCode.split(" ")[0].split("https://chat.whatsapp.com/")[1];

        // If not in group, join
        await conn.groupAcceptInvite(result)
            .then(() => reply("✅ Successfully joined the support group!"))
            .catch(() => reply("❌ Could not join the group."));

    } catch (e) {
        console.log(e);
        reply("🚩 Error occurred while trying to join the group.");
    }
});


cmd({
  pattern: "restart",
  react: "🔄",
  desc: "Restart the bot process",
  use: ".restart",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { reply, isOwner, isSachintha, isSavi, isSadas, isMani, isMe }) => {
  if (!isOwner && !isSachintha && !isSavi && !isSadas && !isMani && !isMe) return;

  try {
    const { exec } = require("child_process");

    // Inform user about restart
    await reply(`♻️ *Bot is restarting...*  
🕐 *Please wait a few seconds for services to resume.*`);

    // Delay to allow the message to be seen
    setTimeout(() => {
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          reply("❌ *An error occurred while restarting the bot.*");
        }
      });
    }, 3000); // 3-second delay before actual restart

  } catch (e) {
    console.error(e);
    reply("🚨 *Unexpected error occurred during restart.*");
  }
});


cmd({
  pattern: "update",
  react: "ℹ️",
  desc: "Update your bot to the latest version",
  use: ".update",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { reply, isOwner, isSachintha, isSavi, isSadas, isMani, isMe }) => {
  if (!isOwner && !isSachintha && !isSavi && !isSadas && !isMani && !isMe) return;

  try {
    const { exec } = require("child_process");

    // Let the user know an update has started
    await reply(`🔄 *Bot Update in Progress...*  
📦 *Fetching latest code & restarting services...*`);

    // Wait before executing to ensure user sees message
    setTimeout(() => {
      exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          reply('❌ *Update failed during restart!*');
        }
      });
    }, 3000); // 3-second delay before restart

  } catch (e) {
    console.error(e);
    reply('🚨 *An unexpected error occurred during update.*');
  }
});




cmd({
  pattern: "convertmenu",
  react: "🗃️",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'convert'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🏮 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})

cmd({
  pattern: "aimenu",
  react: "🤖",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'ai'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│👾 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.CONVERTMENU },
  caption: `${menuc}`,
  footer: config.LOGO,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})

cmd({
  pattern: "logomenu",
  react: "🎨",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'logo'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🎨 Command:* ${commands[i].pattern}\n*│Desc:* ${commands[i].desc}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
cmd({
  pattern: "ownermenu",
  react: "👨‍💻",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'owner'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│💎 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
















cmd({
  pattern: "othermenu",
  react: "⚒",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'other'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🛠 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
cmd({
  pattern: "searchmenu",
  react: "🔍",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'search'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🧶 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})
cmd({
  pattern: "downloadmenu",
  react: "🗃️",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'download'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🍁 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})

cmd({
  pattern: "moviemenu",
  react: "🍟",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'movie'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🎞 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})

cmd({
    pattern: "owner",
    desc: "I'm the owner",
    react: "👩‍💻",
    use: '.owner',
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        let vcard1 = 'BEGIN:VCARD\n' 
                   + 'VERSION:3.0\n' 
                   + 'FN: Themi Sadas\n' 
                   + 'ORG: Web Developer;\n' 
                   + 'TEL;type=CELL;type=VOICE;waid=94724375368:+94724375368\n' 
                   + 'END:VCARD';

        let vcard2 = 'BEGIN:VCARD\n' 
                   + 'VERSION:3.0\n' 
                   + 'FN: Savithu Iduwara\n' 
                   + 'ORG: Web Developer;\n' 
                   + 'TEL;type=CELL;type=VOICE;waid=94722617699:+94722617699\n' 
                   + 'END:VCARD';
		let vcard3 = 'BEGIN:VCARD\n' 
                   + 'VERSION:3.0\n' 
                   + 'FN: Nadeen Poorna\n' 
                   + 'ORG: Co-Developer;\n' 
                   + 'TEL;type=CELL;type=VOICE;waid=94711451319:+9471451319\n' 
                   + 'END:VCARD';

		let vcard4 = 'BEGIN:VCARD\n' 
                   + 'VERSION:3.0\n' 
                   + 'FN: Pathum Rajapakshe\n' 
                   + 'ORG: API-Developer;\n' 
                   + 'TEL;type=CELL;type=VOICE;waid=94766863255:+94766863255\n' 
                   + 'END:VCARD';

  let vcard5 = 'BEGIN:VCARD\n' 
                   + 'VERSION:3.0\n' 
                   + 'FN: Poorna Thalisha\n' 
                   + 'ORG: Code Helper&Supplier;\n' 
                   + 'TEL;type=CELL;type=VOICE;waid=94719255382:+94724972306\n' 
                   + 'END:VCARD';

        await conn.sendMessage(from, { 
            contacts: { 
                displayName: 'Bot Owners', 
                contacts: [
                    { vcard: vcard1 },
					{ vcard: vcard3 },
                    { vcard: vcard2 },
					{ vcard: vcard4 },
                    { vcard: vcard5 }
                ]
            } 
        }, { quoted: fkontak });

    } catch (e) {
        console.error(e);
        reply(`Error: ${e}`);
    }
});






cmd({
  pattern: "mainmenu",
  react: "🍟",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'main'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🏮 Command:* ${commands[i].pattern}\n*│Use:* ${commands[i].use}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'GET BOT SCRIPT'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'GET BOT PING'
    },
    type: 1
  }]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})





















cmd({
  pattern: "groupmenu",
  react: "🍟",
  dontAddCommandList: true,
  filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let pp =''  
	
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'group'){
  if(!commands[i].dontAddCommandList){
pp +=  `*│🎩 Command:* ${commands[i].pattern}\n*│Description:* ${commands[i].desc}\n\n`
}}};

let menuc = `*╭──────────●●►*\n${pp}*╰──────────●●►*\n\n`
let generatebutton = [{
    buttonId: `${prefix}sc`,
    buttonText: {
        displayText: 'Get Bot Script'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'Check Ping'
    },
    type: 1
  },{
    buttonId: `${prefix}ping`,
    buttonText: {
        displayText: 'System Infomations'
    },
    type: 1
  }
					 ]
let buttonMessaged = {
  image: { url: config.LOGO },
  caption: `${menuc}`,
  footer: config.FOOTER,
  headerType: 4,
  buttons: generatebutton
};
return await conn.buttonMessage(from, buttonMessaged, mek);
} catch (e) {
reply('*ERROR !!*')
l(e)
}
})







cmd({
    pattern: "system",
    alias: ["status"],
    desc: "Check bot system status.",
    category: "main",
    use: '.system',
    filename: __filename
},
async (conn, mek, m, { reply, from }) => {
    try {
        const os = require('os');

        // Hosting platform detection
        let hostname;
        const hnLength = os.hostname().length;
        if (hnLength === 12) hostname = 'Replit';
        else if (hnLength === 36) hostname = 'Heroku';
        else if (hnLength === 8) hostname = 'Koyeb';
        else hostname = os.hostname();

        // Memory usage calculation
        const ramUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotalGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
        const ram = `${ramUsedMB} MB / ${ramTotalGB} GB`;

        // Runtime calculation (If you don't have a helper function)
        function formatRuntime(seconds) {
            seconds = Number(seconds);
            var d = Math.floor(seconds / (3600 * 24));
            var h = Math.floor(seconds % (3600 * 24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);
            return `${d > 0 ? d + " days, " : ""}${h} hours, ${m} minutes, ${s} seconds`;
        }

        const rtime = formatRuntime(process.uptime());

        // The Stylish message you requested
        const sysInfo = `*📡 VISPER SYSTEM STATUS 📡*

⏰ *Uptime :* ${rtime}
📊 *Ram usage :* ${ram}
☁️ *Platform :* ${hostname}
🧬 *Version :* v6.0.0 ( Beta )
👨‍💻 *Developer :* VISPER INC
🟢 *Status :* Active`;

        // React with Moon emoji
        await m.react('🌙');

        // Sending the message
        await conn.sendMessage(from, { 
            text: sysInfo 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await reply('*❌ Error fetching system info!*');
    }
});


cmd({
    pattern: "forward",
    react: "⏩",
alias: ["f"],
     desc: "forwerd film and msg",
    use: ".f jid",
    category: "owner",
    filename: __filename
},
async(conn, mek, m,{from, l, prefix, quoted, body, isCmd, isSudo, isOwner, isMe, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isIsuru, isTharu,  isSupporters, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

if ( !isMe && !isOwner && !isSudo ) return await reply('*📛OWNER COMMAND*')
if (!q || !m.quoted) {
return reply("*Please give me a Jid and Quote a Message to continue.*");
}
  // Split and trim JIDs
  let jidList = q.split(',').map(jid => jid.trim());
  if (jidList.length === 0) {
    return reply("*Provide at least one Valid Jid. ⁉️*");
  }
  // Prepare the message to forward
  let Opts = {
    key: mek.quoted?.["fakeObj"]?.["key"]
  };
  // Handle document message
  if (mek.quoted.documentWithCaptionMessage?.message?.documentMessage) {
    let docMessage = mek.quoted.documentWithCaptionMessage.message.documentMessage;
    const mimeTypes = require("mime-types");
    let ext = mimeTypes.extension(docMessage.mimetype) || "file";
    docMessage.fileName = docMessage.fileName || `file.${ext}`;
  }

  Opts.message = mek.quoted;
  let successfulJIDs = [];
  // Forward the message to each JID
  for (let i of jidList) {
try {
await conn.forwardMessage(i, Opts, false);
successfulJIDs.push(i);
} catch (error) {
console.log(e);
}
}
  // Response based on successful forwards
if (successfulJIDs.length > 0) {
return reply(`*Message Forwarded*\n\n` + successfulJIDs.join("\n"))
} else {
console.log(e)
}
});


cmd({
  pattern: "rename",
  alias: ["r"],
  desc: "Forward media/messages with optional rename and caption",
  use: ".r jid1,jid2 | filename (without ext) | new caption (quote a message)",
  category: "main",
  filename: __filename
},
async (conn, mek, m, {
  reply, isSudo, isOwner, isMe, q
}) => {
if ( !isMe && !isOwner && !isSudo ) return await reply('*📛OWNER COMMAND*')
  if (!q || !m.quoted) {
    return reply("*Please provide JIDs and quote a message to forward.*");
  }

  const mime = require("mime-types");

  // Split into jid list, optional filename, and optional caption
  const parts = q.split('|').map(part => part.trim());
  const jidPart = parts[0];
  const newFileName = parts[1]; // only name without extension
  const newCaption = parts[2];  // optional

  const jidList = jidPart.split(',').map(j => j.trim()).filter(j => j);
  if (jidList.length === 0) {
    return reply("*Provide at least one valid JID.*");
  }

  const quotedMsg = mek.quoted;
  let messageContent = quotedMsg?.message || quotedMsg;

  const opts = {
    key: quotedMsg?.fakeObj?.key,
    message: JSON.parse(JSON.stringify(messageContent)) // clone safely
  };

  // If it's a document, rename the file
  if (opts.message?.documentMessage) {
    const docMsg = opts.message.documentMessage;
    const ext = mime.extension(docMsg.mimetype) || "file"; // get correct extension
    if (newFileName) {
      docMsg.fileName = `${newFileName}.${ext}`; // filename + original mimetype ext
    } else {
      docMsg.fileName = `Forwarded_File_${Date.now()}.${ext}`; // default if no name given
    }
  }

  // If it's a media with caption, replace caption
  if (newCaption) {
    const typesWithCaption = ["imageMessage", "videoMessage", "documentMessage", "audioMessage"];
    for (const type of typesWithCaption) {
      if (opts.message[type]) {
        opts.message[type].caption = newCaption;
      }
    }
  }

  const successful = [];

  for (let jid of jidList) {
    try {
      await conn.forwardMessage(jid, opts, false);
      successful.push(jid);
    } catch (err) {
      console.log(`❌ Failed to forward to ${jid}:`, err);
    }
  }

  if (successful.length > 0) {
    return reply(`✅ *Message forwarded to:*\n${successful.join("\n")}`);
  } else {
    return reply("❌ *Failed to forward message to any JID.*");
  }
});


async function checkFileSize(url, maxMB = 150) {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;
    https.get(url, res => {
      res.on('data', chunk => {
        totalBytes += chunk.length;
        const sizeMB = totalBytes / (1024 * 1024);
        if (sizeMB > maxMB) {
          res.destroy(); // abort download
          reject(new Error(`File exceeds ${maxMB} MB!`));
        }
      });
      res.on('end', () => resolve(totalBytes));
      res.on('error', err => reject(err));
    });
  });
}

cmd({
  pattern: "download",
  react: "🍟",
  alias: ["fetch"],
  desc: "Direct downloader from a link",
  category: "movie",
  use: '.directdl <Direct Link>',
  dontAddCommandList: false,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) 
      return reply('❗ Please provide a direct download link.');

    const url = q.trim();
    const urlRegex = /^(https?:\/\/[^\s]+)/;

    if (!urlRegex.test(url)) {
      return reply('❗ The provided URL is invalid. Please check the link and try again.');
    }



    // React with download emoji
    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    let mime = 'video/mp4'; // default to mp4
    let fileName = 'downloaded_video.mp4';

    try {
      const response = await axios.head(url);

      const detectedMime = response.headers['content-type'];
      if (detectedMime) mime = detectedMime;

      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        const fileMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileMatch && fileMatch[1]) {
          fileName = fileMatch[1].replace(/['"]/g, '');
        }
      } else {
        const parsedPath = new URL(url).pathname;
        const baseName = path.basename(parsedPath);
        if (baseName) fileName = baseName;
      }
    } catch (err) {
      // HEAD request failed — fallback
      const parsedPath = new URL(url).pathname;
      const baseName = path.basename(parsedPath);
      if (baseName) fileName = baseName;
    }

    // Send the document
    await conn.sendMessage(from, {
      document: { url },
      caption: config.FOOTER,
      mimetype: mime,
      fileName
    });

    // Confirm success with reaction
    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (e) {
    console.log(e);
    reply(`❗ Error occurred: ${e.message}`);
  }
});




cmd({
    pattern: "id",
    react: "⚜",
    alias: ["getdeviceid"],
    desc: "Get message id",
    category: "main",
    use: '.id',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, isSudo, body, isCmd, msr, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
if ( !isMe && !isOwner && !isSudo ) return await reply('*📛OWNER COMMAND*')
    
if ( !m.quoted ) return reply('*Please reply a Message... ℹ️*')
reply(m.quoted.id)
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
})
cmd({
    pattern: "follow",
    react: "ℹ️",
    alias: ["fl"],
    desc: "Follow chanals",
    category: "main",
    use: ".follow",
    filename: __filename
}, async (conn, mek, m, {
    from, l, quoted, isSudo, body, isCmd, msr, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, groupMetadata, groupName, participants, groupAdmins,
    isBotAdmins, isCreator, isDev,isOwner, isAdmins, reply
}) => {
    try {
        if (!isMe && !isOwner && !isSudo) {
            return await reply('*📛 OWNER COMMAND*');
        }

        if (!q) {
            return await reply('❗ Please provide a newsletter ID to follow.');
        }

        await conn.newsletterFollow(q);
        reply(`*✅ Successfully followed newsletter:* *${q}*`);
        
    } catch (e) {
        console.error(e);
        reply(`❌ *Error occurred!*\n\n${e.message || e}`);
    }
});
cmd({
    pattern: "acinvite",
    react: "📡",
    alias: ["fl", "ac"],
    desc: "Follow a channel or accept invite",
    category: "owner",
    use: ".acinvite <channel-id or invite-link>",
    filename: __filename
}, async (conn, mek, m, {
    isMe, isOwner, isSudo, reply, q
}) => {
    try {
        if (!isMe && !isOwner && !isSudo) {
            return await reply('*📛 OWNER COMMAND ONLY*');
        }

        if (!q) {
            return await reply('🔗 *Please provide a channel ID or invite link*');
        }

        // Try to accept invite if it's an invite link
        if (q.startsWith('https://whatsapp.com/channel/')) {
            await conn.acceptInvite(q.split('/').pop());
            return await reply(`✅ *Successfully accepted channel invitation*`);
        }



    } catch (e) {
        console.error(e);
        return reply(`❌ *Error occurred!*\n\n${e.message || e}`);
    }
});


async function fetchCodeWithRetry(q, retries = 1) {
    try {
        let Zip = await axios.get(`https://visper-md-offical.vercel.app/codes?num=${q}`);
        if (!Zip.data || !Zip.data.code) throw new Error("Invalid response");
        return Zip.data.code;
    } catch (e) {
        if (retries > 0) {
            console.log(`Retrying... attempts left: ${retries}`);
            return fetchCodeWithRetry(q, retries - 1);
        } else {
            throw e;
        }
    }
}

cmd({
    pattern: "requestpair",
    alias: ["pair"],
    desc: "requestpair 94....",
    category: "main",
    use: '.requestpair 94....',
    filename: __filename
},
async (conn, mek, m, { reply, isGroup, q, from }) => {
    try {
	    if (isGroup) {return reply('🚫 *This command not allowed for groups*')}
        const code = await fetchCodeWithRetry(q, 1);  // 1 retry allowed
        await conn.sendMessage(m.chat, { text: code }, { quoted: mek });
        m.react('🔢');
        setTimeout(async () => {
            await conn.sendMessage(m.chat, { text: "*Your code is expired ⌛*" }, { quoted: mek });
        }, 30000);
    } catch (e) {
        console.log("Final error after retry:", e);
        await reply('*Error !!*');
    }
});


const fg = require('api-dulux'); 

cmd({
    pattern: "uploadfile",
    alias: ["up"],
    desc: "Direct or GDrive link to Pixeldrain",
    category: "main",
    use: '.upload filename , link',
    filename: __filename
},
async (conn, mek, m, { reply, q, from }) => {
    try {
        if (!q || !q.includes(',')) return await reply("⚠️ Usage: .upload filename , link");

        let parts = q.split(',');
        let userFileName = parts[0].trim(); // User dena name eka
        let inputUrl = parts[1].trim();
        let finalDirectLink = inputUrl;
        let finalFileName = userFileName; // Default name eka widiyata user deepu eka gannawa

        // 1. Google Drive Check
        const isGDrive = inputUrl.includes('drive.google.com') || inputUrl.includes('drive.usercontent.google.com');

        if (isGDrive) {
            await reply("*🔍 GDrive detected. Extracting details...*");
            try {
                let driveUrl = inputUrl
                    .replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/')
                    .replace('&export=download', '/view');

                let res = await fg.GDriveDl(driveUrl);
                
                if (res && res.downloadUrl) {
                    finalDirectLink = res.downloadUrl;
                    // API eken real fileName ekak awilla thiyeda balala eka gannawa
                    if (res.fileName) {
                        finalFileName = res.fileName;
                    }
                } else {
                    return await reply("❌ Could not extract Direct Link from Google Drive.");
                }
            } catch (driveErr) {
                return await reply("❌ GDrive Error: " + driveErr.message);
            }
        }

        // 2. Upload Process
        await reply(`*📤 Uploading:* ${finalFileName}\n*Status:* Processing...`);

        const uploadRes = await axios.post('https://mega-uploder-sadaslk-393123781d0e.herokuapp.com/upload', {
            fileName: finalFileName,
            fileUrl: finalDirectLink
        });

        const jobId = uploadRes.data.jobId || uploadRes.data.id;
        if (!jobId) return await reply("❌ Failed to start upload.");

        let attempts = 0;
        const maxAttempts = 10;

        // 3. Status Polling
        const checkStatus = setInterval(async () => {
            try {
                attempts++;
                const statusRes = await axios.get(`https://mega-uploder-sadaslk-393123781d0e.herokuapp.com/status/${jobId}`);
                const data = statusRes.data;

                if (data.status === "completed") {
                    clearInterval(checkStatus);
                    return await reply(`*✅ Upload Successful!*\n\n*File:* ${finalFileName}\n*Link:* ${data.link}`);
                } 
                
                if (data.status === "failed") {
                    clearInterval(checkStatus);
                    return await reply("❌ Server reported a failure.");
                }

                if (attempts >= maxAttempts) {
                    clearInterval(checkStatus);
                    return await reply(`*⚠️ Timeout:* Tried 10 times. Job ID: ${jobId}`);
                }

            } catch (err) {
                console.log("Polling error:", err.message);
            }
        }, 5000);

    } catch (e) {
        console.log("Final error:", e);
        await reply('*❌ Error occurred!*');
    }
});
cmd({
    pattern: "channelreact",
    alias: ["chr"],
    react: "📕",
    use: ".channelreact *<link>,<emoji>*",
    desc: "React to a message in a WhatsApp Channel.",
    category: "main",
    filename: __filename,
},
async (conn, mek, m, { q, isSudo, isOwner, isMe, reply }) => {
    try {
if ( !isMe && !isOwner && !isSudo ) return await reply('*📛OWNER COMMAND*')
	    
        if (!q || typeof q !== 'string' || !q.includes(',')) {
            return reply('❌ Invalid format. Use: .channelreact <link>,<emoji>');
        }

        let [link, react] = q.split(',');
        if (!link || !react) return reply('❌ Missing link or emoji.');
        if (!link.startsWith('https://whatsapp.com/channel/')) {
            return reply('❌ Invalid channel link.');
        }

        const parts = link.split('/');
        const channelId = parts[4];
        const messageId = parts[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, react.trim());

        reply(`*✅ Reacted with ${react.trim()} to the message.*`);
    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e.message);
    }
});


const mime = require("mime-types");

cmd({
    pattern: "send",
    alias: ["forward2"],
    desc: "send msgs",
    category: "owner",
    use: '.send < Jid address >',
    filename: __filename
},

async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try{ 
if ( !isMe && !isOwner && !isSudo ) return await reply('*📛OWNER COMMAND*')
if (!q || !m.quoted) {
return reply("*Please give me a Jid and Quote a Message to continue.*");
}

	
if (!q || !m.quoted) {
return await reply(`❌ *Please give me a jid and quote a message you want*\n\n*Use the ${envData.PREFIX}jid command to get the Jid*`)
}  

  let jidList = q.split(',').map(jid => jid.trim());

	

if(m.quoted && m.quoted.type === "stickerMessage"){
let image = await m.quoted.download()
            let sticker = new Sticker(image, {
                pack: "⦁ SAVIYA-MD ⦁",
                author: "⦁ SAVIYA-X-MD ⦁",
                type: StickerTypes.FULL, //q.includes("--default" || '-d') ? StickerTypes.DEFAULT : q.includes("--crop" || '-cr') ? StickerTypes.CROPPED : q.includes("--circle" || '-ci') ? StickerTypes.CIRCLE : q.includes("--round" || '-r') ? StickerTypes.ROUNDED : StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: "12345",
                quality: 75,
                background: "transparent",
            });
            const buffer = await sticker.toBuffer();

const successful = [];

  for (let jid of jidList) {
    try {
        conn.sendMessage(jid, { sticker: buffer });
      successful.push(jid);
    } catch (err) {
      console.log(`❌ Failed to forward to ${jid}:`, err);
    }
  }
  

let ss = '`'
reply(`*This ${m.quoted.type} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")  

}else if(m.quoted && m.quoted.type === "imageMessage"){
if(m.quoted.imageMessage && m.quoted.imageMessage.caption){
const cap = m.quoted.imageMessage.caption
let image = await m.quoted.download()
const successfull = [];

  for (let jid of jidList) {
    try {
        conn.sendMessage(jid, { image: image, caption: cap });
      successfull.push(jid);
    } catch (err) {
      console.log(`❌ Failed to forward to ${jid}:`, err);
    }
  }
  

   
let ss = '`'
reply(`*This ${ss}${m.quoted.type} has been successfully sent to the jid address   ✅`)
m.react("✔️")
	
}else{
let image = await m.quoted.download()
const successfulll = [];

  for (let jid of jidList) {
    try {
         conn.sendMessage(jid, { image: image });
      successfulll.push(jid);
    } catch (err) {
      console.log(`❌ Failed to forward to ${jid}:`, err);
    }
  }
  
 
let ss = '`'
reply(`*This ${ss}${m.quoted.type} has been successfully sent to the jid address   ✅`)
m.react("✔️")  
}	
	
}else if(m.quoted && m.quoted.type === "videoMessage"){
let fileLengthInBytes = m.quoted.videoMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Video files larger than 50 MB cannot be send.*")
}else{
let video = await m.quoted.download()
const jid = q || from

if(m.quoted.videoMessage.caption){
 
 conn.sendMessage(jid, { video: video, mimetype: 'video/mp4',caption: m.quoted.videoMessage.caption});
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
 
 }else{

  const jid = q || from
 conn.sendMessage(jid, { video: video, mimetype: 'video/mp4'});
  let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}

}	

}else if(m.quoted && m.quoted.type === "documentMessage" || m.quoted.type === "documentWithCaptionMessage"){	

const jid = q || from
if(m && m.quoted && m.quoted.documentMessage){
let fileLengthInBytes = m.quoted.documentMessage.fileLength	
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);

if(fileLengthInMB >= 50 ){
reply("*❌ Document files larger than 50 MB cannot be send.*")
}else{
	
let mmt = m.quoted.documentMessage.mimetype 	
let fname = m.quoted.documentMessage.fileName
let audio = await m.quoted.download() 
 conn.sendMessage(jid, { document: audio, mimetype: mmt, fileName: fname });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
}
 }else if(m.quoted.type === "documentWithCaptionMessage"){
let fileLengthInBytes = m.quoted.documentWithCaptionMessage.message.documentMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Document files larger than 50 MB cannot be send.*")
}else{
let audio = await m.quoted.download()
let Dmmt =m.quoted.documentWithCaptionMessage.message.documentMessage.mimetype

let Dfname = m.quoted.documentWithCaptionMessage.message.documentMessage.fileName

  const jid = q || from
let cp = m.quoted.documentWithCaptionMessage.message.documentMessage.caption

 conn.sendMessage(jid, { document: audio, mimetype: Dmmt,caption: cp, fileName: Dfname });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")

}

}
			
}else if(m.quoted && m.quoted.type === "audioMessage"){	
let fileLengthInBytes = m.quoted.audioMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Audio files larger than 50 MB cannot be send.*")
}else{
let audio = await m.quoted.download()
const jid = q || from
if(m.quoted.audioMessage.ptt === true){
 
 conn.sendMessage(jid, { audio: audio, mimetype: 'audio/mpeg', ptt: true, fileName: `${m.id}.mp3` });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
 
 }else{
  const jid = q || from
 conn.sendMessage(jid, { audio: audio, mimetype: 'audio/mpeg', fileName: `${m.id}.mp3` });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}

}	
}else if(m.quoted && m.quoted.type === "viewOnceMessageV2Extension"){		
let met = m
const jet = {
    key: {
        remoteJid: mek.key.remoteJid,
        fromMe: false,
        id: met.key.id,
    },
    messageTimestamp: met.messageTimestamp,
    pushName: met.pushName,
    broadcast: met.broadcast,
    status: 2,
    message: {
        audioMessage: {
            url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mimetype,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fleLength,
            seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.seconds,
	    ptt: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.ptt,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.directPath, 
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKeyTimestamp, 
	    waveform: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.waveform,
        },
    },
    id: met.id,
    chat: met.chat,
    fromMe: met.fromMe,
    isGroup: met.isGroup,
    sender: met.sender,
    type: 'audioMessage',
    msg: {
        url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mimetype,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fleLength,
            seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.seconds,
	    ptt: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.ptt,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.directPath, 
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKeyTimestamp, 
	    waveform: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.waveform,
    },
    
};

const mlvv = sms(conn, jet);
var nameJpg = getRandom('');
let buff = await mlvv.download(nameJpg);
let fileType = require('file-type');
let type = fileType.fromBuffer(buff);
await fs.promises.writeFile("./" + type.ext, buff);
await sleep(1000)
let caps = jet.message.audioMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"


const jid = q || from
  conn.sendMessage(jid, { audio:  { url: "./" + type.ext }, mimetype: 'audio/mpeg', ptt: true, viewOnce:true, fileName: `${m.id}.mp3` });
  
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")

}else if(m.quoted && m.quoted.viewOnceMessageV2 && m.quoted.viewOnceMessageV2.message.videoMessage){
let met = m

const jet = {
            key: {
              remoteJid: mek.key.remoteJid,
              fromMe: false,
              id: met.key.id,
            },
            messageTimestamp: met.messageTimestamp,
            pushName: met.pushName,
            broadcast: met.broadcast,
            status: 2,
            message: {
              videoMessage: {
                url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.url,
                mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mimetype,
                caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
                fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileSha256,
                fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fleLength,
                seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.seconds,
                mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKey,
                height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.height,
                width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.width,
                fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileEncSha256,
                directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.directPath,
                mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKeyTimestamp,
                jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.jpegThumbnail,
              },
            },
            id: met.id,
            chat: met.chat,
            fromMe: met.fromMe,
            isGroup: met.isGroup,
            sender: met.sender,
            type: 'videoMessage',
            msg: {
              url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.url,
                mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mimetype,
                caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
                fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileSha256,
                fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fleLength,
                seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.seconds,
                mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKey,
                height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.height,
                width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.width,
                fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileEncSha256,
                directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.directPath,
                mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKeyTimestamp,
                jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.jpegThumbnail,
            },
            body: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
          };

        const mlvv = sms(conn, jet);
        var nameJpg = getRandom('');
        let buff = await mlvv.download(nameJpg);
        let fileType = require('file-type');
        let type = fileType.fromBuffer(buff);
        await fs.promises.writeFile("./" + type.ext, buff);
	await sleep(1000)
	let caps = jet.message.videoMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"
         
	const jid = q || from
  conn.sendMessage(jid, { video: { url: "./" + type.ext }, caption: caps, viewOnce:true });	
  let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}else if(m.quoted && m.quoted.viewOnceMessageV2 && m.quoted.viewOnceMessageV2.message.imageMessage){
let met = m
const jet = {
    key: {
        remoteJid: mek.key.remoteJid,
        fromMe: false,
        id: met.key.id,
    },
    messageTimestamp: met.messageTimestamp,
    pushName: met.pushName,
    broadcast: met.broadcast,
    status: 2,
    message: {
        imageMessage: {
            url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mimetype,
            caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fleLength,
            height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.height,
            width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.width,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.directPath,
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKeyTimestamp,
            jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.jpegThumbnail,
        },
    },
    id: met.id,
    chat: met.chat,
    fromMe: met.fromMe,
    isGroup: met.isGroup,
    sender: met.sender,
    type: 'imageMessage',
    msg: {
        url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.url,
        mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mimetype,
        caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
        fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileSha256,
        fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fleLength,
        height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.height,
        width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.width,
        mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKey,
        fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileEncSha256,
        directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.directPath,
        mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKeyTimestamp,
        jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.jpegThumbnail,
    },
    body: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
};

const mlvv = sms(conn, jet);
var nameJpg = getRandom('');
let buff = await mlvv.download(nameJpg);
let fileType = require('file-type');
let type = fileType.fromBuffer(buff);
await fs.promises.writeFile("./" + type.ext, buff);
await sleep(1000)
let caps = jet.message.imageMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"
 const jid = q || from

  conn.sendMessage(jid, { image: { url: "./" + type.ext }, caption: caps,viewOnce:true });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
}else if(q || m.quoted && m.quoted.type === "conversation"){

const jid = q || from
conn.sendMessage(jid,{text: m.quoted.msg})
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}else{
const mass= await conn.sendMessage(from, { text: `❌ *Please Give me message!*\n\n${envData.PREFIX}send <Jid>`}, { quoted: mek });
return await conn.sendMessage(from, { react: { text: '❓', key: mass.key } });
    
}

 } catch(e) {
console.log(e);
return reply('error!!')
 }
});



cmd({
  pattern: "download",
  react: "🍟",
  alias: ["fetchh"],
  desc: "Direct downloader from a link (max 2GB, RAM safe)",
  category: "movie",
  use: '.download <Direct Link>',
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('❗ Please provide a direct download link.');

    const url = q.trim();
    if (!/^https?:\/\//i.test(url)) return reply('❗ Invalid URL.');

    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

    // Pixeldrain wage sites walata Browser ekakin ena widiyata Headers danna ona
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    };

    let mime = 'application/octet-stream';
    let fileName = 'file.bin';
    let fileSizeMB = 0;

    try {
      const res = await axios.head(url, { headers, timeout: 10000 });

      mime = res.headers['content-type'] || mime;
      const size = parseInt(res.headers['content-length'] || 0);
      fileSizeMB = Math.floor(size / (1024 * 1024));

      if (size > 2000 * 1024 * 1024) { // 2GB Limit
        return reply(`❗ File is too large: ~${fileSizeMB}MB. Max allowed is 2GB.`);
      }

      const disposition = res.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        fileName = disposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
      } else {
        fileName = path.basename(new URL(url).pathname) || 'file.bin';
      }

    } catch (err) {
      fileName = path.basename(new URL(url).pathname) || 'file.bin';
    }

    // MEKA THAMAI FIX EKA: Axios use karala stream ekak widiyata file eka gannawa
    const response = await axios({
        method: 'get',
        url: url,
        headers: headers,
        responseType: 'stream'
    });

    await conn.sendMessage(from, {
      document: response.data, // Kelinma stream eka pass karanawa
      fileName,
      mimetype: mime,
      caption: `✅ *File Ready*\n\n📄 *Name:* ${fileName}\n📦 *Size:* ${fileSizeMB}MB`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (e) {
    console.log(e);
    reply(`❗ Error: ${e.message}`);
  }
});


cmd({
  pattern: "tupdate",
  react: "ℹ️",
  desc: "Update your bot from Mega URL",
  use: ".update",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, { reply, isOwner, isSachintha, isSavi, isSadas, isMani, isMe }) => {
  if (!isOwner && !isSachintha && !isSavi && !isSadas && !isMani && !isMe) return;

  try {
    const fs = require("fs");
    const path = require("path");
    const { exec } = require("child_process");

    // Paths to delete before update
    const dirsToDelete = ["plugins", "lib"];
    const filesToDelete = ["index.js"];

    await reply(`🔄 *Bot Update in Progress...*  
📦 *Removing old files...*`);

    // 1. Remove old bot files/folders
    dirsToDelete.forEach(dir => {
      const dirPath = path.join(__dirname, dir);
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    });
    filesToDelete.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
      }
    });

    // 2. Restart loader (this script)
    await reply("⬇️ *Downloading latest files from Mega & restarting...*");

    setTimeout(() => {
      exec(`pm2 restart ${process.argv[1]}`, (error) => {
        if (error) {
          console.error(error);
          reply("❌ *Update failed during restart!*");
        }
      });
    }, 2000);

  } catch (e) {
    console.error(e);
    reply("🚨 *An unexpected error occurred during update.*");
  }
});







// Disable SSL verification globally (for self-signed certs)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const agent = new https.Agent({ rejectUnauthorized: false });

cmd({
  pattern: "downloadddd",
  react: "🍟",
  alias: ["fetchhh"],
  desc: "Direct downloader from a link with headers",
  category: "movie",
  use: '.directdl <Direct Link>',
  dontAddCommandList: false,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('❗ Please provide a link.');
    const url = q.trim();

    let mime = 'application/octet-stream';
    let fileName = 'downloaded_file';

    // Custom headers
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139 Safari/537.36",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Cookie": "lang=english; affiliate=R38RRFaGV0oLf0GXE2X0lpIV2WaF432kf15pjR1YZyaeAMthcXNumYeUEEJtZTuwbvrZXR7QZg8g%2B3TZJqi7POGAbU0xtoSYmXurTKrYYOMS%2FA8xZBxJmYo%3D"
    };

    // Try HEAD request first
    try {
      const headResp = await axios.head(url, { httpsAgent: agent, headers });

      if (headResp.headers['content-type']) mime = headResp.headers['content-type'];

      const disposition = headResp.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) fileName = match[1].replace(/['"]/g, '');
      } else {
        const parsedPath = new URL(url).pathname;
        const baseName = path.basename(parsedPath);
        if (baseName) fileName = baseName;
      }

    } catch (headErr) {
      // fallback GET with stream
      const getResp = await axios.get(url, { httpsAgent: agent, headers, responseType: 'stream' });

      if (getResp.headers['content-type']) mime = getResp.headers['content-type'];

      const disposition = getResp.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) fileName = match[1].replace(/['"]/g, '');
      } else {
        const parsedPath = new URL(url).pathname;
        const baseName = path.basename(parsedPath);
        if (baseName) fileName = baseName;
      }
    }

    // Send the file as document
    await conn.sendMessage(from, {
      document: { url },
      mimetype: mime,
      fileName,
      caption: config.FOOTER || 'Downloaded via bot'
    });

    // React with ✅
    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (e) {
    reply(`❗ Error occurred: ${e.message}`);
  }
});

cmd({
  pattern: "dp",
  alias: ["setpp", "setdp", "setppbot", "setppgc"],
  desc: "Change profile photo (bot/group). Use: .dp bot | .dp gc (reply to an image or give URL)",
  category: "owner",
  filename: __filename
},
async (conn, mek, m, {
  from, q, reply, isGroup, isAdmins, isBotAdmins, quoted, args, botNumber
}) => {
  try {
    const { isUrl, getBuffer } = require("../lib/functions");

    // target: bot | gc
    const target = (args[0] || "").toLowerCase();
    if (!["bot", "gc", "group", "me", "self"].includes(target)) {
      return reply(
        "Usage:\n• .dp bot  ← reply to an image or pass image URL\n• .dp gc   ← reply to an image or pass image URL"
      );
    }

    // Try to load image from: replied media -> remaining args as URL
    let imgBuffer = null;

    // 1) Replied image
    if (quoted && /image/.test(quoted.mtype || "") && typeof quoted.download === "function") {
      imgBuffer = await quoted.download();
    }

    // 2) URL (if user provided one after the target)
    if (!imgBuffer) {
      const urlArg = q ? q.split(" ").slice(1).join(" ").trim() : "";
      if (urlArg && isUrl(urlArg)) {
        imgBuffer = await getBuffer(urlArg);
      }
    }

    if (!imgBuffer) {
      return reply("Please reply to an image **or** provide a valid image URL.");
    }

    // Decide JID (bot vs group)
    const jid =
      ["bot", "me", "self"].includes(target)
        ? (conn?.user?.id || botNumber)
        : from;

    // Group permission checks for gc
    if (!["bot", "me", "self"].includes(target)) {
      if (!isGroup) return reply("This option only works inside a group chat.");
      if (!isAdmins) return reply("You must be a group admin to change the group DP.");
      if (!isBotAdmins) return reply("I need to be a group admin to change the group DP.");
    }

    // Update profile picture
    // Works on most Baileys versions with a Buffer
    await conn.updateProfilePicture(jid, imgBuffer);

    return reply(
      `✅ Profile photo updated for ${["bot", "me", "self"].includes(target) ? "bot" : "group"}.`
    );
  } catch (e) {
    console.error("DP change error:", e);
    return reply("❌ Failed to update DP: " + (e?.message || e));
  }
});





const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "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"; 
const GITHUB_OWNER = "THEMISADAS2007";  
const GITHUB_REPO = "VISPER-EDUCATION-Database";  
const GITHUB_PATH = "downloads"; 


const alwaysUnique = true; // true = never overwrite, false = overwrite

// --- Upload Function ---
async function uploadToGitHub(fileName, contentBuffer) {
  // Ensure filename is safe for URL
  let safeFileName = encodeURIComponent(fileName);

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}/${safeFileName}`;

  let sha = null;

  // 🔎 Check if file exists
  try {
    const existing = await axios.get(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (alwaysUnique) {
      // 🚫 no overwrite → generate unique filename
      const base = path.parse(fileName).name;
      const ext = path.parse(fileName).ext;
      fileName = `${base}_${Date.now()}${ext}`;
      safeFileName = encodeURIComponent(fileName);
    } else {
      sha = existing.data.sha; // allow overwrite → provide sha
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      sha = null; // new file → ok
    } else {
      throw err; // other errors
    }
  }

  // 🚀 Upload
  const res = await axios.put(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${safeFileName}`,
    {
      message: `Upload ${fileName} via bot`,
      content: contentBuffer.toString("base64"),
      ...(sha ? { sha } : {}) // only if updating
    },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.content.html_url;
}

// ---- CMD ----
cmd({
  pattern: "up",
  react: "🍟",
  alias: ["fetch"],
  desc: "Direct downloader from a link and upload to GitHub",
  category: "movie",
  use: '.download <Direct Link>',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❗ Please provide a direct download link.");

    const url = q.trim();
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Detect MIME + Extension
    const contentType = response.headers["content-type"] || "application/octet-stream";
    let ext = mime.extension(contentType) || "bin";

    // Default filename
    let fileName = `file_${Date.now()}.${ext}`;

    // If server sent filename
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) fileName = match[1];
    } else {
      const parsed = path.basename(new URL(url).pathname);
      if (parsed) fileName = parsed;
    }

    // Upload to GitHub
    const fileUrl = await uploadToGitHub(fileName, Buffer.from(response.data));

    // Reply back
    await conn.sendMessage(from, {
      text: `✅ File uploaded successfully!\n\n📂 [${fileName}](${fileUrl})\n\n*MIME:* ${contentType}`,
      linkPreview: { title: "GitHub Upload", body: "Click to view on GitHub" }
    });

  } catch (e) {
    console.error(e);
    reply("❗ Error: " + e.message);
  }
});
// මෙම විචල්‍යයන් ගෝලීයව ප්‍රකාශයට පත් කර ඇත, එවිට ඒවා start සහ stop යන දෙකම සඳහා භාවිතා කළ හැක.
let monitoringInterval = null;
let lastOrderId = null; // bot එක restart කරන විට මෙම අගය නැවත null වේ.
let monitoringTargetJid = null;

// --- UTILITY FUNCTION ---
const checkAndSendNewOrders = async (conn, targetJid) => {
    try {
        const GITHUB_TOKEN = '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';
        const REPO_OWNER = 'THEMISADAS2007';
        const REPO_NAME = 'sadaslk_Oders';
        // Octokit පුස්තකාලයේ ඇති Octokit class එක නිවැරදිව load කිරීමට නව ක්‍රමවේදය
        const octokit = new Octokit({ auth: GITHUB_TOKEN });
        const { data: files } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'orders',
        });
        
        files.sort((a, b) => b.name.localeCompare(a.name));
        const latestOrderFile = files[0];

        if (latestOrderFile && latestOrderFile.name !== lastOrderId) {
            const { data: content } = await octokit.repos.getContent({
                owner: REPO_OWNER,
                repo: REPO_NAME,
                path: latestOrderFile.path,
            });
            
            const orderContent = Buffer.from(content.content, 'base64').toString('utf-8');
            const messageText = `🔔 *New Order Received!* 🔔\n\n*Order ID:* ${latestOrderFile.name}\n\n*Details:*\n${orderContent}\n\nCheck your admin panel for full details.`;
            
            if (conn.user) {
                await conn.sendMessage(targetJid, { text: messageText });
                console.log(`Sent new order to ${targetJid}: ${latestOrderFile.name}`);
                lastOrderId = latestOrderFile.name; // Update last checked ID
            }
        }
    } catch (e) {
        console.error("Error checking for orders:", e);
    }
};

// --- START COMMAND ---
cmd({
    pattern: "start",
    desc: "Starts a 24-hour continuous order monitoring session.",
    react: "🟢",
    category: "admin",
    use: '.start <JID/number>',
},
async (conn, mek, m, {
    from, reply, isOwner, args
}) => {
    if (!isOwner) return reply("මෙම command එක භාවිතා කිරීමට ඔබට අවසර නැත.");

    // The check for monitoringInterval is now valid as the variable is globally defined.
    if (monitoringInterval) {
        return reply("දැනටමත් order monitoring ක්‍රියාත්මක වේ.");
    }

    const target = args[0] ? (args[0].includes('@g.us') ? args[0] : `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net`) : null;

    if (!target) {
        return reply("කරුණාකර monitor කිරීමට අවශ්‍ය JID එක හෝ දුරකථන අංකය ඇතුළත් කරන්න.\nඋදා: *.start 94712345678*");
    }

    reply(`✅ Order monitoring started for ${target}. It will run for 24 hours.`);
    
    // Set the global variables
    monitoringTargetJid = target;

    // Run a check every 15 seconds (15000ms) - previously 60000ms
    monitoringInterval = setInterval(async () => {
        await checkAndSendNewOrders(conn, monitoringTargetJid);
    }, 15000);

    // Stop monitoring after 24 hours (24 * 60 * 60 * 1000ms)
    setTimeout(() => {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        reply(`❌ 24-hour order monitoring session has ended for ${monitoringTargetJid}.`);
    }, 24 * 60 * 60 * 1000);
});

// --- STOP COMMAND ---
cmd({
    pattern: "stop",
    desc: "Stops the continuous order monitoring session.",
    react: "🔴",
    category: "admin",
    use: '.stop',
},
async (conn, mek, m, {
    from, reply, isOwner
}) => {
    if (!isOwner) return reply("මෙම command එක භාවිතා කිරීමට ඔබට අවසර නැත.");

    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        reply("✅ Order monitoring has been successfully stopped.");
    } else {
        reply("⚠️ Order monitoring දැනට ක්‍රියාත්මක නොවේ.");
    }
});

cmd({
    pattern: "developer",
    react: "👨‍💻",
    category: "main",
    use: ".developer",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const devList = [
            { name: "🧠 Saviya", role: "Founder", number: "94722617699" },
            { name: "⚡ Sadas", role: "Co-Developer", number: "94724375368" },
            { name: "💻 Nadeen", role: "Co-Developer", number: "94711451319" },
            { name: "🧩 Pathum", role: "API-Developer", number: "94766863255" },
            { name: "🎯 Poorna", role: "Code Helper & Supplier", number: "94719255382" },
            { name: "👑 Alex", role: "System Leader", number: "94742524701" }
        ];

        let text = `*👨‍💻 ${config.BOT_NAME || "VISPER-MD"} Developer Team*\n\n`;

        for (let dev of devList) {
            const mention = `@${dev.number}`;
            text += `> ${dev.name}\n    ┗ ${dev.role}\n    📞 wa.me/${dev.number}\n\n`;
        }

        text += `${config.FOOTER}`;

        const mentions = devList.map(d => `${d.number}@s.whatsapp.net`);

        await conn.sendMessage(from, {
            text,
            mentions
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Couldn't load developer info." }, { quoted: m });
    }
});
