const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const { downloadMediaMessage } = require("../lib/msg")
const config = require('../config')
const fs = require('fs')
const got = require("got")
const axios = require('axios');
const googleTTS = require("google-tts-api");
const { tmpdir } = require("os")
const translate = require('translate-google-api'); 
let { unlink } = require("fs/promises")
const { catboxUploader } = require('../lib/catbox');
const Crypto = require("crypto")
const { promisify } = require("util")
const FormData = require("form-data")
const stream = require("stream")
const pipeline = promisify(stream.pipeline)
const { image2url } = require('darksadasyt-imgbb-scraper')
const fileType = require("file-type");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
var imgmsg =''
if(config.LANG === 'SI') imgmsg = '*ඡායාරූපයකට mention දෙන්න !*'
else imgmsg = "*Reply to a photo !*"
var descg = ''
if(config.LANG === 'SI') descg = "එය ඔබගේ mention දුන් ඡායාරූපය background remove කරයි."
else descg = "It remove background your replied photo."
var cant = ''
if(config.LANG === 'SI') cant = "මට මෙම රූපයේ පසුබිම ඉවත් කළ නොහැක."
else cant = "I can't remove background on this image."
var JavaScriptObfuscator = require('javascript-obfuscator');

async function videoToWebp (media) {

    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3')
}

function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus')
}

function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4')
}

// --- Catbox Uploader Function ---
const catboxUploaderr = async (filePath) => {
    try {
        const url = 'https://catbox.moe/user/api.php';
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(filePath));

        const response = await axios.post(url, form, {
            headers: { ...form.getHeaders() },
        });

        return { status: true, result: { url: response.data } };
    } catch (e) {
        return { status: false, error: e.message };
    }
};

// --- Command Implementation ---
cmd({
    pattern: "img2url",
    react: "🔗",
    alias: ["tourl", "imgurl", "telegraph", "imgtourl"],
    desc: "Convert image to URL",
    category: "convert",
    use: ".img2url <reply image>",
    filename: __filename
}, async (conn, mek, m, { reply, l }) => {
    try {
        const isQuotedImage = m.quoted
            ? ((m.quoted.type === "imageMessage") ||
               (m.quoted.type === "viewOnceMessage" && m.quoted.msg.type === "imageMessage"))
            : false;

        const isImage = (m.type === "imageMessage") || isQuotedImage;

        if (isImage) {
            // 📌 Download buffer
            const buff = isQuotedImage ? await m.quoted.download() : await m.download();

            // 📌 Create Temp File Path
            // file-type awula nisa api default .jpg kiyala gamu (Catbox auto detect karanawa)
            const filePath = path.join(__dirname, `temp_${Date.now()}.jpg`);
            
            // Buffer eka save karaganna
            await fs.promises.writeFile(filePath, buff);

            // 📌 Upload to Catbox
            const result = await catboxUploaderr(filePath);

            // 📌 Delete temp file
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath).catch(() => {});
            }

            if (!result.status) {
                return reply("❌ Upload failed: " + result.error);
            }

            return reply(`*✅ Here is the image URL:*\n\n${result.result.url}`);
        } else {
            return reply("📷 Please reply to an image or send an image.");
        }
    } catch (e) {
        reply("❌ Sorry, I couldn't process the image.");
        l(e);
    }
});

