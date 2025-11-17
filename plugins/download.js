const config = require('../config')
const axios = require('axios');
const fs = require('fs')
const file_size_url = (...args) => import('file_size_url')
.then(({ default: file_size_url }) => file_size_url(...args));
const cheerio = require('cheerio'); 
const { phsearch, phdl } = require('darksadas-yt-pornhub-scrape')
const { File } = require('megajs');
const fg = require('api-dylux');
const { igdl } = require('ruhend-scraper')
const { sizeFormatter} = require('human-readable');;
const { ytmp3, tiktok, facebook, instagram, twitter, ytmp4 } = require('sadaslk-dlcore');
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    getsize,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions')
const { search, download } = require('../lib/apkdl')

const {
    cmd,
    commands
} = require('../command')
const { getFbVideoInfo } =  require("fb-downloader-scrapper")
const https = require('https');
let wm = config.FOOTER
let newsize = config.MAX_SIZE * 1024 * 1024
var sizetoo =  "_This file size is too big_"
const yts = require("ytsearch-venom")
const g_i_s = require('g-i-s'); 
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const sharp = require('sharp');

//===================================Sahrp funtion===============================================
async function resizeImage(inputBuffer, width, height) {
    try {
        return await sharp(inputBuffer).resize(width, height).toBuffer();
    } catch (error) {
        console.error('Error resizing image:', error);
        return inputBuffer; 
    }
}

//====================================Google Drive Dl Scrap==========================================






//=============================================== Filwe size checker=========================================

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
        }).on('error', err => reject(err));
    });
}

//===============================================================================================

cmd({
    pattern: "gdrive",
    alias: ["gd"],
    react: '📑',
    desc: "Download googledrive files.",
    category: "download",
    use: '.gdrive <googledrive link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return await  reply('*Please give me googledrive url !!*')   
let res = await fg.GDriveDl(q.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view'))
reply(`*♕︎ 𝘝𝘐𝘚𝘗𝘌𝘙 𝘎𝘋𝘙𝘐𝘝𝘌 𝘋𝘖𝘞𝘕𝘓𝘖𝘈𝘋𝘌𝘙* \n\n*📃 File name:*  ${res.fileName}
*💈 File Size:* ${res.fileSize}
*🕹️ File type:* ${res.mimetype}

*•ᴠɪsᴘᴇʀ-ᴍᴅ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ* `)		
conn.sendMessage(from, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype, caption: res.fileName.replace('[Cinesubz.co]' , '[visper-MOVIES.]') +'\n\n> *•ᴠɪsᴘᴇʀ-ᴍᴅ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ•*'}, { quoted: mek })
} catch (e) {
reply('*Error !!*')
l(e)
}
})



cmd({
    pattern: "mega",
    react: "🍟",
    alias: ["megadl", "meganz"],
    desc: "Download files from Mega.nz",
    category: "download",
    use: '.mega <mega.nz URL>',
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("*⚠️ Please provide a Mega.nz URL!*");

        const file = File.fromURL(q);
        await file.loadAttributes();

        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > config.MAX_SIZE * 1024 * 1024) {
            return reply(`⚠️ *File too large!*\n\n📁 *Size:* ${fileSizeMB} MB\n📌 *Limit:* ${config.MAX_SIZE} MB`);
        }

        await reply(`⏳ *Downloading from Mega.nz...*\n\n📄 *File:* ${file.name}\n📁 *Size:* ${fileSizeMB} MB`);

        // Convert Mega stream → Buffer
        const data = await streamToBuffer(file.download());

        // Detect mimetype
        const ext = file.name.split('.').pop().toLowerCase();
        const mimeTypes = {
            mp4: "video/mp4",
            pdf: "application/pdf",
            zip: "application/zip",
            rar: "application/x-rar-compressed",
            '7z': "application/x-7z-compressed",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            mp3: "audio/mpeg",
            txt: "text/plain"
        };
        const mimetype = mimeTypes[ext] || "application/octet-stream";

        // Send as document (buffer)
        await conn.sendMessage(from, { 
            document: data,
			caption: `${config.FOOTER}`,
            mimetype,
            fileName: file.name
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error(e);
        await reply(`❌ *Error occurred:* ${e.message || e}`);
    }
});

function ytreg(url) {
    const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
    return ytIdRegex.test(url);
}
cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: ".yts <song name or URL>",
    react: "🔎",
    desc: "Search songs on YouTube",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, isCmd, command, l }) => {
    try {
        if (!q) {
            return await reply("*⚠️ Please provide a search term or URL!*");
        }

        // Check if input is a URL but not a valid YouTube URL
        if (isUrl(q) && !ytreg(q)) {
            return await reply("*⚠️ Invalid YouTube URL!*");
        }

        // Import ytsearch-venom dynamically
        let yts;
        try {
            yts = require("ytsearch-venom");
        } catch (err) {
            l(err);
            return await reply("*❌ ytsearch-venom module is missing!*");
        }

        // Perform search
        let arama;
        try {
            arama = await yts(q);
        } catch (err) {
            l(err);
            return await reply("*❌ Error while searching YouTube!*");
        }

        // Format search results
        if (!arama.all || arama.all.length === 0) {
            return await reply("*⚠️ No results found!*");
        }

        let mesaj = '';
        arama.all.map((video, index) => {
            mesaj += `*${index + 1}. ${video.title}*\n🔗 ${video.url}\n\n`;
        });

        await conn.sendMessage(from, { text: mesaj }, { quoted: mek });

    } catch (err) {
        l(err);
        await reply("*❌ Unexpected error occurred!*");
    }
});

cmd({
    pattern: "song",
    alias: ["ytsong"],
    use: '.song <query or url>',
    react: "🎧",
    desc: "Download high-quality songs from YouTube",
    category: "Download",
    filename: __filename
},

async(conn, mek, m, {
  from, prefix, q, reply
}) => {
  try {
    if (!q) return await reply('🔎 *Please provide a song name or YouTube link!*');

    const url = q.replace(/\?si=[^&]*/, '');
    const results = await yts(url);
    const result = results.videos[0];
    const wm = config.FOOTER;

    let caption = `\`🎧 🅅🄸🅂🄿🄴🅁 🅂🄾🄽🄶 🄳🄾🅆🄽🄻🄾🄳🄴🅁 🎧\`	
*┌────────────────────┐*
*├ \`🎶 Title\` : ${result.title}*
*├ \`🐼 Views\` : ${result.views}*
*├ \`⌛ Duration\` : ${result.duration}*
*├ \`📎 URL\` : ${result.url}*
*└────────────────────┘*`;

    const buttons = [
      {
        buttonId: `${prefix}ytaa ${result.url}`,
        buttonText: { displayText: '*Audio Format 🎶*' },
        type: 1
      },
      {
        buttonId: `${prefix}ytad ${result.url}&${result.thumbnail}&${result.title}`,
        buttonText: { displayText: '*Document Format 📂*' },
        type: 1
      },
		 {
        buttonId: `${prefix}ytaap ${result.url}`,
        buttonText: { displayText: '*Voice Format 🎤*' },
        type: 1
      }
    ];

    const buttonMessage = {
      image: { url: result.thumbnail },
      caption: caption,
      footer: wm,
      buttons: buttons,
      headerType: 4
    };

const listButtons = {
  title: "🎵 Choose an audio format",
  sections: [
    {
      title: "Audio Formats 🎶",
      rows: [
        {
          title: "Audio Format",
          description: "Send as audio (music)",
          id: `${prefix}ytaa ${result.url}`
        },
        {
          title: "Document Format",
          description: "Send as document file",
          id: `${prefix}ytad ${result.url}&${result.thumbnail}&${result.title}`
        },
        {
          title: "Voice Note",
          description: "Send as voice message",
          id: `${prefix}ytaap ${result.url}`
        }
      ]
    }
  ]
};


	  
if (config.BUTTON === 'true') {
  return await conn.sendMessage(from, {
        image: {url: result.thumbnail },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "Song formats list",
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
      }, { quoted: mek });


} else if (config.BUTTON === 'false') {
   await conn.buttonMessage(from, buttonMessage, mek);
}

   

  } catch (e) {
    console.error(e);
    reply('❌ *Song not found or an error occurred.*');
  }
});













