const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios');
const sharp = require('sharp');
const Seedr = require("seedr");
const { scrapercine, getDownloadLink } = require('../lib/yts'); 
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { Buffer } = require('buffer'); 
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fileType = require("file-type")
const { x_search, x_info_dl } = require('../lib/newm'); 
const l = console.log
const https = require("https")
const { URL } = require('url');
const cinesubz_tv = require('sadasytsearch');
const { cinesubz_info, cinesubz_tv_firstdl, cinesubz_tvshow_info } = require('../lib/cineall');
const download = require('../lib/yts'); 
const { pirate_search, pirate_dl } = require('../lib/pirates');
const { gettep, down } = require('../lib/animeheaven');
const { sinhalasub_search, sinhalasub_info, sinhalasub_dl } = require('../lib/sinhalasubli');
const { sinhalasubb_search, sinhalasubtv_info, sinhalasubtv_dl } = require('../lib/sinhalasubtv');
const { slanimeclub_search, slanimeclub_ep, slanimeclub_dl, slanimeclub_mv_search, slanime_mv_info } = require('../lib/slanimeclub');
const { sizeFormatter} = require('human-readable');
const { xfull_search, xfull_dl } = require('../lib/plusmv');
const { search, getep, dl } = require('darksadasyt-anime')


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

    // Premium check
    if (!isFree && !isMe && !isPre) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*`You are not a premium user⚠️`*\n\n" +
              "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
              "_Price : 200 LKR ✔️_\n\n" +
              "*👨‍💻Contact us : 0778500326 , 0722617699*"
      }, { quoted: mek });
    }

    // Block mode check
    if (config.MV_BLOCK === "true" && !isMe && !isSudo && !isOwner) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*"
      }, { quoted: mek });
    }

    if (!q) return await reply('*Enter movie name..🎬*');

    // Movie sources
    const sources = [
      { name: "CINESUBZ", cmd: "cine" },
      { name: "SINHALASUB", cmd: "sinhalasub" },
      { name: "YTSMX", cmd: "ytsmx" },
      { name: "BAISCOPES", cmd: "baiscopes" },
      { name: "PUPILVIDEO", cmd: "pupilvideo" },
      { name: "ANIMEHEAVEN", cmd: "animeheaven" },
      { name: "1377", cmd: "1377" },
      { name: "18 PLUS", cmd: "sexfull" },
      { name: "PIRATE", cmd: "pirate" },
      { name: "SLANIME", cmd: "slanime" },
      { name: "NIKI", cmd: "niki" },
	  { name: "CINESL", cmd: "cinesl" },
	{ name: "DINKA", cmd: "dinka" },
	{ name: "SUBLK", cmd: "sublk" },
	{ name: "SINHALASUBS", cmd: "sinhalasubs" }
    ];


    let imageBuffer;
    try {
      const res = await axios.get('https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg', {
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
        image: imageBuffer || { url: 'https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg' },
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
        image: { url: 'https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg' },
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


//===================================================================================================================


cmd({
  pattern: "tv",
  react: "🔎",
  alias: ["tvshows", "tvseries", "tvepisodes"],
  desc: "All TV shows search",
  use: ".tv squid game",
  category: "movie",
  filename: __filename
},
async (conn, mek, m, {
  from, prefix, l, q,
  isPre, isSudo, isOwner, isMe, reply
}) => {
  try {
    const pr = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;
    const isFree = pr.mvfree === "true";

    // Premium check
    if (!isFree && !isMe && !isPre) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*`You are not a premium user⚠️`*\n\n" +
              "*Send a message to one of the 2 numbers below and buy Lifetime premium 🎉.*\n\n" +
              "_Price : 200 LKR ✔️_\n\n" +
              "*👨‍💻Contact us : 0778500326 , 0722617699*"
      }, { quoted: mek });
    }

    // Block mode check
    if (config.MV_BLOCK === "true" && !isMe && !isSudo && !isOwner) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return await conn.sendMessage(from, {
        text: "*This command currently only works for the Bot owner. To disable it for others, use the .settings command 👨‍🔧.*"
      }, { quoted: mek });
    }

    if (!q) return await reply('*Enter TV show name..📺*');

    // TV sources
    const sources = [
      { name: "CINESUBZ", cmd: "cinetv" },
      { name: "SINHALASUB", cmd: "sinhalasubtv" },
      { name: "SLANIME", cmd: "slanimetv" }
    ];

    // Load image buffer
    let imageBuffer;
    try {
      const res = await axios.get('https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg', {
        responseType: 'arraybuffer'
      });
      imageBuffer = Buffer.from(res.data, 'binary');
    } catch {
      imageBuffer = null; // fallback
    }

    const caption = `_*VISPER SEARCH SYSTEM 📺*_\n\n*\`Input :\`* ${q}\n\n_*🌟 Select your preferred TV show site*_`;

    if (config.BUTTON === "true") {
      // NativeFlow list buttons
      const listButtons = {
        title: "❯❯ Choose a TV source ❮❮",
        sections: [
          {
            title: "❯❯ Choose a TV source ❮❮",
            rows: sources.map(src => ({
              title: `${src.name} Results 📺`,
              id: prefix + src.cmd + ' ' + q
            }))
          }
        ]
      };

      return await conn.sendMessage(from, {
        image: imageBuffer || { url: config.LOGO },
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "tv_menu_list",
            buttonText: { displayText: "📺 Select Option" },
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
      // Classic buttons fallback
      const buttons = sources.map(src => ({
        buttonId: prefix + src.cmd + ' ' + q,
        buttonText: { displayText: `_${src.name} Results 📺_` },
        type: 1
      }));

      return await conn.buttonMessage2(from, {
        image: { url: config.LOGO },
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


//============================================================================================


cmd({
    pattern: "1377",	
    react: '🔎',
    category: "movie",
alias: ["cinesubz"],
	    desc: "1377x movie search",
    use: ".1377 2025",
   
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isSudo, isOwner, isPre, isMe, reply }) => {
try{
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
	
 if(!q) return await reply('*please give me text !..*')
const url = await fetchJson(`https://1337-x.vercel.app/search/${q}`);


      
var srh = [];  
for (var i = 0; i < url.length; i++) {
srh.push({
title: (url[i].title || "No result")
    .replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "")
    .replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", ""),

description: '',
rowId: prefix + `xt ${url[i].link}&${url[i].title}`
});
}

const sections = [{
title: "1377x.to results",
rows: srh
}	  
]
const listMessage = {
text: `_*1377x MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: '1377x.to results',
buttonText: '*Reply Below Number 🔢*',
sections
}
const caption = `_*1377x MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`

  const rowss = url.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `xt ${url[i].link}&${url[i].title}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})




cmd({
    pattern: "xt",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

 
const dllinkk = q.split("&")[0]
const title =  q.split("&")[1]

console.log(dllinkk)
const mail = config.SEEDR_MAIL
const password = config.SEEDR_PASSWORD
   if (!mail || password.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { 
    text: `*Please add Seedr account mail and password ❗*

_💁‍♂️ How to create a Seedr account :_

*📍 Use these commands to add a Seedr account for the bot:*

🧩 .setmail *Your Seedr account email*

🧩 .setpassword *Your Seedr account password*` 
}, { quoted: mek });

        }
        
        const seedr = new Seedr();

	    try {
        await seedr.login(mail, password);
 } catch (loginError) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*Can't login to Seedr. Try again ❌*" }, { quoted: mek });
        }

	  await conn.sendMessage(from, { text: '*Seedr account login sucssess ☑️*' });
const url = await fetchJson(`https://1337-x.vercel.app/info?url=${dllinkk}`);
if (!url || !url.dllink) {
    await conn.sendMessage(from, { text: "🚩 *Error: No download link found!*" }, { quoted: mek });
    return;
}
const y = `${url.dllink}`;

       
        const inp_mag = await seedr.addMagnet(y);
        if (!inp_mag || !inp_mag.result) throw new Error('Failed to add magnet URL.');

       

        const info = await seedr.getVideos();
        if (!info || info.length === 0) throw new Error('No videos found for the provided magnet URL.');

       
        for (const video of info) {
            for (const file of video) {
                try {
                    const get_vid = await seedr.getFile(file.id);
                    const down_link = get_vid.url;

                    if (!down_link || typeof down_link !== 'string') throw new Error('Invalid download link received.');

                    const response = await fetch(down_link);
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    const fileBuffer = await response.buffer();
                    if (!fileBuffer || fileBuffer.length === 0) throw new Error('File buffer is empty or invalid.');

                    const fileSizeInMB = fileBuffer.byteLength / (1024 * 1024);
                    if (fileSizeInMB > 2000) throw new Error(`File size exceeds limit: ${fileSizeInMB.toFixed(2)} MB.`);
 if (file.fid) await seedr.deleteFolder(file.fid);
                   

			 await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

      await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

                    await conn.sendMessage(config.JID || from, {
                        document: fileBuffer,
                        mimetype: "video/mp4",
                        fileName: `${title}.mp4`,
                      
                        caption: `*🎬 Name :* ${title}\n\n${config.NAME}`
                    });

               
                     await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID} ✔*` }, { quoted: mek });


                   
                } catch (err) {
                    console.error(`Error uploading file: ${err.message}`);
                    await conn.sendMessage(from, { text: `❌ Failed to upload file: ${err.message}` }, { quoted: mek });
                }
            }
        }
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(`❌ *Error Occurred!!*\n\n${e.message}`);
    }
});

//===============================================================================================================

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
               const finaldl = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${datae}&apikey=cd0d0874c61d4a80`);

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

                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

                // Send document
                await conn.sendMessage(config.JID || from, { 
                    document: { url: downloadUrl },
                    caption: `*🎬 Name :* *${datas}*\n\n*\`${qa}\`*\n\n${config.NAME}`,
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



cmd(
  {
    pattern: 'ctdetails2',
    react: '\uD83C\uDFA5',
    desc: 'moive downloader',
    filename: __filename,
  },
  async (
    _0x22c949,
    _0x58a64f,
    _0x38232c,
    { from: _0x51bc8a, q: _0x5e9312, isMe: _0x3d4b97, reply: _0xeed5bb }
  ) => {
    try {
      if (!_0x5e9312) {
        return await _0xeed5bb('*please give me text !..*')
      }
      let _0x321f9a = await cinesubz_info(_0x5e9312)
      const _0x14e42c = (
        await axios.get(
          'https://raw.githubusercontent.com/nadeenbot2009/sturdy-goggles/refs/heads/main/data.json'
        )
      ).data
      let _0xd4d140 =
        '*`꧁Ðł₦Kλ MØVłEŞ ŁK꧂`*\n\n*▫️️\uD83C\uDF5F \uD835\uDDE7ɪᴛʟᴇ \u27AE* *_' +
        (_0x321f9a.data.title || 'N/A') +
        '_*\n\n*▫️️\uD83D\uDCC5 \uD835\uDDE5ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ \u27AE* _' +
        (_0x321f9a.data.date || 'N/A') +
        '_\n*▫️️\uD83C\uDF0E \uD835\uDDD6ᴏᴜɴᴛʀʏ \u27AE* _' +
        (_0x321f9a.data.country || 'N/A') +
        '_\n*▫️️\uD83D\uDC83 \uD835\uDDE5ᴀᴛɪɴɢ \u27AE* _' +
        (_0x321f9a.data.imdb || 'N/A') +
        '_\n*▫️️\u23F0 \uD835\uDDE5ᴜɴᴛɪᴍᴇ \u27AE* _' +
        (_0x321f9a.data.runtime || 'N/A') +
        '_\n*▫️️\uD83D\uDC64 \uD835\uDDE6ᴜʙᴛɪᴛʟᴇ ʙʏ \u27AE* _' +
        (_0x321f9a.data.subtitle_author || 'N/A') +
        '_\n*▫️️\uD83C\uDFAD \uD835\uDDDAᴇɴᴀʀᴇꜱ \u27AE* _' +
        (_0x321f9a.data.genres.join(', ') || 'N/A') +
        '_\n\n> 🎯 Join us : *' +
        _0x14e42c.chlink +
        '*\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_\n'
      await _0x22c949.sendMessage(config.DINKA, {
        image: { url: _0x321f9a.data.image.replace('-200x300', '') },
        caption: _0xd4d140,
      })
      await _0x22c949.sendMessage(_0x51bc8a, {
        react: {
          text: '\u2714️',
          key: _0x38232c.key,
        },
      })
    } catch (_0x286082) {
      console.error('Error fetching or sending', _0x286082)
      await _0x22c949.sendMessage(_0x51bc8a, '*Error fetching or sending *', {
        quoted: _0x38232c,
      })
    }
  }
)

cmd(
  {
    pattern: 'cztv',
    react: '\uD83D\uDD0E',
    category: 'movie',
    alias: ['ctv'],
    desc: 'cinesubz.net tv shows search',
    use: '.cinetv  2025',
    filename: __filename,
  },
  async (
    _0x1287f8,
    _0x5d9b17,
    _0x348006,
    {
      from: _0xdcbdb5,
      q: _0x1507b1,
      prefix: _0xe17772,
      isMe: _0x247929,
      reply: _0x503ca4,
    }
  ) => {
    try {
      if (!_0x1507b1) {
        return await _0x503ca4('*please give me text !..*')
      }
      let _0x141582 = await fetchJson(
        'https://darksadas-yt-cinesubz-tv-search.vercel.app/?query=' + _0x1507b1
      )
      if (!_0x141582 || !_0x141582.data || _0x141582.data.length === 0) {
        return (
          await _0x1287f8.sendMessage(_0xdcbdb5, {
            react: {
              text: '\u274C',
              key: _0x348006.key,
            },
          }),
          await _0x1287f8.sendMessage(
            _0xdcbdb5,
            { text: '*No results found \u274C*' },
            { quoted: _0x348006 }
          )
        )
      }
      var _0x4ed5a1 = []
      for (var _0x42f2e8 = 0; _0x42f2e8 < _0x141582.data.length; _0x42f2e8++) {
        _0x4ed5a1.push({
          title:
            _0x141582.data[_0x42f2e8].title
              .replace('Sinhala Subtitles | සිංහල උපසිරැසි සමඟ', '')
              .replace('Sinhala Subtitle | සිංහල උපසිරැසි සමඟ', '') ||
            'Result not found',
          description: '',
          rowId: _0xe17772 + 'cinetvdl2 ' + _0x141582.data[_0x42f2e8].link,
        })
      }
      const _0x1aed7d = [
          {
            title: 'cinesubz.net results',
            rows: _0x4ed5a1,
          },
        ],
        _0x7f4d5e = {
          text:
            '_*CINESUBZ TV SHOWS RESULTS \uD83D\uDCFA*_\n\n*`\uD83D\uDCF2Input :`* ' +
            _0x1507b1,
          footer: config.FOOTER,
          title: 'cinesubz.net results',
          buttonText: '*Reply Below Number \uD83D\uDD22*',
          sections: _0x1aed7d,
        }
      await _0x1287f8.listMessage(_0xdcbdb5, _0x7f4d5e, _0x348006)
    } catch (_0x97ea1d) {
      console.log(_0x97ea1d)
      await _0x1287f8.sendMessage(
        _0xdcbdb5,
        { text: '\uD83D\uDEA9 *Error !!*' },
        { quoted: _0x348006 }
      )
    }
  }
)
cmd(
  {
    pattern: 'cinetvdl2',
    react: '\uD83C\uDFA5',
    desc: 'moive downloader',
    filename: __filename,
  },
  async (
    _0x332b3c,
    _0x426a14,
    _0x1180b8,
    {
      from: _0xb02647,
      q: _0x230fab,
      isMe: _0x3c4855,
      prefix: _0x465d64,
      reply: _0x23aa73,
    }
  ) => {
    try {
      if (!_0x230fab || !_0x230fab.includes('https://cinesubz.co/tvshows')) {
        return (
          console.log('Invalid input:', _0x230fab),
          await _0x23aa73('*\u2757 This is a movie, please use .mv command.*')
        )
      }
      let _0x21b852 = await fetchJson(
          'https://darksadas-yt-cineszub-tv-shows.vercel.app/?url=' +
            _0x230fab +
            '&apikey=pramashi'
        ),
        _0x1da3d6 =
          '*\uD83C\uDF5F \uD835\uDDE7ɪᴛʟᴇ \u27AE* *_' +
          (_0x21b852.data.title || 'N/A') +
          '_*\n\n*\uD83D\uDCC5 \uD835\uDDE5ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ \u27AE* _' +
          (_0x21b852.data.date || 'N/A') +
          '_\n*\uD83C\uDF0E \uD835\uDDD6ᴏᴜɴᴛʀʏ \u27AE* _' +
          (_0x21b852.data.country || 'N/A') +
          '_\n*\uD83D\uDC83 \uD835\uDDE5ᴀᴛɪɴɢ \u27AE* _' +
          (_0x21b852.data.imdb || 'N/A') +
          '_\n*\u23F0 \uD835\uDDE5ᴜɴᴛɪᴍᴇ \u27AE* _' +
          (_0x21b852.data.runtime || 'N/A') +
          '_\n*\uD83D\uDC64 \uD835\uDDE6ᴜʙᴛɪᴛʟᴇ ʙʏ \u27AE* _' +
          (_0x21b852.data.subtitle_author || 'N/A') +
          '_\n*\uD83C\uDFAD \uD835\uDDDAᴇɴᴀʀᴇꜱ \u27AE* ' +
          (_0x21b852.data.genres.join(', ') || 'N/A') +
          '\n'
      var _0x3b2963 = []
      _0x3b2963.push(
        {
          buttonId: _0x465d64 + 'ctdetailss2 ' + _0x230fab,
          buttonText: { displayText: 'Details Card' },
          type: 1,
        },
        {
          buttonId: _0x465d64 + 'dlc2 ' + _0x230fab,
          buttonText: { displayText: 'All Epishodes Send\n' },
          type: 1,
        }
      )
      _0x21b852.data.episodes.map((_0x234af3) => {
        _0x3b2963.push({
          buttonId:
            _0x465d64 +
            ('dlcc ' +
              _0x21b852.data.image +
              '\xB1' +
              _0x234af3.episode_link +
              '\xB1' +
              _0x21b852.data.title +
              ' *`' +
              _0x234af3.title +
              '`*'),
          buttonText: { displayText: '' + _0x234af3.title },
          type: 1,
        })
      })
      const _0x1278d5 = {
        image: { url: _0x21b852.data.image.replace('-200x300', '') },
        caption: _0x1da3d6,
        footer: config.FOOTER,
        buttons: _0x3b2963,
        headerType: 4,
      }
      return await _0x332b3c.buttonMessage(_0xb02647, _0x1278d5, _0x1180b8)
    } catch (_0x24c299) {
      console.log(_0x24c299)
      await _0x332b3c.sendMessage(
        _0xb02647,
        { text: '\uD83D\uDEA9 *Error !!*' },
        { quoted: _0x1180b8 }
      )
    }
  }
)
cmd(
  {
    pattern: 'cinefirstdl2',
    react: '\uD83C\uDFAC',
    alias: ['tv'],
    desc: 'Moive downloader',
    filename: __filename,
  },
  async (
    _0x41afc4,
    _0x3d5ce2,
    _0x11df25,
    {
      from: _0x43d8db,
      q: _0x29a7d6,
      prefix: _0x42fd38,
      isMe: _0x2a12ff,
      reply: _0x563f89,
    }
  ) => {
    try {
      if (!_0x29a7d6) {
        return await _0x563f89('*please give me text !..*')
      }
      const _0x39ba0f = _0x29a7d6.split('\xB1')[0],
        _0x134469 = _0x29a7d6.split('\xB1')[1],
        _0xb5ded2 = _0x29a7d6.split('\xB1')[2]
      let _0x4e0ab2 = await fetchJson(
        'https://darksadas-yt-cineszub-tv-shows-firstdl.vercel.app/?url=' +
          _0x134469 +
          '&apikey=pramashi'
      )
      if (_0x4e0ab2.length < 1) {
        return await _0x41afc4.sendMessage(
          _0x43d8db,
          { text: N_FOUND },
          { quoted: _0x11df25 }
        )
      }
      var _0x2c2b78 = []
      for (var _0xcf1142 = 0; _0xcf1142 < _0x4e0ab2.data.length; _0xcf1142++) {
        _0x2c2b78.push({
          title:
            _0x4e0ab2.data[_0xcf1142].quality +
            '  ' +
            _0x4e0ab2.data[_0xcf1142].size,
          description: '',
          rowId:
            _0x42fd38 +
            ('dlc2 ' +
              _0x4e0ab2.data[_0xcf1142].link +
              '\xB1' +
              _0x39ba0f +
              '\xB1' +
              _0xb5ded2 +
              '\n\t\n\t*`' +
              _0x4e0ab2.data[_0xcf1142].quality +
              '`*'),
        })
      }
      const _0x471998 = [
          {
            title: '_[Select quaility \uD83C\uDFAC]_',
            rows: _0x2c2b78,
          },
        ],
        _0x50b13a = {
          text: '*\uD83C\uDFACSelect quaility \uD83C\uDFAC*',
          footer: config.FOOTER,
          title: '_[cinesubz.net results \uD83C\uDFAC]_',
          buttonText: '*`Reply Below Number \uD83D\uDD22`*\n',
          sections: _0x471998,
        }
      await _0x41afc4.listMessage(_0x43d8db, _0x50b13a, _0x11df25)
    } catch (_0x51a52c) {
      console.log(_0x51a52c)
      await _0x41afc4.sendMessage(
        _0x43d8db,
        { text: '\uD83D\uDEA9 *Error !!*' },
        { quoted: _0x11df25 }
      )
    }
  }
)
cmd(
  {
    pattern: 'dlc2',
    react: '\u2B07️',
    dontAddCommandList: true,
    filename: __filename,
  },
  async (
    _0x22712c,
    _0x269a9b,
    _0x140030,
    { from: _0x1e565d, q: _0x1045a9, isMe: _0x2c122c, reply: _0x50a86c }
  ) => {
    if (!_0x1045a9) {
      return await _0x50a86c('*Please provide a direct URL!*')
    }
    try {
      let _0x7c4a79 = await cinesubz_tvshow_info(_0x1045a9)
      console.log('API Response:', JSON.stringify(_0x7c4a79, null, 2))
      if (
        !_0x7c4a79.data ||
        !Array.isArray(_0x7c4a79.data.episodes) ||
        _0x7c4a79.data.episodes.length === 0
      ) {
        return await _0x22712c.sendMessage(
          _0x1e565d,
          { text: 'No episodes found in the provided URL.' },
          { quoted: _0x269a9b }
        )
      }
      await _0x22712c.sendMessage(
        _0x1e565d,
        { text: '*Epishodes fetching started...\uD83D\uDD02*' },
        { quoted: _0x269a9b }
      )
      let _0xa917ff = _0x7c4a79.data.episodes
        .map((_0x69358c) => _0x69358c.link)
        .filter(
          (_0x2a412a) =>
            typeof _0x2a412a === 'string' && _0x2a412a.trim() !== ''
        )
      if (_0xa917ff.length === 0) {
        return await _0x22712c.sendMessage(
          _0x1e565d,
          { text: 'No valid episode links found.' },
          { quoted: _0x269a9b }
        )
      }
      const _0x1e6c04 = _0x7c4a79.data.title || 'Unknown_Show',
        _0x368cfc =
          _0x7c4a79.data.mainImage ||
          'https://files.catbox.moe/3mvn78.png'
      fetchEpisodesWithRetry(
        _0xa917ff,
        _0x22712c,
        _0x269a9b,
        _0x1e565d,
        _0x50a86c,
        _0x1e6c04,
        _0x368cfc
      )
    } catch (_0x257e81) {
      console.error('Error fetching or sending:', _0x257e81)
      await _0x22712c.sendMessage(
        _0x1e565d,
        { text: '*Error fetching or sending*' },
        { quoted: _0x269a9b }
      )
    }
  }
)
async function fetchEpisodesWithRetry(
  _0x3d70ae,
  _0x98cca9,
  _0x4ee43b,
  _0x46d838,
  _0x217240,
  _0xacc982,
  _0x516702,
  _0x4f1ff0 = 3
) {
  let _0x1cf60b = 0
  async function _0xababeb(_0x37a5c9 = 1) {
    if (_0x1cf60b >= _0x3d70ae.length) {
      await _0x98cca9.sendMessage(
        _0x46d838,
        { text: '*All episodes sent successfully \u2611️*' },
        { quoted: _0x4ee43b }
      )
      return
    }
    let _0x45b96d = _0x3d70ae[_0x1cf60b]
    try {
      let _0x37da27 = await cinesubz_tv_firstdl(_0x45b96d)
      console.log(_0x37da27)
      if (
        !_0x37da27 ||
        !_0x37da27.dl_links ||
        _0x37da27.dl_links.length === 0
      ) {
        throw new Error(
          'Episode ' + (_0x1cf60b + 1) + ': No valid download link found.'
        )
      }
      const _0x4ce763 = config.MV_SIZE,
        _0x22c0b7 = _0x37da27.dl_links[_0x4ce763],
        _0x2a136a = _0x22c0b7.link,
        _0x3b980e = await download(_0x2a136a)
      if (!_0x3b980e || !_0x3b980e.result || !_0x3b980e.result.direct) {
        throw new Error(
          'Episode ' + (_0x1cf60b + 1) + ': No direct download link found.'
        )
      }
      const _0x2e4774 = _0x3b980e.result.direct
      if (!_0x2e4774.startsWith('http')) {
        throw new Error('Invalid download URL: ' + _0x2e4774)
      }
      const _0x1d673f = await axios.get(_0x2e4774, {
        responseType: 'arraybuffer',
      })
      if (!_0x1d673f.data) {
        throw new Error('Failed to fetch episode data.')
      }
      const _0x2ad2de = Buffer.from(_0x1d673f.data, 'binary'),
        _0x40c979 = _0xacc982 + '📺VISPER📺 Episode' + (_0x1cf60b + 1) + '.mp4'
      await _0x98cca9.sendMessage(config.JID2, {
        document: _0x2ad2de,
        caption:
          '*\uD83D\uDCFA Episode ' +
          (_0x1cf60b + 1) +
          ' - ' +
          _0xacc982 +
          '*\n\n\n' +
          config.NAME +
          '\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_',
        jpegThumbnail: await (await fetch(_0x516702)).buffer(),
        mimetype: 'video/mp4',
        fileName: _0x40c979,
      })
    } catch (_0x492c72) {
      console.error(
        'Error fetching Episode ' +
          (_0x1cf60b + 1) +
          ', Attempt ' +
          _0x37a5c9 +
          ':',
        _0x492c72
      )
      if (_0x37a5c9 < _0x4f1ff0) {
        return (
          console.log(
            'Retrying Episode ' +
              (_0x1cf60b + 1) +
              ' (Attempt ' +
              (_0x37a5c9 + 1) +
              ')...'
          ),
          setTimeout(() => _0xababeb(_0x37a5c9 + 1), 5000)
        )
      } else {
        await _0x98cca9.sendMessage(
          _0x46d838,
          {
            text:
              '*\u26A0️ Failed to fetch Episode ' +
              (_0x1cf60b + 1) +
              ' after ' +
              _0x4f1ff0 +
              ' attempts.*',
          },
          { quoted: _0x4ee43b }
        )
      }
    }
    _0x1cf60b++
    setTimeout(() => _0xababeb(), 5000)
  }
  _0xababeb()
}
cmd(
  {
    pattern: 'dlcc2',
    react: '\u2B07️',
    dontAddCommandList: true,
    filename: __filename,
  },
  async (
    _0x11a335,
    _0x2d6a75,
    _0x58f953,
    { from: _0x50017e, q: _0x174977, isMe: _0x22e78e, reply: _0x17f9fc }
  ) => {
    if (!_0x174977) {
      return await _0x17f9fc('*Please provide a direct URL!*')
    }
    try {
      const _0x24920b = _0x174977.split('\xB1')[0],
        _0x46fd1a = _0x174977.split('\xB1')[1],
        _0x49e584 = _0x174977.split('\xB1')[2]
      let _0x2b76d7 = await cinesubz_tv_firstdl(_0x46fd1a)
      if (_0x2b76d7.length < 1) {
        return await _0x11a335.sendMessage(
          _0x50017e,
          { text: 'Not Found' },
          { quoted: _0x2d6a75 }
        )
      }
      const _0x4c5fcf = _0x2b76d7.dl_links[0],
        _0x5f4aed = '' + _0x4c5fcf.link,
        _0xa9c241 = await download(_0x5f4aed)
      if (!_0xa9c241) {
        throw new Error('No direct download link found. Try again...')
      }
      const _0x3c4ef9 = '' + _0xa9c241.result.direct,
        _0x3ce09b = await axios.get(_0x3c4ef9, { responseType: 'arraybuffer' }),
        _0x3b92ee = Buffer.from(_0x3ce09b.data, 'binary'),
        _0x146a97 = '' + _0x24920b
      await _0x11a335.sendMessage(_0x50017e, {
        react: {
          text: '\u2B06️',
          key: _0x2d6a75.key,
        },
      })
      await _0x11a335.sendMessage(
        _0x50017e,
        { text: '*Uploading your movie..\u2B06️*' },
        { quoted: _0x2d6a75 }
      )
      await _0x11a335.sendMessage(config.JID, {
        document: { url: _0x3c4ef9 },
        caption:
          '\uD83C\uDFAC' +
          _0x49e584 +
          '\n\n' +
          config.NAME +
          '\n\n> _*\uD83C\uDFACNADEEN MD\uD83C\uDFAC*_',
        mimetype: 'video/mp4',
        jpegThumbnail: await (await fetch(_0x146a97)).buffer(),
        fileName: '📺VISPER📺'+ _0x49e584 + '.mp4',
      })
      await _0x11a335.sendMessage(_0x50017e, {
        react: {
          text: '\u2714️',
          key: _0x2d6a75.key,
        },
      })
      await _0x11a335.sendMessage(
        _0x50017e,
        { text: '*Movie send Successfull this JID ' + config.JID2 + ' \u2714*' },
        { quoted: _0x2d6a75 }
      )
    } catch (_0x3274de) {
      console.error('Error fetching or sending', _0x3274de)
      await _0x11a335.sendMessage(_0x50017e, '*Error fetching or sending *', {
        quoted: _0x2d6a75,
      })
    }
  }
)
cmd(
  {
    pattern: 'ctdetailss2',
    react: '\uD83C\uDFA5',
    desc: 'moive downloader',
    filename: __filename,
  },
  async (
    _0x216740,
    _0x3b8ba7,
    _0x45e796,
    { from: _0x58fa80, q: _0xc6a750, isMe: _0x3a23d5, reply: _0x58945e }
  ) => {
    try {
      if (!_0xc6a750) {
        return await _0x58945e('*please give me text !..*')
      }
      let _0x4be87d = await fetchJson(
        'https://darksadas-yt-cineszub-tv-shows.vercel.app/?url=' +
          _0xc6a750 +
          '&apikey=pramashi'
      )
      const _0x3a37ae = (
        await axios.get(
          'https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json'
        )
      ).data
      let _0x3796d5 =
        '*`꧁Ðł₦Kλ MØVłEŞ ŁK꧂`*\n\n*\uD83C\uDF5F \uD835\uDDE7ɪᴛʟᴇ \u27AE* *_' +
        (_0x4be87d.data.title || 'N/A') +
        '_*\n\n*\uD83D\uDCC5 \uD835\uDDE5ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ \u27AE* _' +
        (_0x4be87d.data.date || 'N/A') +
        '_\n*\uD83C\uDF0E \uD835\uDDD6ᴏᴜɴᴛʀʏ \u27AE* _' +
        (_0x4be87d.data.country || 'N/A') +
        '_\n*\uD83D\uDC83 \uD835\uDDE5ᴀᴛɪɴɢ \u27AE* _' +
        (_0x4be87d.data.imdb || 'N/A') +
        '_\n*\u23F0 \uD835\uDDE5ᴜɴᴛɪᴍᴇ \u27AE* _' +
        (_0x4be87d.data.runtime || 'N/A') +
        '_\n*\uD83D\uDC64 \uD835\uDDE6ᴜʙᴛɪᴛʟᴇ ʙʏ \u27AE* _' +
        (_0x4be87d.data.subtitle_author || 'N/A') +
        '_\n*\uD83C\uDFAD \uD835\uDDDAᴇɴᴀʀᴇꜱ \u27AE* ' +
        (_0x4be87d.data.genres.join(', ') || 'N/A') +
        '\n\n> \uD83C\uDF1F Join us : *' +
        _0x3a37ae.tvlink +
        '*\n\n> *•ɴᴀᴅᴇᴇɴ-ᴍᴅ•*'
      await _0x216740.sendMessage(config.JID2, {
        image: { url: _0x4be87d.data.image.replace('-200x300', '') },
        caption: _0x3796d5,
      })
      await _0x216740.sendMessage(_0x58fa80, {
        react: {
          text: '\u2714️',
          key: _0x45e796.key,
        },
      })
    } catch (_0x1c568c) {
      console.error('Error fetching or sending', _0x1c568c)
      await _0x216740.sendMessage(_0x58fa80, '*Error fetching or sending *', {
        quoted: _0x45e796,
      })
    }
  }
)


    
        
 
        
            
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

> 🌟 Follow us : *${details.chlink}*

> _*VISPER MD MULTIDEVICE*_
`
await conn.sendMessage(config.JID || from, { image: { url: sadas.image }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});






















//=====================================================================================================================

cmd({
    pattern: "cinetv",	
    react: '🔎',
    category: "movie",
alias: ["ctv"],
        desc: "cinesubz.co tv shows search",
    use: ".cinetv  2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, isSudo, isPre, isOwner, reply }) => {
try{


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
 if(!q) return await reply('*please give me text !..*')
let url = await fetchJson(`https://darksadas-yt-cinesubz-tv-search.vercel.app/?query=${q}`)
	

  if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: url.data[i].title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")|| 'Result not found',
description: '',
rowId: prefix + 'cinetvdl ' + url.data[i].link
});
}

const sections = [{
title: "cinesubz.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*CINESUBZ TV SHOWS RESULTS 📺*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'cinesubz.co results',
buttonText: '*Reply Below Number 🔢*',
sections
}
 const caption = `_*CINESUBZ TV SHOWS RESULTS 📺*_

*\`Input :\`* ${q}`;

    // ✅ Button mode toggle
    const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinetvdl ${url.data[i].link}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "cinetvdl",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{
if (!q || !q.includes('https://cinesubz.co/tvshows')) {
    console.log('Invalid input:', q);
    return await reply('*❗ This is a movie, please use .mv command.*');
}

let sadas = await cinesubz_tvshow_info(q)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.director || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.category.join(', ') || 'N/A'}
`

 
var rows = [];  

rows.push(
    { buttonId: prefix + 'ctdetailss ' + q, buttonText: { displayText: 'Details Card' }, type: 1 },
    { buttonId: prefix + 'dlc ' + q, buttonText: { displayText: 'All Epishodes Send\n' }, type: 1 }
);
	
  sadas.data.episodes.map((v) => {
	rows.push({
        buttonId: prefix + `cinefirstdl ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*`,
        buttonText: { displayText: `${v.number}` },
        type: 1
          }
		 
		  //{buttonId: prefix + 'cdetails ' + q, buttonText: {displayText: 'Details send'}, type: 1}
		 
		 
		 );
        })




  
const buttonMessage = {
 
image: {url: sadas.data.mainImage.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.data.episodes.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.number}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `cinefirstdl ${sadas.data.mainImage}±${v.link}±${sadas.data.title} *\`${v.number}\`*` // Make sure your handler understands this format
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
    image: { url: sadas.data.mainImage.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'ctdetailss ' + q,
            buttonText: { displayText: "Details Send" },
            type: 1
        },
	    {
            buttonId: prefix + 'dlc ' + q,
            buttonText: { displayText: "All Epishodes Send" },
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



cmd({
  pattern: "cinefirstdl",	
  react: '🎬',
  alias: ["tv"],
  desc: "Movie downloader",
  filename: __filename
}, async (conn, m, mek, { from, q, prefix, isMe, reply }) => {
  try {
    if (!q) return await reply('*⚠️ Please provide a valid search query or URL.*');

    console.log('[CINE-FIRSTDL] Query:', q);
    
    const [dllink, img, title] = q.split("±");

    if (!img) return await reply('*🚫 Invalid format. Expected "link±imageURL".*');

    const results = await cinesubz_tv_firstdl(img);
    if (!results?.dl_links?.length) {
      return await conn.sendMessage(from, { text: '*❌ No download links found!*' }, { quoted: mek });
    }

    const rows = results.dl_links.map(dl => ({
      title: `${dl.quality} - ${dl.size}`,
      description: '',
      rowId: prefix + `tvdll ${dllink}&${title}&${dl.direct_link}`
    }));

    const sections = [{
      title: "🎥 Select your preferred quality below:",
      rows
    }];

    const caption = `*🍿 Episode Title:* ${title}_*_\n\n*🔢 Choose a quality from the list below:*`;

    // 💬 Toggle List Message or Button Mode
    if (config.BUTTON === "true") {
      return await conn.sendMessage(from, {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: "🎬 Select Quality",
        sections
      }, { quoted: mek });
    } else {
      const listMessage = {
        text: caption,
        footer: config.FOOTER,
        title: '📺 Cinesubz.lk Download Options',
        buttonText: '🔽 Tap to select quality',
        sections
      };
      return await conn.listMessage(from, listMessage, mek);
    }

  } catch (err) {
    console.error('[CINE-FIRSTDL ERROR]', err);
    await reply('🚫 *An unexpected error occurred!*\n\n' + err.message || err);
  }
});

  cmd({
    pattern: "tvdll",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) return await reply('*Please provide a direct URL!*');

    try {
        console.log("Query:", q);
        await conn.sendMessage(from, { text: `*Downloading your movie..⬇️*` }, { quoted: mek });

        const [dllink, img, title] = q.split("&");
        if (!dllink || !img || !title) {
            return await reply("*Invalid format. Make sure all 3 parts are provided with `&` separator.*");
        }

        const mh = await download(title)
console.log(mh)
	    
        const mediaUrl = mh.result.direct.trim();
     

        const botimgUrl = dllink.trim();
        const botimgResponse = await fetch(botimgUrl);
        const botimgBuffer = await botimgResponse.buffer();
        const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

        const dat = Date.now();
        const message = {
            document: { url: mediaUrl },
            caption: `*🎬 Name :* ${img}\n\n${config.NAME}`,
            jpegThumbnail: resizedBotImg,
            mimetype: "video/mp4",
            fileName: `${img}.mp4`,
        };

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Uploading your movie..⬆️*` }, { quoted: mek });
        await conn.sendMessage(config.JID || from, message);

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID:* ${config.JID || from} ✔`, quoted: mek });

    } catch (error) {
        console.error('❌ Error:', error);
        await conn.sendMessage(from, { text: '*❌ Error fetching or sending.*' }, { quoted: mek });
    }
});

cmd({
    pattern: "dlc",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    if (!q) return reply('*කරුණාකර Cinesubz URL එකක් ලබා දෙන්න !*');

    try {
        const sadas = await cinesubz_tvshow_info(q);

        if (!sadas.data || !Array.isArray(sadas.data.episodes) || sadas.data.episodes.length === 0) {
            return reply("❌ Episode එකක්වත් හමු නොවුණා.");
        }

        const episodes = sadas.data.episodes;
        const allLinks = episodes.map(ep => ep.link).filter(Boolean);
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";
        const showTitle = sadas.data.title || "Cinesubz_Show";

        const sampleEp = await cinesubz_tv_firstdl(allLinks[0]);

        // Allowed qualities keywords to look for inside quality names
        const allowedQualities = ["360", "480", "720", "1080"];

        // Object.values() to get array of dl_links entries
        const validOptions = Object.values(sampleEp.dl_links || {}).filter(item =>
            allowedQualities.some(qty => item.quality?.toLowerCase().includes(qty))
        );

        if (!validOptions.length) {
            console.log("❌ No valid quality matches. Found:", sampleEp.dl_links);
            return reply("❌ Valid quality options not found.");
        }

        // Create rows for listMessage
        let rows = validOptions.map(dl => ({
            title: `${dl.quality} - ${dl.size || "Unknown Size"}`,
            //description: 'මෙම Quality එකෙන් සියලු Episodes ලබාගන්න.',
            rowId: `${prefix}dlcq ${dl.quality}|${q}|${showTitle}`
        }));

        const sections = [{
            title: "_🎬 Download Quality තෝරන්න_",
            rows
        }];

        const listMessage = {
            text: `🎞 *${showTitle}*\n.`,
            footer: config.FOOTER,
            title: `📺 [Cinesubz Downloader]`,
            buttonText: "🔽 Quality තෝරන්න",
            sections
        };

const msg = `🎞 *${showTitle}*\n`

	    
const rowss = validOptions.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.quality} - ${v.size || "Unknown Size"}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: `${prefix}dlcq ${v.quality}|${q}|${showTitle}`// Make sure your handler understands this format
    };
  });


const listButtons = {
    title: "🎬 Choose a download quality :)",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };


	if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: config.LOGO},
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





	    
        await conn.listMessage(from, listMessage, mek);
	}

    } catch (err) {
        console.error(err);
        reply("❌ දෝෂයක් හට ගැණිනි.");
    }
});


