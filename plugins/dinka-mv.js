const config = require('../config'),
  { cmd, commands } = require('../command'),
  axios = require('axios'),
	fg = require('api-dylux'),
  sharp = require('sharp'),
  https = require("https"),
  {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
  } = require('../lib/functions'),
  fetch = (..._0x528df7) =>
    import('node-fetch').then(({ default: _0x1863f6 }) =>
      _0x1863f6(..._0x528df7)
    ),
  { Buffer } = require('buffer'),
  FormData = require('form-data'),
  fs = require('fs'),
  path = require('path'),
  fileType = require('file-type'),
  l = console.log

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
    let pako = await fetchJson(`https://dinka-movie-api.vercel.app/?q=${encodeURIComponent(q)}&apikey=Nadeenxdev0`)
url = pako.results
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
            rowId: prefix + `dndl ${url[i].link}`
        });
    }

    const listMessage = {
        text: `*_DINKAMOVIES MOVIE SEARCH RESULT 🎬_*

*\`🔍Input :\`* ${q}`,
        footer: config.FOOTER,
        title: '[dinkamovieslk.app Results]',
        buttonText: '*Reply Below Number 🔢*',
        sections: [{
            title: "[dinkamovieslk.app Results]",
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
            id: prefix + `dndl ${v.link}`
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
  react: "🎥",
  desc: "DINKAMOVIES movie downloader",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
  try {

    const api =
      `https://dinka-movie-api.vercel.app/?url=${encodeURIComponent(q)}&apikey=Nadeenxdev0`;
    const res = await fetchJson(api);

    if (!res || !res.title) {
      return reply("*🚩 Movie details not found!*");
    }

    // =================================================
    // 1️⃣ SEND DETAILS FIRST
    // =================================================
   let detailsMsg =
`*🎬Title: ${res.title}*

▫🎞 *IMDb:* ${res.details.imdb || "N/A"}
▫📅 *Release Date:* ${res.details.release|| "N/A"}
▫🕵️‍♂️ *Director:* ${res.details.director || "N/A"}
▫⏳ *Runtime:* ${res.details.runtime || "N/A"}
▫🎭 *Genre:* ${
  Array.isArray(res.details.genre)
    ? res.details.genre.join(", ")
    : (res.details.genre || "N/A")
}

📝 *Description:*
_${res.details.description || "No description available"}_

🔗 *Movie Page:*
${q}

${config.FOOTER}
`; // ⚠️ URL LAST LINE

await conn.sendMessage(from, {
  text: detailsMsg,
  footer: config.FOOTER,
  contextInfo: {
    externalAdReply: {
      title: "Dinka Movies Lk",
      body: "Tap to open movie page",
      mediaType: 1,
      renderLargerThumbnail: true, // ⭐ big preview
      thumbnailUrl: res.image,     // poster   res.image
      sourceUrl: q                 // ✅ SAME URL
    }
  }
}, { quoted: mek });

    // =================================================
    // 2️⃣ DOWNLOAD OPTIONS (BUTTON / OLD MODE)
    // =================================================
    const rows = res.downloads.map(dl => {
      const clean =
        dl.name
          .replace(/WEBDL|WEB DL|BluRay|HDRip|FHD|HD|SD/gi, "")
          .trim() || dl.name;

      return {
        title: clean,
        id: `${prefix}dnkzndl ${dl.url}±${res.image || ""}±${res.title}±${dl.quality}`
      };
    });

    // ================= BUTTON MODE =================
    if (config.BUTTON === "true") {

      const listButtons = {
        title: "🎥 Choose Download Quality",
        sections: [{
          title: "Available Downloads",
          rows
        }]
      };

      await conn.sendMessage(from, {
        text: "*⬇️ Download options available below*",
        footer: config.FOOTER,
        buttons: [{
          buttonId: "select_download",
          buttonText: { displayText: "🎬 Download Movie" },
          type: 4,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify(listButtons)
          }
        }],
        viewOnce: true
      }, { quoted: mek });

    }

    // ================= OLD MODE =================
    else {

      const oldRows = rows.map(r => ({
        title: r.title,
        rowId: r.id
      }));

      await conn.listMessage(from, {
        text: "*⬇️ Download options available below*",
        footer: config.FOOTER,
        title: "🎥 Download Movie",
        buttonText: "Reply Below Number 🔢",
        sections: [{
          title: "Available Downloads",
          rows: oldRows
        }]
      }, mek);
    }

  } catch (e) {
    console.log(e);
    reply("🚩 *Error occurred!*");
  }
});