cmd({
  pattern: "song2",
  alias: ["ytsong2"],
  use: '.song2 <query/url>',
  react: "🎧",
  desc: "Download songs",
  category: "download",
  filename: __filename
},

async (conn, mek, m, {
  from, prefix, quoted, body, isCmd, command, args, q, isGroup,
  sender, senderNumber, botNumber2, botNumber, pushname,
  isMe, isOwner, groupMetadata, groupName, participants,
  groupAdmins, isBotAdmins, isAdmins, reply
}) => {
  try {
    if (!q) return await reply('*Please enter a query or a URL!*');
    
    const url = q.replace(/\?si=[^&]*/, '');
    const results = await yts(url);
    const result = results.videos[0];
    const wm = config.FOOTER;

    let caption = `🎶 *VISPER SONG DOWNLOADER* 🎶

┌────────────────────┐
│ 🎵 *Title:* ${result.title}
│ 👁️ *Views:* ${result.views}
│ ⏱️ *Duration:* ${result.duration}
│ 🔗 *URL:* ${result.url}
└────────────────────┘`;

 await conn.sendMessage(
 from, 
  { 
    image: { url: result.thumbnail }, 
    caption: caption
  }
);




	  
    const prog = await fetchJson(`https://sadas-ytmp3-5.vercel.app/convert?link=${result.url}`);
    const audioUrl = prog?.url;
    if (!audioUrl) return await reply('*Failed to get audio link.*');

	  try {
    const bytes = await checkFileSize(audioUrl, config.MAX_SIZE);
    const sizeInMB = (bytes / (1024 * 1024)).toFixed(2);

    if (sizeInMB > config.MAX_SIZE) {
        return reply(`*⚠️ File too large or cannot determine size!*
		
*📌 Maximum allowed: \`${config.MAX_SIZE}\`*

_*💡 You can try a smaller file or use .apply command to override.*_`);
    }
} catch (err) {
    // If the stream aborts due to size, we can just show max limit
     return reply(`*⚠️ File too large or cannot determine size!*
	 
*📌 Maximum allowed: \`${config.MAX_SIZE}\`*

_*💡 You can try a smaller file or use .apply command to override.*_`);
}

    await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: mek });

    const botimgResponse = await fetch(result.thumbnail);
    const botimgBuffer = await botimgResponse.buffer();
    const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

    await conn.sendMessage(from, {
      document: { url: audioUrl },
      jpegThumbnail: resizedBotImg,
      caption: wm,
      mimetype: 'audio/mpeg',
      fileName: `${result.title}.mp3`
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    await reply('❌ Error: Could not process the request.');
  }
});


cmd({
    pattern: "ytaa",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return await reply('*Need a YouTube URL!*');

    try {
        const prog = await fetchJson(`https://yt-five-tau.vercel.app/download?q=${q}&format=mp3&apikey=sadas2007`)
        if (!prog || !prog.result.download) return await reply('*Conversion failed, try again!*');

        try {
            const bytes = await checkFileSize(prog.result.download, config.MAX_SIZE);
            const sizeInMB = (bytes / (1024 * 1024)).toFixed(2);

            // This check is redundant now, but left for safety
            if (sizeInMB > config.MAX_SIZE) {
                return reply(`*⚠️ File too large!*\n\n*📌 Maximum allowed: \`${config.MAX_SIZE}\` MB*`);
            }

        } catch (err) {
            return reply(`*⚠️ File too large or cannot determine size!*\n\n*📌 Maximum allowed: \`${config.MAX_SIZE}\` MB*`);
        }

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(
            from,
            { audio: { url: prog.result.download }, mimetype: 'audio/mpeg' },
            { quoted: mek }
        );

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        reply(N_FOUND);
        console.log(e);
    }
});

cmd({
  pattern: "ytaap",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return await reply('*Need a youtube url!*');

  try {
    const prog = await fetchJson(`https://yt-five-tau.vercel.app/download?q=${encodeURIComponent(q)}&format=mp3&apikey=sadas2007`);
    if (!prog?.result?.download) throw new Error('No download URL');

    await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

    const res = await fetch(prog.result.download);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await conn.sendMessage(
      from,
      {
        audio: buffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      },
      { quoted: mek }
    );

    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
  } catch (e) {
    await reply('❌ Failed: ' + (e.message || e));
    console.log(e);
  }
});

cmd({
    pattern: "alex",
    alias: ["ytsong"],
    use: '.song lelena',
    react: "🎧",
      desc: "Download songs",
    dontAddCommandList: true,
    filename: __filename
},

async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, isAlex, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{   

	    
    if (!q) return await reply('*Please enter a query or a url!*')
    const url = q.replace(/\?si=[^&]*/, '');
    var results = await yts(url);
    let wm = config.FOOTER
    var result = results.videos[0]
     let caption = `*╭─「 \`සිංදු පිස්සෝ\` 」*
*╰────────────┈*>
*⏤͟͟͞͞★❬❬ 🫟සිංදු පිස්සෝ 😼🖤|🇱🇰 ❭❭⏤͟͟͞͞★*
*╭⃘⃝─────────────┈◦•☻•◦*
*╎🍀 \`Title:\` ${result.title}*
*╎👁️‍🗨️ \`Views:\` ${result.views}*
*╎🔮 \`Duration:\` ${result.duration}*
*╚─────────────❨⥁⚘*
[🖤|❤️‍🔥|🖤|🤍|💚|🩵|💜|❤️💖]
> *🫟සිංදු පිස්සෝ 😼🖤|🇱🇰*`
	
const buttons = [
	{buttonId: prefix + 'alexaa ' + result.url, buttonText: {displayText: 'Send info 🎶'}, type: 1},
  {buttonId: prefix + 'alexa ' + result.url, buttonText: {displayText: 'Audio Type 🎶'}, type: 1}
  
]
const buttonMessage = {
    image: {url: result.thumbnail},
    caption: caption,
    footer: wm,
    buttons: buttons,
    headerType: 4
}
await conn.buttonMessage(from, buttonMessage, mek)
} catch (e) {
  reply(N_FOUND)
  console.log(e)
}
})