const { delay } = require("@whiskeysockets/baileys");



cmd({
    pattern: "dlcq",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q.includes("|")) return reply("❌ Invalid format. Use: .dlcq <quality>|<url>|<title>");

    const [quality, rawUrl, rawTitle] = q.split("|");
    const url = rawUrl?.trim();
    const title = rawTitle?.trim() || "Cinesubz";

    const allowedQualities = ["360", "480", "720", "1080"];
    const isAllowed = allowedQualities.some(qty => quality.toLowerCase().includes(qty));
    if (!isAllowed) return reply("❌ Unsupported quality. Use 360, 480, 720, or 1080.");

    try {
        const sadas = await cinesubz_tvshow_info(url);
        const episodes = sadas.data.episodes;
        const showimg = sadas.data.mainImage || "https://i.ibb.co/hcyQfwy/7a265c4eee41e2b7.jpg";

        if (!episodes || !episodes.length) return reply("❌ No episodes found for this link.");

        await reply(`*📥 Starting to download episodes in *${quality}* quality...*`);

        for (let i = 0; i < episodes.length; i++) {
            const ep = episodes[i];
            let success = false;

            for (let attempt = 1; attempt <= 4; attempt++) {
                try {
                    const dlInfo = await cinesubz_tv_firstdl(ep.link);
                    const allDLs = Object.values(dlInfo.dl_links || {});
                    const matchedDL = allDLs.find(dl =>
                        dl.quality?.toLowerCase().includes(quality.toLowerCase())
                    );
                    if (!matchedDL) throw new Error("Requested quality not available.");

                    const dldata = await download(matchedDL.direct_link);
                    const mediaUrl = dldata?.result?.direct;
                    if (!mediaUrl || !mediaUrl.startsWith("http")) throw new Error("Invalid direct link");


                    const thumb = await (await fetch(ep.image || showimg)).buffer();
                    const name = ep.name || `Episode_${i + 1}`;
                    const safeName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_E${i + 1}.mp4`;

                    await conn.sendMessage(config.JID || from, {
                        document: { url: mediaUrl },
                        caption: `*📺 Name: ${title}*\n*Episode ${ep.number} - ${name}*\n\n*\`[ ${quality} ]\`*\n\n${config.NAME}`,
                        jpegThumbnail: thumb,
                        mimetype: "video/mp4",
                        fileName: safeName
                    });

                    await delay(3000); // delay between episodes
                    success = true;
                    break;
                } catch (e) {
                    console.log(`❌ Episode ${i + 1} Attempt ${attempt} Failed:`, e.message);
                    if (attempt === 4) {
                        await conn.sendMessage(from, {
                            text: `⚠️ Failed to download Episode ${i + 1} after 4 attempts.`,
                        }, { quoted: mek });
                    } else {
                        await delay(2000); // wait before next attempt
                    }
                }
            }
        }

        await reply("*✅ All episodes have been processed.*");

    } catch (err) {
        console.error(err);
        reply("❌ An error occurred while processing your request.");
    }
});




