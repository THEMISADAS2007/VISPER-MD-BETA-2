const { cmd } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');
const { Sticker, StickerTypes } = require('wa-sticker-formatter'); 

// --- 1. LOGO LIST---
cmd({
    pattern: "logo",
    react: "✨",
    desc: "Logo maker with format selection",
    category: "image",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("❌ *Example:* .logo Visper");

        const data = await fetchJson('https://ominisave.zone.id/api/logo-list');
        const types = data.types;

        if (!types || !Array.isArray(types)) return reply("❌ API ERROR.");

        let listMsg = `✨ *LOGO MAKER LIST* ✨\n\n`;
        listMsg += `📝 *Name:* ${q}\n\n`;
        listMsg += `*Patterns:*\n`;

        types.forEach((item, index) => {
            listMsg += `*${index + 1}.* ${item}\n`;
        });

        listMsg += `\n> 🔢 PLEASE REPLY BELOW NUMBER 😒💐.`;

        await conn.sendMessage(m.chat, { text: listMsg }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});

// --- 2. REPLY LISTENER ---
cmd({
    on: "body"
}, async (conn, mek, m, { body, reply }) => {
    try {
     
        if (!m.quoted) return;
        
        const quotedText = m.quoted.text || m.quoted.conversation || "";
        if (!quotedText) return;

        
        const selection = body.trim();
        if (isNaN(selection)) return;
        const num = parseInt(selection);


        
        if (quotedText.includes("LOGO MAKER LIST")) {
            
            
            if (!quotedText.includes("Name:* ")) return;
            const name = quotedText.split("Name:* ")[1].split("\n")[0].trim();

            
            const lines = quotedText.split("\n");
            const targetLine = lines.find(l => l.includes(`*${num}.*`));
            if (!targetLine) return;

            const type = targetLine.split(".* ")[1].trim();

            if (type) {
                
                let formatMsg = `⚙️ *FORMAT SELECTION* ⚙️\n\n`;
                formatMsg += `📝 *Name:* ${name}\n`;
                formatMsg += `🎨 *Pattern:* ${type}\n\n`;
                formatMsg += `*1.* 🖼️ Image\n`;
                formatMsg += `*2.* 📄 Document\n`;
                formatMsg += `*3.* ✨ Sticker\n\n`;
                formatMsg += `> 🔢 *කරුණාකර ඔබට අවශ්‍ය Format එකේ Number එක  Reply කරන්න. 😒💐*`;

                return await conn.sendMessage(m.chat, { text: formatMsg }, { quoted: mek });
            }
        }


        
        if (quotedText.includes("FORMAT SELECTION")) {
            
            
            if (![1, 2, 3].includes(num)) return reply("❌ *💐හරි Number එක Reply කරපන් හුත්තෝ 😒🤌.*");

            
            if (!quotedText.includes("Name:* ")) return;
            const name = quotedText.split("Name:* ")[1].split("\n")[0].trim();

            
            if (!quotedText.includes("Pattern:* ")) return;
            const type = quotedText.split("Pattern:* ")[1].split("\n")[0].trim();

            if (name && type) {
                reply(`🔄 *Generating ${type} logo...*`);

                
                const logoUrl = `https://ominisave.zone.id/api/logo?name=${encodeURIComponent(name)}&type=${type}`;
                const buffer = await getBuffer(logoUrl);

                
                if (num === 1) {
                    await conn.sendMessage(m.chat, {
                        image: buffer,
                        caption: `✨ *Logo Generated*\n\n📌 *Type:* ${type}\n📝 *Name:* ${name}`
                    }, { quoted: mek });
                } 
               
                else if (num === 2) {
                    await conn.sendMessage(m.chat, {
                        document: buffer,
                        mimetype: 'image/png',
                        fileName: `VISPER_${type}_logo.png`,
                        caption: `✨ *Logo Document*\n\n📌 *Type:* ${type}\n📝 *Name:* ${name}`
                    }, { quoted: mek });
                } 
                
                else if (num === 3) {
                    let sticker = new Sticker(buffer, {
                        pack: `Logo-${type.toUpperCase()}`,
                        author: "VISPER_MD",
                        type: StickerTypes.FULL,
                        categories: ['🤩', '🎉'],
                        quality: 80, 
                        background: 'transparent'
                    });
                    const stickerBuffer = await sticker.build();
                    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });
                }
            }
        }

    } catch (e) {
        console.log("Listener Error:", e);
    }
});
