const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios');
const sharp = require('sharp');
const Seedr = require("seedr");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { Buffer } = require('buffer'); 
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fileType = require("file-type")
const l = console.log
const https = require("https")
const { URL } = require('url');
const { sizeFormatter} = require('human-readable');
const key = `82406ca340409d44`


cmd({
pattern: "mv",
react: "🔎",
alias: ["movie", "film", "cinema"],
desc: "all movie search",
category: "movie",
use: '.movie',
filename: __filename
},
async (conn, mek, m, {
from, prefix, l, quoted, q,
isPre, isSudo, isOwner, isMe, reply
}) => {
try {
const pr = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;
const isFree = pr.mvfree === "true";

if (!isFree && !isMe && !isPre) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
return await conn.sendMessage(from, {
text: "*`You are not a premium user⚠️`*\n\n" +
"*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
"_Price : 1000 LKR ✔️_\n\n" +
"*👨‍💻Contact us : 0778500326 , 0716769285*"
}, { quoted: mek });
}

    if (config.MV_BLOCK === "true" && !isMe && !isSudo && !isOwner) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*"
      }, { quoted: mek });
    }

    if (!q) return await reply('*Enter movie name..🎬*');

    const sources = [
      { name: "CINESUBZ", cmd: "cine" },
      { name: "BAISCOPES", cmd: "baiscopes" },
      { name: "PUPILVIDEO", cmd: "pupilvideo" },
      { name: "DINKA", cmd: "dinka" },
	  { name: "SUBLK", cmd: "sublk" }
	 
    ];


    let imageBuffer;
    try {
      const res = await axios.get('https://nadeen-botzdatabse.vercel.app/VISPER%20HD.png', {
        responseType: 'arraybuffer'
      });
      imageBuffer = Buffer.from(res.data, 'binary');
    } catch {
      imageBuffer = null; 
    }

    const caption = `_*VISPER SEARCH SYSTEM 🎬*_\n\n*\`🔰Input :\`* ${q}\n\n_*🌟 Select your preferred movie download site*_`;

    if (config.BUTTON === "true") {
     
      const listButtons = {
        title: "❯❯ Choose a movie source ❮❮",
        sections: [
          {
            title: "❯❯ Choose a movie source ❮❮",
            rows: sources.map(src => ({
              title: `${src.name} Results 🎬`,
              id: prefix + src.cmd + ' ' + q
            }))
          }
        ]
      };

      return await conn.sendMessage(from, {
        image: imageBuffer || { url: 'https://nadeen-botzdatabse.vercel.app/VISPER%20HD.png' },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "movie_menu_list",
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

    } else {
  
      const buttons = sources.map(src => ({
        buttonId: prefix + src.cmd + ' ' + q,
        buttonText: { displayText: `_${src.name} Results 🍿_` },
        type: 1
      }));

      return await conn.buttonMessage2(from, {
        image: { url: 'https://nadeen-botzdatabse.vercel.app/VISPER%20HD.png' },
        caption,
        footer: config.FOOTER,
        buttons,
        headerType: 4
      }, mek);
    }

  } catch (e) {
    reply('*❌ Error occurred*');
    l(e);
  }
});




cmd({
    pattern: "baiscopes",    
    react: '🔎',
    category: "movie",
    desc: "Baiscopes.lk movie search",
    use: ".baiscopes 2025",
    filename: __filename
},
async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
try {

    // --- Premium & Config Check ---
    const pr = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;
    const isFree = pr.mvfree === "true";

    if (!isFree && !isMe && !isPre) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return await conn.sendMessage(from, {
            text: "*`You are not a premium user⚠️`*\n\n" +
                  "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
                  "_Price : 200 LKR ✔_ \n\n" +
                  "*👨‍💻Contact us : 0778500326 , 0722617699*"
        }, { quoted: mek });
    }

    if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner.*" }, { quoted: mek });
    }

    if (!q) return await reply('*Please provide a movie name! (e.g. .baiscopes Batman)*');

    // --- Fetching Search Results ---
    // මම මෙතනට ඔයා දුන්න අලුත් API එක ඇතුලත් කළා
    let res = await fetchJson(`https://sadaslk-apis.vercel.app/api/v1/movie/baiscopes/search?q=${q}&apiKey=sadasggggg`);

    if (!res || !res.data || res.data.length === 0) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return await conn.sendMessage(from, { text: '*No results found for your search ❌*' }, { quoted: mek });
    }

    var srh = [];  
    for (var i = 0; i < res.data.length; i++) {
        srh.push({
            title: `${res.data[i].title}`,
            description: `Year: ${res.data[i].year || 'N/A'}`,
            rowId: prefix + `bdl ${res.data[i].link}&${res.data[i].imageUrl}` // Download cmd එකට link එක යවනවා
        });
    }

    const sections = [{
        title: "Baiscopes.lk Search Results",
        rows: srh
    }];

    const listMessage = {
        text: `*_BAISCOPES MOVIE SEARCH RESULT 🎬_*\n\n*\`Input :\`* ${q}`,
        footer: config.FOOTER,
        title: 'Baiscopes.lk Results',
        buttonText: '*Select Your Movie 🔢*',
        sections
    };

    await conn.listMessage(from, listMessage, mek);

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching movies!*' }, { quoted: mek });
}
});