cmd({
    pattern: "ctdetailss",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')
let sadas = await fetchJson(`https://darksadas-yt-cineszub-tv-shows.vercel.app/?url=${q}&apikey=pramashi`)
	const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     

let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.genres.join(', ') || 'N/A'}

> 🌟 Follow us : *${details.chlink}*`

await conn.sendMessage(config.JID || from, { image: { url: sadas.data.image.replace("-200x300", "") }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});


//====================================================================================================


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


//=====================================================================================================

cmd({
    pattern: "pirate",	
    react: '🔎',
    category: "movie",
alias: ["pira"],
	    desc: "cinesubz.co movie search",
    use: ".pirate 2025",
   
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isSudo, isOwner, sender, isMe, reply }) => {
try{





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
 if(!q) return await reply('*please give me text !..*')
const url = await pirate_search(q);

        if (!url || !url.result || url.result.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
        }
var srh = [];  
for (var i = 0; i < url.result.length; i++) {
srh.push({
title: (url.result[i].title || "No result")
    .replace("Sinhala Subtitles", "")
    .replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", ""),

description: '',
rowId: prefix + 'pirateinfo ' + url.result[i].link
});
}

const sections = [{
title: "pirate.lk results",
rows: srh
}	  
]
const listMessage = {
text: `_*PIRATE MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'pirate.lk results',
buttonText: '*Reply Below Number 🔢*',
sections
}