cmd({
    pattern: "sticker",
    react: "🔮",
    alias: ["s","stic"],
    desc: "Convert to sticker",
    category: "convert",
    use: '.sticker <Reply to image>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    const isQuotedViewOnce = m.quoted ? (m.quoted.type === 'viewOnceMessage') : false
    const isQuotedImage = m.quoted ? ((m.quoted.type === 'imageMessage') || (isQuotedViewOnce ? (m.quoted.msg.type === 'imageMessage') : false)) : false
    const isQuotedVideo = m.quoted ? ((m.quoted.type === 'videoMessage') || (isQuotedViewOnce ? (m.quoted.msg.type === 'videoMessage') : false)) : false
    const isQuotedSticker = m.quoted ? (m.quoted.type === 'stickerMessage') : false
     if ((m.type === 'imageMessage') || isQuotedImage) {
      var nameJpg = getRandom('')
      isQuotedImage ? await m.quoted.download(nameJpg) : await m.download(nameJpg)
    let sticker = new Sticker(nameJpg + '.jpg', {
      pack: pushname, // The pack name
      author: '©VISPER-MD', // The author name
      type: q.includes("--crop" || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
      categories: ["🤩", "🎉"], // The sticker category
      id: "12345", // The sticker id
      quality: 75, // The quality of the output file
      background: "transparent", // The sticker background color (only for full stickers)
  });
  const buffer = await sticker.toBuffer();
  return conn.sendMessage(from, {sticker: buffer}, {quoted: mek })
}  else if ( isQuotedSticker ) { 

    var nameWebp = getRandom('')
    await m.quoted.download(nameWebp)
  let sticker = new Sticker(nameWebp + '.webp', {
    pack: pushname, // The pack name
    author: '', // The author name
    type: q.includes("--crop" || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
    categories: ["🤩", "🎉"], // The sticker category
    id: "12345", // The sticker id
    quality: 75, // The quality of the output file
    background: "transparent", // The sticker background color (only for full stickers)
});
const buffer = await sticker.toBuffer();
return conn.sendMessage(from, {sticker: buffer}, {quoted: mek })
}else return await  reply(imgmsg)
} catch (e) {
reply('*Error !!*')
l(e)
}
})
//removebg
cmd({
    pattern: "removebg",
    react: "🔮",
    alias: ["rmbg"],
    desc: "Removes background from an image.",
    category: "convert",
    use: '.removebg <Reply to image>',
    filename: __filename
},
async(conn, mek, m, { from, l, quoted, prefix, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // 📌 Quoted image එකක්ද නැද්ද යන්න පරීක්ෂා කිරීම
        const isQuotedViewOnce = m.quoted ? (m.quoted.type === 'viewOnceMessage') : false
        const isQuotedImage = m.quoted ? ((m.quoted.type === 'imageMessage') || (isQuotedViewOnce ? (m.quoted.msg.type === 'imageMessage') : false)) : false
        
        if ((m.type === 'imageMessage') || isQuotedImage) {
            
            // 📌 Image එක download කර buffer එකක් ලබා ගැනීම
            let buff = isQuotedImage ? await m.quoted.download() : await m.download()
            
            // 📌 Form Data සකස් කිරීම (API එකට යැවීමට)
            const form = new FormData();
            form.append("image_file", buff, {
                filename: 'image.jpg',
                contentType: 'image/jpeg'
            });
            form.append("size", "auto");

            // 📌 Remove.bg API එකට request එක යැවීම
            // සටහන: API Key එක 'fLYByZwbPqdyqkdKK6zcBN9H' වලංගු විය යුතුය.
            const response = await got.post("https://api.remove.bg/v1.0/removebg", {
                body: form,
                headers: {
                    "X-Api-Key": 'fLYByZwbPqdyqkdKK6zcBN9H', // මෙතනට ඔයාගේ වැඩ කරන API Key එක දාන්න
                },
                responseType: 'buffer'
            });

            // 📌 ලැබෙන output එක save කිරීම
            const namePng = getRandom('.png');
            const outputPath = path.join(__dirname, namePng);
            await fs.promises.writeFile(outputPath, response.body);

            let dat = `*🌆 VISPER-MD BACKGROUND REMOVER 🌆*`

            const buttons = [
                { buttonId: prefix + 'rbgi ' + namePng, buttonText: { displayText: 'IMAGE' }, type: 1 },
                { buttonId: prefix + 'rebgs ' + namePng, buttonText: { displayText: 'STICKER' }, type: 1 },
                { buttonId: prefix + 'rbgd ' + namePng, buttonText: { displayText: 'DOCUMENT' }, type: 1 }
            ]

            const buttonMessage = {
                image: response.body, // Background එක අයින් කරපු image එක කෙලින්ම පෙන්වයි
                caption: dat,
                footer: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴠɪsᴘᴇʀ-ᴍᴅ",
                buttons: buttons,
                headerType: 4
            }

            return await conn.buttonMessage(from, buttonMessage, mek)

        } else {
            return await reply("ඔබ background එක ඉවත් කිරීමට අවශ්‍ය image එකක් reply කරන්න.")
        }

    } catch (e) {
        l(e)
        // API key එකේ limit ඉවර වුණොත් හෝ වෙනත් error එකක් ආවොත්
        if (e.response && e.response.status === 402) {
            return reply("API Limit එක ඉවරයි! කරුණාකර නව API Key එකක් භාවිතා කරන්න.")
        }
        return reply("Error එකක් සිදු වුණා. කරුණාකර පසුව උත්සාහ කරන්න.")
    }
})

// --- IMAGE SUB-COMMAND ---
cmd({
    pattern: "rbgi",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("File reference missing.");
        const filePath = path.join(__dirname, q); // Combine directory with filename
        
        await conn.sendMessage(from, { react: { text: '📥', key: mek.key }});
        await conn.sendMessage(from, { 
            image: fs.readFileSync(filePath), 
            caption: config.FOOTER 
        }, { quoted: mek });
        
        // Optional: Delete file after sending to save space
        // fs.unlinkSync(filePath); 
        
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch (e) {
        console.error(e);
        reply('*FILE NOT FOUND OR EXPIRED*');
    }
})

// --- STICKER SUB-COMMAND ---
cmd({
    pattern: "rebgs",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, { from, q, pushname, reply }) => {
    try {
        const filePath = path.join(__dirname, q);
        await conn.sendMessage(from, { react: { text: '📥', key: mek.key }});
        
        let sticker = new Sticker(filePath, {
            pack: pushname,
            author: 'ɴᴀᴅᴇᴇɴ ᴘᴏᴏʀɴᴀ•',
            type: StickerTypes.FULL,
            quality: 75,
        });
        
        const buffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch (e) {
        reply('*ERROR BUILDING STICKER*');
    }
})

cmd({
    pattern: "rbgd",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // q contains the filename (e.g., '7682.png')
        if (!q) return reply("File reference missing.");

        // Join the directory path to locate the file correctly
        const filePath = path.join(__dirname, q);

        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        // Send as a Document (PNG format to keep transparency)
        await conn.sendMessage(from, { 
            document: fs.readFileSync(filePath), 
            mimetype: 'image/png', 
            fileName: 'Visper-Rmbg.png',
            caption: config.FOOTER 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

        // Optional: Delete the file after sending to keep the server clean
        // fs.unlinkSync(filePath);

    } catch (e) {
        l(e);
        reply('*ERROR: File could not be found or processed.*');
    }
})




// ffmpeg පද්ධතියට හඳුන්වා දීම මෙතැනදී සිදු වේ
ffmpeg.setFfmpegPath(ffmpegPath);

cmd({
    pattern: "attp",
    react: "✨",
    alias: ["texttogif"],
    desc: "Text to convert sticker",
    category: "convert",
    use: '.attp HI',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if(!q) return await reply("කරුණාකර වචනයක් ඇතුළත් කරන්න (Ex: .attp Hello)")
        
        let bufff = await getBuffer("https://api-fix.onrender.com/api/maker/attp?text=" + encodeURIComponent(q))
        
        // videoToWebp function එක ඇතුළත ffmpeg භාවිතා වන නිසා ඉහත setFfmpegPath එක අනිවාර්ය වේ.
        let stickerBuff = await videoToWebp(bufff)
        
        await conn.sendMessage(from, { sticker: stickerBuff }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply("Error occurred while creating sticker.")
    }
})
//sticker2img
cmd(
  {
    pattern: "toimg",
    alias: ["img", "photo"],
    react: "🎆",
    desc: "Convert a sticker to an image",
    category: "convert",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      // Ensure the message contains a sticker to convert
      if (!quoted || quoted.stickerMessage == null) {
        return reply("Please reply to a sticker to convert it to an image.");
      }

      // Download the sticker from the quoted message
      const stickerBuffer = await downloadMediaMessage(quoted, "stickerInput");
      if (!stickerBuffer)
        return reply("Failed to download the sticker. Try again!");

      // Convert the sticker buffer to an image (using Sticker class)
      const sticker = new Sticker(stickerBuffer, {
        pack: "@VISPER-MD",
        author: "",
        type: "FULL", // This may not be needed, but ensures we're using the full sticker format
        quality: 100, // Quality of the output image (0-100)
      });

      // Get the image buffer
      const imageBuffer = await sticker.toBuffer({ format: "image/jpeg" });

      // Send the image as a response
      await robin.sendMessage(
        from,
        {
          image: imageBuffer,
          caption: "*✅Here is your converted image!*\n\n" + config.FOOTER,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`Error: ${e.message || e}`);
    }
  }
);
cmd({
            pattern: "tts",
            react: "❄️",
            desc: "text to speech.",
            category: "convert",
            filename: __filename,
            use: '.tts hi',
        },
        async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try{
          if (!q) return m.reply('Please give me Sentence to change into audio.')
            let texttts = q
            const ttsurl = googleTTS.getAudioUrl(texttts, {
                lang: "en",
                slow: false,
                host: "https://translate.google.com",
            });
            return conn.sendMessage( m.chat, {
                audio: {
                    url: ttsurl,
                },
                mimetype: "audio/mpeg",
                fileName: `ttsCitelVoid.m4a`,
            }, {
                quoted: mek,
            });

                
} catch (e) {
reply('*Error !!*')
l(e)
}
});

            
cmd({
    pattern: "toptt",
    react: "🔊",
    alias: ["toaudio","tomp3"],
    desc: "convert to audio",
    category: "convert",
    use: '.toptt <Reply to video>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    let isquotedvid = m.quoted ? (m.quoted.type === 'videoMessage') : m ? (m.type === 'videoMessage') : false
    if(!isquotedvid) return await reply()
    let media = m.quoted ? await m.quoted.download() : await m.download()
    let auddio = await toPTT(media, 'mp4')
    let senda =  await conn.sendMessage(m.chat, {audio: auddio.options, mimetype:'audio/mpeg'}, {quoted:m})
    await conn.sendMessage(from, { react: { text: '🎼', key: senda.key }})
} catch (e) {
reply('*Error !!*')
l(e)
}
})       

cmd({
    pattern: "boom",
    desc: "forward msgs",
    alias: ["bbb"],
    category: "convert",
    use: '.boom <jid> & <count>',
    filename: __filename
},

async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {


	
if (!q || !m.quoted) {
reply("*Give me message ❌*")
}


const data = q.split(" & ")[0] 
const datas = q.split(" & ")[1]   
	
let i = 0
const end = datas


let p;
let message = {}

            message.key = mek.quoted?.fakeObj?.key;

            if (mek.quoted?.documentWithCaptionMessage?.message?.documentMessage) {
            
		let mime = mek.quoted.documentWithCaptionMessage.message.documentMessage.mimetype

const mimeType = require('mime-types');
let ext = mimeType.extension(mime);		    

                mek.quoted.documentWithCaptionMessage.message.documentMessage.fileName = (p ? p : mek.quoted.documentWithCaptionMessage.message.documentMessage.caption) + "." + ext;
            }

            message.message = mek.quoted;

while (i < end) {
const mass =  await conn.forwardMessage(data, message, false)
i++
}
	
return reply(`*🔀 Boom sender to:*\n\n ${data}`)
            
})


cmd({
    pattern: "readmore",
    desc: "Readmore message",
    category: "convert",
    use: '.readmore < text >',
    react: "📝",
    filename: __filename
}, async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender
}) => {
    try {
        // Get the message text after the command (.readmore text)
        let readmoreText = q ? q : "No text provided";

        // Create the "Readmore" effect by adding a special character to split the text
        let readmore = "\u200B".repeat(4000); // This creates a large gap between text

        // Full message to send
        let replyText = `${readmore}${readmoreText}`;

        // Send the message with the "Readmore" functionality
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

        // React to the message
        await conn.sendMessage(from, { react: { text: "", key: mek.key } });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "jsobfus",
    desc: "Js code obfus.",
    alias: ["encript", "obfus"],
    react: "🫧",
    use: '.jsobfus js code',
    category: "convert",
    filename: __filename
},
async (conn, mek, m, { from, q, args, reply }) => {

 try {
var obfuscationResult = JavaScriptObfuscator.obfuscate(q)

    reply(obfuscationResult.getObfuscatedCode())

} catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "translate",
    alias: ["trt"],
    react: "🌐",
    desc: "Translate text to a specified language",
    category: "convert",
    use: '.translate <text> to <language>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        const [text, lang] = q.split(" to ");
        if (!text || !lang) return await reply(".trt How are you to si");

        const translatedText = await translate(text, { to: lang });
        await reply(`*⏩ Translated Text*\n\n${translatedText}`);

    } catch (error) {
        console.error(error);
        reply('An error occurred while translating the text. Please try again later.');
    }
});
cmd({
    pattern: "gitclone",
    alias: ["gitdl"],
    react: '💫',
    desc: "Download git repos",
    category: "convert",
    use: '.gitclone <repo link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
      if (!q) return await  reply(needus)
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      let linknya = q
      if (!regex1.test(linknya)) return reply("🚩*Please Give Me Valid GitHub Repo Link!*");
      let [, user, repo] = q.match(regex1) || []
      repo = repo.replace(/.git$/, '')
      let url = `https://api.github.com/repos/${user}/${repo}/zipball`
      let filename = (await fetch(url, {
         method: 'HEAD'
      })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
      let wm = config.FOOTER
      await conn.sendMessage(from, { document: { url: url }, mimetype: 'application/zip', fileName: filename, caption: wm}, { quoted: mek })
} catch (e) {
reply(cantf)
console.log(e)
}
})