cmd({
    pattern: "alexaa",
    react: "🔮",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) return await reply('*Need a youtube url!*');

          try {
 if (!q) return await reply('*Please enter a query or a url!*')
    const url = q.replace(/\?si=[^&]*/, '');
    var results = await yts(url);
    let wm = config.FOOTER
    var result = results.videos[0]
     let caption = `*╭─「 \`සිංදු පිස්සෝ\` 」*
*╰────────────┈*>
*⏤͟͟͞͞★❬❬ 🫟සිංදු පිස්සෝ 😼🖤|🇱🇰 ❭❭⏤͟͟͞͞★*
*╭⃘⃝─────────────┈◦•☻•◦*
*╎🍀 \`Title:\` ${result.title}*
*╎👁️‍🗨️ \`Views:\` ${result.views}*
*╎🔮 \`Duration:\` ${result.duration}*
*╚─────────────❨⥁⚘*
[🖤|❤️‍🔥|🖤|🤍|💚|🩵|💜|❤️💖]
> *🫟සිංදු පිස්සෝ 😼🖤|🇱🇰*`

await conn.sendMessage(
  `120363422174267666@newsletter`, 
  { 
    image: { url: result.thumbnail }, 
    caption: caption
  }
);
		  
                await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
           } catch (e) {
  reply(N_FOUND)
  console.log(e)
}
})



cmd({
    pattern: "alexa",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) return await reply('*Need a youtube url!*');

          try {

		  const prog = await fetchJson(`https://sadas-ytmp3-5.vercel.app/convert?link=${q}`)

await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
		    
		        
                await conn.sendMessage(`120363422174267666@newsletter`, { 
  audio: { url: prog.url }, 
  mimetype: 'audio/mpeg', 
  ptt: true 
}, { quoted: mek });

                await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
           } catch (e) {
  reply(N_FOUND)
  console.log(e)
}
})
cmd({
    pattern: "ytad",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*Need a YouTube URL!*');

        const datae = q.split("&")[0];
        const datas = q.split("&")[1];
        const title = q.split("&")[2];

        // --- Thumbnail fetch ---
        const botimgResponse = await fetch(datas);
        const botimgBuffer = await botimgResponse.buffer();

        // --- Get audio download link ---
        const prog = await fetchJson(`https://yt-five-tau.vercel.app/download?q=${datae}&format=mp3&apikey=sadas2007`);
       

        // --- File size check with filesizeurl ---
        const bytes = await file_size_url(prog.result.download);
        const sizeInMB = (bytes / (1024 * 1024)).toFixed(2);

        if (sizeInMB > config.MAX_SIZE) {
            return await reply(
                `*⚠️ File too large!*\n\n📂 Size: ${sizeInMB} MB\n📌 Maximum allowed: ${config.MAX_SIZE} MB`
            );
        }

        // --- Send audio file ---
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(
            from,
            {
                document: { url: prog.result.download },
                jpegThumbnail: botimgBuffer,
                mimetype: 'audio/mpeg',
                caption: wm || config.FOOTER,
                fileName: `${title}.mp3`
            },
            { quoted: mek }
        );

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.log(e);
        await reply('*❌ Error occurred while processing your request.*');
    }
});


  cmd({
    pattern: "directmp3",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	
 

	await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
	const up_mg =  await conn.sendMessage(from, { text : `*Uploading request ..⬆️*` }, {quoted: mek} )
           
	await conn.sendMessage(from, { audio:{ url: q }, caption: config.FOOTER , mimetype: 'audio/mpeg' , caption: wm, fileName: `test.mp3` });
        await conn.sendMessage(from, { delete: up_mg.key })
	await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })


cmd({
    pattern: "tiktok",    
  alias: ["tt","ttdl","tiktokdl"],
    react: '🎩',
    desc: "Download tiktok videos",
    category: "download",
    use: '.tiktok < tiktok url >',
    filename: __filename
},
async(conn, mek, m,{from, l, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  
  
  if (!q) return await reply('TEXT') 
      if (!q.includes('tiktok')) return await reply('valid_url') 


const mov = await fetchJson(`https://darksadasyt-tiktokdl.vercel.app/api/tiktok?q=${q}`)

let caption = `*\`🪺 VISPER TIK TOK DOWNLODER 🪺\`*

*┌──────────────────*
*├ \`🎩 Title\` :* ${mov.title}
*├ \`🎃 Region\` :* ${mov.regions}
*├ \`⏰ Duration\` :* ${mov.runtime}
*├ \`🔗 Url\` :* ${q}
*└──────────────────*
`



const buttons = [
  {buttonId: prefix + 'ttdl1 ' + mov.no_watermark, buttonText: {displayText: '_Video No Watermark 📼_'}, type: 1},
  {buttonId: prefix + 'ttdl2 ' + mov.watermark, buttonText: {displayText: '_Video Watermark 📼_'}, type: 1},
  {buttonId: prefix + 'ttdl3 ' + mov.music, buttonText: {displayText: '_Audio 🎶_'}, type: 1}
 
]
const buttonMessage = {
    image: {url: mov.thumbnail},
    caption: caption,
    footer: config.FOOTER,
    buttons: buttons,
    headerType: 4
}

const listButtons = {
  title: "❯❯ Choose a video Format ❮❮",
  sections: [
    {
      title: "Tiktok Video Type 📽️",
      rows: [
        { title: "Video No Watermark", "description":"No Watermark", id: prefix + 'ttdl1 ' + mov.no_watermark },
        { title: "Video Watermark",  "description":"With Watermark",id: prefix + 'ttdl2 ' + mov.watermark},
        { title: "Audio", "description":"Only Mp3", id: prefix + 'ttdl3 ' + mov.music }
      ]
    }
  ]
};

    // Sending logic based on config.BUTTON
    if (config.BUTTON === "true") {
      return await conn.sendMessage(from, {
        image: {url: mov.thumbnail },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "Video quality list",
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
      }, { quoted: mek });

} else if (config.BUTTON === 'false') {
  
await conn.buttonMessage(from, buttonMessage, mek)

}

} catch (e) {
  reply(`Error !!\n\n*${e}*`)
  console.log(e)
}
})


cmd({
    pattern: "ttdl1",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
  
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });	
conn.sendMessage(from, { video: { url: q }, mimetype: "video/mp4", caption: `${config.FOOTER}` }, { quoted: mek })
  await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } })
} catch (e) {
console.log(e)
reply(`Error !!\n\n*${e}*`)
}
})

cmd({
    pattern: "ttdl2",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
  
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });	
conn.sendMessage(from, { video: { url: q }, mimetype: "video/mp4", caption: `${config.FOOTER}` }, { quoted: mek })
  await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } })
} catch (e) {
console.log(e)
reply(`Error !!\n\n*${e}*`)
}
})

cmd({
    pattern: "ttdl3",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
  
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

	await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
conn.sendMessage(from, { audio: { url: q }, mimetype: "audio/mpeg", caption: `${config.FOOTER}` }, { quoted: mek })
  await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } })
} catch (e) {
console.log(e)
reply(`Error !!\n\n*${e}*`)
}
})