const caption = `_*PIRATE MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`;

    // ✅ Button mode toggle
    const rowss = url.result.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.result[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `pirateinfo ${url.result[i].link}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "pirateinfo",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{
if (!q || !q.includes('https://pirate.lk/movies/')) {
    console.log('Invalid input:', q);
    return await reply('*❗ This is a TV series, please use .tv command.*');
}

let sadas = await pirate_dl(q)

	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.result.title  || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.result.date  || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.result.country  || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.result.imdb  || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.result.runtime  || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.result.director  || 'N/A'}_

`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push(
    { buttonId: prefix + 'pidet ' + q, buttonText: { displayText: 'Details Card\n' }, type: 1 }
    
);

	
  sadas.result.dl_links.map((v) => {
	rows.push({
        buttonId: prefix + `piratedl ${sadas.result.image}±${v.link}±${sadas.result.title}
	
	*\`[ ${v.quality} ]\`*`,
        buttonText: { 
    displayText: `${v.size}  (${v.quality} )`
        .replace("WEBDL", "")
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
		.replace("Telegram BluRay FHD", "") 
		
},
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.result.image.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.result.dl_links.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.size}  (${v.quality} )`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `piratedl ${sadas.result.image}±${v.link}±${sadas.result.title}
	
	*\`[ ${v.quality} ]\`*` // Make sure your handler understands this format
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
    image: { url: sadas.result.image.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'pidet ' + q,
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






cmd({
    pattern: "piratedl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    try {
        if (!q) {
            return await reply('*Please provide a direct URL!*');
        }

        const parts = q.split("±"); // Renamed for clarity

        // Ensure we have all three parts: imageURL, pixelDrainURL, movieName
        if (parts.length !== 3) {
            return await reply('*Invalid format! Please provide input like: imageURL±pixelDrainURL±movieName*');
        }

        const [datae, datas, dat] = parts; // Destructure the parts

        // Validate PixelDrain URL
        if (!datas || !datas.includes('https://pixeldrain.com/u/')) {
            console.log('Invalid input (PixelDrain check failed):', q);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            // Keep only the clearer error message
            return await reply('*❗ Sorry, The download URL is incorrect. Please ensure it is a valid PixelDrain link.*');
        }

        // Extract the file ID
        const da = datas.split("https://pixeldrain.com/u/")[1];

        if (!da) {
            // This is technically redundant if the includes check above passed, but good for safety
            return await reply('*Invalid PixelDrain link! Could not extract file ID.*');
        }

        const mediaUrl = `https://pixeldrain.com/api/file/${da}`.trim();
        const botimg = datae;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

        // --- Fetch thumbnail buffer safely ---
        let thumbnailBuffer;
        try {
            // Use await fetch and .buffer() for better error handling and proper async/await flow
            const response = await fetch(botimg);
            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
            thumbnailBuffer = await response.buffer();
        } catch (fetchError) {
            console.error('Error fetching thumbnail:', fetchError);
            // Optionally, continue without a thumbnail or send an error reply
            // For now, we'll log and continue with no thumbnail buffer (it will be undefined)
        }
        // --- End of thumbnail fetch ---
        
        // Use an object to dynamically include the thumbnail if it was successfully fetched
        const mediaOptions = {
            document: { url: mediaUrl },
            caption: `*🎬 Name :* ${dat}\n\n${config.NAME}`,
            mimetype: "video/mp4",
            fileName: `${dat}.mp4`
        };

        if (thumbnailBuffer) {
            mediaOptions.jpegThumbnail = thumbnailBuffer;
        }

        // Send the document
        await conn.sendMessage(config.JID || from, mediaOptions);

        await conn.sendMessage(from, { delete: up_mg.key });
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        
        // Only send this message if it was NOT sent to the original `from` chat
        if (config.JID && config.JID !== from) {
             await conn.sendMessage(from, {
                 text: `*Movie sent successfully to JID ${config.JID} ✔*`
             }, { quoted: mek });
        }

    } catch (e) {
        console.error('Command execution error:', e); // Added context to the log
        await conn.sendMessage(from, {
            text: '🚩 *An unexpected error occurred during download/upload!*', // Improved error message
        }, { quoted: mek });
        // Send a failure reaction
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});


cmd({
    pattern: "pidet",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')

let sadas = await pirate_dl(q)
const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     
	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.result.title  || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.result.date  || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.result.country  || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.result.imdb  || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.result.runtime  || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.result.director  || 'N/A'}_

> 🌟 Follow us : *${details.chlink}*`
await conn.sendMessage(config.JID || from, { image: { url: sadas.result.image.replace("-200x300", "") }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});


//==========================================================================================================

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
        console.error("🔥 SinhalaSub Error:", e);
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
    }
});
cmd({
    pattern: "sininfo",
    alias: ["mdv"],
    use: '.moviedl <url>',
    react: "🎥",
    desc: "Download movies from sinhalasub.lk",
    filename: __filename
},

async (conn, mek, m, { from, q, prefix, isMe, isOwner, reply }) => {
try {
    if (!q) return reply('🚩 *Please give me a valid movie URL!*');

    // 🔍 Validate URL
    if (!q.includes('https://sinhalasub.lk/movies/')) {
        return await reply('*❗ This appears to be a TV series. Please use the .tv command instead.*');
    }

    // 🧠 Fetch movie info from your API
    const { data: sadass } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/info?q=${encodeURIComponent(q)}`);
    const sadas = sadass.result;

    if (!sadas || Object.keys(sadas).length === 0)
        return await conn.sendMessage(from, { text: "🚩 *I couldn't find any movie info 😔*" }, { quoted: mek });

    // 🎬 Movie info caption
    const msg = `*🌾 𝗧ɪᴛʟᴇ ➮* *_${sadas.title || 'N/A'}_*

*📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱 𝗗𝗮𝘁𝗲 ➮* _${sadas.date || 'N/A'}_
*🌎 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 ➮* _${sadas.country || 'N/A'}_
*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${sadas.rating || 'N/A'}_
*⏰ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 ➮* _${sadas.duration || 'N/A'}_
*🕵️ 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${sadas.author || 'N/A'}_
`;

    // 🧩 Create buttons
    const rows = [
        { buttonId: prefix + 'daqt ' + q, buttonText: { displayText: '💡 Send Details' }, type: 1 },
        { buttonId: prefix + 'ch ' + q, buttonText: { displayText: '🖼️ Send Images' }, type: 1 }
    ];

    // Add download links
    if (sadas.downloadLinks && sadas.downloadLinks.length > 0) {
        sadas.downloadLinks.forEach(v => {
            rows.push({
                buttonId: prefix + `sindl ${v.link}±${sadas.images?.[1] || ''}±${sadas.title}`,
                buttonText: { displayText: `${v.size || 'N/A'} - ${v.quality || 'Unknown Quality'}` },
                type: 1
            });
        });
    }

    // 🧾 Prepare list menu
    const listRows = (sadas.downloadLinks || []).map(v => ({
        title: `${v.size} - ${v.quality}`,
        id: prefix + `sindl ${v.link}±${sadas.images?.[1] || ''}±${sadas.title}`
    }));

    const listButtons = {
        title: "🎬 Choose a download link :)",
        sections: [{ title: "Available Download Links", rows: listRows }]
    };

    // 🖼️ Image + Caption
    const movieImage = sadas.images?.[0] || config.LOGO;

    // ✅ BUTTON MODE ENABLED
    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: movieImage },
            caption: msg,
            footer: config.FOOTER,
            buttons: [
                { buttonId: prefix + 'daqt ' + q, buttonText: { displayText: "Details" }, type: 1 },
                { buttonId: prefix + 'ch ' + q, buttonText: { displayText: "Images" }, type: 1 },
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
        // ✅ NORMAL MODE
        await conn.sendMessage(from, {
            image: { url: movieImage },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        }, { quoted: mek });
    }

} catch (e) {
    console.log(e);
    reply('🚫 *Error Occurred !!*\n\n' + e);
}
});


let isUploadinggg = false; // Track upload status

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
console.log(`Input:`, q)
    try {
        //===================================================
        const [pix, imglink, title] = q.split("±");
        if (!pix || !imglink || !title) return await reply("⚠️ Invalid format. Use:\n`sindl link±img±title`");
        //===================================================

        const da = pix.split("https://pixeldrain.com/u/")[1];
		console.log(da)
        if (!da) return await reply("⚠️ Couldn’t extract Pixeldrain file ID.");

        const fhd = `https://pixeldrain.com/api/file/${da}`;
        isUploadinggg = true; // lock start

        //===================================================
        const botimg = imglink.trim();
    // Send "uploading..." msg without blocking
        conn.sendMessage(from, { text: '*Uploading your movie.. ⬆️*', quoted: mek });
 await conn.sendMessage(config.JID || from, { 
                document: { url: fhd },
                caption: `🎬 ${title}\n\n${config.NAME}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                //jpegThumbnail: await (await fetch(botimg)).buffer(),
                fileName: `🎬VISPER-MD🎬${title}.mp4`
            });
		
     
            
            conn.sendMessage(from, { react: { text: '✔️', key: mek.key } }),
            conn.sendMessage(from, { text: `*Movie sent successfully  ✔*`, quoted: mek })
       

    } catch (e) {
        reply('🚫 *Error Occurred !!*\n\n' + e.message);
        console.error("sindl error:", e);
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
  
cmd({
  pattern: "sinhalasubtv",	
  react: '📺',
  category: "movie",
  alias: ["sinhalatv"],
  desc: "Search TV shows from sinhalasub.lk",
  use: ".sinhalasubtv 2025",
  filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner, reply }) => {
try {

  const pr = (await axios.get('https://raw.githubusercontent.com/Nadeenpoorna-app/main-data/refs/heads/main/master.json')).data;

  // Convert string to boolean
  const isFree = pr.mvfree === "true";

  // If not free and not premium or owner
  if (!isFree && !isMe && !isPre) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
      text: "*`You are not a premium user⚠️`*\n\n" +
            "*Send a message to one of the numbers below and buy Lifetime Premium 🎉.*\n\n" +
            "_Price : 200 LKR ✔️_\n\n" +
            "*👨‍💻Contact us : 0778500326 , 0722617699*"
    }, { quoted: mek });
  }

  if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, {
      text: "*This command is currently locked for public users 🔒*\n_Use .settings to unlock it 👨‍🔧_"
    }, { quoted: mek });
  }

  if (!q) return await reply('*Please enter a search term, e.g. `.sinhalasubtv Loki`*');

  const { data } = await axios.get(`https://visper-md-ap-is.vercel.app/movie/sinhalasub/search?q=${encodeURIComponent(q)}`);

  // 🧩 Filter only TV Shows
  const results = data.filter(v => 
    /tv|series|season/i.test(v.Title)
  );

  if (results.length === 0) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    return await conn.sendMessage(from, { text: '*No TV show results found ❌*' }, { quoted: mek });
  }

  // 🧾 Format list message
  const srh = results.map(v => ({
    title: v.Title.replace("Sinhala Subtitles | සිංහල උපසිරසි සමඟ", "").trim(),
    description: '',
    rowId: prefix + 'sintvinfo ' + v.Link
  }));

  const sections = [{
    title: "🎬 sinhalasub.lk - TV Shows Results",
    rows: srh
  }];

  const caption = `*_SINHALASUB TV SHOW SEARCH RESULTS 📺_*\n\n*🔍 Input:* ${q}`;

  // 🧠 Button-Enabled or List message
  if (config.BUTTON === "true") {
    const rowss = results.map(v => ({
      title: v.Title.replace(/WEBDL|BluRay|HD|FHD|SD|Telegram/gi, "").trim(),
      id: prefix + `sintvinfo ${v.Link}`
    }));

    const listButtons = {
      title: "Choose a TV Show 🎥",
      sections: [
        {
          title: "Available TV Shows",
          rows: rowss
        }
      ]
    };

    await conn.sendMessage(from, {
      image: { url: config.LOGO },
      caption: caption,
      footer: config.FOOTER,
      buttons: [
        {
          buttonId: "tv_list",
          buttonText: { displayText: "📺 Select TV Show" },
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
    const listMessage = {
      text: caption,
      footer: config.FOOTER,
      title: 'sinhalasub.lk results 🎬',
      buttonText: '*Reply with number 🔢*',
      sections
    };
    await conn.listMessage(from, listMessage, mek);
  }

} catch (e) {
  reply('🚫 *Error occurred !!*\n\n' + e);
  console.log(e);
}
});
cmd({
    pattern: "sintvinfo",
    alias: ["mdv"],
    use: '.sintvinfo <url>',
    react: "🎥",
    desc: "Get TV show info and download links from sinhalasub.lk",
    filename: __filename
},

async (conn, mek, m, { from, q, prefix, reply, isOwner, isMe }) => {
try {

    if (!q) return reply('🚩 *Please provide a valid sinhalasub.lk TV show link!*');
    if (!q.includes('https://sinhalasub.lk/tvshows/')) {
        return await reply('*❗ Invalid link detected!*\n_This command is only for TV shows — use `.mv` for movies._');
    }

    // ✅ Fetch data from API
    const { data } = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

    if (!data || !data.result) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply('*No information found for this TV show ❌*');
    }

    const sadas = data;
    const show = sadas.result;

    // 🧾 Create episode list buttons
    const rows = [];

    // “Details” button
    rows.push({
        buttonId: prefix + 'dtaqt ' + q,
        buttonText: { displayText: '📜 Show Details' },
        type: 1
    });

    // Episode buttons
    if (show.episodes && show.episodes.length > 0) {
        show.episodes.forEach((ep) => {
            rows.push({
                buttonId: prefix + `sintvfirstdl ${ep.episode_link}+${show.image[0]}`,
                buttonText: { displayText: `${ep.title}` },
                type: 1
            });
        });
    }

    // 🎬 Caption text
    const msg = `*📺 𝗧ɪᴛʟᴇ ➮* _${show.title || 'N/A'}_\n
*📅 𝗥ᴇʟᴇᴀꜱᴇ 𝗗ᴀᴛᴇ ➮* _${show.date || 'N/A'}_
*⭐ 𝗜𝗠𝗗𝗕 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${show.imdb || 'N/A'}_
*🧑‍💻 𝗦𝘂𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${show.director || 'N/A'}_
`;

    const imageUrl = show.image?.[0] || config.LOGO;

    // 🧠 Native single-select button layout
    const rowss = (show.episodes || []).map((v) => ({
        title: v.title.replace(/BluRay|HD|FHD|SD|WEBDL|Telegram/gi, "").trim(),
        id: prefix + `sintvfirstdl ${v.episode_link}+${show.image[0]}`
    }));

    const listButtons = {
        title: "📺 Choose an Episode to Download",
        sections: [
            {
                title: "Available Episodes",
                rows: rowss
            }
        ]
    };

    // ✅ If BUTTON mode enabled
    if (config.BUTTON === "true") {
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: msg,
            footer: config.FOOTER,
            buttons: [
                {
                    buttonId: prefix + 'dtaqt ' + q,
                    buttonText: { displayText: "📜 Show Details" },
                    type: 1
                },
                {
                    buttonId: "download_list",
                    buttonText: { displayText: "🎥 Select Episode" },
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
        // 🧾 Fallback buttonMessage mode
        const buttonMessage = {
            image: { url: imageUrl },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };
        await conn.buttonMessage(from, buttonMessage, mek);
    }

} catch (e) {
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "sintvfirstdl",	
    react: '🎬',
    alias: ["tv"],
    desc: "TV Episode Downloader - SinhalaSub",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q) return await reply('*🚩 Please give me episode link!*');

    const dllink = q.split("+")[0];
    const img = q.split("+")[1];

    // ✅ Fetch episode data from API
    const { data: url } = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/dl?q=${encodeURIComponent(dllink)}&apiKey=vispermdv4`);

    if (!url?.result?.dl_links?.length)
        return await conn.sendMessage(from, { text: '*🚫 No download links found!*' }, { quoted: mek });

    const episodeTitle = url.result.title || 'Unknown Episode';
    const links = url.result.dl_links;

    // 🧾 Build list of download qualities
    const srh = links.map((v) => ({
        title: `${v.quality} - ${v.size}`,
        description: '',
        rowId: `${prefix}sintvdl ${v.link}&${episodeTitle}&${img}&${v.quality}`
    }));

    const sections = [{
        title: "🎬 Select Quality to Download",
        rows: srh
    }];

    const caption = `*🍿 Episode:* _${episodeTitle}_`;

    const listMessage = {
        text: caption,
        footer: config.FOOTER,
        title: '📺 SinhalaSub TV Downloader',
        buttonText: '*Select a quality 🎥*',
        sections
    };

    // ✅ Button mode
    if (config.BUTTON === "true") {
        return await conn.sendMessage(from, {
            text: caption,
            footer: config.FOOTER,
            title: "",
            buttonText: "📺 Select a quality",
            sections
        }, { quoted: mek });
    } else {
        await conn.listMessage(from, listMessage, mek);
    }

} catch (e) {
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "sintvdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
try {
    if (!q) return reply('*🚩 Invalid download data!*');

    const parts = q.split("&");
    const dllink = parts[0];
    const title = parts[1] || "Unknown Episode";
    const image = parts[2] || config.LOGO;
    const quality = parts[3] || "Unknown";

    // Pixeldrain link fix
    const da = dllink.split("https://pixeldrain.com/u/")[1];
    const fhd = `https://pixeldrain.com/api/file/${da}`;

    // Avoid multiple uploads
    if (global.isUploading) {
        return await conn.sendMessage(from, { 
            text: '*⏳ A file is already uploading. Please wait!*', 
            quoted: mek 
        });
    }

    global.isUploading = true;

    // Upload message
    await conn.sendMessage(from, { text: `*⬆️ Uploading your episode...*\n\n🎬 *${title} (${quality})*` }, { quoted: mek });

    const message = {
        document: { url: fhd },
        mimetype: "video/mp4",
        fileName: `🎬VISPER-MD🎬${title}.mp4`,
        caption: `🎬 *${title}*\n📺 *Quality:* ${quality}\n\n${config.FOOTER}`,
        jpegThumbnail: await (await fetch(image)).buffer(),
    };

    // ✅ Send file
    await conn.sendMessage(from, message, { quoted: mek });
    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    global.isUploading = false;

} catch (e) {
    global.isUploading = false;
    reply('🚫 *Error Occurred !!*\n\n' + e);
    console.log(e);
}
});
cmd({
    pattern: "dtaqt",
    alias: ["mdv"],
    use: '.dtaqt <url>',
    react: "🎥",
    desc: "Download movie details from SinhalaSub TV",
    filename: __filename
},
async (conn, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) return reply('🚩 *Please give me a valid SinhalaSub TV link!*');

        // API request
        let sadas = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

        // master details (for channel link)
        const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

        const result = sadas.data.result;
        if (!result) return reply('❌ *No data found for the given link!*');

        const caption = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${result.title || 'N/A'}_*\n\n` +
            `*📅 𝗥ᴇʟᴇᴀsᴇ 𝗗𝗮𝘁𝗲 ➮* _${result.date || 'N/A'}_\n` +
            `*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${result.imdb || 'N/A'}_\n` +
            `*💁‍♂️ 𝗦ᴜ𝗯𝘁𝗶𝘁𝗹𝗲 𝗕𝘆 ➮* _${result.director || 'Unknown'}_\n\n` +
            `> 🌟 Follow us : *${details.chlink || 'N/A'}*\n\n` +
            `> _*${config.FOOTER}*_`;

        // send info image + caption
        await conn.sendMessage(from, {
            image: { url: result.image[0] },
            caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error fetching or sending:', error);
        reply('🚫 *Error fetching movie details!*');
    }
});


//==================================================================
// 🖼️ SinhalaSub TV All Images Sender
//==================================================================
cmd({
    pattern: "ch",
    alias: ["tvimg"],
    use: '.ch <url>',
    react: "🖼️",
    desc: "Send all SinhalaSub TV screenshots/posters",
    filename: __filename
},
async (conn, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) return reply('🚩 *Please provide a SinhalaSub TV URL!*');

        // API request
        let sadas = await axios.get(`https://test-sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/tv/info?q=${encodeURIComponent(q)}&apiKey=vispermdv4`);

        const result = sadas.data.result;
        if (!result || !result.image || result.image.length === 0)
            return reply('⚠️ *No images found for this title!*');

        for (let url of result.image) {
            await conn.sendMessage(from, { image: { url } }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error fetching or sending images:', error);
        reply('🚫 *Error while sending images!*');
    }
});

//===========================================================================================================



//===========================================================================================================



cmd({
    pattern: "sexfull",	
    react: '🔎',
    category: "movie",
alias: ["sexmv"],
	    desc: "sexfullmovies.sbs movie search",
    use: ".sexfull 2025",
   
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isPre, isMe, isSudo, isOwner , reply }) => {
try{


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

	
 if(!q) return await reply('*please give me text !..*')
const url = await xfull_search(q);

        if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
        }
var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: (url.data[i].title || "No result")
    .replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "")
    .replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", ""),

description: '',
rowId: prefix + 'sexdl ' + url.data[i].link
});
}

const sections = [{
title: "sexfullmovies.sbs results",
rows: srh
}	  
]
const listMessage = {
text: `_*SEXFULL MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'sexfullmovies.sbs results',
buttonText: '*Reply Below Number 🔢*',
sections
}
const caption = `_*SEXFULL MOVIE SEARCH RESULTS 🎬*_

*\`Input :\`* ${q}`
 const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `sexdl ${url.data[i].link}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})

cmd({
    pattern: "sexdl",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{


let sadas = await xfull_dl(q)

	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.data.title  || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.data.date  || 'N/A'}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${sadas.data.country  || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.data.imdb  || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${sadas.data.runtime  || 'N/A'}_
*💁‍♂️ 𝗦ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _${sadas.data.subtitle_author  || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* ${sadas.data.genres.join(', ')  || 'N/A'}
`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push(
    { buttonId: prefix + 'ctdetails ' + q, buttonText: { displayText: '_Send Details_' }, type: 1 },
    { buttonId: prefix + 'ctdetails ' + q, buttonText: { displayText: '_Send Images_\n' }, type: 1 }
);

	
  sadas.dl_links.map((v) => {
	rows.push({
        buttonId: prefix + `sexdll ${sadas.data.image}±${v.link}±${sadas.data.title}
	
	*\`[ ${v.quality} ]\`*`,
        buttonText: { 
    displayText: `${v.quality}`
        .replace("WEBDL", "")
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
		.replace("Telegram BluRay FHD", "") 
		
},
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.data.image.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}
const rowss = sadas.dl_links.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.quality}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `sexdll ${sadas.data.image}±${v.link}±${sadas.data.title}
	
	*\`[ ${v.quality} ]\`*` // Make sure your handler understands this format
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
    image: { url: sadas.data.image.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'dtaqt ' + q,
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


let isUploadingggg = false; // Track upload status



cmd({
    pattern: "sexdll",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }

    if (isUploadingggg) {
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

       

const mh = `${datas}`;
        const mediaUrl = mh.trim();



	    
  const botimg = `${datae}`;

 await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

      await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

     
 await conn.sendMessage(config.JID || from, { 
            document: { url: mediaUrl },
            caption: `*🎬 Name :* ${dat}


${config.NAME}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `${dat}.mp4`
        });



        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID} ✔*` }, { quoted: mek });

    } catch (error) {
        console.error('Error fetching or sending:', error);
        await conn.sendMessage(from, { text: "*Erro fetching this moment retry now ❗*" }, { quoted: mek });
    } finally {
        isUploadingggg = false; // Reset upload status
    }
});

//================================================================================================================

cmd({
    pattern: "ytsmx",	
    react: '🔎',
    category: "movie",
    alias: ["cinesub"],
    desc: "yts.mx movie search",
	use: ".ytsmx 2025",
    filename: __filename
}, async (conn, m, mek, { from, q, prefix, isMe, isPre, isSudo, isOwner, reply }) => {
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
	    
        if (!q) return await reply('*please give me text! 👀*');

        // Make API request to YTS API for movie search
        let url = await fetchJson(`https://yts.mx/api/v2/list_movies.json?query_term=${q}`);

        if (!url.data || url.data.movies.length < 1) {
            return await conn.sendMessage(from, { text: '🚫 *No movies found!*' }, { quoted: mek });
        }

        var srh = [];
        // Loop through the results and format the data
        for (var i = 0; i < url.data.movies.length; i++) {
            srh.push({
                title: url.data.movies[i].title,
                description: url.data.movies[i].synopsis,
                rowId: prefix + 'ytnx ' + url.data.movies[i].id
            });
        }

        const sections = [{
            title: "ytsmx.mx results",
            rows: srh
        }];

        const listMessage = {
            text: `_*YTSMX MOVIE SEARCH RESULT 🎬*_

*\`Input :\`* ${q}`,
            footer: config.FOOTER,
            title: 'ytsmx.mx results',
            buttonText: '*Reply Below Number 🔢*',
            sections
        };

const caption = `_*YTSMX MOVIE SEARCH RESULT 🎬*_

*\`Input :\`* ${q}`
	    
 const rowss = url.data.movies.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data.movies[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `ytnx ${url.data.movies[i].id}` // Make sure your handler understands this format
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

	    

        await conn.listMessage(from, listMessage, mek);
}

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while searching!*' }, { quoted: mek });
    }
});


cmd({
    pattern: "ytnx",
    react: '🎥',
    desc: "Movie downloader",
    filename: __filename
}, async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
    try {
        if (!q) return await reply('*Please provide the movie URL!*');

        // Extract the movie name and year from the provided URL
     // Extracted ID (e.g., "ghost-of-new-orleans-2011")
        const movieUrl = `https://yts.mx/api/v2/movie_details.json?movie_id=${q}`;

        // Fetch movie details from YTS API using the extracted movie ID
        let movieData = await fetchJson(movieUrl);

        if (!movieData.data || !movieData.data.movie) {
            return await conn.sendMessage(from, { text: '🚫 *No movie details found!*' }, { quoted: mek });
        }

        let movie = movieData.data.movie;  // Extract movie details

	    
        let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${movie.title}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${movie.year}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${movie.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${movie.rating || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${movie.runtime || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* _${movie.genres.join(', ')}_
`;

        // If no torrents found, inform the user
        if (movie.torrents.length < 1) {
            return await conn.sendMessage(from, { text: '🚫 *No torrents available for this movie!*' }, { quoted: mek });
        }

        // Create button rows with movie download links
        var rows = [];

        rows.push({
            buttonId: prefix + 'ytsmxdet ' + movie.id, 
            buttonText: { displayText: 'Details send' },
            type: 1
        });

        // Loop through torrents and add download links to rows
        movie.torrents.forEach((torrent) => {
            rows.push({
                buttonId: prefix + `torren ${movie.small_cover_image}±${torrent.hash}±${movie.title}
	
	*\`[ ${torrent.quality} ]\`*`,
                buttonText: { displayText: `${torrent.size} - ${torrent.quality}` },
                type: 1
            });
        });

        // Build and send the message with movie details and download options
        const buttonMessage = {
            image: { url: movie.large_cover_image }, 
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };

        const rowss = movie.torrents.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.size} - ${v.quality}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `torren ${movie.small_cover_image}±${v.hash}±±${movie.title}
	
	*\`[ ${v.quality} ]\`*`// Make sure your handler understands this format
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
    image: { url: movie.large_cover_image},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'ytsmxdet ' + movie.id,
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
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while processing!*' }, { quoted: mek });
    }
});