cmd({
    pattern: "npm",
    desc: "Search for a package on npm.",
    react: "📦",
    use: '.npm < name >',
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (!args.length) return reply("Please provide the name of the npm package you want to search for. Example: !npm express");
    const packageName = args.join(" ");
    const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
    try {
               
        // Fetch package details from npm registry
        let response = await fetch(url);
        if (!response.ok) throw new Error("Package not found or an error occurred.");
        let packageData = await response.json();
        // Prepare response details
        const latestVersion = packageData["dist-tags"].latest;
        const description = packageData.description || "No description available.";
        const homepage = packageData.homepage || "No homepage available.";
        const npmUrl = `https://www.npmjs.com/package/${packageName}`;
        const author = packageData.author ? packageData.author.name || "Unknown" : "Unknown";
        const license = packageData.license || "Unknown";
        const repository = packageData.repository ? packageData.repository.url || "Not available" : "Not available";
        const keywords = packageData.keywords ? packageData.keywords.join(", ") : "No keywords provided";
        // Send the package details as a reply (without image)
        let replyText = `
*\`💃 VISPER NPM SEARCH 💃\`*

*┌──────────────────*
*├ 🦑 Npm name :* ${packageName}
*├ 💨 Description :* ${description}
*├ ⏩ latest version :* ${latestVersion}
*├ 📄 License :* ${license}
*├ 👨‍🔧 Repostory :* ${repository}
*├ 🔗 Url :* ${npmUrl}
*└──────────────────*`
        await conn.sendMessage(from, { text: replyText }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});
//
cmd({
    pattern: "ss",
    alias: ["webss"],
    react: "💡",
    desc: "web screenshot",
    category: "convert",
    use: '.ss <query>',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide a search query!");

        const response = await axios.get(`https://api.pikwy.com/?tkn=125&d=3000&u=${encodeURIComponent(q)}&fs=0&w=1280&h=1200&s=100&z=100&f=jpg&rt=jweb`);

        await conn.sendMessage(from, 
            { 
                image: { url: response.data.iurl }, 
                caption: config.FOOTER 
            }, 
            { quoted: mek }
        );

    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});


cmd({
    pattern: "vv",
    react: "🥱",
    alias: ["retrive", "viewonce"],
    desc: "Fetch and resend a ViewOnce message content (image/video/voice).",
    category: "owner",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("Please reply to a ViewOnce message.");

        const mime = m.quoted.type;
        let ext, mediaType;
        
        if (mime === "imageMessage") {
            ext = "jpg";
            mediaType = "image";
        } else if (mime === "videoMessage") {
            ext = "mp4";
            mediaType = "video";
        } else if (mime === "audioMessage") {
            ext = "mp3";
            mediaType = "audio";
        } else {
            return reply("Please reply to an image, video, or audio message 🔥.");
        }

        var buffer = await m.quoted.download();
        var filePath = `${Date.now()}.${ext}`;

        fs.writeFileSync(filePath, buffer); 

        let mediaObj = {};
        mediaObj[mediaType] = fs.readFileSync(filePath);

        await conn.sendMessage(m.chat, mediaObj);

        fs.unlinkSync(filePath);

    } catch (e) {
        console.log("Error:", e);
        reply("An error occurred while fetching the ViewOnce message.", e);
    }
});
