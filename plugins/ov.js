const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const config = require('../config')
const os = require('os')
const axios = require('axios');
const mimeTypes = require("mime-types");
const fs = require('fs');
const path = require('path');
const { generateForwardMessageContent, prepareWAMessageFromContent, generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const { URL } = require('url');

// 1. Gemini AI Setup
const genAI = new GoogleGenerativeAI("AIzaSyAfeTpfPr04kNmgDMcE6m1gxgtF4m2Fl1k");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Helper to handle the response text properly
async function getAIResponse(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        // Fallback to gemini-pro if flash fails (older version support)
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
}





// Bot එක Off කළ යුතු Chat IDs තාවකාලිකව තබා ගැනීමට
let disabledChats = new Set();

// 2. Ovnix Company Training Context
const COMPANY_CONTEXT = `
ඔබ "Ovnix AI" සහායකයා වේ. ඔබ ශ්‍රී ලංකාවේ "Ovnix" නම් වෙබ් සංවර්ධන ආයතනය නියෝජනය කරයි.
සේවාවන්: Web Design, Full-stack Dev, WhatsApp Bot Development.
මිල ගණන්: රු. 25,000 සිට ඉහළට.

විශේෂ උපදෙස්:
- පාරිභෝගිකයා වෙබ් අඩවියක් ගැන විමසූ විට ඔවුන්ගේ නම සහ අවශ්‍යතාවය අසන්න.
- ඔවුන් තොරතුරු ලබා දුන් පසු "ස්තූතියි! අපේ නියෝජිතයෙකු ඉතා ඉක්මනින් ඔබව සම්බන්ධ කර ගනු ඇත. එතෙක් කරුණාකර රැඳී සිටින්න." යනුවෙන් පවසා සංවාදය අවසන් කරන්න.
`;

cmd({ on: "body" },
    async (conn, mek, m, { from, body, isCmd, isOwner, pushname, reply }) => {
        try {
            if (isCmd || m.key.fromMe || !body || disabledChats.has(from)) return;

            await conn.sendPresenceUpdate('composing', from);

            const prompt = `${COMPANY_CONTEXT}\n\nUser (${pushname}): ${body}\nAI:`;
            
            // Calling the optimized AI function
            const aiText = await getAIResponse(prompt);

            await conn.sendMessage(from, { text: aiText }, { quoted: mek });

            // Trigger words logic
            const triggerWords = ["සම්බන්ධ කර ගනු ඇත", "රැඳී සිටින්න", "contact you", "stay tuned"];
            const shouldDisable = triggerWords.some(word => aiText.toLowerCase().includes(word));

            if (shouldDisable) {
                const myNumber = conn.user.id.split(':')[0] + "@s.whatsapp.net";
                const adminMsg = `📢 *Ovnix Alert:* \nCustomer: ${pushname}\nNumber: ${from.split('@')[0]}\nStatus: AI hand-off complete.`;
                
                await conn.sendMessage(myNumber, { text: adminMsg });

                disabledChats.add(from);
                console.log(`[SYSTEM] Bot disabled for: ${from}`);
            }

        } catch (e) {
            console.error("Critical AI Error: ", e);
        }
    }
);

// 5. නැවත Bot On කිරීමට Command එක (.bot-on)
cmd({
    pattern: "bot-on",
    desc: "නැවත Chatbot ක්‍රියාත්මක කිරීමට",
    category: "owner",
    use: '.bot-on',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ ඔබට මෙම Command එක භාවිතා කිරීමට අවසර නැත.");
    
    if (disabledChats.has(from)) {
        disabledChats.delete(from);
        return reply("✅ Ovnix AI නැවත ක්‍රියාත්මක කරන ලදී.");
    } else {
        return reply("ℹ️ Bot දැනටමත් ක්‍රියාත්මකයි.");
    }
});