const uploader = "sadas";

cmd({
    pattern: "torren",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

  const img = q.split("±")[0]
const dllink = q.split("±")[1]
const title =  q.split("±")[2]


const mail = config.SEEDR_MAIL
const password = config.SEEDR_PASSWORD
   if (!mail || password.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { 
    text: `*Please add Seedr account mail and password ❗*

_💁‍♂️ How to create a Seedr account :_

*📍 Use these commands to add a Seedr account for the bot:*

🧩 .setmail *Your Seedr account email*

🧩 .setpassword *Your Seedr account password*` 
}, { quoted: mek });

        }
        
        const seedr = new Seedr();

	    try {
        await seedr.login(mail, password);
 } catch (loginError) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*Can't login to Seedr. Try again ❌*" }, { quoted: mek });
        }

	  await conn.sendMessage(from, { text: '*Seedr account login sucssess ☑️*' });
  
const mgk = `magnet:?xt=urn:btih:${dllink}`
       
        const inp_mag = await seedr.addMagnet(mgk);
        if (!inp_mag || !inp_mag.result) throw new Error('Failed to add magnet URL.');

       

        const info = await seedr.getVideos();
        if (!info || info.length === 0) throw new Error('No videos found for the provided magnet URL.');

       
        for (const video of info) {
            for (const file of video) {
                try {
                    const get_vid = await seedr.getFile(file.id);
                    const down_link = get_vid.url;

                    if (!down_link || typeof down_link !== 'string') throw new Error('Invalid download link received.');

                   
                    const botimg = `${img}`

			 await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

      await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

                    await conn.sendMessage(config.JID || from, {
                        document: { url: down_link },
                        mimetype: "video/mp4",
                        fileName: `${title}.mp4`,
                        jpegThumbnail: await (await fetch(botimg)).buffer(),
                        caption: `*🎬 Name :* ${title}


${config.NAME}`
                    });

               
                     await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID} ✔*` }, { quoted: mek });


                   
                } catch (err) {
                    console.error(`Error uploading file: ${err.message}`);
                    await conn.sendMessage(from, { text: `❌ Failed to upload file: ${err.message}` }, { quoted: mek });
                }
            }
        }
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(`❌ *Error Occurred!!*\n\n${e.message}`);
    }
});



cmd({
    pattern: "ytsmxdet",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')


 const movieUrl = `https://yts.mx/api/v2/movie_details.json?movie_id=${q}`;
	  let movieData = await fetchJson(movieUrl);

        if (!movieData.data || !movieData.data.movie) {
            return await conn.sendMessage(from, { text: '🚫 *No movie details found!*' }, { quoted: mek });
        }

        let movie = movieData.data.movie;

	const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     

let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${movie.title}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${movie.year}_
*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* _${movie.country || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${movie.rating || 'N/A'}_
*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* _${movie.runtime || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* _${movie.genres.join(', ')}_

> 🌟 Follow us : *${details.chlink}*`
await conn.sendMessage(config.JID || from, { image: { url: movie.large_cover_image }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});
cmd({
    pattern: "animeheaven",	
    react: '🔎',
    category: "movie",
    desc: "Animeheaven movie search",
    use: ".animeheaven 2025",
    
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe,isSudo, isPre, isOwner, reply }) => {
try{


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
 if(!q) return await reply('*please give me text !..*')
let url = await search(q)

var srh = [];  
for (var i = 0; i < url.length; i++) {
srh.push({
title: url[i].title,
description: '',
rowId: prefix + `animeheinfo ${url[i].link}`
});
}

const sections = [{
title: "https://animeheaven.me results",
rows: srh
}	  
]
const listMessage = {
text: `*_ANIMEHEAVEN MOVIE SEARCH RESULT 🎬_*

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'https://animeheaven.me results',
buttonText: '*Reply Below Number 🔢*',
sections
}

const caption = `*_ANIMEHEAVEN MOVIE SEARCH RESULT 🎬_*

*\`Input :\`* ${q}`

	
const rowss = url.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `animeheinfo ${url[i].link}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})




cmd({
    pattern: "animeheinfo",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, isSudo, isOwner, prefix, reply }) => {
try{

    

  
let sadas = await fetchJson(`https://sadas-animeheaven-get-ep.vercel.app/api/episodes?url=${q}`)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.info.title   || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.info.date   || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.info.imdb  || 'N/A'}_`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push({
      buttonId: prefix + `hed ${q}`, buttonText: {displayText: 'Details send'}, type: 1}

);
	
  sadas.episodes.map((v) => {
	rows.push({
        buttonId: prefix + `directdlanime ${sadas.info.image}±${v.link}±${sadas.info.title}`,
        buttonText: { displayText: `${v.episode}` },
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.info.image },	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.episodes.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.episode}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `directdlanime ${sadas.info.image}±${v.link}±${sadas.info.title}` // Make sure your handler understands this format
    };
  });

  // Compose the listButtons object
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
    image: { url: sadas.info.image},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'hed ' + q,
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