cmd({
    pattern: "ttdl4",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
  
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
conn.sendMessage(from, { audio: { url: q }, mimetype: "audio/mpeg", caption: `${config.FOOTER}` }, { quoted: mek })
  await conn.sendMessage(from, { react: { text: `✔️`, key: mek.key } })
} catch (e) {
console.log(e)
reply(`Error !!\n\n*${e}*`)
}
})

  
cmd({
    pattern: "ai",
    react: "🎃",
	use: ".ai <promt>",
    category: "ai",
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) return await reply('*Need a youtube url!*');

          try {

		  const prog = await fetchJson(`https://darksadas-ytmp3.vercel.app/chat?q=${q}`)


		    
reply(`${prog}`)
           } catch (e) {
  reply(N_FOUND)
  console.log(e)
}
})





cmd({
    pattern: "fb",
    alias: ["facebook"],
    use: '.fb <facebook url>',
    react: "🏮",
    desc: 'Download videos from Facebook',
    category: "download",
    filename: __filename
}, async (conn, m, mek, { from, prefix, q, reply }) => {
    try {
        if (!q || !q.includes('facebook.com')) {
            return await reply('*❌ Please enter a valid Facebook URL!*');
        }

        const apiURL = `https://apis.prexzyvilla.site/download/facebook?url=${encodeURIComponent(q)}`;
        console.log('🌐 FB API URL:', apiURL);

        let sadas;
        try {
            const res = await axios.get(apiURL, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Accept": "application/json",
                    "Referer": "https://www.facebook.com/"
                }
            });
            sadas = res.data;
            console.log('📦 API DATA:', JSON.stringify(sadas, null, 2));
        } catch (err) {
            console.error("❌ AXIOS ERROR:", err.response?.data || err.message);
            return reply('*⚠️ Failed to fetch data from Facebook API. Check console for details.*');
        }

        if (!sadas.status || !sadas.data) {
            return reply('*❌ No downloadable data found. Try another video.*');
        }

        const data = sadas.data;
        const hdUrl = data.hd;
        const sdUrl = data.sd;
        let thumb = data.thumbnail;

        // ✅ Use fallback or proxy for thumbnail
        if (!thumb || !thumb.startsWith('http')) {
            thumb = 'https://i.imgur.com/qNQv8Ru.jpeg';
        } else {
            thumb = `https://images.weserv.nl/?url=${encodeURIComponent(thumb.replace(/^https?:\/\//, ''))}`;
        }

        const duration = 'Unknown'; // Not available in new API
        const title = data.title || 'Facebook video';

        const caption = `\`🏮 VISPER FB DOWNLOADER 🏮\`\n\n` +
                   `*┌──────────────────*\n` +
                   `*├ \`🐼 Title:\`* ${title}\n` +
                   `*├ \`⏱️ Duration:\`* ${duration}\n` +
                   `*├ \`🔗 Url:\`* ${q}\n` +
                   `*└──────────────────*`;

        const buttons = [];

        if (hdUrl) {
            buttons.push({
                buttonId: prefix + 'downfb ' + hdUrl,
                buttonText: { displayText: 'HD Quality' },
                type: 1
            });
        }

        if (sdUrl) {
            buttons.push({
                buttonId: prefix + 'downfb ' + sdUrl,
                buttonText: { displayText: 'SD Quality' },
                type: 1
            });
        }

        if (buttons.length === 0) {
            return reply('*❌ No video formats found.*');
        }

        const buttonMessage = {
            image: { url: thumb },
            caption: caption,
            footer: config.FOOTER,
            buttons: buttons,
            headerType: 4
        };

        const listButtons = {
  title: "❯❯ Choose a video Format ❮❮",
  sections: [
    {
      title: "Facebook Video Type 📽️",
      rows: [
        { title: "SD Quality", "description":"Download sd quality", id: prefix + 'downfb ' + sdUrl },
        { title: "HD Quality",  "description":"Download hd quality",id: prefix + 'downfb ' + hdUrl }
        
      ]
    }
  ]
};

    // Sending logic based on config.BUTTON
    if (config.BUTTON === "true") {
      return await conn.sendMessage(from, {
        image: {url: thumb },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "Video quality list",
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
      }, { quoted: mek });

} else if (config.BUTTON === 'false') {
            await conn.buttonMessage(from, buttonMessage, mek);
        }

    } catch (e) {
        console.error('❌ Unexpected Error:', e);
        return reply('*⚠️ An unexpected error occurred. Try again later.*');
    }
});




cmd({
  pattern: "downfb",
  react: "🎥",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || !q.includes('fbcdn')) return await reply('*❌ Invalid Facebook CDN video URL!*');

    reply('⏳ *Downloading Facebook video...*');

 const response = await axios.get(q, {
  responseType: 'arraybuffer',
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "*/*",
    "Accept-Encoding": "identity",
    "Referer": "https://fdown.net/",
    "Origin": "https://fdown.net"
  }
});


    const videoBuffer = Buffer.from(response.data, 'binary');

    await conn.sendMessage(from, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      caption: '✅ *Facebook video downloaded successfully!*'
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

  } catch (error) {
    console.log("❌ Facebook video download error:", error);
    reply('*❌ Failed to download. The video might be geo-blocked or expired.*');
  }
});








cmd({
    pattern: "img",
    alias: ["googleimg"],
    //react: "🌅",
    desc: "Search for images on Google",
    category: "download",
    use: '.imgsearch <query>',
    filename: __filename
},

async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, prefix, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('*Please provide a search query!*')


var rows = [];  	
rows.push(
    { buttonId: prefix + 'imgdlm ' + q, buttonText: { displayText: '_Normal Type 🎑_' }, type: 1 },
    { buttonId: prefix + 'imgdld ' + q, buttonText: { displayText: '_Document Type 🎑_' }, type: 1 }
);

 const caption = `*🦊 Choose Image Download Type..*`
const buttonMessage = {
 

  caption: caption,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 1
}
 if (config.BUTTON === "true") {
conn.sendMessage(from, {
    
    text: caption,
    footer: config.FOOTER,
    buttons: [
        {
            buttonId: prefix + 'imgdlm ' + q,
            buttonText: { displayText: "Normal Type" },
            type: 1
        },
        {
            buttonId: prefix + 'imgdld ' + q,
            buttonText: { displayText: "Document Type" },
            type: 1
        }
    ],
    headerType: 1,
    viewOnce: true
}, { quoted: mek });

} else if (config.BUTTON === 'false') {

	
return await conn.buttonMessage(from, buttonMessage, mek)

}
} catch (e) {
   reply('🚫 *Error Accurated !!*\n\n' + e )
console.log(e)
}
})







cmd({
    pattern: "imgdlm",
    //alias: ["googleimg"],
    react: "🌅",
    //desc: "Search for images on Google",
    //category: "search",
    use: '.imgsearch <query>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide a search query!");

        g_i_s(q, (error, result) => {
            if (error || !result.length) return reply("No images found!");

            // Send the first 5 images
            const imageUrls = result.slice(0, 5).map(img => img.url);
            imageUrls.forEach(async (url) => {
               await conn.sendMessage(from, 
    { 
        image: { url }, 
        caption: config.FOOTER 
    }, 
    { quoted: mek }
);

            });
        });

    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});

