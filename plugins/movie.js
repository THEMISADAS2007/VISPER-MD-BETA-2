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
const fg = require('api-dylux');

const { Octokit } = require("@octokit/rest");



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
"_Price : 200 LKR ✔️_\n\n" +
"*👨‍💻Contact us : 0778500326 , 0722617699*"
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
	  { name: "SUBLK", cmd: "sublk" },
		{ name: "SINHALALK", cmd: "ms" }
	 
    ];


    let imageBuffer;
    try {
      const res = await axios.get('https://nadeen-botzdatabse.vercel.app/MovieZoneX.png', {
        responseType: 'arraybuffer'
      });
      imageBuffer = Buffer.from(res.data, 'binary');
    } catch {
      imageBuffer = null; 
    }

    const caption = `_*VISPER MOVIE SYSTEM 🎬*_\n\n*\`🔍Input :\`* ${q}\n\n_*🌟 Select your preferred movie download site*_`;

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
        image: imageBuffer || { url: 'https://nadeen-botzdatabse.vercel.app/MovieZoneX.png' },
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
        image: { url: 'https://nadeen-botzdatabse.vercel.app/MovieZoneX.png' },
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
    alias: ["cz"],
    desc: "cinesubz.co movie search",
    use: ".cine 2025",
    filename: __filename
},
async (conn, m, mek, {
    from, q, prefix, isPre, isSudo, isOwner, isMe, reply
}) => {
    try {
        // Premium check
        const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;
        const isFree = pr.mvfree === "true";

        if (!isFree && !isMe && !isPre) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, {
                text: "*`You are not a premium user⚠️`*\n\n" +
                      "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
                      "_Price : 200 LKR ✔️_\n\n" +
                      "*👨‍💻Contact us : 0778500326 , 0722617699*"
            }, { quoted: mek });
        }

        // Block check
        if (config.MV_BLOCK === "true" && !isMe && !isSudo && !isOwner) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, {
                text: "*This command currently only works for the Bot owner.*"
            }, { quoted: mek });
        }

        if (!q) return await reply('*Please give me a movie name 🎬*');

        // Fetching Data from API
        const apiUrl = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?q=${encodeURIComponent(q)}&apikey=82406ca340409d44`;
        const response = await axios.get(apiUrl);
        const result = response.data;

        if (!result.status || !result.data || result.data.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
        }

        let srh = [];
        result.data.forEach((movie) => {
            // Clean title
            const cleanTitle = movie.title
                .replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "")
                .replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")
                .trim();

            srh.push({
                title: cleanTitle,
                //description: `Quality: ${movie.quality} | Rating: ${movie.rating}`,
                rowId: `${prefix}cinedl2 ${movie.link}`
            });
        });

        const sections = [{
            title: "Cinesubz.lk Search Results",
            rows: srh
        }];

        const listMessage = {
            text: `_*CINESUBZ MOVIE SEARCH RESULTS 🎬*_\n\n*\`Input :\`* ${q}\n\n*Select a movie from the list below to download.*`,
            footer: config.FOOTER,
            title: 'Cinesubz Movie Downloader',
            buttonText: 'Click here to view',
            sections
        };

        // Sending the list
        await conn.listMessage(from, listMessage, mek);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching data!*' }, { quoted: mek });
    }
});