cmd({
    pattern: "directdlanime",
    react: "🍟",
    alias: ["dn"],
    desc: "Direct Downloader",
    category: "movie",
    use: '.download < Direct Link >',
    dontAddCommandList: false,
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const [img, dllink, title] = q.split("±");

        if (!img || !dllink || !title) {
            return reply("❌ Format Error. Use: `image±link±title`");
        }

        const id = dllink.split("id=")[1];
        if (!id) return reply("❗ Invalid link, missing ID.");

        const sadas = await fetchJson(`https://sadas-anime-dl.vercel.app/api/download-links?id=${id}`);
        console.log(sadas);

        if (!sadas.downloadUrl || typeof sadas.downloadUrl !== "string") {
            return reply("❌ Download link not found or malformed from API.");
        }

        const url = sadas.downloadUrl.trim();
        const urlRegex = /^(https?:\/\/[^\s]+)/;

        if (!urlRegex.test(url)) {
            return reply('❗ දීලා තියෙන URL එක වැරදි. කරුණාකර link එක හොඳින් බලන්න.');
        }

        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept': '*/*',
    'Referer': 'https://animeheaven.me/',
    'Origin': 'https://animeheaven.me'
  }
});

      

        await conn.sendMessage(config.JID || from, {
            document: { url: response.data },
            fileName: `${title}.mp4`,
            jpegThumbnail: await (await fetch(img)).buffer(),
            mimetype: 'video/mp4',
            caption: `*🎬 Name :* ${title}\n\n${config.NAME}`
        });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID || from} ✔*` }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('❗ Error downloading file: ' + e.message);
    }
});



cmd({
    pattern: "hed",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')


let sadas = await getep(q)

const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.result.title   || 'N/A'}_*

*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* _${sadas.result.date   || 'N/A'}_
*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.result.imdb  || 'N/A'}_

> 🌟 Follow us : *${details.chlink}*`
await conn.sendMessage(config.JID || from, { image: { url: sadas.result.image }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});

cmd({
    pattern: "slanimetv",	
    react: '🔎',
    category: "movie",
alias: ["ctv"],
        desc: "cinesubz.co tv shows search",
    use: ".cinetv  2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, reply }) => {
try{


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

	
 if(!q) return await reply('*please give me tv shows name !..*')
const url = await slanimeclub_search(q);
	

  if (!url || !url.data || url.data.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
var srh = [];  
for (var i = 0; i < url.data.length; i++) {
srh.push({
title: url.data[i].title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")|| 'Result not found',
description: '',
rowId: prefix + 'slanimeinfo ' + url.data[i].link
});
}

const sections = [{
title: "slanimeclub.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*SLANIME TV SHOWS RESULTS 📺*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'slanimeclub.co results',
buttonText: '*Reply Below Number 🔢*',
sections
}

	const caption = `_*SLANIME TV SHOWS RESULTS 📺*_

*\`Input :\` ${q}`
const rowss = url.data.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${url.data[i].title}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `slanimeinfo ${url.data[i].link}` // Make sure your handler understands this format
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
    console.log(e)
  await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek } )
}
})
cmd({
    pattern: "slanimeinfo",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, prefix, reply }) => {
try{


let sadas = await slanimeclub_ep(q)
	console.log('Scraped Data:', sadas);
let msg = `*🍟 Title :* _${sadas.title   || 'N/A'}_

*📅 First air date :* _${sadas.first_air_date   || 'N/A'}_
*📅 Last air date :* _${sadas.last_air_date   || 'N/A'}_
*🔢 Ep count :* _${sadas.episode_count   || 'N/A'}_
*🏆 Tmdb vote :* _${sadas.tmdbRate  || 'N/A'}_
*🥇Tmdb vote count :* _${sadas.tmdbVoteCount   || 'N/A'}_
*💁‍♂️ Director :* _${sadas.director   || 'N/A'}_
*🎭 Genres :* _${sadas.category  || 'N/A'}_
`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];  

rows.push(
    { buttonId: prefix + 'slanimedet ' + q, buttonText: { displayText: 'Send Details' }, type: 1 }

);

	
  sadas.episodes.map((v) => {
	rows.push({
        buttonId: prefix + `slanimedl ${v.link}&${sadas.title}&${sadas.mainImage}&${v.number}`,
        buttonText: { 
    displayText: `${v.number}`
      
		
},
        type: 1
          }
		 
		 
		 );
        })



  
const buttonMessage = {
 
image: {url: sadas.mainImage.replace("-200x300", "")},	
  caption: msg,
  footer: config.FOOTER,
  buttons: rows,
  headerType: 4
}

const rowss = sadas.episodes.map((v, i) => {
    // Clean size and quality text by removing common tags
    const cleanText = `${v.number}`
      .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|Telegram BluRay SD|Telegram BluRay HD|Direct BluRay SD|Direct BluRay HD|Direct BluRay FHD|FHD|HD|SD|Telegram BluRay FHD/gi, "")
      .trim() || "No info";

    return {
      title: cleanText,
      id: prefix + `slanimedl ${v.link}&${sadas.title}&${sadas.mainImage}&${v.number}` // Make sure your handler understands this format
    };
  });

  // Compose the listButtons object
  const listButtons = {
    title: "🎬 Choose a epishodes",
    sections: [
      {
        title: "Available Links",
        rows: rowss
      }
    ]
  };

	
if (config.BUTTON === "true") {
      await conn.sendMessage(from, {
    image: { url: sadas.mainImage.replace("-200x300", "")},
    caption: msg,
    footer: config.FOOTER,
    buttons: [
{
            buttonId: prefix + 'slanimedet ' + q,
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


async function GDriveDl(url) {
    let id, res = { "error": true }
    if (!(url && url.match(/drive\.google/i))) return res

    const formatSize = sizeFormatter({
        std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B`
    })

    try {
        id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
        if (!id) throw 'ID Not Found'
        res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
            method: 'post',
            headers: {
                'accept-encoding': 'gzip, deflate, br',
                'content-length': 0,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'origin': 'https://drive.google.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                'x-drive-first-party': 'DriveWebUi',
                'x-json-requested': 'true'
            }
        })
        let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4))
        if (!downloadUrl) throw 'Link Download Limit!'
        let data = await fetch(downloadUrl)
        if (data.status !== 200) return data.statusText
        return { downloadUrl, fileName, fileSize: formatSize(sizeBytes), mimetype: data.headers.get('content-type') }
    } catch (e) {
        console.log(e)
        return res
    }
}


cmd(
  {
    pattern: "slanimedl",
    react: "🎥",
    desc: "Movie downloader",
    filename: __filename,
  },
  async (conn, m, mek, { from, q, reply }) => {
    try {
      if (!q) return reply("Error: Missing required parameters.");

      const params = q.split("&");
      if (params.length < 4)
        return reply(
          "Error: Incorrect command format. Ensure you provide all required details."
        );

      const [datae, datas, botimgUrl, ep] = params;

      /** ---------- thumbnail ---------- */
      const botimgBuffer = await (await fetch(botimgUrl)).buffer();
      const resizedBotImg = await resizeImage(botimgBuffer, 200, 200);

      /** ---------- scrape download link ---------- */
      const slRes = await slanimeclub_dl(datae);
      if (!slRes?.[0]?.detailLink)
        return reply("No valid download link found. Please check the URL.");

      const url = slRes[0].detailLink.trim();
      await conn.sendMessage(from, {
        react: { text: "⬆️", key: mek.key },
      });
      await conn.sendMessage(from, { text: "*Uploading your movie..⬆️*" });

      /** ---------- choose download URL ---------- */
      let downloadUrl;

      if (url.startsWith("https://slanimeclub.co/")) {
        downloadUrl = url; // already direct
      } else if (url.startsWith("https://drive.google.com/")) {
        const gdr = await GDriveDl(url);
        if (gdr.error) return reply(gdr.error);
        downloadUrl = gdr.downloadUrl;
      } else {
        return reply("Unsupported link type.");
      }

      /** ---------- deliver file ---------- */
      await conn.sendMessage(config.JID || from, {
        document: { url: downloadUrl },
        caption: `*🎬 Name:* ${datas}\n*EP -* ${ep}\n\n${config.NAME}`,
        mimetype: "video/mp4",
        jpegThumbnail: resizedBotImg,
        fileName: `${datas}.mp4`,
      });
    } catch (e) {
      console.error("Error occurred:", e);
      await conn.sendMessage(from, { text: "🚩 *Error !!*" }, { quoted: mek });
    }
  }
);