cmd({
    pattern: "bdl",    
    react: '🎥',
    desc: "movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, isSudo, isOwner, prefix, reply }) => {
try {
 const datae = q.split("&")[0];
        const datas = q.split("&")[1];
    if (!q) return await reply('*Please provide the movie link!*');

    // API එකට request එක යැවීම (q ලෙස ලැබෙන්නේ search එකෙන් ආපු movie link එකයි)
    let sadas = await fetchJson(`https://sadaslk-apis.vercel.app/api/v1/movie/baiscopes/infodl?q=${datae}&apiKey=sadasggggg`);

    if (!sadas || !sadas.status || !sadas.data) {
        return await conn.sendMessage(from, { text: '🚩 *Error: Could not fetch movie details!*' }, { quoted: mek });
    }

    const movie = sadas.data.movieInfo;
    const dlLinks = sadas.data.downloadLinks;

    let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* _${movie.title || 'N/A'}_

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${movie.releaseDate || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${movie.ratingValue || 'N/A'}_ (${movie.ratingCount} votes)
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${movie.runtime || 'N/A'}_
*🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${movie.country || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${movie.genres ? movie.genres.join(', ') : 'N/A'}
`;

    var rows = [];  

rows.push(
    { buttonId: prefix + 'bdetails ' + `${datae}&${datas}`, buttonText: { displayText: 'Details Card\n' }, type: 1 }
    
);
	

    // Download links බොත්තම් ලෙස එකතු කිරීම
    if (dlLinks && dlLinks.length > 0) {
        dlLinks.map((v) => {
            rows.push({
                buttonId: prefix + `cdl ${v.directLinkUrl}±${movie.title}±${datas}±${v.quality}`,
                buttonText: { displayText: `${v.quality} (${v.size})` },
                type: 1
            });
        });
    } else {
        return await reply("No download links found for this movie.");
    }



    const buttonMessage = {
        image: { url: datas },    
        caption: msg,
        footer: config.FOOTER,
        buttons: rows,
        headerType: 4
    };

    return await conn.buttonMessage(from, buttonMessage, mek);

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek });
}
});


let isUploading = false; // Track upload status



cmd({
    pattern: "cdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }





	
    if (isUploading) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait a while before uploading another one.* ⏳', 
            quoted: mek 
        });
    }

    try {
        isUploading = true; // Set upload in progress

        

        const datae = q.split("±")[0];
        const datas = q.split("±")[1];
        const dat = q.split("±")[2];    
		const dattt = q.split("±")[3];    




if (!datae.includes('https://drive.baiscopeslk')) {
    console.log('Invalid input:', q);
    return await reply('*❗ Sorry, this download url is incorrect please choose another number*');
}
        const mediaUrl = datae;

     

        const botimg = `${dat}`;

       
 await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

       await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

       
 await conn.sendMessage(config.JID || from, { 
            document: { url: mediaUrl },
            caption: `*🎬 Name :* *${datas}*\n\n*\`${dattt}\`*\n\n${config.NAME}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `🎬 ${datas}.mp4`
        });



        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID} ✔*` }, { quoted: mek });

    } catch (error) {
        console.error('Error fetching or sending:', error);
        await conn.sendMessage(from, { text: "*Erro fetching this moment retry now ❗*" }, { quoted: mek });
    } finally {
        isUploading = false; // Reset upload status
    }
});

