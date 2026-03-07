const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios'); 
const sharp = require('sharp');
const fg = require('api-dylux');
const fetch = require('node-fetch');

let isUploadingTv = false;

const FOOTER_TEXT = '> 📽️ *𝐕ɪꜱᴘᴇʀ 𝐌ᴏ𝐯ɪᴇ 𝐙ᴏɴᴇ 𝐗 📽️*';

async function getResizedThumb(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        return await sharp(buffer)
            .resize(200, 200, { fit: 'cover' }) 
            .jpeg({ quality: 80 }) 
            .toBuffer();
    } catch (e) {
        console.error("Sharp Error:", e.message);
        return null;
    }
}

// ==================== 1. TV SERIES SEARCH ====================
cmd({
    pattern: "ctztv",
    react: '🔎',
    category: "tv",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        if (!q) return await reply('*Please enter a TV series name! 📺*');

        const { data } = await axios.get(`https://tharuzz-movie-api.vercel.app/api/cinesub/search?query=${encodeURIComponent(q)}`);
        if (!data.result || !Array.isArray(data.result)) return await reply('*No results found ❌*');

        const results = data.result.filter(item => item.type === "tvshows");

        let srh = results.map(v => ({
            title: v.title.replace(/Sinhala Subtitles\s*\|?\s*සිංහල උපසිරසි.*/gi, "").trim(),
            rowId: `${prefix}tvinfo ${v.link}`
        }));

        await conn.listMessage(from, {
            text: `_*CINESUBZ TV SERIES SEARCH RESULTS 📺*_\n\n*🔎 Input:* ${q}\n\n*Select a series from the list below to view episodes.*`,
            footer: FOOTER_TEXT,
            title: '', 
            buttonText: 'Click to View Results 🎬',
            sections: [{ title: "Available TV Series", rows: srh }]
        }, mek);

    } catch (e) { reply('🚩 *Error during search!*'); }
});

// ==================== 2. TV INFO & EPISODES ====================
cmd({
    pattern: "tvinfo",
    react: "📺",
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        const { data } = await axios.get(`https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(q)}`);
        const series = data.result;
        if (!series) return await reply("*Couldn't find TV series info!*");

        const posterUrl = series.poster || config.LOGO;

        for (let i = 0; i < series.seasons.length; i++) {
            const season = series.seasons[i];
            let rows = [];

            rows.push({
                buttonId: `${prefix}tvallquality ${q}±${series.poster}±${series.title}±${season.season}`,
                buttonText: { displayText: `📥 Download All S${season.season}` },
                type: 1
            });

            if (i === 0) {
                rows.push({
                    buttonId: `${prefix}ctvdetails ${q}`,
                    buttonText: { displayText: 'View Details Card 📋' },
                    type: 1
                });
            }

            season.episodes.forEach(ep => {
                const epTitle = `S${String(season.season).padStart(2, '0')} E${String(ep.episode).padStart(2, '0')}`;
                rows.push({
                    buttonId: `${prefix}tvquality ${ep.url}±${series.poster}±${series.title} ${epTitle}±${q}`,
                    buttonText: { displayText: epTitle },
                    type: 1
                });
            });

            const captionText = i === 0 
                ? `*🍿 𝗧ɪᴛ𝗹𝗲 ➮* *_${series.title}_*\n*📅 𝗬ᴇᴀʀ ➮* _${series.year}_\n\n*Select an Episode from Season ${season.season} below:*`
                : `*📂 Season ${season.season} Episodes - ${series.title}*`;

            await conn.buttonMessage(from, {
                image: { url: posterUrl },
                caption: captionText,
                footer: FOOTER_TEXT,
                buttons: rows,
                headerType: 4
            }, mek);

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) { reply('🚩 *Error fetching episodes!*'); }
});