cmd({
    pattern: "slanimedet",	
    react: '🎥',
    desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, reply }) => {
try{


     if(!q) return await reply('*please give me text !..*')
let sadas = await slanimeclub_ep(q)
const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data
     
	
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${sadas.title  || 'N/A'}_*

*💃 𝗥ᴀᴛɪɴɢ ➮* _${sadas.tmdbRate  || 'N/A'}_
*🎭 𝗚ᴇɴᴀʀᴇꜱ ➮* _${sadas.category.join(', ')  || 'N/A'}_

> 🌟 Follow us : *${details.chlink}*`
await conn.sendMessage(config.JID || from, { image: { url: sadas.mainImage.replace("-200x300", "") }, caption: msg })



 await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});


cmd({
    pattern: "niki",	
    react: '🔎',
    category: "movie",
alias: ["nikii"],
        desc: "niki tv shows search",
    use: ".niki  2025",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, isMe, reply }) => {
try{


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

	
 if(!q) return await reply('*please give me tv shows name !..*')
const url = await fetchJson(`https://sadas-niki-search.vercel.app/api/search?q=${q}`);
	

  if (!url || !url.results || url.results.length === 0) 
	{
		await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
	}
var srh = [];  
for (var i = 0; i < url.results.length; i++) {
srh.push({
title: url.results[i].title.replace("Sinhala Subtitles | සිංහල උපසිරැසි සමඟ", "").replace("Sinhala Subtitle | සිංහල උපසිරැසි සමඟ", "")|| 'Result not found',
description: '',
rowId: prefix + `nikiinfo ${url.results[i].link}&${url.results[i].image}&${url.results[i].title}`
});
}

const sections = [{
title: "niki.co results",
rows: srh
}	  
]
const listMessage = {
text: `_*NIKI MOVIE SEARCH 🔎*_

*\`Input :\`* ${q}`,
footer: config.FOOTER,
title: 'niki.co results',
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
    pattern: "nikiinfo",	
    react: '🎥',
     desc: "moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, isSudo, isOwner, prefix, reply }) => {
try{

    
  const url = q.split("&")[0]
const image = q.split("&")[1]
const title = q.split("&")[2]
	
let sadas = await fetchJson(`https://sadas-niki-info.vercel.app/api/download-link?url=${url}`)
let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${title   || 'N/A'}_*
`

if (sadas.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )

var rows = [];

rows.push({
    buttonId: prefix + `nikidet ${url}&${image}&${title}`,
    buttonText: { displayText: 'Details Send' },
    type: 1
});

rows.push({
    buttonId: prefix + `nikidl ${sadas.downloadLink}&${image}&${title}`,
    buttonText: { displayText: 'Movie Send' },
    type: 1
});




  
const buttonMessage = {
 
image: {url: image.replace("-150x150", "") },	
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const agent = new https.Agent({ rejectUnauthorized: false });

cmd({
  pattern: "nikidl",
  react: "⬆️",
  alias: ["fetchhh"],
  desc: "Direct downloader from a link with headers",
  category: "movie",
  use: '.directdl <Direct Link>',
  dontAddCommandList: false,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
   const urll = q.split("&")[0]
const image = q.split("&")[1]
const title = q.split("&")[2]

const sadas = await fetchJson(`https://sadas-niki-dl.vercel.app/get-direct-link?url=${urll}`);
	  
	 const url = `${sadas.directLink}`
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
    await conn.sendMessage(config.JID || from, {
      document: { url },
      mimetype: "video/mp4",
      jpegThumbnail: await (await fetch(image)).buffer(),
      fileName: `${title}.mp4`,
      caption: `*🎬 Name :* *${title}*\n\n${config.NAME}`
    });

    // React with ✅
    await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

  } catch (e) {
    reply(`❗ Error occurred: ${e.message}`);
  }
});


cmd({
    pattern: "nikidet",
    react: '🎥',
    desc: "Send detailed movie info",
    filename: __filename
}, 
async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a movie title or URL & image & title');

        let url, image, title;
        let released, country, rating, runtime, subtitle = 'N/A'; // default fallback

        if (q.includes("&")) {
            // Case: URL & image & title
            [url, image, title] = q.split("&");
        } else {
            // Case: just title, maybe extra text after "|"
            title = q.split('|')[0].trim(); 

            // Remove year in parentheses, e.g., "Saint Maud (2019)" -> "Saint Maud"
            title = title.replace(/\(\d{4}\)/, '').trim();

            // Fetch movie info from OMDb
            const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=76cb7f39`;
            const response = await axios.get(apiUrl);
            const movie = response.data;

            if (movie.Response === "False") return reply(`Movie not found: ${title}`);

            title = movie.Title || title;
            image = movie.Poster || 'https://via.placeholder.com/300x450?text=No+Image';
            released = movie.Released || 'N/A';
            country = movie.Country || 'N/A';
            rating = movie.imdbRating || 'N/A';
            runtime = movie.Runtime || 'N/A';
        }

        // Extra follow link
        const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

        const msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* ${title}\n\n` +
                    `*📅 𝗥ᴇʟᴇꜱᴇᴅ ᴅᴀᴛᴇ ➮* ${released || 'N/A'}\n` +
                    `*🌎 𝗖ᴏᴜɴᴛʀʏ ➮* ${country || 'N/A'}\n` +
                    `*💃 𝗥ᴀᴛɪɴɢ ➮* ${rating || 'N/A'}\n` +
                    `*⏰ 𝗥ᴜɴᴛɪᴍᴇ ➮* ${runtime || 'N/A'}\n` +
                    `> 🌟 Follow us : *${details.chlink}*`;

        await conn.sendMessage(from, { image: { url: image.replace("-150x150", "") }, caption: msg });
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending*', { quoted: mek });
    }
});