cmd({
    pattern: "imgdld",
    //alias: ["googleimg"],
    react: "🌅",
    //desc: "Search for images on Google",
    //category: "search",
    use: '.imgsearch <query>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide a search query!");

        g_i_s(q, (error, result) => {
            if (error || !result.length) return reply("No images found!");

            // Send the first 5 images
            const imageUrls = result.slice(0, 5).map(img => img.url);
            imageUrls.forEach(async (url) => {
                await conn.sendMessage(from, { 
            document: { url: url },
            caption: config.FOOTER,
            mimetype: "image/jpeg",
            
            fileName: `${q}.jpeg`
        });


            });
        });

    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});


cmd({

    pattern: "ig",
    desc: "To get the instragram.",
    react: "🎀",
    use: '.ig < Link >',
    category: "download",
    filename: __filename

},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
    
if (!q) return m.reply(`Please Give Me a vaild Link...`);
m.react('⬇️')

         let res = await fetchJson(`https://darksadasyt-igdl.vercel.app/api/download?q=${q}`);
        
     
             m.react('⬆️')
            await conn.sendMessage(from,{video: {url: res.result.data[0].downloadUrl },mimetype:"video/mp4",caption: config.FOOTER},{quoted:mek})
             m.react('✔️')
       

}catch(e){
console.log(e)
}
})


cmd({

    pattern: "twitter",
    alias: ["tw"],
    desc: "To get the instragram.",
    react: "❄️",
    use: '.twitter < Link >',
    category: "download",
    filename: __filename

},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
    
if (!q) return m.reply(`Please Give Me a vaild Link...`);
m.react('⬇️')

         let res = await fetchJson(`https://darksadasyt-twiterdl.vercel.app/api/download?url=${q}`);
        
     
             m.react('⬆️')
            await conn.sendMessage(from,{video: {url: res.videos[0].url },mimetype:"video/mp4",caption: config.FOOTER},{quoted:mek})
             m.react('✔️')
       

}catch(e){
console.log(e)
}
})





















cmd({
    pattern: "apk",
    react: "🗃️",
    alias: ["findapk","playstore"],
    category: "download",
    use: '.apk whatsapp',
    filename: __filename
},
async(conn, mek, m,{from, q, reply}) => {
  try {
    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key }})

    if(!q) return reply('*🗃️ Enter apk name...*') 

    const data = await download(q)
    if (!data || !data.dllink) return reply("❌ APK not found!")

    let listdata = `*\`🗃️ VISPER APK DOWNLOADER 🗃️\`*

*┌──────────────────╮*
*├ \`📚 Name\` :* ${data.name}
*├ \`📦 Package\` :* ${data.package}
*├ \`⬆️ Last update\` :* ${data.lastup}
*├ \`📥 Size\` :* ${data.size}
*└──────────────────╯*

${config.FOOTER}`

    // send info + footer
    await conn.sendMessage(from, { image: { url: data.icon }, caption: listdata }, { quoted: mek })

    // send apk file
    let sendapk = await conn.sendMessage(from , { 
        document : { url : data.dllink }, 
        mimetype : 'application/vnd.android.package-archive', 
        fileName : data.name + '.apk',
        caption: config.FOOTER
    }, { quoted: mek })

    // reactions
    await conn.sendMessage(from, { react: { text: '📁', key: sendapk.key }})
    await conn.sendMessage(from, { react: { text: '✔', key: mek.key }})
    
  } catch (e) {
    console.log("APK CMD ERROR:", e)
    reply('❌ ERROR while downloading APK!')
  }
})


cmd({
    pattern: "video",
    alias: ["ytvideo"],
    use: '.video lelena',
    react: "📽️",
      desc: "Download videoss",
    category: "download",
    filename: __filename
},

async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{            
    if (!q) return await reply('*Please enter a query or a url!*')
    const url = q.replace(/\?si=[^&]*/, '');
    var results = await yts(url);
    let wm = config.FOOTER
    var result = results.videos[0]
     let caption = `*📹 🅅🄸🅂🄿🄴🅁 🅅🄸🄳🄴🄾 🄳🄾🅆🄽🄻🄾🄰🄳🄴🅁 📹*
*┌─────────────────────┐*
*├ \`📹 Title\` : ${result.title}* 
*├ \`🐼 Views\` : ${result.views}*
*├ \`⌛Duration\` : ${result.duration}*
*├ \`📎 URL\` : ${result.url}*
*└─────────────────────┘*`
const sections = [
  {
title: "`Video type 📽️`",
rows: [{
title: '```144p Video```',
rowId: prefix + `videodl144 ${result.url}` 
},
{
title: '```240p Video```',
rowId: prefix + `videodl240 ${result.url}`
},
{
title: '```360p Video```',
rowId: prefix + `videodl360 ${result.url}`
},
{
title: '```480p Video```',
rowId: prefix + `videodl480 ${result.url}`
},  
{
title: '```720p Video```',
rowId: prefix + `videodl720 ${result.url}`
},       
{
title: '```1080p Video```',
rowId: prefix + `videodl1080 ${result.url}`
}
       
]},  

{
title: "`Document type 📁`",
rows: [{
title: '```144p Document```',
rowId: prefix + `docdl144 ${result.url}&${result.thumbnail}&${result.title}`
},
{
title: '```240p Document```',
rowId: prefix + `docdl240 ${result.url}&${result.thumbnail}&${result.title}`
},
{
title: '```360p Document```',
rowId: prefix + `docdl360 ${result.url}&${result.thumbnail}&${result.title}`
},
{
title: '```480p Document```',
rowId: prefix + `docdl480 ${result.url}&${result.thumbnail}&${result.title}`
},
{
title: '```720p Document```',
rowId: prefix + `docdl720 ${result.url}&${result.thumbnail}&${result.title}`
},       
{
title: '```1080p Document```',
rowId: prefix + `docdl1080 ${result.url}&${result.thumbnail}&${result.title}`
}
       
]}  	
]
const listMessage = {
text: caption,
image: {url: result.thumbnail },	
footer: config.FOOTER,
title: '',
buttonText: '*🔢 Reply below number*\n',
sections
}

const listButtons = {
  title: "❯❯ Choose a video quality ❮❮",
  sections: [
    {
      title: "Video Type 📽️",
      rows: [
        { title: "144p Video", "description":"144p quality download", id: prefix + `videodl144 ${result.url}` },
        { title: "240p Video",  "description":"240p quality download",id: prefix + `videodl240 ${result.url}` },
        { title: "360p Video", "description":"360p quality download", id: prefix + `videodl360 ${result.url}` },
		 { title: "720p Video", "description":"720p quality download",id: prefix + `videodl720 ${result.url}` },
        { title: "480p Video", "description":"480p quality download",id: prefix + `videodl480 ${result.url}` },
        { title: "1080p Video","description":"1080p quality download", id: prefix + `videodl1080 ${result.url}` }
      ]
    },
    {
      title: "Document Type 📁",
      rows: [
        { title: "144p Document","description":"144p quality download", id: prefix + `docdl144 ${result.url}&${result.thumbnail}&${result.title}` },
        { title: "240p Document", "description":"240p quality download",id: prefix + `docdl240 ${result.url}&${result.thumbnail}&${result.title}` },
        { title: "360p Document","description":"360p quality download", id: prefix + `docdl360 ${result.url}&${result.thumbnail}&${result.title}` },
		 { title: "480p Document", "description":"480p quality download",id: prefix + `docdl480 ${result.url}&${result.thumbnail}&${result.title}` },
        { title: "720p Document", "description":"720p quality download",id: prefix + `docdl720 ${result.url}&${result.thumbnail}&${result.title}` },
        { title: "1080p Document","description":"1080p quality download", id: prefix + `docdl1080 ${result.url}&${result.thumbnail}&${result.title}` }
      ]
    }
  ]
};

    // Sending logic based on config.BUTTON
    if (config.BUTTON === "true") {
      return await conn.sendMessage(from, {
        image: {url: result.thumbnail },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "Video quality list",
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
      }, { quoted: mek });

} else if (config.BUTTON === 'false') {
   await conn.listMessage4(from, listMessage,mek)
}

	

} catch (e) {
reply('*Error !!*')
l(e)
}
})