cmd({
    pattern: "cinedl2",
    react: '🎥',
    desc: "movie downloader info",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
    try {
        if (!q) return await reply('*Please provide a link!*');

        // ලින්ක් එක encode කර API එකට යැවීම
        const apiUrl = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(q)}&apikey=82406ca340409d44`;
        
        const res = await axios.get(apiUrl);
        const sadas = res.data;

        if (!sadas.status || !sadas.data) {
            return await conn.sendMessage(from, { text: '🚩 *Error fetching movie details!*' }, { quoted: mek });
        }

        const movie = sadas.data;

        // Message Format එක (ඔබ ඉල්ලූ පරිදි)
        // සටහන: මෙම API එකෙන් දැනට ලැබෙන්නේ title සහ size පමණක් බැවින් අනෙක්වා default අගයන් ලෙස තබා ඇත.
        let msg = `*🍿 𝗧ɪᴛʟᴇ ➮* *_${movie.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${movie.year || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${movie.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${movie.rating || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${movie.runtime || 'N/A'}_
*⚖️ 𝗦ɪᴢᴇ ➮* _${movie.size || 'N/A'}_
*💁 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _CineSubz_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* _Movie_`

        let rows = [];

		rows.push(
    { buttonId: prefix + 'cdetails ' + `${q}`, buttonText: { displayText: 'Details Card\n' }, type: 1 }
    
);
       // Download Links බොත්තම් ලෙස සැකසීම
if (movie.downloads && movie.downloads.length > 0) {
    movie.downloads.forEach((dl) => {
        // JSON එකේ dl.name නැති නිසා quality සහ size එක බොත්තම සඳහා භාවිතා කරමු
        // අවශ්ය නම් siteName එකට static අගයක් දිය හැක (උදා: "DOWNLOAD")
        
        rows.push({
            buttonId: `${prefix}nadeendl ${dl.link}±${movie.title}±${movie.image}±${dl.quality}`, 
            buttonText: { 
                displayText: `${dl.quality} - ${dl.size}` 
            },
            type: 1
        });
    });
}

        // පින්තූරය සහිත බොත්තම් පණිවිඩය
        const buttonMessage = {
            image: { url: movie.image.replace(/-\d+x\d+(?=\.jpg)/, '') }, // API එකේ පින්තූරය නැති නිසා default logo එක
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




// --- Configuration ---
const GITHUB_AUTH_TOKEN = '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';
const GITHUB_USER = 'THEMISADAS2007';
const GITHUB_REPO = 'CINEDL-SAVE';
const DB_PATH = 'database.json';
const MEGA_API_KEY = 'sadasggggg'; 

const octokit = new Octokit({ auth: GITHUB_AUTH_TOKEN });

// --- GitHub DB Helpers ---
async function getStoredData() {
    try {
        const res = await octokit.repos.getContent({
            owner: GITHUB_USER, repo: GITHUB_REPO, path: DB_PATH,
        });
        const content = Buffer.from(res.data.content, 'base64').toString();
        return { db: JSON.parse(content), sha: res.data.sha };
    } catch (e) {
        return { db: {}, sha: null };
    }
}

async function saveToDb(movieKey, linkData) {
    const { db, sha } = await getStoredData();
    db[movieKey] = linkData; 
    const updatedContent = Buffer.from(JSON.stringify(db, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_USER, repo: GITHUB_REPO, path: DB_PATH,
        message: `DB Update: Link Refresh for ${movieKey}`,
        content: updatedContent, sha: sha
    });
}

// --- Fetch Function (API එකෙන් ලින්ක් ගන්නා වෙනම function එකක්) ---
async function fetchNewLink(movieUrl) {
    const apiRes = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${movieUrl}&apikey=82406ca340409d44`);
    const dlData = apiRes.data.data.download;
    const mega = dlData.find(l => l && l.name === "mega")?.url;
    const gdrive = dlData.find(l => l && l.name === "gdrive")?.url;

    if (mega) {
        return { type: 'mega', link: mega };
    } else if (gdrive) {
        const formattedGdrive = gdrive.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view');
        return { type: 'gdrive', link: formattedGdrive };
    }
    return null;
}



// --- Main Command ---
cmd({
    pattern: "nadeendl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('*Provide link!*');
        const [movieUrl, movieName, thumbUrl, quality] = q.split("±");
        if (!movieUrl || !movieName) return await reply('*Invalid Format!*');

        const botimgResponse = await fetch(thumbUrl);
        const botimgBuffer = await botimgResponse.buffer();
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        const { db } = await getStoredData();
        let linkData = db[movieUrl] || null;

        // 1. Fetch from source if not in DB
        if (!linkData) {
            await reply(`*🔍 Fetching links from Source...*`);
            linkData = await fetchNewLink(movieUrl);
            if (linkData) await saveToDb(movieUrl, linkData);
        }

        if (!linkData) return await reply("❌ No GDrive or Mega links found.");

        // Define the send function
        const attemptSend = async (data) => {
            let downloadUrl = "";
            if (data.type === 'mega') {
                const megaRes = await axios.get(`https://apis.sadas.dev/api/v1/download/mega?q=${encodeURIComponent(data.link)}&apiKey=${MEGA_API_KEY}`);
                downloadUrl = megaRes.data.data.result.download;
            } else {
                const res = await fg.GDriveDl(data.link);
                downloadUrl = res.downloadUrl;
            }

            return await conn.sendMessage(from, { 
                document: { url: downloadUrl }, 
                mimetype: 'video/mp4',
                caption: `*🎬 Name :* *${movieName}*\n\n*\`${quality}\`*\n\n${config.NAME}`,
                jpegThumbnail: resizedBotImg,
                fileName: `🎬 ${movieName}.mp4` 
            });
        }; // <--- This was missing/incorrectly closed

        // 2. Execution logic
        try {
            await attemptSend(linkData);
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        } catch (err) {
            // 3. Refresh if expired
            await reply(`*⚠️ Cached link failed/expired. Refreshing...*`);
            const freshData = await fetchNewLink(movieUrl);
            
            if (freshData) {
                await saveToDb(movieUrl, freshData); 
                await attemptSend(freshData);
                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            } else {
                await reply("❌ Failed to refresh link from source.");
            }
        }

    } catch (e) {
        console.log(e);
        await reply(`*❌ Error:* ${e.message}`);
    }
});





// --- Main Automation Command ---
cmd({
    pattern: "cineauto",
    react: '🔄',
    category: "movie",
    desc: "A-Z Movie Automation with DB Save & File Sender",
    filename: __filename
},
async (conn, m, mek, { from, reply }) => {
    try {
        if (autoStatus) return await reply("*⚠️ Automation is already running!*");
        autoStatus = true;
        
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        await reply("*🚀 Starting A-Z Automation & DB Syncing...*");

        for (let char of alphabet) {
            if (!autoStatus) break;

            const searchUrl = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-search?q=${char}&apikey=82406ca340409d44`;
            const searchRes = await axios.get(searchUrl);
            if (!searchRes.data.status || !searchRes.data.data) continue;

            for (let movie of searchRes.data.data) {
                if (!autoStatus) break;

                try {
                    // 1. චිත්‍රපට විස්තර ලබා ගැනීම
                    const infoUrl = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(movie.link)}&apikey=82406ca340409d44`;
                    const infoRes = await axios.get(infoUrl);
                    const movieData = infoRes.data.data;
                    if (!movieData) continue;

                    // 2. DB එක පරීක්ෂා කිරීම සහ ලින්ක් ලබා ගැනීම
                    const { db } = await getStoredData();
                    let linkData = db[movie.link] || null;

                    if (!linkData) {
                        const dlApi = `https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(movie.link)}&apikey=82406ca340409d44`;
                        const dlRes = await axios.get(dlApi);
                        const dlLinks = dlRes.data.data.download;
                        const target = dlLinks.find(l => l && (l.name === "mega" || l.name === "gdrive"));

                        if (target) {
                            linkData = { type: target.name, url: target.url };
                            await saveToDb(movie.link, linkData); // DB එකට Save කිරීම
                        }
                    }

                    if (linkData) {
                        // 3. Card එක යැවීම
                        let msg = `*🍿 𝗧ɪᴛʟᴇ ➮* *_${movieData.title}_*\n*📅 𝗬ᴇᴀʀ ➮* _${movieData.year || 'N/A'}_\n*⚖️ 𝗦ɪᴢᴇ ➮* _${movieData.size || 'N/A'}_`;
                        await conn.sendMessage(from, { image: { url: movieData.image }, caption: msg });

                        // 4. File එක Direct කර යැවීම
                        let finalDownloadUrl = "";
                        if (linkData.type === 'mega') {
                            const megaRes = await axios.get(`https://apis.sadas.dev/api/v1/download/mega?q=${encodeURIComponent(linkData.url)}&apiKey=${MEGA_API_KEY}`);
                            finalDownloadUrl = megaRes.data.data.result.download;
                        } else {
                            const gdRes = await fg.GDriveDl(linkData.url.replace('download?id=', 'file/d/').split('&')[0]);
                            finalDownloadUrl = gdRes.downloadUrl;
                        }

                        await conn.sendMessage(from, { 
                            document: { url: finalDownloadUrl }, 
                            mimetype: 'video/mp4',
                            fileName: `🎬 ${movieData.title}.mp4`,
                            caption: `*✅ Done:* ${movieData.title}`
                        });
                    }

                    // විරාමයක් ලබා දීම
                    await new Promise(resolve => setTimeout(resolve, 15000));

                } catch (err) {
                    console.log("Error in Loop:", err);
                    continue;
                }
            }
        }
        autoStatus = false;
        await reply("*✅ A-Z Automation Completed!*");
    } catch (e) {
        autoStatus = false;
        console.log(e);
    }
});

// Stop Command
cmd({ pattern: "stopauto", filename: __filename }, async (conn, m, mek, { reply }) => {
    autoStatus = false;
    await reply("*🛑 Automation Stopped!*");
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

✨ *Follow us:* ${details.mvchlink}`;

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





// 1. MOVIESUB SEARCH COMMAND

cmd({
    pattern: "sinhalalk",
    react: '🔎',
    category: "movie",
    alias: ["ms","moviessublk"],
    desc: "movieslk search",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        if (!q) return reply("*❗ Please give a movie name*");

        const searchUrl = `https://moviessub-nadeen.vercel.app/api/search?q=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl);
        const results = response.data.results;

        if (!results || results.length === 0) return reply("*❌ No results found!*");

        // බොට්ගේ config එක අනුව NON_BUTTON අගය සකස් කිරීම
        const isButton = config.BUTTON === "true";

        if (isButton) {
            // Button Mode (Native Flow Single Select)
            const rows = results.map(v => ({
                title: v.title.replace(/Sinhala Subtitles|සිංහල උපසිරැසි සමඟ/gi, "").trim(),
                id: `${prefix}msdl ${v.link}±${v.image.replace(/\/s\d+[^/]*\//, '/s1600/')}`
            }));

            const listButtons = {
                title: "🎬 Select a Movie",
                sections: [{ title: "[Movielk.com Results]", rows }]
            };

            await conn.sendMessage(from, {
                image: { url: config.LOGO },
                caption: `_*MOVIELK SEARCH RESULTS 🎬*_\n\n*Input:* ${q}`,
                footer: config.FOOTER,
                buttons: [{
                    buttonId: "ms_list",
                    buttonText: { displayText: "🎥 Select Result" },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify(listButtons)
                    }
                }],
                headerType: 1
            }, { quoted: mek });

        } else {
            // Non-Button Mode (අංකය reply කරන ක්‍රමය - listMessage භාවිතා කර)
            const rows = results.map(v => ({
                title: v.title.replace(/Sinhala Subtitles|සිංහල උපසිරැසි සමඟ/gi, "").trim(),
                rowId: `${prefix}msdl ${v.link}±${v.image.replace(/\/s\d+[^/]*\//, '/s1600/')}`
            }));

            await conn.listMessage(from, {
                text: `_*MOVIELK SEARCH RESULTS 🎬*_\n\n*Input:* ${q}`,
                footer: config.FOOTER,
                title: "[Movielk.com Results]",
                buttonText: "Reply Below Number 🔢",
                sections: [{ title: "[Movielk.com Results]", rows }]
            }, mek);
        }

    } catch (e) {
        console.log(e);
        reply("*Error during search!*");
    }
});
// 2. MOVIESUB INFO & QUALITY DOWNLOAD LINKS
cmd({
    pattern: "msdl",
    react: "🎥",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        if (!q) return reply("*❗ Invalid Link!*");
 

    // q → img ± url ± title ± quality
    const [url, img] = q.split("±");
		console.log(`💃🏻Url:`, url);
        const infoUrl = `https://moviessub-nadeen.vercel.app/api/info?url=${encodeURIComponent(url)}`;
        const response = await axios.get(infoUrl);
        const d = response.data;
//let res = await fg.GDriveDl(d.downloads[0].link.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view'))
		
        let infoMsg = `*_🎬 𝗧ɪᴛʟᴇ: ${d.title}_*\n\n📅 *𝗬ᴇᴀʀ:* ${d.details.year || 'N/A'}\n⭐ *𝗜ᴍᴅʙ:* ${d.details.imdb || 'N/A'}\n🤡 *𝗚ᴇɴʀᴇ:* ${d.details.genre || 'N/A'}\n🕵️‍♂️ *𝗗ɪʀᴇᴄᴛᴏʀ:* ${d.details.director || 'N/A'}\n🌎 *𝗖ᴏᴜɴᴛʀʏ:* ${d.details.country || 'N/A'}\n\n`;

        const isButton = config.BUTTON === "true";

        if (isButton) {
            // Button Mode
            const rows = d.downloads.map(v => ({
                title: `Download (${v.quality})`,
                id: `${prefix}mvsub ${img}±${v.link}±${d.title}±${v.quality}`
            }));

            const listButtons = {
                title: "📥 Download Options",
                sections: [{ title: "Available Qualities", rows }]
            };

            await conn.sendMessage(from, {
                image: { url: img },
                caption: infoMsg + "*Select a quality:*",
                footer: config.FOOTER,
                buttons: [{
                    buttonId: "dl_list",
                    buttonText: { displayText: "📥 Download Now" },
                    type: 4,
                    nativeFlowInfo: {
                        name: "single_select",
                        paramsJson: JSON.stringify(listButtons)
                    }
                }],
                headerType: 1
            }, { quoted: mek });

        } else {
            // Non-Button Mode (අංකය reply කර ඩවුන්ලෝඩ් කිරීමට)
            const buttons = d.downloads.map(v => ({
                buttonText: { displayText: `Download (${v.quality})` },
                buttonId: `${prefix}mvsub ${img}±${v.link}±${d.title}±${v.quality}`
            }));

            await conn.buttonMessage(from, {
                image: { url: img },
                caption: infoMsg,
                footer: config.FOOTER,
                buttons: buttons,
                headerType: 4 // Image header
            }, mek);
        }

    } catch (e) {
        console.log(e);
        reply("*Error fetching info!*");
    }
});
// 3. FINAL FILE UPLOADER (paka command)

