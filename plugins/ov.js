import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Gemini AI Setup
const genAI = new GoogleGenerativeAI("AIzaSyAfeTpfPr04kNmgDMcE6m1gxgtF4m2Fl1k");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Bot එක තාවකාලිකව Off කළ යුතු Chat IDs තබා ගැනීමට (Memory එකේ පවතී)
let disabledChats = new Set();

// 2. Ovnix Company Context (Training Data)
const COMPANY_CONTEXT = `
ඔබ "Ovnix AI" සහායකයා වේ. ඔබ ශ්‍රී ලංකාවේ "Ovnix" නම් වෙබ් සංවර්ධන ආයතනය නියෝජනය කරයි.
සේවාවන්: Web Design, Full-stack Dev, WhatsApp Bot Development.
මිල ගණන්: රු. 25,000 සිට ඉහළට.

වැදගත් උපදෙස්:
1. පාරිභෝගිකයා වෙබ් අඩවියක් සාදා ගැනීමට කැමැත්ත පළ කළහොත්, ඔවුන්ගේ නම සහ අවශ්‍යතාවය විමසන්න.
2. ඔවුන් විස්තර ලබා දුන් පසු, "ස්තූතියි! අපේ නියෝජිතයෙකු ඉතා ඉක්මනින් ඔබව සම්බන්ධ කර ගනු ඇත. එතෙක් කරුණාකර රැඳී සිටින්න." යනුවෙන් පවසා සංවාදය අවසන් කරන්න.
`;

// 3. The Main Body Command
cmd({ on: "body" },
    async (conn, mek, m, { from, body, isCmd, isOwner, pushname, reply }) => {
        try {
            // පණිවිඩය Command එකක් නම්, Bot ගෙන් ආ එකක් නම් හෝ මෙම Chat එකට Bot Off කර ඇත්නම් නතර කරන්න
            if (isCmd || m.key.fromMe || !body || disabledChats.has(from)) return;

            // AI එක Typing බව පෙන්වීම
            await conn.sendPresenceUpdate('composing', from);

            // AI එකෙන් Response එක ලබා ගැනීම
            const prompt = `${COMPANY_CONTEXT}\n\nUser (${pushname}): ${body}\nAI:`;
            const result = await model.generateContent(prompt);
            const aiText = result.response.text();

            // AI පිළිතුර යැවීම
            await conn.sendMessage(from, { text: aiText }, { quoted: mek });

            // 4. AI එක "සම්බන්ධ කර ගනු ඇත" හෝ "රැඳී සිටින්න" යනුවෙන් පැවසුවහොත් Bot Off කිරීම
            const triggerWords = ["සම්බන්ධ කර ගනු ඇත", "රැඳී සිටින්න", "contact you", "stay tuned"];
            const shouldDisable = triggerWords.some(word => aiText.toLowerCase().includes(word));

            if (shouldDisable) {
                // Admin (ඔබට) දැනුම්දීමක් යැවීම
                const adminMsg = `📢 *Ovnix Alert:* නව පාරිභෝගිකයෙක් (${pushname}) සම්බන්ධ වී ඇත. AI එක ඔවුන්ව දැනුවත් කර අවසන්. දැන් ඔබට මැදිහත් විය හැකියි. \n\nNumber: ${from.split('@')[0]}`;
                
                // මෙය ඔබේ අංකයට (Owner) යැවීමට සකසන්න
                await conn.sendMessage(conn.user.id, { text: adminMsg });

                // මෙම Chat එක සඳහා Bot Disable කිරීම
                disabledChats.add(from);
                console.log(`[SYSTEM] Bot disabled for: ${from}`);
            }

        } catch (e) {
            console.error("AI Error: ", e);
        }
    }
);

// 5. Admin හට නැවත Bot On කිරීමට Command එකක් (.bot on)
cmd({
    pattern: "bot-on",
    desc: "නැවත Chatbot ක්‍රියාත්මක කිරීමට",
    category: "owner",
    use: '.bot-on',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ මෙම Command එක භාවිතා කිරීමට ඔබට අවසර නැත.");
    
    if (disabledChats.has(from)) {
        disabledChats.delete(from);
        return reply("✅ මෙම Chat එක සඳහා Ovnix AI නැවත ක්‍රියාත්මක කරන ලදී.");
    } else {
        return reply("ℹ️ මෙම Chat එකේ දැනටමත් Bot සක්‍රියව පවතී.");
    }
});