cmd({
    pattern: "cinesl",
    react: '🔎',
    category: "movie",
    desc: "CineSL movie search",
    use: ".cinesl 2025",
    filename: __filename
}, async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
    try {
        // Premium check
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

        // Owner-only block
        if (config.MV_BLOCK == "true" && !isMe && !isSudo && !isOwner ) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: "*This command currently only works for the Bot owner.*" }, { quoted: mek });
        }

        // Require query
        if(!q) return await reply('*Please give me text !..*');

        // Fetch CineSL API
        let response = await fetchJson(`https://visper-cinesl-search-126b.vercel.app/search?q=${encodeURIComponent(q)}`);
        let results = response.results;

        if (!results || results.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return await conn.sendMessage(from, { text: '*No results found ❌*' }, { quoted: mek });
        }

        // Prepare list rows
        const rows = results.map(v => ({
            title: `${v.title}`,
            //description: `Rating: ${v.rating} | Quality: ${v.quality}`,
            rowId: prefix + `cineslinfo ${v.link}&${v.image}`
        }));

        const listMessage = {
            text: `*_CINESL MOVIE SEARCH RESULT 🎬_*\n\n*Input:* ${q}`,
            footer: config.FOOTER,
            title: 'CineSL results',
            buttonText: '*Reply Below Number 🔢*',
            sections: [{ title: "Available Movies", rows }]
        };

        await conn.listMessage(from, listMessage, mek);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek });
    }
});

cmd({
    pattern: "cineslinfo",
    react: '🎥',
    desc: "Movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isMe, isSudo, isOwner, prefix, reply }) => {
try {
    const urll = q.split("&")[0];
    const im = q.split("&")[1];

    // Fetch movie info from new API
    let sadas = await fetchJson(`https://visper-cinesl-info-dl.vercel.app/api?url=${encodeURIComponent(urll)}&apikey=sadas`);
    if (!sadas.status) return await conn.sendMessage(from, { text: '❌ Error fetching data' }, { quoted: mek });

    const data = sadas.result;

    let msg = `*☘️ 𝗧ɪᴛʟᴇ ➮* *_${data.title || 'N/A'}_*\n\n` +
              `*📅 𝗬𝗲𝗮𝗿 ➮* _${data.year || 'N/A'}_\n` +
              `*⏰ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻 ➮* _${data.duration || 'N/A'}_\n` +
              `*💃 𝗥𝗮𝘁𝗶𝗻𝗴 ➮* _${data.rating || 'N/A'}_\n` +
              `*🎬 𝗗𝗶𝗿𝗲𝗰𝘁𝗼𝗿𝘀 ➮* ${data.directors.join(', ') || 'N/A'}\n` +
              `*👨‍👩‍👧 𝗖𝗮𝘀𝘁 ➮* ${data.cast.join(', ') || 'N/A'}`;

    // Prepare buttons for downloads
    let rows = [];
    rows.push({
        buttonId: prefix + `bdetails ${urll}&${im}`,
        buttonText: { displayText: 'Details Send' },
        type: 1
    });

    data.downloads.forEach(v => {
        rows.push({
            buttonId: prefix + `cinesldlll ${im}±${v.link}±${data.title} *[${v.quality}]*`,
            buttonText: { displayText: `${v.server} - ${v.quality} (${v.lang})` },
            type: 1
        });
    });

    // Prepare listButtons object for button select
    const rowss = data.downloads.map(v => ({
        title: `${v.server} - ${v.quality}`,
        id: prefix + `cinesldlll ${im}±${v.link}±${data.title} *[${v.quality}]*`
    }));

    const listButtons = {
        title: "🎬 Choose a download link :)",
        sections: [{ title: "Available Links", rows: rowss }]
    };

   
        const buttonMessage = {
            image: { url: im.replace("-150x150", "") },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };
        await conn.buttonMessage(from, buttonMessage, mek);
  

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek });
}
});


// Use global-ish variable to prevent redeclaration errors
global.isUploadingggg = global.isUploadingggg || false;

cmd({
    pattern: "cinesldlll",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    if (!q) return await reply('*Please provide a direct URL!*');

    if (global.isUploadingggg) {
        return await conn.sendMessage(from, {
            text: '*A movie is already being uploaded. Please wait a while before uploading another one.* ⏳',
            quoted: mek
        });
    }

    try {
        global.isUploadingggg = true; // Set upload in progress

        const [datae, datas, dat] = q.split("±");

        const sadas = await GDriveDl(datas);

        let txt = `*CINESL MOVIE FILE*
*┌──────────────────*
*├ 📁 Size :* ${sadas.fileSize}
*└──────────────────*`;

        const botimg = datae;

        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

        await conn.sendMessage(config.JID || from, {
            document: { url: sadas.downloadUrl },
            caption: `*🎬 Name :* ${dat}\n\n${config.NAME}`,
            mimetype: "video/mp4",
            jpegThumbnail: await (await fetch(botimg)).buffer(),
            fileName: `${dat}.mp4`
        });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
        await conn.sendMessage(from, { text: `*Movie sent successfully to JID ${config.JID || from} ✔*` }, { quoted: mek });

    } catch (error) {
        console.error('Error fetching or sending:', error);
        await conn.sendMessage(from, { text: "*Error fetching this moment, please retry now ❗*" }, { quoted: mek });
    } finally {
        global.isUploadingggg = false; // Reset upload status
    }
});

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

							cmd({
    pattern: "sinhalasubs",	
    react: '🔎',
    category: "movie",
    desc: "DINKAMOVIES movie search",
    use: ".sinhalasubs new",
    filename: __filename
},
async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
try {
    if (!q) return await reply('*Please give me a movie name 🎥*')

    // Fetch data from SUB.LK API
    let url = await fetchJson(`https://pathum-rajapaksha.netlify.app/api/search/search?text=${encodeURIComponent(q)}`)

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
            rowId: prefix + `subsdl ${url[i].link}&${url[i].year}`
        });
    }

    const listMessage = {
        text: `*_SINHALASUBS MOVIE SEARCH RESULT 🎬_*

*\`🎡Input :\`* ${q}`,
        footer: config.FOOTER,
        title: 'sinhalasubs.lk Results',
        buttonText: '*Reply Below Number 🔢*',
        sections: [{
            title: "sinhalasubs.lk Results",
            rows: srhh
        }]
    }

    const caption = `*_SINHALASUBS MOVIE SEARCH RESULT 🎬_*

*\`🎞Input :\`* ${q}

_Total results:_ ${url.length}`

    // Also create listButtons for button mode
    const rowss = url.map((v, i) => {
        return {
            title: v.title || `Result ${i+1}`,
            id: prefix + `subsdl ${v.link}&${v.year}`
        }
    });

    const listButtons = {
        title: "Choose a Movie 🎬",
        sections: [
            {
                title: "sinhalasubs.lk Search Results",
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
    pattern: "subsdl",	
    react: '🎥',
    desc: "DINKAMOVIES movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q || !q.includes('https://sinhalasubs.lk/')) {
        console.log('Invalid input:', q);
        return await reply('*❗ Invalid link. Please search using .dndl and select a movie.*');
    }

    let data = await fetchJson(`https://pathum-detailes.netlify.app/api/details?url=${q}`);
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
    res.downloadLinks.forEach((dl, i) => {
        rows.push({
            buttonId: `${prefix}sindl ${dl.finalDownloadUrl}±${res.imageLinks[0]}±${res.title}
            
			\`[${dl.quality}]\``,
            buttonText: { 
                displayText: `${dl.size} (${dl.quality})`
                  .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
                  .trim()
            },
            type: 1
        });
    });

    const buttonMessage = {
        image: { url: res.imageLinks[0] },
        caption: msg,
        footer: config.FOOTER,
        buttons: rows,
        headerType: 4
    };

    // List buttons (nativeFlow style)
    const rowss = res.downloadLinks.map((dl, i) => {
        const cleanText = `${dl.size} (${dl.quality})`
          .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
          .trim() || "No info";

        return {
            title: cleanText,
            id: `${prefix}sindl ${dl.finalDownloadUrl}±${res.imageLinks[0]}±${res.title}
            
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
            image: { url: res.imageLinks[0] },

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
cmd({
    pattern: "sinhalasubs",	
    react: '🔎',
    category: "movie",
    desc: "DINKAMOVIES movie search",
    use: ".sinhalasubs new",
    filename: __filename
},
async (conn, m, mek, { from, isPre, q, prefix, isMe, isSudo, isOwner, reply }) => {
try {
    if (!q) return await reply('*Please give me a movie name 🎥*')

    // Fetch data from SUB.LK API
    let url = await fetchJson(`https://pathum-rajapaksha.netlify.app/api/search/search?text=${encodeURIComponent(q)}`)

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
            rowId: prefix + `subsdl ${url[i].link}&${url[i].year}`
        });
    }

    const listMessage = {
        text: `*_SINHALASUBS MOVIE SEARCH RESULT 🎬_*

*\`🎡Input :\`* ${q}`,
        footer: config.FOOTER,
        title: 'sinhalasubs.lk Results',
        buttonText: '*Reply Below Number 🔢*',
        sections: [{
            title: "sinhalasubs.lk Results",
            rows: srhh
        }]
    }

    const caption = `*_SINHALASUBS MOVIE SEARCH RESULT 🎬_*

*\`🎞Input :\`* ${q}

_Total results:_ ${url.length}`

    // Also create listButtons for button mode
    const rowss = url.map((v, i) => {
        return {
            title: v.title || `Result ${i+1}`,
            id: prefix + `subsdl ${v.link}&${v.year}`
        }
    });

    const listButtons = {
        title: "Choose a Movie 🎬",
        sections: [
            {
                title: "sinhalasubs.lk Search Results",
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
    pattern: "subsdl",	
    react: '🎥',
    desc: "DINKAMOVIES movie downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
try {
    if (!q || !q.includes('https://sinhalasubs.lk/')) {
        console.log('Invalid input:', q);
        return await reply('*❗ Invalid link. Please search using .dndl and select a movie.*');
    }

    let data = await fetchJson(`https://pathum-detailes.netlify.app/api/details?url=${q}`);
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
    res.downloadLinks.forEach((dl, i) => {
        rows.push({
            buttonId: `${prefix}sindl ${dl.finalDownloadUrl}±${res.imageLinks[0]}±${res.title}
            
			\`[${dl.quality}]\``,
            buttonText: { 
                displayText: `${dl.size} (${dl.quality})`
                  .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
                  .trim()
            },
            type: 1
        });
    });

    const buttonMessage = {
        image: { url: res.imageLinks[0] },
        caption: msg,
        footer: config.FOOTER,
        buttons: rows,
        headerType: 4
    };

    // List buttons (nativeFlow style)
    const rowss = res.downloadLinks.map((dl, i) => {
        const cleanText = `${dl.size} (${dl.quality})`
          .replace(/WEBDL|WEB DL|BluRay HD|BluRay SD|BluRay FHD|HDRip|FHD|HD|SD/gi, "")
          .trim() || "No info";

        return {
            title: cleanText,
            id: `${prefix}sindl ${dl.finalDownloadUrl}±${res.imageLinks[0]}±${res.title}
            
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
            image: { url: res.imageLinks[0] },

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
//newtv
let isUploadinggxxg = false; // Track upload status





const cinesubzDownBase2 = "https://drive2.cscloud12.online";
const apilinkcine2 = "https://cinesubz-store.vercel.app/";

cmd({
    pattern: "pakatv",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isMe, reply }) => {
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }
console.log('Input', q)
    if (isUploadinggxxg) {
        return await conn.sendMessage(from, { 
            text: '*A Episode is already being uploaded. Please wait a while before uploading another one.* ⏳', 
            quoted: mek 
        });
    }

    let attempts = 0;
    const maxRetries = 5;
    isUploadinggxxg = false;

    
    while (attempts < maxRetries) {
        try {
            const [datae, dat, datas] = q.split("&");
            let url = datas.replace('https://google.com/', 'https://drive2.cscloud12.online/').replace('/1:', '').replace('server11', 'server1');
            let mediaUrl = url;
            let downloadUrls = null;

            // 🔹 Check only if it's from Cinesubz
            if (url.includes(cinesubzDownBase2)) {
                const check = await fetchJson(`${apilinkcine2}api/get/?url=${encodeURIComponent(url)}`);

                if (check?.isUploaded === false) {
                    // New upload case
                    const urlApi = `https://manojapi.infinityapi.org/api/v1/cinesubz-download?url=${encodeURIComponent(url)}&apiKey=sadasthemi20072000`; 
                    const getDownloadUrls = await axios.get(urlApi);

                    downloadUrls = getDownloadUrls.data.results;

                    // Save in DB
                    const payload = { url, downloadUrls, uploader: "VISPER-MD" }; 
                    await axios.post(`${apilinkcine2}api/save`, payload);

                } else {
                    // Already uploaded
                    downloadUrls = check.downloadUrls;
                }

                // Pick best available link
                mediaUrl =
                     downloadUrls.direct ||
                    downloadUrls?.gdrive2 
            }
console.log ('Final_Dl:', mediaUrl)
            // 🔹 Thumbnail
            const botimg = datae;

            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            const up_mg = await conn.sendMessage(from, { text: '*Uploading your movie..⬆️*' });

            // 🔹 Send document
            await conn.sendMessage(config.JID || from, { 
                document: { url: mediaUrl },
                caption: `🎞️ ${dat}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                jpegThumbnail: await (await fetch(botimg)).buffer(),
                fileName: `${dat}.mp4`
            });

            await conn.sendMessage(from, { delete: up_mg.key });
            await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

            break; // ✅ success → exit loop
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts}: Error fetching or sending:`, error);
        }
    }

    if (attempts >= maxRetries) {
        await conn.sendMessage(from, { text: "*Error fetching at this moment. Please try again later ❗*" }, { quoted: mek });
    }

    isUploadinggxxg = false;
});