cmd({
    pattern: "mvsub",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
 console.log(`🤹🏼‍♂️ Final-dl:`, q);

    // q → img ± url ± title ± quality
    const [img, url, title, quality] = q.split("±");
	const res = await fg.GDriveDl(url+ `/view`)
	
    if (!q) return reply("*❗ Please give Google Drive URL*");
    if (isUploadingw) return reply("*⏳ Another upload is in progress…*");
console.log(`🌬Gd-dl:`,res.downloadUrl);
    try {
        isUploadingw = true;

        // API URL
        const apiUrl = `https://sadaslk-apis.vercel.app/api/v1/download/gdrive?q=${encodeURIComponent(url)}/view?usp=sharing&apiKey=vispermdv4`;
 const data = (await axios.get(apiUrl)).data;
        // Fetch API
        const json = data;
    console.log(`🧨fetch:`, data);
        if (!json || !json.data || !json.data.data.downloadUrl) {
            return reply("*❌ Download link not found!*");
        }
console.log(`🍱fetch2:`, json.data.data.downloadUrl);
       
		const {
            downloadUrl = json.data.data.downloadUrl,
            quality = "HD",
            thumbnail
        } = json.data;
console.log(`🏵Link-dl:`, downloadUrl);
        const upmsg = await conn.sendMessage(
            from,
            { text: `*⬆️ Uploading...*` }
        );

        // Thumbnail handle (optional)
        let jpegThumbnail;
        if (img) {
            const imgRes = await fetch(img);
            const imgBuf = await imgRes.buffer();
            jpegThumbnail = await sharp(imgBuf).resize(200, 200).toBuffer();
        }

        await conn.sendMessage(
            config.JID || from,
            {
                document: { url: res.downloadUrl },
                mimetype: "video/mp4",
                fileName: `${title}.mp4`,
                caption: `🎬 *${title}*\n\n\`[${quality}]\`\n\n★━━━━━━━━✩━━━━━━━━★`,
                jpegThumbnail
            },
            { quoted: mek }
        );

        await conn.sendMessage(from, { delete: upmsg.key });
        await conn.sendMessage(from, {
            react: { text: "✔️", key: mek.key }
        });

    } catch (e) {
        console.log("❌ Upload error:", e);
        reply("*❗ Error while uploading the file.*");
    } finally {
        isUploadingw = false;
    }
});

