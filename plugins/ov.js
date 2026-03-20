const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

// 1. Configuration Constants
const API_KEY = "AIzaSyAfeTpfPr04kNmgDMcE6m1gxgtF4m2Fl1k"; // Your Gemini Key


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

/**
 * Direct API Call to Gemini to avoid SDK 404 Errors
 */
// Updated MODEL_NAME
const MODEL_NAME = "gemini-1.5-flash"; 

async function getAIResponse(prompt) {
    try {
        // We use v1beta here because "flash" is often categorized there in some regions, 
        // but we use the full model path.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.candidates) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("No candidates found");
        }
    } catch (error) {
        // Log the specific error to see if it's an API Key issue or Model issue
        console.error("Gemini Error Detail:", error.response ? JSON.stringify(error.response.data) : error.message);
        
        // Final fallback to gemini-pro (the original stable model)
        try {
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
            const fallbackRes = await axios.post(fallbackUrl, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            return fallbackRes.data.candidates[0].content.parts[0].text;
        } catch (fallbackError) {
            return "සමාවන්න, සර්වර් එකෙහි කාර්යබහුල තාවයක් පවතී. පසුව උත්සාහ කරන්න.";
        }
    }
}

// 3. The Main Logic (Auto-Response)
cmd({ on: "body" },
    async (conn, mek, m, { from, body, isCmd, isOwner, pushname, reply }) => {
        try {
            // පණිවිඩය Command එකක් නම්, මම යැවූ එකක් නම්, හෝ Bot Off කර ඇත්නම් නතර කරන්න
            if (isCmd || m.key.fromMe || !body || disabledChats.has(from)) return;

            // AI එක වැඩ කරන බව පෙන්වීමට Typing status
            await conn.sendPresenceUpdate('composing', from);

            // Gemini AI එකෙන් පිළිතුර ලබා ගැනීම
            const prompt = `${COMPANY_CONTEXT}\n\nUser (${pushname}): ${body}\nAI:`;
            const aiText = await getAIResponse(prompt);

            // WhatsApp හරහා පිළිතුර යැවීම
            await conn.sendMessage(from, { text: aiText }, { quoted: mek });

            // 4. AI එක වැඩේ අවසන් කළ බව හඳුනා ගැනීම (Trigger words)
            const triggerWords = ["සම්බන්ධ කර ගනු ඇත", "රැඳී සිටින්න", "contact you", "stay tuned"];
            const shouldDisable = triggerWords.some(word => aiText.toLowerCase().includes(word));

            if (shouldDisable) {
                // ඔබගේ (Admin) අංකයට Alert එකක් යැවීම
                const myNumber = conn.user.id.split(':')[0] + "@s.whatsapp.net";
                const adminMsg = `📢 *Ovnix Alert:* \n\nපාරිභෝගිකයෙක් (${pushname}) විස්තර ලබා දී ඇත.\nAI එක ඔවුන්ව දැනුවත් කර අවසන්.\n\nNumber: wa.me/${from.split('@')[0]}`;
                
                await conn.sendMessage(myNumber, { text: adminMsg });

                // මෙම Chat එක සඳහා Bot Disable කිරීම
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