cmd({
    pattern: "docdl144",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*Need a YouTube URL!*');

        const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=144`);

    
        const videoUrl = prog.result.download;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`144p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error(e);
        await reply('*An error occurred while processing your request.*');
    }
});



cmd({
    pattern: "docdl240",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*Need a YouTube URL!*');

        const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=240`);

        const videoUrl = prog.url;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`240p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error(e);
        await reply('*An error occurred while processing your request.*');
    }
});



cmd({
    pattern: "docdl360",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*Need a YouTube URL!*');

        const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=360`);

    
        const videoUrl = prog.url;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`360p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error(e);
        await reply('*An error occurred while processing your request.*');
    }
});

cmd({
    pattern: "docdl480",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	        const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=480`);

    
        const videoUrl = prog.url;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`480p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })

cmd({
    pattern: "docdl720",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	        const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=720`);

    
        const videoUrl = prog.url;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`720p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })



cmd({
    pattern: "docdl1080",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	
                 const parts = q.split("&");
        const url = parts[0];
        const thumbUrl = parts[1];
        const title = parts[2] || 'video';

        // Fetch and resize the thumbnail
        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();

        // Resize function must be defined elsewhere in your codebase
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        // Fetch the video download information
        const prog = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${url}&format=1080`);

    
        const videoUrl = prog.url;

        // React with upload emoji
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            jpegThumbnail: resizedBotImg,
            caption: '`1080p`\n' + config?.FOOTER || '',
            mimetype: 'video/mp4',
            fileName: `${prog.result.title || title}.mp4`
        }, { quoted: mek });

        // React with check mark
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })




cmd({
    pattern: "videodl144",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*You must provide a YouTube URL!*');

        const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=144`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`144p`' + `\n\n${config.FOOTER}` || 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error(e);
        await reply('*An error occurred while downloading the video.*');
    }
});




cmd({
    pattern: "videodl240",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

    async (conn, mek, m, { from, q, reply }) => {
        try {
           const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=240`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`240p`' + `\n\n${config.FOOTER}` || 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })



cmd({
    pattern: "videodl360",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

    async (conn, mek, m, { from, q, reply }) => {
        try {
           const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=360`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`360p`' + `\n\n${config.FOOTER}`|| 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })

cmd({
    pattern: "videodl480",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

    async (conn, mek, m, { from, q, reply }) => {
        try {
           const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=480`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`480p`' + `\n\n${config.FOOTER}`|| 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })


cmd({
    pattern: "videodl720",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

    async (conn, mek, m, { from, q, reply }) => {
        try {
          const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=720`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`720p`' + `\n\n${config.FOOTER}`|| 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })



cmd({
    pattern: "videodl1080",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},

    async (conn, mek, m, { from, q, reply }) => {
        try {
           const res = await fetchJson(`https://tharuzz-ofc-api-v3.vercel.app/api/ytdl/yt?url=${q}&format=1080`);
        

     
        const videoUrl = res.result.download;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: res.result.title + '\n`1080p`' + `\n\n${config.FOOTER}`|| 'Downloaded Video'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })




cmd({
    pattern: "mediafire",
    react: "🔥",
    alias: ["mfire","mfdl"],
    category: "download",
    use: '.mediafire < link >',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key }})
if(!q) return await conn.sendMessage(from , { text: '*🔥 Enter mediafire link...*' }, { quoted: mek } ) 
const data = await fetchJson(`https://mfire-dl.vercel.app/mfire?url=${q}`)
let listdata = `*\`🔥 𝙑𝙄𝙎𝙋𝙀𝙍 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀 𝘿𝙊𝙒𝙉𝙇𝙊𝘿𝙀𝙍 🔥\`*

*┌──────────────────╮*
*├ \`🔥 Name\` :* ${data.fileName}
*├ \`⏩ Type\` :* ${data.fileType}
*├ \`📁 Size\` :* ${data.size}
*├ \`📅 Date\` :* ${data.date}
*└──────────────────╯*\n ${config.FOOTER}`

	
reply(listdata)
//if (data.size.includes('GB')) return await conn.sendMessage(from , { text: 'File size is too big...' }, { quoted: mek } )
//if (data.size.includes('MB') && data.size.replace(' MB','') > config.MAX_SIZE) return await conn.sendMessage(from , { text: 'File size is too big...' }, { quoted: mek } )
let sendapk = await conn.sendMessage(from, {
    document: {
        url: data.dl_link
    },
    mimetype: `${data.type}`,
    fileName: `${data.fileName}`,
    caption: ''
}, { quoted: mek });

await conn.sendMessage(from, { react: { text: '📁', key: sendapk.key }})
await conn.sendMessage(from, { react: { text: '✔', key: mek.key }})
} catch (e) {
    reply('ERROR !!')
    console.log(e)
}
})
async function xnxxs(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = [];
      const url = [];
      const desc = [];
      const results = [];
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb').each(function(c, d) {
          url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
        });
      });
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb-under').each(function(c, d) {
          desc.push($(d).find('p.metadata').text());
          $(d).find('a').each(function(e, f) {
            title.push($(f).attr('title'));
          });
        });
      });
      for (let i = 0; i < title.length; i++) {
        results.push({title: title[i], info: desc[i], link: url[i]});
      }
      resolve({status: true, result: results});
    }).catch((err) => reject({status: false, result: err}));
  });
}

cmd({
    pattern: "xnxx",	
    react: '🔎',
    category: "download",
    desc: "xnxx download",
    use: ".xnxx new",
    
    filename: __filename
},
async (conn, m, mek, { from, q, isSudo, isOwner, prefix, isMe, reply }) => {
try{

if( config.XNXX_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
	await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" }, { quoted: mek });

}
if (!q) return reply('🚩 *Please give me words to search*')
let res = await xnxxs(q)
const data = res.result

var srh = [];  
for (var i = 0; i < res.result.length; i++) {
srh.push({
title: res.result[i].title,
description: '',
rowId: prefix + `xnxxdown ${res.result[i].link}}`
});
}

const sections = [{
title: "xnxx results",
rows: srh
}	  
]
const listMessage = {
text: `*_XNXX SEARCH RESULT 🔞_*

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'xnxx results',
buttonText: '*Reply Below Number 🔢*',
sections
}

const caption = `*_XNXX SEARCH RESULT 🔞_*

*\`Input :\`* ${q}`
	
const listButtons = {
  title: "🔞 XNXX Search Results",
  sections: [
    {
      title: "🔍 Search Results",
      rows: res.result.map(video => ({
        title: video.title,
        description: "", // Optional: can add duration or views here
        id: prefix + `xnxxdown ${video.link}`
      }))
    }
  ]
};

 if (config.BUTTON === "true") {
      return await conn.sendMessage(from, {
        image: {url: config.LOGO },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "Video quality list",
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
      }, { quoted: mek });

} else if (config.BUTTON === 'false') {

	
await conn.listMessage(from, listMessage,mek)

 }
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})





async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]};
      resolve({status: true, result: {title, URL, duration, image, videoType, videoWidth, videoHeight, info, files}});
    }).catch((err) => reject({status: false, result: err}));
  });
}