//details


let isUploadinggg = false; // Track upload status

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

    console.log(`Input:`, q);

    try {
        const [pix, imglink, rawInput, qulity] = q.split("±");
        if (!pix || !imglink || !rawInput || !qulity) return await reply("⚠️ Invalid format. Use:\n`dnkzndl link±img±title`");

        // 1. Prefix අයින් කිරීම
        let cleanText = rawInput.replace("https://dinkamovieslk-dl.vercel.app/?data=", "").trim();

        // 2. වරහන් ඇතුළේ තියෙන දේවල් (Year, etc.) සහ "Sinhala Movie" අයින් කිරීම
        //cleanText = cleanText.replace(/\(.*?\)/g, "");
       // cleanText = cleanText.replace(/sinhala movie/gi, "");

        // 3. Quality labels අයින් කිරීම
       // cleanText = cleanText.replace(/720p|1080p|480p|hd|webrip/gi, "");

        // 4. සිංහල අකුරු අයින් කර ඉංග්‍රීසි අකුරු සහ ඉලක්කම් පමණක් ඉතිරි කිරීම
     // let searchTitle = cleanText.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      let searchTitle = cleanText.replace(/\s+/g, " ");

        console.log(`💎 Final Search Query:`, searchTitle);
		
        let finalLink = "";
        let finalTitle = "";
        let finalType = "MOVIE";

        // API Fetch
        let dl = await fetchJson(`https://nadeen-dinka-pv.vercel.app/api/get-data?q=${encodeURIComponent(searchTitle)}&key=Nadeenxxdev`);
        
        if (dl && dl.success && dl.data.length > 0) {
            const movie = dl.data[0]; 
            finalTitle = movie.title || rawInput;
            if (movie.type) finalType = movie.type.toUpperCase();

            let originalUrl = movie.url || "";

            // GDrive Check
            if (originalUrl.includes("drive.google.com")) {
                let formattedUrl = originalUrl.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download' , '/view');
                try {
                    let res = await fg.GDriveDl(formattedUrl);
                    finalLink = res.downloadUrl;
                } catch (err) {
                    finalLink = originalUrl;
                }
            } else {
                finalLink = originalUrl;
            }
        } else {
            return await reply(`🚫 *Movie not found!* \nSearched for: ${searchTitle}`);
        }

        if (!finalLink) return await reply("🚫 *Download link error!*");

        isUploadinggg = true; 

        // --- Reaction Update (Uploading Start) ---
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });

		async function resizeImage(buffer, width, height) {
  return await sharp(buffer)
    .resize(width, height)
    .toBuffer();
}
const botimg = imglink;
        const botimgResponse = await fetch(botimg);
        const botimgBuffer = await botimgResponse.buffer();
		 const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);
	
      //  const botimg = imglink.trim();
        const message = {
            document: { url: finalLink },
            caption: `🎬 ${rawInput} \n\n \`[${qulity}]\`\n \n> [dinkamovieslk.app]\n\n${config.NAME}\n\n${config.FOOTER}`,
            mimetype: "video/mp4",
            jpegThumbnail: resizedBotImg,
            fileName: `${finalTitle}.mp4`,
        };

        // File එක Upload කිරීම
        await conn.sendMessage(config.JID || from, message);

        // --- Reaction Update (Success) ---
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
        console.error("dinkadl error:", e);
    } finally {
        isUploadinggg = false; 
    }
});