// ==================== 3. DETAILS CARD ====================
cmd({
    pattern: "ctvdetails",
    react: '📋',
    desc: "Rich TV info card",
    filename: __filename
},
async (conn, m, mek, { from, q, reply }) => {
    try {
        const { data } = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-info?url=${encodeURIComponent(q)}&apikey=82406ca340409d44`);
        const movie = data.data;

        let msg = `*✨ 𝐓ᴠ 𝐒ᴇʀɪᴇส์ 𝐃ᴇᴛᴀɪʟส์ ✨*\n\n` +
                  `*🍿 𝐓ɪ𝐓ʟ𝐄 ➮* *_${movie.title || 'N/A'}_*\n` +
                  `*📅 𝐑ᴇ𝐋ᴇᴀ𝐒ᴇ𝐃 ➮* _${movie.year || 'N/A'}_\n` +
                  `*💃 𝐑ᴀ𝐓ɪＮＧ ➮* _⭐ ${movie.rating || 'N/A'}/10_\n` +
                  `*⏰ 𝐃ᴜＲᴀＴɪＯＮ ➮* _${movie.duration || 'N/A'}_\n` +
                  `*🌎 𝐂ᴏᴜＮᴛＲＹ ➮* _${movie.country || 'N/A'}_\n` +
                  `*🎭 𝐆ᴇＮʀᴇ𝐒 ➮* _${movie.genres || 'TV Series'}_\n` +
                  `*🎞️ 𝐐ᴜᴀ𝐋ɪᴛ𝐘 ➮* _${movie.quality || 'N/A'}_\n` +
                  `*🎬 𝐃ɪʀᴇ𝐂ᴛᴏＲ ➮* _${movie.directors || 'N/A'}_\n\n` +
                  `*💁 𝐒ᴜʙᴛɪᴛʟᴇ ʙʏ ➮* _CineSubz.co_\n\n` +
                  `${FOOTER_TEXT}`;

        await conn.sendMessage(from, { 
            image: { url: movie.image }, 
            caption: msg 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) { 
        console.error("Error in ctvdetails command:", e); 
        reply('🚩 *Error fetching details card!*'); 
    }
});

// ==================== 4. QUALITY SELECTION ====================
cmd({
    pattern: "tvquality",
    react: "🎥",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        const [epUrl, imgLink, title, mainUrl] = q.split("±");
        const { data: convData } = await axios.get(`https://down-seven-bice.vercel.app/api/download?url=${encodeURIComponent(epUrl)}`);

        let rows = convData.downloads.map(dl => ({
            buttonId: `${prefix}tvdl ${dl.url}±${imgLink}±${title}±${mainUrl}±${dl.quality}`,
            buttonText: { displayText: dl.quality },
            type: 1
        }));

        await conn.buttonMessage(from, {
            image: { url: imgLink },
            caption: `*🎥 Select Quality for:* \n_${title}_`,
            footer: FOOTER_TEXT,
            buttons: rows,
            headerType: 4
        }, mek);
    } catch (e) { reply('🚩 *Error fetching qualities!*'); }
});

// ==================== 5. ALL EPISODES QUALITY SELECTION ====================
cmd({
    pattern: "tvallquality",
    react: "📑",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, m, mek, { from, q, prefix, reply }) => {
    try {
        const [mainUrl, imgLink, title, seasonNum] = q.split("±");
        const { data: seriesData } = await axios.get(`https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(mainUrl)}`);

        const targetSeason = seriesData.result.seasons.find(s => s.season.toString() === seasonNum.toString());
        const firstEpUrl = targetSeason.episodes[0].url; 
        const { data: convData } = await axios.get(`https://down-seven-bice.vercel.app/api/download?url=${encodeURIComponent(firstEpUrl)}`);

        let rows = convData.downloads.map(dl => ({
            buttonId: `${prefix}tvdlall ${mainUrl}±${imgLink}±${title}±${dl.quality}±${seasonNum}`,
            buttonText: { displayText: dl.quality },
            type: 1
        }));

        await conn.buttonMessage(from, {
            image: { url: imgLink },
            caption: `*📥 DOWNLOAD ALL - SEASON ${seasonNum}*\n\n*Series:* ${title}\n*Select the quality for all episodes in Season ${seasonNum}:*`,
            footer: FOOTER_TEXT,
            buttons: rows,
            headerType: 4
        }, mek);
    } catch (e) { reply('🚩 *Error fetching quality list!*'); }
});