cmd({
    pattern: "xnxxdown",
    alias: ["dlxnxx","xnxxdl"],
    react: '🔞',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
 //if (!isMe) return await reply('🚩 You are not a premium user\nbuy via message to owner!!')
 if (!q) return reply('*Please give me instagram url !!*')
  let res = await xdl(q)
  let title = res.result.title
  await conn.sendMessage(from, { video: { url: res.result.files.high }, caption: title}, { quoted: mek })
} catch (e) {
reply('*Error !!*')
console.log(e)
}
})

cmd({
    pattern: "pornhub",	
    react: '🔎',
    category: "download",
    desc: "xnxx download",
    use: ".xnxx new",
    
    filename: __filename
},
async (conn, m, mek, { from, q, isSudo, isOwner, prefix, isMe, reply }) => {
try{

if( config.XNXX_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
	await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" }, { quoted: mek });

}
if (!q) return reply('🚩 *Please give me words to search*')
let res = await phsearch(q)


var srh = [];  
for (var i = 0; i < res.length; i++) {
srh.push({
title: res[i].title,
description: '',
rowId: prefix + `phinfo ${res[i].link}}`
});
}

const sections = [{
title: "pornhub.com results",
rows: srh
}	  
]
const listMessage = {
text: `*_PORNHUB SEARCH RESULT 🔞_*

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'pornhub.com results',
buttonText: '*Reply Below Number 🔢*',
sections
}
await conn.listMessage(from, listMessage,mek)
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "phinfo",	
    react: '🔞',
     //desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{

let res = await fetchJson(`https://ph-slow-dl.vercel.app/api/analyze?q=${q}`)
let msg = `*\`🔞 𝙑𝙄𝙎𝙋𝙀𝙍 𝙋𝙊𝙍𝙉𝙃𝙐𝘽 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 🔞\`*

*┌──────────────────*
*├ \`❄️ Title\` :* ${res.video_title}
*├ \`⏱️ Time\` :* ${res.analyze_time}
*├ \`🧐 Uploder\` :* ${res.video_uploader}
*├ \`🔗 Url\` :* ${q}
*└──────────────────*`

 
var rows = [];  


  res.format.map((v) => {
	rows.push({
        buttonId: prefix + `phdl ${res.video_cover}±${v.download_url}±${res.video_title}`,
        buttonText: { displayText: `${v.resolution}` },
        type: 1
          }
		 
		  //{buttonId: prefix + 'cdetails ' + q, buttonText: {displayText: 'Details send'}, type: 1}
		 
		 
		 );
        })




  
const buttonMessage = {
 
image: {url: res.video_cover },	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}
return await conn.buttonMessage(from, buttonMessage, mek)
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})



  cmd({
    pattern: "phdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	
           const datae = q.split("±")[0]
const datas = q.split("±")[1]
	const title = q.split("±")[2]

	
 

	await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
	
           
	await conn.sendMessage(from, { document:{ url: datas }, caption: config.FOOTER , mimetype: 'video/mp4' , caption: wm, fileName: `${title}` }, { quoted: mek });
	await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })


cmd({
    pattern: "spotify",	
    react: '🎶',
    category: "download",
    desc: "spotify search",
    use: ".spotify lelena",
    
    filename: __filename
},
async (conn, m, mek, { from, q, isSudo, isOwner, prefix, isMe, reply }) => {
try{


if (!q) return reply('🚩 *Please give me words to search*')
let res = await fetchJson(`https://darksadasyt-spotify-search.vercel.app/search?query=${q}`)


var srh = [];  
for (var i = 0; i < res.length; i++) {
srh.push({
title: res[i].song_name,
description: '',
rowId: prefix + `spotifydl ${res[i].track_url}`
});
}

const sections = [{
title: "open.spotify.com",
rows: srh
}	  
]
const listMessage = {
text: `*_SPOTIFY SEARCH RESULT 🎶_*

*\`Input :\`* ${q}`,
	
footer: config.FOOTER,
title: 'open.spotify.com',
buttonText: '*Reply Below Number 🔢*',
sections
}
await conn.listMessage(from, listMessage,mek)
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "spotifydl",
    alias: ["ytsong"],
    use: '.song lelena',
    react: "🎧",
    desc: "Download songs",
    filename: __filename
},

async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return await reply('*Please enter a query or a URL!*');

        const response = await axios.get(`https://phinfo.vercel.app/download?songId=${encodeURIComponent(q)}`);
        const data = response.data.data;

        if (!data || !data.downloadLink) {
            return await reply("❌ Could not retrieve the song. Please check your query.");
        }

        let caption = `*\`🎼 🅅🄸🅂🄿🄴🅁 🅂🄿🄾🅃🄸🄵🅈 🄳🄾🅆🄽🄻🄾🄰🄳🄴🅁 🎼\`*
*┌──────────────────╮*
*├ \`🎶 Title:\`* ${data.title}
*├ \`🧑‍🎤 Artist:\`* ${data.artist}
*├ \`💽 Album:\`* ${data.album}
*├ \`📅 Date:\`* ${data.releaseDate}
*├ \`🔗 URL:\`* ${q}
*└──────────────────╯*`;

        const buttons = [
            {
                buttonId: prefix + 'spa ' + data.downloadLink,
                buttonText: { displayText: 'Audio Type 🎶' },
                type: 1
            },
            {
                buttonId: prefix + `spad ${data.downloadLink}&${data.cover}&${data.title}`,
                buttonText: { displayText: 'Document Type 📂' },
                type: 1
            }
        ];

        const buttonMessage = {
            image: { url: data.cover },
            caption: caption,
            footer: config.FOOTER,
            buttons: buttons,
            headerType: 4
        };

        await conn.buttonMessage(from, buttonMessage, mek);

    } catch (e) {
        console.error('Error occurred:', e);
        await reply('❌ An error occurred while processing your request. Please try again later.');
    }
});



cmd({
    pattern: "spa",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) return await reply('*Need a youtube url!*');

          try {

		

await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
		    
		        
                await conn.sendMessage(from, { audio: { url: q }, mimetype: 'audio/mpeg' }, { quoted: mek });
               
                await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
           } catch (e) {
  
  console.log(e)
}
})

 cmd({
    pattern: "spad",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
try {
           if (!q) return await reply('*Need a youtube url!*')
	
           const datae = q.split("&")[0]
const datas = q.split("&")[1]
	const title = q.split("&")[2]
  const botimgUrl = datas;
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        
        // Resize image to 200x200 before sending
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);
	
     


	
	await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
	
           
	await conn.sendMessage(from, { document:{ url: datae }, jpegThumbnail: resizedBotImg, caption: config.FOOTER , mimetype: 'audio/mpeg' , caption: wm, fileName: `${title}` }, { quoted: mek });
	await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
} catch (e) {
	       console.log(e)
        }
    })