cmd({
  pattern: "bdetails",
  react: '🎬',
  desc: "Movie details sender",
  filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
  try {
    if (!q) 
      return await reply('⚠️ *Please provide the movie URL!*');
 const [url, imgUrl] = q.split("&");
    // API එකෙන් විස්තර ලබා ගැනීම
    let sadas = await fetchJson(`https://sadaslk-apis.vercel.app/api/v1/movie/baiscopes/infodl?q=${url}&apiKey=sadasggggg`);
    
    if (!sadas || !sadas.status || !sadas.data) {
        return await conn.sendMessage(from, { text: '🚩 *Error: Could not fetch movie details!*' }, { quoted: mek });
    }

    const movie = sadas.data.movieInfo;
    let details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

    // විස්තර පෙළ සැකසීම
    let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${movie.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${movie.releaseDate || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${movie.ratingValue || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${movie.runtime || 'N/A'}_
*🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${movie.country || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${movie.genres ? movie.genres.join(', ') : 'N/A'}

✨ *Follow us:* ${details.chlink}`;

    // Gallery එකේ පළමු රූපය හෝ Poster එක තෝරා ගැනීම
    const displayImg = (movie.galleryImages && movie.galleryImages.length > 0) 
        ? movie.galleryImages[0] 
        : movie.posterUrl;

    // පණිවිඩය යැවීම (config.JID තිබේ නම් එයට, නැතිනම් current chat එකට)
    await conn.sendMessage(config.JID || from, {
      image: { url: imgUrl },
      caption: msg
    });

    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

  } catch (error) {
    console.error('Error:', error);
    await conn.sendMessage(from, '⚠️ *An error occurred while fetching details.*', { quoted: mek });
  }
});





cmd({
  pattern: "cine",
  react: '🔎',
  category: "movie",
  alias: ["cinesubz"],
  desc: "cinesubz.lk movie search",
  use: ".cine 2025",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {

    if (!q) return reply("*❗ Please give a movie name*");

    const api =
      `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?q=${q}&apikey=${key}`;
    const data = (await axios.get(api)).data;

    if (!data?.data?.length)
      return reply("*❌ No results found!*");

    // ================= BUTTON MODE =================
    if (config.BUTTON === "true") {

      const rows = data.data.map(v => {
        let cmdType = v.link.includes("/tvshows/")
          ? "cinetvdl"
          : "cinedl";

        return {
          title: v.title.replace("Sinhala Subtitles", "").trim(),
          id: `${prefix}${cmdType} ±${v.link}±${v.image}±${v.title}`
        };
      });

      const listButtons = {
        title: "🎬 Choose a Movie",
        sections: [{
          title: "Cinesubz Results",
          rows
        }]
      };

      await conn.sendMessage(from, {
        image: { url: config.LOGO },
        caption: `_*CINESUBZ SEARCH RESULTS 🎬*_\n\n*Input:* ${q}`,
        footer: config.FOOTER,
        buttons: [{
          buttonId: "movie_list",
          buttonText: { displayText: "🎥 Select Option" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        headerType: 1,
        viewOnce: true
      }, { quoted: mek });

    }
    // ================= OLD MODE =================
    else {

      let rows = [];
      data.data.forEach(v => {
        let cmdType = v.link.includes("/tvshows/")
          ? "cinetvdl"
          : "cinedl";

        rows.push({
          title: v.title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "").trim(),
          rowId: `${prefix}${cmdType} ±${v.link}±${v.image}±${v.title}`
        });
      });

      await conn.listMessage(from, {
        text: `_*CINESUBZ SEARCH RESULTS 🎬*_\n\n\`🎄Input:\` ${q}`,
        footer: config.FOOTER,
        title: "Cinesubz Results",
        buttonText: "Reply Below Number 🔢",
        sections: [{
          title: "Results",
          rows
        }]
      }, mek);
    }

  } catch (e) {
    console.log(e);
    reply("*Error ❗*");
  }
});



//---------------------------------------------
// CINESUBZ INFO + DL LINKS
//---------------------------------------------
//---------------------------------------------
// CINESUBZ INFO + DL LINKS
//---------------------------------------------
cmd({
  pattern: "cinedl",
  react: "🎥",
  desc: "movie downloader",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {

    if (!q || !q.includes("cinesubz.lk/movies"))
      return reply("*❗ Please use movie link only!*");
console.log(`🧿Input`,q)
    const [title, url, img] = q.split("±");

    const infoAPI =
      `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(url)}&apikey=${key}`;
    const data = (await axios.get(infoAPI)).data;
    const d = data.data;

    const directors =
      (d.directors || "").replace(/Director:?/gi, "").trim();

    let msg =
`*_▫🍿 Title ➽ ${d.title}_*

▫📅 Year ➽ ${d.year}
▫⭐ IMDB ➽ ${d.rating}
▫⏳ Runtime ➽ ${d.duration}
▫🌎 Country ➽ ${d.country}
▫💎 Quality ➽ ${d.quality}
▫🕵️ Director ➽ ${directors}
▫🔉 Language ➽ ${d.tag}
`;

    // ================= BUTTON MODE =================
    if (config.BUTTON === "true") {

      let rows = d.downloads.map(v => ({
        title: `${v.size} (${v.quality})`,
        id: `${prefix}nadeendl ${img}±${v.link}±${d.title}±${v.quality}`
      }));

      rows.unshift({
        title: "📄 Movie Details",
        id: `${prefix}ctdetails ±±${url}±${img}±${d.title}`
      });

      const listButtons = {
        title: "🎬 Choose Option",
        sections: [{
          title: "Available Links",
          rows
        }]
      };

      await conn.sendMessage(from, {
        image: { url: img },
        caption: msg,
        footer: config.FOOTER,
        buttons: [{
          buttonId: "download_list",
          buttonText: { displayText: "⬇️ Download" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        headerType: 1,
        viewOnce: true
      }, { quoted: mek });

    }
    // ================= OLD MODE =================
    else {

      let buttons = [];

      buttons.push({
        buttonId: `${prefix}ctdetails ±±${url}±${img}±${d.title}`,
        buttonText: { displayText: "Movie Details\n" },
        type: 1
      });

      d.downloads.forEach(v => {
        buttons.push({
          buttonId: `${prefix}nadeendl ${img}±${v.link}±${d.title}±${v.quality}`,
          buttonText: { displayText: `${v.size} (${v.quality})`.replace("WEBDL", "")
	     .replace("WEB DL", "")
        .replace("BluRay HD", "") 
	.replace("BluRay SD", "") 
	.replace("BluRay FHD", "") 
	.replace("Telegram BluRay SD", "") 
	.replace("Telegram BluRay HD", "") 
		.replace("Direct BluRay SD", "") 
		.replace("Direct BluRay HD", "") 
		.replace("Direct BluRay FHD", "") 
		.replace("FHD", "") 
		.replace("HD", "") 
		.replace("SD", "") 
		.replace("Telegram BluRay FHD", "") },
          type: 1
        });
      });

      await conn.buttonMessage(from, {
        image: { url: img },
        caption: msg,
        footer: config.FOOTER,
        buttons,
        headerType: 4
      }, mek);
    }

  } catch (e) {
    console.log(e);
    reply("*Error ❗*");
  }
});


// ------------------ CINETVDL ------------------
// ------------------ CINETVDL ------------------
cmd({
  pattern: "cinetvdl",
  react: "📺",
  desc: "TV Show details + season selector",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {

    if (!q || !q.includes("cinesubz.lk/tvshows"))
      return reply("*❗ Please use a valid TV Show link!*");

    console.log("📺 Input:", q);

    const [title, url, img] = q.split("±");

    const infoAPI =
      `https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(url)}`;

    const data = (await axios.get(infoAPI)).data;
    const d = data.result;

    /* ================= DETAILS CARD ================= */

    let detailsMsg =
      `*_▫️️🍀 Tɪᴛʟᴇ ➽ ${d.title}_*\n` +
      `*_▫️️📅 Yᴇᴀʀ ➽ ${d.year}_*\n` +
      `*_▫️️⭐ Iᴍᴅʙ ➽ ${d.imdb}_*\n` +
      `*_▫️️📺 Sᴇᴀsᴏɴs ➽ ${d.seasons.length}_*\n\n` +
      `*_▫️️🧿 Dᴇsᴄʀɪᴘᴛɪᴏɴ ➽_*\n${d.description}`;

    await conn.sendMessage(from, {
      image: { url: img },
      caption: detailsMsg,
      footer: config.FOOTER
    }, { quoted: mek });

    /* ================= SEASON SELECT ================= */

    let msg =
      `📂 *Select a Season Below*\n` +
      `🎬 *${d.title}*`;

    // ===== BUTTON MODE =====
    if (config.BUTTON === "true") {

      const rows = d.seasons.map(s => ({
        title: `Season ${s.season}`,
        id: `${prefix}cinetvep ${img}±${url}±${d.title}±${s.season}`
      }));

      const listButtons = {
        title: "📺 Select Season",
        sections: [{
          title: "Available Seasons",
          rows
        }]
      };

      await conn.sendMessage(from, {
        text: msg,
        footer: config.FOOTER,
        buttons: [{
          buttonId: "season_list",
          buttonText: { displayText: "📂 Open Seasons" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        viewOnce: true
      });

    } 
    // ===== OLD LIST MODE =====
    else {

      let rows = [];
      d.seasons.forEach(s => {
        rows.push({
          title: `Season ${s.season}`,
          rowId: `${prefix}cinetvep ${img}±${url}±${d.title}±${s.season}`
        });
      });

      const listMessage = {
        text: msg,
        footer: config.FOOTER,
        title: "📺 TV Show Seasons",
        buttonText: "Reply Below Number 🔢",
        sections: [{
          title: "Available Seasons",
          rows
        }]
      };

      await conn.listMessage(from, listMessage, mek);
    }

  } catch (e) {
    console.log(e);
    reply("*❌ Error fetching TV show!*");
  }
});

// ------------------ CINETVEP ------------------
// ------------------ CINETVEP ------------------
cmd({
  pattern: "cinetvep",
  react: "📺",
  desc: "Select episodes for a season",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {
    if (!q) return reply("*❗ Missing season data!*");

    const [img, url, title, seasonNumber] = q.split("±");

    const infoAPI =
      `https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(url)}`;

    const data = (await axios.get(infoAPI)).data;
    const d = data.result;

    const season = d.seasons.find(s => s.season == seasonNumber);
    if (!season) return reply("*❌ Season not found!*");

    let msg =
      `🎬 *${title}*\n` +
      `📺 *Season:* ${seasonNumber}\n\n` +
      `📂 *Select Option Below*`;

    // ================= BUTTON MODE =================
    if (config.BUTTON === "true") {

      let rows = [];

      // 🔥 ALL EPISODES OPTION (FIRST)
      rows.push({
        title: "📦 ALL EPISODES",
        id: `${prefix}cineall ${img}±${url}±${title}±${seasonNumber}`
      });

      // 🔹 NORMAL EPISODES
      season.episodes.forEach(ep => {
        rows.push({
          title: `Episode ${ep.episode}`,
          id: `${prefix}cinetvepi ${img}±${ep.url}±${title}±${ep.episode}±${seasonNumber}`
        });
      });

      const listButtons = {
        title: `📺 Episodes – Season ${seasonNumber}`,
        sections: [{
          title: "Available Options",
          rows
        }]
      };

      await conn.sendMessage(from, {
        image: { url: img },
        caption: msg,
        footer: config.FOOTER,
        buttons: [{
          buttonId: "episode_list",
          buttonText: { displayText: "📥 Open List" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        headerType: 1,
        viewOnce: true
      }, { quoted: mek });

    } 
    // ================= OLD MODE =================
    else {

      let rows = [];

      rows.push({
        title: "📦 ALL EPISODES",
        rowId: `${prefix}cineall ${img}±${url}±${title}±${seasonNumber}`
      });

      season.episodes.forEach(ep => {
        rows.push({
          title: `Episode ${ep.episode}`,
          rowId: `${prefix}cinetvepi ${img}±${ep.url}±${title}±${ep.episode}±${seasonNumber}`
        });
      });

      await conn.listMessage(from, {
        text: msg,
        footer: config.FOOTER,
        title: `📺 Episodes – Season ${seasonNumber}`,
        buttonText: "Reply Below Number 🔢",
        sections: [{
          title: "Available Options",
          rows
        }]
      }, mek);
    }

  } catch (e) {
    console.log(e);
    reply("*❌ Error fetching episodes!*");
  }
});


// ------------------ CINETVEPI ------------------
// ------------------ CINETVEPI ------------------
cmd({
  pattern: "cinetvepi",
  react: "📥",
  desc: "TV Episode download links",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {

    if (!q) return reply("*❗ Missing episode data!*");

    console.log("📡 Episode Input:", q);

    const [img, epUrl, title, episodeNumber, season] = q.split("±");

    const api =
      `https://cine-dl-links.vercel.app/api/downLinks?url=${encodeURIComponent(epUrl)}`;

    const data = (await axios.get(api)).data;

    if (!data.download_links || data.download_links.length === 0)
      return reply("*❌ No download links found!*");

    let msg =
      `🎬 *${title}*\n` +
      `📺 *Episode:* ${episodeNumber}\n\n` +
      `⬇️ *Select download quality below*`;

    // ================= BUTTON MODE =================
    if (config.BUTTON === "true") {

      const rows = data.download_links.map(dl => ({
        title: `${dl.quality} (${dl.size})`,
        id: `${prefix}pakatv ${img}±${dl.link}±${title}±${episodeNumber}±${dl.quality}±${season}`
      }));

      const listButtons = {
        title: `📥 Episode ${episodeNumber} Downloads`,
        sections: [{
          title: "Available Links",
          rows
        }]
      };

      await conn.sendMessage(from, {
        image: { url: img },
        caption: msg,
        footer: config.FOOTER,
        buttons: [{
          buttonId: "download_list",
          buttonText: { displayText: "⬇️ Select Download" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        headerType: 1,
        viewOnce: true
      }, { quoted: mek });

    } 
    // ================= OLD MODE =================
    else {

      let rows = [];
      data.download_links.forEach(dl => {
        rows.push({
          title: `${dl.quality} (${dl.size})`,
          rowId: `${prefix}pakatv ${img}±${dl.link}±${title}±${episodeNumber}±${dl.quality}±${season}`
        });
      });

      const listMessage = {
        text: msg,
        footer: config.FOOTER,
        title: `📥 Episode ${episodeNumber}`,
        buttonText: "Reply Below Number 🔢",
        sections: [{
          title: "Available Downloads",
          rows
        }]
      };

      await conn.listMessage(from, listMessage, mek);
    }

  } catch (e) {
    console.log(e);
    reply("*❌ Error fetching episode download links!*");
  }
});




// Variable එක මුලින්ම define කර ගන්න (Global scope එකේ තිබීම වඩාත් සුදුසුයි)
let isUploadingg = false; 

cmd({
    pattern: "nadeendl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply, fetchJson }) => {
    try {
        if (!q) {
            return await reply('*Please provide a direct URL!*');
        }

        if (isUploadingg) {
            return await conn.sendMessage(from, { 
                text: '*A movie is already being uploaded. Please wait a while before uploading another one.* ⏳', 
                quoted: mek 
            });
        }

        let attempts = 0;
        const maxRetries = 5;
        isUploadingg = true;

        const [datae, datas, dat, qa] = q.split("±");
        if (!datae || !datas) {
            isUploadingg = false;
            return await reply('*Invalid URL format!*');
        }

        while (attempts < maxRetries) {
            try {
                // Movie Details Fetching
               const finaldl = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${datae}&apikey=82406ca340409d44`);

    // 1. Check if the response and the nested 'data' property exist
    if (!finaldl?.data?.data?.download) {
        throw new Error("Invalid API response structure or missing download links");
    }

    // 2. Safely find the Mega URL
    const megaUrl = finaldl.data.data.download.find(link => link && link.name === "mega")?.url;

    if (!megaUrl) {
        throw new Error("Mega URL not found in the download list");
    }

                // Mega DL Fetching
                const apiUrl = `https://sadaslk-fast-mega-dl.vercel.app/mega?q=${encodeURIComponent(megaUrl)}`;
                const response = await axios.get(apiUrl);
                const downloadUrl = response.data.result.download;

                if (!downloadUrl) throw new Error("Download link not found from Mega API");

                // Thumbnail handle
                const botimg = dat;
 const botimgResponse = await fetch(botimg);
        const botimgBuffer = await botimgResponse.buffer();
        
        // Resize image to 200x200 before sending
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

                // Send document
                await conn.sendMessage(config.JID || from, { 
                    document: { url: downloadUrl },
                    caption: `*🎬 Name :* *${datas}*\n\n*\`${qa}\`*\n\n${config.NAME}`,
					jpegThumbnail: resizedBotImg,
                    mimetype: "video/mp4",
                    fileName: `🎬 ${datas}.mp4`
                });

                await conn.sendMessage(from, { delete: up_mg.key });
                await conn.sendMessage(from, { react: { text: '☑️', key: mek.key } });

                break; // ✅ Success - loop එකෙන් ඉවත් වේ.

            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error.message);
                if (attempts >= maxRetries) {
                    await conn.sendMessage(from, { text: "*Error fetching at this moment. Please try again later ❗*" }, { quoted: mek });
                }
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        isUploadingg = false; // වැඩේ ඉවර වුනත් නැතත් flag එක reset කරන්න


	
    }
});

let isUploadingz = false;

cmd({
  pattern: "pakatv",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

  if (!q) return reply("*❗ Missing download data!*");
  if (isUploadingz) return reply("*⏳ Another upload is in progress…*");

  try {
    isUploadingz = false;

    console.log(`🤹🏼‍♂️ Final-dl:`, q);

    // q → img ± url ± title ± quality
    const [img, url, title, num, quality, season] = q.split("±");
console.log(`🤹🏼‍♂️ link:`, url);
    // Fetch download list
    const finalAPI =
      `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(url)}&apikey=${key}`;

    const data = (await axios.get(finalAPI)).data;

    const downloads = data?.data?.download;
    if (!downloads) return reply("*❌ No download links found!!!*");

    // ============================================
    // 🔥 SELECT BEST LINK (cloud → pix fallback)
    // ============================================
    let finalLink = null;

    // Remove Telegram links completely
    const filtered = downloads.filter(v => v.name !== "telegram");

    // 1) Try "cloud"
    const cloud = filtered.find(v => v.name === "cloud");
    if (cloud) finalLink = cloud.url;

    // 2) Else try pix
    if (!finalLink) {
      const gdrive = filtered.find(v => v.name === "gdrive");
      const GLink = gdrive.url;
let res = await fg.GDriveDl(GLink.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view'))

if (gdrive) finalLink = res.downloadUrl;
    }

    if (!finalLink)
      return reply("*❌ Valid download link not found!*");

    // Send uploading message
    const upmsg = await conn.sendMessage(from, { text: "*⬆️ Uploading Episode...*" });

    console.log(`link:`, finalLink)
	  const botimgUrl = img;
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        
        // Resize image to 200x200 before sending
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);
	  
    await conn.sendMessage(config.JID || from, {
      document: { url: finalLink },
      mimetype: "video/mp4",
      caption: `📺 *${title}*\n*[S0${season} | Episode ${num}]*\n\n\`[WEB-DL ${quality}]\`\n\n★━━━━━━━━✩━━━━━━━━★`,
      jpegThumbnail: resizedBotImg,
      fileName: `${title}(${quality}).mp4`
    });

    await conn.sendMessage(from, { delete: upmsg.key });
    await conn.sendMessage(from, {
      react: { text: '✔️', key: mek.key }
    });

  } catch (e) {
    console.log("❌ paka error:", e);
    reply("*❗ Error while downloading*");
  }

  isUploadingz = false;
});

cmd({
  pattern: "cineall",
  react: "📦",
  desc: "Select quality for ALL episodes",
  filename: __filename
},
async (conn, m, mek, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply("*❗ Missing data!*");

    const [img, url, title, season] = q.split("±");

    const rows = [
      { title: "480p", id: `${prefix}cineallq 480p±${q}` },
      { title: "720p", id: `${prefix}cineallq 720p±${q}` },
		 { title: "1080p", id: `${prefix}cineallq 1080p±${q}` }
    ];

    await conn.sendMessage(from, {
      text: `📦 *ALL EPISODES*\n🎬 ${title}\n\`📺 Season ${season}\`\n\n⬇️ *Select Quality*`,
      buttons: [{
        buttonId: "quality",
        buttonText: { displayText: "🎞 Choose Quality" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "Select Quality",
            sections: [{ title: "Available Qualities", rows }]
          })
        }
      }],
      footer: config.FOOTER
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply("*❌ Error showing quality list*");
  }
});


cmd({
  pattern: "cineallq",
  react: "⬇️",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return reply("*❗ Missing quality data!*");

    const [quality, img, url, title, season] = q.split("±");
console.log(`🧬Input:`,q)
	  console.log(`🧬Link:`, url)
    // ✅ SAVE QUALITY
    await input("MV_SIZE", quality);

    await reply(`✅ *Quality:* ${quality}\n📥 *Downloading ALL Episodes...*`);

    // 🔹 GET EPISODE LIST
    const infoAPI =
      `https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(url)}`;
    const data = (await axios.get(infoAPI)).data;
    const d = data.result;
console.log(`👾Input:`,url)
    const seasonData = d.seasons.find(s => s.season == season);
    if (!seasonData) return reply("*❌ Season not found!*");

    // 🔁 EPISODE LOOP
    for (const ep of seasonData.episodes) {
      try {

        // 1️⃣ GET EP DOWNLOAD PAGE URL (epAPI)
        const epAPI =
          `https://cine-dl-links.vercel.app/api/downLinks?url=${encodeURIComponent(ep.url)}`;
        const epRes = (await axios.get(epAPI)).data;
console.log(`🎈Input:`,ep.url)
        if (!epRes.download_links?.length) continue;

        // 🔎 quality match
        const wantQ = quality.replace("p", "");
        const pageLinkObj = epRes.download_links.find(v =>
          v.quality.includes(wantQ)
        );
        if (!pageLinkObj) continue;

        const episodePageURL = pageLinkObj.link;

        // 2️⃣ USE PAKATV FINAL API 🔥
        const finalAPI =
          `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(episodePageURL)}&apikey=${key}`;

        const finalData = (await axios.get(finalAPI)).data;
        const downloads = finalData?.data?.download;
        if (!downloads) continue;

        // 🚫 remove telegram
        const filtered = downloads.filter(v => v.name !== "telegram");

        let finalLink = null;
        const cloud = filtered.find(v => v.name === "cloud");
        if (cloud) finalLink = cloud.url;

        if (!finalLink) {
      const gdrive = filtered.find(v => v.name === "gdrive");
      const GLink = gdrive.url;
let res = await fg.GDriveDl(GLink.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view'))

if (gdrive) finalLink = res.downloadUrl;
    }

        if (!finalLink) continue;

        // 🖼 IMAGE (pakatv style)
        const imgRes = await fetch(img);
        const imgBuffer = await imgRes.buffer();
        const thumb = await resizeImage(imgBuffer, 200, 200);

        // 3️⃣ SEND VIDEO
        await conn.sendMessage(config.JID || from, {
          document: { url: finalLink },
          mimetype: "video/mp4",
          jpegThumbnail: thumb,
          fileName: `${title}-S${season}-E${ep.episode}-${quality}.mp4`,
          caption:
            `📺 *${title}*\n` +
            `*[Season ${season} | Episode ${ep.episode}]*\n\n` +
            `\`[WEB-DL ${quality}]\`\n\n` +
            `${config.NAME}`
        });

        await sleep(2000);

      } catch (epErr) {
        console.log("Episode error:", epErr);
      }
    }

    await reply("✅ *ALL episodes sent successfully!*");

  } catch (e) {
    console.log(e);
    reply("*❌ Error in cineall downloader*");
  }
});


cmd({
    pattern: "cdetails",
    react: '🎬',
    desc: "Movie details sender from Cinesubz",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
    try {
        if (!q) 
            return await reply('⚠️ *Please provide the movie URL!*');

        // URL එක පමණක් ලබා ගැනීම (පැරණි logic එකේ තිබූ split අවශ්‍ය නැතිනම් කෙලින්ම q භාවිතා කළ හැක)
        const movieUrl = q;

        // API එකෙන් විස්තර ලබා ගැනීම
        let sadas = await fetchJson(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${movieUrl}&apikey=82406ca340409d44`);

        if (!sadas || !sadas.status || !sadas.data) {
            return await conn.sendMessage(from, { text: '🚩 *Error: Could not fetch movie details!*' }, { quoted: mek });
        }

        const movie = sadas.data;
        let details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

        // විස්තර පෙළ සැකසීම (නව API Response එකට අනුව)
        let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${movie.title || 'N/A'}_*

*📅 𝗬ᴇᴀʀ ➮* _${movie.year || 'N/A'}_
*💃 𝗥ᴀ𝗧ɪɴɢ ➮* _${movie.rating || 'N/A'}_
*⏰ 𝗗ᴜʀᴀᴛɪ𝗼𝗻 ➮* _${movie.duration || 'N/A'}_
*🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${movie.country || 'N/A'}_
*🎭 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 ➮* _${movie.quality || 'N/A'}_
*🎬 𝗗𝗶𝗿𝗲𝗰𝘁𝗼𝗿 ➮* _${movie.directors || 'N/A'}_

✨ *Follow us:* ${details.chlink}`;

        // පණිවිඩය යැවීම (API එකෙන් එන image එක භාවිතා කරයි)
        await conn.sendMessage(config.JID || from, {
            image: { url: movie.image },
            caption: msg
        });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(from, '⚠️ *An error occurred while fetching details.*', { quoted: mek });
    }
});











cmd({
    pattern: "pupilvideo",    
    react: '🔎',
    category: "movie",
    alias: ["sinhalafilm"],
       desc: "pupilvideo.blogspot.com movie search",
    use: ".pupilvideot ape",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, isPre, isSudo, isOwner, reply }) => {
    try {


const pr = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

// convert string to boolean
const isFree = pr.mvfree === "true";

// if not free and not premium or owner
if (!isFree && !isMe && !isPre) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
    text: "*`You are not a premium user⚠️`*\n\n" +
          "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
          "_Price : 200 LKR ✔️_\n\n" +
          "*👨‍💻Contact us : 0778500326 , 0722617699*"
}, { quoted: mek });

}











	    
	if( config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
	await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" }, { quoted: mek });

}

	    
        if (!q) return await reply('*Please provide a movie name!*');
        
        let url = await fetchJson(`https://darksadas-yt-new-movie-search.vercel.app/?url=${q}`);
        
         if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
        var srh = [];
        for (var i = 0; i < url.data.length; i++) {
            srh.push({
                title: url.data[i].title,
                description: '',
                rowId: prefix + 'newdl ' + url.data[i].link
            });
        }
        
        const sections = [{
            title: "pupilvideo.blogspot.com results",
            rows: srh
        }];
        
        const listMessage = {
            text: `_*🎬PUPILVIDEO MOVIE SEARCH RESULTS 🎬*_

*Movie Search : ${q} 🔎*`,
            footer: config.FOOTER,
            title: 'Search Results 🎬',
            buttonText: '*Reply Below Number 🔢*',
            sections
        };
        
         const caption = `_*🎬PUPILVIDEO MOVIE SEARCH RESULTS 🎬*_

*Movie Search : ${q} 🔎*`;

    // ✅ Button mode toggle
     const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `newdl ${url.data[i].link}` // Make sure your handler understands this format
    };
  });

  // Compose the listButtons object
  const listButtons = {
    title: "Choose a Movie :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO },
    caption: caption,
    footer: config.FOOTER,
    buttons: [

	    
      {
        buttonId: "download_list",
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
    } else {
      await conn.listMessage(from, listMessage,mek)
    }
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred!!*' }, { quoted: mek });
    }
});


cmd({
    pattern: "newdl",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{

 if(!q) return await reply('*please give me text !..*')
let sadas = await fetchJson(`https://darksadasyt-new-mv-site-info.vercel.app/?url=${q}`)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮*  _${sadas.title  || 'N/A'}_

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮*  _${sadas.date  || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.subtitle_author  || 'N/A'}_`

if (sadas.downloadLinks.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push({
      buttonId: prefix + 'dubdet ' + q, buttonText: {displayText: 'Details send'}, type: 1}

);
	
  sadas.downloadLinks.map((v) => {
	rows.push({
        buttonId: prefix + `ndll ${sadas.image}±${v.link}±${sadas.title}`,
        buttonText: { displayText: `${v.title}` },
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.image },	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}





const rowss = sadas.downloadLinks.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `ndll ${sadas.image}±${v.link}±${sadas.title}` // Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download link :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: sadas.image},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'dubdet ' + q,
            buttonText: { displayText: "Details Send" },
            type: 1
        },
	    
      {
        buttonId: "download_list",
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
    } else {
      return await conn.buttonMessage(from, buttonMessage, mek)
    }
	
} catch (e) {
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})



async function resizeImage(inputBuffer, width, height) {
    try {
        return await sharp(inputBuffer).resize(width, height).toBuffer();
    } catch (error) {
        console.error('Error resizing image:', error);
        return inputBuffer; // Return original if resizing fails
    }
}







   
    cmd({
    pattern: "ndll",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
	
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }


    try {

	 await conn.sendMessage(from, { text : `*Downloading your movie..⬇️*` }, {quoted: mek} )    
  const datae = q.split("±")[0]
const datas = q.split("±")[1]
const dat = q.split("±")[2]	    



	   


	    const mh = `${datas}&download=true`
	    
        const mediaUrl = mh.trim();

     
  const botimgUrl = datae;
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        
        // Resize image to 200x200 before sending
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);


        const message = {
            document: { url: mediaUrl },
	    caption: `*🎬 Name :* ${dat}\n\n${config.NAME}`,


		    jpegThumbnail: resizedBotImg,
            mimetype: "video/mp4",
	
            fileName: `${dat}.mp4`,
        };
await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
	     await conn.sendMessage(from, { text : `*Uploading your movie..⬆️*` }, {quoted: mek} )
        await conn.sendMessage(config.JID || from, message);

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
	    await conn.sendMessage(from, { text : `*Movie send Successfull this JID ${config.JID} ✔*` }, {quoted: mek} )
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});

cmd({
    pattern: "dubdet",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')


let sadas = await fetchJson(`https://darksadasyt-new-mv-site-info.vercel.app/?url=${q}`)
const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     
	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮*  _${sadas.title  || 'N/A'}_

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮*  _${sadas.date  || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.subtitle_author  || 'N/A'}_

> 🌟 Follow us : *${details.chlink}*`
await conn.sendMessage(config.JID || from, { image: { url: sadas.image }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});


cmd({
    pattern: "imdb",  
    alias: ["mvinfo","filminfo"],
    desc: "Fetch detailed information about a movie.",
    category: "movie",
    react: "🎬",
    use: '.movieinfo < Movie Name >',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, msr, creator, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {


if(!q) return await reply(msr.giveme)
        
        const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(q)}&apikey=76cb7f39`;
        const response = await axios.get(apiUrl);

        const data = response.data;
       
const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
 
        const movieInfo = `*☘️ 𝗧ɪᴛʟᴇ ➮* ${data.Title}


*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* ${data.Released}
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* ${data.Runtime}
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${data.Genre}
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* ${data.Director}
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* ${data.Country}
*💃 𝗥ᴀᴛɪɴɢ ➮* ${data.imdbRating}

> 🌟 Follow us : *${details.chlink}*`;

        // Define the image URL
        const imageUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : config.LOGO;

        // Send the movie information along with the poster image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}
            
           `
          
        });
    } catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
})
cmd({
    pattern: "sublk",	
    react: '🎬',
    category: "movie",
    desc: "SUB.LK movie search",
    use: ".sublk Avatar",
    filename: __filename
},
async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
try {
    if (!q) return await reply('*Please give me a movie name 🎥*')

    // Fetch data from SUB.LK API
    let url = await fetchJson(`https://visper-md-ap-is.vercel.app/movie/sublk/SEARCH?q=${encodeURIComponent(q)}`)

    if (!url || !url.result || url.result.length === 0) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
    }

    // Create rows with rowId
    var srh = [];  
    for (var i = 0; i < url.result.length; i++) {
        srh.push({
            title: url.result[i].title,
            //description: url.result[i].year || '',
            rowId: prefix + `sdl ${url.result[i].link}&${url.result[i].year}`
        });
    }

    const listMessage = {
        text: `*_SUB.LK MOVIE SEARCH RESULT 🎬_*

*\`Input :\`* ${q}`,
        footer: config.FOOTER,
        title: 'SUB.LK Results',
        buttonText: '*Reply Below Number 🔢*',
        sections: [{
            title: "SUB.LK Results",
            rows: srh
        }]
    }

    const caption = `*_SUB.LK MOVIE SEARCH RESULT 🎬_*

*\`Input :\`* ${q}
_Total results:_ ${url.result.length}`

    // Also create listButtons for button mode
    const rowss = url.result.map((v, i) => {
        return {
            title: v.title || `Result ${i+1}`,
            id: prefix + `sdl ${v.link}&${v.year}`
        }
    });

    const listButtons = {
        title: "Choose a Movie 🎬",
        sections: [
            {
                title: "SUB.LK Search Results",
                rows: rowss
            }
        ]
    };

    // Send as buttons or list depending on config
    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: config.LOGO },
            caption: caption,
            footer: config.FOOTER,
            buttons: [
                {
                    buttonId: "download_list",
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
    } else {
        await conn.listMessage(from, listMessage, mek)
    }

} catch (e) {
    console.log(e)
    await conn.sendMessage(from, { text: '🚩 *Error fetching results !!*' }, { quoted: mek })
}
})
cmd({
    pattern: "sdl",    
    react: '🎥',
    desc: "SUB.LK movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q || !q.includes('https://sub.lk/movies/')) {
        return await reply('*❗ Invalid link. Please search using .sublk and select a movie.*');
    }

    let data = await fetchJson(`https://sadaslk-apis.vercel.app/api/v1/movie/sublk/infodl?q=${q}&apiKey=sadasggggg`);
    
    // JSON එකේ ඇතුලත තියෙන්නේ 'data' කියන object එකයි
    const res = data.data;

    if (!res) return await reply('*🚩 No details found !*');

    let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${res.title || 'N/A'}_*
${res.tagline ? `*✨ Tagline:* _${res.tagline}_` : ''}

*📅 𝗥ᴇʟᴇᴀꜱᴇ 𝗗𝗮𝘁𝗲 ➮* _${res.releaseDate || 'N/A'}_
*🌎 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${res.country || 'N/A'}_
*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _Value: ${res.ratingValue || 'N/A'} (Count: ${res.ratingCount || 'N/A'})_
*⏰ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 ➮* _${res.runtime || 'N/A'}_
*🎭 𝗚𝗲𝗻𝗿𝗲𝘀 ➮* ${res.genres?.join(', ') || 'N/A'}
`;

    let rows = [];

rows.push({
      buttonId: prefix + 'ssdetails ' + q, buttonText: {displayText: 'Details send'}, type: 1}

);
	
    // මෙහි downloads array එකේ නම 'pixeldrainDownloads' වේ
    if (res.pixeldrainDownloads && res.pixeldrainDownloads.length > 0) {
        res.pixeldrainDownloads.forEach((dl) => {
            rows.push({
                buttonId: `${prefix}subdl ${dl.finalDownloadUrl}±${res.imageUrl}±${res.title}±[${dl.quality}]`,
                buttonText: { 
                    displayText: `${dl.size} - ${dl.quality}`
                },
                type: 1
            });
        });
    }

    const buttonMessage = {
        image: { url: res.imageUrl.replace('-200x300', '') }, // High quality image එක සඳහා
        caption: msg,
        footer: config.FOOTER,
        buttons: rows,
        headerType: 4
    };

    return await conn.buttonMessage(from, buttonMessage, mek);

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching data!*' }, { quoted: mek });
}
})

cmd({
    pattern: "subdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    
    if (typeof isUploadinggggg !== 'undefined' && isUploadinggggg) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait until it finishes.* ⏳', 
            quoted: mek 
        });
    }

    try {
        // split කිරීමේදී "±" භාවිතා කරන්න
        const [megaUrl, imglink, title, quality] = q.split("±");

        if (!megaUrl || !imglink || !title) {
            return await reply("⚠️ Invalid format.");
        }

        isUploadingggggggggg = true; 
      await conn.sendMessage(from, { text: '*Fetching direct link from Mega...* ⏳', quoted: mek });

        // මෙතැනදී encodeURIComponent භාවිතා කර API Request එක යැවීම
        const apiUrl = `https://sadaslk-fast-mega-dl.vercel.app/mega?q=${encodeURIComponent(megaUrl.trim())}`;
        let megaApi = await fetchJson(apiUrl);
        
        if (!megaApi.status || !megaApi.result || !megaApi.result.download) {
            isUploadinggggg = false;
            return await reply("🚫 *Failed to fetch download link from Mega! Check the link again.*");
        }

        const directDownloadUrl = megaApi.result.download;
        const fileName = megaApi.result.name || title;

        await conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });

        const message = {
            document: { url: directDownloadUrl },
            caption: `🎬 *${title}*\n\n*\`${quality}\`*\n\n${config.NAME}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(imglink.trim())).buffer(),
            fileName: `🎬 ${fileName}.mp4`,
        };

        await conn.sendMessage(config.JID || from, message);
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) {
        console.error("sindl error:", e);
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
    } finally {
        isUploadingggggggggg = false; 
    }
});



cmd({
    pattern: "ssdetails",
    react: '🎬',
    desc: "Movie details sender (Details Only)",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
    try {
        if (!q) 
            return await reply('⚠️ *Please provide the movie URL!*');

        // URL එක ලබා ගැනීම
        const movieUrl = q;

        // API එකෙන් විස්තර ලබා ගැනීම
        let sadas = await fetchJson(`https://sadaslk-apis.vercel.app/api/v1/movie/sublk/infodl?q=${movieUrl}&apiKey=sadasggggg`);

        if (!sadas || !sadas.status || !sadas.data) {
            return await conn.sendMessage(from, { text: '🚩 *Error: Could not fetch movie details!*' }, { quoted: mek });
        }

        const movie = sadas.data;
        let details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

        // විස්තර පෙළ සැකසීම (Download links රහිතව)
        let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${movie.title || 'N/A'}_*
*✨ 𝗧𝗮𝗴𝗹𝗶𝗻𝗲 ➮* _${movie.tagline || 'N/A'}_

*📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲 ➮* _${movie.releaseDate || 'N/A'}_
*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${movie.ratingValue || 'N/A'} (${movie.ratingCount})_
*⏰ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 ➮* _${movie.runtime || 'N/A'}_
*🌍 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${movie.country || 'N/A'}_
*🎭 𝗚𝗲𝗻ﺮ𝗲𝘀 ➮* ${movie.genres ? movie.genres.join(', ') : 'N/A'}
*🔞 𝗖𝗼𝗻𝘁𝗲𝗻𝘁 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${movie.contentRating || 'N/A'}_

✨ *Follow us:* ${details.chlink}`;

        // පණිවිඩය යැවීම
        await conn.sendMessage(config.JID || from, {
            image: { url: movie.imageUrl },
            caption: msg
        });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(from, '⚠️ *An error occurred while fetching details.*', { quoted: mek });
    }
});









//dinka-movie
cmd({
    pattern: "dinka",	
    react: '🔎',
    category: "movie",
    desc: "DINKAMOVIES movie search",
    use: ".dinka sinhala",
    filename: __filename
},
async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
try {
    if (!q) return await reply('*Please give me a movie name 🎥*')

    // Fetch data from SUB.LK API
    let url = await fetchJson(`https://nadeeeee.netlify.app/api/Search/search?text=${encodeURIComponent(q)}`)

    if (!url || url.length === 0) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
    }

    // Create rows with rowId
    var srhh = [];  
    for (var i = 0; i < url.length; i++) {
        srhh.push({
            title: url[i].title,
            //description: url.result[i].year || '',
            rowId: prefix + `dndl ${url[i].link}&${url[i].year}`
        });
    }

    const listMessage = {
        text: `*_DINKAMOVIES MOVIE SEARCH RESULT 🎬_*

*\`🎡Input :\`* ${q}`,
        footer: config.FOOTER,
        title: 'dinkamovieslk.blogspot.com Results',
        buttonText: '*Reply Below Number 🔢*',
        sections: [{
            title: "dinkamovieslk.blogspot.com Results",
            rows: srhh
        }]
    }

    const caption = `*_DINKAMOVIES MOVIE SEARCH RESULT 🎬_*

*\`🎞Input :\`* ${q}

_Total results:_ ${url.length}`

    // Also create listButtons for button mode
    const rowss = url.map((v, i) => {
        return {
            title: v.title || `Result ${i+1}`,
            id: prefix + `dndl ${v.link}&${v.year}`
        }
    });

    const listButtons = {
        title: "Choose a Movie 🎬",
        sections: [
            {
                title: "dinkamovieslk.blogspot.com Search Results",
                rows: rowss
            }
        ]
    };

    // Send as buttons or list depending on config
    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: config.LOGO },
            caption: caption,
            footer: config.FOOTER,
            buttons: [
                {
                    buttonId: "download_list",
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
    } else {
        await conn.listMessage(from, listMessage, mek)
    }

} catch (e) {
    console.log(e)
    await conn.sendMessage(from, { text: '🚩 *Error fetching results !!*' }, { quoted: mek })
}
})
cmd({
    pattern: "dndl",	
    react: '🎥',
    desc: "DINKAMOVIES movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q || !q.includes('https://dinkamovieslk.blogspot.com/')) {
        console.log('Invalid input:', q);
        return await reply('*❗ Invalid link. Please search using .dndl and select a movie.*');
    }

    let data = await fetchJson(`https://nadeeeeedetailes.netlify.app/api/details/functions?url=${q}`);
    const res = data;

    if (!res) return await reply('*🚩 No details found !*');

    let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${res.title || 'N/A'}_*

*📎 Link:* ${q}
*📖 Description:* 
_${res.description || 'N/A'}_

${config.FOOTER}
`;

    // Prepare button rows
    let rows = [];
    res.download_links.forEach((dl, i) => {
        rows.push({
            buttonId: `${prefix}dnkzndl ${dl.url}±${res.image_links[0]}±${res.title}
            
			\`[${dl.quality}]\``,
            buttonText: { 
                displayText: `${dl.quality}`
                  .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
                  .trim()
            },
            type: 1
        });
    });

    const buttonMessage = {
        image: { url: res.image_links[0] },
        caption: msg,
        footer: config.FOOTER,
        buttons: rows,
        headerType: 4
    };

    // List buttons (nativeFlow style)
    const rowss = res.download_links.map((dl, i) => {
        const cleanText = `${dl.quality}`
          .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
          .trim() || "No info";

        return {
            title: cleanText,
            id: `${prefix}dnkzndl ${dl.url}±${res.image_links[0]}±${res.title}
            
			\`[${dl.quality}]\``
        };
    });

    const listButtons = {
        title: "🎬 Choose a download link:",
        sections: [
            {
                title: "Available Links",
                rows: rowss
            }
        ]
    };

    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: res.image_links[0] },

            caption: msg,
            footer: config.FOOTER,
            buttons: [
                {
                    buttonId: "download_list",
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
    } else {
        return await conn.buttonMessage(from, buttonMessage, mek)
    }

} catch (e) {
    console.log(e)
    await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek })
}
})

let isUploadinggggg = false; // Track upload status

cmd({
    pattern: "dnkzndl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (isUploadinggg) {
        return await conn.sendMessage(from, { 
            text: '*A movie is already being uploaded. Please wait until it finishes.* ⏳', 
            quoted: mek 
        });
    }
console.log(`Input:`, q)
    try {
        //===================================================
        const [pix, imglink, title] = q.split("±");
        if (!pix || !imglink || !title) return await reply("⚠️ Invalid format. Use:\n`dnkzndl link±img±title`");
        //===================================================

        const da = pix;
		console.log(da)
    
        isUploadinggggg = true; // lock start

        //===================================================
        const botimg = imglink.trim();
        const message = {
            document: { url: da },
            caption: `🎬 ${title}\n[dinkamovieslk.blogspot.com]\n\n${config.NAME}\n\n${config.FOOTER}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `${title}`,
        };

		conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });
        // Upload + react + success (parallel tasks)
        await Promise.all([
            conn.sendMessage(config.JID || from, message),
            conn.sendMessage(from, { react: { text: '✔️', key: mek.key } })
        ]);

    } catch (e) {
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
        console.error("sindl error:", e);
    } finally {
        isUploadinggggg = false; // reset lock always
    }
});