cmd({
    pattern: "sinhalasub",
    react: '🔎',
    category: "movie",
    alias: ["sinsub", "sinhalasub"],
    desc: "Search movies on sinhalasub.lk",
    use: ".sinhalasub <movie name>",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
    try {
        // 🧩 Premium check
        const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;
        const isFree = pr.mvfree === "true";

        if (!isFree && !isMe && !isPre) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, {
                text: "*`You are not a premium user⚠️`*\n\n" +
                      "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
                      "_Price : 200 LKR ✔️_\n\n" +
                      "*👨‍💻Contact us : 0778500326 , 0722617699*"
            }, { quoted: mek });
        }

        if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { 
                text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*" 
            }, { quoted: mek });
        }

        if (!q) return await reply('*Please enter a movie name! 🎬*');

        // 🔗 Fetch SinhalaSub API
        const { data: apiRes } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/search?q=${encodeURIComponent(q)}`);

        // 🧠 Normalize structure
        let results = [];
        if (Array.isArray(apiRes)) results = apiRes;
        else if (Array.isArray(apiRes.result)) results = apiRes.result;
        else if (Array.isArray(apiRes.results)) results = apiRes.results;
        else if (Array.isArray(apiRes.data)) results = apiRes.data;
        else results = [];

        if (!results.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
        }

        // 🧩 Create list
        let srh = results.map(v => ({
            title: (v.Title || v.title || "Unknown Title")
                .replace(/Sinhala Subtitles\s*\|?\s*සිංහල උපසිරසි.*/gi, "")
                .trim(),
            description: "",
            rowId: prefix + 'sininfo ' + (v.Link || v.link || "")
        }));

        const sections = [{
            title: "sinhalasub.lk results",
            rows: srh
        }];

        const listMessage = {
            text: `_*SINHALASUB MOVIE SEARCH RESULTS 🎬*_\n\n*🔎 Input:* ${q}`,
            footer: config.FOOTER,
            title: 'sinhalasub.lk Results 🎥',
            buttonText: '*Reply Below Number 🔢*',
            sections
        };

        const caption = `_*SINHALASUB MOVIE SEARCH RESULTS 🎬*_\n\n*🏔️ Input:* ${q}`;

        // 🎛️ Interactive button or list
        if (config.BUTTON === "true") {
            const listButtons = {
                title: "Choose a Movie 🎬",
                sections: [
                    {
                        title: "Available Movies",
                        rows: srh
                    }
                ]
            };

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
            await conn.listMessage(from, listMessage, mek);
        }

    } catch (e) {
        console.eror("🔥 SinhalaSub Error:", e);
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
    }
});

cmd({
    pattern: "sininfo",
    alias: ["moviedetails"],
    react: "🎬",
    desc: "SinhalaSub movie details & downloads",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a SinhalaSub movie URL!*");

        // 🔗 NEW API
        const { data } = await axios.get(
            `https://my-apis-site.vercel.app/movie/sinhalasub/movie?url=${encodeURIComponent(q)}&apikey=charuka-key-666`
        );

        if (!data || !data.result)
            return reply("❌ *No data received from API!*");

        const r = data.result;

        // 🧠 SAFE FIELD MAP (ALL MOVIES)
        const title    = r.title || r.name || "Unknown Title";
        const date     = r.date || r.release || "N/A";
        const country  = r.country || r.origin || "N/A";
        const rating   = r.rating || r.imdb || "N/A";
        const duration = r.duration || r.runtime || "N/A";
        const author   = r.author || r.subtitle || "N/A";
        const image    = r.images?.[0] || r.image || config.LOGO;

        // ==================================================
        // 🔍 UNIVERSAL DOWNLOAD DETECTOR (PIXELDRAIN)
        let downloadArray = [];

        if (Array.isArray(r.downloads)) downloadArray = r.downloads;
        else if (Array.isArray(r.download_links)) downloadArray = r.download_links;
        else if (Array.isArray(r.links)) downloadArray = r.links;
        else if (Array.isArray(r.pixeldrain)) downloadArray = r.pixeldrain;
        else if (Array.isArray(r.dl_links)) downloadArray = r.dl_links;

        // fallback scan
        if (!downloadArray.length) {
            for (const key in r) {
                if (Array.isArray(r[key])) {
                    const found = r[key].filter(v =>
                        typeof v === "object" &&
                        JSON.stringify(v).includes("pixeldrain")
                    );
                    if (found.length) {
                        downloadArray = found;
                        break;
                    }
                }
            }
        }

        // ==================================================
        // 🔢 BUILD NUMBERED LIST
        let dlText = "";
        let links = [];
        let i = 1;

        for (const d of downloadArray) {
            const link =
                d.link ||
                d.url ||
                d.download ||
                d.pixeldrain;

            if (!link || !link.includes("pixeldrain")) continue;

            dlText += `*${i}️⃣ ${d.quality || d.resolution || "Unknown"} | ${d.size || "Unknown"}*\n`;
            links.push(link);
            i++;
        }

        if (!links.length)
            dlText = "_No pixeldrain download links found 😔_";

        // 🧠 CACHE FOR NUMBER REPLY
        global.sininfo_cache = global.sininfo_cache || {};
        global.sininfo_cache[from] = {
            links,
            title,
            image
        };

        // ==================================================
        // 📄 DETAILS CARD
        const msg = `*🌾 𝗧𝗜𝗧𝗟𝗘 ➮* *_${title}_*

*📅 Released ➮* _${date}_
*🌎 Country ➮* _${country}_
*⭐ Rating ➮* _${rating}_
*⏰ Runtime ➮* _${duration}_
*🕵️ Subtitle ➮* _${author}_

*⬇️ Reply with download number*
────────────────
${dlText}
`;

        await conn.sendMessage(from, {
            image: { url: image },
            caption: msg,
            footer: config.FOOTER || "VISPER-MD 🎬"
        }, { quoted: mek });

    } catch (e) {
        console.error("SININFO ERROR:", e);
        reply("🚫 *Error while fetching movie details!*");
    }
});
cmd({
    pattern: "sindl",
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

    try {
        //===================================================
        const [pix, imglink, title] = q.split("±");
        if (!pix || !imglink || !title) return await reply("⚠️ Invalid format. Use:\n`sindl link±img±title`");

        // Extract original pixeldrain URL[](https://pixeldrain.com/u/ID)
        const originalUrl = pix.trim();
        if (!originalUrl.includes('pixeldrain.com/u/')) {
            return await reply("⚠️ Invalid Pixeldrain URL.");
        }

        //===================================================
        isUploadinggg = true; // lock start

        // Send "uploading..." message
        await conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });

        // Call the new API to get premium/direct download link
        const encodedUrl = encodeURIComponent(originalUrl);
        const apiUrl = `https://api-dark-shan-yt.koyeb.app/download/pixeldrain?url=${encodedUrl}&apikey=475c2b78a1c24fd8`;
        
        const { data: apiRes } = await axios.get(apiUrl);

        if (!apiRes.status || !apiRes.data || !apiRes.data.download) {
            throw new Error("Failed to get download link from API.");
        }

        const downloadUrl = apiRes.data.download;
        const apiFilename = apiRes.data.filename || `${title}.mp4`;
        const apiSize = apiRes.data.size || "Unknown";

        // Fetch thumbnail from movie image URL
        let thumbnail = null;
        if (imglink && imglink.trim()) {
            try {
                thumbnail = await (await fetch(imglink.trim())).buffer();
            } catch (e) {
                console.log("Thumbnail fetch failed:", e);
                // If thumbnail fails, continue without it
            }
        }

        // Send movie as document with thumbnail
        await conn.sendMessage(config.JID || from, { 
            document: { url: downloadUrl },
            caption: `🎬 ${title}\n📏 Size: ${apiSize}\n\n${config.NAME}\n\n${config.FOOTER}`,
            mimetype: "video/mp4",
            fileName: `🎬VISPER-MD🎬 ${apiFilename}`,
            jpegThumbnail: thumbnail  // Movie image as thumbnail (uda image eka)
        });

        // Success reactions and message
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully ✔*\n📏 Size: ${apiSize}`, quoted: mek });

    } catch (e) {
        console.error("sindl error:", e);
        await reply(`🚫 *Error Occurred !!*\n\n${e.message || e}`);
    } finally {
        isUploadinggg = false; // reset lock always
    }
});

cmd({
    pattern: "daqt",
    alias: ["mdv"],
    use: '.moviedl <url>',
    react: "🎥",
    desc: "Send full movie details from sinhalasub.lk",
    filename: __filename
},

async (conn, mek, m, { from, q, prefix, reply }) => {
try {
    if (!q) return reply('🚩 *Please give me a valid movie URL!*');

    // ✅ Fetch movie info from API
    const { data } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/info?q=${encodeURIComponent(q)}`);
    const sadas = data.result;

    if (!sadas || Object.keys(sadas).length === 0)
        return await reply('*🚫 No details found for this movie!*');

    // ✅ Fetch extra details (for footer / channel link)
    const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

    // 🧾 Caption Template
    const msg = `*🍿 𝗧ɪᴛʟᴇ ➮* *_${sadas.title || 'N/A'}_*

*📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱 𝗗𝗮𝘁𝗲 ➮* _${sadas.date || 'N/A'}_
*🌎 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${sadas.country || 'N/A'}_
*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${sadas.rating || 'N/A'}_
*⏰ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 ➮* _${sadas.duration || 'N/A'}_
*🕵️‍♀️ 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${sadas.author || 'N/A'}_

> 🌟 *Follow us :* ${details.chlink || 'N/A'}
`;

    // ✅ Send movie info message
    await conn.sendMessage(
        config.JID || from,
        {
            image: { url: sadas.images?.[0] || config.LOGO },
            caption: msg,
            footer: config.FOOTER || "VISPER-MD 🎬",
        },
        { quoted: mek }
    );

    // ✅ React confirmation
    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

} catch (error) {
    console.error('Error fetching or sending:', error);
    await conn.sendMessage(from, { text: `🚫 *Error Occurred While Fetching Movie Data!* \n\n${error.message}` }, { quoted: mek });
}
});