// ==================== 6. DOWNLOAD ALL EXECUTION ====================
cmd({
    pattern: "tvdlall",
    react: "⏳",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, m, mek, { from, q, reply }) => {
    if (isUploadingTv) return await reply('*Another process is running. Please wait ⏳*');
    try {
        const [mainUrl, imgLink, title, selectedQuality, seasonNum] = q.split("±");
        isUploadingTv = true;

        await reply(`*🚀 Starting download all episodes of Season ${seasonNum} in ${selectedQuality}...*`);

        const { data: seriesData } = await axios.get(`https://episodes-cine.vercel.app/api/details?url=${encodeURIComponent(mainUrl)}`);
        const seasons = seriesData.result.seasons.filter(s => s.season.toString() === seasonNum.toString());

        for (const season of seasons) {
            for (const ep of season.episodes) {
                try {
                    const epTitle = `${title} S${String(season.season).padStart(2, '0')}E${String(ep.episode).padStart(2, '0')}`;
                    const { data: qData } = await axios.get(`https://down-seven-bice.vercel.app/api/download?url=${encodeURIComponent(ep.url)}`);
                    const matchingDl = qData.downloads.find(d => d.quality.trim() === selectedQuality.trim()) || qData.downloads[0]; 
                    const { data: apiRes } = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(matchingDl.url)}&apikey=82406ca340409d44`);
                    const downloadLinks = apiRes.data.download;

                    let downloadUrl = null;
                    let fileName = apiRes.data.title || epTitle;


                    const directEntry = downloadLinks.find(dl => 
                        dl.name.toLowerCase() === "unknown" || 
                        dl.url.includes("/dl/") || 
                        dl.url.includes("csplayer") || 
                        dl.name.toLowerCase().includes("direct")
                    );
                    if (directEntry) downloadUrl = directEntry.url;


                    if (!downloadUrl) {
                        const gdriveEntry = downloadLinks.find(dl => dl.name.toLowerCase() === "gdrive");
                        if (gdriveEntry) {
                            try {
                                const res = await fg.GDriveDl(gdriveEntry.url.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download', '/view'));
                                if (res && res.downloadUrl) {
                                    downloadUrl = res.downloadUrl;
                                    fileName = res.fileName;
                                }
                            } catch (e) { }
                        }
                    }


                    if (!downloadUrl) {
                        const pixelEntry = downloadLinks.find(dl => dl.name.toLowerCase().includes("pixeldrain") || dl.url.includes("pixeldrain.com"));
                        if (pixelEntry) downloadUrl = pixelEntry.url.replace('/u/', '/api/file/') + "?download";
                    }


                    if (!downloadUrl) {
                        const fallbackEntry = downloadLinks.find(dl => dl.name.toLowerCase() !== "telegram");
                        if (fallbackEntry) downloadUrl = fallbackEntry.url;
                    }

                    if (downloadUrl) {
                        const resizedThumb = await getResizedThumb(imgLink);
                        const caption = `🎬 *𝗡𝗮𝗺𝗲 :* ${epTitle}\nSinhala Subtitles | සිංහල උපසිරසි සමඟ\n\n\`[${selectedQuality.trim()}]\` \n\n${config.NAME}`;

                        const targetJid = config.JID || from;
                        await conn.sendMessage(targetJid, { 
                            document: { url: downloadUrl }, 
                            fileName: "🎥 " + fileName.trim() + ".mp4", 
                            mimetype: "video/mp4",
                            jpegThumbnail: resizedThumb,
                            caption: caption
                        });
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                } catch (err) { console.error(`Error:`, err); }
            }
        }
        await reply(`*✅ All episodes of Season ${seasonNum} have been sent!*`);
    } catch (e) { reply('*Critical error in Download All!*'); }
    finally { isUploadingTv = false; }
});

// ==================== 7. FINAL INDIVIDUAL DOWNLOAD ====================
cmd({
    pattern: "tvdl",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, m, mek, { from, q, reply }) => {
    if (isUploadingTv) return await reply('*Another episode is uploading. Please wait ⏳*');
    try {
        const [processedUrl, imgLink, title, mainUrl, quality] = q.split("±");

        const { data: apiRes } = await axios.get(`https://api-dark-shan-yt.koyeb.app/movie/cinesubz-download?url=${encodeURIComponent(processedUrl)}&apikey=82406ca340409d44`);
        const downloadLinks = apiRes.data.download;

        let downloadUrl = null;
        let fileName = apiRes.data.title || title; 


        const directEntry = downloadLinks.find(dl => 
            dl.name.toLowerCase() === "unknown" || 
            dl.url.includes("/dl/") || 
            dl.url.includes("csplayer") || 
            dl.name.toLowerCase().includes("direct")
        );
        if (directEntry) downloadUrl = directEntry.url;


        if (!downloadUrl) {
            const gdriveEntry = downloadLinks.find(dl => dl.name.toLowerCase() === "gdrive");
            if (gdriveEntry) {
                try {
                    const res = await fg.GDriveDl(gdriveEntry.url.replace('https://drive.usercontent.google.com/download?id=', 'https://drive.google.com/file/d/').replace('&export=download', '/view'));
                    if (res && res.downloadUrl) {
                        downloadUrl = res.downloadUrl;
                        fileName = res.fileName;
                    }
                } catch (e) { /* skip */ }
            }
        }

        if (!downloadUrl) {
            const pixelEntry = downloadLinks.find(dl => dl.name.toLowerCase().includes("pixeldrain") || dl.url.includes("pixeldrain.com"));
            if (pixelEntry) {
                downloadUrl = pixelEntry.url.replace('/u/', '/api/file/') + "?download";
            }
        }


        if (!downloadUrl) {
            const fallbackEntry = downloadLinks.find(dl => dl.name.toLowerCase() !== "telegram");
            if (fallbackEntry) downloadUrl = fallbackEntry.url;
        }

        if (!downloadUrl) return await reply("⚠️ No working link found.");

        isUploadingTv = true;
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        const resizedThumb = await getResizedThumb(imgLink);
        const qText = quality ? quality.trim() : 'Unknown';
        const caption = `🎬 *𝗡𝗮𝗺𝗲 :* ${title}\nSinhala Subtitles | සිංහල උපසිරසි සමඟ\n\n\`[ ${qText} ]\`\n\n${config.NAME}`;

        const targetJid = config.JID || from;
        await conn.sendMessage(targetJid, { 
            document: { url: downloadUrl }, 
            fileName: "🎥" + fileName.trim() + ".mp4", 
            mimetype: "video/mp4",
            jpegThumbnail: resizedThumb,
            caption: caption
        });

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });

    } catch (e) { reply('*Download Error !!*'); }
    finally { isUploadingTv = false; }
});