cmd({
    pattern: "soundcloud",	
    react: '🎶',
    category: "download",
    desc: "soundcloud search",
    use: ".soundcloud lelena",
    
    filename: __filename
},
async (conn, m, mek, { from, q, isSudo, isOwner, prefix, isMe, reply }) => {
try{


if (!q) return reply('🚩 *Please give me words to search*')
let res = await fetchJson(`https://api.fgmods.xyz/api/search/soundcloud?text=${q}&apikey=fg_NHnzSf6e`)


var srh = [];  
for (var i = 0; i < res.result.length; i++) {
srh.push({
title: res.result[i].title,
description: '',
rowId: prefix + `sounddl ${res.result[i].url}`
});
}

const sections = [{
title: "soundcloud.com results",
rows: srh
}	  
]
const listMessage = {
text: `*_SOUNDCLOUD SEARCH RESULT 🎶_*

*\`Input :\`* ${q}`,
	
footer: config.FOOTER,
title: 'soundcloud.com results',
buttonText: '*Reply Below Number 🔢*',
sections
}
await conn.listMessage(from, listMessage,mek)
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})


cmd({
    pattern: "sounddl",
    alias: ["ytsong"],
    use: '.song <query>',
    react: "🎧",
    desc: "Download songs",
    filename: __filename
}, 
async (conn, mek, m, { from, prefix, q, reply }) => {
    try {
        if (!q) return await reply('*❌ Please enter a song name or SoundCloud URL!*');

        // Make the API request
        const apiUrl = `https://darksadasyt-soundcloud-dl.vercel.app/api/fetch-track?q=${encodeURIComponent(q)}`;
        let response;

        try {
            response = await axios.get(apiUrl);
        } catch (apiError) {
            console.error('API request failed:', apiError.message);
            return await reply('❌ The song download server is currently unavailable or returned an error (500). Please try again later.');
        }

        const data = response.data;

        if (!data || !data.url || !data.title || !data.imageURL) {
            return await reply('⚠️ Failed to retrieve valid song data. Please check your query or try again later.');
        }

        const caption = `*\`🎼 VISPER SOUNDCLOUD DOWNLOADER 🎼\`*\n\n*🎶 Title:* ${data.title}\n*🔗 URL:* ${q}`;

        const buttons = [
            {
                buttonId: prefix + 'spa ' + data.url,
                buttonText: { displayText: 'Audio Type 🎶' },
                type: 1
            },
            {
                buttonId: prefix + `spad ${data.url}&${data.imageURL}&${data.title}`,
                buttonText: { displayText: 'Document Type 📂' },
                type: 1
            }
        ];

        const buttonMessage = {
            image: { url: data.imageURL },
            caption: caption,
            footer: config.FOOTER || 'VISPER BOT',
            buttons: buttons,
            headerType: 4
        };


if (config.BUTTON === 'true') {
conn.sendMessage(from, {
    image: { url: data.imageURL },
    caption: caption,
    footer: config.FOOTER,
    buttons: [
        {
            buttonId: prefix + 'spa ' + data.url,
            buttonText: { displayText: "Audio Type 🎶" },
            type: 1
        },
        {
            buttonId: prefix + `spad ${data.url}&${data.imageURL}&${data.title}`,
            buttonText: { displayText: "Document Type 📂" },
            type: 1
        }
    ],
    headerType: 4 ,
   
}, { quoted: mek });


} else if (config.BUTTON === 'false') {
	    
        await conn.buttonMessage(from, buttonMessage, mek);
}

    } catch (e) {
        console.error('Unexpected error:', e);
        await reply('❌ An unexpected error occurred. Please try again later.');
    }
});




cmd({
    pattern: "automp3",
    react: "🎵",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        if (!q) return await reply('🔍 Please enter a search keyword.');

        try {
            const search = await yts(q);
            const results = search.videos;

            if (!results || results.length === 0) {
                return await reply('❌ No songs found.');
            }

            await reply(`🎶 Search complete. Found ${results.length} songs. Sending the first now. Others will follow every 40 seconds.`);

            let first = true;

            for (const result of results) {
                const caption = `🎵 *Now Playing:* ${result.title}
\`👁️ *Views:*\` ${result.views}
\`⏱️ *Duration:*\` ${result.duration}

_🎧 Powered by VISPER Music_`;

                // Send thumbnail using buffer
                try {
                    const imgBuffer = await (await fetch(result.thumbnail)).buffer();
                    await safeSend(conn, from, {
                        image: imgBuffer,
                        caption
                    });
                } catch (e) {
                    console.error("❌ Error sending thumbnail:", e);
                }

                try {
                    const mp3 = await fetchWithRetry(`https://yt-five-tau.vercel.app/download?q=${encodeURIComponent(result.url)}&format=mp3`);
                    const audioUrl = mp3.result.download;

                    const size = await getFileSizeInMB(audioUrl);
                    if (size > 16) {
                        await conn.sendMessage(from, {
                            text: `⚠️ Skipping "${result.title}" — file size ${size.toFixed(2)} MB exceeds limit.`
                        });
                        continue;
                    }

                    const audioBuffer = await (await fetch(audioUrl)).buffer();

                    await safeSend(conn, from, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: true
                    }, { quoted: mek });

                } catch (error) {
                    console.error(`❌ MP3 fetch/send failed: ${result.title}`, error);
                    await conn.sendMessage(from, {
                        text: `⚠️ Could not download "${result.title}".`
                    });
                }

                if (first) {
                    first = false;
                    continue;
                }

                await conn.sendMessage(from, {
                    text: `⏳ Waiting 40 seconds for the next song...`
                });
                await new Promise(r => setTimeout(r, 40 * 1000));
            }

            await conn.sendMessage(from, {
                text: `✅ Done! Sent ${results.length} songs.`
            });

        } catch (err) {
            console.error('🛑 Error in automp3 command:', err);
            await reply('⚠️ Something went wrong. Try again later.');
        }
    }
);

// 🛠️ Retry fetchJson with node-fetch
async function fetchWithRetry(url, retries = 3, delay = 3000) {
    for (let i = 1; i <= retries; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
            return await res.json();
        } catch (err) {
            console.log(`⚠️ Retry ${i}/${retries} failed:`, err.message || err);
            if (i < retries) await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('🚫 All retries failed for URL: ' + url);
}

// 🛠️ Get content-length in MB
async function getFileSizeInMB(url) {
    try {
        const res = await axios.head(url);
        const size = res.headers['content-length'];
        return size ? parseFloat(size) / (1024 * 1024) : 0;
    } catch {
        return 0;
    }
}

// 🛠️ Stable media send with retries
async function safeSend(conn, jid, msg, opts = {}, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            return await conn.sendMessage(jid, msg, opts);
        } catch (e) {
            console.log(`📤 Upload try ${i + 1} failed`, e.message || e);
            if (i === retries - 1) throw e;
        }
    }
}
