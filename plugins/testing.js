const config = require('../config')
const l = console.log
const { cmd, commands } = require('../command')
const axios = require('axios');
const os = require("os");
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
var sizetoo =  "This file size is too big"
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const yts = require("ytsearch-venom")
const { mimeTypes } = require('file-type')



cmd({
    pattern: "test",
    alias: ["play", "ytmp3", "yta", "lagu"],
    use: '.song <song name>',
    react: "🍟",
    desc: "Search & download yt song.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, {
    from, reply
}) => {
    try {
        const cap = `test`;

        // Ensure these variables are defined somewhere before this block
       const prefix = "...";
       const data = { url: "..." };
      
await conn.sendMessage(from, {
    image: { url: config.LOGO },
    caption: cap,
    footer: config.FOOTER,
    buttons: [

        {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "Follow us",
                    url: "https://example.com",
                    merchant_url: "https://example.com",
                    type: 1
                }),
            },
        {
            buttonId: `.menu`,
            buttonText: { displayText: "`[Voice Note(Ptt) 🎧]`" },
            type: 1
        },
        {
            buttonId: `${prefix}ytaud ${data.url}`,
            buttonText: { displayText: "`[Audio Type 🎧]`" },
            type: 1
        },
        {
            buttonId: `${prefix}ytdoc ${data.url}`,
            buttonText: { displayText: "`[Document 📁]`" },
            type: 1
        },
        {
            buttonId: `${prefix}devilv ${data.url}`,
            buttonText: { displayText: "`[Video 📽️]`" },
            type: 1
        }
    ],
    headerType: 1,
    viewOnce: true,
}, { quoted: mek });


    } catch (e) {
        reply("🚩 Not Found !");
        console.error(e);
    }
});






cmd({
    pattern: "menu2",
    react: "🗄️",
    alias: ["panel", "list", "commands"],
    desc: "Get bot's command list.",
    category: "other",
    use: '.menu',
    filename: __filename
},

async (conn, mek, m, {
    from,
    pushname,
    reply
}) => {
    try {
        let hostname;

        if (os.hostname().length === 12) hostname = 'replit';
        else if (os.hostname().length === 36) hostname = 'heroku';
        else if (os.hostname().length === 8) hostname = 'koyeb';
        else hostname = os.hostname();

        const monspace = '```';
 const ramUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem() / 1024 / 1024)}MB`;
    const uptime = await runtime(process.uptime());

    // Load external bot details
    const details = (await axios.get('https://mv-visper-full-db.pages.dev/Main/main_var.json')).data;

        const MNG = `*🫟 VISPER MD - Bot Menu*

> *Uptime:* ${uptime}
> *RAM Usage:* ${ramUsage}
> *Platform:* ${hostname}
> *Version:* 2.0.1

*Now you can buy not only movies but everything else from this WhatsApp bot.*

📢 *Channel:* ${details.chlink}

📦 *Repo:* ${details.reponame}`;

        const buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "Follow us",
                    url: "https://example.com",
                    merchant_url: "https://example.com"
                }),
            },
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "Select a Category:",
                    sections: [
                        {
                            title: "SELECT MENU",
                            highlight_label: "VISPER-MD",
                            rows: [
                                {
                                    header: "1",
                                    title: "MAIN MENU",
                                    description: "Main menu",
                                    id: ".allmenu"
                                },
                                {
                                    header: "1",
                                    title: "DOWNLOAD MENU",
                                    description: "Download menu",
                                    id: ".downloadmenu"
                                },
                                {
                                    header: "1",
                                    title: "MOVIE MENU",
                                    description: "Movie menu",
                                    id: ".moviemenu"
                                },
                                {
                                    header: "1",
                                    title: "CONVERT MENU",
                                    description: "Convert menu",
                                    id: ".convertmenu"
                                },
                                {
                                    header: "1",
                                    title: "OWNER MENU",
                                    description: "Owner menu",
                                    id: ".ownermenu"
                                },
                                {
                                    header: "1",
                                    title: "GROUP MENU",
                                    description: "Group menu",
                                    id: ".groupmenu"
                                },
                                {
                                    header: "1",
                                    title: "SEARCH MENU",
                                    description: "Search menu",
                                    id: ".searchmenu"
                                }
                            ]
                        }
                    ]
                })
            }
        ];

        const opts = {
            image: config.LOGO,
            header: '',
            footer: config.FOOTER,
            body: MNG
        };

        await conn.sendButtonMessage3(from, buttons, m, opts);

    } catch (e) {
        reply('*Error !!*');
        console.error(e);
    }
});





